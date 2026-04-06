#!/usr/bin/env bash

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

info()    { echo -e "${CYAN}${BOLD}[INFO]${RESET}  $*"; }
success() { echo -e "${GREEN}${BOLD}[OK]${RESET}    $*"; }
warn()    { echo -e "${YELLOW}${BOLD}[WARN]${RESET}  $*"; }
error()   { echo -e "${RED}${BOLD}[ERROR]${RESET} $*" >&2; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

PIDS=()
cleanup() {
  if [ ${#PIDS[@]} -gt 0 ]; then
    echo ""
    warn "Shutting down dev servers…"
    for pid in "${PIDS[@]}"; do
      kill "$pid" 2>/dev/null || true
    done
  fi
}
trap cleanup EXIT INT TERM

check_node() {
  info "Checking Node.js…"

  if ! command -v node &>/dev/null; then
    error "Node.js is not installed."
    error "Install it from https://nodejs.org (recommended: v22 LTS)"
    exit 1
  fi

  NODE_VERSION=$(node --version)
  NODE_MAJOR=$(echo "$NODE_VERSION" | sed 's/v//' | cut -d. -f1)

  if [ "$NODE_MAJOR" -lt 18 ]; then
    warn "Node.js $NODE_VERSION detected — v18+ recommended (project uses v22)."
  else
    success "Node.js $NODE_VERSION"
  fi

  if ! command -v npm &>/dev/null; then
    error "npm is not installed. It usually ships with Node.js."
    exit 1
  fi

  success "npm $(npm --version)"
}


install_deps() {
  info "Installing backend dependencies…"
  (cd "$BACKEND_DIR" && npm install)
  success "Backend dependencies installed."

  info "Installing frontend dependencies…"
  (cd "$FRONTEND_DIR" && npm install)
  success "Frontend dependencies installed."
}

start_servers() {
  info "Starting backend  → http://localhost:4000"
  (cd "$BACKEND_DIR" && npm run dev) &
  PIDS+=($!)

  info "Starting frontend → http://localhost:5173"
  (cd "$FRONTEND_DIR" && npm run dev) &
  PIDS+=($!)

  echo ""
  success "Both servers are running. Press ${BOLD}Ctrl+C${RESET}${GREEN} to stop.${RESET}"
  echo ""

  wait
}

echo ""
echo -e "${BOLD}${CYAN}🎭  Puppet — Dev Launcher${RESET}"
echo "────────────────────────────────────"

check_node
install_deps
start_servers
