<<<<<<< HEAD:main/script.js
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

=======
// ========================================[ Ustawia pole gry ]======================================== //
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
// ==================================================================================================== //


// ============================[ Ustawianie rozdzielczości okienka canvas ]============================ //
canvas.width = 5000
canvas.height = 5000
// ==================================================================================================== //
// let levelsTempTab = []

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

        document.removeEventListener("click", gameOver)
        restartTheGame()

}
// ==================================================================================================== //


// ========================================[ Dotyczące gracza ]======================================== //
let playerLevel = 1
let playerHealth = 3
let playerPoints = 0
// ==================================================================================================== //


// =============[ Ustawia domyśle wartości pozycji i piłki po uruchominiu nowego poziomu ]============= //
function resetToDefault() {
        removePrevUpgrade();

        platform.holdBall = true
        platform.pos = new Vector2D(canvas.width / 2 - platform.size.x / 2, canvas.height - platform.size.y * 2.5)

        // Na początku piłka pojawia się nad platformą
        originalBall.pos.x = platform.pos.x + platform.size.x / 2 - originalBall.size / 2
        originalBall.pos.y = platform.pos.y - 10 - originalBall.size

        originalBall.speed = 15;
}
// ==================================================================================================== //


// ====================================[ Generuje pozycje cegieł ]===================================== //
function generateBricksPos() {
        Brick.list = []

        let allBricks = [] // Tablica wszystkich cegieł
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

        // levelsTempTab.push(Brick.list)
        // console.log(levelsTempTab);
}
// ==================================================================================================== //


// =========================================[ Restartuje gre ]========================================= //
function restartTheGame() {
        gameStarted = false
        gameOvered = false
        gamePaused = false

        playerLevel = 1

        // ============[ Wczytuje obraz ekranu startowego ]============ //
        const introImg = new Image();
        introImg.addEventListener("load", () => {
                context.drawImage(introImg, 0, 0, canvas.width, canvas.height);
                context.stroke();
        });
        introImg.src = "img/startScreen.svg";
        // ============================================================ //

        canvas.addEventListener("click", () => {
                // Uruchamia grę po kliknięciu w obszarze pola canvas
                gameStarted = true
                gameOvered = false
                gamePaused = false


                // // // TODO: Kiedyś mozna zoptymalizowac - nie ruszac ;)
                // if (Brick.list.length == 100) {
                //         levelsTempTab.splice(playerLevel - 1, 1, Brick.list) // Zapisuje I poziom - testowo
                // }




                document.addEventListener("keydown", pauseTheGame)
        })

        generateBricksPos()

        playerPoints = 0
        playerHealth = 3
        playerLevel = 1

        resetToDefault()
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
                (e.clientX - canvas.getBoundingClientRect().left) * (canvas.width / canvas.getBoundingClientRect().width) - platform.size.x / 2 > 0 &&
                (e.clientX - canvas.getBoundingClientRect().left) * (canvas.width / canvas.getBoundingClientRect().width) - platform.size.x / 2 + platform.size.x < canvas.width
        )
                platform.pos.x = (e.clientX - canvas.getBoundingClientRect().left) * (canvas.width / canvas.getBoundingClientRect().width) - platform.size.x / 2


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

        remove()
        {
                Ball.list.forEach((el, index) => {
                        if (el == this)
                                Ball.list.splice(index, 1);
                })     
        }
}

let originalBall = new Ball(
        new Vector2D( // Ustawia pozycje
                null,   // x
                null    // y
        ),
        new Vector2D(0.25, 1), // Kierunek
        180 // Size
);

// Na początku piłka pojawia się nad platformą
originalBall.pos.x = platform.pos.x + platform.size.x / 2 - originalBall.size / 2
originalBall.pos.y = platform.pos.y - 0 - originalBall.size
// ==================================================================================================== //

// =========================================[ Klasa ulepszeń ]========================================= //

let nextUpgrade = 4;
let prevUpgrade;
let curUpgrade = null;

function removePrevUpgrade()
{
        switch(prevUpgrade)
        {
                case 0:
                        platform.size.x -= Upgrade.platformSizeIncrease;
                        platform.pos.x += Upgrade.platformSizeIncrease / 2;
                        break;
                case 1:
                        Ball.list.forEach((el, index) => {
                                if (el != originalBall)
                                        el.remove();
                        })
                        break;
                case 2:
                        break;
                case 4:
                        break;
                case 5:
                        break;
                default:
                        break;
        }
}

class Upgrade
{
        static list = [];
        static typeToTexture = [
                "upgrades/upgradetest.png",
                "upgrades/upgradetest.png",
                "upgrades/upgradetest.png",
                "upgrades/upgradetest.png",
                "upgrades/upgradetest.png",
                "upgrades/upgradetest.png",
                "upgrades/upgradetest.png"
        ]

        static platformSizeIncrease = 250;

