let loadedJSON = {};

function readFromGithubFile(filename) {
    let prefix = "raw.githubusercontent.com/andrelisboa1/Music/main/";

    let content = "";

    return fetch(`https://${prefix}${filename}?v=${new Date().getTime()}`)
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

function getAllArticles() {
    return loadedJSON.articles;
}

function getColumnProportions() {
    return loadedJSON.headerProportion;
}


let productListingSortBy = "Name";
let productListingDirection = "Asc";
function showProductListing(sortBy = "Name", sortDirection = "Asc") {
    let listing = document.getElementById("listing");
    listing.innerHTML = ""; // Clear any existing content

    let headers = getHeaders();
    let articles = getAllArticles();
    productListingSortBy = sortBy;
    productListingDirection = sortDirection;

    // 💡 Sorting logic
    articles.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];

        // Handle Duration sorting specially
        if (sortBy === "Duration") {
            let aMinutes = parseInt(aVal.minutes || 0);
            let aSeconds = parseInt(aVal.seconds || 0);
            let bMinutes = parseInt(bVal.minutes || 0);
            let bSeconds = parseInt(bVal.seconds || 0);

            aVal = aMinutes * 60 + aSeconds;
            bVal = bMinutes * 60 + bSeconds;
        }

        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortDirection === "Asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "Asc" ? 1 : -1;
        return 0;
    });

    let proportions = getColumnProportions();
    let proportionTotal = 0;
    for (let proportion of proportions) {
        proportionTotal += Number.parseInt(proportion);
    }

    let headerRow = document.createElement("div");
    headerRow.classList.add("product-header-row");

    let headerIndex = 0;
    for (let header of headers) {
        let newHeader = document.createElement("div");
        let extraText = "";
        newHeader.classList.add("product-header");
        newHeader.style.width = `calc(${100 * (proportions[headerIndex] / proportionTotal)}% - var(--ph-margin)*2)`;
        if (header === sortBy) {
            newHeader.style.borderColor = "var(--color-secondary)";
            newHeader.style.color = "var(--color-main)";
            newHeader.style.borderWidth = "2.5pt";
            extraText = (sortDirection === "Desc") ? "▲" : "▼";
            extraText = `<span style="margin-left: 2pt; font-size: 12pt; background-color: inherit;">${extraText}</span>`
        }
        newHeader.innerHTML = `${header}${extraText}`;
        newHeader.onclick = function(e) {
            let elem = e.target;

            if (!elem.innerHTML.includes(productListingSortBy)) {
                showProductListing(elem.innerText, "Asc");
            } else {
                showProductListing(productListingSortBy, (productListingDirection === "Asc") ? "Desc" : "Asc");
            }
        };
        headerRow.appendChild(newHeader);
        headerIndex++;
    }

    listing.appendChild(headerRow);

    for (let article of articles) {
        let newArticle = document.createElement("div");
        newArticle.classList.add("product-cell-row");

        headerIndex = 0;
        for (let header of headers) {
            let newCell = document.createElement("div");
            newCell.classList.add("product-cell");
            if (header === sortBy) {
                let c = "var(--color-secondary)";
                newCell.style.borderColor = c;
                newCell.style.color = "#fff";
            }
            let cellContent = article[header];
            switch (header) {
                case "Duration":
                    let minutes = cellContent.minutes || "0";
                    let seconds = cellContent.seconds || "00";
                    if (seconds.length == 1) seconds = "0" + seconds;
                    newCell.innerText = `${minutes} min, ${seconds} s`;
                    break;
                case "Page":
                    newCell.innerHTML = `<a href="${cellContent}" style="background-color: inherit">⧁</a>`;
                    newCell.onmouseenter = function(e) {
                        e.target.style.fontSize = "calc(var(--font-size-div) * 1.2)";
                    }
                    newCell.onmouseleave = function(e) {
                        e.target.style.fontSize = "calc(var(--font-size-div) * 1)";
                    }
                    break;
                default:
                    newCell.innerText = article[header];
                    break;
            }

            newCell.style.width = `calc(${100 * (proportions[headerIndex] / proportionTotal)}% - var(--ph-margin)*2)`;
            newArticle.appendChild(newCell);
            headerIndex++;
        }

        listing.appendChild(newArticle);
    }
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
