#!/usr/bin/env bash
set -euo pipefail

REGISTRY_URL="https://raw.githubusercontent.com/jbpin/sinux-skills/main/registry.json"
SKILLS_DIR="${HOME}/.claude/skills"

# ---------- helpers ----------

usage() {
  cat <<EOF
Usage: $0 <skill-name>

Install a Sinux Claude-Code skill from the marketplace.

Example:
  $0 sinux
EOF
  exit 1
}

die() {
  echo "ERROR: $1" >&2
  exit 1
}

# ---------- pre-flight checks ----------

if ! command -v curl >/dev/null 2>&1; then
  die "curl is required but not installed. Please install curl and try again."
fi

if ! command -v unzip >/dev/null 2>&1; then
  die "unzip is required but not installed. Please install unzip and try again."
fi

if [ $# -lt 1 ]; then
  usage
fi

SKILL_NAME="$1"

echo "=> Fetching skill registry..."
REGISTRY=$(curl -fsSL "$REGISTRY_URL") || die "Failed to fetch registry from $REGISTRY_URL"

# ---------- find skill in registry (no jq) ----------

# Extract the block for the requested skill name.
# We look for "name": "<skill>" and then grab the "url" field from the same object.
SKILL_BLOCK=$(echo "$REGISTRY" | tr '\n' ' ' | grep -oE '\{[^}]*"name"[[:space:]]*:[[:space:]]*"'"$SKILL_NAME"'"[^}]*\}') \
  || die "Skill '$SKILL_NAME' not found in registry."

SKILL_URL=$(echo "$SKILL_BLOCK" | sed -n 's/.*"url"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p') \
  || die "Could not extract URL for skill '$SKILL_NAME'."

if [ -z "$SKILL_URL" ]; then
  die "URL for skill '$SKILL_NAME' is empty."
fi

echo "=> Downloading $SKILL_NAME from $SKILL_URL ..."

TMPFILE=$(mktemp /tmp/sinux-skill-XXXXXX.zip)
trap 'rm -f "$TMPFILE"' EXIT

curl -fsSL -o "$TMPFILE" "$SKILL_URL" || die "Failed to download skill from $SKILL_URL"

# ---------- install ----------

DEST="${SKILLS_DIR}/${SKILL_NAME}"
mkdir -p "$DEST"

echo "=> Extracting to $DEST ..."
unzip -o -q "$TMPFILE" -d "$DEST" || die "Failed to extract skill archive."

echo ""
echo "Skill '$SKILL_NAME' installed successfully to $DEST"
echo "Restart Claude Code (or open a new conversation) to pick it up."
