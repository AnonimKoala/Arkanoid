// ========================================[ Ustawia pole gry ]======================================== //
const canvas = document.getElementById('canvas');
const staticCanvas = document.getElementById('staticCanvas');
const context = canvas.getContext('2d');
const contextStatic = staticCanvas.getContext('2d');
// ==================================================================================================== //

// ========================================= [ Ustawia guziki ] ======================================= //
const playButton = document.getElementById('playButton')
const introScreen = document.getElementById('introScreen')
// ==================================================================================================== //

// ===============================[ Ukrywa ekran startowy ]=========================================== // 
playButton.addEventListener('click', () => {
        playSound("clicked")
        introScreen.style.display = "none";
        gameStarted = true
        gameOvered = false
        gamePaused = false
        document.addEventListener("keydown", pauseTheGame)
})
// ==================================================================================================== //

// ================================[ Otwiera ekran pomocy ]============================================ //
const helpScreen = document.getElementById('helpScreen')
helpScreen.addEventListener("click", function () {
        playSound("clicked")
        helpScreen.style.display = "none"
})
function openHelp() {
        helpScreen.style.display = "block"
}
document.querySelector("#helpButton").addEventListener("click", () => {
        playSound("clicked")
        openHelp()
})
// ==================================================================================================== //


// ================================[ Otwiera ekran edytora ]============================================ //
const loadButton = document.getElementById('loadButton')
loadButton.addEventListener("click", function () {
        playSound("clicked")
        setTimeout(() => {
                window.open("generator/index.html", "_self")
        }, 150);
})
// ==================================================================================================== //

// ============================[ Ustawianie rozdzielczości okienka canvas ]============================ //
canvas.width = 1000
canvas.height = 1000
staticCanvas.width = canvas.width;
staticCanvas.height = canvas.height;
// ==================================================================================================== //

// ========================================[ Odtwarza dźwięk ]======================================== // 
function playSound(sound, type = 0) {
        switch (sound) {
                case 'hitEdge': // Uderza w krawędź canvas
                        new Audio('audio/balHitEdge.ogg').play()
                        break;
                case "brickHit": // Uderza w cegłę
                        if (type != 8 && type != 9)
                                new Audio('audio/brickHit.ogg').play()
                        else if (type == 9)
                                new Audio('audio/goldHitSound.ogg').play() // Silver brick sound
                        else if (type == 8)
                                new Audio('audio/silverHitSound.ogg').play() // Gold brick sound

                        break;
                case "hitPlatform": // Uderza w platformę
                        new Audio('audio/platformHit.ogg').play()
                        break;
                case "hitSmallDOH": // Uderza w małego DOH'a
                        new Audio('audio/smallDohHit.ogg').play()
                        break;
                case "hitDOH": // Uderza w DOH'a
                        new Audio('audio/dohHit.ogg').play()
                        break;
                case "gameOver": // Przegrywa
                        new Audio('audio/gameOver.ogg').play()
                        break;
                case "fallOfScreen": // Upada poza ekran
                        new Audio('audio/fallOfScreen.ogg').play()
                        break;
                case "hitedByEnemy": // Otrzymuje obrażenia od wroga
                        new Audio('audio/hitedByEnemy.ogg').play()
                        break;
                case "clicked":
                        new Audio('audio/click.ogg').play()
                        break;



        }
}
// ==================================================================================================== //

// =======================================[ Dotyczy pauzy gry ]======================================== //
let gameStarted = false // Przechowuje stan czy gra jest uruchomiona
let gamePaused = false // Czy gra się zatrzymana
let gameOvered = false // Czy gra jest zakończona

