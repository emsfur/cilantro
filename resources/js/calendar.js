
// calendar source code: https://github.com/lashaNoz/Calendar
// https://stackoverflow.com/questions/38884522/why-is-my-asynchronous-function-returning-promise-pending-instead-of-a-val

const date = new Date();
// console.log(date.toISOString().split('T')[0]);

const taskToggle = ["task-status-default", "task-status-completed", "task-status-failed"];
const taskIdx = 0;

// default classes added to all day elements
const defClasses = ``


const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
const monthDays = document.querySelector('.days');

var tempJSON = {};
var taskName = 'task';
var db = undefined;
var taskDB = undefined;

async function start() {
    try {
        var fullTaskData = await Neutralino.storage.getData(taskName);
    } catch {
        await Neutralino.storage.setData(taskName, JSON.stringify(tempJSON) );
    } finally {
        let taskJSON = JSON.parse(fullTaskData);
        // console.log(taskJSON.find(inp => inp.date === "2022-11-20")["done"])

        alasql(`CREATE TABLE ${taskName} (date DATE PRIMARY KEY, done int)`);
        // alasql(`SELECT * INTO ${taskName} FROM ${[taskJSON]}`);
        // alasql(`SELECT * INTO ${taskName} FROM ?`, [taskJSON]);
        // alasql(`INSERT INTO ${taskName} (date, done) VALUES ?`, [taskJSON]);
    }
}

function get_status_class(val) {
    switch (val) {
        case 0:
            return taskToggle[2];
        case 1:
            return taskToggle[1];
        default:
            return taskToggle[0];
    }
}

// async function pushData(data) {
//     let taskData = await Neutralino.storage.getData(taskName);
//     console.log(taskData);
// }

// TODO: fix reloading calendar status
function set_status(date) {
    let res = alasql(`SELECT * FROM ${taskName} WHERE date = "${date}"`)
    // console.log(res)

    // if (Object.keys(res).length !== 0) {
    //     return get_status_class(res[0].done)
    // } else {
    //     return get_status_class(2)
    // }
    return get_status_class(2)
}

const renderCalendar = async function() {
    date.setDate(1);

    const currMonth = date.getMonth();
    const currYear = date.getFullYear();

    // returns the last day of the retrieved month
    const lastDay = new Date(currYear, currMonth + 1, 0).getDate();

    const prevLastDay = new Date(currYear, currMonth, 0).getDate();
    const firstDayIdx = date.getDay();

    document.querySelector('.date h1').innerHTML = `${months[currMonth]} ${currYear}`;
    let days = "";
    let daysCount = 0;


    for (let x = firstDayIdx; x > 0; x--) {
        currDate = `${currYear}-${currMonth}-${prevLastDay - x + 1}`
        days += `<div class="prev-days ${set_status(currDate)} ${defClasses}">${prevLastDay - x + 1}</div>`;
        daysCount++;
    }

    // goes through the 1st to last day of the month and if one of the day's matches the current date, sets the class as "today"
    for (let i = 1; i <= lastDay; i++) {
        currDate = `${currYear}-${currMonth+1}-${i}`
        if ( i === new Date().getDate() && currMonth === new Date().getMonth() ) {
            days += `<div class="today ${set_status(currDate)} ${defClasses}">${i}</div>`;
        } else {
            let focusDay = `${currYear}-${currMonth + 1}-${i}`
            // ${set_status(focusDay)}
            days += `<div class="${set_status(currDate)} ${defClasses}">${i}</div>`; //get_status_class(currMonthData[i])
        }
        daysCount++;
    }

    // ensures blank space in calandar is filled by some of the next month ( 7 days * 6 rows)
    daysLeft = (7 * 6) - daysCount
    for (let j = 1; j <= daysLeft; j++) {
        currDate = `${currYear}-${((currMonth+1)%12)+1}-${j}`
        days += `<div class="next-days ${set_status(currDate)} ${defClasses}">${j}</div>`;
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

function input_data(date, val) {
    alasql(`IF EXISTS (SELECT * FROM ${taskName} WHERE date = "${date}")
    UPDATE ${taskName} SET done = ${val} WHERE date = "${date}"
    ELSE
    INSERT INTO ${taskName} VALUES( "${date}", ${val} )`);
}

function toggle_task_status(e) {
    // current method of toggling between 3 classes allowing user to click to the desired status
    let taskStatus = e.target.className.split(' ').find(element => element.includes("task-status-"));
    let targetClasses = e.target.classList;
    let targetDate = `${date.getFullYear()}-${date.getMonth() + 1}-${e.target.innerText}`;
    switch (taskStatus) {
        // cycles and sets status to failed
        case "task-status-completed":
            targetClasses.remove(taskToggle[1]);
            targetClasses.add(taskToggle[2]);
            input_data(targetDate, 1);
            break;
        // cycles and sets status to default
        case "task-status-failed":
            targetClasses.remove(taskToggle[2]);
            targetClasses.add(taskToggle[0]);
            input_data(targetDate, 0);
            break;
        // cycles and sets status to completed
        default:
            targetClasses.remove(taskToggle[0]);
            targetClasses.add(taskToggle[1]);
            input_data(targetDate, 2);
            break;
    }
}

// allows user to click any date to switch task status (in edit mode only)
var editEnabled = false;
document.querySelector('.days').addEventListener('click', (event) => {
    // ensures that only the date elements are toggled, not the entire calendar
    if (event.target.parentElement.className === "days" && editEnabled) {
        toggle_task_status(event);
    }
});

async function edit_btn_handle(event) {
    let currText = event.target.innerText;
    if (currText === "Edit") {
        editEnabled = true;
        event.target.innerHTML = "Save"
    }
    else if (currText === "Save"){
        editEnabled = false;
        // upload data to neutalinoJS storage system
        await Neutralino.storage.setData(taskName, JSON.stringify( alasql(`SELECT * FROM ${taskName}`) ));
        event.target.innerHTML = "Edit";
    }
}

// update button to say save after user presses it
document.querySelector('.edit-task-status').addEventListener('click', edit_btn_handle);

document.querySelector('.get-JSON').addEventListener('click', async function() {
    // await Neutralino.storage.getData(taskName).then(result => {console.log(result)});
    console.log(alasql(`SELECT * FROM ${taskName}`));

    });


/* THE PLAN:
    - On opening of any task page, load the data of task from neu storage to indexDB using localbase
    - Before switching task or shutting program (attempt looking up how to run code before page redirect), push localDB data to neu storage
    - For UI pull data from indexDB

*/




// TODO: REQUIRES RENDERCALENDAR TO WAIT FOR START (CODE PROLLY REDUNDANT)
// start().then(renderCalendar()) didn't seem to work
const render = async () => {
    await start();
    // must be rendered once initially
    renderCalendar();
    // input_data('2022-11-27',0);
}

render();

// possible understanding of why db info is null on first run:
// database stays static as code runs and updates it all afterwards, meaning code pulls from nothing the first time
// since DB is persistent, the info now stays and returns info when refreshing
// possible thinking: setup db loading to be in head as a seperate script since each task will be a boiler plate, use html name as task and send info as a collection

// connecting the dots:
// Use ajax to load data then use jay harris comment in link below to put html page in div
// https://stackoverflow.com/questions/17636528/how-do-i-load-an-html-page-in-a-div-using-javascript
// understanding ajax: https://www.youtube.com/watch?v=82hnvUYY6QA&ab_channel=TraversyMedia
