import TaskList from "./TaskList.js"
import Task from "./Task.js"
import Beautify from "./Beautify.js"

/** Array of Lists and their Tasks 
 * @Array [ [ {List}, [ {task},{task} ] ] , [ {List}, [ {task},{task} ] ] ]*/
let arrayOfTaskLists = JSON.parse(localStorage.getItem('arrayOfTaskLists')) || [];

/** Variable to check if tasks are beeing sorted */
let isSorted = false
/** Variable to check if sorted is for done or not*/
let isDone = false

/** Loads functions when loading the website */
window.addEventListener('load',()=>{
    if(window.location.href.includes('index')){
        newTaskForm()
        warnFormFillOk()
        sortDoneEvent()
        sortNotDoneEvent()
        searchTaskEvent()
        searchCategoryEvent()
        setDate()
        colorPageEvent()
        sortByDateEvent()
        sortByLateEvent()
        loadStorage()
        loadColors()
    } else if(window.location.href.includes('colors')){
        startingColors()
        colorChangeEvent()
        colorOkEvent()
    }
})

function loadColors(){
    if(JSON.parse(localStorage.getItem('colors'))){
        const colorsString = JSON.parse(localStorage.getItem('colors'))
        const reColorObj = new Beautify(colorsString.enoughTime,colorsString.enoughTimeColor,colorsString.shortTime,colorsString.shortTimeColor,colorsString.noTimeColor)
        reColorObj.updateColors()
    }
    
}

function colorPageEvent(){
    document.querySelector('#color-menu-start').addEventListener('click', ()=>{
        window.location = "http://127.0.0.1:5500/colors.html"
    })
}
/**
 * atribues starting color values to color selectors
 */
function startingColors(){
    if(!JSON.parse(localStorage.getItem('colors'))){
        document.querySelector('#enough-time').value ='#ffff7d'
        document.querySelector('#short-time').value ='#ffbe32'
        document.querySelector('#no-time').value ='#ff0000'
    } else{
        const colorsString = JSON.parse(localStorage.getItem('colors'))
        console.log(colorsString)
        document.querySelector('#enough-time').value = colorsString.enoughTimeColor
        document.querySelector('#short-time').value = colorsString.shortTimeColor
        document.querySelector('#no-time').value = colorsString.noTimeColor
        document.querySelector('#enough-time').style.backgroundColor = colorsString.enoughTimeColor
        document.querySelector('#short-time').style.backgroundColor = colorsString.shortTimeColor
        document.querySelector('#no-time').style.backgroundColor = colorsString.noTimeColor
        document.querySelector('#enough-time-text').value = colorsString.enoughTime
        document.querySelector('#short-time-text').value = colorsString.shortTime
    }
}

/**
 * Adds event to color selector to change own background
 */
function colorChangeEvent(){
    document.querySelectorAll('.input-color').forEach((element)=>{
        element.addEventListener('change',()=>{
            element.style.backgroundColor = element.value
        })
    })
}

/**
 * add event to color popup buttonOk
 */
function colorOkEvent(){
    document.querySelector('#color-popup-ok').addEventListener('click',()=>{
        createColorObj()
    })
}

/**
 * gets all the values in colors popup and create object
 */
function createColorObj(){
    const enoughtColor = document.querySelector('#enough-time').value
    let enoughtText = document.querySelector('#enough-time-text').value
    const shortColor = document.querySelector('#short-time').value
    let shortText = document.querySelector('#short-time-text').value
    const noColor = document.querySelector('#no-time').value

    if(enoughtText == ''){
        enoughtText = 10
    }
    if(shortText == ''){
        shortText = 2
    }

    const colorObj = new Beautify(enoughtText,enoughtColor,shortText,shortColor,noColor)
    localStorage.setItem('colors', JSON.stringify(colorObj)); 
    window.location = "http://127.0.0.1:5500/index.html"
}



/**
 * Creates listener for sort date
 */
function sortByDateEvent(){
    document.querySelector("#sort-date").addEventListener('click', ()=>{
        reorderByDate()
        rearrangeOrder()
        reorderHTML()
    })
}

/**
 * goes to all tasks and reorders array acording to dateId
 */
function reorderByDate(){
    arrayOfTaskLists.forEach((list)=>{
        list[1].forEach(()=>{
            let done = false;
            while (!done){
                done = true
                for (let i = 0; i < list[1].length - 1; i++) { 
                    if (list[1][i].dateId > list[1][i+1].dateId) {
                        let temp = list[1][i];
                        list[1][i] = list[1][i + 1];
                        list[1][i + 1] = temp;
                        done = false
                    }
                }
            }
        })
    })
}

