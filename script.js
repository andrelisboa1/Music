function readFromGithubFile(filename) {
    let prefix = "raw.githubusercontent.com/andrelisboa1/Music/refs/heads/main/";

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
            // convert to string...
            m.innerHTML = setHTMLFromString(m, `${content}`);
        })
        .catch(error => {
            let m = document.getElementById("main-sec");
            m.innerHTML = `<h1>ERROR!</h1><h2>Details follow:</h2><textarea>${error}</textarea>`
        });
}

window.onload = function() {
    changeMain("m_main.html");
}
