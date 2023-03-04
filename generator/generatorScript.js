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
// Menu pomoc
// ==================================================================================================== //\
const helpScreen = document.querySelector("#help")
helpScreen.addEventListener("click", e => { // Zamyka ekran pomocy
    helpScreen.style.animation = "flyToLeft 2s ease-in-out forwards"
    setTimeout(() => {
        helpScreen.style.display = "none"
    }, 3000)
})


// ==================================================================================================== //
// Wyjście z generatora
// ==================================================================================================== //
const exitButton = document.querySelector("#exit")
exitButton.addEventListener("click", e => {
    playSound("clicked")
    setTimeout(() => {
        location.href = "../index.html"
    }, 500)
})

// ========================================[ Odtwarza dźwięk ]======================================== // 
function playSound(sound, type = 0) {
    switch (sound) {
        case 'hitEdge': // Uderza w krawędź canvas
            new Audio('../audio/balHitEdge.ogg').play()
            break;
        case "brickHit": // Uderza w cegłę
            if (type != 8 && type != 9)
                new Audio('../audio/brickHit.ogg').play()
            else if (type == 9)
                new Audio('../audio/goldHitSound.ogg').play() // Silver brick sound
            else if (type == 8)
                new Audio('../audio/silverHitSound.ogg').play() // Gold brick sound

            break;
        case "hitPlatform": // Uderza w platformę
            new Audio('../audio/platformHit.ogg').play()
            break;
        case "hitSmallDOH": // Uderza w małego DOH'a
            new Audio('../audio/smallDohHit.ogg').play()
            break;
        case "hitDOH": // Uderza w DOH'a
            new Audio('../audio/dohHit.ogg').play()
            break;
        case "gameOver": // Przegrywa
            new Audio('../audio/gameOver.ogg').play()
            break;
        case "fallOfScreen": // Upada poza ekran
            new Audio('../audio/fallOfScreen.ogg').play()
            break;
        case "hitedByEnemy": // Otrzymuje obrażenia od wroga
            new Audio('../audio/hitedByEnemy.ogg').play()
            break;
        case "clicked":
            new Audio('../audio/click.ogg').play()
            break;



    }
}
// ==================================================================================================== //


// ==================================================================================================== //
// Ustawia paletę pozycji cegieł
// ==================================================================================================== //
function setPalette() {
    let brickX = -0.1
    let brickY = 100
    allBricks.forEach((el, i) => {
        el.dataset.x = brickX
        el.dataset.y = brickY

        if (brickX > 880) {
            brickX = -0.1
            brickY += 50
        }
        else
            brickX += 100
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

            if (pickedType == 8)
                playSound("brickHit", 8)
            else if (pickedType == 9)
                playSound("brickHit", 9)
            else
                playSound("clicked")
        })
    })
    // Wczytuje img do klocków
    allBricks.forEach((el, i) => {
        el.addEventListener("click", e => {
            e.target.style.backgroundImage = `url(../img/bricks/${pickedImage}.jpg)`
            e.target.dataset.type = pickedType

            playSound("clicked")
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
                // // Wczytuje poziomy do selecta
                // levelList.forEach((el, i) => {
                //     let option = document.createElement("option")
                //     option.value = el
                //     // console.log(el);
                //     option.innerText = el
                //     selectLevel.appendChild(option)

                // })

            })
    }
    // Wczytuje poziomy z localstorage do levelList nie zaczynające się od "_" (nr rozpoczęcia poziomu do rozpoczynania gry)
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i)

        if (key[0] != "_")
            levelList.push(key)
    }

    // Sortuje levelList po id
    levelList.sort((a, b) => {
        if (parseInt(a.slice(7)) > parseInt(b.slice(7)))
            return 1
        else if (parseInt(a.slice(7)) < parseInt(b.slice(7)))
            return -1
        else
            return 0
    })


    // Wczytuje poziomy do selecta
    levelList.forEach((el, i) => {
        let option = document.createElement("option")
        option.value = el
        option.innerText = el
        
        selectLevel.appendChild(option)
    })




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
clearButton.addEventListener("click", () => {
    if (confirm("Czy na pewno chcesz wyczyścić edytor?"))
        playSound("clicked")
        clearEditor()
})

// ==================================================================================================== //
// Wczytywanie poziomu z localstorage do edytora
// ==================================================================================================== //
loadButton.addEventListener("click", e => {
    if (selectLevel.value != 0 && confirm("Upewnij się, że Twoja praca została zapisana przed wczytaniem nowego poziomu! \nW przeciwnym wypadku dane zostaną utracone.")) {
        clearEditor()
        playSound("clicked")

        let levelName = selectLevel.value
        levelNameInput.value = levelName

        levelNameInput.value = levelName

        let level = JSON.parse(localStorage.getItem(levelName))
        // console.log(level);
        level.forEach((el, i) => {
            allBricks.forEach((el2, i2) => {
                console.log(el.x, el2.dataset.x);
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
function saveLevel(saveButton = false) {
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

        if (object) {
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


            if (saveButton)
                alert("Poziom został zapisany")

            return true
        } else {
            alert("Nie można zapisać pustego poziomu")
            return false
        }


    }
    else {
        if (saveButton)
            alert("Podaj nazwę poziomu")
        return false
    }
}

saveButton.addEventListener("click", () => {
    saveLevel(true)
    playSound("clicked")
})
// ==================================================================================================== //
// Usuwanie poziomu
// ==================================================================================================== //
deleteButton.addEventListener("click", e => {
    if (selectLevel.value != 0) {
        if (confirm(`Czy na pewno chcesz usunąć ${selectLevel.value}`)) {
            let levelName = selectLevel.value
            localStorage.removeItem(levelName)
            selectLevel.removeChild(selectLevel.querySelector(`option[value="${levelName}"]`))
        
            playSound("clicked")
        }
    }
})

// ==================================================================================================== //
// Uruchamia poziom
// ==================================================================================================== //
playButton.addEventListener("click", e => {
    if (selectLevel.value != 0 && saveLevel()) {

        let levelName = selectLevel.value
        let level = JSON.parse(localStorage.getItem(levelName))
        localStorage.setItem("_startFrom", levelName)

        playSound("clicked")

        // Owtórz link z poziomem w tej samej karcie
        setTimeout(() => {
            window.open(`../index.html`, "_self")
        }, 100)


    }
    else {
        alert("Wczytaj poziom lub zapisz go przed uruchomieniem")
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
