# Local Seva API Endpoints Documentation

This document lists all API endpoints available in the Local Seva server-side application.

## Base URL
* Development: `http://localhost:5000` (or configured via `PORT` environment variable)
* Base Prefix for Router endpoints: `/api`

---

## 1. System Endpoints

### 1.1 Server Health Check
* **Endpoint**: `GET /`
* **Description**: Verifies if the API server is up and running.
* **Response**:
  * **200 OK**:
    ```text
    API running :)
    ```

---

## 2. User Authentication & Profile Endpoints

### 2.1 User SignUp (Send OTP)
* **Endpoint**: `POST /api/user/signup`
* **Description**: Initiates the registration process for a standard user by generating and sending an OTP to the user's email address.
* **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
* **Responses**:
  * **200 OK**:
    ```json
    {
      "msg": "Otp sent successfully!"
    }
    ```
  * **400 Bad Request** (Email already registered):
    ```json
    {
      "msg": "This Email ID is already registered. Try Signing In instead!"
    }
    ```
  * **500 Internal Server Error**:
    ```json
    {
      "msg": "Error message details"
    }
    ```

### 2.2 Resend SignUp OTP
* **Endpoint**: `POST /api/user/signup/resendOtp`
* **Description**: Resends a new sign-up OTP to the user's email if they haven't verified yet.
* **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
* **Responses**:
  * **200 OK**:
    ```json
    {
      "msg": "New Otp sent successfully!"
    }
    ```
  * **400 Bad Request** (Email already registered):
    ```json
    {
      "msg": "This Email ID is already registered. Try Signing In instead!"
    }
    ```
  * **500 Internal Server Error**:
    ```json
    {
      "msg": "Error message details"
    }
    ```