function pauseTheGame(e) {
        if (e.key == 'Escape' && gameStarted) {
                gamePaused = !gamePaused

                // if (gamePaused) {
                //         let texture = new Image()
                //         texture.src = "img/gamePaused.png"
                //         context.drawImage(texture, 796, canvas.height - 1500, 3408, 852)
                // }

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
        prevUpgrade = curUpgrade;
        curUpgrade = null;
        removeAllUpgrades();

        Upgrade.list = [];
        Projectile.list = [];
        DOH.list.forEach((el) => {
                el.fireBalls = [null, null];
        })

        platform.holdBall = originalBall;
        platform.pos = new Vector2D(canvas.width / 2 - platform.size.x / 2, canvas.height - platform.size.y * 2.5)

        // Na początku piłka pojawia się nad platformą
        originalBall.pos.x = platform.pos.x + platform.size.x / 2 - originalBall.radius
        originalBall.pos.y = platform.pos.y - 10 - originalBall.radius * 2

        originalBall.speed = 4;
        originalBall.dir.x = 0.25;
        originalBall.dir.y = -1;
        originalBall.lastTouchedObj = null;

        setTimeout(() => {
                updateStaticCanvas();
        }, 10)
}
// ==================================================================================================== //



// ====================================[ Uruchami kolejny poziom ]===================================== //
function nextLevel() {
        playerLevel++

        if (playerLevel == 33)
                summonDOH();
        else
                loadLevel();

        resetToDefault()
}
// ==================================================================================================== //


// ======================================[ Wczytuje nowy poziom ]====================================== //
function generateBricks(startFrom = null) {
        // Wczytywanie poziomu z localStorage wg tego co jest w playerLevel
        let json
        if (startFrom != null) {
                json = localStorage.getItem(startFrom) // Wczytuje poziom z localStorage
                introScreen.style.display = "none"; // Ukrywa ekran startowy


                if (startFrom.includes("Poziom")) // Jeżeli jest to zwykły poziom to wpisuje jego numer do playerLevel
                        playerLevel = parseInt(startFrom.replace("Poziom ", "")) // Wpisuje numer poziomu do playerLevel

        } else
                json = localStorage.getItem(`Poziom ${playerLevel}`) // Wczytuje poziom z localStorage

        let allBricks = JSON.parse(json)

        Brick.list = [];

        allBricks.forEach((el, i) => {
                new Brick(
                        new Vector2D(parseInt(el.x), parseInt(el.y)),
                        new Vector2D(99.9, 49.9),
                        parseInt(el.type)
                )
        })

}
function loadLevel(startFrom = null) {
        if (localStorage.length == 0) {
                fetch("generator/basicLevels.json")
                        .then(function (response) {
                                return response.json();
                        })
                        .then(function (jsonFile) {
                                jsonFile.forEach((el, i) => {
                                        // levelList.push(el.id)

                                        // Sprawdza czy poziom jest w localstorage
                                        if (localStorage.getItem(el.id) == null)
                                                localStorage.setItem(el.id, JSON.stringify(el.bricks)) // Jeśli nie ma to dodaje
                                })
                        })
                        .then(() => {
                                generateBricks(startFrom)
                        })
        } else {
                generateBricks(startFrom)
        }
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

        introScreen.style.display = "grid";

        playerLevel = 1

        canvas.addEventListener("click", () => {
                // Uruchamia grę po kliknięciu w obszarze pola canvas
                gameStarted = true
                gameOvered = false
                gamePaused = false

                document.addEventListener("keydown", pauseTheGame)
        })

        DOH.list.forEach((el) => {
                el.remove();
        })

        MiniDOH.list = [];


        playerPoints = 0
        playerLevel = 1
        playerHealth = 3

        // Wczytuje pierwszy poziom
        if (localStorage.getItem("_startFrom") != null) { // Wczytuje poziom wybrany przez gracza w edytorze
                gameStarted = true
                gameOvered = false
                gamePaused = false

                if (localStorage.getItem("_startFrom") != "Poziom 1")
                        playerLevel = 0

                loadLevel(localStorage.getItem("_startFrom"))
                localStorage.removeItem("_startFrom")
        } else
                loadLevel() // Wczytuje pierwszy poziom jeśli nie ma wybranego przez gracza


        resetToDefault()
}
// ==================================================================================================== //
// Wyświetla ekran końcowy i restartuje grę
function victory() {
        document.querySelector("#victory").style.display = "grid";
        document.querySelector("#victory").addEventListener("click", () => {
                document.querySelector("#victory").style.display = "none";
                restartTheGame()
        })
}


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
        prevPos: null, //Poprzednia pozycja
        move: canvas.width / 100 * 5,
        holdBall: null, //Czy nasza platforma trzyma piłke
        timesIncreased: 0, //Ile razy nasza platforma została powiększona upgradem
        canCatchBall: false, //Czy może złapać piłke (upgrade łapania)
        texture: new Image(),

        // Funkcja do rysowania platformy
        draw() {
                if (this.canCatchBall) this.texture.src = "img/textures/platform_sticky.png"; else this.texture.src = "img/textures/platform.png";
                context.drawImage(this.texture, this.pos.x, this.pos.y, this.size.x, this.size.y)

        }
}

platform.pos = new Vector2D(Math.floor(canvas.width / 2 - platform.size.x / 2), Math.floor(canvas.height - platform.size.y * 2.5));
platform.prevPos = new Vector2D(platform.pos.x, platform.pos.y);

//Klon platformy używany do upgrade'u
let platformClone = {
        ...platform,
}

platformClone.enabled = false;
platformClone.draw = () => {
        context.globalAlpha = 0.5;
        let texture = new Image();
        texture.src = "img/textures/platform.png";
        context.drawImage(texture, platformClone.pos.x, platformClone.pos.y, platformClone.size.x, platformClone.size.y)
        context.globalAlpha = 1;
}

// Naciskanie klawiszy
document.addEventListener("keydown", e => {
        let oldPlatformPosX = platform.pos.x;

        // Ruch platformą strzałkami
        if (e.key == "ArrowLeft") {
                if (platform.pos.x > 0) {
                        platform.prevPos.x = platform.pos.x;

                        platform.pos.x -= platform.move;
                        platform.pos.x = Math.floor(platform.pos.x);

                        if (platformClone.enabled) {
                                platformClone.prevPos.x = platformClone.pos.x;
                                platformClone.pos.x = Math.floor(canvas.width - platform.pos.x - platformClone.size.x);
                        }

                        if (platform.holdBall != null) {
                                let ballDiff = platform.holdBall.pos.x - oldPlatformPosX;

                                platform.holdBall.prevPos.x = platform.holdBall.pos.x;
                                platform.holdBall.prevPos.y = platform.holdBall.pos.y;

                                platform.holdBall.pos.x = Math.floor(platform.pos.x + ballDiff);
                        }
                }
        } else if (e.key == "ArrowRight") {
                if (platform.pos.x + platform.size.x < canvas.width) {
                        platform.prevPos.x = platform.pos.x;

                        platform.pos.x += platform.move;
                        platform.pos.x = Math.floor(platform.pos.x)

                        if (platformClone.enabled) {
                                platformClone.prevPos.x = platformClone.pos.x;
                                platformClone.pos.x = Math.floor(canvas.width - platform.pos.x - platformClone.size.x);
                        }

                        if (platform.holdBall != null) {
                                let ballDiff = platform.holdBall.pos.x - oldPlatformPosX;

                                platform.holdBall.prevPos.x = platform.holdBall.pos.x;
                                platform.holdBall.prevPos.y = platform.holdBall.pos.y;

                                platform.holdBall.pos.x = Math.floor(platform.pos.x + ballDiff);
                        }
                }
        }



        // Wyrzucenie piłki gdy ją trzymamy
        if (platform.holdBall != null && e.key == " ") {
                platform.holdBall = null;

                // originalBall.setDir(0, -1)
        }

})

