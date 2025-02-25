# PoA: Productive Assistant

PoA is a full‑stack productivity application that integrates multiple features into a single platform. Users can register and log in (with two‑factor authentication via email), plan their week with a planner, maintain a journal, and manage a reading list. Admin functionality is available for a specific email, allowing an admin to view and delete users.

## Project Overview

PoA helps users organize their daily tasks and personal projects. Key features include:

- **User Authentication:**  
  Secure registration, login (with 2FA via email), password reset, and JWT-based session management.
  
- **Productivity Tools:**  
  - **Planner/Habit Tracker:** Organize tasks and habits on a weekly basis.
  - **Journal:** Maintain a timeline-style journal.
  - **Reading List:** Manage your books by status (Not Started, In Process, Finished).

- **Admin Dashboard:**  
  Restricted to a specific email (e.g., `admin@example.com`), the admin dashboard allows an admin to view all users and delete users.

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/) (local instance or cloud provider)
- Git

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name

2. **Backend Setup:**
   Navigate to the backend directory and install dependencies:

   ```bash
   cd backend
   npm install

3. **Frontend Setup**
   If your frontend uses a build tool, navigate to the frontend directory and install dependencies:

   ```bash
   cd ../frontend
   npm install
  
  If you are serving static files directly from /frontend/public, no additional build step is needed.

4. **Environment Variables:**
   In the backend directory, create a .env file with the following variables (adjust values as needed):

   ```bash
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    PORT=5000
    
    EMAIL_HOST=your_smtp_host
    EMAIL_PORT=your_smtp_port
    EMAIL_SECURE=false  # Set to true if using port 465
    EMAIL_USER=your_email@example.com
    EMAIL_PASS=your_email_password
    EMAIL_FROM="PoA <no-reply@poa.com>"

5. **Uploads Directory:**
   Create an uploads folder in the backend directory to store profile pictures:

   ```bash
   mkdir uploads

## Running the Project Locally

1. **Start the Backend Server:**
   From the backend directory, run:

   ```bash
   npm start
  
  (Alternatively, use nodemon server.js for live reloading.)

2. **Serve the Frontend:**
   The backend is configured to serve static files from frontend/public. Open your browser and navigate to:

   ```bash
   http://localhost:5000

## API Documentation

### API Documentation

- **Register a New User**
  POST /api/auth/register
  Body:

  ```bash
  {
  "username": "yourusername",
  "email": "youremail@example.com",
  "password": "yourpassword"
  }

- **Login**
  POST /api/auth/login
  Body:

  ```bash
  {
  "email": "youremail@example.com",
  "password": "yourpassword"
  }

Note: This endpoint sends a 2FA code via email.

- **Verify Two-Factor Code**
  POST /api/auth/verify-2fa
  Body:

  ```bash
  {
  "email": "youremail@example.com",
  "twoFactorCode": "123456"
  }

Returns a JWT token upon success.

- **Forgot Password**
  POST /api/auth/forgot-password
  Body:

  ```bash
  { "email": "youremail@example.com" }

- **Reset Password**
  PUT /api/auth/reset-password
  Body:

  ```bash
  {
  "email": "youremail@example.com",
  "token": "resetTokenFromEmail",
  "newPassword": "newpassword"
  }

## Other Endpoints
For additional endpoints regarding Planner, Journal, Reading List, and Admin Dashboard, please refer to the project source code.

## Admin Endpoints (Restricted to a Specific Email)

- **List All Users**
  GET /api/admin/users
  Requires Authorization header with admin token.

- **Delete a User**
  DELETE /api/admin/users/:id
  Requires Authorization header with admin token.
