document.addEventListener("DOMContentLoaded", function() {
    const addWeekBtn = document.getElementById("addWeekBtn");
    const weeksContainer = document.getElementById("weeksContainer");
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("Please log in to view your planner.");
      window.location.href = "login.html";
      return;
    }
  
    // Fetch planner for the logged-in user
    function fetchPlanner() {
      fetch("/api/planner", {
        headers: { "Authorization": "Bearer " + token }
      })
        .then(response => response.json())
        .then(data => {
          renderPlanner(data.weeks);
        })
        .catch(err => console.error("Error fetching planner:", err));
    }
  
    function renderPlanner(weeks) {
      weeksContainer.innerHTML = "";
      weeks.forEach(week => {
        const weekContainer = document.createElement("div");
        weekContainer.className = "week-container";
        weekContainer.dataset.weekId = week._id;
  
        // Week title with Delete Week button
        const titleDiv = document.createElement("div");
        titleDiv.style.display = "flex";
        titleDiv.style.justifyContent = "space-between";
        titleDiv.style.alignItems = "center";
        
        const title = document.createElement("h3");
        title.textContent = week.weekName;
        titleDiv.appendChild(title);
  
        const deleteWeekBtn = document.createElement("button");
        deleteWeekBtn.textContent = "Delete Week";
        deleteWeekBtn.className = "btn btn-danger btn-sm";
        deleteWeekBtn.addEventListener("click", function() {
          if (confirm("Are you sure you want to delete this week?")) {
            deleteWeek(week._id);
          }
        });
        titleDiv.appendChild(deleteWeekBtn);
  
        weekContainer.appendChild(titleDiv);
  
        const row = document.createElement("div");
        row.className = "row";
        weekContainer.appendChild(row);
  
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        days.forEach(day => {
          const col = document.createElement("div");
          col.className = "col day-column";
          col.dataset.day = day;
  
          const dayHeader = document.createElement("h5");
          dayHeader.textContent = day;
          col.appendChild(dayHeader);
  
          const taskList = document.createElement("div");
          taskList.className = "task-list";
          col.appendChild(taskList);
  
          if (week.days && week.days[day]) {
            week.days[day].forEach(task => {
              const taskItem = createTaskItem(task.text, task.completed, week._id, day);
              taskList.appendChild(taskItem);
            });
          }
  
          const taskInput = document.createElement("input");
          taskInput.type = "text";
          taskInput.className = "form-control form-control-sm mt-2";
          taskInput.placeholder = "Add task...";
          taskInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter" && taskInput.value.trim() !== "") {
              e.preventDefault();
              const taskText = taskInput.value.trim();
              taskInput.value = "";
              const taskItem = createTaskItem(taskText, false, week._id, day);
              taskList.appendChild(taskItem);
  
              // Update local week object and send update to backend
              if (!week.days[day]) {
                week.days[day] = [];
              }
              week.days[day].push({ text: taskText, completed: false });
              updateWeek(week._id, { days: week.days });
            }
          });
          col.appendChild(taskInput);
  
          row.appendChild(col);
        });
  
        weeksContainer.appendChild(weekContainer);
      });
    }
  
    function createTaskItem(taskText, completed, weekId, day) {
      const taskItem = document.createElement("div");
      taskItem.className = "task-item";
      if (completed) taskItem.classList.add("completed");
  
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "form-check-input me-2";
      checkbox.checked = completed;
      taskItem.appendChild(checkbox);
  
      const span = document.createElement("span");
      span.textContent = taskText;
      taskItem.appendChild(span);
  
      // Delete button for task
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "btn btn-sm btn-danger ms-2";
      taskItem.appendChild(deleteBtn);
  
      checkbox.addEventListener("change", function() {
        updateTaskStatus(weekId, day, taskText, checkbox.checked);
        if (checkbox.checked) {
          taskItem.classList.add("completed");
        } else {
          taskItem.classList.remove("completed");
        }
      });
  
      deleteBtn.addEventListener("click", function() {
        // Remove task from UI
        taskItem.remove();
        removeTask(weekId, day, taskText);
      });
  
      return taskItem;
    }
  
    function updateWeek(weekId, updatedData) {
      fetch("/api/planner/week/" + weekId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(updatedData)
      })
        .then(response => response.json())
        .then(data => {
          console.log("Week updated:", data);
        })
        .catch(err => console.error("Error updating week:", err));
    }
  
    function updateTaskStatus(weekId, day, taskText, completed) {
      fetch("/api/planner", {
        headers: { "Authorization": "Bearer " + token }
      })
        .then(response => response.json())
        .then(planner => {
          const week = planner.weeks.find(w => w._id === weekId);
          if (!week) return;
          const dayTasks = week.days[day];
          if (!dayTasks) return;
          const task = dayTasks.find(t => t.text === taskText);
          if (task) {
            task.completed = completed;
            updateWeek(weekId, { days: week.days });
          }
        })
        .catch(err => console.error("Error updating task status:", err));
    }
  
    function removeTask(weekId, day, taskText) {
      fetch("/api/planner", {
        headers: { "Authorization": "Bearer " + token }
      })
        .then(response => response.json())
        .then(planner => {
          const week = planner.weeks.find(w => w._id === weekId);
          if (!week) return;
          if (!week.days[day]) return;
          week.days[day] = week.days[day].filter(t => t.text !== taskText);
          updateWeek(weekId, { days: week.days });
        })
        .catch(err => console.error("Error removing task:", err));
    }
  
    function deleteWeek(weekId) {
      fetch("/api/planner/week/" + weekId, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
      })
        .then(response => response.json())
        .then(data => {
          console.log("Week deleted:", data);
          fetchPlanner();
        })
        .catch(err => console.error("Error deleting week:", err));
    }
  
    addWeekBtn.addEventListener("click", () => {
      const weekName = prompt("Enter the week name:");
      if (weekName) {
        fetch("/api/planner/week", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({ weekName })
        })
          .then(response => response.json())
          .then(data => {
            console.log("Week added:", data);
            fetchPlanner();
          })
          .catch(err => console.error("Error adding week:", err));
      }
    });
  
    // Initial fetch of the planner
    fetchPlanner();
  });
  