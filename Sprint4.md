# 🚀 Sprint 4: Staging Deployment & End-to-End Testing

  

**Focus:** Deploy to staging environment and test all implemented features

**Duration:** 2 weeks

  

---

  

## 📌 Sprint Overview

  

Sprint 4 is focused on **verification and testing**. After completing implementation in Sprints 1-3, all squads must now:

  

1.  **Push changes to staging environment** via Pull Request from `develop` to `staging` branch

2.  **Test all implemented APIs** on staging to ensure they work correctly

3.  **Verify end-to-end flows** across services (Flight Service ↔ Transactions Service)

4.  **Document any issues** and fix them before production deployment

  

### CI/CD Pipeline

  

The CI/CD pipeline is set up to automatically:

- Build and test your code when a PR is created

- Deploy to staging environment when PR is merged to `staging` branch

- Run health checks on deployed services

  

**Important**: All squads must deploy their changes and test on staging. No new features should be implemented in this sprint.

  

---

  

## 🔄 How to Push to Staging

  

### Step 1: Prepare Your Changes

  

Before creating a PR, ensure your changes are ready:

  

```bash

# Make sure you're on the latest develop branch

git  checkout  develop

git  pull  origin  develop

  

# Check if you have any uncommitted changes

git  status

  

# If you have changes, commit them

git  add  .

git  commit  -m  "feat: [your feature description]"

git  push  origin  develop

```

  

### Step 2: Review Your Changes

  

Before creating a PR, review what will be included:

  

```bash

# See what commits will be in the PR (compares to staging branch)

git  log  origin/staging..HEAD  --oneline

  

# See the actual file changes

git  diff  origin/staging...HEAD

  

# Check specific files

git  diff  origin/staging...HEAD  --  libs/application/transactions/

```

  

**Best Practices:**

- ✅ Only include files related to your squad's tasks

- ✅ Write clear, descriptive commit messages

- ✅ Squash related commits before pushing (optional but recommended)

- ❌ Don't include unrelated changes (e.g., config files, other squads' work)

- ❌ Don't include merge commits from other branches

  

### Step 3: Create Pull Request

  

#### Option A: Using GitHub Web UI

  

1. Go to https://github.com/[your-org]/tiketq-be

2. Click "Pull requests" → "New pull request"

3. Click "compare: staging" and change it to "develop"

4. Ensure the base is `staging` and compare is `develop`

5. Click "Create pull request"

6. Use this format for your PR:

  

```

Title: [Squad Name]: Deploy to Staging - [Feature Description]

  

Example: "Semut Merah: Deploy to Staging - Midtrans Callback Handler"

  

Description:

## Summary

- [ ] Midtrans callback handler implemented

- [ ] Signature key verification implemented

- [ ] Unit tests added

- [ ] Documentation updated

```

  

### Step 4: Ensure Only Your Changes Are Included

  

**Critical:** Before merging, verify your PR only contains your squad's changes:

  

1.  **Check the "Files changed" tab** in GitHub PR

2.  **Review each file** to ensure it belongs to your squad

3.  **Tag reviewers** for approval

4.  **Request changes** if unrelated files are included

  

**What to Do If Unrelated Files Are Included:**

  

```bash

# Option 1: Revert the unwanted files

git  checkout  HEAD~1  --  path/to/unwanted/file

git  commit  --amend  --no-edit

git  push  origin  develop  --force

  

# Option 2: Cherry-pick only your commits

git  checkout  -b  feature/my-squad-to-staging

git  cherry-pick  <commit-hash-1>  <commit-hash-2>  ...

git  push  origin  feature/my-squad-to-staging

# Create PR from feature/my-squad-to-staging to staging

```

  

### Step 5: Verify CI/CD Pipeline

  

After creating the PR:

  

1.  **Check GitHub Actions** tab in your PR

2.  **Verify all checks pass**:

- ✅ Build succeeds

- ✅ Tests pass (if implemented)

- ✅ Linting passes

- ✅ No security vulnerabilities

  

3.  **Check deployment status**:

- Verify services are deployed to staging

- Check staging hello world endpoint: `https://vi-backend.tiketq.com`

  

