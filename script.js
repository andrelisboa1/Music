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

window.onload = function() {
    debugRead("m_main.html");
}