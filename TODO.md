# Remove Duplicate Headers - Progress Tracker

## Plan Overview
Remove redundant page-specific `<Header />` imports/renders from citizen and admin pages. Keep single Header from RootLayout.tsx.

## Steps (0/21 complete)

### Phase 1: Key Admin Pages (0/4)
- [x] 1. src/app/pages/admin/ElectricityAdminDashboard.tsx (remove import + <Header />)
- [x] 2. src/app/pages/admin/MunicipalAdminDashboard.tsx (remove import + <Header />)
- [x] 3. src/app/pages/admin/WaterAdminDashboard.tsx (remove <Header /> render)
- [x] 4. src/app/pages/UserDashboard.tsx (remove import + <Header />)

### Phase 2: Municipal Pages (4/4) ✅

- [x] 5. src/app/pages/municipal/MunicipalHome.tsx
- [x] 6. src/app/pages/municipal/MunicipalComplaint.tsx  
- [x] 7. src/app/pages/municipal/MunicipalTracking.tsx
- [x] 8. src/app/pages/municipal/PropertyTax.tsx

### Phase 3: Water & Electricity Subpages (0/8)
- [ ] 9-12. src/app/pages/water/* (.tsx files with Header)
- [ ] 13-16. src/app/pages/electricity/* (.tsx files with Header)

### Phase 4: Other Pages (0/5)
- [ ] 17. src/app/pages/admin/AdminProfile.tsx
- [ ] 18. src/app/pages/admin/MunicipalComplaintDetails.tsx
- [ ] 19. src/app/pages/ProfilePage.tsx
- [ ] 20. Others from search (AdminDashboard, etc.)

### Phase 5: Verification (0/3)
- [ ] 21. Test: `npm run dev`, check single Header, nav works
- [ ] 22. Lint: `npm run lint` 
- [ ] 23. Complete task

**Next:** Edit ElectricityAdminDashboard.tsx (visible file)

