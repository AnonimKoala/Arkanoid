// ========================================[ Ustawia pole gry ]======================================== //
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
// ==================================================================================================== //


// ============================[ Ustawianie rozdzielczości okienka canvas ]============================ //
canvas.width = 5000
canvas.height = 5000
// ==================================================================================================== //


// =======================================[ Dotyczy pauzy gry ]======================================== //
let gameStarted = false // Przechowuje stan czy gra jest uruchomiona
let gamePaused = false // Czy gra się zatrzymana
let gameOvered = false // Czy gra jest zakończona

function pauseTheGame(e) {
        if (e.key == 'Escape' && gameStarted) {
                gamePaused = !gamePaused

                if (gamePaused) {
                        context.font = "bold 540px Arial";
                        context.fillStyle = '#6774eb';
                        context.fillText(`Game paused`, 750, 4000)
                }

        }
}
// ==================================================================================================== //


// =============================[ Uruchamiane po stracie wszystkich żyć ]============================== //
function gameOver() {
        context.clearRect(0, 0, canvas.width, canvas.height) // Czyści ekran

        document.removeEventListener("click",gameOver)
        restartTheGame()
        
}
// ==================================================================================================== //


// ========================================[ Dotyczące gracza ]======================================== //
let playerLevel = 1
let playerHealth = 3
let playerPoints = 0

function resetAfterLostHealth() {
        platform.holdBall = true
        platform.pos = new Vector2D(canvas.width / 2 - platform.size.x / 2, canvas.height - platform.size.y * 2.5)

        // Na początku piłka pojawia się nad platformą
        originalBall.pos.x = platform.pos.x + platform.size.x / 2 - originalBall.size / 2
        originalBall.pos.y = platform.pos.y - 10 - originalBall.size
}
// ==================================================================================================== //


// =========================================[ Restartuje gre ]========================================= //
function restartTheGame() {
        gameStarted = false
        gameOvered = false
        gamePaused = false

        // ============[ Wczytuje obraz ekranu startowego ]============ //
        const introImg = new Image();
        introImg.addEventListener("load", e => {
                context.drawImage(introImg, 0, 0, canvas.width, canvas.height);
                context.stroke();
        });
        introImg.src = "img/startScreen.svg";
        // ============================================================ //

        canvas.addEventListener("click", e => {
                // Uruchamia grę po kliknięciu w obszarze pola canvas
                gameStarted = true
                gameOvered = false
                gamePaused = false
                document.addEventListener("keydown", pauseTheGame)
        })






        // ---------------------[ Generuje pozycje cegieł ]---------------------- //
        Brick.list = []

        let allBricks = [] // Tablica wszystkich cegieł
        const brick = new Image() // Obiekt tworzący cegłe
        for (let forX = -0.1; forX < canvas.width - 1; forX += canvas.width / 10) { // Generuje cegły w poziomie [poz. początkowa, poz. końcowa. długość cegły]
                let bricksV = [] // Przechowuje tymczasowo pionowy rząd cegieł
                for (let forY = canvas.height / 10; forY < canvas.height / 10 * 6; forY += canvas.height / 20) { // Generuje cegły w pionie [wysokość początkowa, wysokość końcowa. wysokość cegły]
                        bricksV.push(
                                new Brick(
                                        new Vector2D(forX, forY),
                                        new Vector2D(canvas.width / 10 - 0.1, canvas.height / 20 - 0.1),
                                        Math.floor(Math.random() * (9 - 0 + 1)) // Losuje rodzaj cegły
                                )
                        )
                }
                allBricks.push(bricksV) // Wkłada tablicę pionowego rzędu cegieł do wszystkich cegieł
        }

        // ---------------------------------------------------------------------- //
        playerPoints = 0
        playerHealth = 3
        playerLevel = 1

        resetAfterLostHealth()


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
// =========================================================================== //


// ================================[ Odpowiada za działanie platformy ]================================ //
let platform = {
        size: new Vector2D(canvas.width / 4.54, canvas.height / 100 * 2.5), // Długość i szerokość platformy
        pos: null, // Pozycja platformy
        move: canvas.width / 100 * 5,
        holdBall: true, //Czy nasza platforma trzyma piłke

        // Funkcja do rysowania platformy
        draw() {
                context.fillStyle = 'blue';
                context.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y)
        }

}

