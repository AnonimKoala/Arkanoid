const rows = document.querySelectorAll(".row")              // Wszystkie wiersze bloków
const allBricks = document.querySelectorAll(".row > li")    // Wszystkie bloki w generatorze (pole do edycji)
const chooseColorDiv = document.querySelectorAll("#chooseType > li") // Wszystkie klocki z palety kolorów
let pickedImage     // Wybrany kolor z palety kolorów
let pickedType     // Wybrany typ klocka z palety kolorów

const selectLevel = document.querySelector("#chooseToEdit") // Lista poziomów do edycji - zielony <select>
const loadButton = document.querySelector("#loadButton")   // Przycisk wczytania poziomu do edycji - jasno zielony <button>

const levelNameInput = document.querySelector("#levelName") // Pole do wpisania nazwy poziomu - niebieski <input>
const saveButton = document.querySelector("#saveButton")   // Przycisk zapisu poziomu - niebieski <button>

const playButton = document.querySelector("#play")            // Przycisk odtwarzania poziomu - żółty <button>
const deleteButton = document.querySelector("#deleteButton") // Przycisk usuwania poziomu - zielony <button>
const clearButton = document.querySelector("#clearButton")  // Przycisk czyszczenia poziomu - czerwony <button>

// ==================================================================================================== //
// Menu pomoc
// ==================================================================================================== //\
const helpScreen = document.querySelector("#help") // Ekran pomocy
document.querySelector("#help .buttonTheme").addEventListener("click", e => { // Zamyka ekran pomocy
    playSound("clicked")                                              // Odtwarza dźwięk kliknięcia
    helpScreen.style.animation = "flyToLeft 2s ease-in-out forwards" // Animacja znikania ekranu pomocy
    setTimeout(() => {
        helpScreen.style.display = "none"                          // Ukrywa ekran pomocy całkowicie
    }, 3000)
})


// ==================================================================================================== //
// Wyjście z generatora
// ==================================================================================================== //
const exitButton = document.querySelector("#exit") // Przycisk wyjścia z generatora
exitButton.addEventListener("click", e => {
    playSound("clicked")                  // Odtwarza dźwięk kliknięcia
    setTimeout(() => {                   // Czekanie 0.5s
        location.href = "../index.html" // Przekierowanie do strony głównej
    }, 500)
})

// ========================================[ Odtwarza dźwięk ]======================================== // 
function playSound(sound, type = 0) { // Funkcja odtwarzająca dźwięk
    switch (sound) {     // Wybiera dźwięk na podstawie parametru
        case 'hitEdge': // Uderzenie w krawędź canvas
            new Audio('../audio/balHitEdge.ogg').play()
            break;
        case "brickHit": // Uderzenie w cegłę
            if (type != 8 && type != 9)
                new Audio('../audio/brickHit.ogg').play()
            else if (type == 9)
                new Audio('../audio/goldHitSound.ogg').play() // Dźwięk uderzenia w złotą cegłę
            else if (type == 8)
                new Audio('../audio/silverHitSound.ogg').play() // Dźwięk uderzenia w srebrną cegłę
            break;
        case "hitPlatform": // Uderzenie w platformę
            new Audio('../audio/platformHit.ogg').play()
            break;
        case "hitSmallDOH": // Uderzenie w małego DOH'a
            new Audio('../audio/smallDohHit.ogg').play()
            break;
        case "hitDOH": // Uderzenie w DOH'a
            new Audio('../audio/dohHit.ogg').play()
            break;
        case "gameOver": // Dźwięk końca gry
            new Audio('../audio/gameOver.ogg').play()
            break;
        case "fallOfScreen": // Dźwięk spadnięcia piłki poza ekran
            new Audio('../audio/fallOfScreen.ogg').play()
            break;
        case "hitedByEnemy": // Dxwiek uderzenia przeciwnika w platformę
            new Audio('../audio/hitedByEnemy.ogg').play()
            break;
        case "clicked": // Dźwięk kliknięcia
            new Audio('../audio/click.ogg').play()
            break;



    }
}
// ==================================================================================================== //