// Odpowiada za ruch platformy za pomocą myszki
canvas.addEventListener("mousemove", e => {

        // Odpowiada za niewychodzenie platformy poza planszę
        let oldPlatformPosX = platform.pos.x;

        if (
                (e.clientX - canvas.getBoundingClientRect().left) * (canvas.width / canvas.getBoundingClientRect().width) - platform.size.x / 2 > 0 &&
                (e.clientX - canvas.getBoundingClientRect().left) * (canvas.width / canvas.getBoundingClientRect().width) - platform.size.x / 2 + platform.size.x < canvas.width
        ) {
                platform.prevPos.x = platform.pos.x;
                platform.pos.x = Math.floor((e.clientX - canvas.getBoundingClientRect().left) * (canvas.width / canvas.getBoundingClientRect().width) - platform.size.x / 2);
        }

        if (platformClone.enabled) {
                platformClone.prevPos.x = platformClone.pos.x;
                platformClone.pos.x = Math.floor(canvas.width - platform.pos.x - platformClone.size.x);
        }

        // Odpowiada za przesuwanie piłki trzymanje przez platformę
        if (platform.holdBall != null) {
                let ballDiff = platform.holdBall.pos.x - oldPlatformPosX;

                platform.holdBall.prevPos.x = platform.holdBall.pos.x;
                platform.holdBall.prevPos.y = platform.holdBall.pos.y;

                platform.holdBall.pos.x = Math.floor(platform.pos.x + ballDiff);
        }

})
canvas.addEventListener("mousedown", e => {
        // Wyrzucenie piłki gdy ją trzymamy LPM
        if (platform.holdBall != null && e.button == 0) {
                platform.holdBall = null;

                // originalBall.setDir(0, -1)
        }
})
// ==================================================================================================== //

// ==========================================[ Klasa piłek ]=========================================== //
class Ball {
        static list = []; // Lista wszystkich piłek
        static ballPower = 0; // Moc wszystkich piłek związana z upgradem mocy. Liczba wskazuje na ilość razy w których piłka może swobodnie usunąć cegłe bez jej odbicia

