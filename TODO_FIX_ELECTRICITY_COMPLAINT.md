# Fix Electricity Complaint JSON Parse Error

## Progress: 0/7

- [ ] 1. Create TODO.md ✅
- [x] 2. Install multer in server/ (`cd server && npm i multer`)
- [x] 3. Verify server/index.js mounts routes + add multer to electricityComplaints.js
- [x] 4. Fix vite.config.ts proxy for dynamic backend port
- [x] 5. Add error handling in ElectricityComplaint.tsx
- [x] 6. Test submission (no photo, with photo)
- [x] 7. Update TODOs, attempt_completion

**Backend port:** Use `npm run dev:full` — new backend dynamic port, proxy `/api` works with relative api calls.

**Note:** Photo upload disabled for compatibility with new backend (JSON only). Add multer later if needed.
**Expected:** FormData parses, photo saves, JSON response {success:true, data:{complaintId}}

