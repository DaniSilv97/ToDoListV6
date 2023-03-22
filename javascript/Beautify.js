
export default class Beautify{

    /** how many days until done
     @type Number*/
    enoughTime = 10

    /** Color of enough time
     @type String*/
    enoughTimeColor = ''

    /** how many days until done
     @type Number*/
    shortTime = 2

    /** Color of short time
     @type String*/
    shortTimeColor = ''

    /** Color of no time
     @type String*/
    noTimeColor = ''

    constructor(enoughTime,enoughTimeColor,shortTime,shortTimeColor,noTimeColor){
        this.enoughTime = enoughTime
        this.enoughTimeColor = enoughTimeColor
        this.shortTime = shortTime
        this.shortTimeColor = shortTimeColor
        this.noTimeColor = noTimeColor
    }

    /**
     * changes the color of task date
     */
    updateColors(){
        document.querySelectorAll('.task').forEach((task)=>{
            const taskSpan = task.firstChild.nextSibling.nextSibling
            const newTextColor = this.timeLeft(taskSpan)
            taskSpan.style.color = newTextColor
        })
    }

    /**
     * checks for time left in task date
     * @param {*} taskSpan <- date html
     * @returns <- color acording to time left and chosen color
     */
    timeLeft(taskSpan){
        const currentDateObj = new Date()
        const diffInDays = (taskSpan.className - currentDateObj.getTime()) / (1000 * 3600 * 24);
        if(currentDateObj >= taskSpan.className){
            return(this.noTimeColor)
        } else {
            if (diffInDays <= this.shortTime){
                return(this.shortTimeColor)
            } else if (diffInDays <= this.enoughTime){
                return(this.enoughTimeColor)
            }
        }
    }
}
