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

function changeMain(filename, runExtras=function(){}) {
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
            runExtras();
        })
        .catch(error => {
            let m = document.getElementById("main-sec");
            m.innerHTML = `<h1>ERROR!</h1><h2>Details follow:</h2><textarea>${error}</textarea>`
        });
}

function getJSONObject(filename) {
	return readFromGithubFile(filename)
        .then(content => {
            let parsedJSON = JSON.parse(content);
            return parsedJSON;
        })
        .catch(error => {
            return {"err": error};
        });
}

function getHeaders() {
    return loadedJSON.headers;
}

function showProductListing() {
    let headers = getHeaders();

    let headerRow = document.createElement("div");
    headerRow.classList.add("product-header-row");

    //let rowsList = [];
    for (let header of headers) {
        let newHeader = document.createElement("div");
        newHeader.classList.add("product-header");
        newHeader.innerText = header;
        headerRow.appendChild(newHeader);
    }


    document.getElementById("listing").appendChild(headerRow);
}

window.onload = function() {
    changeMain("m_main.html");
    getJSONObject("storedata.json").then(
        content => {
            loadedJSON = content;
        }
    )
}

// Reminder to self: use CTRL + SHIFT + R to clear cache first.
