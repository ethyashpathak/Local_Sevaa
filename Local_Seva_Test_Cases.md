# Local Seva — Software Test Case Document

| Test Case ID | Module | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Status |
|---|---|---|---|---|---|---|---|
| TC_LS_001 | User Signup | Verify OTP is sent on valid email | App is running, email not registered | 1. Navigate to /user/signup 2. Enter email 3. Click Sign Up | Email: newuser@test.com | OTP sent successfully, user redirected to OTP page | Pass/Fail |
| TC_LS_002 | User Signup | Verify duplicate email rejection | Email already registered in DB | 1. Navigate to /user/signup 2. Enter existing email 3. Click Sign Up | Email: existing@test.com | "This Email ID is already registered. Try Signing In instead!" message displayed | Pass/Fail |
| TC_LS_003 | User Signup | Verify OTP verification and account creation | OTP sent to user email | 1. Enter valid OTP 2. Fill username, password, contact 3. Submit | OTP: Valid 6-digit OTP, Username: testuser, Password: Test@123 | Account created successfully, user_id token returned | Pass/Fail |
| TC_LS_004 | User Signup | Verify invalid OTP handling | OTP sent to user email | 1. Enter incorrect OTP 2. Submit | OTP: 000000 (incorrect) | "OTP does not match. Please try again!" error displayed | Pass/Fail |
| TC_LS_005 | User Signup | Verify expired OTP handling | OTP was sent but expired | 1. Wait for OTP expiry 2. Enter OTP 3. Submit | OTP: Expired OTP | "The OTP expired. Please try again!" error displayed | Pass/Fail |
| TC_LS_006 | User Signup | Verify Resend OTP functionality | User on OTP verification page | 1. Click "Resend OTP" | Email: newuser@test.com | New OTP sent successfully | Pass/Fail |
| TC_LS_007 | User Login | Verify successful login with valid credentials | User account exists | 1. Navigate to /user/login 2. Enter email & password 3. Click Log In | Email: user@test.com, Password: correct | "Log-In successful!" message, user_id token stored in cookies | Pass/Fail |
| TC_LS_008 | User Login | Verify login with invalid password | User account exists | 1. Navigate to /user/login 2. Enter email & wrong password 3. Click Log In | Email: user@test.com, Password: wrongpass | "Invalid password" error displayed | Pass/Fail |
| TC_LS_009 | User Login | Verify login with non-existent email | No account for given email | 1. Navigate to /user/login 2. Enter unregistered email 3. Click Log In | Email: nouser@test.com | "User not found" error displayed | Pass/Fail |
| TC_LS_010 | Handyman Signup | Verify OTP is sent on valid handyman email | App is running, email not registered | 1. Navigate to /handyman/signup 2. Enter email, name, service, Aadhar 3. Click Register | Email: handyman@test.com, Service: Plumber | OTP sent successfully, redirected to OTP step | Pass/Fail |
| TC_LS_011 | Handyman Signup | Verify duplicate handyman email rejection | Email already registered as handyman | 1. Navigate to /handyman/signup 2. Enter existing email | Email: existing_handyman@test.com | "This Email ID is already registered" error displayed | Pass/Fail |
| TC_LS_012 | Handyman Signup | Verify handyman OTP verification and profile creation | OTP sent to handyman email | 1. Enter valid OTP 2. Enter password, address 3. Submit | OTP: Valid 6-digit OTP, Password: Hand@123 | Handyman account created, handyman_id token returned | Pass/Fail |
| TC_LS_013 | Handyman Signup | Verify geolocation is captured during signup | Browser supports geolocation | 1. Allow location permission 2. Complete signup | Location: Auto-detected lat/long | Handyman profile stores correct lat and long coordinates | Pass/Fail |
| TC_LS_014 | Handyman Signup | Verify geolocation fallback on denial | Browser geolocation denied | 1. Deny location permission 2. Complete signup | Location: Default (28.6139, 77.2090) | Signup completes with default coordinates without error | Pass/Fail |
| TC_LS_015 | Handyman Login | Verify successful handyman login | Handyman account exists | 1. Navigate to /handyman/login 2. Enter credentials 3. Click Log In | Email: handyman@test.com, Password: correct | "Log-In successful!", handyman_id stored in cookies | Pass/Fail |
| TC_LS_016 | Handyman Login | Verify handyman login with wrong password | Handyman account exists | 1. Enter wrong password 2. Click Log In | Password: wrongpass | "Invalid password" error displayed | Pass/Fail |
| TC_LS_017 | Browse Services | Verify service page loads with map | User is logged in | 1. Navigate to /services/servicePage | N/A | Map-based discovery UI loads with category pills | Pass/Fail |
| TC_LS_018 | Browse Services | Verify category filtering (Plumbing) | User on service page, handymen exist | 1. Click "Plumbing" category pill | Category: plumber | Only plumber-category handymen displayed in list and on map | Pass/Fail |
| TC_LS_019 | Browse Services | Verify category filtering (Electrical) | User on service page | 1. Click "Electrical" category pill | Category: electrician | Only electrician-category handymen displayed | Pass/Fail |
| TC_LS_020 | Browse Services | Verify handyman list sorted by distance | User location available, handymen exist | 1. Allow location 2. View service list | User Location: Auto-detected | Handymen sorted nearest first | Pass/Fail |
| TC_LS_021 | Browse Services | Verify empty category message | No handymen for selected category | 1. Select a category with no providers | Category: painter (no providers) | "No professionals found for this category near you" displayed | Pass/Fail |
| TC_LS_022 | Browse Services | Verify unauthenticated user redirect | User not logged in | 1. Navigate to /services/servicePage without login | N/A | Toast "You need to login first", redirected to /user/login | Pass/Fail |
| TC_LS_023 | Service Booking | Verify "Book Now" creates notification | User logged in, handyman selected | 1. Click "Book Now" on a handyman card | user_id: token, handyman_id: token | Notification created with status "pending" | Pass/Fail |
| TC_LS_024 | Handyman Dashboard | Verify dashboard loads for logged-in handyman | Handyman logged in | 1. Navigate to /handyman/dashboard | N/A | Dashboard loads with Live Status toggle, sidebar navigation | Pass/Fail |
| TC_LS_025 | Handyman Dashboard | Verify empty state when no requests | Handyman logged in, no pending notifications | 1. View dashboard | N/A | "No customer requests found" message displayed | Pass/Fail |
| TC_LS_026 | Handyman Dashboard | Verify new request card appears | Customer sends booking request to this handyman | 1. Wait for polling interval (5s) | Notification with status: "pending" | New Request card appears with customer name from DB | Pass/Fail |
| TC_LS_027 | Handyman Dashboard | Verify Accept functionality | New request card visible | 1. Click "Accept" button | handyman_id, user_id | Toast "Job Accepted", notification status changes to "accepted", switched to Active Tasks | Pass/Fail |
| TC_LS_028 | Handyman Dashboard | Verify Decline functionality | New request card visible | 1. Click "Decline" button | handyman_id, user_id | Toast "Job Declined", notification status changes to "rejected", card disappears | Pass/Fail |
| TC_LS_029 | Handyman Dashboard | Verify Live Status toggle OFF | Handyman logged in, live status ON | 1. Click toggle switch to OFF | N/A | Text changes to "You are currently offline", polling stops | Pass/Fail |
| TC_LS_030 | Handyman Dashboard | Verify Live Status toggle ON | Handyman logged in, live status OFF | 1. Click toggle switch to ON | N/A | Text changes to "You are currently receiving requests", polling resumes | Pass/Fail |
| TC_LS_031 | Active Tasks | Verify Active Tasks tab shows accepted job | Handyman accepted a job | 1. Click "Active Tasks" in sidebar | N/A | Active job card displayed with customer name and OTP input | Pass/Fail |
| TC_LS_032 | Active Tasks | Verify Active Tasks empty state | No active job | 1. Click "Active Tasks" in sidebar | N/A | "No active tasks" message with "Go to Dashboard" button | Pass/Fail |
| TC_LS_033 | Active Tasks | Verify OTP input and Start Service | Handyman has active job, customer provided OTP | 1. Enter 4-digit OTP 2. Click "Start Service" | OTP: 1234 | Toast "OTP Verified. Job Started!", redirected to /handyman/jobstartotp | Pass/Fail |
| TC_LS_034 | Active Tasks | Verify incomplete OTP rejection | Handyman has active job | 1. Enter less than 4 digits 2. Click "Start Service" | OTP: 12 (incomplete) | Toast "Please enter complete 4-digit OTP" | Pass/Fail |
| TC_LS_035 | Active Tasks | Verify OTP auto-focus behavior | Handyman on OTP entry | 1. Type a digit in first box | OTP digit: 5 | Cursor auto-moves to next input box | Pass/Fail |
| TC_LS_036 | Job Start OTP | Verify valid job start OTP on backend | OTP generated and sent to user email | 1. POST /api/handyman/jobstartotp with correct OTP | Email: user@test.com, OTP: valid | "Job Started" response returned | Pass/Fail |
| TC_LS_037 | Job Start OTP | Verify invalid job start OTP on backend | OTP generated | 1. POST /api/handyman/jobstartotp with wrong OTP | OTP: 000000 (wrong) | "OTP does not match. Please try again!" error | Pass/Fail |
| TC_LS_038 | Work Completion | Verify work done registration | Job started by handyman | 1. POST /api/workdonecheck with handyman_id and user_id | handyman_id, user_id | "User added successfully", user added to handyman's usersSelected | Pass/Fail |
| TC_LS_039 | Payment | Verify payment page loads | User on booking summary | 1. Navigate to /user/payment | N/A | Payment page loads with service summary and Pay Now button | Pass/Fail |
| TC_LS_040 | Payment | Verify Stripe checkout trigger | User on payment page | 1. Click "Pay Now" button | Product: Service Name, Price: ₹500 | Stripe checkout popup opens | Pass/Fail |
| TC_LS_041 | Payment | Verify successful Stripe payment | Valid card token available | 1. Complete Stripe payment form 2. Submit | Token: tok_visa, Email: user@test.com | Payment processed, "success" status returned | Pass/Fail |
| TC_LS_042 | Notification System | Verify notification creation API | User and handyman exist | 1. POST /api/createnotification | user_id, handyman_id, lat, long | Notification created with status "pending", 201 response | Pass/Fail |
| TC_LS_043 | Notification System | Verify notification fetch for handyman | Notifications exist for handyman | 1. POST /api/getnotification | handyman_id: token | Array of notification objects returned | Pass/Fail |
| TC_LS_044 | Notification System | Verify notification expiry | Notification created with TTL | 1. Wait for expiry duration | N/A | Notification auto-deleted from database | Pass/Fail |
| TC_LS_045 | Navigation | Verify Navbar renders on all pages | App is running | 1. Navigate to /handyman/dashboard | N/A | Navbar is visible at the top of the page | Pass/Fail |
| TC_LS_046 | Navigation | Verify Footer renders on all pages | App is running | 1. Navigate to /handyman/dashboard | N/A | Footer is visible at the bottom of the page | Pass/Fail |
| TC_LS_047 | Navigation | Verify sidebar tab switching | Handyman on dashboard | 1. Click "Active Tasks" 2. Click "Dashboard" | N/A | Content switches between Dashboard and Active Tasks views | Pass/Fail |
| TC_LS_048 | User Profile | Verify user details fetch | User exists in DB | 1. POST /api/user/getuser | user_id: token | User profile object returned with username, email, location | Pass/Fail |
| TC_LS_049 | User Profile | Verify non-existent user handling | user_id does not match any record | 1. POST /api/user/getuser with invalid token | user_id: invalid_token | "No such user exists" error returned | Pass/Fail |
| TC_LS_050 | Handyman Profile | Verify handyman details fetch | Handyman exists in DB | 1. POST /api/handyman/gethandyman | handyman_id: token | Handyman profile returned with name, services, location | Pass/Fail |

---

## Additional Notes

- Test execution should be performed in both normal and edge-case conditions.
- Validate security requirements such as encrypted password handling (bcrypt) and JWT token generation.
- Verify OTP records are correctly deleted from DB after successful verification.
- Verify transaction/notification logs are stored correctly in MongoDB.
- Test geolocation handling for both allowed and denied browser permissions.
- Test compatibility across different browsers (Chrome, Firefox, Edge).
- Perform API testing using Postman or similar tools alongside UI testing.
- Verify Stripe payment integration in both test mode and with various card types.
- Test notification polling behavior under different network conditions.
- Verify cookie-based authentication tokens are set and cleared properly on login/logout.
