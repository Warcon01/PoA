document.addEventListener("DOMContentLoaded", () => {
    // Handle Registration
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("regUsername").value;
        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;
        
        fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password })
        })
          .then(response => response.json())
          .then(data => {
            alert(data.message || "Registration successful");
            window.location.href = "login.html";
          })
          .catch(err => {
            console.error("Registration error:", err);
            alert("Registration failed");
          });
      });
    }
  
    // Handle Login (2FA step 1)
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        
        fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        })
          .then(response => response.json())
          .then(data => {
            if (data.message === "2FA code sent to email") {
              alert("A 2FA code has been sent to your email. Please enter it on the next page.");
              localStorage.setItem("verifyEmail", email);
              window.location.href = "verify-2fa.html";
            } else {
              alert("Login failed: " + (data.message || "Invalid credentials"));
            }
          })
          .catch(err => {
            console.error("Login error:", err);
            alert("Login failed");
          });
      });
    }
  
    // Handle 2FA Verification
    const verify2FAForm = document.getElementById("verify2FAForm");
    if (verify2FAForm) {
      verify2FAForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("verifyEmail").value;
        const twoFactorCode = document.getElementById("twoFactorCode").value;
        
        fetch("/api/auth/verify-2fa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, twoFactorCode })
        })
          .then(response => response.json())
          .then(data => {
            if (data.token) {
              alert("2FA verification successful");
              localStorage.setItem("token", data.token);
              window.location.href = "weekly.html";
            } else {
              alert("2FA verification failed: " + (data.message || "Invalid code"));
            }
          })
          .catch(err => {
            console.error("2FA verification error:", err);
            alert("2FA verification failed");
          });
      });
    }
  
    // Handle Forgot Password
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");
    if (forgotPasswordForm) {
      forgotPasswordForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("forgotEmail").value;
        
        fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        })
          .then(response => response.json())
          .then(data => {
            alert(data.message || "Password reset email sent");
          })
          .catch(err => {
            console.error("Forgot password error:", err);
            alert("Failed to send password reset email");
          });
      });
    }
  
    // Handle Reset Password
    const resetPasswordForm = document.getElementById("resetPasswordForm");
    if (resetPasswordForm) {
      resetPasswordForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("resetEmail").value;
        const token = document.getElementById("resetToken").value;
        const newPassword = document.getElementById("newPassword").value;
        
        fetch("/api/auth/reset-password", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token, newPassword })
        })
          .then(response => response.json())
          .then(data => {
            alert(data.message || "Password reset successful");
            window.location.href = "login.html";
          })
          .catch(err => {
            console.error("Reset password error:", err);
            alert("Password reset failed");
          });
      });
    }
  });
  