        constructor(pos, dir, radius, enemyBall = false, enemyParent) {
                this.pos = pos; // Przechowuje pozycje piłki
                this.prevPos = new Vector2D(pos.x, pos.y);
                this.dir = dir; // Przechowuje kierunek piłki
                // this.size = size; // Przechowuje wielkość piłki
                this.radius = radius;
                this.enemyBall = enemyBall;

                if (enemyBall)
                        this.parent = enemyParent;

                this.speed = 4;
                if (enemyBall)
                        this.speed = 9;

                this.texture = new Image(); // Tekstura piłki

                if (enemyBall)
                        this.texture.src = "img/FireBall.svg";
                else
                        this.texture.src = "img/ball.png";

                this.power = Ball.ballPower;

                if (!enemyBall) Ball.list.push(this); // Dodaje do listy wszystkich piłek
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

        think() {
                let hit = false; //Jeśli coś dotkneliśmy, nie sprawdzamy kolizji innych rzeczy

                // console.log(this.lastTouchedObj)

                if (this.pos.x <= 0 && this.lastTouchedObj != 'leftwall') {
                        this.lastTouchedObj = 'leftwall';
                        this.invertDirX();
                        hit = true;
                        playSound("hitEdge")
                } else if (this.pos.x + this.radius * 2 >= canvas.width && this.lastTouchedObj != 'rightwall') {
                        this.lastTouchedObj = 'rightwall';
                        this.invertDirX();
                        hit = true;
                        playSound("hitEdge")
                } else if (this.pos.y <= 0 && this.lastTouchedObj != 'topwall') {
                        this.lastTouchedObj = 'topwall';
                        this.invertDirY();
                        hit = true;
                        playSound("hitEdge")
                }



                //Kolizja z cegłami
                if (!hit && !this.enemyBall) {
                        Brick.list.forEach((brick) => {
                                if (!hit && this.lastTouchedObj != brick) {
                                        let col = circXrectCollision(this, brick)

                                        if (col.hit) {
                                                //Zabezpieczenie by piłka nie zbijała dwóch cegieł na raz
                                                if ((col.side == 'left' && this.dir.x > 0) || (col.side == 'right' && this.dir.x < 0)) {
                                                        hit = true;
                                                } else if ((col.side == 'top' && this.dir.y > 0) || (col.side == 'bottom' && this.dir.y < 0)) {
                                                        hit = true;
                                                }

                                                if (hit)
                                                {
                                                        if (this.power > 0 && brick.type != 9 && brick.type != 8)
                                                                this.power--;
                                                        else if (this.power > 0 && brick.type == 8 && this.power >= brick.health)
                                                                this.power -= brick.health;
                                                        else
                                                                if (col.side == 'left' || col.side == 'right') this.invertDirX(); else this.invertDirY();

                                                        this.lastTouchedObj = brick;
                                                        brick.remove();
                                                }
                                        }
                                }
                        })
                }

                //Kolizja z DOH'em
                if (!hit && !this.enemyBall) {
                        DOH.list.forEach((doh) => {
                                let col = circXrectCollision(this, doh)

                                if (col.hit && this.lastTouchedObj != doh) {
                                        if (col.side == 'left' || col.side == 'right')
                                                this.invertDirX();
                                        else
                                                this.invertDirY();

                                        if (doh.minionsNum <= 0)
                                                if (this.power > 0) doh.hp -= this.power; else doh.hp--;

                                        this.lastTouchedObj = doh;

                                        playSound('hitDOH'); // Odtwarzanie dźwięku uderzenia w DOHa

                                        updateStaticCanvas();
                                }
                        })
                }

                //Kolizja z MiniDOH'em
                if (!hit && !this.enemyBall) {
                        MiniDOH.list.forEach((doh) => {
                                let col = circXrectCollision(this, doh)

                                if (col.hit && this.lastTouchedObj != doh) {
                                        if (col.side == 'left' || col.side == 'right')
                                                this.invertDirX();
                                        else
                                                this.invertDirY();

                                        if (this.power > 0) doh.hp -= this.power; else doh.hp--;
                                        this.lastTouchedObj = doh;

                                        if (doh.hp <= 0)
                                                doh.remove();

                                        playSound('hitSmallDOH'); // Odtwarzanie dźwięku uderzenia w małego DOHa
                                }
                        })
                }


                //Kolizja z platformą
                if (!hit && platform.holdBall != this && this.lastTouchedObj != platform) {
                        let col = circXrectCollision(this, platform)

                        if (col.hit && this.lastTouchedObj != platform) {
                                if (!this.enemyBall) {
                                        if (col.side == 'left' || col.side == 'right')
                                                this.invertDirX();
                                        else {
                                                this.dir.x = col.hitFactor * 5;
                                                this.invertDirY();

                                                if (platform.canCatchBall && platform.holdBall == null && col.side == 'top')
                                                        platform.holdBall = this;
                                        }

                                        playSound('hitPlatform'); // Odtwarzanie dźwięku uderzenia w platformę

                                        hit = true;
                                        this.lastTouchedObj = platform;
                                        this.power = Ball.ballPower;
                                } else {
                                        playSound("hitedByEnemy") // Odtwarzanie dźwięku uderzenia w platformę wrogiej piłki

                                        playerHealth--;
                                        resetToDefault();
                                }

                        }
                }

                //Kolizja z klonem platformy
                if (!hit && platformClone.enabled && this.lastTouchedObj != platformClone && !this.enemyBall) {
                        let col = circXrectCollision(this, platformClone)

                        if (col.hit && this.lastTouchedObj != platformClone) {
                                if (col.side == 'left' || col.side == 'right')
                                        this.invertDirX();
                                else {
                                        this.dir.x = col.hitFactor * 5;
                                        this.invertDirY();
                                }

                                playSound('hitPlatform'); // Odtwarzanie dźwięku uderzenia w platformę

                                hit = true;
                                this.lastTouchedObj = platformClone;
                                this.power = Ball.ballPower;
                        }
                }

                if (hit && platform.holdBall != this && !this.enemyBall) {
                        this.speed += 0.1; //Zwiększamy prędkość piłki po kolizji
                        // console.log(el.speed);
                }

                //Ruch piłek
                if (platform.holdBall != this) {
                        this.prevPos.x = this.pos.x;
                        this.prevPos.y = this.pos.y;

                        let len = this.dir.length()
                        this.pos.x += Math.floor((this.dir.x / len) * this.speed)
                        this.pos.y += Math.floor((this.dir.y / len) * this.speed)
                }

                // Sprawdza czy piłka wypadła
                if (this.pos.y > canvas.height / 100 * 96.4 && !this.enemyBall) {
                        if (this == originalBall) {
                                playerHealth--;
                                playSound("fallOfScreen") // Odtwarzanie dźwięku upadku piłki poza ekran
                                resetToDefault();
                        } else {
                                this.remove();
                        }

                }
        }

        // Rysuje naszą piłke
        draw() {
                //Efekt gdy piłka ma więcej mocy
                if (this.power > 0 && !this.enemyBall) {
                        let len = this.dir.length();

                        for (let i = 0; i < this.power; i++) {
                                context.globalAlpha = 0.75 - (0.75 / (this.power + 1) * (i + 1));
                                context.drawImage(this.texture, Math.floor(this.pos.x - ((this.dir.x / len) * (this.radius * 2 / 4) * (i + 1))), Math.floor(this.pos.y - ((this.dir.y / len) * (this.radius * 2 / 4) * (i + 1))), this.radius * 2, this.radius * 2)
                        }

                        context.globalAlpha = 1;
                }

                //Dodatkowe piłki są przeźroczyste
                if (this != originalBall && !this.enemyBall)
                        context.globalAlpha = 0.5;

                context.drawImage(this.texture, this.pos.x, this.pos.y, this.radius * 2, this.radius * 2)

                context.globalAlpha = 1;
        }

        remove() {
                if (!this.enemyBall)
                        Ball.list.forEach((el, index) => {
                                if (el == this)
                                        Ball.list.splice(index, 1);
                        })
                else
                        this.enemyParent.fireBalls.forEach((el, index) => {
                                if (el == this)
                                        this.enemyParent.fireBalls[index] = null;
                        })
        }

        static refreshBallPower() {
                Ball.list.forEach((el) => {
                        el.power = Ball.ballPower;
                })
        }
}

let originalBall = new Ball(
        new Vector2D( // Ustawia pozycje
                null,   // x
                null    // y
        ),
        new Vector2D(0.25, -1), // Kierunek
        canvas.width / 27.22 / 2 // Size
);

// Na początku piłka pojawia się nad platformą
originalBall.pos.x = platform.pos.x + platform.size.x / 2 - originalBall.radius
originalBall.pos.y = platform.pos.y - 0 - originalBall.radius * 2

originalBall.prevPos.x = originalBall.pos.x;
originalBall.prevPos.y = originalBall.pos.y;
// ==================================================================================================== //

// =========================================[ Ulepszenia ]========================================= //

class Projectile {
        static list = [];
        static playerLasers = 0;
        static nextPlayerFire = 0;
        static playerLaserSize = new Vector2D(canvas.width / 50, canvas.height / 20);

        constructor(pos, dir, size, speed, player, texture = "img/laserProjectile.png") {
                this.pos = pos;
                this.prevPos = new Vector2D(pos.x, pos.y);
                this.dir = dir;
                this.size = size;
                this.speed = speed;
                this.isPlayers = player

                this.texture = new Image();
                this.texture.src = texture;

                Projectile.list.push(this);
        }

