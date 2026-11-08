import base64
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import tarfile
import tempfile
import time
import unittest
from unittest.mock import patch
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from cryptography.hazmat.primitives import hashes

spec = importlib.util.spec_from_file_location('release_receiver', Path(__file__).resolve().parents[1] / 'deploy/public-vps/receive.py')
receiver = importlib.util.module_from_spec(spec)
spec.loader.exec_module(receiver)


class PublicReleaseTests(unittest.TestCase):
    def test_rejects_unsafe_and_private_paths(self):
        for name in ['../etc/passwd', '/site/index.html', 'site/../../etc/passwd', 'site/.env', 'site/observatory/history.json', 'site/api/private.json', 'site/key.pem', 'site/a.map', 'site\\x', 'worker/index.js']:
            with self.subTest(name=name), self.assertRaises(ValueError):
                receiver.safe_path(name)
        self.assertEqual(str(receiver.safe_path('site/games/noema.html')), 'site/games/noema.html')

    def test_signed_workflow_is_bound_to_repo_branch_commit_and_artifact(self):
        key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        number = key.public_key().public_numbers()
        encode = lambda value: base64.urlsafe_b64encode(value).decode().rstrip('=')
        integer = lambda value: encode(value.to_bytes((value.bit_length() + 7) // 8, 'big'))
        commit, digest = 'a' * 40, 'b' * 64
        now = int(time.time())
        claims = {'iss': 'https://token.actions.githubusercontent.com', 'aud': 'imponix-public-vps:' + digest, 'repository': receiver.REPOSITORY, 'repository_id': '123', 'ref': 'refs/heads/main', 'sub': 'repo:' + receiver.REPOSITORY + ':ref:refs/heads/main', 'sha': commit, 'workflow_ref': receiver.REPOSITORY + '/.github/workflows/public-vps.yml@refs/heads/main', 'nbf': now - 5, 'iat': now, 'exp': now + 300, 'event_name': 'push'}
        def token(values):
            body = encode(json.dumps({'alg': 'RS256', 'kid': 'test'}).encode()) + '.' + encode(json.dumps(values).encode())
            return body + '.' + encode(key.sign(body.encode(), padding.PKCS1v15(), hashes.SHA256()))
        def remote(url, headers=None):
            if 'jwks' in url:
                return {'keys': [{'kid': 'test', 'kty': 'RSA', 'n': integer(number.n), 'e': integer(number.e)}]}
            return {'object': {'sha': commit}}
        envelope = {'commit': commit, 'sha256': digest, 'token': token(claims)}
        with patch.object(receiver, 'remote_json', remote):
            self.assertEqual(receiver.verify_identity(envelope, {'repository_id': '123'}), commit)
            for change in [{'repository_id': '456'}, {'ref': 'refs/heads/other'}, {'sha': 'c' * 40}, {'aud': 'wrong'}, {'exp': now - 1}, {'event_name': 'pull_request'}]:
                with self.subTest(change=change), self.assertRaises(ValueError):
                    receiver.verify_identity({**envelope, 'token': token({**claims, **change})}, {'repository_id': '123'})
            with self.assertRaises(ValueError):
                receiver.verify_identity({**envelope, 'sha256': 'c' * 64}, {'repository_id': '123'})

    def test_archive_checks_integrity_and_rejects_links(self):
        with tempfile.TemporaryDirectory() as folder:
            folder = Path(folder)
            archive = folder / 'release.tgz'
            with tarfile.open(archive, 'w:gz') as bundle:
                entry = tarfile.TarInfo('site/link')
                entry.type, entry.linkname = tarfile.SYMTYPE, '/etc/passwd'
                bundle.addfile(entry)
            destination = folder / 'out'
            destination.mkdir()
            with self.assertRaises(ValueError):
                receiver.extract_checked(archive, destination, 'a' * 40)

    def test_failed_health_check_restores_previous_release(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            previous, candidate = root / 'previous-release', root / 'candidate'
            previous.mkdir()
            candidate.mkdir()
            (root / 'current').symlink_to(previous)
            with patch.object(receiver, 'ROOT', root), patch.object(receiver, 'remote_json', return_value={'commit': 'wrong'}):
                with self.assertRaises(ValueError):
                    receiver.activate(candidate, 'a' * 40)
            self.assertEqual((root / 'current').resolve(), previous)


if __name__ == '__main__':
    unittest.main()
