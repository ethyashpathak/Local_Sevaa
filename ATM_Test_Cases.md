# ATM Software Test Case Document

| Test Case ID | Module | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Status |
|---|---|---|---|---|---|---|---|
| TC_ATM_001 | Login | Verify card insertion | ATM machine is ON | 1. Insert valid ATM card | Valid ATM Card | System detects card and prompts for PIN | Pass/Fail |
| TC_ATM_002 | Login | Verify valid PIN authentication | Card inserted | 1. Enter correct PIN | PIN: Correct PIN | User is logged in successfully | Pass/Fail |
| TC_ATM_003 | Login | Verify invalid PIN handling | Card inserted | 1. Enter incorrect PIN | PIN: Incorrect PIN | Error message displayed | Pass/Fail |
| TC_ATM_004 | Login | Verify card block after 3 invalid attempts | Card inserted | 1. Enter wrong PIN 3 times | Invalid PIN | Card gets blocked temporarily | Pass/Fail |
| TC_ATM_005 | Balance Inquiry | Verify balance display | User logged in | 1. Select "Balance Inquiry" | Savings Account | Correct balance displayed | Pass/Fail |
| TC_ATM_006 | Cash Withdrawal | Verify successful withdrawal | User logged in with sufficient balance | 1. Select Withdrawal 2. Enter amount | ₹ 5,000 | Cash dispensed and balance updated | Pass/Fail |
| TC_ATM_007 | Cash Withdrawal | Verify insufficient balance handling | User logged in | 1. Enter amount greater than balance | ₹ 50,000 | "Insufficient Balance" message displayed | Pass/Fail |
| TC_ATM_008 | Cash Withdrawal | Verify withdrawal limit validation | User logged in | 1. Enter amount exceeding daily limit | ₹ 60,000 | Transaction declined with limit message | Pass/Fail |
| TC_ATM_009 | Cash Withdrawal | Verify denomination validation | User logged in | 1. Enter amount not multiple of 100 | ₹ 1,250 | Error message displayed | Pass/Fail |
| TC_ATM_010 | Deposit | Verify cash deposit functionality | User logged in | 1. Select Deposit 2. Insert cash | ₹ 2,000 | Amount credited successfully | Pass/Fail |
| TC_ATM_011 | Fund Transfer | Verify successful fund transfer | User logged in | 1. Select Transfer 2. Enter account details | Account No: 1234567890 | Amount transferred successfully | Pass/Fail |
| TC_ATM_012 | Mini Statement | Verify mini statement generation | User logged in | 1. Select Mini Statement | N/A | Recent transactions displayed/printed | Pass/Fail |
| TC_ATM_013 | Receipt Printing | Verify receipt printing | Transaction completed | 1. Choose "Print Receipt" | N/A | Receipt printed successfully | Pass/Fail |
| TC_ATM_014 | Session Timeout | Verify auto logout after inactivity | User logged in | 1. Keep ATM idle for timeout duration | N/A | Session expires automatically | Pass/Fail |
| TC_ATM_015 | Card Ejection | Verify card ejection after transaction | Transaction completed | 1. Complete transaction | N/A | Card ejected successfully | Pass/Fail |
| TC_ATM_016 | Network Failure | Verify handling during network failure | ATM connected to network | 1. Disconnect network during transaction | N/A | Proper error message displayed | Pass/Fail |
| TC_ATM_017 | Cash Availability | Verify ATM behavior when cash unavailable | ATM cash empty | 1. Attempt withdrawal | ₹ 1,000 | "Cash Not Available" message displayed | Pass/Fail |
| TC_ATM_018 | Language Selection | Verify language selection functionality | ATM idle screen | 1. Select preferred language | English/Hindi | Interface changes to selected language | Pass/Fail |
| TC_ATM_019 | PIN Change | Verify PIN change functionality | User logged in | 1. Select PIN Change 2. Enter new PIN | New PIN: New PIN | PIN updated successfully | Pass/Fail |
| TC_ATM_020 | Logout | Verify logout functionality | User logged in | 1. Press Exit/Cancel | N/A | User logged out and home screen displayed | Pass/Fail |

---

## Additional Notes

- Test execution should be performed in both normal and edge-case conditions.
- Validate security requirements such as encrypted PIN handling.
- Verify transaction logs are stored correctly in the backend.
- Test compatibility with different card types (Visa, MasterCard, RuPay, etc.).
- Perform load and stress testing for high transaction volumes.