### 2.3 Verify SignUp OTP & Create User
* **Endpoint**: `POST /api/user/signup/verify`
* **Description**: Verifies the OTP sent to the user's email. If valid, encrypts the password, generates a JWT token, creates a new user profile in the database, and deletes the OTP record.
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "otp": "123456",
    "username": "john_doe",
    "password": "securepassword",
    "contactNumber": "1234567890",
    "lat": "28.6139",
    "long": "77.2090"
  }
  ```
* **Responses**:
  * **200 OK**:
    ```json
    {
      "msg": "Account creation successful!",
      "user_id": "jwt_token_here"
    }
    ```
  * **400 Bad Request** (OTP expired or mismatch):
    ```json
    {
      "msg": "The OTP expired. Please try again!"
    }
    ```
  * **500 Internal Server Error**:
    ```json
    {
      "msg": "Error message details"
    }
    ```

### 2.4 User Login
* **Endpoint**: `POST /api/user/login`
* **Description**: Authenticates a user by validating their credentials and sends a login verification email.
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
* **Responses**:
  * **200 OK**:
    ```json
    {
      "msg": "Log-In successful!",
      "user_id": "user_jwt_token"
    }
    ```
  * **404 Not Found** (User not found):
    ```json
    {
      "msg": "User not found"
    }
    ```
  * **401 Unauthorized** (Invalid password):
    ```json
    {
      "msg": "Invalid password"
    }
    ```
  * **500 Internal Server Error**:
    ```json
    {
      "msg": "Error message details"
    }
    ```

### 2.5 Get All Users
* **Endpoint**: `GET /api/user/getallusers`
* **Description**: Retrieves a list of all registered users.
* **Responses**:
  * **200 OK**: Array of user objects.
  * **500 Internal Server Error**:
    ```json
    {
      "msg": "Error message details"
    }
    ```

### 2.6 Get Specific User Details
* **Endpoint**: `POST /api/user/getuser`
* **Description**: Fetches profile details of a specific user.
* **Request Body**:
  ```json
  {
    "user_id": "user_jwt_token"
  }
  ```
* **Responses**:
  * **200 OK**: User profile object.
  * **404 Not Found** (No such user exists):
    ```json
    {
      "msg": "No such user exists"
    }
    ```
  * **500 Internal Server Error**:
    ```json
    {
      "msg": "Error message"
    }
    ```

---

## 3. Handyman Endpoints

### 3.1 Handyman SignUp (Send OTP)
* **Endpoint**: `POST /api/handyman/signup`
* **Description**: Initiates the registration process for a handyman by generating and sending an OTP to their email address.
* **Request Body**:
  ```json
  {
    "email": "handyman@example.com"
  }
  ```
* **Responses**:
  * **200 OK**:
    ```json
    {
      "msg": "Otp sent successfully!"
    }
    ```
  * **400 Bad Request** (Email already registered):
    ```json
    {
      "msg": "This Email ID is already registered. Try Signing In instead!"
    }
    ```
  * **500 Internal Server Error**:
    ```json
    {
      "msg": "Error message"
    }
    ```

### 3.2 Verify Handyman SignUp OTP & Create Profile
* **Endpoint**: `POST /api/handyman/signup/verify`
* **Description**: Verifies the OTP sent to the handyman's email. If valid, encrypts their password, generates a JWT token, creates a handyman profile, and deletes the OTP record.
* **Request Body**:
  ```json
  {
    "name": "Alex Smith",
    "email": "handyman@example.com",
    "otp": "123456",
    "password": "securepassword",
    "phone": "9876543210",
    "aadharNumber": "123456789012",
    "services": "Plumbing",
    "profile": "https://url-to-profile-image.png",
    "lat": "28.6139",
    "long": "77.2090"
  }
  ```
* **Responses**:
  * **200 OK**:
    ```json
    {
      "msg": "Handyman Account creation successful!",
      "handyman_id": "handyman_jwt_token"
    }
    ```
  * **400 Bad Request** (OTP expired or mismatch):
    ```json
    {
      "msg": "The OTP expired. Please try again!"
    }
    ```
  * **500 Internal Server Error**:
    ```json
    {
      "msg": "Error message"
    }
    ```

### 3.3 Handyman Login
* **Endpoint**: `POST /api/handyman/login`
* **Description**: Authenticates a handyman and sends a login verification email.
* **Request Body**:
  ```json
  {
    "email": "handyman@example.com",
    "password": "securepassword"
  }
  ```
* **Responses**:
  * **200 OK**:
    ```json
    {
      "msg": "Log-In successful!",
      "handyman_id": "handyman_jwt_token"
    }
    ```
  * **404 Not Found** (Handyman not found):
    ```json
    {
      "msg": "Handyman not found"
    }
    ```
  * **401 Unauthorized** (Invalid password):
    ```json
    {
      "msg": "Invalid password"
    }
    ```
  * **500 Internal Server Error**:
    ```json
    {
      "msg": "Error message"
    }
    ```

### 3.4 Get All Handymen
* **Endpoint**: `GET /api/handyman/getallhandyman`
* **Description**: Retrieves a list of all registered handymen.
* **Responses**:
  * **200 OK**: Array of handyman objects.
  * **500 Internal Server Error**:
    ```json
    {
      "msg": "Error message"
    }
    ```

### 3.5 Get Specific Handyman Details
* **Endpoint**: `POST /api/handyman/gethandyman`
* **Description**: Fetches profile details of a specific handyman.
* **Request Body**:
  ```json
  {
    "handyman_id": "handyman_jwt_token"
  }
  ```
* **Responses**:
  * **200 OK**: Handyman profile object.
  * **404 Not Found** (No such handyman exists):
    ```json
    {
      "msg": "No such handyman exists"
    }
    ```
  * **500 Internal Server Error**:
    ```json
    {
      "msg": "Error message"
    }
    ```

### 3.6 Verify Job Start OTP
* **Endpoint**: `POST /api/handyman/jobstartotp`
* **Description**: Verifies the job start OTP provided by the user to the handyman to verify the start of a service job.
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "otp": "123456"
  }
  ```
* **Responses**:
  * **200 OK**:
    ```json
    {
      "msg": "Job Started"
    }
    ```
  * **400 Bad Request** (OTP expired or mismatch):
    ```json
    {
      "msg": "OTP does not match. Please try again!"
    }
    ```
  * **500 Internal Server Error**:
    ```json
    {
      "msg": "Error message"
    }
    ```

