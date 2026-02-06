# 🚀 Sprint 4 Guide - Squad Gajah Mada

**Squad:** Gajah Mada (Shared Infrastructure)  
**Member:** Muhammad Irfan Dzaky  
**Focus:** Testing & Deployment to Staging

---

## 📌 Overview

Sprint 4 adalah **verification dan testing sprint**. Tidak ada implementasi fitur baru. Tugasmu adalah:

1. ✅ **Push changes** dari Sprint 2 & 3 ke staging environment
2. ✅ **Test API endpoints** yang sudah kamu buat
3. ✅ **Verify** semua acceptance criteria terpenuhi
4. ✅ **Document** hasil testing

---

## 🎯 Tanggung Jawab Squad Gajah Mada

Dari Sprint4.md, tanggung jawab kamu adalah:

### Primary Tasks (Sudah Selesai di Sprint 2 & 3):
- ✅ API Contract (Swagger) for Create Transaction endpoint
- ✅ POST /transactions endpoint with input validation
- ✅ InternalApiGuard for service-to-service authentication (Sprint 3)
- ✅ @Internal() decorator (Sprint 3)

### Sprint 4 Tasks (Testing & Deployment):
- 🔄 Deploy ke staging environment
- 🔄 Test POST /transactions API endpoint
- 🔄 Verify Swagger documentation
- 🔄 Test input validation (missing fields, invalid formats)
- 🔄 Document test results

### ❌ BUKAN Tanggung Jawab Kamu:
- ❌ Idempotency (itu tugas GAJAH DUDUK)
- ❌ Distributed Tracing (itu tugas GAJAH DUDUK)
- ❌ Midtrans Integration (itu tugas SEMUT MERAH & SEMUT HITAM)
- ❌ Throttler Guard (itu tugas squad lain di Sprint 3)

---

## 📦 Files yang Menjadi Tanggung Jawabmu

### Sprint 2 - Transaction Endpoint:
```
✅ libs/domain/transactions/src/lib/transaction.entities.ts
✅ libs/domain/transactions/src/lib/ports/repository.port.ts
✅ libs/domain/transactions/src/lib/dto/create-transaction.dto.ts
✅ libs/domain/transactions/src/lib/dto/create-transaction-response.dto.ts
✅ libs/infrastructure/database/src/lib/models/transaction.model.ts
✅ libs/infrastructure/database/src/lib/repositories/transaction.repository.ts
✅ libs/application/transactions/src/lib/use-cases/create-transaction.use-case.ts
✅ apps/transactions-service/src/app/transactions.controller.ts
```

### Sprint 3 - Internal API Guard:
```
✅ libs/infrastructure/shared/src/guards/internal-api.guard.ts
✅ libs/infrastructure/shared/src/decorators/internal.decorator.ts
✅ libs/infrastructure/shared/src/README.md
✅ libs/infrastructure/shared/src/index.ts
✅ tsconfig.base.json
```

---

## 🔗 Dependencies dari Squad Lain

⚠️ **PENTING:** Test kamu hanya butuh 2 dependencies (minimal):

### 1. **Database PostgreSQL** (Infrastructure/DevOps)
**Dependency:** PostgreSQL database harus running di staging

**Impact pada test kamu:**
- ✅ ALL test cases (transaction harus bisa disimpan ke database)
- ❌ Jika database belum setup, semua test akan gagal

**Action Required:**
- [ ] Verify database connection di staging
- [ ] Test database connection: `curl https://vi-backend.tiketq.com/api/health`
- [ ] Expected: HTTP 200 {"status": "ok"}

**Jika health check gagal:**
- 🔴 STOP testing
- 📞 Hubungi DevOps/Mentor untuk setup database staging

---

### 2. **Squad Kucing Oyen** (Flight Service) - OPTIONAL
**Dependency:** Flight Service untuk validasi flight ID (OPTIONAL - bisa ditest tanpa ini)

**Impact pada test kamu:**
- ✅ Test Case "Invalid Flight ID" akan lebih lengkap jika Flight Service ready
- ⚠️ Jika belum ready, test tetap bisa jalan (hanya tidak bisa verify "flight not found" error)

