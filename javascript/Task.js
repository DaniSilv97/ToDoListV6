import Beautify from "./Beautify.js"

export default class Task{
    /** Task name 
     * @type String */
    content  

    /** Task is checked ? 
     * @type Boolean */
    done            

    /** Task HTML Id 
     * @type String */
    id           

    /** Task belongs to lists with category as name
     * @type String */
    category

    /** Position of task in List 
     * @type Number */
    orderNumber

    /** Array of DOM Elements
     * @type Array 
     * [ 0taskList | 1taskDiv | 2checkbox | 3name | 4edit | 5delete ] */
    arrayDOM = []

    /** Was delete Button clicked ? 
     * @type Boolean */
    doDelete = false

    /** Get date from HTML input converted to array
     * @type Array [dd,mm,yyyy]*/
    date = []

    /** Takes date and create obj acordingly 
     * @type Object */
    dateObj = {}

    /** date.get(Time)
     * @type Number */
    dateId

    constructor(content, done, id, category, orderNumber,date,dateId){
        this.content = content
        this.done = done
        this.id = id
        this.category = category
        this.orderNumber = orderNumber 
        this.date = date
        this.dateObj = new Date(`${this.date[2]}-${this.date[1]}-${this.date[0]}`)
        this.dateId = dateId
    }

    /**
     * Creates DOM elements and calls func to add atributes to them
     */
    doCreateHTML(){
        //get
        const taskList = document.querySelector(`.${this.category}`).firstChild.nextSibling
        //create
        const taskDiv = document.createElement("div")
        const checkbox = document.createElement("input")
        const taskName = document.createElement("input")
        const editbutton = document.createElement("button")
        const deleteButton = document.createElement("button")
        const dateDisplay = document.createElement("span")

        this.arrayDOM = [taskList,taskDiv,checkbox,taskName,editbutton,deleteButton,dateDisplay]

        this.doTaskDiv(taskDiv)
        this.doCheckbox(checkbox)
        this.doTaskName(taskName)
        this.doButtons(editbutton,deleteButton)
        this.doDate(dateDisplay)
        this.doAppends()
    }

    /**
     * Gives atributes to Div that later holds every element of the task
     * @param {*} div <- This task div
     */
    doTaskDiv(div){
        div.classList.add("task")
        div.classList.add(this.category)
        div.id = this.id
        div.draggable = "true"
        div.style.order = this.orderNumber
        div.style.animation = "taskCreate 1s"

        if(this.done){
            div.classList.add("done")
        }
    }
    /**
     * Gives atributes to checkbox
     * @param {*} checkbox <- Checkbox (input type checkbox)
     */
    doCheckbox(checkbox){
        checkbox.classList.add("checkbox")
        checkbox.type = "checkbox"
        checkbox.checked = this.done
    }

    /**
     * Gives atributes to the name input
     * @param {*} name <- Task Name (input type text)
     */
    doTaskName(name){
        name.classList.add("text")
        name.type = "text"
        name.value = this.content
        name.setAttribute("readonly", true)
    }

    /**
     * Gives atributes to the Edit and Delete buttons
     * @param {*} edit <- (button)
     * @param {*} deleteBt <- (button)
     */
    doButtons(edit,deleteBt){
        edit.classList.add("task-edit")
        edit.innerText = "Edit"
        deleteBt.classList.add("task-delete")
        deleteBt.innerText = "Delete"
    }

    /**
     * Gives atributes to the date span
     * @param {*} date <- (span)
     */
    doDate(date){
        const selfMonth = this.convertMonth()
        const textColor = this.timeLeft()
        date.classList.add(`${this.dateId}`)
        date.innerText = `${selfMonth} ${this.date[0]}, ${this.date[2]}`
        date.style.color = textColor
    }