platform.pos = new Vector2D(canvas.width / 2 - platform.size.x / 2, canvas.height - platform.size.y * 2.5)
// Naciskanie klawiszy
document.addEventListener("keydown", e => {
        // Ruch platformą strzałkami
        if (e.key == "ArrowLeft") {
                if (platform.pos.x > 0) {
                        platform.pos.x -= platform.move;

                        if (platform.holdBall) {
                                originalBall.setPos(platform.pos.x + platform.size.x / 2 - originalBall.size / 2, platform.pos.y - 15 - originalBall.size);
                        }
                }
        } else if (e.key == "ArrowRight") {
                if (platform.pos.x + platform.size.x < canvas.width) {
                        platform.pos.x += platform.move;

                        if (platform.holdBall) {
                                originalBall.setPos(platform.pos.x + platform.size.x / 2 - originalBall.size / 2, platform.pos.y - 15 - originalBall.size);
                        }
                }
        }



        // Wyrzucenie piłki gdy ją trzymamy
        if (platform.holdBall && e.key == " ") {
                platform.holdBall = false;

                originalBall.setDir(0, -1)
        }

})

// Odpowiada za ruch platformy za pomocą myszki
canvas.addEventListener("mousemove", e => {

        // Odpowiada za niewychodzenie platformy poza planszę
        if (
                platform.size.x + e.offsetX * (canvas.width / 1000) - platform.size.x * 1.45 > 0 &&
                (platform.size.x + e.offsetX * (canvas.width / 1000) - platform.size.x * 1.45) + platform.size.x < canvas.width
        )
                platform.pos.x = platform.size.x + e.offsetX * (canvas.width / 1000) - platform.size.x * 1.45

        // Odpowiada za przesuwanie piłki trzymanje przez platformę
        if (platform.holdBall) {
                originalBall.setPos(platform.pos.x + platform.size.x / 2 - originalBall.size / 2, platform.pos.y - 15 - originalBall.size);
        }

})
canvas.addEventListener("mousedown", e => {
        // Wyrzucenie piłki gdy ją trzymamy LPM
        if (platform.holdBall && e.button == 0) {
                platform.holdBall = false;

                originalBall.setDir(0, -1)
        }
})
// ==================================================================================================== //


// ==========================================[ Klasa piłek ]=========================================== //
class Ball {
        static list = []; // Lista wszystkich piłek

        constructor(pos, dir, size) {
                this.pos = pos; // Przechowuje pozycje piłki
                this.dir = dir; // Przechowuje kierunek piłki
                this.size = size; // Przechowuje wielkość piłki

                this.speed = 15; //Szybkość z jaką porusza się piłka
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
        180 // Size
);

// Na początku piłka pojawia się nad platformą
originalBall.pos.x = platform.pos.x + platform.size.x / 2 - originalBall.size / 2
originalBall.pos.y = platform.pos.y - 0 - originalBall.size
// ==================================================================================================== //


// =================================[ Odpowiada za rysowanie cegieł ]================================== //
class Brick {
        static list = [];

