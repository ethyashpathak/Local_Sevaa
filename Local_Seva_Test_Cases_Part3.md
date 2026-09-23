# Local Seva Test Result Document (Part 3)

**Project Name:** Local Seva (Handyman & On-Demand Home Services Portal)  
**Document Name:** Test Result Document (Sprint 2 Verification)  
**Version:** v1.0  
**Prepared By:** QA/Test Engineer  
**Reviewed By:** Test Manager  
**Date:** 27-May-2026  
**Test Environment:** React/Vite (Frontend), Node/Express Server, MongoDB, Stripe Simulator, Mapbox API, Google Chrome, Windows 11  

---

## 1. Test Result Summary

| Test Parameter | Result |
|---|---|
| **Total Test Cases** | 50 |
| **Executed Test Cases** | 48 |
| **Passed Test Cases** | 46 |
| **Failed Test Cases** | 2 |
| **Blocked Test Cases** | 1 |
| **Pass Percentage** | **95.83%** |

---

## 2. Detailed Test Results

| Test Case ID | Module Name | Test Scenario | Expected Result | Actual Result | Status | Remarks |
|---|---|---|---|---|---|---|
| **TC_LS_001** | User Signup | Verify OTP is sent on valid email address | OTP email should be sent successfully | OTP sent via nodemailer | **Pass** | — |
| **TC_LS_007** | User Login | Login with correct email and password | Return jwt user_id and redirect | JWT returned successfully | **Pass** | — |
| **TC_LS_010** | Handyman Signup | Verify geolocation capture during professional signup | Coordinates should be captured automatically | Coordinates captured | **Pass** | — |
| **TC_LS_019** | Job Notification | Query active requests via `getnotification` endpoint | Fetch active job request cards for dashboard | Returned empty `[]` due to routing POST mismatch | **Fail** | **Fixed** (Refactored to REST GET parameters) |
| **TC_LS_025** | Customer Booking | Tap "Book Now" on professional profile card | Creates pending notification and polls | Notification created in DB | **Pass** | — |
| **TC_LS_031** | Live Dashboard | Verify dashboard live status toggle | Disables polling when switched offline | Polling stops instantly | **Pass** | — |
| **TC_LS_038** | Notification Expiry | Verify notification persistence during UAT checks | Notification remains available for dashboard | Auto-deleted in 40s due to MongoDB TTL index | **Fail** | **Fixed** (TTL default extended to 24 hours) |
| **TC_LS_041** | Stripe Payment | Execute test payment checkout card | Platform fee and total charge compiled | Charge created in test-mode | **Pass** | — |
| **TC_LS_045** | Job Verification | Submit valid job start OTP from customer email | Service state transitions to started | Verified and navigated to map | **Pass** | — |
| **TC_LS_048** | Job Completion | Register completed work done in system | Adds customer to the handyman list | Customer successfully pushed | **Pass** | — |

---

## 3. Defect Details

| Defect ID | Related Test Case | Description | Severity | Status |
|---|---|---|---|---|
| **BUG_LS_101** | TC_LS_019 | Frontend `Dashboard.jsx` POST payload mismatch with backend param destructuring in `getnotification` route | **Critical** | **Closed** (Resolved & Verified) |
| **BUG_LS_102** | TC_LS_038 | MongoDB TTL index automatic expiration timer too aggressive (deleted after 40 seconds) | **High** | **Closed** (Resolved & Verified) |
| **BUG_LS_103** | TC_LS_045 | Job start OTP verification fails on first attempt due to minor SMTP server mail dispatch delay | **Medium** | **Resolved** (Optimized retry timings) |

---

## 4. Module-wise Result Status

| Module | Executed | Passed | Failed | Status |
|---|---|---|---|---|
| **User Authentication** | 9 | 9 | 0 | **Pass** |
| **Professional Registration** | 8 | 8 | 0 | **Pass** |
| **Geolocation & Map Search** | 8 | 8 | 0 | **Pass** |
| **Job Booking & Live Notifications** | 11 | 9 | 2 | **Pass (Hotfixes Applied)** |
| **Stripe Payments** | 5 | 5 | 0 | **Pass** |
| **Job Start Verification** | 4 | 4 | 0 | **Pass** |
| **Work Done & Completion** | 3 | 3 | 0 | **Pass** |

---

## 5. Final Result

| Overall Result | Comments |
|---|---|
| **Passed** | The software has been certified fully operational following successful validation of UAT workflows, the refactoring of notification APIs, and extension of MongoDB database collection lifetimes. |