/**
 * goes to all tasks and reorders html acording to array order
 */
function rearrangeOrder(){
    arrayOfTaskLists.forEach((list)=>{
        list[1].forEach((element)=>{
            element.orderNumber = list[1].indexOf(element)
        })
    })
}

/**
 * adds event listener for sort late
 */
function sortByLateEvent(){
    document.querySelector("#sort-late").addEventListener('click', ()=>{
        sortByLate()
    })
}

/**
 * looks for tasks overdue
 */
function sortByLate(){
    const currentDate = new Date().getTime()
    arrayOfTaskLists.forEach((list)=>{
        list[1].forEach((task)=>{
            if(task.dateId > currentDate){
                doShowLate(task.id)
            }else{
                doHideOnTime(task.id)
            }
        })
    })
}

/**
 * shows ouverdue tasks
 * @param {*} elementId <- task
 */
function doShowLate(elementId){
    const element = document.getElementById(elementId)
    element.style.animation = "taskSortOut 1s"
    setTimeout(()=>{
        element.style.display = 'none'
    },1000)
}

/**
 * hides tasks that are not yet overdue
 * @param {*} elementId <- task
 */
function doHideOnTime(elementId){
    const element = document.getElementById(elementId)
    element.style.animation = "taskSortIn 1s"
    element.style.display = 'flex'

}

/**
 * Sets default date in form to next day
 */
function setDate(){
    const today = new Date();
    today.setDate(today.getDate() + 1);
    document.getElementById('date-task-input').value = today.toISOString().substr(0, 10);
}

/** 
 * Create eventListener in the newTask form 
 */
function newTaskForm(){
    document.querySelector("#new-task-form").addEventListener('submit',(form)=>{
        form.preventDefault()
        const newTaskCategory = document.querySelector("#category-task-input")
        const newTaskName = form.target.elements.content.value
        const finishDate = rearrangeDate()
        if(!newTaskName || !newTaskCategory.value){
            warnFormFillPopup()
        } else{
            if(!checkTaskList(newTaskCategory.value)){
                createTaskListObj(newTaskCategory.value)
                createTaskObj(newTaskName,newTaskCategory.value,finishDate)
            } else{
                createTaskObj(newTaskName,newTaskCategory.value,finishDate) 
            }
            form.target.reset()
            newTaskCategory.value = ""
            saveToStorage()
        }
    })
}

/**
 * Gets the date input and converts to array
 * @returns <- date (array) [day,month,year]
 */
function rearrangeDate(){
    const dateArray = (document.querySelector('#date-task-input').value).split('')
    const year = dateArray[0]+dateArray[1]+dateArray[2]+dateArray[3]
    const month = dateArray[5]+dateArray[6]
    const day = dateArray[8]+dateArray[9]
    const finalDateArray = [day,month,year]
    return(finalDateArray)
}

/**
 * Shows the popup when the form isn't complete
 */
function warnFormFillPopup(){
    document.querySelector("#form-popup p").innerText = "Please fill out the form."
    document.querySelector("#background-fade-form").classList.add('active')
    document.querySelector("#form-popup").classList.add('active')
}

/**
 * Creates event that hides the popup when Ok is clicked
 */
function warnFormFillOk(){
    document.querySelector("#form-popup-ok").addEventListener('click',()=>{
        document.querySelector("#background-fade-form").classList.remove('active')
        document.querySelector("#form-popup").classList.remove('active')
    })
}

/**
 * Takes task category and checks exist in list
 * @param {*} name <- New Task Category
 */
function checkTaskList(name){
    const filteredArray = arrayOfTaskLists.filter((element) => {
        if(element[0].taskListName === name){
            return true
        }
    }) 
    if(filteredArray[0]){
        return true
    } else{
        return false
    }
}

/**
 * Creates taskList obj, adds to array, calls for html creation
 * @param {*} name <- New Task Category
 */
function createTaskListObj(name){
    const listId = String(new Date().getTime()) + '22'
    const listObj = new TaskList(name,listId)
    createTaskListHtml(listObj)
    arrayOfTaskLists.push([listObj,[]])
}

/**
 * Takes Obj of task list and creates its HTML
 * @param {*} object <- task list
 */
