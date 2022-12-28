// ========================================[ Ustawia pole gry ]======================================== //
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
// ==================================================================================================== //

// ============================[ Ustawianie rozdzielczości okienka canvas ]============================ //
canvas.width = 5000
canvas.height = 5000
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
                return Math.sqrt(Math.pow(this.x) + Math.pow(this.y))
        }

        //Zwraca swoją znormalizowaną wersje (czyli liczby w zakresie 0-1)
        normalized() {
                let len = this.length();
                return new Vector2D(this.x / len, this.y / len)
        }
}


// ================================[ Odpowiada za działanie platformy ]================================ //
let platform = {
        size: new Vector2D(1100, canvas.height / 100 * 2.5),
        pos: null,
        move: canvas.width / 100 * 2,
        holdBall: true,

        draw() {
                context.fillStyle = 'blue';
                context.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y)
        },

        // Funkcja wywoływana do zmieniania pozycji platformy
        // updatePlatformPos(direction) {
        //         if (direction == 'l')
        //                 context.clearRect(platform.pos.x + platform.move, platform.pos.y - 1, platform.size.x, platform.size.y + 1)
        //         else
        //                 context.clearRect(platform.pos.x - platform.move, platform.pos.y - 1, platform.size.x, platform.size.y + 1)
        //         context.fillRect(platform.pos.x, platform.pos.y, platform.size.x, platform.size.y)
        // }


}

platform.pos = new Vector2D(canvas.width / 2 - platform.size.x / 2, canvas.height - platform.size.y * 2.5)

// ================================[ Klasa piłek ]============================ //

class Ball {
        static list = [];

        constructor(pos, dir, size) {
                this.pos = pos; // Przechowuje pozycje piłki
                this.dir = dir; // Przechowuje prędkość oraz kierunek piłki
                this.size = size; // Przechowuje wielkość piłki

                this.speed = 10;
                this.texture = new Image();
                this.texture.src = "img/ball.png";

                Ball.list.push(this);
        }

        setPos(x, y) {
                this.pos.x = x;
                this.pos.y = y;
        }

        setDir(x, y) {
                this.dir.x = x;
                this.dir.y = y;
        }

        invertDir() { this.dir.x *= -1; this.dir.y *= -1; }
        invertDirX() { this.dir.x *= -1; }
        invertDirY() { this.dir.y *= -1; }

        draw() {
                context.drawImage(this.texture, this.pos.x, this.pos.y, this.size, this.size)
        }
}

let originalBall = new Ball(
        new Vector2D( // Ustawia pozycje
                null,   // x
                null    // y
        ),
        new Vector2D(0, 0), // Kierunek
        250 // Size
);
originalBall.pos.x = platform.pos.x + platform.size.x / 2 - originalBall.size / 2
originalBall.pos.y = platform.pos.y - 0 - originalBall.size



// Funkcja sprawdzająca naciśnięcie strzałek - służy do poruszania platformą
document.addEventListener("keydown", e => {
        if (e.key == "ArrowLeft") {
                if (platform.pos.x > 0) {
                        platform.pos.x -= platform.move;
                        // platform.updatePlatformPos('l');

                        if (platform.holdBall) {
                                originalBall.setPos(platform.pos.x + platform.size.x / 2 - originalBall.size / 2, platform.pos.y - 15 - originalBall.size);
                        }
                }
        } else if (e.key == "ArrowRight") {
                if (platform.pos.x + platform.size.x < canvas.width) {
                        platform.pos.x += platform.move;
                        // platform.updatePlatformPos('r');

                        if (platform.holdBall) {
                                originalBall.setPos(platform.pos.x + platform.size.x / 2 - originalBall.size / 2, platform.pos.y - 15 - originalBall.size);
                        }
                }
        }



        if (platform.holdBall && e.key == " ") //fajna ta spacja
        {
                platform.holdBall = false;

                originalBall.setDir(0, -1)
        }
})
// ==================================================================================================== //


