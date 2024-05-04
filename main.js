const taskForm = document.querySelector("#form-add-task")
const addButton = document.getElementById("btn-add")
const inputTask = taskForm.querySelector('#task_name')
const taskList = document.querySelector('#task-list')
const emptyCard = document.querySelector("#card-empty")
console.log(inputTask)

emptyCard.hidden = taskList.children.length > 1;

const checkTask = () => {
    if (taskList.children.length > 1) {
        emptyCard.hidden = true
    }
    else {
        emptyCard.hidden = false
    }
}


const addTask = (event) => {
    // event.preventDefault()
    if (inputTask.validity.valid) {
        const taskName = inputTask.value
        cardHtml = `<div class="task-card">
                <div class="card-text">${taskName}</div>
                <div class="card-buttons">
                    <button
                            class="button-done button rounded"
                            type="button"
                            title="done"
                    >V</button>
                    <button
                            class="button-delete button rounded"
                            type="button"
                            title="delete"
                    >X</button>
                </div>
            </div>`
        taskList.insertAdjacentHTML("beforeend", cardHtml)
        inputTask.value = ""
        inputTask.focus()
    }
    checkTask()
}

const deleteTask = (event) => {
    if (event.target.classList.contains('button-delete') ) {
        event.target.parentElement.parentElement.remove()
    }
    else if (event.target.classList.contains('button-done') ) {
        if (event.target.parentElement.parentElement.classList.contains('done') ){
            event.target.parentElement.parentElement.classList.remove('done')
        }
        else {
            event.target.parentElement.parentElement.classList.add('done')
        }
    }
    checkTask()
}

taskList.addEventListener('click', deleteTask)