---

## 4. Notification Request & Flow Endpoints

### 4.1 Create Notification Request
* **Endpoint**: `POST /api/createnotification`
* **Description**: Triggered by a user to request a booking/service from a specific handyman at the user's location.
* **Request Body**:
  ```json
  {
    "user_id": "user_jwt_token",
    "handyman_id": "handyman_jwt_token",
    "lat": "28.6139",
    "long": "77.2090"
  }
  ```
* **Responses**:
  * **201 Created**:
    ```json
    {
      "user_id": "user_jwt_token",
      "handyman_id": "handyman_jwt_token",
      "lat": "28.6139",
      "long": "77.2090",
      "status": "pending",
      "_id": "notification_id",
      "expireAt": "timestamp",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
    ```
  * **500 Internal Server Error**:
    ```json
    {
      "error": "Error message details"
    }
    ```

### 4.2 Get Handyman Notifications
* **Endpoint**: `POST /api/getnotification`
* **Description**: Fetches all notifications/booking requests directed to a specific handyman.
* **Request Body**:
  ```json
  {
    "handyman_id": "handyman_jwt_token"
  }
  ```
* **Responses**:
  * **200 OK**: Array of notification objects.
  * **404 Not Found**:
    ```json
    {
      "msg": "Error message details"
    }
    ```

### 4.3 Accept Booking Request
* **Endpoint**: `POST /api/acceptnotification`
* **Description**: Used by a handyman to accept a pending request. Changes status to `"accepted"`, generates a Job Start OTP, and sends it to the user's registered email address.
* **Request Body**:
  ```json
  {
    "handyman_id": "handyman_jwt_token"
  }
  ```
* **Responses**:
  * **200 OK**:
    ```json
    {
      "msg": "Otp sent successfully!"
    }
    ```
  * **404 Not Found** (Notification not found or already accepted/rejected):
    ```json
    {
      "message": "Notification not found or already processed"
    }
    ```
  * **500 Internal Server Error**:
    ```json
    {
      "message": "Error details"
    }
    ```

### 4.4 Reject Booking Request
* **Endpoint**: `POST /api/rejectnotification`
* **Description**: Used by a handyman to reject a pending booking request. Changes status to `"rejected"`.
* **Request Body**:
  ```json
  {
    "handyman_id": "handyman_jwt_token"
  }
  ```
* **Responses**:
  * **200 OK**: Updated notification object showing status `"rejected"`.
  * **404 Not Found** (Notification not found or already processed):
    ```json
    {
      "message": "Notification not found or already processed"
    }
    ```
  * **500 Internal Server Error**:
    ```json
    {
      "message": "Error details"
    }
    ```

### 4.5 Register Work Done (Work Done Check)
* **Endpoint**: `POST /api/workdonecheck`
* **Description**: Marks the work as completed by associating the user to the handyman's list of selected users (`usersSelected`).
* **Request Body**:
  ```json
  {
    "handyman_id": "handyman_jwt_token",
    "user_id": "user_jwt_token"
  }
  ```
* **Responses**:
  * **200 OK**:
    ```json
    {
      "handyman": { ...updated handyman object... },
      "msg": "User added successfully"
    }
    ```
  * **500 Internal Server Error**:
    ```json
    {
      "msg": "Error details"
    }
    ```

---

## 5. Payment Endpoints

### 5.1 Process Stripe Payment
* **Endpoint**: `POST /api/config`
* **Description**: Processes a secure payment via Stripe using credit card tokens.
* **Request Body**:
  ```json
  {
    "product": {
      "name": "Plumbing Service",
      "price": 500
    },
    "token": {
      "email": "user@example.com",
      "id": "tok_1Nxxxx",
      "billing_name": "John Doe",
      "shipping_address_line1": "123 Main St",
      "shipping_address_line2": "Apt 4B",
      "shipping_address_city": "Delhi",
      "shipping_address_country": "India",
      "shipping_address_zip": "110001"
    }
  }
  ```
* **Responses**:
  * **200 OK**:
    ```json
    {
      "status": "success"
    }
    ```
