document.addEventListener("DOMContentLoaded", function() {
    const bookForm = document.getElementById("bookForm");
    const notStartedColumn = document.getElementById("notStartedColumn");
    const inProcessColumn = document.getElementById("inProcessColumn");
    const finishedColumn = document.getElementById("finishedColumn");
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Please log in to access your reading list.");
      window.location.href = "login.html";
      return;
    }
  
    // Fetch books for the logged-in user
    function fetchBooks() {
      fetch("/api/books", {
        headers: { "Authorization": "Bearer " + token }
      })
        .then(response => response.json())
        .then(data => {
          console.log("Fetched books:", data);
          renderBooks(data);
        })
        .catch(err => console.error("Error fetching books:", err));
    }
  
    // Render books in columns based on status
    function renderBooks(books) {
      // Clear columns but preserve headers
      notStartedColumn.innerHTML = "<h4>Not Started</h4>";
      inProcessColumn.innerHTML = "<h4>In Process</h4>";
      finishedColumn.innerHTML = "<h4>Finished</h4>";
  
      books.forEach(book => {
        const bookItem = document.createElement("div");
        bookItem.className = "book-item";
        bookItem.innerHTML = `
          <h5>${book.title}</h5>
          <p>by ${book.author}</p>
          <div>
            <button class="btn btn-sm btn-warning edit-btn" data-id="${book._id}">Edit</button>
            <button class="btn btn-sm btn-danger delete-btn" data-id="${book._id}">Delete</button>
          </div>
        `;
  
        // Normalize the status to lowercase and trim spaces
        const status = (book.status || "").toLowerCase().trim();
  
        if (status === "not started") {
          notStartedColumn.appendChild(bookItem);
        } else if (status === "in process") {
          inProcessColumn.appendChild(bookItem);
        } else if (status === "finished") {
          finishedColumn.appendChild(bookItem);
        } else {
          console.warn("Unknown book status:", book.status);
        }
  
        // Delete functionality
        bookItem.querySelector(".delete-btn").addEventListener("click", function() {
          if (confirm("Are you sure you want to delete this book?")) {
            deleteBook(book._id);
          }
        });
  
        // Edit functionality using prompts for simplicity
        bookItem.querySelector(".edit-btn").addEventListener("click", function() {
          editBook(book);
        });
      });
    }
  
    // Handle form submission to add a new book
    bookForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const title = document.getElementById("bookTitle").value;
      const author = document.getElementById("bookAuthor").value;
      const status = document.getElementById("bookStatus").value; // Ensure this is exactly "Not Started", "In Process", or "Finished"
      
      fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ title, author, status })
      })
        .then(response => response.json())
        .then(data => {
          bookForm.reset();
          fetchBooks();
        })
        .catch(err => console.error("Error adding book:", err));
    });
  
    // Delete a book
    function deleteBook(bookId) {
      fetch("/api/books/" + bookId, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
      })
        .then(response => response.json())
        .then(data => {
          alert(data.message || "Book deleted");
          fetchBooks();
        })
        .catch(err => console.error("Error deleting book:", err));
    }
  
    // Edit a book (using prompts for simplicity)
    function editBook(book) {
      const newTitle = prompt("Enter new title", book.title);
      const newAuthor = prompt("Enter new author", book.author);
      const newStatus = prompt("Enter new status (Not Started, In Process, Finished)", book.status);
      if (newTitle && newAuthor && newStatus) {
        fetch("/api/books/" + book._id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({ title: newTitle, author: newAuthor, status: newStatus })
        })
          .then(response => response.json())
          .then(data => {
            alert(data.message || "Book updated");
            fetchBooks();
          })
          .catch(err => console.error("Error updating book:", err));
      }
    }
  
    // Initial fetch of books
    fetchBooks();
  });
  