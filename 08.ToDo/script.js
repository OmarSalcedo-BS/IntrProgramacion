let draggedTask = null;
let allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    window.cleanTask = function () {
        if(confirm('¿Estás seguro de que quieres borrar todas las tareas? ')) {
        localStorage.removeItem('tasks');
        document.getElementById('todo').innerHTML = '';
        document.getElementById('in-progress').innerHTML = '';
        document.getElementById('done').innerHTML = '';
        console.log('Todas las tareas han sido eliminadas');
        alert('¡Todas las tareas han sido limpiadas!');
        } else {
            console.log('Limpieza de tareas cancelada')
        }
    }
});

function addTask(columnId){
    const taskText = prompt("Escribe la tarea:");
    if(taskText){
        const task = document.createElement("div");
        task.className = "task";
        task.textContent = taskText;
        task.draggable = true;
        
       
        const taskId = `task-${Date.now()}`;
        task.id = taskId; 

        addDragAndDropEvents(task);
        document.getElementById(columnId).appendChild(task);
        const newTaskObject = {
            id: taskId,
            text: taskText,
            column: columnId 
        };
        allTasks.push(newTaskObject);
        saveTasks();
    }
}

function addDragAndDropEvents(task) {
    task.addEventListener("dragstart", (e) => {
        draggedTask = task;
        task.classList.add("dragging");
        e.dataTransfer.setData("text/plain", task.id); 
    });

    task.addEventListener("dragend", (e) => {
        e.preventDefault();
        task.classList.remove("dragging");
        draggedTask = null;
        saveTasks(); 
    });
}

function setupColumnsEvents(){
    document.querySelectorAll(".task-list").forEach(list => {
        list.addEventListener("dragover", (e) => {
            e.preventDefault();
            list.style.background = "#f0f0f0";
        });

        list.addEventListener("dragleave", (e) => {
            e.preventDefault();
            list.style.background = "transparent";
        });

        list.addEventListener("drop", (e) => {
            e.preventDefault();
            if (draggedTask) {
                list.appendChild(draggedTask);
                list.style.background = "transparent";
                const targetColumnId = list.id;
                const taskId = draggedTask.id; 

                const taskIndex = allTasks.findIndex(task => task.id === taskId);
                if (taskIndex !== -1) {
                    allTasks[taskIndex].column = targetColumnId;
                    saveTasks(); 
                }
            }
        });
    });
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(allTasks));
}


function loadTasks() {
    allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    allTasks.forEach(taskData => {
        const column = document.getElementById(taskData.column);
        if (column) { 
            const task = document.createElement("div");
            task.className = "task";
            task.textContent = taskData.text;
            task.draggable = true;
            task.id = taskData.id; 

            addDragAndDropEvents(task); 
            column.appendChild(task);
        }
    });
}

setupColumnsEvents();