// ==================================================================================================== //
// Ustawia paletę pozycji cegieł
// ==================================================================================================== //
function setPalette() { // Funkcja ustawiająca paletę pozycji cegieł
    let brickX = -0.1 // Pozycja X pierwszego klocka
    let brickY = 100 // Pozycja Y pierwszego klocka

    allBricks.forEach((el, i) => { // Ustawia pozycję każdego klocka
        el.dataset.x = brickX // Ustawia pozycję X klocka z palety
        el.dataset.y = brickY // Ustawia pozycję Y klocka z palety

        if (brickX > 880) { // Jeżeli klocek jest ostatni w wierszu
            brickX = -0.1 // Ustawia pozycję X na początek
            brickY += 50 // Ustawia pozycję Y na kolejny wiersz
        }
        else               // Jeżeli klocek nie jest ostatni w wierszu
            brickX += 100 // Ustawia pozycję X na kolejny klocek w wierszu
    })
}
// ==================================================================================================== //
// Uruchamia skrypt
// ==================================================================================================== //
startGenerator() // Uruchamia skrypt generatora

function startGenerator() { // Funkcja uruchamiająca generator
    setPalette() // Ustawia paletę pozycji cegieł


    // ----------------------[ Wczytuje wybrany kolor ]---------------------- //
    chooseColorDiv.forEach((el, i) => {
        el.addEventListener("click", e => { // Wybiera kolor cegły po kliknięciu

            // Usuwa klasę "picked" z wszystkich klocków
            chooseColorDiv.forEach(eC => {
                eC.classList.remove("picked")
            })


            el.classList.add("picked")            // Dodaje klasę "picked" do wybranego klocka
            pickedImage = e.target.dataset.image // Wybiera obrazek klocka
            pickedType = i                      // Wybiera typ klocka

            if (pickedType == 8)             // Jeżeli wybrano złoty klocek
                playSound("brickHit", 8)    // Odtwarza dźwięk złotego klocka
            else if (pickedType == 9)      // Jeżeli wybrano srebrny klocek
                playSound("brickHit", 9)  // Odtwarza dźwięk srebrnego klocka
            else                         // Jeżeli wybrano inny klocek
                playSound("clicked")    // Odtwarza dźwięk kliknięcia
        })
    })
    // ---------------------------------------------------------------------- //


    // ---------------------[ Wczytuje img do klocków ]---------------------- //
    allBricks.forEach((el, i) => {
        el.addEventListener("click", e => {
            e.target.style.backgroundImage = `url(../img/bricks/${pickedImage}.jpg)`
            e.target.dataset.type = pickedType

            playSound("clicked")
        })
    })
    // ---------------------------------------------------------------------- //


    // --------------------[ Czyta poziomy z pliku JSON ]-------------------- //
    let levelList = [] // Lista poziomów
    if (localStorage.length < 10) { // Jeżeli jest mniej niż 10 poziomów w localstorage
        localStorage.clear()       // Wyczyść localstorage
        fetch("basicLevels.json") // Wczytaj poziomy z pliku JSON
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonFile) {
                jsonFile.forEach((el, i) => { // Dodaje poziomy do localstorage
                    levelList.push(el.id)    // Dodaje poziom do listy poziomów

                    if (localStorage.getItem(el.id) == null) // Sprawdza czy poziom jest w localstorage
                        localStorage.setItem(el.id, JSON.stringify(el.bricks)) // Jeśli nie ma to dodaje
                })
            })
    }
    // ---------------------------------------------------------------------- //


    // -----------[ Wczytuje poziomy z localstorage do levelList ]----------- // 
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i) // Wczytuje klucz z localstorage

        if (key[0] != "_" && localStorage.getItem(key)[0] == '[') // Sprawdza czy klucz jest poziomem
            levelList.push(key)                                  // Jeśli tak to dodaje poziom do listy poziomów
    }
    // ---------------------------------------------------------------------- //


    // -----------[ Zabezpieczenie przeciwko błędom wczytywania ]------------ //
    if (!levelList) {                                            // Jeśli nie wczytano poziomów
        localStorage.clear()                                  // Czyści localstorage
        alert("Błąd wczytywania. Spróbuj odświeżyć stronę.") // Wyświetla komunikat
        location.reload()                                   // Odświeża stronę
    }
    // ---------------------------------------------------------------------- //


    // ---------------------[ Sortuje levelList po id ]---------------------- //
    levelList.sort((a, b) => {
        if (parseInt(a.slice(7)) > parseInt(b.slice(7)))
            return 1
        else if (parseInt(a.slice(7)) < parseInt(b.slice(7)))
            return -1
        else
            return 0
    })
    // ---------------------------------------------------------------------- //


    // -------------------[ Wczytuje poziomy do selecta ]-------------------- //
    levelList.forEach((el, i) => {
        let option = document.createElement("option") // Tworzy opcję selecta
        option.value = el                            // Ustawia wartość opcji
        option.innerText = el                       // Ustawia tekst opcji
        selectLevel.appendChild(option)            // Dodaje opcję do selecta
    })
    // ---------------------------------------------------------------------- //
}

