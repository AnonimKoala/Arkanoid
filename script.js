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

// ================================[ Odpowiada za działanie platformy ]================================ //
let platform = {
        size: new Vector2D(1100, canvas.height / 100 * 2.5), // Długość i szerokość platformy
        pos: null, // Pozycja platformy
        move: canvas.width / 100 * 2,
        holdBall: true, //Czy nasza platforma trzyma piłke

        // Funkcja do rysowania platformy
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
        static list = []; // Lista wszystkich piłek

        constructor(pos, dir, size) {
                this.pos = pos; // Przechowuje pozycje piłki
                this.dir = dir; // Przechowuje kierunek piłki
                this.size = size; // Przechowuje wielkość piłki

                this.prevPos = new Vector2D(null, null) //Poprzednia pozycja piłki
                this.speed = 25; //Szybkość z jaką porusza się piłka
                this.texture = new Image(); // Tekstura piłki
                this.texture.src = "img/ball.png";

                Ball.list.push(this); // Dodaje do listy wszystkich piłek
        }

        // Zmienia pozycje piłki
        setPos(x, y) {
                this.prevPos = this.pos;

                this.pos.x = x;
                this.pos.y = y;
        }

        // Zmienia kierunek piłki
        setDir(x, y) {
                this.dir.x = x;
                this.dir.y = y;
        }

        invertDir() { this.dir.x *= -1; this.dir.y *= -1; } // Odwraca nam kierunek
        invertDirX() { this.dir.x *= -1; } // Odwraca nasz kierunek tylko na osi X
        invertDirY() { this.dir.y *= -1; } // Odwraca nasz kierunek tylko na osi Y

        // Rysuje naszą piłke
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

// Na początku piłka pojawia się nad platformą
originalBall.pos.x = platform.pos.x + platform.size.x / 2 - originalBall.size / 2
originalBall.pos.y = platform.pos.y - 0 - originalBall.size



// Naciskanie klawiszy
document.addEventListener("keydown", e => {
        // Ruch platformą
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



        // Wyrzucenie piłki gdy ją trzymamy
        if (platform.holdBall && e.key == " ")
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

// ===============[ Funckja ray castingu, czyli sprawdzania czy jest coś w danym kierunku ]============= //
// Startpos to nasz punkt A, a endpos punkt B                                                            //
// Sprawdzamy czy pomiędzy odcinkiem AB znajduje się jakiś obiekt                                        //                                                                                        //
// function raycast(startpos, endpos)
// {
//         let hit = false; //Czy nasza linia dotkła czegokolwiek
//         let hitpos = new Vector2D(null, null) //Pozycja w której linia dotkneła obiekt 
//         let hitobj = null; //Obiekt który dotkneła (jeśli dotkneła)
//         let increment = new Vector2D(endpos.x - startpos.x, endpos.y - startpos.x) //Inkrementacja naszej linii

//         for (let x = startpos.x, y = startpos.y; x < endpos.x && y < endpos.y; x += increment.x, y += increment.y)
//         {
//                 Brick.list.forEach((brick) => {
//                         if 
//                         (
//                                 brick.pos.x < x &&
//                                 brick.pos.x + brick.size.x > x &&
//                                 brick.pos.y < y &&
//                                 brick.pos.y + brick.size.y > y
//                         )
//                         {
//                                 hit = true;
//                                 hitobj = brick;
//                                 return;
//                         }
//                 })

//                 if 
//                 (
//                         platform.pos.x < x &&
//                         platform.pos.x + platform.size.x > x &&
//                         platform.pos.y < y &&
//                         platform.pos.y + platform.size.y > y
//                 )
//                 {
//                         hit = true;
//                         hitobj = platform;
//                 }

//                 if (hit)
//                         hitpos.x = x;
//                         hitpos.y = y;
//                         break;
//         }

//         hitData = {
//                 hit: hit,
//                 hitObj: hitobj,
//                 hitPos: hitpos,
//                 startPos: startpos,
//                 endPos: endpos,
//         };

//         return hitData;
// }

// Funkcja game loop działa co chwilę, wywołując funkcje które będą nam potrzebne
function gameLoop(cTime) {
        think(cTime); 
        draw();

        window.requestAnimationFrame(gameLoop) // Kontynuacja game loopa
}

// Funkcja mająca na celu zająć się logiką gry
function think(cTime) {
        // System kolizji piłki
        Ball.list.forEach((el) => {
                //Kolizja z ścianami
                if (el.pos.x <= 0 || el.pos.x + el.size >= canvas.width) // Kolizja z lewą i prawą ścianą
                        el.invertDirX();
                if (el.pos.y <= 0 || el.pos.y + el.size >= canvas.height) // Kolizja z górną i dolną ścianą
                        el.invertDirY();



                //Kolizja z cegłami

                let side = 0 // Strona cegły z którą piłka skolidowała, 0 - brak, 1 - boczna, 2 - górna lub dolna

                Brick.list.forEach((brick) => {
                        if
                        (
                                brick.pos.x < el.pos.x + el.size &&
                                brick.pos.x + brick.size.x > el.pos.x &&
                                brick.pos.y < el.pos.y + el.size &&
                                brick.pos.y + brick.size.y > el.pos.y
                        ) 
                        {
                                side = 2; // Na razie dajemy 2

                                brick.remove(); // Usuwamy cegłe
                        }

                })

                // Odwracamy kierunek względem dotkniętej cegły
                switch(side)
                {
                        case 1:
                                el.invertDirX();
                                break;
                        case 2:
                                el.invertDirY();
                                break;
                        default:
                                break;
                }

                //Kolizja z platformą
                if 
                (
                        !platform.holdBall &&
                        platform.pos.x < el.pos.x + el.size &&
                        platform.pos.x + platform.size.x > el.pos.x &&
                        platform.pos.y < el.pos.y + el.size &&
                        platform.pos.y + platform.size.y > el.pos.y
                ) 
                {
                        let hitFactor = (el.pos.x - (platform.pos.x + platform.size.x / 2)) / platform.size.x // W którą strone piłka ma polecieć

                        el.dir.x = hitFactor;
                        el.dir.y *= -1;
                }


                //Ruch piłek
                if (!platform.holdBall)
                {
                        el.prevPos = el.pos;

                        el.pos.x += el.dir.x * el.speed
                        el.pos.y += el.dir.y * el.speed
                }
        })
}

function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height) //Usuwa poprzednią klatke



        platform.draw(); // Rysuje platformę

        // Rysuje każdą piłke
        Ball.list.forEach((el) => {
                el.draw();
        })

        // Rysuje każdą cegłe
        Brick.list.forEach((el) => {
                el.draw();
        })



        context.stroke(); //Kończy rysować nową klatke
}

gameLoop(0) //Zaczyna nasz game loop