        draw() {
                context.save()
                context.translate(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2)

                // context.rotate((90 * this.dir.x) + 0.5 * Math.PI)
                context.rotate((90 * this.dir.x) * Math.PI / 180 * this.dir.y)
                context.translate(-(this.pos.x - this.size.x / 2), -(this.pos.y - this.size.y / 2))
                context.drawImage(this.texture, this.pos.x, this.pos.y, this.size.x, this.size.y)
                context.restore()
        }

        remove() {
                Projectile.list.forEach((el, index) => {
                        if (el == this)
                                Projectile.list.splice(index, 1);
                })
        }
}

class Portal {
        static list = [];
        static enabled = false;

        constructor(pos, size) {
                this.pos = pos;
                this.size = size;

                this.texture = new Image();
                this.texture.src = "img/portal.png";

                Portal.list.push(this);
        }

        draw() {
                contextStatic.drawImage(this.texture, this.pos.x, this.pos.y, this.size.x, this.size.y);
        }

        remove() {
                Portal.list.forEach((el, index) => {
                        if (el == this)
                                Portal.list.splice(index, 1);
                })
        }
}

let portalW, portalH;
portalW = canvas.width / 12.5;
portalH = canvas.height / 10;
new Portal(new Vector2D(canvas.width - canvas.width * 0.0005 - portalW + 25, canvas.height - canvas.height * 0.025 - portalH), new Vector2D(portalW, portalH));


let prevUpgrade;
let curUpgrade = null;

//Dla lepszej czytelności kodu
const UPGRADE_MOREHP = 0; // Więcej życia
const UPGRADE_BALLPOWER = 1; // Większa siła piłki 
const UPGRADE_MOREBALLS = 2; // Więcej piłek
const UPGRADE_BALLCATCH = 3; // Tryb chwytania piłki
const UPGRADE_PLATFORMCLONE = 4; // Klon platformy
const UPGRADE_PLATFORMSIZE = 5; // Powiększenie platformy
const UPGRADE_LASER = 6; // Laser
const UPGRADE_SKIP = 7; // Przejście do następnego poziomu

function removeUpgradeEffect(upgrade) {
        switch (upgrade) {
                case UPGRADE_LASER:
                        Projectile.playerLasers = 0;
                        break;
                case UPGRADE_SKIP:
                        Portal.enabled = false;
                        updateStaticCanvas();
                        break;

                case UPGRADE_BALLPOWER:
                        Ball.ballPower = 0;
                        Ball.refreshBallPower();
                        break;
                case UPGRADE_MOREBALLS:
                        Ball.list.splice(1);
                        break;

                case UPGRADE_BALLCATCH:
                        platform.canCatchBall = false;
                        break;
                case UPGRADE_PLATFORMSIZE:
                        platform.size.x -= Upgrade.platformSizeIncrease * platform.timesIncreased;
                        platform.pos.x += Upgrade.platformSizeIncrease * platform.timesIncreased / 2;
                        platform.timesIncreased = 0;
                        break;
                case UPGRADE_PLATFORMCLONE:
                        platformClone.enabled = false;
                        break;
                default:
                        break;
        }
}

function removeAllUpgrades() {
        for (let i = 0; i <= 7; i++) {
                removeUpgradeEffect(i);
        }
}

class Upgrade {
        static list = [];
        static typeToTexture = [
                "img/upgrades/upgrade_hp.svg",
                "img/upgrades/upgrade_strength.svg",
                "img/upgrades/upgrade_moreballs.svg",
                "img/upgrades/upgrade_stick.svg",
                "img/upgrades/upgrade_doppelganger.svg",
                "img/upgrades/upgrade_size.svg",
                "img/upgrades/upgrade_laser.svg",
                "img/upgrades/upgrade_skip.svg"
        ]

        static nextUpgradePoints = 700; //Punkty do kolejnego upgrade'u
        static platformSizeIncrease = canvas.width / 25;

        constructor(pos, type) {
                this.pos = pos;
                this.prevPos = new Vector2D(pos.x, pos.y);
                this.velY = 3.2;
                this.type = type;
                this.size = new Vector2D(canvas.width / 10 - 0.1, canvas.width / 10 - 0.1);

                this.texture = new Image();
                this.texture.src = Upgrade.typeToTexture[this.type];

                Upgrade.list.push(this);
        }

        draw() {
                context.drawImage(this.texture, this.pos.x, this.pos.y, this.size.x, this.size.y);
        }

        collect() {
                prevUpgrade = curUpgrade;
                curUpgrade = this.type;

                switch (curUpgrade) {
                        //Ogólne
                        case UPGRADE_MOREHP:
                                playerHealth++;
                                updateStaticCanvas();
                                break;
                        case UPGRADE_LASER:
                                Projectile.playerLasers++;
                                break;
                        case UPGRADE_SKIP:
                                Portal.enabled = true;
                                updateStaticCanvas();
                                break;

                        //Piłki
                        case UPGRADE_MOREBALLS:
                                removeUpgradeEffect(UPGRADE_BALLPOWER);
                                new Ball(new Vector2D(Math.floor(platform.pos.x + platform.size.x / 2 - canvas.width / 27.77 / 2), platform.pos.y - canvas.width / 27.77), new Vector2D(0.25, 1), canvas.width / 27.77 / 2);
                                break;
                        case UPGRADE_BALLPOWER:
                                removeUpgradeEffect(UPGRADE_MOREBALLS);
                                Ball.ballPower++;
                                Ball.refreshBallPower();
                                break;

                        //Platforma
                        case UPGRADE_BALLCATCH:
                                removeUpgradeEffect(UPGRADE_PLATFORMSIZE);
                                removeUpgradeEffect(UPGRADE_PLATFORMCLONE);

                                platform.canCatchBall = true;
                                break;
                        case UPGRADE_PLATFORMCLONE:
                                removeUpgradeEffect(UPGRADE_PLATFORMSIZE);
                                platformClone.enabled = true;
                                platformClone.pos.x = canvas.width - platform.pos.x - platformClone.size.x;
                                break;
                        case UPGRADE_PLATFORMSIZE:
                                removeUpgradeEffect(UPGRADE_PLATFORMCLONE);
                                platform.size.x += Upgrade.platformSizeIncrease;
                                platform.pos.x -= Upgrade.platformSizeIncrease / 2;
                                platform.pos.x = Math.floor(platform.pos.x);

                                platform.timesIncreased++;
                                break;
                        default:
                                break;
                }

                this.remove();
        }

