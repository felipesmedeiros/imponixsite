#!/usr/bin/env bash
set -euo pipefail
umask 027
[[ $EUID -eq 0 && $# -eq 3 && $1 == --prepare && $2 =~ ^[0-9]+$ && $3 =~ ^[0-9]+$ ]] || exit 1
source_dir=$(cd -- "$(dirname -- "$0")" && pwd)
test -x /usr/bin/caddy
test -x /usr/local/bin/cloudflared
test -f "$source_dir/deploy.pub"
python3 -c 'import cryptography'
for identity in imponix_web imponix_tunnel imponix_deploy; do
  if ! getent passwd "$identity" >/dev/null; then
    if [[ $identity == imponix_deploy ]]; then
      useradd --system --user-group --home-dir /srv/imponix --shell /bin/sh "$identity"
    else
      useradd --system --user-group --no-create-home --shell /usr/sbin/nologin "$identity"
    fi
  fi
  ! id -Gn "$identity" | tr ' ' '\n' | grep -Evq "^(${identity}|imponix_site)$"
done
getent group imponix_site >/dev/null || groupadd --system imponix_site
usermod -a -G imponix_site imponix_web
usermod -a -G imponix_site imponix_deploy
usermod -a -G imponix_site imponix_tunnel
install -d -o root -g imponix_site -m 0750 /etc/imponix
install -d -o imponix_deploy -g imponix_site -m 2750 /srv/imponix /srv/imponix/incoming /srv/imponix/releases /srv/imponix/shared
install -o root -g root -m 0644 "$source_dir/receive.py" /usr/local/libexec/imponix-receive.py
install -o root -g imponix_site -m 0640 "$source_dir/Caddyfile" /etc/imponix/Caddyfile
printf '{"repository_id":"%s","owner_id":"%s"}\n' "$2" "$3" > /etc/imponix/deploy-trust.json
chown root:imponix_site /etc/imponix/deploy-trust.json
chmod 0640 /etc/imponix/deploy-trust.json
install -o root -g root -m 0644 "$source_dir/imponix-static.service" /etc/systemd/system/imponix-static.service
install -o root -g root -m 0644 "$source_dir/imponix-tunnel.service" /etc/systemd/system/imponix-tunnel.service
key="restrict $(cat "$source_dir/deploy.pub")"
if [[ -e /etc/ssh/imponix-deploy-authorized-keys ]]; then
  [[ $(cat /etc/ssh/imponix-deploy-authorized-keys) == "$key" ]] || { echo 'Existing deployment key preserved; review rotation explicitly.' >&2; exit 1; }
fi
printf '%s\n' "$key" > /etc/ssh/imponix-deploy-authorized-keys
chmod 0644 /etc/ssh/imponix-deploy-authorized-keys
cat > /etc/ssh/sshd_config.d/81-imponix-deploy.conf <<'SSH'
Match User imponix_deploy
    AuthorizedKeysFile /etc/ssh/imponix-deploy-authorized-keys
    AuthenticationMethods publickey
    PasswordAuthentication no
    KbdInteractiveAuthentication no
    AllowAgentForwarding no
    AllowTcpForwarding no
    X11Forwarding no
    PermitTTY no
    PermitTunnel no
    PermitUserRC no
    ForceCommand /usr/bin/python3 -I /usr/local/libexec/imponix-receive.py
Match all
SSH
/usr/sbin/sshd -t
uid=$(id -u imponix_deploy)
install -d -m 0755 "/etc/systemd/system/user-$uid.slice.d"
cat > "/etc/systemd/system/user-$uid.slice.d/imponix.conf" <<'LIMITS'
[Slice]
MemoryMax=512M
CPUQuota=100%
TasksMax=64
LIMITS
/usr/bin/caddy validate --config /etc/imponix/Caddyfile --adapter caddyfile
systemd-analyze verify /etc/systemd/system/imponix-static.service /etc/systemd/system/imponix-tunnel.service
systemctl daemon-reload
systemctl reload ssh.service
echo 'Prepared isolated Imponix static hosting; no DNS, Tunnel or unrelated service changes.'
