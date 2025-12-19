## Account Manager React App

This is a React (Vite) application that lets users **register**, **log in**, and **view/edit** their account information.

The app is intentionally simple and uses **client-side storage** (localStorage) instead of a real backend, which makes it easy to run and review for the purposes of this test.

### Features

- **Registration page**
  - Create a new account with name, email, and password.
  - Real-time password strength indicator (Weak, Medium, Strong) with visual progress bar.
  - Password visibility toggle button to show/hide passwords.
  - Real-time form validation with error messages.
  - Password confirmation field with match indicator.
  - Prevents duplicate accounts for the same email.

- **Login page**
  - Log in with email and password.
  - Shows clear error messages for missing fields and invalid credentials.
  - Password visibility toggle button.
  - "Forgot Password?" link positioned above the sign-in button.

- **Forgot Password feature**
  - Two-step password reset process:
    1. Enter registered email address
    2. Enter new password with real-time strength indicator
  - Password strength feedback (Weak, Medium, Strong) with visual progress bar.
  - Password visibility toggle in reset form.
  - Success/error messages for each step.
  - Updates stored password and allows immediate login with new credentials.

- **Account page**
  - View and edit your name and email.
  - Optionally change your password.
  - Validates required fields and checks for duplicate email addresses.

- **Session handling**
  - Logged-in user and list of registered users are stored in `localStorage`.
  - Session persists across browser refresh until you log out.
  - Automatic session refresh after password reset.

- **Navigation and styling**
  - Navigation bar showing login/register links or current user + logout button.
  - Uses **React Router** for page navigation.
  - Uses **Bootstrap** (latest 5.x) for simple, clean styling.
  - Icon buttons using Bootstrap Icons (bi-icons) for visibility toggles.

### Technology Stack

- **React** (Vite, React 18+/19+ compatible)
- **React Router** for routing
- **Bootstrap 5** for styling
- **Bootstrap Icons** for icon components
- **localStorage** for simple client-side data persistence

### Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the development server**

   ```bash
   npm run dev
   ```

   Then open the printed URL in your browser (usually `http://localhost:5173`).

3. **Build for production**

   ```bash
   npm run build
   ```


## Notes

- This application performs **real-time client-side validation**.
- User data and session information are stored using **localStorage**.
- Since there is no backend, **clearing browser cache or site data will remove all registered users**.