4.  **If checks fail**:

- Read the error logs

- Fix the issue locally

- Push fix to `develop` branch

- PR will update automatically

  

---

  

## 🧪 APIs to Test by Squad

  

Here are the critical APIs each squad MUST test:

  

### Squad Semut Merah (Transactions - Midtrans Callbacks)

  

**Primary Tasks:**

- Midtrans callback handler for success/pending/failed transactions

- Signature key verification service

  

**APIs to Test:**

  

#### 1. `POST /api/payments/webhooks/midtrans` - Midtrans Callback Handler

  

**Test Cases:**

  

✅ **Test 1: Successful Payment Callback (Status 200)**

```bash

curl  -X  POST  https://vi-backend.tiketq.com/api/payments/webhooks/midtrans  \

-H "Content-Type: application/json" \

-d  '{

"order_id": "TXN-12345",

"status_code": "200",

"transaction_status": "settlement",

"gross_amount": "500000",

"signature_key": "calculated_signature_here"

}'

```

**Expected Result:** HTTP 200, transaction status updated to "PAID"

  

✅ **Test 2: Pending Payment Callback (Status 201)**

```bash

curl  -X  POST  https://vi-backend.tiketq.com/api/payments/webhooks/midtrans  \

-H "Content-Type: application/json" \

-d  '{

"order_id": "TXN-12346",

"status_code": "201",

"transaction_status": "pending",

"gross_amount": "500000",

"signature_key": "calculated_signature_here"

}'

```

**Expected Result:** HTTP 200, transaction status remains "PENDING"

  

✅ **Test 3: Failed Payment Callback (Status 202/Expired)**

```bash

curl  -X  POST  https://vi-backend.tiketq.com/api/payments/webhooks/midtrans  \

-H "Content-Type: application/json" \

-d  '{

"order_id": "TXN-12347",

"status_code": "202",

"transaction_status": "expire",

"gross_amount": "500000",

"signature_key": "calculated_signature_here"

}'

```

**Expected Result:** HTTP 200, transaction status updated to "FAILED" or "EXPIRED"

  

✅ **Test 4: Invalid Signature Key**

```bash

curl  -X  POST  https://vi-backend.tiketq.com/api/payments/webhooks/midtrans  \

-H "Content-Type: application/json" \

-d  '{

"order_id": "TXN-12348",

"status_code": "200",

"transaction_status": "settlement",

"gross_amount": "500000",

"signature_key": "INVALID_SIGNATURE"

}'

```

**Expected Result:** HTTP 401 Unauthorized, error message "Invalid signature"

  

**Verification Checklist:**

- [ ] Callback handler receives requests from Midtrans

- [ ] Signature key verification works correctly

- [ ] Transaction status updates in database

- [ ] Invalid signatures are rejected

- [ ] All Midtrans status codes are handled (200, 201, 202, 407, etc.)

- [ ] Logs show callback processing details

  

---

  

### Squad Semut Hitam (Transactions - Midtrans Integration)

  

**Primary Tasks:**

- Outgoing request to Midtrans (Snap/Core API) for transaction initiation

- Timeout handling and retry policy

  

**APIs to Test:**

  

#### 1. `POST /api/transactions` - Create Transaction / Initiate Payment

  

**Test Cases:**

  

✅ **Test 1: Successful Transaction Creation**

```bash

curl  -X  POST  https://vi-backend.tiketq.com/api/transactions  \

-H "Content-Type: application/json" \

-H  "X-Idempotency-Key: unique-key-12345"  \

-d '{

"flightId":  "FLIGHT-001",

"passengerName":  "John Doe",

"passengerEmail":  "john@example.com",

"amount":  500000,

"phoneNumber":  "62812345678"

}'

```

**Expected Result:** HTTP 201, returns Midtrans Snap URL

  

✅ **Test 2: Timeout Handling (Simulate Slow Midtrans)**

```bash

# This test requires modifying Midtrans adapter to add artificial delay

# Or use a test endpoint that simulates timeout

```

**Expected Result:** Request retries up to configured limit, then returns error

  

✅ **Test 3: Idempotency Key - Duplicate Request**

