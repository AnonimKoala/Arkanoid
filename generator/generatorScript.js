const rows = document.querySelectorAll(".row")
const allBricks = document.querySelectorAll(".row > li")
const chooseColorDiv = document.querySelectorAll("#chooseType > li")
let pickedImage
let pickedType

const selectLevel = document.querySelector("#chooseToEdit")
const loadButton = document.querySelector("#loadButton")

const levelNameInput = document.querySelector("#levelName")
const saveButton = document.querySelector("#saveButton")

const playButton = document.querySelector("#play")
const deleteButton = document.querySelector("#deleteButton")
const clearButton = document.querySelector("#clearButton")


// ==================================================================================================== //
// Ustawia paletę pozycji cegieł
// ==================================================================================================== //
function setPalette() {
    let brickX = -0.1
    let brickY = 500
    allBricks.forEach((el, i) => {
        el.dataset.x = brickX
        el.dataset.y = brickY

        if (brickX > 4400) {
            brickX = -0.1
            brickY += 250
        }
        else
            brickX += 500
    })
}
// ==================================================================================================== //
// Uruchamia skrypt
// ==================================================================================================== //
startGenerator()

function startGenerator() {
    setPalette()

    // Wczytuje wybrany kolor
    chooseColorDiv.forEach((el, i) => {
        el.addEventListener("click", e => {
            chooseColorDiv.forEach(eC => {
                eC.classList.remove("picked")
            })

            el.classList.add("picked")
            pickedImage = e.target.dataset.image
            pickedType = i
        })
    })
    // Wczytuje img do klocków
    allBricks.forEach((el, i) => {
        el.addEventListener("click", e => {
            e.target.style.backgroundImage = `url(../img/bricks/${pickedImage}.jpg)`
            e.target.dataset.type = pickedType
        })
    })


    // Czyta poziomy z pliku JSON
    let levelList = []
    // Jesli nie ma poziomów w localstorage to wczytuje domyślne
    if (localStorage.length == 0) {
        fetch("basicLevels.json")
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonFile) {
                jsonFile.forEach((el, i) => {
                    levelList.push(el.id)

                    // Sprawdza czy poziom jest w localstorage
                    if (localStorage.getItem(el.id) == null)
                        localStorage.setItem(el.id, JSON.stringify(el.bricks)) // Jeśli nie ma to dodaje
                })
                // Wczytuje poziomy do selecta
                levelList.forEach((el, i) => {
                    let option = document.createElement("option")
                    option.value = el
                    // console.log(el);
                    option.innerText = el
                    selectLevel.appendChild(option)

                })

            })
    } else {
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i)

            if (key[0] != "_")
                levelList.push(key)
        }
        // Wczytuje poziomy do selecta
        levelList.forEach((el, i) => {
            let option = document.createElement("option")
            option.value = el
            option.innerText = el
            selectLevel.appendChild(option)

        })
    }

}

// ==================================================================================================== //
// Czyści edytor
// ==================================================================================================== //
function clearEditor() {
    allBricks.forEach((el, i) => {
        el.style.backgroundImage = "none"
        el.dataset.type = 10
    })
}
clearButton.addEventListener("click", clearEditor)

