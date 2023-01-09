// TODO: just push the taskName to content area

// TODO: focus on add task feature and create storage file called {taskName}DB to avoid overlap with file storing task names?
// ADDITIONAL: Prevent user from having two tasks named the same

const taskContainer = document.querySelector('.tasks-container');

async function start() {
    let taskData = {};

    try {
        taskData = await Neutralino.storage.getData("taskList");
    } catch {
        await Neutralino.storage.setData("taskList", JSON.stringify({}) );
    } finally {
        let taskList = JSON.parse(taskData);

        alasql(`CREATE TABLE taskList (added DATETIME PRIMARY KEY, name STRING)`);
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

    if (exists) {
        var err = document.getElementById("err");
        err.classList.toggle("show");
        setTimeout(function(){
            err.classList.remove("show");
          }, 3000);
    }
    else {
        alasql(`INSERT INTO taskList VALUES (NOW(), "${input}")`)
        await Neutralino.storage.setData("taskList", JSON.stringify( alasql(`SELECT * FROM taskList`) ));
    }
}

document.querySelector(".tasks-container").addEventListener('click', (event) => {
    // ensures that only the date elements are toggled, not the entire calendar itself
    if (event.target.parentElement.className === "tasks-container") {
        let taskName = event.target.innerHTML.split(" ").at(-1)

        let prevActive = document.querySelector('.active')
        if (prevActive !== null) {
            prevActive.classList.remove("active");
        }

        event.target.classList.add("active")



    }
});

document.querySelector(".new-task").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        let taskName = e.currentTarget.value
        // console.log(e.currentTarget.value);
        addTask(taskName)
        renderTasks();
        e.currentTarget.value = "";
    }
});

const renderSidebar = async () => {
    await start();
    renderTasks();
}

renderSidebar();