```bash

# Send same request twice with same idempotency key

curl  -X  POST  https://vi-backend.tiketq.com/api/transactions  \

-H "Content-Type: application/json" \

-H  "X-Idempotency-Key: unique-key-12345"  \

-d '{

"flightId":  "FLIGHT-001",

"passengerName":  "John Doe",

"passengerEmail":  "john@example.com",

"amount":  500000,

"phoneNumber":  "62812345678"

}'

  

# Wait 1 second, then send again

curl -X POST https://vi-backend.tiketq.com/api/transactions \

-H "Content-Type: application/json" \

-H "X-Idempotency-Key: unique-key-12345" \

-d '{

"flightId":  "FLIGHT-001",

"passengerName":  "John Doe",

"passengerEmail":  "john@example.com",

"amount":  500000,

"phoneNumber":  "62812345678"

}'

```

**Expected Result:** Second request returns same response as first (no duplicate transaction)

  

✅ **Test 4: Missing Idempotency Key**

```bash

curl  -X  POST  https://vi-backend.tiketq.com/api/transactions  \

-H "Content-Type: application/json" \

-d  '{

"flightId": "FLIGHT-001",

"passengerName": "John Doe",

"passengerEmail": "john@example.com",

"amount": 500000

}'

```

**Expected Result:** HTTP 400 Bad Request, error message "Idempotency key required"

  

**Verification Checklist:**

- [ ] Midtrans Snap URL is returned successfully

- [ ] Transaction is saved to database with "PENDING" status

- [ ] Idempotency key prevents duplicate transactions

- [ ] Timeout handling works (retry logic triggers)

- [ ] Retry policy respects configured max retries

- [ ] Logging shows retry attempts

- [ ] Error handling works when Midtrans is down

  

---

  

### Squad Gajah Mada (Transactions - API Endpoints)

  

**Primary Tasks:**

- API Contract (Swagger) for Create Transaction endpoint

- POST /transaction endpoint with input validation

  

**APIs to Test:**

  

#### 1. `POST /api/transactions` - Create Transaction Endpoint

  

**Test Cases:**

  

✅ **Test 1: Valid Input - Swagger Documentation**

```bash

# Access Swagger UI

open  https://vi-backend.tiketq.com/api/docs

```

**Expected Result:** Swagger UI accessible, all endpoints documented

  

✅ **Test 2: Valid Input - Create Transaction**

```bash

curl  -X  POST  https://vi-backend.tiketq.com/api/transactions  \

-H "Content-Type: application/json" \

-H  "X-Idempotency-Key: test-key-001"  \

-d '{

"flightId":  "FLIGHT-001",

"passengerName":  "Jane Smith",

"passengerEmail":  "jane@example.com",

"amount":  750000,

"phoneNumber":  "62898765432"

}'

```

**Expected Result:** HTTP 201, returns transaction object with ID

  

✅ **Test 3: Invalid Input - Missing Required Field**

```bash

curl  -X  POST  https://vi-backend.tiketq.com/api/transactions  \

-H "Content-Type: application/json" \

-H  "X-Idempotency-Key: test-key-002"  \

-d '{

"flightId":  "FLIGHT-001",

"passengerName":  "Jane Smith"

# Missing passengerEmail, amount, phoneNumber

}'

```

**Expected Result:** HTTP 400 Bad Request, validation error listing missing fields

  

✅ **Test 4: Invalid Input - Invalid Flight ID**

```bash

curl  -X  POST  https://vi-backend.tiketq.com/api/transactions  \

-H "Content-Type: application/json" \

-H  "X-Idempotency-Key: test-key-003"  \

-d '{

"flightId":  "INVALID-FLIGHT-ID",

"passengerName":  "Jane Smith",

"passengerEmail":  "jane@example.com",

"amount":  750000,

"phoneNumber":  "62898765432"

}'

```

**Expected Result:** HTTP 404 Not Found or 400 Bad Request, error message "Flight not found"

  

✅ **Test 5: Invalid Input - Invalid Email Format**