**Action Required (OPTIONAL):**
- [ ] Tanyakan: "Apakah Flight Service sudah di-staging?"
- [ ] Jika sudah: Minta contoh valid flight ID untuk testing
- [ ] Jika belum: Lanjut testing, document bahwa flight validation belum ada

**Catatan:** Kamu bisa test TANPA Flight Service. Flight ID validation adalah bonus test, bukan blocker.

---

### ❌ TIDAK PERLU Hubungi Squad Ini:

**Squad Semut Hitam / Gajah Duduk (Idempotency):**
- ❌ Idempotency BUKAN tanggung jawab kamu
- ❌ Test kamu tidak butuh idempotency key
- ❌ Jangan test idempotency (itu tugas GAJAH DUDUK)

**Squad Semut Merah (Midtrans Callbacks):**
- ❌ Payment webhooks bukan tanggung jawab kamu
- ❌ Test kamu hanya sampai create transaction (status PENDING)

**Bottom line:** Kamu hanya perlu database running. Flight Service optional untuk bonus test.

---

## 📋 Step-by-Step Execution Guide

### **PHASE 1: Pre-Deployment Preparation**

#### Step 1.1: Verify Local Code (Before Push)

```bash
# 1. Pastikan di branch develop
git checkout develop
git pull origin develop

# 2. Check status - pastikan tidak ada uncommitted changes
git status

# 3. Build locally untuk test
npm run build

# 4. Verify tidak ada error
# Expected: "Build succeeded"
```

**Checklist:**
- [ ] No compilation errors
- [ ] No TypeScript errors
- [ ] Build succeeds locally

---

#### Step 1.2: Review Changes yang Akan Di-Deploy

```bash
# Compare dengan staging branch
git diff origin/staging...HEAD

# Lihat files yang akan di-deploy
git diff origin/staging...HEAD --name-only

# Lihat commits yang akan masuk
git log origin/staging..HEAD --oneline
```

**Checklist:**
- [ ] Review semua file changes
- [ ] Pastikan HANYA files tanggung jawabmu yang ada
- [ ] Tidak ada file dari squad lain
- [ ] Tidak ada file `SPRINT3-BREAKDOWN.md` (untracked, local only)

---

#### Step 1.3: Verify Database Staging Ready

**⚠️ CRITICAL STEP - Database harus running!**

```bash
# Test database connection via health endpoint
curl https://vi-backend.tiketq.com/api/health

# Expected: HTTP 200
# {"status": "ok"}
```

**Checklist:**
- [ ] Health check returns HTTP 200
- [ ] Response: `{"status": "ok"}`

**Jika health check gagal (HTTP 500 atau connection error):**
- 🔴 **STOP** - Database belum ready
- 📞 Hubungi DevOps/Mentor
- 📝 Document blocker: "Database staging not accessible"
- ⏸️ Tunggu database setup selesai

**Optional - Flight Service Check:**
```bash
# Cek apakah Flight Service sudah deploy (optional)
curl https://vi-backend.tiketq.com/api/flights/health

# Jika 200: Flight Service ready (bonus untuk test flight validation)
# Jika 404/500: Flight Service belum ready (OK, test tetap jalan)
```

**Catatan:** Kamu bisa lanjut testing TANPA Flight Service. Flight validation adalah bonus test.

---

### **PHASE 2: Deployment to Staging**

#### Step 2.1: Create Pull Request

**Option A: GitHub Web UI** (Recommended)

1. Go to: https://github.com/ini-tiket-q/BE-Nest
2. Click "Pull requests" → "New pull request"
3. Set base: `staging`, compare: `develop`
4. Click "Create pull request"

**PR Title:**
```
Squad Gajah Mada: Deploy to Staging - Transaction API & Internal API Guard
```