// ==================================================================================================== //
// Czyści edytor
// ==================================================================================================== //

// -----------------------------[ Funkcja ]------------------------------ //
function clearEditor() {                    // Funkcja czyszcząca edytor
    allBricks.forEach((el, i) => {         // Przechodzi przez wszystkie klocki palety
        el.style.backgroundImage = "none" // Usuwa obrazek z klocka
        el.dataset.type = 10             // Ustawia typ klocka na 10
    })
}
// ---------------------------------------------------------------------- //

// -----------------------------[ Eventy ]------------------------------ //
clearButton.addEventListener("click", () => {               // Czyści edytor po kliknięciu w przycisk
    if (confirm("Czy na pewno chcesz wyczyścić edytor?"))  // Wyświetla okno potwierdzenia
        playSound("clicked")                              // Odtwarza dźwięk kliknięcia
    clearEditor()                                    // Czyści edytor
})
// ---------------------------------------------------------------------- //

// ==================================================================================================== //
// Wczytywanie poziomu z localstorage do edytora
// ==================================================================================================== //
loadButton.addEventListener("click", e => { // Wczytuje poziom po kliknięciu w przycisk
    if (selectLevel.value != 0 && confirm("Upewnij się, że Twoja praca została zapisana przed wczytaniem nowego poziomu! \nW przeciwnym wypadku dane zostaną utracone.")) {
        clearEditor()         // Czyści edytor
        playSound("clicked") // Odtwarza dźwięk kliknięcia

        let levelName = selectLevel.value // Wczytuje nazwę poziomu z selecta
        levelNameInput.value = levelName // Wczytuje nazwę poziomu do inputa

        let level = JSON.parse(localStorage.getItem(levelName)) // Wczytuje poziom z localstorage do level

        level.forEach((el, i) => {              // Przechodzi przez wszystkie klocki poziomu
            allBricks.forEach((el2, i2) => {   // Przechodzi przez wszystkie klocki palety
                if (el.x == el2.dataset.x && el.y == el2.dataset.y) { // Sprawdza czy klocki mają takie same współrzędne
                    el2.dataset.type = el.type                   // Ustawia typ klocka na typ wczytanego klocka
                    switch (parseInt(el.type)) {                // Ustawia obrazek klocka na obrazek wczytanego klocka wg typu
                        case 0:
                            el2.style.backgroundImage = "url(../img/bricks/whiteBrick.jpg)" // Ustawia obrazek klocka na biały
                            break;
                        case 1:
                            el2.style.backgroundImage = "url(../img/bricks/orangeBrick.jpg)" // Ustawia obrazek klocka na pomarańczowy
                            break;
                        case 2:
                            el2.style.backgroundImage = "url(../img/bricks/cyanBrick.jpg)" // Ustawia obrazek klocka na cyjanowy
                            break;
                        case 3:
                            el2.style.backgroundImage = "url(../img/bricks/greenBrick.jpg)" // Ustawia obrazek klocka na zielony
                            break;
                        case 4:
                            el2.style.backgroundImage = "url(../img/bricks/redBrick.jpg)" // Ustawia obrazek klocka na czerwony
                            break;
                        case 5:
                            el2.style.backgroundImage = "url(../img/bricks/blueBrick.jpg)" // Ustawia obrazek klocka na niebieski
                            break;
                        case 6:
                            el2.style.backgroundImage = "url(../img/bricks/pinkBrick.jpg)" // Ustawia obrazek klocka na różowy
                            break;
                        case 7:
                            el2.style.backgroundImage = "url(../img/bricks/yellowBrick.jpg)" // Ustawia obrazek klocka na żółty
                            break;
                        case 8:
                            el2.style.backgroundImage = "url(../img/bricks/silverBrick.jpg)" // Ustawia obrazek klocka na srebrny
                            break;
                        case 9:
                            el2.style.backgroundImage = "url(../img/bricks/goldBrick.jpg)" // Ustawia obrazek klocka na złoty
                            break;
                        case '':    // Jeśli klocek nie ma typu
                            break; // Nic nie robi
                        default:                                                              // Jeśli klocek ma typ, który nie jest liczbą
                            el2.style.backgroundImage = `url(../img/bricks/${el.type}.jpg)`  // Ustawia obrazek klocka na obrazek wczytanego klocka wg nazwy
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
function saveLevel(saveButton = false) {                                    // Funkcja zapisująca poziom
    if (levelNameInput.value != "") {                                      // Jeśli nazwa poziomu nie jest pusta
        let levelName = levelNameInput.value                              // Wczytuje nazwę poziomu z inputa
        let object = []                                                  // Tworzy pustą tablicę
        allBricks.forEach((el, i) => {                                  // Przechodzi przez wszystkie klocki palety
            if (el.dataset.type != 10 && el.dataset.type != undefined) // Jeśli klocek ma typ i nie jest pustym klockiem
                object.push({                                         // Dodaje do tablicy obiekt z danymi klocka
                    x: el.dataset.x,                                 // Współrzędne X klocka
                    y: el.dataset.y,                                // Współrzędne Y klocka
                    type: el.dataset.type                          // Typ klocka
                })
        })

        let json = JSON.stringify(object) // Zamienia tablicę na JSON

        if (object) {                              // Jeśli tablica nie jest pusta
            localStorage.setItem(levelName, json) // Zapisuje poziom do localstorage

            let option = document.createElement("option") // Tworzy nowy element option

            if (selectLevel.querySelector(`option[value="${levelName}"]`) == null) { // Jeśli poziom jeszcze nie istnieje to dodaje go do selecta
                option.value = levelName                                            // Ustawia wartość optiona na nazwę poziomu
                option.innerText = levelName                                       // Ustawia tekst optiona na nazwę poziomu
                selectLevel.appendChild(option)                                   // Dodaje option do selecta
            }


            if (saveButton)                      // Jeśli funkcja została wywołana przez przycisk zapisz
                alert("Poziom został zapisany") // Wyświetla komunikat o zapisaniu poziomu

            return true // Zwraca true

        } else {                                        // Jeśli tablica jest pusta
            alert("Nie można zapisać pustego poziomu") // Wyświetla komunikat o błędzie
            return false                              // Zwraca false   
        }


    } 
    else {                                   // Jeśli nazwa poziomu jest pusta
        if (saveButton)                     // Jeśli funkcja została wywołana przez przycisk zapisz
            alert("Podaj nazwę poziomu")   // Wyświetla komunikat
        return false                      // Zwraca false
    }
}

saveButton.addEventListener("click", () => { // Dodaje event listener do przycisku zapisz
    saveLevel(true)                         // Wywołuje funkcję zapisującą poziom z parametrem true
    playSound("clicked")                   // Odtwarza dźwięk kliknięcia
})
// ==================================================================================================== //
// Usuwanie poziomu
// ==================================================================================================== //
deleteButton.addEventListener("click", e => {                                                       // Dodaje event listener do przycisku usuń
    if (selectLevel.value != 0) {                                                                  // Jeśli wybrano poziom
        if (confirm(`Czy na pewno chcesz usunąć ${selectLevel.value}`)) {                         // Wyświetla okno potwierdzające usunięcie poziomu
            let levelName = selectLevel.value                                                    // Wczytuje nazwę poziomu z selecta
            localStorage.removeItem(levelName)                                                  // Usuwa poziom z localstorage         
            selectLevel.removeChild(selectLevel.querySelector(`option[value="${levelName}"]`)) // Usuwa option z selecta

            playSound("clicked")                                                             // Odtwarza dźwięk kliknięcia
        }
    }
})

// ==================================================================================================== //
// Uruchamia poziom
// ==================================================================================================== //
playButton.addEventListener("click", e => {                         // Dodaje event listener do przycisku uruchom
    if (selectLevel.value != 0 && saveLevel()) {                   // Jeśli wybrano poziom i poziom został zapisany

        let levelName = selectLevel.value               // Wczytuje nazwę poziomu z selecta 
        localStorage.setItem("_startFrom", levelName)  // Zapisuje nazwę poziomu do uruchomienia do localstorage

        playSound("clicked")                         // Odtwarza dźwięk kliknięcia

        setTimeout(() => {                         // Odczekuje 100ms
            window.open(`../index.html`, "_self") // Otwiera stronę z grą
        }, 100)


    }
    else {                                                         // Jeśli nie wybrano poziomu lub poziom nie został zapisany
        alert("Wczytaj poziom lub zapisz go przed uruchomieniem") // Wyświetla komunikat
    }
})
// ==================================================================================================== //