```bash

curl  -X  POST  https://vi-backend.tiketq.com/api/transactions  \

-H "Content-Type: application/json" \

-H  "X-Idempotency-Key: test-key-004"  \

-d '{

"flightId":  "FLIGHT-001",

"passengerName":  "Jane Smith",

"passengerEmail":  "invalid-email-format",

"amount":  750000,

"phoneNumber":  "62898765432"

}'

```

**Expected Result:** HTTP 400 Bad Request, validation error "Invalid email format"

  

**Verification Checklist:**

- [ ] Swagger documentation is accessible at `/api/docs`

- [ ] All request/response schemas are documented

- [ ] Input validation works for all required fields

- [ ] Invalid inputs return clear error messages

- [ ] Valid inputs create transaction successfully

- [ ] Transaction is saved to database

- [ ] Response format matches API contract

  

---

  

### Squad Gajah Duduk (Transactions - Idempotency & Tracing)

  

**Primary Tasks:**

- Idempotency key mechanism to prevent duplicate transactions

- Distributed tracing (Jaeger/OpenTelemetry) for monitoring

  

**APIs to Test:**

  

#### 1. `POST /api/transactions` - Idempotency Key Testing

  

**Test Cases:**

  

✅ **Test 1: Idempotency Works - Same Request, Same Key**

```bash

# First request

curl  -X  POST  https://vi-backend.tiketq.com/api/transactions  \

-H "Content-Type: application/json" \

-H  "X-Idempotency-Key: idem-test-001"  \

-d '{

"flightId":  "FLIGHT-001",

"passengerName":  "Test User",

"passengerEmail":  "test@example.com",

"amount":  500000,

"phoneNumber":  "62811111111"

}'

# Note the transaction ID in response

  

# Second request (same key)

curl -X POST https://vi-backend.tiketq.com/api/transactions \

-H "Content-Type: application/json" \

-H "X-Idempotency-Key: idem-test-001" \

-d '{

"flightId":  "FLIGHT-001",

"passengerName":  "Test User",

"passengerEmail":  "test@example.com",

"amount":  500000,

"phoneNumber":  "62811111111"

}'

```

**Expected Result:** Second request returns SAME transaction ID (no duplicate created)

  

✅ **Test 2: Idempotency Conflict - Same Key, Different Payload**

```bash

# First request

curl  -X  POST  https://vi-backend.tiketq.com/api/transactions  \

-H "Content-Type: application/json" \

-H  "X-Idempotency-Key: idem-test-002"  \

-d '{

"flightId":  "FLIGHT-001",

"passengerName":  "User One",

"passengerEmail":  "user1@example.com",

"amount":  500000,

"phoneNumber":  "62811111111"

}'

  

# Second request with different payload (same key)

curl -X POST https://vi-backend.tiketq.com/api/transactions \

-H "Content-Type: application/json" \

-H "X-Idempotency-Key: idem-test-002" \

-d '{

"flightId":  "FLIGHT-002",  # Different flight

"passengerName":  "User Two",  # Different name

"passengerEmail":  "user2@example.com",

"amount":  600000,

"phoneNumber":  "62822222222"

}'

```

**Expected Result:** HTTP 409 Conflict, error message "Idempotency key already used with different payload"

  

✅ **Test 3: Distributed Tracing - Check Jaeger**

```bash

# Make a request with tracing enabled

curl  -X  POST  https://vi-backend.tiketq.com/api/transactions  \

-H "Content-Type: application/json" \

-H  "X-Idempotency-Key: trace-test-001"  \

-d '{

"flightId":  "FLIGHT-001",

"passengerName":  "Traced User",

"passengerEmail":  "trace@example.com",

"amount":  500000,

"phoneNumber":  "62833333333"

}'

  

# Access Jaeger UI

open https://vi-backend.tiketq.com/jaeger

# Search for the transaction ID or trace ID

```

**Expected Result:** Trace visible in Jaeger UI, shows all spans (HTTP request, database query, Midtrans API call)

  

**Verification Checklist:**

- [ ] Idempotency key prevents duplicate transactions

- [ ] Same request with same key returns cached response

- [ ] Different payload with same key returns 409 error

- [ ] Missing idempotency key returns 400 error

- [ ] Distributed tracing works (Jaeger/OpenTelemetry)

