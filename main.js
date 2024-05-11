const clientServerSwitch = document.querySelector("#clientServerSwitch")
const serverAuthForm = document.querySelector(".serverAuthForm")
const clearDataButton = document.querySelector("#clearDataButton")


const createTaskForm = document.querySelector('#createTaskForm')
const titleInput = document.querySelector('#titleInput')
const taskList = document.querySelector('#taskList')
const listFilter = document.querySelector('#list_filter')
const emptyCardElement = document.querySelector('.task-list-empty')

isDev = false

let currentOptionTag = 'all'




clearDataButton.addEventListener('click', (event)=>{
    localStorage.clear()
    window.location.reload()
})

clientServerSwitch.addEventListener('click', (event)=> {
    if (clientServerSwitch.checked) {
        // serverAuthForm.classList.remove('hidden')
        // // serverAuthForm.removeAttribute('hidden')
        // setTimeout(()=>{
        //     serverAuthForm.classList.add('showed')
        //     serverAuthForm.classList.remove('hide')
        // },300)

        serverAuthForm.classList.add('showed')
        serverAuthForm.classList.remove('hide')

    }
    else {
        // serverAuthForm.setAttribute('hidden', '')
        serverAuthForm.classList.add('hide')
        serverAuthForm.classList.remove('showed')
        // setTimeout(()=>{serverAuthForm.classList.add('hidden')},300)

    }
})





function Task(id, title, tags, isFinished) {
    this.id = id
    this.title = title
    this.tags = tags
    this.isFinished = isFinished
}

let tasks = [
    {
        id: 1,
        title: 'Buy popcorn',
        tags: ['cart','for_movie'],
        isFinished: true,
    },
    {
        id: 2,
        title: 'add tags by #tag in input',
        tags: ['hints','en'],
        isFinished: false,
    },
    {
        id: 3,
        title: 'Добавь теги, вписав #свой_тег в строке',
        tags: ['hints','ru'],
        isFinished: false,
    },
    {
        id: 4,
        title: 'Meet my love <3',
        tags: ['love','sex', 'dinosaurs'],
        isFinished: true,
    },
]

if (localStorage.getItem('tasks') != null ) tasks = JSON.parse(localStorage.getItem('tasks'))

saveTasks = function (tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}


console.log(tasks)

const getTaskIndexById = function (id) {
    for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
        isDev&&console.log('indexById log:\n',
            '\ntaskIndex', taskIndex,
            '\ntasks.length', tasks.length,
            '\ntasks[taskIndex].id', tasks[taskIndex].id,
            '\nid', id)
        if (tasks[taskIndex].id === id) {
            return taskIndex
        }
    }
    return null
}

const getTaskById = function (id) {
    for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
        if (tasks[taskIndex].id === id) {
            return tasks[taskIndex]
        }
    }
    return null
}

// const emptyCardElement = (()=>{
//     const cardElement = document.createElement('div')
//     cardElement.classList.add('task-list-empty', 'pixel-corners')
//     cardElement.innerHTML = `
//                 <h3 class="visually-hidden">Task list is empty</h3>
//                 <div class="task-list-empty-content">
//                     <h4 class="task-list-empty-title">GG</h4>
//                     <p class="task-list-empty-description">All your tasks is done!</p>
//                 </div>`
//     return(cardElement)
// })()

const createTaskCardElement = function({id, title, tags, isFinished, ...otherInfo}) {
    //Собираем новую task-карточку
    const newTaskCard = document.createElement("li")
    newTaskCard.classList.add('task-zone-item')
    newTaskCard.id = `taskItem-${id}`
    newTaskCard.innerHTML = `
                    <ul class="task-card-tag-list pixel-corners">
                    </ul>
                    <div class="task-card finished pixel-corners">
                        <h3 class="task-card-title">${title}</h3>
                        <div class="task-card-buttons">
                            <button title="Finish the task" type="button" class="task-card-button button-finish button  pixel-corners--wrapper">
                                <span class="visually-hidden">Finish the task</span>
                                V
                            </button>
                            <button title="Delete the task" type="button" class="task-card-button button button-delete pixel-corners--wrapper">
                                <span class="visually-hidden">Delete the task</span>
                                X
                            </button>
                        </div>

                    </div>`

    //Для каждого отобранного раннее тега мы создаём элемент
    const tagElements = []
    tags.forEach((tagItem)=> {
        const tagElement = document.createElement('li')
        tagElement.classList.add('task-card-tag-item')
        tagElement.textContent = tagItem
        tagElements.push(tagElement)
    })
    //Забираем наш новый список тегов в карточке и вставляем
    const newTagList = newTaskCard.querySelector('.task-card-tag-list')
    tagElements.forEach((tagElement) => {
        newTagList.insertAdjacentElement("beforeend", tagElement)
    })

    const finishButton = newTaskCard.querySelector('.button-finish')
    const deleteButton = newTaskCard.querySelector('.button-delete')

    finishButton.onclick = finishTask
    deleteButton.onclick = deleteTask

    //Проверка, выполнена ли задача
    if (isFinished) {
        newTaskCard.querySelector('.task-card').classList.add('finished')
    }
    else {
        newTaskCard.querySelector('.task-card').classList.remove('finished')
    }

    return(newTaskCard)
}


getTagList = function (tasks) {
    const tagList = []
    tasks.forEach((task) => {
        for (let tagIndex = 0; tagIndex < task.tags.length; tagIndex++) {
            if (tagList.find((findedTag)=>{return findedTag === task.tags[tagIndex]}) === undefined)
                tagList.push(task.tags[tagIndex])
        }
    })
    return tagList
}

