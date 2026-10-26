#!/bin/bash
# Install (or reinstall) the launchd job that publishes the AI token counter every hour.
# Uninstall: launchctl bootout gui/$(id -u)/com.griffinrutherford.ai-token-counter
#            rm ~/Library/LaunchAgents/com.griffinrutherford.ai-token-counter.plist
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
LABEL=com.griffinrutherford.ai-token-counter
DEST="$HOME/Library/LaunchAgents/$LABEL.plist"
LOG="$HOME/Library/Logs/ai-token-counter.log"
APP="$HOME/Library/Application Support/ai-token-counter"
mkdir -p "$HOME/Library/LaunchAgents" "$HOME/Library/Logs" "$APP"
# launchd jobs can't read ~/Documents (macOS privacy), so run a copy from Application Support.
# Re-run this script after editing export_tokens.py or extra_sources.json.
cp "$DIR/export_tokens.py" "$DIR/extra_sources.json" "$APP/"
sed -e "s|__SCRIPT__|$APP/export_tokens.py|" -e "s|__LOG__|$LOG|" "$DIR/$LABEL.plist" > "$DEST"
launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$DEST"
echo "installed $DEST (log: $LOG)"