        // static playerPoints = 0

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
                        this.health = 2
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

// =======================================[ Funkcje cykliczne ]======================================== //
function gameLoop(cTime) {

        if (gameStarted && !gamePaused && !gameOvered) {
                think(cTime);
                draw();
        } else if (!gamePaused && !gameOvered)
                restartTheGame();

        window.requestAnimationFrame(gameLoop) // Kontynuacja game loopa

}

// Funkcja mająca na celu zająć się logiką gry
function think(cTime) {
        // System kolizji piłki
        Ball.list.forEach((el) => {
                let hit = false; //Jeśli coś dotkneliśmy, nie sprawdzamy kolizji innych rzeczy

                //Kolizja z ścianami
                if (el.pos.x <= 0 || el.pos.x + el.size >= canvas.width) // Kolizja z lewą i prawą ścianą
                {
                        hit = true;
                        el.invertDirX();
                        el.lastTouchedObj = null;
                }

                if (el.pos.y <= 0 || el.pos.y + el.size >= canvas.height && !hit) // Kolizja z górną i dolną ścianą
                {
                        hit = true;
                        el.invertDirY();
                        el.lastTouchedObj = null;
                }



                //Kolizja z cegłami
                if (!hit) {
                        let side = 0 // Strona cegły z którą piłka skolidowała, 0 - brak, 1 - boczna, 2 - górna lub dolna

                        Brick.list.forEach((brick) => {
                                if (!hit) {
                                        let dX, dY;
                                        dX = (el.pos.x + el.size / 2) - (brick.pos.x + brick.size.x / 2)
                                        dY = (el.pos.y + el.size / 2) - (brick.pos.y + brick.size.y / 2)

                                        let width, height;
                                        width = (el.size + brick.size.x) / 2
                                        height = (el.size + brick.size.y) / 2

                                        let crossWidth, crossHeight;
                                        crossWidth = width * dY;
                                        crossHeight = height * dX;

                                        if (Math.abs(dX) <= width && Math.abs(dY) <= height && el.lastTouchedObj != brick) {
                                                if (crossWidth > crossHeight)
                                                        if (crossWidth > -crossHeight) el.invertDirY(); else el.invertDirX();
                                                else
                                                        if (crossWidth > -crossHeight) el.invertDirX(); else el.invertDirY();

                                                hit = true;
                                                el.lastTouchedObj = brick; // Ustawiamy cegłe na ostatni dotknięty obiekt by ominąć ją w następnej iteracji, zapobiega to błędom w kolizji
                                                brick.remove(); // Usuwamy cegłe
                                        }
                                }
                        })
                }


                //Kolizja z platformą
                if (!hit) {
                        let dX, dY;
                        dX = (el.pos.x + el.size / 2) - (platform.pos.x + platform.size.x / 2)
                        dY = (el.pos.y + el.size / 2) - (platform.pos.y + platform.size.y / 2)

                        let hitFactor = (el.pos.x - (platform.pos.x + platform.size.x / 2)) / (platform.size.x / 2) // W którą strone piłka ma polecieć

                        let width, height;
                        width = (el.size + platform.size.x) / 2
                        height = (el.size + platform.size.y) / 2

                        let crossWidth, crossHeight;
                        crossWidth = width * dY;
                        crossHeight = height * dX;

                        if (Math.abs(dX) <= width && Math.abs(dY) <= height && el.lastTouchedObj != platform) {
                                if (crossWidth > crossHeight)
                                        if (crossWidth > -crossHeight) {
                                                el.dir.x = hitFactor;
                                                el.invertDirY();
                                        } else el.invertDirX();
                                else
                                        if (crossWidth > -crossHeight) el.invertDirX(); else {
                                                el.dir.x = hitFactor;
                                                el.invertDirY();
                                        };

                                hit = true;
                                el.lastTouchedObj = platform;
                        }
                }


                //Ruch piłek
                if (!platform.holdBall) {
                        el.pos.x += el.dir.x * el.speed
                        el.pos.y += el.dir.y * el.speed
                }

                // Sprawdza czy piłka wypadła
                if (el.pos.y > canvas.height / 100 * 96.4) {
                        playerHealth--
                        resetAfterLostHealth()
                }

        })
}

function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height) //Usuwa poprzednią klatke

        if (playerHealth > 0) {
                platform.draw(); // Rysuje platformę

                // Rysuje każdą piłke
                Ball.list.forEach((el) => {
                        el.draw();
                })

                // Rysuje każdą cegłe
                Brick.list.forEach((el) => {
                        el.draw();
                })



                // Wyświetla statystyki
                context.font = `bold ${canvas.height / 18.5}px Arial`;
                context.fillStyle = '#0090e1';

                context.fillText(`${playerPoints}💎`, canvas.width / 50, canvas.height / 15.625) // Punkty

                context.fillStyle = '#f8312f';
                context.fillText(`${playerHealth}❤️`, canvas.width - canvas.width / 9, canvas.height / 15.625) // Życie


        }
        else {
                // Wyświetla zdobyte punkty
                context.font = `bold ${canvas.height / 18.5}px Arial`;
                context.fillStyle = '#0090e1';
                context.fillText(`${playerPoints}💎`, canvas.width / 50, canvas.height / 15.625) // Punkty

                // Wyświetla napis koniec gry
                context.font = "bold 540px Arial";
                context.fillStyle = '#6774eb';
                context.fillText(`Game over`, 1000, 2500)

                // Ustawia flagi pauzy i końca gry
                gameOvered = true
                document.removeEventListener("keydown", pauseTheGame)
                document.addEventListener("click", gameOver)       
        }

        context.stroke(); //Kończy rysować nową klatke
}
// ==================================================================================================== //
gameLoop(0) //Zaczyna nasz game loop