// ==================================================================================================== //
// Wczytywanie poziomu z localstorage do edytora
// ==================================================================================================== //
loadButton.addEventListener("click", e => {
    if (selectLevel.value != 0) {
        clearEditor()

        let levelName = selectLevel.value
        levelNameInput.value = levelName

        levelNameInput.value = levelName

        let level = JSON.parse(localStorage.getItem(levelName))
        level.forEach((el, i) => {
            allBricks.forEach((el2, i2) => {
                if (el.x == el2.dataset.x && el.y == el2.dataset.y) {
                    el2.dataset.type = el.type
                    switch (parseInt(el.type)) {
                        case 0:
                            el2.style.backgroundImage = "url(../img/bricks/whiteBrick.jpg)"
                            break;
                        case 1:
                            el2.style.backgroundImage = "url(../img/bricks/orangeBrick.jpg)"
                            break;
                        case 2:
                            el2.style.backgroundImage = "url(../img/bricks/cyanBrick.jpg)"
                            break;
                        case 3:
                            el2.style.backgroundImage = "url(../img/bricks/greenBrick.jpg)"
                            break;
                        case 4:
                            el2.style.backgroundImage = "url(../img/bricks/redBrick.jpg)"
                            break;
                        case 5:
                            el2.style.backgroundImage = "url(../img/bricks/blueBrick.jpg)"
                            break;
                        case 6:
                            el2.style.backgroundImage = "url(../img/bricks/pinkBrick.jpg)"
                            break;
                        case 7:
                            el2.style.backgroundImage = "url(../img/bricks/yellowBrick.jpg)"
                            break;
                        case 8:
                            el2.style.backgroundImage = "url(../img/bricks/silverBrick.jpg)"
                            break;
                        case 9:
                            el2.style.backgroundImage = "url(../img/bricks/goldBrick.jpg)"
                            break;
                        default:
                            el2.style.backgroundImage = `url(../img/bricks/${el.type}.jpg)`
                            break;
                    }
                }
            })
        })
    }

})
// ==================================================================================================== //
// Zapisywanie poziomu
// ==================================================================================================== //
saveButton.addEventListener("click", e => {
    if (levelNameInput.value != "") {
        let levelName = levelNameInput.value
        let object = []
        allBricks.forEach((el, i) => {
            if (el.dataset.type != 10 && el.dataset.type != undefined)
                object.push({
                    x: el.dataset.x,
                    y: el.dataset.y,
                    type: el.dataset.type
                })
        })
        let level = {
            id: levelName,
            bricks: object
        }
        let json = JSON.stringify(object)



        // Zapis poziomu do localStorage
        localStorage.setItem(levelName, json)
        // Dodaje poziom do selecta
        let option = document.createElement("option")
        // Jeśli poziom jeszcze nie istnieje to dodaje
        if (selectLevel.querySelector(`option[value="${levelName}"]`) == null) {
            option.value = levelName
            option.innerText = levelName
            selectLevel.appendChild(option)
        }
    }
    else {
        alert("Podaj nazwę poziomu")
    }

})
// ==================================================================================================== //
// Usuwanie poziomu
// ==================================================================================================== //
deleteButton.addEventListener("click", e => {
    if (selectLevel.value != 0) {
        let levelName = selectLevel.value
        localStorage.removeItem(levelName)
        selectLevel.removeChild(selectLevel.querySelector(`option[value="${levelName}"]`))
    }
})

// ==================================================================================================== //
// Uruchamia poziom
// ==================================================================================================== //
playButton.addEventListener("click", e => {
    if (selectLevel.value != 0) {
        alert("Pamiętaj, aby zapisać wybrany poziom przed uruchomieniem")
        let levelName = selectLevel.value
        let level = JSON.parse(localStorage.getItem(levelName))
        localStorage.setItem("_startFrom", levelName)

        // Owtórz link z poziomem w tej samej karcie
        window.open(`../index.html?level=${levelName}`, "_self")


    }
    else {
        alert("Wybierz poziom")
    }
})



// ==================================================================================================== //
// Export poziomów do pliku JSON
// ==================================================================================================== //
function exportJSON() {
    let allLevels = []
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i)
        let level = JSON.parse(localStorage.getItem(key))
        let object = {
            id: key,
            bricks: level
        }

        allLevels.push(object)
    }
    let json = JSON.stringify(allLevels)
    var textFileAsBlob = new Blob([json], { type: 'text/plain' });
    var fileNameToSaveAs = "levels.json";

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
        // Chrome pozwala aby link został kliknięty
        // bez dodawania do DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else {
        // Firefox wymaga dodania linku do DOM
        // zanim można go kliknąć.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}
