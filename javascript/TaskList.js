export default class TaskList{

    /** Task list name 
     * @type String */
    taskListName

    /** Task list HTML Id 
     * @type String */
    taskListId

    /** Array of DOM Elements
     * @type Array 
     * [ 0main | 1taskList | 2title | 3tasksContainer] */
    arrayDOM = []

    constructor(taskListName,taskListId){
        this.taskListName = taskListName
        this.taskListId = taskListId 
    }

    /**
     * Creates DOM elements and calls func to add atributes to them
     */
    doCreateHTML(){
        //get
        const main = document.querySelector('main')
        //create
        const taskList = document.createElement("div")
        const title = document.createElement("h2")
        const tasksContainer = document.createElement("div")

        this.arrayDOM = [main,taskList,title,tasksContainer]

        this.doTaskListDiv(taskList)
        this.doTaskListH2(title)
        this.doTasksDiv(tasksContainer)
        this.doAppends()
    }

    /**
     * Gets the created div, to give it atributes
     * @param {*} div <- task list container
     */
    doTaskListDiv(div){
        div.classList.add("tasks-container")
        div.classList.add("wrapper")
        div.classList.add(this.taskListName)
        div.id = this.taskListId
        div.style.animation = "taskSortIn 1s"
    }

    /**
     * Gets the created h2, to give it atributes
     * @param {*} h2 <- task list name
     */
    doTaskListH2(h2){
        h2.innerText = this.taskListName
    }
    /**
     * Gets the created div, to give it atributes
     * @param {*} div <- tasks container
     */
    doTasksDiv(div){
        div.classList.add("tasks")
    }

    /**
     * Appends every thing to the right parent
     */
    doAppends(){
        this.arrayDOM[1].appendChild(this.arrayDOM[2])
        this.arrayDOM[1].appendChild(this.arrayDOM[3])

        this.arrayDOM[0].appendChild(this.arrayDOM[1])
    }    

    /**
     * allows tasks div to read dragover
     */
    makeDragContainer(){
        this.arrayDOM[3].addEventListener('dragover', (e)=>{
            e.preventDefault()
            const afterElement = this.getDragAfterElement(e.clientY)
            const draggable = document.querySelector('.dragging')
            if(afterElement == null){
                this.arrayDOM[3].appendChild(draggable)
            } else{
                this.arrayDOM[3].insertBefore(draggable, afterElement)
            }
        })
    }

    /**
     * Sees what task was near mouse on dragg release
     * @param {*} y <- client mouse Y
     * @returns <- closest task
     */
    getDragAfterElement(y){
        const draggableElements = [...this.arrayDOM[3].querySelectorAll('.task:not(.dragging)')]
        return draggableElements.reduce((closest, child) =>{
            const box = child.getBoundingClientRect()
            const offset = y - box.top - box.height / 2
            if(offset < 0 && offset > closest.offset){
                return {offset: offset, element: child}
            } else{
                return closest
            }
        }, {offset: Number.NEGATIVE_INFINITY}).element
    }
}