**PR Description Template:**
```markdown
## Summary
Deploy Sprint 2 & Sprint 3 work dari Squad Gajah Mada ke staging environment.

### Sprint 2: Transaction API Endpoint
- [x] Transaction entities dan DTOs
- [x] Transaction repository (Hexagonal architecture)
- [x] Create Transaction use case
- [x] POST /transactions controller
- [x] Input validation dengan class-validator
- [x] Swagger documentation

### Sprint 3: Internal API Security
- [x] InternalApiGuard implementation
- [x] @Internal() decorator
- [x] Shared infrastructure exports
- [x] README documentation

## Files Changed
**Domain Layer:**
- `libs/domain/transactions/src/lib/transaction.entities.ts`
- `libs/domain/transactions/src/lib/ports/repository.port.ts`
- `libs/domain/transactions/src/lib/dto/create-transaction.dto.ts`
- `libs/domain/transactions/src/lib/dto/create-transaction-response.dto.ts`

**Infrastructure Layer:**
- `libs/infrastructure/database/src/lib/models/transaction.model.ts`
- `libs/infrastructure/database/src/lib/repositories/transaction.repository.ts`
- `libs/infrastructure/shared/src/guards/internal-api.guard.ts`
- `libs/infrastructure/shared/src/decorators/internal.decorator.ts`
- `libs/infrastructure/shared/src/README.md`

**Application Layer:**
- `libs/application/transactions/src/lib/use-cases/create-transaction.use-case.ts`

**Presentation Layer:**
- `apps/transactions-service/src/app/transactions.controller.ts`

**Configuration:**
- `tsconfig.base.json` (@tiketq-be/shared path alias)

## Testing Plan
Will test the following on staging:
1. ✅ Swagger documentation accessible
2. ✅ POST /transactions with valid input
3. ✅ Input validation for missing fields
4. ✅ Input validation for invalid email
5. ✅ Input validation for invalid flight ID
6. ✅ InternalApiGuard authentication

## Dependencies
- Database must be running on staging
- (Optional) Flight Service for flight ID validation testing

## Reviewers
@mentor-name @teammate-name
```

**Checklist:**
- [ ] PR created
- [ ] Title follows format
- [ ] Description complete
- [ ] Reviewers tagged

---

#### Step 2.2: Verify CI/CD Pipeline

After creating PR, GitHub Actions akan run automatically.

**Check:**
1. Go to PR → "Checks" tab
2. Verify all checks pass:
   - ✅ Build succeeds
   - ✅ Tests pass (if implemented)
   - ✅ Linting passes
   - ✅ No security vulnerabilities

**If checks fail:**
```bash
# View error in GitHub Actions logs
# Fix locally
git add .
git commit -m "fix: resolve CI/CD issue"
git push origin develop

# PR will auto-update and re-run checks
```

**Checklist:**
- [ ] All CI/CD checks pass
- [ ] Build succeeds
- [ ] No errors in logs

---

#### Step 2.3: Wait for Deployment

Once PR is **merged** to `staging` branch:
- CI/CD akan auto-deploy ke staging environment
- Check deployment status di GitHub Actions

**Verify deployment:**
```bash
# Test health endpoint
curl https://vi-backend.tiketq.com/api/health

# Expected: HTTP 200, {"status": "ok"}
```

**Checklist:**
- [ ] PR merged to staging
- [ ] Deployment completed
- [ ] Health check returns 200

---

### **PHASE 3: Testing on Staging**

#### Step 3.1: Test Swagger Documentation

**Test Case 1: Swagger UI Accessible**

```bash
# Open browser
open https://vi-backend.tiketq.com/api/docs
```

**Expected Result:**
- ✅ Swagger UI loads successfully
- ✅ POST /transactions endpoint documented
- ✅ Request schema shows all required fields
- ✅ Response schema documented
- ✅ Example payloads visible

**Verification Checklist:**
- [ ] Swagger UI accessible
- [ ] POST /transactions endpoint visible
- [ ] Request body schema documented:
  - [ ] `flightId` (string, required)
  - [ ] `passengerName` (string, required)
  - [ ] `passengerEmail` (string, required, email format)
  - [ ] `amount` (number, required)
  - [ ] `phoneNumber` (string, required)
