#!/usr/bin/python3
"""Receive only signed public-site releases; never execute uploaded code."""
import base64
import fcntl
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import sys
import tarfile
import tempfile
import time
import urllib.request
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from cryptography.hazmat.primitives import hashes

ROOT = Path('/srv/imponix')
REPOSITORY = 'felipesmedeiros/imponixsite'
MAX_ARCHIVE = 450 * 1024 * 1024
MAX_CONTENT = 768 * 1024 * 1024


def remote_json(url, headers=None):
    request = urllib.request.Request(url, headers={'User-Agent': 'Imponix-Release', **(headers or {})})
    with urllib.request.urlopen(request, timeout=20) as response:
        return json.loads(response.read(2 * 1024 * 1024))


def decode64(value):
    return base64.urlsafe_b64decode(value + '=' * (-len(value) % 4))


def verify_identity(request, trust):
    commit, digest = request.get('commit', ''), request.get('sha256', '')
    if not re.fullmatch('[a-f0-9]{40}', commit) or not re.fullmatch('[a-f0-9]{64}', digest):
        raise ValueError('Invalid release identity')
    token = request.get('token', '')
    if not isinstance(token, str) or len(token) > 24000:
        raise ValueError('Invalid identity token')
    parts = token.split('.')
    if len(parts) != 3:
        raise ValueError('Invalid identity token')
    header, claims = (json.loads(decode64(part)) for part in parts[:2])
    if header.get('alg') != 'RS256' or not isinstance(header.get('kid'), str):
        raise ValueError('Invalid identity algorithm')
    jwks = remote_json('https://token.actions.githubusercontent.com/.well-known/jwks')
    key = next((key for key in jwks['keys'] if key.get('kid') == header['kid'] and key.get('kty') == 'RSA'), None)
    if key is None:
        raise ValueError('Unknown identity key')
    public_key = rsa.RSAPublicNumbers(int.from_bytes(decode64(key['e']), 'big'), int.from_bytes(decode64(key['n']), 'big')).public_key()
    public_key.verify(decode64(parts[2]), (parts[0] + '.' + parts[1]).encode(), padding.PKCS1v15(), hashes.SHA256())
    expected = {
        'iss': 'https://token.actions.githubusercontent.com',
        'aud': 'imponix-public-vps:' + digest,
        'repository': REPOSITORY,
        'repository_id': str(trust['repository_id']),
        'repository_owner_id': str(trust['owner_id']),
        'ref': 'refs/heads/main',
        'sub': 'repo:' + REPOSITORY.split('/')[0] + '@' + str(trust['owner_id']) + '/' + REPOSITORY.split('/')[1] + '@' + str(trust['repository_id']) + ':ref:refs/heads/main',
        'sha': commit,
        'workflow_ref': REPOSITORY + '/.github/workflows/public-vps.yml@refs/heads/main',
    }
    mismatches = [key for key, value in expected.items() if claims.get(key) != value]
    if mismatches:
        raise ValueError('Identity is not the authorized main workflow: ' + ', '.join(mismatches))
    now = time.time()
    if not all(isinstance(claims.get(key), (int, float)) for key in ['nbf', 'exp', 'iat']):
        raise ValueError('Missing token validity')
    if claims['nbf'] > now + 30 or claims['exp'] < now or not now - 600 <= claims['iat'] <= now + 30:
        raise ValueError('Identity token expired or not valid yet')
    if claims.get('event_name') not in ['push', 'workflow_dispatch']:
        raise ValueError('Unsupported workflow event')
    latest = remote_json('https://api.github.com/repos/' + REPOSITORY + '/git/ref/heads/main')
    if latest.get('object', {}).get('sha') != commit:
        raise ValueError('Release has been superseded by a newer main commit')
    return commit


def safe_path(name):
    path = PurePosixPath(name)
    if '\\' in name or path.is_absolute() or '..' in path.parts or any(part.startswith('.') for part in path.parts):
        raise ValueError('Unsafe archive path')
    if str(path) == 'release.json':
        return path
    if len(path.parts) < 2 or path.parts[0] != 'site':
        raise ValueError('Only public site files are accepted')
    if path.parts[1] in ['observatory', 'api'] or path.suffix.lower() in ['.map', '.pem', '.key']:
        raise ValueError('Private file in public artifact')
    return path


def extract_checked(archive, destination, commit):
    seen, total = set(), 0
    with tarfile.open(archive, 'r|gz') as bundle:
        for count, member in enumerate(bundle, 1):
            if count > 5000:
                raise ValueError('Too many archive entries')
            if member.isdir():
                if member.name.rstrip('/') != 'site':
                    safe_path(member.name.rstrip('/'))
                continue
            if not member.isfile() or member.size > 64 * 1024 * 1024:
                raise ValueError('Only bounded regular files are accepted')
            path = safe_path(member.name)
            if str(path) == 'release.json' and member.size > 2 * 1024 * 1024:
                raise ValueError('Release manifest exceeds the size budget')
            if str(path) in seen:
                raise ValueError('Duplicate archive entry')
            seen.add(str(path))
            total += member.size
            if total > MAX_CONTENT:
                raise ValueError('Release exceeds the content budget')
            target = destination.joinpath(*path.parts)
            target.parent.mkdir(parents=True, exist_ok=True, mode=0o750)
            with bundle.extractfile(member) as source, target.open('xb') as output:
                shutil.copyfileobj(source, output)
            target.chmod(0o640)
    manifest = json.loads((destination / 'release.json').read_text())
    if manifest.get('version') != 1 or manifest.get('commit') != commit or not isinstance(manifest.get('files'), dict):
        raise ValueError('Release manifest identity mismatch')
    files = manifest['files']
    if set('site/' + name for name in files) != seen - {'release.json'}:
        raise ValueError('Release manifest does not match the archive')
    for name, expected in files.items():
        path = safe_path('site/' + name)
        content = destination.joinpath(*path.parts).read_bytes()
        if expected != {'size': len(content), 'sha256': hashlib.sha256(content).hexdigest()}:
            raise ValueError('Public file integrity mismatch')
    required = ['index.html', 'index.rsc', '404.html', 'robots.txt', 'sitemap.xml', 'version.json', 'journal/photoncytosis-demo-muchi-2026.html', 'journal/noema-photoncytosis-demo-update.html']
    if any(name not in files for name in required):
        raise ValueError('Incomplete public website')
    if json.loads((destination / 'site/version.json').read_text()).get('commit') != commit:
        raise ValueError('Public version mismatch')
    return manifest


