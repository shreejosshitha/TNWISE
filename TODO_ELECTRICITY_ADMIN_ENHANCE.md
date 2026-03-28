# Electricity Admin Sequential Workflow TODO

## Approved Backend Plan Steps

### Backend (electricityService.ts)
- [ ] Add TimelineStep interface
- [ ] updateApplicationStage(id, stage, verified) → timeline.push + status update
- [ ] createApplication → init timeline Step 1

### API (server.ts + electricityApi.ts)
- [ ] POST /api/admin/electricity/applications/:id/stage
- [ ] electricityApi.updateApplicationStage(id, stage)

### Admin Dashboard
- [ ] Applications → sequential buttons/modals
- [ ] Docs verify → site inspect → approve → install

### Frontend Tracker
- [ ] Dynamic timeline from app.timeline

**Progress: Starting Backend**
