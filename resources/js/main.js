async function saveData(){
    // ensure DB is clean, load in newDB and render calender again
    for (tableName of alasql('SHOW TABLES')) {
        if (tableName['tableid'] !== 'taskList') {
            // save previous data to corresponding file
            await Neutralino.storage.setData(tableName['tableid'], JSON.stringify( alasql(`SELECT * FROM ${tableName['tableid']}`) ));
        }
    }
}

function onWindowClose() {
    saveData();
    Neutralino.app.exit();
}

function setTray() {
    if(NL_MODE != "window") {
        console.log("INFO: Tray menu is only available in the window mode.");
        return;
    }
    let tray = {
        icon: "/resources/icons/appIcon.png",
        menuItems: [
            {id: "VERSION", text: "Get version"},
            {id: "SEP", text: "-"},
            {id: "QUIT", text: "Quit"}
        ]
    };
    Neutralino.os.setTray(tray);
}

function onTrayMenuItemClicked(event) {
    switch(event.detail.id) {
        case "VERSION":
            Neutralino.os.showMessageBox("Version information",
                `Neutralinojs server: v${NL_VERSION} | Neutralinojs client: v${NL_CVERSION}`);
            break;
        case "QUIT":
            Neutralino.app.exit();
            break;
    }
}

// save data if user refreshes
function preRefresh() {
    saveData();
}


Neutralino.init();

Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked);
Neutralino.events.on("windowClose", onWindowClose);
Neutralino.events.on("beforeunload", preRefresh)




// save data on refresh or close




// if(NL_OS != "Darwin") { // TODO: Fix https://github.com/neutralinojs/neutralinojs/issues/615
//     setTray();
// }
