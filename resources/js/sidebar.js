const taskContainer = document.querySelector('.tasks-container');

async function startTaskListDB() {
    let taskData = '{}';

    try {
        taskData = await Neutralino.storage.getData("taskList");
    } catch {
        await Neutralino.storage.setData("taskList", JSON.stringify({}) );
    } finally {
        let taskList = JSON.parse(taskData);

        alasql(`CREATE TABLE taskList (added DATETIME, name STRING)`);
        alasql(`SELECT * INTO taskList FROM ?`, [taskList]);
    }
}

function renderTasks() {
    let taskList = alasql(`SELECT * FROM taskList ORDER BY added ASC`)
    let taskOut = ""
    for (var task in taskList) {
        let taskName = taskList[task]["name"]
        taskOut += `<button class="taskTab" id="${taskName}-tab"><i class="fa-solid fa-bars fa-xl"></i> ${taskName}</button>`
    }
    taskContainer.innerHTML = taskOut
}

async function addTask(input) {
    let request = `EXISTS(SELECT * FROM taskList WHERE name = '${input}')`
    let exists = alasql(`SELECT ${request}`)[0][request];

    if (exists || input.trim().length === 0 || input.trim().length > 25 || input.includes(' ')) {
        var err = document.getElementById("err");
        err.classList.toggle("show");
        setTimeout(function(){
            err.classList.remove("show");
          }, 3000);
        return false
    }
    else {
        alasql(`INSERT INTO taskList VALUES (NOW(), "${input}")`)
        await Neutralino.storage.setData("taskList", JSON.stringify( alasql(`SELECT * FROM taskList`) ));
        return true
    }
}

function loadInitialContent() {
    let taskList = alasql(`SELECT * FROM taskList ORDER BY added ASC`)
    let taskName = undefined;

    if (taskList.length > 0) {
        document.querySelector('.no-tasks').style.visibility = "hidden";
        document.querySelector('.has-tasks').style.visibility = "visible";

        if (taskList.length === 1) {
            taskName = taskList[ 0 ]["name"]
        } else {
            taskName = taskList[ Math.round(Math.random(taskList)) ]["name"]
        }

        document.getElementById(`${taskName}-tab`).click();
        renderContent(taskName);

    }
    else {
        document.querySelector('.no-tasks').style.visibility = "visible";
        document.querySelector('.has-tasks').style.visibility = "hidden";
    }
}

document.querySelector(".tasks-container").addEventListener('click', async function(event) {
    // ensures that only the date elements are toggled, not the entire calendar itself
    if (event.target.parentElement.className === "tasks-container") {
        let taskName = event.target.innerHTML.split(" ").at(-1)

        let prevActive = document.querySelector('.active')
        if (prevActive !== null) {
            prevActive.classList.remove("active");
        }

        event.target.classList.add("active")

        // here we just change the innerHTML and that fires the modified event listener in calendar.js
        document.querySelector('.content-header').innerHTML = taskName

        // ensure DB is clean, load in newDB and render calender again
        for (tableName of alasql('SHOW TABLES')) {
            if (tableName['tableid'] !== 'taskList') {
                // save previous data to corresponding file
                await Neutralino.storage.setData(tableName['tableid'], JSON.stringify( alasql(`SELECT * FROM ${tableName['tableid']}`) ));

                alasql(`DROP TABLE ${tableName['tableid']}`)
                renderContent(taskName)
            }
        }
    }
});

document.querySelector(".new-task").addEventListener("keypress", async function(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        let taskName = e.currentTarget.value
        e.currentTarget.value = "";

        let added = await addTask(taskName)
        if (added) {
            renderTasks();
            // loadInitialContent();
            document.querySelector('.no-tasks').style.visibility = "hidden";
            document.querySelector('.has-tasks').style.visibility = "visible";
            document.getElementById(`${taskName}-tab`).click();
            renderContent(taskName);
        }
    }
});

const renderSidebar = async () => {
    await startTaskListDB();
    renderTasks();
    loadInitialContent();
}

renderSidebar();