        remove() {
                Upgrade.list.forEach((el, index) => {
                        if (el == this)
                                Upgrade.list.splice(index, 1);
                })
        }
}

let nextUpgrade = playerPoints + Upgrade.nextUpgradePoints + Math.floor(Math.random() * 51);

// ==================================================================================================== //

// ==============================================[ DOH ]=============================================== //

class MiniDOH {
        static list = [];

        constructor(pos, size, parent, hp = 3) {
                this.pos = pos;
                this.size = size;
                this.hp = hp;
                this.parent = parent;

                this.texture = new Image();
                this.texture.src = "img/doh.png";

                MiniDOH.list.push(this);

                updateStaticCanvas();
        }

        draw() {
                contextStatic.drawImage(this.texture, this.pos.x, this.pos.y, this.size.x, this.size.y);
        }

        remove() {
                MiniDOH.list.forEach((el, index) => {
                        if (el == this) {
                                this.parent.minionsNum--;
                                MiniDOH.list.splice(index, 1);
                        }
                })

                updateStaticCanvas();
        }
}

class DOH {
        static list = [];

        constructor(pos, size, hp = 20) {
                this.pos = pos;
                this.size = size;
                this.hp = hp;

                this.texture = new Image();
                this.texture.src = "img/doh.png";

                this.nextAttack = -1; // Czas do następnego ataku bazowany na cTime
                this.counter = 0; // Licznik, służy w atakach by np. sprawdzic ile razy wystrzelił lasery
                this.summonedMinions = false;
                this.fireBalls = [null, null];
                this.minionsNum = 0;

                DOH.list.push(this);

                updateStaticCanvas();
        }

        think(cTime) {
                this.fireBalls.forEach((el) => {
                        if (el != null) el.think();
                })

                if (this.hp <= 0)
                        this.remove();

                if (this.hp <= 10 && !this.summonedMinions) {
                        this.summonedMinions = true;

                        new MiniDOH(new Vector2D(this.pos.x - canvas.width / 25, this.pos.y + this.size.y * 0.95), new Vector2D(canvas.width / 12.5, canvas.height / 6.94), this);
                        new MiniDOH(new Vector2D(this.pos.x + canvas.width / 12.5, this.pos.y + this.size.y), new Vector2D(canvas.width / 12.5, canvas.height / 6.94), this);
                        new MiniDOH(new Vector2D(this.pos.x + this.size.x - canvas.width / 6.25, this.pos.y + this.size.y), new Vector2D(canvas.width / 12.5, canvas.height / 6.94), this);
                        new MiniDOH(new Vector2D(this.pos.x + this.size.x - canvas.width / 25, this.pos.y + this.size.y * 0.95), new Vector2D(canvas.width / 12.5, canvas.height / 6.94), this);

                        this.minionsNum = 4;

                        updateStaticCanvas();
                }

                if (this.fireBalls[0] == null && platform.holdBall == null) {
                        this.fireBalls[0] = new Ball(new Vector2D(Math.floor(this.pos.x + this.size.x * 0.35), Math.floor(this.pos.y + this.size.y * 0.6)), new Vector2D(0.2, 1), canvas.width / 20 / 2, true, this);
                }

                if (this.fireBalls[1] == null && platform.holdBall == null && this.hp <= 10) {
                        this.fireBalls[1] = new Ball(new Vector2D(Math.floor(this.pos.x + this.size.x * 0.35), Math.floor(this.pos.y + this.size.y * 0.6)), new Vector2D(-0.2, 1), canvas.width / 20 / 2, true, this);
                }
        }

        draw() {
                contextStatic.drawImage(this.texture, this.pos.x, this.pos.y, this.size.x, this.size.y);
        }

        remove() {
                DOH.list.forEach((el, index) => {
                        if (el == this) {
                                victory();
                                DOH.list.splice(index, 1);
                        }
                })

                updateStaticCanvas();
        }
}



function summonDOH() {
        Brick.list = [];

        let width, height;
        width = canvas.width / 2.5;
        height = canvas.height / 2;

        new DOH(new Vector2D(canvas.width / 2 - width / 2, canvas.height / 2 - height / 1.5), new Vector2D(width, height));
        updateStaticCanvas();
}

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

                updateStaticCanvas();
        }

        // Rysuje cegłe
        draw() {
                contextStatic.drawImage(this.texture, this.pos.x, this.pos.y, canvas.width / 10 - 0.1, canvas.height / 20 - 0.1);
        }

        // Usuwa cegłe
        remove() {
                playSound("brickHit", this.type)
                this.health-- // Odejmuje życie cegły
                if (this.health == 0) {
                        Brick.list.forEach((el, index) => {
                                if (el == this) {
                                        playerPoints += this.value // Dodaje pkt po rozbiciu cegły

                                        if (this.type != 8 && this.type != 9 && playerPoints >= nextUpgrade) {
                                                nextUpgrade = playerPoints + Upgrade.nextUpgradePoints + Math.floor(Math.random() * 51);

                                                let randUpgrade = Math.floor(Math.random() * 8);
                                                new Upgrade(new Vector2D(Math.floor(this.pos.x + this.size.x / 2), Math.floor(this.pos.y + this.size.y / 2)), randUpgrade);
                                                // new Upgrade(new Vector2D(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2), UPGRADE_PLATFORMCLONE);
                                        }
                                        Brick.list.splice(index, 1);    // Wyrzuca cegłe z listy wszystkich cegieł
                                }
                        })
                }

                updateStaticCanvas();
        }
}



