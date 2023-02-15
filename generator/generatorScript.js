
// =================================[ Odpowiada za działanie cegieł ]================================== //
class Brick {
    static list = [];

    constructor(pos, size, type) {
        this.pos = pos;
        this.size = size;

        this.health = 1

        this.texture = new Image();

        this.type = type // Rodzaj cegły

        // Ustawia na podstawie typu:
        // - teksturę
        // - wartość punktową
        // - opcjonalnie życie
        if (this.type == 0) {
            this.texture.src = "img/bricks/whiteBrick.jpg"
            this.value = 50
        }
        else if (this.type == 1) {
            this.texture.src = "img/bricks/orangeBrick.jpg"
            this.value = 60
        }
        else if (this.type == 2) {
            this.texture.src = "img/bricks/cyanBrick.jpg";
            this.value = 70
        }
        else if (this.type == 3) {
            this.texture.src = "img/bricks/greenBrick.jpg"
            this.value = 80
        }
        else if (this.type == 4) {
            this.texture.src = "img/bricks/redBrick.jpg"
            this.value = 90
        }
        else if (this.type == 5) {
            this.texture.src = "img/bricks/blueBrick.jpg"
            this.value = 100
        }
        else if (this.type == 6) {
            this.texture.src = "img/bricks/pinkBrick.jpg"
            this.value = 110
        }
        else if (this.type == 7) {
            this.texture.src = "img/bricks/yellowBrick.jpg"
            this.value = 120
        }
        else if (this.type == 8) {
            this.texture.src = "img/bricks/silverBrick.jpg"
            this.value = 50 * playerLevel
            this.health = parseInt(playerLevel / 8) + 2
        }
        else if (this.type == 9) {
            this.texture.src = "img/bricks/goldBrick.jpg"
            this.health = -1
        }



        Brick.list.push(this);
    }

    // Rysuje cegłe
    draw() {
        context.drawImage(this.texture, this.pos.x, this.pos.y, canvas.width / 10 - 0.1, canvas.height / 20 - 0.1);
    }

    // Usuwa cegłe
    remove() {
        this.health-- // Odejmuje życie cegły
        if (this.health == 0)
            Brick.list.forEach((el, index) => {
                if (el == this) {
                    playerPoints += this.value // Dodaje pkt po rozbiciu cegły
                    Brick.list.splice(index, 1);    // Wyrzuca cegłe z listy wszystkich cegieł
                }
            })
    }
}
// ==================================================================================================== //


// ================================[ Klasa wektorów ]========================= //
// Pomogą nam w lepszej organizacji dwunumerycznych list                       //
class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    //Dodaje do siebie drugi wektor
    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
    }

    //Mnoży wektor
    mul(num) {
        this.x *= num;
        this.y *= num;
    }

    //Zwraca długość wektora
    length() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y))
    }

    //Zwraca dystans do podanego wektora
    dist(vec) {
        // return new Vector2D(Math.sqrt(Math.pow(this.x - vec.x)), Math.sqrt(Math.pow(this.y - vec.y)))
        return new Vector2D(this.x - vec.x, this.y - vec.y);
    }

    //Zwraca swoją znormalizowaną wersje (czyli liczby w zakresie 0-1)
    normalized() {
        let len = this.length();
        return new Vector2D(this.x / len, this.y / len)
    }

    //Zamienia wektor na znormalizowany (czyli w zakresie liczb 0-1)
    normalize() {
        let norm = this.normalized();
        this.x = norm.x;
        this.y = norm.y;
    }
}
// =========================================================================== //





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
// Resetuje poziomy domyślne
// ==================================================================================================== //
function resetToDefault() {
    fetch("../levels.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonFile) {
            jsonFile.forEach((el, i) => {
                localStorage.setItem(el.id, JSON.stringify(el.bricks))
            })
        })
        // TODO: naprawić aby nie powatrzał sie poziom w select po resecie
}

// ==================================================================================================== //
// Ustawia paletę klocków
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
    fetch("../levels.json")
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
                console.log(el);
                option.innerText = el
                selectLevel.appendChild(option)

            })

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
clearButton.addEventListener("click", clearEditor)

// ==================================================================================================== //
// Wczytywanie poziomu z localstorage do edytora
// ==================================================================================================== //
loadButton.addEventListener("click", e => {
    if (selectLevel.value != 0) {
        clearEditor()

        let levelName = selectLevel.value
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
        option.value = levelName
        option.innerText = levelName
        selectLevel.appendChild(option)
    }
    else {
        alert("Podaj nazwę poziomu")
    }

})
// ==================================================================================================== //
// Usuwanie poziomu
// ==================================================================================================== //
deleteButton.addEventListener("click", e => {
    let levelName = selectLevel.value
    localStorage.removeItem(levelName)
    selectLevel.removeChild(selectLevel.querySelector(`option[value="${levelName}"]`))
})



































function printJSON() {
    let object = []
    allBricks.forEach((el, i) => {
        if (el.dataset.type != 10 && el.dataset.type != undefined)
            object.push({
                x: el.dataset.x,
                y: el.dataset.y,
                type: el.dataset.type
            })

        // new Brick(
        //     new Vector2D(el.dataset.x, el.dataset.y),
        //     new Vector2D(499.9, 249.9),
        //     el.dataset.type
        // )
    })
    // console.log(JSON.stringify(Brick.list));

    console.log(JSON.stringify(object));
    document.querySelector("#jsonArea").value = JSON.stringify(object)
}










// read local JSON file in javascript
// fetch("../list.json")
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     console.log(data);
//   })
















