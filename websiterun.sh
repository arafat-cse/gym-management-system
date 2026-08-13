#!/usr/bin/env bash
cd "$(dirname "$0")/website" || exit 1
npm run dev -- -p 3001