    /**
     * Takes the task month and converts it to month abreviation
     * @returns <- mmm string
     */
    convertMonth(){
        const months = ['Jan','Fev','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        const selfMonth = parseInt(this.date[1])

        return(months[selfMonth - 1])
    }

    /** 
     * Calculates the difference betewen current time and finish date
     * @returns <- color(string)
    */
    timeLeft(){
        const currentDateObj = new Date()
        const diffInDays = (this.dateObj.getTime() - currentDateObj.getTime()) / (1000 * 3600 * 24);
        if(currentDateObj >= this.dateObj){
            return('var(--noTime)')
        } else {
            if (diffInDays <= 3){
                return('var(--shortTime)')
            } else if (diffInDays <= 10){
                return('var(--enoughTime)')
            } else{
                return('var(--longTime)')
            }
        }
    }

    /**
     * Appends DOM elements to their respective parents
     */
    doAppends(){
        this.arrayDOM[1].appendChild(this.arrayDOM[2])
        this.arrayDOM[1].appendChild(this.arrayDOM[3])
        this.arrayDOM[1].appendChild(this.arrayDOM[6])
        this.arrayDOM[1].appendChild(this.arrayDOM[4])
        this.arrayDOM[1].appendChild(this.arrayDOM[5])
        
        this.arrayDOM[0].appendChild(this.arrayDOM[1])
    }

    /**
     * Makes the checkbox work and calls for storage save on change
     * @param {*} taskListsArray <- Main Array of task lists
     */
    doCheckboxEvent(taskListsArray){
        this.arrayDOM[2].addEventListener('change', (checkbox)=>{
            this.done = checkbox.target.checked
            taskListsArray.forEach((list)=>{
                list[1].forEach((task)=>{
                    if(task.id == this.id){
                        task.done = this.done
                    }
                })
            })
            if(this.done){
                this.arrayDOM[1].classList.add('done')
            } else{
                this.arrayDOM[1].classList.remove('done')
            }
            this.saveToStorage(taskListsArray)
        })
    }

    /**
     * Checks edit button when clicked for Edit or Save
     * @param {*} taskListsArray <- Main Array of task lists
     */
    doEditEvent(taskListsArray){
        this.arrayDOM[4].addEventListener('click', ()=>{
            if(this.arrayDOM[4].innerText.toLowerCase() == "edit"){
                this.afterEditCheckTrue()
            } else{
                this.afterEditCheckFalse(taskListsArray)
            }
        })
    }
    /**
     * If edit button said edit, change to save and make name editable
     */
    afterEditCheckTrue(){
        this.arrayDOM[3].removeAttribute("readonly")
        this.arrayDOM[3].focus()
        this.arrayDOM[4].innerText = "Save"
    }

    /**
     * If edit button said edit, change to edit, and save name alterations removing editable property
     * @param {*} taskListsArray <- Main Array of task lists
     */
    afterEditCheckFalse(taskListsArray){
        if(!this.arrayDOM[3].value){ 
            this.warnNamePopup()

        } else{
            this.arrayDOM[3].setAttribute('readonly', true);
            this.content = this.arrayDOM[3].value;
            taskListsArray.forEach((list)=>{
                list[1].forEach((task)=>{
                    if(task.id == this.id){
                        task.content = this.content
                    }
                })
            })
            this.arrayDOM[4].innerText = "Edit"
            this.saveToStorage(taskListsArray)
        }
    }

    /**
     * If delete button is clicked, create popup
     * @param {*} taskListsArray <- Main Array of task lists
     */
    doDeleteEvent(taskListsArray){
        this.arrayDOM[5].addEventListener('click',()=>{
            document.querySelector("#background-fade-delete").classList.add("active")
            document.querySelector("#delete-popup").classList.add("active")
            this.doDelete = true
            this.deletePopupEventYes(taskListsArray)
            this.deletePopupEventNo()
        })
    }

    /**
     * Creates Events for Yes button on delete popup, procedes with delete
     * @param {*} taskListsArray <- Main Array of task lists
     */
    deletePopupEventYes(taskListsArray){
        document.getElementById("delete-yes").addEventListener("click", ()=>{
            if(this.doDelete) {
                document.querySelector("#background-fade-delete").classList.remove('active')
                document.querySelector("#delete-popup").classList.remove('active')
                this.deleteAnimation(taskListsArray)
                this.doDelete = false
            }
        })
    }
    /**
     * Creates Events for No button on delete popup
     */
    deletePopupEventNo(){
        document.getElementById("delete-no").addEventListener("click", ()=>{
            document.querySelector("#background-fade-delete").classList.remove('active')
            document.querySelector("#delete-popup").classList.remove('active')
            this.doDelete = false
        })
    }

    /**
     * Makes animates task, and calls for deletion
     * @param {*} taskListsArray <- Main Array of task lists
     */
    deleteAnimation(taskListsArray){
        this.arrayDOM[5].parentElement.style.animation = "taskDelete 1s"
        setTimeout(()=>{
            this.doDeleteTask(taskListsArray)
        },1000)
    }

    /**
     * Compares obj with task in DOM and array, removes them, calls for save
     * @param {*} taskListsArray <- Main Array of task lists
     */
    doDeleteTask(taskListsArray){
        taskListsArray.forEach((list)=>{
            list[1].forEach((task)=>{
                if(task.id == this.id){
                    list[1].splice(list[1].indexOf(task),1)
                }
            })
        })
        document.getElementById(String(this.id)).remove()
        this.isListEmpty(taskListsArray)
        this.saveToStorage(taskListsArray)
    }

    /**
     * checks if the task list is emtpy for deletion
     * @param {*} taskListsArray <- all tasks array
     */
    isListEmpty(taskListsArray){
        if(!this.arrayDOM[0].firstChild){
            this.arrayDOM[0].parentElement.style.animation = "taskDelete 1s"
            taskListsArray.forEach((list)=>{
                if(list[0].taskListId === this.arrayDOM[0].parentElement.id){
                    taskListsArray.splice(taskListsArray.indexOf(list[0]),1)
                    this.saveToStorage(taskListsArray)
                }
            })
            setTimeout(()=>{
                this.arrayDOM[0].parentElement.remove()
            },1000)
        }
    }

    /**
     * Shows popup when task name isn't filled on edit
     */
    warnNamePopup(){
        document.querySelector("#form-popup p").innerText = "Please fill out the task name."
        document.querySelector("#background-fade-form").classList.add('active')
        document.querySelector("#form-popup").classList.add('active')
    }

    /**
     * Saves and array as the List of task lists in localStorage
     * @param {*} array 
     */
    saveToStorage(array){
        localStorage.setItem('arrayOfTaskLists', JSON.stringify(array)); 
    }
}

