
// calendar source code: https://github.com/lashaNoz/Calendar
const date = new Date();
const defClasses = "task-status-default"

const renderCalendar = () => {
    date.setDate(1);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthDays = document.querySelector('.days')

    // returns the last day of the retrieved month
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    const firstDayIdx = date.getDay();

    document.querySelector('.date h1').innerHTML = `${months[date.getMonth()]} ${date.getFullYear()}`;
    let days = "";
    let daysCount = 0;

    for (let x = firstDayIdx; x > 0; x--) {
        days += `<div class="prev-days">${prevLastDay - x + 1}</div>`;
        daysCount++;
    }

    // goes through the 1st to last day of the month and if one of the day's matches the current date, sets the class as "today"
    for (let i = 1; i <= lastDay; i++) {
        if ( i === new Date().getDate() && date.getMonth() === new Date().getMonth() ) {
            days += `<div class="today ${defClasses}">${i}</div>`;
        } else {
            days += `<div class="${defClasses}">${i}</div>`;
        }
        daysCount++;
    }

    // ensures blank space in calandar is filled by some of the next month ( 7 days * 6 rows)
    daysLeft = (7 * 6) - daysCount
    for (let j = 1; j <= daysLeft; j++) {
        days += `<div class="next-days ${defClasses}">${j}</div>`;
    }

    monthDays.innerHTML = days;
}

document.querySelector('.prev').addEventListener("click", () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
});

document.querySelector('.next').addEventListener("click", () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
});

// must be rendered once initially
renderCalendar();

var taskToggle = ["task-status-default", "task-status-completed", "task-status-failed"];
var taskIdx = 0;

// current issue: not keeping track of each one seperately, just all together
document.querySelector('.days').addEventListener("click", (e) => {
    // ensures that only the date elements are toggled, not the entire calendar
    if (e.target.parentElement.className == "days") {
        // current method of toggling between 3 classes allowing user to click to the right status
        let taskStatus = e.target.className.split(' ').find(element => element.includes("task-status-"));
        let targetClasses = e.target.classList;
        switch (taskStatus) {
            case "task-status-completed":
                targetClasses.remove(taskToggle[1]);
                targetClasses.add(taskToggle[2]);
                break;
            case "task-status-failed":
                targetClasses.remove(taskToggle[2]);
                targetClasses.add(taskToggle[0]);
                break;
            default:
                targetClasses.remove(taskToggle[0]);
                targetClasses.add(taskToggle[1]);
                break;
        }
    }
});

/* Ideas for Going About the Editting Task Status
 - user will only be allowed to edit one month and needs to press edit/save button in order to switch to another month
 - make save button flash red if user tries to switch months without saving
 - only allow user to update task status in edit mode
 - when entering edit mode, create a json object
 - each time user changes a status, record it to json object with the ID including date and task name probably
    - possibility of generating IDs? or make something where task names cant be duplicates
 - once user saves, push that json object to the neutralino save system
 - update calander to read from neutralino save system at all times

 - creating a json object: https://www.youtube.com/watch?v=6I3qMe-jXDs&ab_channel=dcode
 - adding data to a json object: https://stackoverflow.com/questions/736590/add-new-attribute-element-to-json-object-using-javascript
*/

// var buttonMap = {
//     edit_task_btn: function(event) {
//       one(event.target)
//     },
//     save_task_btn: function(event) {
//       two(event.target)
//     }
// }

// var container = document.querySelector('.buttonsContainer');
// var buttonClick = container && container.addEventListener('click', function(event) {
//   var target = event.target;
//   var handler;
//   if (target.nodeName == "BUTTON" && (handler = target.getAttribute('data-handler'))) {
//     buttonMap[handler](event)
//   }
// });
