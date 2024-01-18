let form = document.getElementById("form");
let textInput = document.getElementById("textInput");
let dateInput = document.getElementById("dateInput");
let textarea = document.getElementById("textarea");
let msg = document.getElementById("msg");
let tasks = document.getElementById("tasks");
let add = document.getElementById("add");
let updating = false;
let updateId = undefined;
let updateElement = undefined;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formValidation();
});

let formValidation = () => {
  if (textInput.value === "") {
    console.log("failure");
    msg.innerHTML = "Task cannot be blank";
  } else {
    console.log("success");
    msg.innerHTML = "";
    acceptData();
    add.setAttribute("data-bs-dismiss", "modal");
    add.click();

    if (updating) {
        deleteTask(updateElement, updateId);
        updating = false;
        updateId = undefined;
    }
    (() => {
      add.setAttribute("data-bs-dismiss", "");
    })();
  }
};

let data = [{}];
const apiUrl = "http://localhost:3000/api/tasks";

let acceptData = () => {
    const newData = {
        task: textInput.value,
        dueDate: dateInput.value,
        description: textarea.value,
    }

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)
    })
    .then(res => res.json())
    .then(res => {
        data.push(res);
        createTasks();
    });

};

let createTasks = () => {
  tasks.innerHTML = "";
  data.map((x, y) => {
    return (tasks.innerHTML += `
    <div id=${y}>
          <span class="fw-bold">${x.task}</span>
          <span class="small text-secondary">${x.dueDate}</span>
          <p>${x.description}</p>
  
          <span class="options">
            <i onClick= "editTask(this, '${x._id}')" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
            <i onClick ="deleteTask(this, '${x._id}');createTasks()" class="fas fa-trash-alt"></i>
          </span>
        </div>
    `);
  });

  resetForm();
};

let deleteTask = (e, id) => {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    })
    .then(res => {
        data.splice(e.parentElement.parentElement.id, 1); 
        createTasks();
    });
};

let editTask = (e, id) => {
    updating = true;
    updateId = id;
    updateElement = e;
    let selectedTask = e.parentElement.parentElement;

    textInput.value = selectedTask.children[0].innerHTML;
    dateInput.value = selectedTask.children[1].innerHTML;
    textarea.value = selectedTask.children[2].innerHTML;
};

let resetForm = () => {
  textInput.value = "";
  dateInput.value = "";
  textarea.value = "";
};

(() => {
    fetch(apiUrl)
    .then(res => res.json())
    .then(res => {
        data = res || []
        console.log(data);
        createTasks();
    });
})();