// ========================================[ Ustawia pole gry ]======================================== //
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
// ==================================================================================================== //

// ============================[ Ustawianie rozdzielczości okienka canvas ]============================ //
canvas.width = 5000
canvas.height = 5000
// ==================================================================================================== //


// ================================[ Odpowiada za działanie platformy ]================================ //
let platform = {
        width: 1100,
        height: canvas.height / 100 * 2.5,
        x: null,
        y: null,
        move: canvas.width / 100 * 4,

        // Funkcja tworząca platformę
        create() {
                context.fillStyle = 'blue';
                context.fillRect(this.x, this.y, this.width, this.height)
        },

        // Funkcja wywoływana do zmieniania pozycji platformy
        updatePlatformPos(direction) {
                if (direction == 'l')
                        context.clearRect(platform.x + platform.move, platform.y - 1, platform.width, platform.height + 1)
                else
                        context.clearRect(platform.x - platform.move, platform.y - 1, platform.width, platform.height + 1)
                context.fillRect(platform.x, platform.y, platform.width, platform.height)
        }


}
platform['x'] = canvas.width / 2 - platform.width / 2
platform['y'] = canvas.height - platform.height * 2.5

platform.create()

// Funkcja sprawdzająca naciśnięcie strzałek - służy do poruszania platformą
document.addEventListener("keydown", e => {
        if (e.key == "ArrowLeft") {
                if (platform.x > 0) {
                        platform.x -= platform.move;
                        platform.updatePlatformPos('l');
                }
        } else if (e.key == "ArrowRight") {
                if (platform.x + platform.width < canvas.width) {
                        platform.x += platform.move;
                        platform.updatePlatformPos('r');
                }
        }

})
// ==================================================================================================== //


// =================================[ Odpowiada za rysowanie cegieł ]================================== //
class Brick {
        constructor(x, y, width, height) {
                this.x = x
                this.y = y
                this.height = height
                this.width = width
                this.type = null
                this.src = "greenBrick.jpg"
                this.health = null
        }
        // Rysuje cegłe
        create() {
                let createImg = new Image()
                createImg.addEventListener("load", e => {
                        console.log("wczytano img");
                        context.drawImage(createImg, this.x, this.y, canvas.width / 10 - 0.1, canvas.height / 20 - 0.1)
                        context.stroke();
                })
                createImg.src = this.src
        }
        // Usuwa cegłe
        remove() {
                setTimeout(a => {
                        context.clearRect(this.x, this.y, this.width, this.height)
                }, 5)
        }
}


// ---------------------[ Generuje pozycje cegieł ]---------------------- //

let allBricks = [] // Tablica wszystkich cegieł
const brick = new Image() // Obiekt tworzący cegłe
for (let forX = -0.1; forX < canvas.width - 1; forX += canvas.width / 10) { // Generuje cegły w poziomie [poz. początkowa, poz. końcowa. długość cegły]
        let bricksV = [] // Przechowuje tymczasowo pionowy rząd cegieł
        for (let forY = canvas.height / 10; forY < canvas.height / 10 * 6; forY += canvas.height / 20) { // Generuje cegły w pionie [wysokość początkowa, wysokość końcowa. wysokość cegły]
                bricksV.push(
                        new Brick(forX, forY, canvas.width / 10 - 0.1, canvas.height / 20 - 0.1)
                )
        }
        allBricks.push(bricksV) // Wkłada tablicę pionowego rzędu cegieł do wszystkich cegieł
}

// ---------------------------------------------------------------------- //

// ----------------------[ Generowanie na planszy ]---------------------- //
allBricks.forEach((bricksV) => {
        bricksV.forEach((el) => {
                el.create()
        })
})
// ---------------------------------------------------------------------- //

// ==================================================================================================== //