- [ ] Response schema documented:
  - [ Database running on staging (verified in Step 1.3)

```bash
# Create transaction with valid input
curl -X POST https://vi-backend.tiketq.com/api/transactions \
  -H "Content-Type: application/json
- [ ] Capture screenshot of Swagger UI
- [ ] Save as: `test-results/swagger-ui.png`

---

#### Step 3.2: Test Valid Transaction Creation

**Test Case 2: Valid Input - Create Transaction**

**Prerequisites:**
- [ ] Idempotency key middleware deployed (Squad Semut Hitam)
- [ ] Database running on staging

```bash
# Create transaction with valid input
curl -X POST https://vi-backend.tiketq.com/api/transactions \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: test-gajah-mada-001" \
  -d '{
    "flightId": "FLIGHT-001",
    "passengerName": "Test Gajah Mada",
    "passengerEmail": "gajah-mada@test.com",
    "amount": 750000,
    "phoneNumber": "628123456789"
  }' | jq
```

**Expected Result:**
```json
{
  "id": "uuid-generated",
  "status": "PENDING",
  "amount": 750000,
  "currency": "IDR",
  "bookingId": "booking-uuid",
  "customerInfo": {
    "name": "Test Gajah Mada",
    "email": "gajah-mada@test.com",
    "phone": "628123456789"
  },
  "createdAt": "2026-01-27T...",
  "updatedAt": "2026-01-27T..."
}
```

**HTTP Status:** 201 Created

**Verification Checklist:**
- [ ] HTTP Status: 201 Created
- [ ] Response body contains transaction ID (UUID format)
- [ ] Response status is "PENDING"
- [ ] Amount matches request (750000)
- [ ] Customer info matches request
- [ ] Timestamps present (createdAt, updatedAt)
- [ ] No error messages

**Screenshot:**
- [ ] Capture terminal output
- [ ] Save as: `test-results/valid-transaction.png`

**Database Verification:**
```bash
# (If you have access to staging database)
# Check if transaction was saved
# SELECT * FROM transactions WHERE id = 'uuid-from-response';
```

---

#### Step 3.3: Test Input Validation - Missing Fields

**Test Case 3: Invalid Input - Missing Required Field**

```bash
# Missing passengerEmail, amount, phoneNumber
curl -X POST https://vi-backend.tiketq.com/api/transactions \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: test-gajah-mada-002" \
  -d '{
    "passengerName": "Test User"
  }' | jq
```

**Expected Result:**
```json
{
  "statusCode": 400,
  "message": [
    "passengerEmail should not be empty",
    "passengerEmail must be an email",
    "amount should not be empty",
    "amount must be a number",
    "phoneNumber should not be empty"
  ],
  "error": "Bad Request"
}
```

**HTTP Status:** 400 Bad Request

**Verification Checklist:**
- [ ] HTTP Status: 400 Bad Request
- [ ] Error message lists ALL missing fields
- [ ] Error messages are clear and descriptive
- [ ] No transaction created in database

**Screenshot:**
- [ ] Capture terminal output
- [ ] Save as: `test-results/missing-fields-validation.png`

---

#### Step 3.4: Test Input Validation - Invalid Email

**Test Case 4: Invalid Input - Invalid Email Format**

```bash
# Invalid email format
curl -X POST https://vi-backend.tiketq.com/api/transactions \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: test-gajah-mad
    "flightId": "FLIGHT-001",
    "passengerName": "Test User",
    "passengerEmail": "invalid-email-format",
    "amount": 750000,
    "phoneNumber": "628123456789"
  }' | jq
```

**Expected Result:**
```json
{
  "statusCode": 400,
  "message": [
    "passengerEmail must be an email"
  ],
  "error": "Bad Request"
}
```

**HTTP Status:** 400 Bad Request

**Verification Checklist:**
- [ ] HTTP Status: 400 Bad Request
- [ ] Error message mentions email validation
- [ ] Clear error: "must be an email"
- [ ] No transaction created

**Screenshot:**
- [ ] Capture terminal output
- [ ] Save as: `test-results/invalid-email-validation.png`

---

#### Step 3.5: Test Input Validation - Invalid Flight ID

**Test Case 5: Invalid Flight ID**

**Prerequisites:**
- [ ] Flight Service deployed (Squad Kucing Oyen)
- [ ] Confirmation: What is a valid flight ID format?

```bash
# Invalid flight ID
curl -X POST https://vi-backend.tiketq.com/api/transactions \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: test-gajah-mad
    "flightId": "INVALID-FLIGHT-XYZ",
    "passengerName": "Test User",
    "passengerEmail": "test@example.com",
    "amount": 750000,
    "phoneNumber": "628123456789"
  }' | jq
