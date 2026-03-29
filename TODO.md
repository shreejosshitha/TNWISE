# ✅ Fix Water Citizen 404 Issue - COMPLETE

**Status:** ✅ COMPLETE

## Analysis
- Error: `Cannot destructure property 'basename' of context as it is null` in Link
- Cause: Wrong import `from "react-router"` instead of `"react-router-dom"` in water pages
- Effect: Link fails -> component throws -> ErrorBoundary -> NotFound (404)
- Electricity works (correct imports)

## Steps

### 1. [DONE] Created this TODO.md
### 2. Fix imports in all src/app/pages/water/*.tsx files
  - Find: `import .* from "react-router"`
  - Replace: `from "react-router-dom"`
### 3. Test navigation
  - Visit /water
  - Click 'Pay Water Tax' -> /water/bill-payment
  - Click 'Raise Complaint' -> /water/complaint
  - Check console for errors
### 4. Verify other water pages (new-connection, tracking, calculator, transparency)
### 5. Check auth flow (localStorage 'authUser') - optional protection restore
### 6. [ ] Complete - attempt_completion

**Quick test command:** Open browser dev console, navigate to water page, check if error gone.
**Run:** `npm run dev` if not running.

