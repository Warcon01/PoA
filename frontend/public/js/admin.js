document.addEventListener("DOMContentLoaded", function() {
    const usersTableBody = document.querySelector("#usersTable tbody");
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Please log in as admin to access the admin dashboard.");
      window.location.href = "login.html";
      return;
    }
  
    // Fetch all users from the backend
    function fetchUsers() {
      fetch("/api/admin/users", {
        headers: { "Authorization": "Bearer " + token }
      })
        .then(response => response.json())
        .then(data => {
          renderUsers(data);
        })
        .catch(err => console.error("Error fetching users:", err));
    }
  
    // Render users in a table
    function renderUsers(users) {
      usersTableBody.innerHTML = "";
      users.forEach(user => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${user._id}</td>
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>
            <button class="btn btn-sm btn-danger delete-btn" data-id="${user._id}">Delete</button>
          </td>
        `;
        usersTableBody.appendChild(tr);
  
        tr.querySelector(".delete-btn").addEventListener("click", function() {
          if (confirm("Are you sure you want to delete this user?")) {
            deleteUser(user._id);
          }
        });
      });
    }
  
    // Delete a user by ID
    function deleteUser(userId) {
      fetch("/api/admin/users/" + userId, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
      })
        .then(response => response.json())
        .then(data => {
          alert(data.message || "User deleted successfully");
          fetchUsers();
        })
        .catch(err => console.error("Error deleting user:", err));
    }
  
    // Initial fetch
    fetchUsers();
  });
  