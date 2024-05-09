const createTaskForm = document.querySelector('#createTaskForm')
const titleInput = document.querySelector('#titleInput')
const taskList = document.querySelector('#taskList')
const listFilter = document.querySelector('#list_filter')

function Task(id, title, tags, isFinished) {
    this.id = id
    this.title = title
    this.tags = tags
    this.isFinished = isFinished
}

const tasks = [
    {
        id: 1,
        title: 'Buy cheeze',
        tags: ['cart','for_movie'],
    },
    {
        id: 2,
        title: 'Buy wine',
        tags: ['cart','for_movie','date'],
    },
    {
        id: 3,
        title: 'Buy love <3',
        tags: ['sex','for_movie','date', 'without_gf'],
    },
]





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
                            <button title="Finish the task" type="button" class="task-card-button button  pixel-corners--wrapper">
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

const updateListFilter = function(tasks) {
    const tagList = getTagList(tasks)
    for (let tagIndex = 0; tagIndex < tagList.length; tagIndex++ ){
        listFilter.options[tagIndex+1] = new Option(`${tagList[tagIndex]}`, `${tagList[tagIndex]}`)

    }
}

const renderTaskList = function (tasks, filterOption) { //,filterOption
    const filteredTasks = filterTasks(tasks, filterOption)
    console.log(`мы в рендере и фильтр опшна ${filterOption}, а таска отфильтрна`, filteredTasks)

    filteredTasks.forEach(({id, title, tags, isFinished, ...otherInfo}) => {
        // console.log(id, title, tags,isFinished, otherInfo)
        if (taskList.querySelector(`#taskItem-${id}`) === null) {
            const taskElement = createTaskCardElement({id, title, tags, isFinished})
            taskList.insertAdjacentElement('beforeend', taskElement)
        }
    })

}




//Работа со списками тегов (сужение расширение)
const tagLists = document.querySelectorAll('.task-card-tag-list');
tagLists.forEach((tagList) => {
    const tagItems = tagList.querySelectorAll('.task-card-tag-item');
    console.log()
    //Если в списке нет элементов
    if (tagList.children.length === 0) {
        tagList.style.top = '25px'
        tagList.event
    }


    for (let item = tagList.children.length; item--; item > 0) {
        console.log(`scrollWidth: ${tagList.scrollWidth-4}, clWidth: ${tagList.clientWidth}`)
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
    console.log('Сменились ёпты', this.value)
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

    renderTaskList(tasks, listFilter.value)
    updateListFilter(tasks)
    //Работа с инпутом после создания
    titleInput.value = ''
    titleInput.focus()
})