- [ ] Traces visible in Jaeger UI

- [ ] Spans show: HTTP request → Use Case → Repository → External API

- [ ] Trace includes: transaction ID, user ID, timestamp

  

---

  

### Squad Kucing Oyen (Flight Service - Bosbiller Integration)

  

**Primary Tasks:**

- Adapter/wrapper service to call Bosbiller API (Search & Availability)

- Data normalization from vendor response to internal format

  

**APIs to Test:**

  

#### 1. `GET /api/flights/search` - Search Flights

  

**Test Cases:**

  

✅ **Test 1: Valid Search Parameters**

```bash

curl  -X  GET  "https://vi-backend.tiketq.com/api/flights/search?origin=CGK&destination=DPS&date=2024-02-01&passengers=1"

```

**Expected Result:** HTTP 200, returns array of flights with normalized format

  

✅ **Test 2: Bosbiller API Called Successfully**

```bash

# Check logs to verify Bosbiller API was called

# Should see: "Calling Bosbiller API: GET /search?origin=CGK&destination=DPS..."

```

**Expected Result:** Logs show Bosbiller API call, no errors

  

✅ **Test 3: Response Data Normalization**

```bash

# Check response format

curl  -X  GET  "https://vi-backend.tiketq.com/api/flights/search?origin=CGK&destination=DPS&date=2024-02-01&passengers=1"  |  jq  '.[0]'

```

**Expected Result:** Response in internal format (not raw Bosbiller format):

```json

{

"id": "FLIGHT-123",

"flightNumber": "GA-401",

"origin": {

"code": "CGK",

"name": "Soekarno-Hatta International Airport",

"city": "Jakarta"

},

"destination": {

"code": "DPS",

"name": "Ngurah Rai International Airport",

"city": "Bali"

},

"departureTime": "2024-02-01T08:00:00Z",

"arrivalTime": "2024-02-01T10:45:00Z",

"price": 1500000,

"availableSeats": 120,

"airline": {

"code": "GA",

"name": "Garuda Indonesia"

}

}

```

  

✅ **Test 4: Invalid Parameters - Missing Required Field**

```bash

curl  -X  GET  "https://vi-backend.tiketq.com/api/flights/search?origin=CGK&destination=DPS"

# Missing 'date' parameter

```

**Expected Result:** HTTP 400 Bad Request, error message "date is required"

  

✅ **Test 5: Invalid Parameters - Invalid Airport Code**

```bash

curl  -X  GET  "https://vi-backend.tiketq.com/api/flights/search?origin=INVALID&destination=DPS&date=2024-02-01"

```

**Expected Result:** HTTP 400 Bad Request or 200 with empty array (depending on validation strategy)

  

**Verification Checklist:**

- [ ] Bosbiller API is called with correct parameters

- [ ] Response data is normalized to internal format

- [ ] Field names match internal contract (not Bosbiller format)

- [ ] Date/time formats are consistent (ISO 8601)

- [ ] Price is in correct format (number, not string)

- [ ] Input validation works for required parameters

- [ ] Error handling works when Bosbiller API is down

- [ ] Logging shows API calls and responses

  

---

  

### Squad Kucing Garong (Flight Service - Integration)

  

**Primary Tasks:**

- Integration with Transactions Service for payment status updates

- Background job for ticket issuing after payment

  

**APIs to Test:**

  

#### 1. `POST /api/flights/book` - Book Flight (Internal API)

  

**Test Cases:**

  

✅ **Test 1: End-to-End Flow - Search → Book → Pay → Issue Ticket**

  

