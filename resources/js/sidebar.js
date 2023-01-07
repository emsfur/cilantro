// TODO: focus on add task feature and create storage file called {taskName}DB to avoid overlap with file storing task names?
// ADDITIONAL: Prevent user from having two tasks named the same

const taskContainer = document.querySelector('.tasks-container');

async function start() {
    let taskData = {};

    try {
        taskData = await Neutralino.storage.getData("taskList");
    } catch {
        await Neutralino.storage.setData("taskList", JSON.stringify("taskList") );
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
        taskOut += `<div class="task"><i class="fa-solid fa-bars fa-xl"></i> ${taskName}</div>`
    }
    taskContainer.innerHTML = taskOut
}

function addTask(input) {
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
    }

    // TODO: if taskname exists, have a small window popup that says need unique name
}

document.querySelector(".new-task").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        // console.log(e.currentTarget.value);
        addTask(e.currentTarget.value)
        renderTasks();
        e.currentTarget.value = "";
    }
});


const renderSidebar = async () => {
    await start();

    // renderTasks();
}

renderSidebar();
