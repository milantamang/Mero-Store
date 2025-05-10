// This file shows the changes you need to make to the existing Login.jsx file

// Add this link near the existing links for "Forgot Password" and "Register"

// After the "Register Here" link, add:
<div className="mt-2 font-semibold text-sm text-slate-500 text-center md:text-left">
  <Link
    className="text-blue-600 hover:underline hover:underline-offset-4"
    to="/login-with-otp"
  >
    Login with OTP
  </Link>
</div>

// Also, let's add a link to verify email in case the user isn't verified:
{isLoggedIn && user && !user.email_verified && (
  <div className="mt-4 bg-yellow-100 text-yellow-800 p-3 rounded">
    <p className="text-sm">
      Your email is not verified. 
      <Link
        to="/verify-email-otp"
        className="ml-1 font-semibold underline"
      >
        Verify now
      </Link>
    </p>
  </div>
)}