```bash

# Step 1: Search for flights

curl  -X  GET  "https://vi-backend.tiketq.com/api/flights/search?origin=CGK&destination=DPS&date=2024-02-01&passengers=1"

# Note: flightId from response, e.g., "FLIGHT-123"

  

# Step 2: Create transaction (initiate payment)

curl  -X  POST  https://vi-backend.tiketq.com/api/transactions  \

-H "Content-Type: application/json" \

-H  "X-Idempotency-Key: e2e-test-001"  \

-d '{

"flightId":  "FLIGHT-123",

"passengerName":  "E2E Test User",

"passengerEmail":  "e2e@example.com",

"amount":  1500000,

"phoneNumber":  "62844444444"

}'

# Note: transactionId from response

  

# Step 3: Simulate payment callback (normally done by Midtrans)

curl -X POST https://vi-backend.tiketq.com/api/payments/webhooks/midtrans \

-H "Content-Type: application/json" \

-d '{

"order_id":  "TXN-12345",

"status_code":  "200",

"transaction_status":  "settlement",

"gross_amount":  "1500000",

"signature_key":  "calculated_signature_here"

}'

  

# Step 4: Check if ticket was issued (background job)

curl -X GET "https://vi-backend.tiketq.com/api/bookings/TXN-12345"

```

**Expected Result:**

- Step 1: Returns list of flights

- Step 2: Creates transaction, returns payment URL

- Step 3: Updates transaction to "PAID", triggers ticket issuance

- Step 4: Booking status is "CONFIRMED", ticket number is generated

  

✅ **Test 2: Flight Service Receives Payment Status Update**

```bash

# Check logs to verify Flight Service was called

# Should see: "Payment status updated: TXN-12345 is now PAID"

# Should see: "Starting ticket issuance for flight FLIGHT-123"

```

**Expected Result:** Logs show communication between Transactions and Flight Service

  

✅ **Test 3: Background Job for Ticket Issuing**

```bash

# After payment callback, wait 5-10 seconds for background job

curl  -X  GET  "https://vi-backend.tiketq.com/api/bookings/TXN-12345"

```

**Expected Result:** Booking includes:

-  `"status": "CONFIRMED"`

-  `"ticketNumber": "TKT-1234567890"` (generated by vendor)

-  `"issuedAt": "2024-02-01T10:50:00Z"`

  

✅ **Test 4: Communication with Transactions Service**

```bash

# Verify Flight Service can call Transactions Service

# (This should be tested internally)

```

**Expected Result:** Flight Service successfully updates transaction status

  

**Verification Checklist:**

- [ ] End-to-end flow works: search → book → pay → issue ticket

- [ ] Flight Service communicates with Transactions Service

- [ ] Payment status updates are received by Flight Service

- [ ] Background job triggers after payment

- [ ] Ticket issuance completes successfully

- [ ] Booking status updates to "CONFIRMED"

- [ ] Ticket number is generated and saved

- [ ] Logs show all service-to-service communication

  

---

  

### Squad Burung Camar (Flight Frontend)

  

**Primary Tasks:**

- Flight search page with filters

- Integration with Flight Search API

- Display search results

  

**UI Flows to Test:**

  

#### 1. `/search` - Flight Search Page

  

**Test Cases:**

  

✅ **Test 1: Search Form Works**

1. Open staging frontend: `https://staging.tiketq.com`

2. Enter search criteria:

- Origin: Jakarta (CGK)

- Destination: Bali (DPS)

- Date: 2024-02-01

- Passengers: 1

3. Click "Search" button

**Expected Result:** Page loads search results from API

  

✅ **Test 2: Filters Work**

1. After search results load

2. Apply filters:

- Airline: Garuda Indonesia

- Price range: Rp 1.000.000 - Rp 2.000.000

- Duration: < 3 hours

3. Verify results update

**Expected Result:** Results are filtered correctly

  

✅ **Test 3: API Integration Displays Results**

1. Open browser DevTools (F12)

2. Go to Network tab

3. Search for flights

4. Check API call: `/api/flights/search?origin=CGK&destination=DPS&date=2024-02-01&passengers=1`

**Expected Result:**

- API call returns HTTP 200

- Response contains flight data

- UI displays flights correctly

  

✅ **Test 4: Loading States**

1. Open DevTools → Network tab

2. Throttle network to "Slow 3G"

3. Search for flights

**Expected Result:**

- Loading spinner/skeleton appears

- No layout shift when results load

- User sees "Searching..." message

  

✅ **Test 5: Error Handling**

1. Simulate API error (use invalid airport code: XXX)

2. Search for flights

**Expected Result:**

- Error message displayed: "No flights found" or "Search failed"