def switch_current(target):
    temporary = ROOT / ('current-next-' + str(os.getpid()))
    temporary.symlink_to(target)
    temporary.replace(ROOT / 'current')


def activate(release, commit):
    old = (ROOT / 'current').resolve() if (ROOT / 'current').exists() else None
    # Keep content-hashed chunks from previous versions available to open tabs.
    chunks = release / 'site/_next/static'
    if chunks.exists():
        shutil.copytree(chunks, ROOT / 'shared/_next/static', dirs_exist_ok=True)
    switch_current(release)
    try:
        version = remote_json('http://127.0.0.1:8081/version.json')
        if version.get('commit') != commit:
            raise ValueError('Static server returned the wrong version')
        for path in ['/', '/games/noema', '/journal/photoncytosis-demo-muchi-2026', '/journal/noema-photoncytosis-demo-update']:
            with urllib.request.urlopen('http://127.0.0.1:8081' + path, timeout=10) as response:
                if response.status != 200 or b'<title>' not in response.read():
                    raise ValueError('Static page verification failed')
        request = urllib.request.Request('http://127.0.0.1:8081/games/noema', headers={'RSC': '1'})
        with urllib.request.urlopen(request, timeout=10) as response:
            prefix = response.read(100)
            if 'text/x-component' not in response.headers.get('Content-Type', '') or not prefix or prefix.lower().startswith(b'<!doctype'):
                raise ValueError('Static navigation verification failed')
    except Exception:
        if old:
            switch_current(old)
        else:
            (ROOT / 'current').unlink(missing_ok=True)
        raise
    if old and old != release:
        temporary = ROOT / 'previous-next'
        temporary.unlink(missing_ok=True)
        temporary.symlink_to(old)
        temporary.replace(ROOT / 'previous')
    (ROOT / 'last-release.json').write_text(json.dumps({'commit': commit, 'published_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}) + '\n')
    # Source and assets remain recoverable from Git; retain five built releases.
    published = sorted((path for path in (ROOT / 'releases').iterdir() if path.is_dir() and not path.is_symlink() and re.fullmatch('[a-f0-9]{40}-[a-f0-9]{12}', path.name)), key=lambda path: path.stat().st_mtime, reverse=True)
    protected = {release.resolve(), old}
    for path in published[5:]:
        if path.resolve() not in protected and path.resolve().parent == (ROOT / 'releases').resolve():
            shutil.rmtree(path)


def main():
    if os.environ.get('SSH_ORIGINAL_COMMAND') != 'publish':
        raise ValueError('Only the fixed publish command is accepted')
    os.umask(0o027)
    with (ROOT / '.publish.lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        line = sys.stdin.buffer.readline(32769)
        if len(line) > 32768 or not line.endswith(b'\n'):
            raise ValueError('Invalid publication envelope')
        request = json.loads(line)
        trust = json.loads(Path('/etc/imponix/deploy-trust.json').read_text())
        commit = verify_identity(request, trust)
        with tempfile.TemporaryDirectory(prefix='incoming-', dir=ROOT / 'incoming') as folder:
            archive, size, digest = Path(folder) / 'site.tgz', 0, hashlib.sha256()
            with archive.open('xb') as output:
                while chunk := sys.stdin.buffer.read(1024 * 1024):
                    size += len(chunk)
                    if size > MAX_ARCHIVE:
                        raise ValueError('Archive exceeds the transport budget')
                    digest.update(chunk)
                    output.write(chunk)
            if digest.hexdigest() != request['sha256']:
                raise ValueError('Archive digest mismatch')
            candidate = Path(folder) / 'release'
            candidate.mkdir(mode=0o750)
            manifest = extract_checked(archive, candidate, commit)
            release = ROOT / 'releases' / (commit + '-' + request['sha256'][:12])
            if release.exists():
                if (release / 'release.json').read_bytes() != (candidate / 'release.json').read_bytes():
                    raise ValueError('Existing release does not match')
            else:
                candidate.rename(release)
            activate(release, commit)
            print(json.dumps({'published': True, 'commit': commit, 'files': len(manifest['files']), 'observatory': 'unchanged'}))


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        # Never include the incoming envelope or token in errors/logs.
        print(json.dumps({'published': False, 'reason': str(error)[:180]}), file=sys.stderr)
        sys.exit(1)