```

**Expected Result (Option 1 - If validation is implemented):**
```json
{
  "statusCode": 404,
  "message": "Flight not found",
  "error": "Not Found"
}
```

**Expected Result (Option 2 - If validation NOT implemented yet):**
```json
{
  "id": "uuid",
  "status": "PENDING",
  ...
}
```

**⚠️ Note:** Tergantung implementasi. Jika Flight Service integration belum ada, validation mungkin belum ada.

**Verification Checklist:**
- [ ] Response sesuai expected (404 atau 201, tergantung implementation)
- [ ] Document actual behavior
- [ ] If 201: Note that flight ID validation not yet implemented

**Screenshot:**
- [ ] Capture terminal output
- [ ] Save as: `test-results/invalid-flight-id.png`

---

### **PHASE 4: Documentation & Reporting**

#### Step 4.1: Create Test Results Document

Create file: `test-results/gajah-mada-sprint4-results.md`

**Template:**
```markdown
# Sprint 4 Test Results - Squad Gajah Mada
**Date:** 2026-01-27
**Tester:** Muhammad Irfan Dzaky
**Environment:** Staging (https://vi-backend.tiketq.com)

---

## Test Summary

| Test Case | Status | Notes |
|-----------|--------|-------|
| Swagger UI Accessible | ✅ PASS | All endpoints documented |
| Valid Transaction Creation | ✅ PASS | Transaction saved to DB |
| Missing Fields Validation | ✅ PASS | Clear error messages |
| Invalid Email Validation | ✅ PASS | Email format validated |
| Invalid Flight ID | ⚠️ PARTIAL | Validation not yet implemented |
| Idempotency | ✅ PASS | Duplicate prevention works |

---

## Detailed Results

### Test 1: Swagger UI
- **URL:** https://vi-backend.tiketq.com/api/docs
- **Status:** ✅ PASS
- **Screenshot:** swagger-ui.png
- **Notes:** All schemas documented correctly

### Test 2: Valid Transaction
- **Request:**
  ```json
  {
    "flightId": "FLIGHT-001",
    "passengerName": "Test Gajah Mada",
    "passengerEmail": "gajah-mada@test.com",
    "amount": 750000,
    "phoneNumber": "628123456789"
  }
  ```
- **Response:** HTTP 201, transaction ID: `abc-123-xyz`
- **Status:** ✅ PASS
- **Screenshot:** valid-transaction.png

### Test 3: Missing Fields
- **Request:** Missing email, amount, phone
- **Response:** HTTP 400, lists all missing fields
- **Status:** ✅ PASS
- **Screenshot:** missing-fields-validation.png

### Test 4: Invalid Email
- **Request:** Email: "invalid-format"
- **Response:** HTTP 400, "must be an email"
- **Status:** ✅ PASS
- **Screenshot:** invalid-email-validation.png

### Test 5: Invalid Flight ID
- **Request:** flightId: "INVALID-XYZ"
- **Response:** HTTP 201 (validation not implemented yet)
- **Status:** ⚠️ PARTIAL
- **Notes:** Flight validation will be implemented by Squad Kucing Oyen
- **Screenshot:** invalid-flight-id.png

### Test 6: Idempotency
- **Request:** Same key, same payload (2x)
- **Response:** Same transaction ID returned
- **Status:** ✅ PASS
- **Screenshot:** idempotency-test.png

---

## Issues Found
(depends Flight Service)
- **Severity:** Low (expected, depends on Flight Service)
- **Description:** Invalid flight IDs are accepted
- **Action:** Coordinate with Squad Kucing Oyen
- **Status:** Tracked for future sprint

---

## Dependencies Status

| Squad | Feature | Status | Impact |
|-Dependency | Status | Impact |
|------------|--------|--------|
| Database Staging | ✅ Working | All DB operations work |
| Flight Service (Kucing Oyen) | ⚠️ Not Required | Flight validation pending (optional test)
---

## Conclusion

✅ **All critical test cases passed**

**Ready for production:** YES (with noted limitation on flight ID validation)

**Recommendations:**dengan catatan flight ID validation belum implement - itu normal)

