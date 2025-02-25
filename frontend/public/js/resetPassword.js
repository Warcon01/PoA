function getQueryParams() {
    const params = {};
    window.location.search
      .substring(1)
      .split("&")
      .forEach((param) => {
        const [key, value] = param.split("=");
        params[decodeURIComponent(key)] = decodeURIComponent(value || "");
      });
    return params;
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    // Parse token from URL and set hidden input value
    const params = getQueryParams();
    if (params.token) {
      document.getElementById("resetToken").value = params.token;
    } else {
      alert("No reset token provided in the URL.");
    }
  
    // Optionally pre-fill the email field if provided in URL (if desired)
    if (params.email) {
      document.getElementById("resetEmail").value = params.email;
    }
  
    // Handle the reset password form submission
    const resetPasswordForm = document.getElementById("resetPasswordForm");
    resetPasswordForm.addEventListener("submit", function(e) {
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
  });
  