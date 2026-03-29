# Backend Port Fix - Dynamic Port Resolution

## Steps Completed (1/12):
- [x] **1. Add dynamic port to src/backend/server.ts with fallback (3001 → 3002 → 3003)**
- [x] **2. Update vite.config.ts with /api proxy to localhost:${BACKEND_PORT:-3001}**
- [x] **3. Replace BASE_URL in src/app/services/electricityApi.ts to relative /api/electricity**
- [x] **4. Replace all hardcoded fetch in electricityApi.ts with relative paths**
- [x] **5. Update src/app/services/waterApi.ts BASE_URL to /api/water** (already /api/water)
- [x] **6. Fix src/app/services/websocket.ts to use relative /socket.io/ or dynamic**
- [ ] 7. Update src/app/pages/LoginPage.tsx auth fetches to relative /api/auth/*
- [ ] 8. Fix src/app/pages/electricity/ElectricityComplaint.tsx POST
- [ ] 9. Check/update other files with 3001 (via search)
- [ ] 10. Update package.json dev:full with VITE_BACKEND_PORT env
- [ ] 11. Test npm run dev:full - verify backend starts, APIs proxy
- [ ] 12. Test login, complaint, admin dashboard APIs

## Notes:
- Backend will log actual port used
- Frontend uses Vite proxy for /api → backend
- No more port conflicts

Run `npm run dev:full` after fixes.
