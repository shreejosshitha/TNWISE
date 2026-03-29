# WebSocket Timeout Fix - Complete Dynamic Port Resolution

## TODO Steps (3/6 completed):

- [x] **1. Update vite.config.ts** - Add `/socket.io` proxy to `${VITE_BACKEND_PORT:-3001}` matching `/api`
- [x] **2. Fix src/app/services/electricityApi.ts** - Replace hardcoded `http://localhost:3001` URLs with relative `/api/`
- [x] **3. Improve src/app/services/websocket.ts** - Increase timeout to 30s, better reconnect logic, use env port fallback
- [x] **4. Update src/backend/server.ts** - Add `/health/port` endpoint exposing actual port, improve WS logging
 - [x] **5. Update package.json** - Set `VITE_BACKEND_PORT=3001` in `dev:full` script via cross-env/concurrently
- [x] **6. Test** - Run `npm run dev:full`, check console no timeouts, test admin dashboard real-time updates

✅ **WebSocket timeout fix complete!**

## After Completion:
```
npm run dev:full
```
- Backend logs port (e.g. `🚀 Electricity Backend running on http://localhost:3001`)
- Frontend console: `🔴 Connected to WebSocket server` (not error)
- No more `WebSocket connection error: timeout`
- Admin updates propagate real-time

## Notes:
- Uses Vite proxy for simplicity (no client port detection needed)
- Fallback if dynamic port fails
- Updates TODO_BACKEND_PORT_FIX.md step 6
