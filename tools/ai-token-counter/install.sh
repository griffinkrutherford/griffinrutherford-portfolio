#!/bin/bash
# Install (or reinstall) the launchd job that publishes the AI token counter every hour.
# Uninstall: launchctl bootout gui/$(id -u)/com.griffinrutherford.ai-token-counter
#            rm ~/Library/LaunchAgents/com.griffinrutherford.ai-token-counter.plist
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
LABEL=com.griffinrutherford.ai-token-counter
DEST="$HOME/Library/LaunchAgents/$LABEL.plist"
LOG="$HOME/Library/Logs/ai-token-counter.log"
mkdir -p "$HOME/Library/LaunchAgents" "$HOME/Library/Logs"
sed -e "s|__SCRIPT__|$DIR/export_tokens.py|" -e "s|__LOG__|$LOG|" "$DIR/$LABEL.plist" > "$DEST"
launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$DEST"
echo "installed $DEST (log: $LOG)"
