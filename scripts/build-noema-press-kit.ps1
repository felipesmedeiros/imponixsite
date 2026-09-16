# Rebuild the press ZIP using only the curated website assets.
$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$assetRoot = Join-Path $repoRoot 'public/games/noema'
$members = @(
  'NOEMA-factsheet.txt',
  'NOEMA-descriptions.txt',
  'library-logo.png',
  'icon.png',
  'main-capsule.png',
  'press/README.txt',
  'press/01-record-reconciliation.png',
  'press/02-signal-terminal.png',
  'press/03-encoded-message.png',
  'press/04-package-archive.png',
  'press/05-signal-interference.png'
)
$sources = @($members | ForEach-Object {
  $source = Join-Path $assetRoot $_
  if (-not (Test-Path -LiteralPath $source -PathType Leaf)) {
    throw "Missing press asset: $source"
  }
  $source
})
$archive = Join-Path $assetRoot 'noema-press-kit.zip'
Compress-Archive -LiteralPath $sources -DestinationPath $archive -CompressionLevel Optimal -Force
$zip = Get-Item -LiteralPath $archive
# Keep the archive under the static asset limit for the existing deployment.
if ($zip.Length -ge 25MB) { throw 'Press kit exceeds 25 MiB; use download hosting before deploying.' }
Write-Output ("NOEMA press kit: {0:N2} MiB, {1} files" -f ($zip.Length / 1MB), $sources.Count)