**Recommendations:**
1. Flight ID validation akan implement nanti setelah Flight Service integration complete
2. Monitor logs untuk runtime errors
3. API endpoint sudah production-ready untuk basic transaction creation dan validation
**Checklist:**
- [ ] Test results documented
- [ ] Screenshots attached
- [ ] Issues logged
- [ ] Recommendations provided

---

#### Step 4.2: Share Results with Team

1. **Post in team channel:**
```
🎉 Sprint 4 Testing Complete - Squad Gajah Mada

Summary:
✅ 5/6 test cases PASSED
- 4/5 test cases PASSED
⚠️ 1 test case PARTIAL (expected, depends on Flight Service)

All critical functionality working:
- Swagger documentation ✅
- Transaction creation ✅
- Input validation (missing fields, invalid email) ✅

Expected limitation:
- Flight ID validation pending (normal, Flight Service belum integratedation
- Squad Semut Hitam: untuk confirm idempotency working
(Optional) Squad Kucing Oyen: untuk info bahwa flight validation nanti setelah mereka integrate
- [ ] Results shared in team channel
- [ ] Relevant squads tagged
- [ ] Mentor notified

---

## ✅ Final Checklist - Sprint 4 Complete

### Pre-Deployment
- [ ] Code reviewed locally
- [ ] Build succeeds
- [ ] Dependencies coordinated

### Deployment
- [ ] PR created to staging
- [ ] CI/CD checks passed
- [ ] Deployed to staging
- [ ] Health check returns 200

### Testing
- [ ] Test 1: Swagger UI - PASSED
- [ ] Test 2: Valid transaction - PASSED
- [ ] Test 3: Missing fields validation - PASSED
- [ ] Test 4: Invalid email validation - PASSED
- [ ] Test 5: Invalid flight ID - TESTED (partial)
- [ ] Test 6: Idempotency - PASSED
, Flight Service belum integrate)
- [ ] Test results documented
- [ ] Screenshots captured
- [ ] Issues logged
- [ ] Results shared with team

### Handoff
- [ ] Mentor notified
- [ ] Dependencies documented
- [ ] Ready for production sign-off

---

## 🎯 Success Criteria Met

By completing this guide, kamu sudah memenuhi semua success criteria untuk Squad Gajah Mada:

**From Sprint4.md:**
1. ✅ Pull Request created from develop to staging
2. ✅ Only squad-specific changes included in PR
3. ✅ CI/CD pipeline passes (build, test, deploy)
4. ✅ Service deployed to staging environment
5. ✅ All assigned APIs tested on staging
6. ✅ Test results documented (pass/fail for each test case)
7. ✅ Issues documented and fixed (or tracked for later)

**Squad Gajah Mada Specific:**
14. ✅ API endpoint tested with valid/invalid inputs
15. ✅ Swagger documentation accessible and complete
16. ✅ Input validation working correctly

---

## 📞 Contact List for Dependencies

| Squad | Contact Person | Purpose |
|-------|----------(If Needed)

| Who | Purpose |
|-----|---------|
| DevOps/Mentor | Database staging issues, deployment help |
| Squad Kucing Oyen (Optional) | Flight Service status (optional untuk bonus test) |

**Catatan:** Kamu seharusnya tidak perlu kontak squad lain untuk menyelesaikan testing. Database staging adalah satu-satunya critical dependency.
## 🚨 Troubleshooting Quick Reference

### Problem: CI/CD fails
**Solution:** Check GitHub Actions logs, fix locally, push again

### Problem: Health check returns 500
**Solution:** Check deployment logs: `kubectl logs -f deployment/transactions-service`

### Problem: Database connection error
**Solution:** Verify environment variables, check database is running

### Problem: Idempotency test fails
**Solution:** Confirm Squad Semut Hitam middleware deployed

### Problem: 

**Good luck! 🚀**