function rectXrectCollision(obj1, obj2) {
        if (obj1 == null || obj2 == null)
                return null;

        let colData = {}; //Objekt które zwrócimy zawierający informację o kolizji

        let dX, dY;
        dX = (obj1.pos.x + obj1.size.x / 2) - (obj2.pos.x + obj2.size.x / 2)
        dY = (obj1.pos.y + obj1.size.y / 2) - (obj2.pos.y + obj2.size.y / 2)

        let width, height;
        width = (obj1.size.x + obj2.size.x) / 2
        height = (obj1.size.y + obj2.size.y) / 2

        let crossWidth, crossHeight;
        crossWidth = width * dY;
        crossHeight = height * dX;

        let side = 'none';
        let hit = false;

        if (Math.abs(dX) <= width && Math.abs(dY) <= height) {
                if (crossWidth > crossHeight)
                        if (crossWidth > -crossHeight) side = 'top'; else side = 'left';
                else
                        if (crossWidth > -crossHeight) side = 'right'; else side = 'bottom';

                hit = true;
        }

        colData.side = side;
        colData.hit = hit;
        colData.hitFactor = (obj1.pos.x - (obj2.pos.x + obj2.size.x / 2)) / obj2.size.x

        return colData;
}

function circXrectCollision(circ, rect) {
        if (circ == null || rect == null)
                return null;

        let colData = {};

        let testX, testY;
        testX = circ.pos.x + circ.radius;
        testY = circ.pos.y + circ.radius;

        if (circ.pos.x + circ.radius < rect.pos.x)
                testX = rect.pos.x;
        else if (circ.pos.x + circ.radius > rect.pos.x + rect.size.x)
                testX = rect.pos.x + rect.size.x;

        if (circ.pos.y + circ.radius < rect.pos.y)
                testY = rect.pos.y;
        else if (circ.pos.y + circ.radius > rect.pos.y + rect.size.y)
                testY = rect.pos.y + rect.size.y;

        let distX, distY;
        distX = circ.pos.x + circ.radius - testX;
        distY = circ.pos.y + circ.radius - testY;

        let dist = Math.sqrt((distX * distX) + (distY * distY));

        let aboveAC = ((rect.pos.x - (rect.pos.x + rect.size.x)) * ((circ.pos.y + circ.radius) - (rect.pos.y + rect.size.y)) - (rect.pos.y - (rect.pos.y + rect.size.y)) * ((circ.pos.x + circ.radius) - (rect.pos.x + rect.size.x))) > 0
        let aboveDB = ((rect.pos.x - (rect.pos.x + rect.size.x)) * ((circ.pos.y + circ.radius) - rect.pos.y) - ((rect.pos.y + rect.size.y) - rect.pos.y) * ((circ.pos.x + circ.radius) - (rect.pos.x + rect.size.x))) > 0

        let side = 'none';
        let hit = false;

        if (dist <= circ.radius) {
                if (aboveAC) {
                        if (aboveDB)
                                side = 'top';
                        else
                                side = 'right';
                }
                else {
                        if (aboveDB)
                                side = 'left';
                        else
                                side = 'bottom';
                }

                hit = true;
        }

        colData.side = side;
        colData.hit = hit;
        // colData.hitFactor = (obj1.pos.x - (obj2.pos.x + obj2.size.x / 2)) / obj2.size.x
        colData.hitFactor = (circ.pos.x - (rect.pos.x + rect.size.x / 2)) / rect.size.x

        return colData;
}
// ==================================================================================================== //

// =======================================[ Funkcje cykliczne ]======================================== //
function gameLoop(cTime) {
        if (gameStarted && !gamePaused && !gameOvered) {
                think(cTime);
                draw();

                if (!Brick.list.filter(el => el.type != 9).length && playerLevel != 33) // Jeżeli nie ma już żadnych cegieł poza złotymi to przechodzi do następnego poziomu
                        nextLevel()
        } else if (!gamePaused && !gameOvered)
                restartTheGame();

        // Rysuije napis pauzy jeśli gra jest wstrzymana
        if (gamePaused && !gameOvered && gameStarted) {
                let texture = new Image()
                texture.src = "img/gamePaused.png"
                context.drawImage(texture, 159.2, canvas.height - 300, 681, 170.4)
        }

        window.requestAnimationFrame(gameLoop) // Kontynuacja game loopa
}

