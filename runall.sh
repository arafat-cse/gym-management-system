#!/usr/bin/env bash
cd "$(dirname "$0")" || exit 1

pids=()
cleanup() {
  echo ""
  echo "Stopping all servers..."
  kill "${pids[@]}" 2>/dev/null
  wait 2>/dev/null
}
trap cleanup INT TERM

./backendrun.sh &
pids+=($!)

./frontendrun.sh &
pids+=($!)

./websiterun.sh &
pids+=($!)

echo "Backend:  http://127.0.0.1:8000"
echo "Frontend: http://127.0.0.1:3000"
echo "Website:  http://127.0.0.1:3001"
echo "Press Ctrl+C to stop all."

wait