function createTaskListHtml(object){
    object.doCreateHTML()
    object.makeDragContainer()
}

/**
 * Creates the new task Obj, adds to array, calls for html creation
 * @param {*} taskName <- New Task Name
 * @param {*} taskCategory <- New Task Category
 */
function createTaskObj(taskName,taskCategory,date){
    const taskId = String(new Date().getTime()) + '11'
    const orderNumber = getOrderNumber(taskCategory)
    const dateGetTime = new Date(`${date[2]}-${date[1]}-${date[0]}`).getTime()
    const taskObj = new Task(taskName,false,taskId,taskCategory,orderNumber,date,dateGetTime)
    createtaskDOM(taskObj)
    arrayOfTaskLists.forEach((taskList)=>{
        if(taskList[0].taskListName === taskCategory){
            taskList[1].push(taskObj)
        }
    })
}

/**
 * Takes Obj of task and creates its HTML
 * @param {*} object <- task 
 */
function createtaskDOM(taskObj){
    taskObj.doCreateHTML()
    taskObj.doCheckboxEvent(arrayOfTaskLists)
    taskObj.doEditEvent(arrayOfTaskLists)
    taskObj.doDeleteEvent(arrayOfTaskLists)
    createDraggables(taskObj)
    sortDoneNotDone(taskObj)
}
/**
 * Gets a category and looks for the number of members to add order
 * @param {*} taskCategory <- Category to look for
 * @returns Order Number = Lenght of category array
 */
function getOrderNumber(taskCategory){
    const getListArray = arrayOfTaskLists.filter((element)=>{
        if(element[0].taskListName === taskCategory){
            return true
        }
    })
    return getListArray[0][1].length
}

/**
 * Create event on sort done button
 */
function sortDoneEvent(){
    document.querySelector("#sort-done").addEventListener('click', ()=>{
        arrayOfTaskLists.forEach((tasklist)=>{
            tasklist[1].forEach((task)=>{
                isSorted = true
                isDone = true
                sortDoneNotDone(task)
            })
        })
    })
}

/**
 * Create event on sort not done button
 */
function sortNotDoneEvent(){
    document.querySelector("#sort-not-done").addEventListener('click', ()=>{
        arrayOfTaskLists.forEach((tasklist)=>{
            tasklist[1].forEach((task)=>{
                isSorted = true
                isDone = false
                sortDoneNotDone(task)
            })
        })
    })
}

/**
 * Gets a task and displays or hides depenging on global LETs: isSorted, isDone
 * @param {*} task <- 
 */
function sortDoneNotDone(task){
    const taskDOM = document.getElementById(`${task.id}`)
    if(isSorted == true && isDone == true){
        if(task.done){
            taskDOM.style.animation = "taskSortIn 1s"
            taskDOM.style.display = "flex"
        } else{
            taskDOM.style.animation = "taskSortOut 1s"
            setTimeout(()=>{
                taskDOM.style.display = 'none'
            },1000)
        }
    } else if(isSorted == true && isDone == false){
        if(!task.done){
            taskDOM.style.animation = "taskSortIn 1s"
            taskDOM.style.display = "flex"
        } else{
            taskDOM.style.animation = "taskSortOut 1s"
            setTimeout(()=>{
                taskDOM.style.display = 'none'
            },1000)
        }
    }
}

/**
 * Adds event to click on search for task
 */
function searchTaskEvent(){
    document.querySelector("#search-container").addEventListener('submit',(searchForm)=>{
        searchForm.preventDefault()
        const value = document.querySelector("#search-task-input").value
        searchTask(value)
    })
}

/**
 * Looks for tasks that have value included in their name
 * @param {*} value <- Search task input
 */
function searchTask(value){
    const showArray = []
    arrayOfTaskLists.forEach((tasklist)=>{
        tasklist[1].forEach((task)=>{
            if(task.content.includes(String(value))){
                showArray.push(task)
            } 
        })
    })
    getSearchedTask(showArray)
}

/**
 * Looks for DOM elements with ID equal to elements in taskArray
 * @param {*} taskArray <- tasks with value included in
 */
function getSearchedTask(taskArray){
    const showArray = []
    const taskDomArray = document.querySelectorAll('.task')
    taskArray.forEach((value)=>{
        taskDomArray.forEach((element)=>{
            if(value.id == element.id){
                showArray.push(element)
            }
        })
    })
    showHideSearched(taskDomArray,showArray)
}

/**
 * Adds event to click on search for task
 */