filterTasks = function(tasks, filterOption){
    if (filterOption === 'all')
        return tasks
    else{
        const filteredTasks = []
        tasks.forEach((task) => {
            for (let tagIndex = 0; tagIndex < task.tags.length; tagIndex++) {
                if (task.tags[tagIndex] === filterOption) {
                    filteredTasks.push(task)
                    break
                }
            }
        })
        return filteredTasks
    }
}

const finishTask = function(){
    const taskItem = this.parentElement.parentElement.parentElement
    const taskCard = this.parentElement.parentElement
    const taskId = +(taskItem.id?.replace('taskItem-',''))
    const task = getTaskById(taskId)
    if (task.isFinished) {
        task.isFinished = false
        taskCard.classList.remove('finished')
    }
    else {
        task.isFinished = true
        taskCard.classList.add('finished')
    }

    saveTasks(tasks)
}

const deleteTask = function(){
    const taskItem = this.parentElement.parentElement.parentElement
    const taskId = +(taskItem.id?.replace('taskItem-',''))
    const taskIndex = getTaskIndexById(taskId)
    isDev&&console.log('deleteTask log:\n', 'taskitem:', taskItem, '\ntaskId:', taskId, '\ntaskIndex:', taskIndex)
    if (taskIndex != null) {
        tasks.splice(taskIndex, 1)
        taskItem.remove()
        updateListFilter(tasks)
        saveTasks(tasks)
    }

}



const updateListFilter = function(tasks) {
    const tagList = getTagList(tasks)
    if (!tagList.includes(currentOptionTag)) {
        currentOptionTag = 'all'
        renderTaskList(tasks, currentOptionTag)
    }
    isDev&&console.log('updateListFilter log:\ntasks: ',tasks, '\ntagList: ', tagList)
    listFilter.querySelectorAll('option').forEach((option)=>option.remove())
    listFilter.options[0] = new Option('All', 'all')
    for (let tagIndex = 0; tagIndex < tagList.length; tagIndex++ ){
        listFilter.options[tagIndex+1] = new Option(`${tagList[tagIndex]}`, `${tagList[tagIndex]}`)
    }
}

const renderTaskList = function (tasks, filterOption) { //,filterOption
    const tagList = getTagList(tasks)

    isDev&&console.log(`
    tasks: ${tasks}
    filterOption: ${filterOption}
    currentOptionTag: ${currentOptionTag} 
    if (hasTag): ${filterOption === 'all' || tagList.includes(filterOption)}
    `)

    if (filterOption === 'all' || tagList.includes(filterOption)) {
        emptyCardElement.classList.add('hidden')
        listFilter.querySelector(`option[value="${filterOption}"]`)?.setAttribute('selected', '')
        const filteredTasks = filterTasks(tasks, filterOption)

        filteredTasks.forEach(({id, title, tags, isFinished, ...otherInfo}) => {

            if (taskList.querySelector(`#taskItem-${id}`) === null) {
                const taskElement = createTaskCardElement({id, title, tags, isFinished})
                taskList.insertAdjacentElement('beforeend', taskElement)
            }
        })
    }
    else {
        emptyCardElement.classList.remove('hidden')
    }
}




//Работа со списками тегов (сужение расширение)
const tagLists = document.querySelectorAll('.task-card-tag-list');
tagLists.forEach((tagList) => {
    const tagItems = tagList.querySelectorAll('.task-card-tag-item');

    //Если в списке нет элементов
    if (tagList.children.length === 0) {
        tagList.style.top = '25px'
        tagList.event
    }


    for (let item = tagList.children.length; item--; item > 0) {
        isDev&&console.log(`scrollWidth: ${tagList.scrollWidth-4}, clWidth: ${tagList.clientWidth}`)
        if (tagList.scrollWidth-4 > tagList.clientWidth) {
            tagList.children.item(item).remove()
        }

        // if (tagList.scrollWidth > tagList.clientWidth) {
        // }
    }
    //Суть в том, чтобы если места нет,
    // то в конце добавляется айтем со счётчиком,
    // и пока оставшееся кол-во айтемов вместе с последним не влезет,
    //всё будет удаляться по очереди
    //С while аккуратней, у нас нет столько памяти
    // while (tagList.scrollWidth > tagList.clientWidth) {
    //
    // }
    //
    // if (tagList.scrollWidth > tagList.clientWidth) {
    //     tagList.append()
    // }
})

// if (tagList.scrollWidth > tagList.clientWidth) {
//     const numberOfTags = tagItems.length;
//
//     for (let i = 0; i< tagItems.length; i++) {
//         tagItems[i].classList.add('cancel-comma')
//     }
//     for (let i = 2; i < tagItems.length; i++) {
//         tagItems[i].classList.add('visually-hidden');
//     }
//
//     tagItems[1].textContent = `+${numberOfTags - 1}`;
// }






//Слушатель на изменеие фильтра:
listFilter.addEventListener("change", function (){
    currentOptionTag = this.value
    taskList.innerHTML = ``
    renderTaskList(tasks, this.value)
})
//Submit TaskForm






addEventListener("submit", (event)=>{
    event.preventDefault()
    //Дешифруем строку на теги и тайтл
    const taskTags = []
    let taskTitle = ''
    const taskInput = titleInput.value.split(' ')
    taskInput.forEach((word) => {
        if (word.startsWith('#')) {
            taskTags.push(word.replace('#', ''))
        }
        else {
            taskTitle+= ' ' + word
        }
    })
    taskTitle.trim()

    const newTask = new Task(~~(Math.random()*100), taskTitle, taskTags, false)
    tasks.push(newTask)
    saveTasks(tasks)

    renderTaskList(tasks, listFilter.value)
    updateListFilter(tasks)
    //Работа с инпутом после создания
    titleInput.value = ''
    titleInput.focus()
})


updateListFilter(tasks)
renderTaskList(tasks, 'all')