- No crash or blank page

- User can retry search

  

**Verification Checklist:**

- [ ] Search form accepts all inputs (origin, destination, date, passengers)

- [ ] "Search" button triggers API call

- [ ] Search results display correctly

- [ ] Each flight card shows: airline, flight number, time, price

- [ ] Filters (airline, price, duration) work correctly

- [ ] Loading states show during API call

- [ ] Error states show friendly messages

- [ ] Pagination works (if implemented)

- [ ] Responsive design works on mobile

  

---

  

## ✅ Testing Checklist

  

### Before Creating PR

  

- [ ] Code compiles without errors: `npm run build`

- [ ] No console errors or warnings

- [ ] All tests pass: `npm run test` (if tests implemented)

- [ ] Environment variables configured for staging

- [ ] Database migrations tested locally

- [ ] Git diff reviewed: `git diff origin/staging...HEAD`

- [ ] Only your changes included (no unrelated files)

- [ ] Commit messages are clear and descriptive

  

### After Deployment to Staging

  

- [ ] Service starts successfully (check logs)

- [ ] Health check endpoint returns 200: `curl https://vi-backend.tiketq.com/api/health`

- [ ] Swagger documentation accessible: `https://vi-backend.tiketq.com/api/docs`

- [ ] All assigned API endpoints tested (see squad sections above)

- [ ] Error scenarios tested (invalid input, timeouts, etc.)

- [ ] Logs reviewed for any issues

- [ ] Distributed tracing visible (if applicable): `https://vi-backend.tiketq.com/jaeger`

  

### Integration Testing

  

- [ ] Test cross-service communication (Flight ↔ Transactions)

- [ ] Test payment flow end-to-end: search → book → pay → issue ticket

- [ ] Test webhook handling (for payment callbacks)

- [ ] Verify idempotency works correctly (duplicate requests)

- [ ] Test with realistic data (real flight IDs, real amounts)

- [ ] Load test with multiple concurrent requests (optional)

  

### Squad-Specific Handoff

  

- [ ] Squad Semut Merah: Midtrans callbacks tested and working

- [ ] Squad Semut Hitam: Midtrans integration tested and working

- [ ] Squad Gajah Mada: API endpoints documented and tested

- [ ] Squad Gajah Duduk: Idempotency and tracing verified

- [ ] Squad Kucing Oyen: Bosbiller integration working

- [ ] Squad Kucing Garong: Service-to-service communication working

- [ ] Squad Burung Camar: Frontend UI working and integrated

  

---

  

## 🔧 Troubleshooting

  

### Deployment Issues

  

**Problem:** Deployment fails in CI/CD

**Solutions:**

- Check GitHub Actions logs for specific error

- Verify environment variables are set correctly

- Ensure all dependencies are installed: `npm ci`

- Check if build succeeds locally: `npm run build`

  

**Problem:** Service crashes on startup

**Solutions:**

- Check staging logs: `kubectl logs -f deployment/service-name`

- Verify database connection string is correct

- Check if all environment variables are set

- Look for uncaught exceptions or missing dependencies

  

### API Issues

  

**Problem:** API returns HTTP 500 Internal Server Error

**Solutions:**

- Check logs for stack trace

- Verify database connection is working

- Check if external APIs (Midtrans, Bosbiller) are accessible

- Look for missing required fields in request

  

**Problem:** API returns HTTP 404 Not Found

**Solutions:**

- Verify URL path is correct

- Check if route is registered in controller

- Ensure service is deployed and running

  

**Problem:** API returns HTTP 401 Unauthorized

**Solutions:**

- Verify API keys/tokens are correct

- Check if internal API guard is blocking request

- Ensure service-to-service authentication is working

  

### Payment Issues

  

**Problem:** Midtrans callback fails

**Solutions:**

- Verify signature key calculation is correct

- Check if order_id exists in database

- Ensure gross_amount matches transaction amount

- Check Midtrans server key in environment variables

  

**Problem:** Idempotency not working

**Solutions:**

- Check if Redis/database connection is working

- Verify cache key format: `idempotency:{key}`

- Ensure idempotency middleware is applied to endpoint