        constructor(pos, type)
        {
                this.pos = pos;
                this.velY = 16;
                this.type = type;

                this.texture = new Image();
                this.texture.src = Upgrade.typeToTexture[this.type];

                Upgrade.list.push(this);
        }

        draw()
        {
                context.drawImage(this.texture, this.pos.x, this.pos.y, canvas.width / 20 - 0.1, canvas.width / 20 - 0.1);
        }

        collect()
        {
                prevUpgrade = curUpgrade;
                curUpgrade = this.type;

                if (curUpgrade == 3) //Więcej żyć
                {
                        playerHealth++;

                        if (prevUpgrade != 3)
                                removePrevUpgrade();
                }
                else if (curUpgrade == 1) //Więcej piłek
                {
                        new Ball(new Vector2D(platform.pos.x + platform.size.x / 2 - 180 / 2, platform.pos.y - 15), new Vector2D(0.25, 1), 180)

                        if (prevUpgrade != 1)
                                removePrevUpgrade();
                }
                else if (prevUpgrade != curUpgrade)
                {
                        removePrevUpgrade();

                        switch(curUpgrade)
                        {
                                case 0: //Zwiększenie długości platformy
                                        platform.size.x += Upgrade.platformSizeIncrease;
                                        platform.pos.x -= Upgrade.platformSizeIncrease / 2;
                                        break;
                                case 2: //Mocniejsze uderzenie
                                        break;
                                case 4: //Laser
                                        break;
                                case 5: //Tryb łapania
                                        break;
                                case 6: //Klon platformy
                                        break;
                                default:
                                        break;
                        }
                }

                this.remove();
        }

        remove()
        {
                Upgrade.list.forEach((el, index) => {
                        if (el == this)
                                Upgrade.list.splice(index, 1);
                })
        }
}

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
                {
                        // if (nextUpgrade == 0)
                        // {
                        //         nextUpgrade = 4;
                        //         new Upgrade(new Vector2D(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2), 1);
                        // } else nextUpgrade--;

                        Brick.list.forEach((el, index) => {
                                if (el == this) {
                                        playerPoints += this.value // Dodaje pkt po rozbiciu cegły
                                        Brick.list.splice(index, 1);    // Wyrzuca cegłe z listy wszystkich cegieł
                                }
                        })
                }
        }
}
// ==================================================================================================== //

// =======================================[ Funkcje cykliczne ]======================================== //
function gameLoop(cTime) {
        if (gameStarted && !gamePaused && !gameOvered) {
                think(cTime);
                draw();

                if (!Brick.list.length)
                        nextLevel()
        } else if (!gamePaused && !gameOvered)
                restartTheGame();

        window.requestAnimationFrame(gameLoop) // Kontynuacja game loopa

}

// Funkcja mająca na celu zająć się logiką gry
function think(cTime) {
        // Logika upgrade'ów
        Upgrade.list.forEach((el) => {
                if (el.velY > -36)
                        el.velY -= 0.5;

                el.pos.y -= el.velY * 0.75;

                //Wyjście poza ekran
                if (el.pos.y > canvas.height)
                        el.remove();


                //Kolizja z platformą
                let dX, dY;
                dX = (el.pos.x + 250 / 2) - (platform.pos.x + platform.size.x / 2)
                dY = (el.pos.y + 250 / 2) - (platform.pos.y + platform.size.y / 2)

                let width, height;
                width = (250 + platform.size.x) / 2
                height = (250 + platform.size.y) / 2

                if (Math.abs(dX) <= width && Math.abs(dY) <= height)
                        el.collect();
        })

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

                        let hitFactor = (el.pos.x - (platform.pos.x + platform.size.x / 2)) / (platform.size.x / 3.5) // W którą strone piłka ma polecieć

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

                if (hit) {
                        el.speed *= 1.015; //Zwiększamy prędkość piłki po kolizji
                        // console.log(el.speed);
                }

                //Ruch piłek
                if (!platform.holdBall) {
                        let len = el.dir.length()
                        el.pos.x += (el.dir.x / len) * el.speed
                        el.pos.y += (el.dir.y / len) * el.speed
                }

                // Sprawdza czy piłka wypadła
                if (el.pos.y > canvas.height / 100 * 96.4) {
                        playerHealth--
                        resetToDefault()
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

                //Rysuje każdy upgrade
                Upgrade.list.forEach((el) => {
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




// ======================================================[ Poziomy ]======================================================= //
function nextLevel() {
        playerLevel++
        console.log("Next Level", playerLevel);
        // console.log(levelsTempTab);
        generateBricksPos()
        // levelsTempTab.push(Brick.list)
        resetToDefault()

        // if(playerLevel == 3)
        //         Brick.list = [...levelsTempTab[0]]

}

// ======================================================================================================================== //
>>>>>>> c9d1ddce9b89725aacadcee7019f39c334110914:script.js
