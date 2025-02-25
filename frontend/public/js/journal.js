document.addEventListener("DOMContentLoaded", function() {
    const journalForm = document.getElementById("journalForm");
    const journalTimeline = document.getElementById("journalTimeline");
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Please log in to access your journal.");
      window.location.href = "login.html";
      return;
    }
  
    // Fetch journal entries for the logged-in user
    function fetchJournalEntries() {
      fetch("/api/journals", {
        headers: { "Authorization": "Bearer " + token }
      })
        .then(response => response.json())
        .then(entries => {
          renderTimeline(entries);
        })
        .catch(err => console.error("Error fetching journal entries:", err));
    }
  
    // Render timeline with alternating layout and action buttons
    function renderTimeline(entries) {
      journalTimeline.innerHTML = "";
      if (!entries || entries.length === 0) {
        journalTimeline.innerHTML = "<p class='text-center'>No journal entries yet. Start writing your thoughts!</p>";
        return;
      }
      // Sort entries by date descending (most recent first)
      entries.sort((a, b) => new Date(b.date) - new Date(a.date));
      entries.forEach((entry, index) => {
        const li = document.createElement("li");
        li.className = "timeline-item " + (index % 2 === 0 ? "timeline-item-left" : "timeline-item-right");
  
        li.innerHTML = `
          <div class="card shadow-sm mb-4">
            <div class="card-header">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <strong>${entry.name}</strong>
                  <small class="text-muted">${new Date(entry.date).toLocaleDateString()}</small>
                </div>
                <div>
                  <button class="btn btn-sm btn-warning edit-btn" data-id="${entry._id}">Edit</button>
                  <button class="btn btn-sm btn-danger delete-btn" data-id="${entry._id}">Delete</button>
                </div>
              </div>
            </div>
            <div class="card-body">
              <p class="card-text">${entry.content}</p>
            </div>
          </div>
        `;
        journalTimeline.appendChild(li);
  
        // Delete functionality
        li.querySelector(".delete-btn").addEventListener("click", function() {
          if (confirm("Are you sure you want to delete this entry?")) {
            deleteJournalEntry(entry._id);
          }
        });
  
        // Edit functionality
        li.querySelector(".edit-btn").addEventListener("click", function() {
          editJournalEntry(entry);
        });
      });
    }
  
    // Handle new journal entry submission
    journalForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const date = document.getElementById("entryDate").value;
      const name = document.getElementById("entryName").value;
      const content = document.getElementById("entryContent").value;
  
      fetch("/api/journals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ date, name, content })
      })
        .then(response => response.json())
        .then(data => {
          journalForm.reset();
          fetchJournalEntries();
        })
        .catch(err => console.error("Error adding journal entry:", err));
    });
  
    // Delete journal entry
    function deleteJournalEntry(journalId) {
      fetch("/api/journals/" + journalId, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
      })
        .then(response => response.json())
        .then(data => {
          alert(data.message || "Entry deleted");
          fetchJournalEntries();
        })
        .catch(err => console.error("Error deleting journal entry:", err));
    }
  
    // Edit journal entry using prompts for simplicity
    function editJournalEntry(entry) {
      const newName = prompt("Enter new title", entry.name);
      const newDate = prompt("Enter new date (YYYY-MM-DD)", new Date(entry.date).toISOString().slice(0,10));
      const newContent = prompt("Enter new content", entry.content);
      if (newName && newDate && newContent) {
        fetch("/api/journals/" + entry._id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({ name: newName, date: newDate, content: newContent })
        })
          .then(response => response.json())
          .then(data => {
            alert(data.message || "Entry updated");
            fetchJournalEntries();
          })
          .catch(err => console.error("Error updating journal entry:", err));
      }
    }
  
    // Initial fetch
    fetchJournalEntries();
  });
  