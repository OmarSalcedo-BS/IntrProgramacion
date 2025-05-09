function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let taskList = document.getElementById("task-list");
    taskList.innerHTML = "";
    tasks.forEach(task => {
        let taskItem = document.createElement("li");
        taskItem.innerHTML = `<strong>${task.name}</strong> - ${task.description} - <strong>${task.fechalimite}</strong> - <em>${task.priority}</em>`;
        taskList.appendChild(taskItem);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("task-form").addEventListener("submit", function (event) {
        event.preventDefault();
        let task = document.getElementById("task").value;
        let description = document.getElementById("description").value;
        let priority = document.getElementById("priority").value;
        let taskList = document.getElementById("task-list");
        let fechalimite = document.getElementById("fechalimite").value;

        let taskItem = document.createElement("li");
        taskItem.innerHTML = `<strong>${task}</strong> - ${description} - <strong>${fechalimite}</strong> - <em>${priority}</em>`;

        taskList.appendChild(taskItem);
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push({ name: task, description: description, priority: priority, fechalimite: fechalimite});
        localStorage.setItem("tasks", JSON.stringify(tasks));

        document.getElementById("task").value = "";
        document.getElementById("description").value = "";  
        document.getElementById("priority").value = "";
        document.getElementById("fechalimite").value = "";
    });

    loadTasks();
})