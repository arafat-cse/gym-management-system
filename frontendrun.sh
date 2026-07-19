#!/usr/bin/env bash
cd "$(dirname "$0")/app/frontend" || exit 1
npm run dev -- -p 3000