function searchCategoryEvent(){
    document.querySelector("#category-search-container").addEventListener('submit',(catSearchForm)=>{
        catSearchForm.preventDefault()
        const value = document.querySelector("#search-category-input").value
        searchCategory(value)
    })
}

/**
 * Looks for task lists that have value included in their name
 * @param {*} value <- Search task list name
 */
function searchCategory(value){
    const catArray = []
    arrayOfTaskLists.forEach((element)=>{
        if(element[0].taskListName.includes(value)){
            catArray.push(element[0])
        }
    })
    getSearchedCategory(catArray)
}

/**
 * Looks for DOM elements with ID equal to elements in objArray
 * @param {*} objArray <- lists with value included in
 */
function getSearchedCategory(objArray){
    const filteredArray = []
    const domArray = document.querySelectorAll('.tasks-container')
    objArray.forEach((objElement)=>{
        domArray.forEach((domElement)=>{
            if(objElement.taskListId == domElement.id){
                filteredArray.push(domElement)
            }
        })
    })
    showHideSearched(domArray,filteredArray)
}

/**
 * Shows hides everything, show only desired elements
 * @param {*} showArray <- elements with value included in
 * @param {*} hideArray <- all DOM tasks or lists
 */
function showHideSearched(hideArray,showArray){
    hideArray.forEach((element)=>{
        element.style.animation = "taskSortOut 1s"
        setTimeout(()=>{
            element.style.display = 'none'
        },1000)
    })
    showArray.forEach((element)=>{
        element.style.animation = "taskSortIn 1s"
        setTimeout(()=>{
            element.style.display = 'flex'
        },1000)
    })
    
}

/**
 * Takes an object and adds drag events to it's html
 * @param {*} taskObj <- Task object
 */
function createDraggables(taskObj){
    taskObj.arrayDOM[1].addEventListener('dragstart', ()=>{
        taskObj.arrayDOM[1].classList.add('dragging')
        taskObj.arrayDOM[1].style.animation = "taskSortOut 0s"
    })
    
    taskObj.arrayDOM[1].addEventListener('dragend', ()=>{
        taskObj.arrayDOM[1].classList.remove('dragging')
        taskObj.arrayDOM[1].style.animation = "taskSortIn 1s"
        if(taskObj.arrayDOM[1].nextSibling){
            dragendHasNextSibling(taskObj)
        } else{
            dragendHasNoNextSibling(taskObj)
        }
        
        reorderTasks(taskObj)
        reorderHTML()
        deleteEmptyListsArray()
        saveToStorage()
    })
}

/**
 * On dragend, when next sibling = true
 * @param {*} taskObj <- Object of Task class
 */
function dragendHasNextSibling(taskObj){
    const sibling = taskObj.arrayDOM[1].nextSibling.id
    const indexOfSibling = getSiblingIndexArray(sibling)
    changeCategory(taskObj,indexOfSibling)
    changeArrayCategory(taskObj.id,indexOfSibling)
    const self = spliceSelf(taskObj.id)[0]
    insertSelfBefore(self,indexOfSibling)
}

/**
 * On dragend, when next sibling = false
 * @param {*} taskObj <- Object of Task class
 */
function dragendHasNoNextSibling(taskObj){
    const sibling = taskObj.arrayDOM[1].previousSibling.id
    const indexOfSibling = getSiblingIndexArray(sibling)
    changeCategory(taskObj,indexOfSibling)
    changeArrayCategory(taskObj.id,indexOfSibling)
    const self = spliceSelf(taskObj.id)[0]
    insertSelfAfter(taskObj,self)
    
}

/**
 * Looks for empty list in array
 */
function deleteEmptyListsArray(){
    arrayOfTaskLists.forEach((list)=>{
        if(!list[1].length){
            deleteEmptyListsHTML(list[0].taskListId)
            arrayOfTaskLists.splice(arrayOfTaskLists.indexOf(list),1)
        }
    })
}

/**
 * From empty list, remov HTML
 * @param {*} listId <- Id of empty list
 */
function deleteEmptyListsHTML(listId){
    const listDiv = document.getElementById(listId)
    listDiv.style.animation = "taskDelete 1s"
    setTimeout(()=>{
        listDiv.remove()
    },1000)
}

/**
 * Gets and Id removes it from the array and returns the object
 * @param {*} selfId <- Id of task object
 * @returns <- object from array
 */