// Funkcja mająca na celu zająć się logiką gry
function think(cTime) {

        //Wywołuje funkcję logiki u DOH'a
        DOH.list.forEach((el) => el.think(cTime));

        //Strzela laserami z platformy
        if (Projectile.playerLasers > 0 && Projectile.nextPlayerFire < cTime) {
                Projectile.nextPlayerFire = cTime + 2500; //Następny strzał laserami - 2,5s

                for (let i = 0; i < Projectile.playerLasers; i++) {
                        let el = new Projectile(new Vector2D(Math.floor((platform.pos.x + (platform.size.x / (Projectile.playerLasers + 1)) * (i + 1)) - Projectile.playerLaserSize.x / 2), Math.floor(platform.pos.y - Projectile.playerLaserSize.y)), new Vector2D(0, -1), Projectile.playerLaserSize, 13, true);
                        el.dir.x = (el.pos.x + el.size.x / 2 - (platform.pos.x + platform.size.x / 2)) / platform.size.x //Zmieniamy kierunek wzgłedem położenia platformy - identycznie jak piłke gdy się odbija od niej
                }

                if (platformClone.enabled) {
                        for (let i = 0; i < Projectile.playerLasers; i++) {
                                let el = new Projectile(new Vector2D(Math.floor((platformClone.pos.x + (platformClone.size.x / (Projectile.playerLasers + 1)) * (i + 1)) - Projectile.playerLaserSize.x / 2), Math.floor(platformClone.pos.y - Projectile.playerLaserSize.y)), new Vector2D(0, -1), Projectile.playerLaserSize, 13, true);
                                el.dir.x = (el.pos.x + el.size.x / 2 - (platformClone.pos.x + platformClone.size.x / 2)) / platformClone.size.x //Zmieniamy kierunek wzgłedem położenia platformy - identycznie jak piłke gdy się odbija od niej
                        }
                }
        }

        // Logika laserów
        Projectile.list.forEach((el) => {
                //Sprawdzamy kolizje z cegłami jeśli laser jest gracza
                if (el.isPlayers) {
                        Brick.list.forEach((brick) => {
                                let col = rectXrectCollision(el, brick);

                                if (col.hit) {
                                        brick.remove();
                                        el.remove();
                                }
                        })
                }

                //Usuwamy laser jeśli jest poza ekranem
                if (
                        el.pos.x + el.size.x < 0 ||
                        el.pos.x > canvas.width ||
                        el.pos.y + el.size.y < 0 ||
                        el.pos.y > canvas.height
                ) el.remove();

                el.prevPos.x = el.pos.x;
                el.prevPos.y = el.pos.y;

                let len = el.dir.length();
                el.pos.x += Math.floor((el.dir.x / len) * el.speed);
                el.pos.y += Math.floor((el.dir.y / len) * el.speed);
        })

        // Logika upgrade'ów
        Upgrade.list.forEach((el) => {
                if (el.velY > -8.4)
                        el.velY -= 0.07;

                el.prevPos.y = el.pos.y;

                el.pos.y -= el.velY * 0.75;
                el.pos.y = Math.floor(el.pos.y);

                //Wyjście poza ekran
                if (el.pos.y > canvas.height)
                        el.remove();


                //Kolizja z platformą
                let col = rectXrectCollision(el, platform)

                if (col.hit)
                        el.collect();

                //Kolizja z klonem platformy
                if (platformClone.enabled && !col.hit) {
                        col = rectXrectCollision(el, platformClone);

                        if (col.hit)
                                el.collect();
                }
        })

        //Logika portali
        if (Portal.enabled)
                Portal.list.forEach((el) => {
                        let col = rectXrectCollision(el, platform)

                        if (col.hit)
                                nextLevel();
                })


        // System kolizji piłki
        Ball.list.forEach((el, index) => {
                el.think();
        })
}

function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height) //Usuwa poprzednią klatke

        if (playerHealth > 0) {
                platform.draw(); // Rysuje platformę

                if (platformClone.enabled)
                        platformClone.draw(); //Rysuję klona platformy jeśli mamy jego upgrade

                //Rysuje fireballe doha
                DOH.list.forEach((doh) => {
                        doh.fireBalls.forEach((el) => {
                                if (el != null) el.draw();
                        })
                });
                // Rysuje każdą piłke
                Ball.list.forEach((el) => el.draw())

                // Rysuje każdą cegłe
                // Brick.list.forEach((el) => el.draw());

                //Rysuje każdy upgrade
                Upgrade.list.forEach((el) => el.draw());

                //Rysuje kazdy laser
                Projectile.list.forEach((el) => el.draw());
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

                playSound("gameOver") // Odtwarza dźwięk końca gry

                // Ustawia flagi pauzy i końca gry
                gameOvered = true
                document.removeEventListener("keydown", pauseTheGame)
                document.addEventListener("click", gameOver)
        }

        context.stroke(); //Kończy rysować nową klatke
}



function updateStaticCanvas() {
        contextStatic.clearRect(0, 0, staticCanvas.width, staticCanvas.height);

        if (playerHealth > 0) {
                DOH.list.forEach((el) => el.draw());
                MiniDOH.list.forEach((el) => el.draw());

                if (Portal.enabled)
                        Portal.list.forEach((el) => el.draw());

                Brick.list.forEach((el) => el.draw());

                // Wyświetla statystyki
                contextStatic.font = `bold ${staticCanvas.height / 18.5}px Arial`;
                contextStatic.fillStyle = '#0090e1';

                contextStatic.fillText(`${playerPoints}💎`, staticCanvas.width / 50, staticCanvas.height / 15.625) // Punkty

                contextStatic.fillStyle = '#f8312f';
                if (playerHealth < 10)
                        contextStatic.fillText(`${playerHealth}❤️`, staticCanvas.width - staticCanvas.width / 9, staticCanvas.height / 15.625) // Życie
                else
                        contextStatic.fillText(`${playerHealth}❤️`, staticCanvas.width - staticCanvas.width / 7.6, staticCanvas.height / 15.625) // Życie

                //Pasek życia DOH'a
                if (DOH.list.length > 0) {
                        let doh = DOH.list[0];

                        contextStatic.fillStyle = '#0e0a24';
                        contextStatic.fillRect(staticCanvas.width * 0.2 + 8, staticCanvas.height / 15.625 - staticCanvas.height / 18.5, staticCanvas.width * 0.6 - 15, staticCanvas.height / 18.5);

                        if (doh.minionsNum > 0) contextStatic.fillStyle = '#0089c4'; else contextStatic.fillStyle = '#de4f35';

                        contextStatic.fillRect(staticCanvas.width * 0.2 + 25, staticCanvas.height / 15.625 - staticCanvas.height / 18.5 + 10, (staticCanvas.width * 0.6 - 50) * (doh.hp / 20), staticCanvas.height / 18.5 - 20);
                }
        }

        contextStatic.stroke();
}
// ==================================================================================================== //
gameLoop(0) //Zaczyna nasz game loop