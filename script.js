let loadedJSON = {};

function readFromGithubFile(filename) {
    let prefix = "raw.githubusercontent.com/andrelisboa1/Music/main/";

    let content = "";

    return fetch(`https://${prefix}${filename}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        });
}

function setHTMLFromString(parentElement, str) {
    parentElement.innerHTML = str;
}

function debugRead(filename) {
    readFromGithubFile(filename)
        .then(content => {
            console.log(content);
        })
        .catch(error => {
            console.error('Error reading file:', error);
        });
}

function changeMain(filename) {
    readFromGithubFile(filename)
        .then(content => {
            let m = document.getElementById("main-sec");
            console.log(content);
            m.innerHTML = content;
            let link = document.querySelector('link[rel="stylesheet"][href$="styles.css"]');
            if (!link) {
                link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'styles.css';
                document.head.appendChild(link);
            }
        })
        .catch(error => {
            let m = document.getElementById("main-sec");
            m.innerHTML = `<h1>ERROR!</h1><h2>Details follow:</h2><textarea>${error}</textarea>`
        });
}

function getJSONObject(filename) {
    let outp = {};
	readFromGithubFile(filename)
        .then(content => {
            outp = JSON.parse(content);
        })
        .catch(error => {
            outp = {"err": error};
        });
    return outp;
}

function getHeaders() {
    return loadedJSON.headers;
}

window.onload = function() {
    changeMain("m_main.html");
    loadedJSON = getJSONObject("storedata.json");
}

// Reminder to self: use CTRL + SHIFT + R to clear cache first.