- Check if cache TTL is set correctly (24 hours)

  

### Flight Search Issues

  

**Problem:** Bosbiller API call fails

**Solutions:**

- Verify Bosbiller API credentials

- Check if API endpoint URL is correct

- Test API directly with Postman/curl

- Check rate limiting (too many requests)

  

**Problem:** Flight search returns empty results

**Solutions:**

- Verify search parameters are valid (origin, destination, date)

- Check if Bosbiller API has data for that route/date

- Look for data normalization errors in logs

- Test with different parameters

  

### Frontend Issues

  

**Problem:** Frontend can't connect to backend

**Solutions:**

- Verify CORS is configured correctly

- Check if backend URL in frontend .env is correct

- Ensure backend is deployed and accessible

- Check browser console for CORS errors

  

**Problem:** Search results don't display

**Solutions:**

- Check browser DevTools Network tab for API call

- Verify API returns data in expected format

- Look for JavaScript errors in console

- Check if data mapping is correct

  

### Distributed Tracing Issues

  

**Problem:** Traces not visible in Jaeger

**Solutions:**

- Verify OpenTelemetry is configured correctly

- Check if Jaeger agent is running

- Ensure service is exporting traces

- Check Jaeger UI for correct service name

  

### Getting Help

  

If you can't solve the issue:

  

1.  **Check logs first**: Always review application logs

2.  **Search existing issues**: Check if someone else had the same problem

3.  **Ask your squad**: Post in squad channel with:

- Error message

- Steps to reproduce

- Logs/screenshots

4.  **Ask mentors**: Tag mentors for help

5.  **Document the solution**: Once fixed, add to troubleshooting guide

  

---

## 🎉 Sprint 4 Success Criteria

  

By the end of Sprint 4, each squad should have:

  

### All Squads

  

1. ✅ Pull Request created from `develop` to `staging`

2. ✅ Only squad-specific changes included in PR

3. ✅ CI/CD pipeline passes (build, test, deploy)

4. ✅ Service deployed to staging environment

5. ✅ All assigned APIs tested on staging

6. ✅ Test results documented (pass/fail for each test case)

7. ✅ Issues documented and fixed (or tracked for later)

  

### Squad Semut Merah

  

8. ✅ Midtrans callback handler tested (success/pending/failed)

9. ✅ Signature key verification working

10. ✅ All transaction statuses handled correctly

  

### Squad Semut Hitam

  

11. ✅ Midtrans integration working (Snap URL returned)

12. ✅ Timeout and retry logic tested

13. ✅ Idempotency key handling verified

  

### Squad Gajah Mada

  

14. ✅ API endpoint tested with valid/invalid inputs

15. ✅ Swagger documentation accessible and complete

16. ✅ Input validation working correctly

  

### Squad Gajah Duduk

  

17. ✅ Idempotency prevents duplicate transactions

18. ✅ Distributed tracing visible in Jaeger

19. ✅ All spans recorded correctly

  

### Squad Kucing Oyen

  

20. ✅ Bosbiller API integration working

21. ✅ Data normalization verified

22. ✅ Search returns correct results

  

### Squad Kucing Garong

  

23. ✅ End-to-end flow tested (search → book → pay → issue)

24. ✅ Service-to-service communication working

25. ✅ Background job for ticket issuance working

  

### Squad Burung Camar

  

26. ✅ Search page UI working

27. ✅ API integration displaying results

28. ✅ Loading and error states working

  

---

  

## 📚 Learning Objectives

  

By completing Sprint 4, students will have learned:

  

1.  **CI/CD Pipelines**: How to use GitHub Actions for automated deployment

2.  **Pull Request Best Practices**: How to create clean, focused PRs

3.  **Staging Environments**: How to test in production-like environment

4.  **End-to-End Testing**: How to test complete user flows

5.  **Integration Testing**: How to verify service-to-service communication

6.  **Debugging in Production**: How to use logs, tracing, and monitoring

7.  **Git Hygiene**: How to review changes and avoid unwanted commits

8.  **Team Collaboration**: How to coordinate deployments across squads

  

These are real-world skills that every software engineer needs in professional environments.

  

---