// =================================[ Odpowiada za rysowanie cegieł ]================================== //
class Brick {
        static list = [];

        constructor(pos, size) {
                this.pos = pos;
                this.size = size;

                this.texture = new Image();
                this.texture.src = "img/greenBrick.jpg";

                this.type = null
                this.health = null

                Brick.list.push(this);
        }

        // Rysuje cegłe
        draw() {
                context.drawImage(this.texture, this.pos.x, this.pos.y, canvas.width / 10 - 0.1, canvas.height / 20 - 0.1);
        }
        // Usuwa cegłe
        remove() {
                Brick.list.forEach((el, index) => {
                        if (el == this) {
                                Brick.list.splice(index, 1);
                        }
                })
        }
}




// ---------------------[ Generuje pozycje cegieł ]---------------------- //

let allBricks = [] // Tablica wszystkich cegieł
const brick = new Image() // Obiekt tworzący cegłe
for (let forX = -0.1; forX < canvas.width - 1; forX += canvas.width / 10) { // Generuje cegły w poziomie [poz. początkowa, poz. końcowa. długość cegły]
        let bricksV = [] // Przechowuje tymczasowo pionowy rząd cegieł
        for (let forY = canvas.height / 10; forY < canvas.height / 10 * 6; forY += canvas.height / 20) { // Generuje cegły w pionie [wysokość początkowa, wysokość końcowa. wysokość cegły]
                bricksV.push(
                        new Brick(new Vector2D(forX, forY), new Vector2D(canvas.width / 10 - 0.1, canvas.height / 20 - 0.1))
                )
        }
        allBricks.push(bricksV) // Wkłada tablicę pionowego rzędu cegieł do wszystkich cegieł
}

// ---------------------------------------------------------------------- //

// ----------------------[ Generowanie na planszy ]---------------------- //
// allBricks.forEach((bricksV) => {
//         bricksV.forEach((el) => {
//                 el.create()
//         })
// })
// ---------------------------------------------------------------------- //

// ==================================================================================================== //


window.requestAnimationFrame(gameLoop)

function gameLoop(cTime) {
        think(cTime);
        draw();

        window.requestAnimationFrame(gameLoop)
}

function think(cTime) {
        Ball.list.forEach((el) => {
                //Kolizja z ścianami
                if (el.pos.x <= 0 || el.pos.x + el.size >= canvas.width)
                        el.invertDirX();
                if (el.pos.y <= 0 || el.pos.y + el.size >= canvas.height)
                        el.invertDirY();

                //Kolizja z cegłami
                Brick.list.forEach((brick) => {
                        if
                                (
                                brick.pos.x <= el.pos.x &&
                                brick.pos.x + brick.size.x >= el.pos.x &&
                                brick.pos.y <= el.pos.y &&
                                brick.pos.y + brick.size.y >= el.pos.y
                        ) {
                                el.invertDirY();
                                brick.remove();
                                return;
                        }
                })

                //Kolizja z platformą
                if (
                        platform.pos.x <= el.pos.x + el.size &&
                        platform.pos.x + platform.size.x >= el.pos.x &&
                        platform.pos.y <= el.pos.y + el.size &&
                        platform.pos.y + platform.size.y >= el.pos.y
                ) {
                        let hitFactor = (el.pos.x - (platform.pos.x + platform.size.x / 2)) / platform.size.x

                        el.dir.x = hitFactor;
                        el.dir.y *= -1;
                }


                //Ruch piłek
                el.pos.x += el.dir.x * el.speed
                el.pos.y += el.dir.y * el.speed
        })
}

function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height) //Usuwa poprzednią klatke



        platform.draw();

        Ball.list.forEach((el) => {
                el.draw();
        })

        Brick.list.forEach((el) => {
                el.draw();
        })



        context.stroke(); //Kończy rysować nową klatke
}