function spliceSelf(selfId){
    let splicedSelf = []
    arrayOfTaskLists.forEach((list)=>{
        list[1].forEach((element)=>{
            if(element.id === selfId){
                splicedSelf = list[1].splice(list[1].indexOf(element),1)
            }
        })
    })
    return (splicedSelf)
}

/**
 * Gets and ID and looks for it in array, returns indexes
 * @param {*} nextSibling <- Id of sibling
 * @returns <- Array of index [0] = x = arrayOfTaskLists[x], [1] = y = arrayOfTaskLists[x][1][y]
 */
function getSiblingIndexArray(nextSibling){
    let indexOfSibling = []
    arrayOfTaskLists.forEach((list)=>{
        list[1].forEach((element)=>{
            if(element.id === nextSibling){
                indexOfSibling.push(arrayOfTaskLists.indexOf(list))
                indexOfSibling.push(list[1].indexOf(element))
            }
        })
    })
    return (indexOfSibling)
}

/**
 * Inserts the object in the index of sibling
 * @param {*} self <- Object removed from array
 * @param {*} siblingIndex <- array with index of sibling
 */
function insertSelfBefore(self,siblingIndex){
    arrayOfTaskLists[siblingIndex[0]][1].splice(siblingIndex[1],0,self)
}

/**
 * Alters order acording to index in array
 * @param {*} taskObj <- object
 */
function reorderTasks(taskObj){
    arrayOfTaskLists.forEach((list)=>{
        if(list[0].taskListName === taskObj.category){
            list[1].forEach((element)=>{
                element.orderNumber = list[1].indexOf(element)
            })
        }
    })
}

/**
 * changes order in html acording to object order
 */
function reorderHTML(){
    document.querySelectorAll('.task').forEach((htmlTask)=>{
        arrayOfTaskLists.forEach((list)=>{
            list[1].forEach((arrayTask)=>{
                if(htmlTask.id === arrayTask.id){
                    htmlTask.style.order = arrayTask.orderNumber
                }
            })
        })
    })
}

/**
 * Adds object at the end of array
 * @param {*} taskObj <- object
 * @param {*} self <- object removed from array
 */
function insertSelfAfter(taskObj,self){
    arrayOfTaskLists.forEach((list)=>{
        if(list[0].taskListName === taskObj.category){
            list[1].push(self)
        }
    })
}

/**
 * changes the category of the object acording to the sibling
 * @param {*} taskObj <- object
 * @param {*} siblingIndex <- position of sibling
 */
function changeCategory(taskObj,siblingIndex){
    taskObj.category = arrayOfTaskLists[siblingIndex[0]][1][siblingIndex[1]].category
}

/**
 * changes the category of the object in array acording to the sibling
 * @param {*} selfId <- object Id
 * @param {*} siblingIndex <- position of sibling
 */
function changeArrayCategory(selfId,siblingIndex){
    arrayOfTaskLists.forEach((list)=>{
        list[1].forEach((task)=>{
            if(task.id === selfId){
                task.category = arrayOfTaskLists[siblingIndex[0]][1][siblingIndex[1]].category
            }
        })
    })
}

/**
 * Saves arrayOfTaskLists as string
 */
function saveToStorage(){
    localStorage.setItem('arrayOfTaskLists', JSON.stringify(arrayOfTaskLists)); 
}

/**
 * Gets array of Task Lists and calls for HTML creation of those Lists and tasks
 */
function loadStorage(){
    arrayOfTaskLists.forEach((list)=>{
        reCreateList(list[0])
        list[1].forEach((task)=>{
            reCreateTask(task)
        })
    })
}

/**
 * Creates HTML for taskLists from obj
 * @param {*} obj <- Task List Obj
 */
function reCreateList(obj){
    const reListName = obj.taskListName
    const reListId = obj.taskListId
    const reListObj = new TaskList(reListName,reListId)
    createTaskListHtml(reListObj)
}

/**
 * Creates HTML for tasks from obj
 * @param {*} obj <- Task Obj
 */
function reCreateTask(obj){
    const reTaskName = obj.content
    const reTaskDone = obj.done
    const reTaskId = obj.id
    const reTaskCat = obj.category
    const reTaskOrder = obj.orderNumber
    const reTaskDate = obj.date
    const reTaskDateId = obj.dateId
    const reTaskObj = new Task(reTaskName,reTaskDone,reTaskId,reTaskCat,reTaskOrder,reTaskDate,reTaskDateId)
    createtaskDOM(reTaskObj)
}
