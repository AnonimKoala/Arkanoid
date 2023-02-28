// ========================================[ Ustawia pole gry ]======================================== //
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
// ==================================================================================================== //

// ========================================= [ Ustawia guziki ] ======================================= //
const playButton = document.getElementById('playButton')
const introScreen = document.getElementById('introScreen')
// ==================================================================================================== //


// ================================[ Otwiera ekran pomocy ]============================================ //
const helpScreen = document.getElementById('helpScreen')
helpScreen.addEventListener("click", function () {
        helpScreen.style.display = "none"
})
function openHelp() {
        helpScreen.style.display = "block"
}
document.querySelector("#helpButton").addEventListener("click", openHelp)
// ==================================================================================================== //

// ============================[ Ustawianie rozdzielczości okienka canvas ]============================ //
canvas.width = 5000
canvas.height = 5000
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
// let playerLevel = 1
let playerLevel = 33;
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
        originalBall.pos.x = platform.pos.x + platform.size.x / 2 - originalBall.size.x / 2
        originalBall.pos.y = platform.pos.y - 10 - originalBall.size.y

        originalBall.speed = 15;
        originalBall.dir.x = 0.25;
        originalBall.dir.y = -1;
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
        }
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
                        new Vector2D(499.9, 249.9),
                        parseInt(el.type)
                )
        })




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

        playerLevel = 1 // FIXME: Może to nie działać

        // ============[ Wczytuje obraz ekranu startowego ]============ //

        playButton.addEventListener('click', () => {
                introScreen.style.display = "none";
                gameStarted = true
                gameOvered = false
                gamePaused = false

                document.addEventListener("keydown", pauseTheGame)
        })
        // ============================================================ //

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

function victory()
{

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
        move: canvas.width / 100 * 5,
        holdBall: null, //Czy nasza platforma trzyma piłke
        timesIncreased: 0, //Ile razy nasza platforma została powiększona upgradem
        canCatchBall: false, //Czy może złapać piłke (upgrade łapania)

        // Funkcja do rysowania platformy
        draw() {
                let texture = new Image();
                texture.src = "img/textures/platform.png";
                context.drawImage(texture, this.pos.x, this.pos.y, this.size.x, this.size.y)

        }
        // TODO: Dodaj możliwość zmiany tekstury platformy kiedy przylepia piłki

}

platform.pos = new Vector2D(canvas.width / 2 - platform.size.x / 2, canvas.height - platform.size.y * 2.5)

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
                        platform.pos.x -= platform.move;

                        if (platformClone.enabled) {
                                platformClone.pos.x = canvas.width - platform.pos.x - platformClone.size.x;
                        }

                        if (platform.holdBall != null) {
                                let ballDiff = platform.holdBall.pos.x - oldPlatformPosX;

                                platform.holdBall.pos.x = platform.pos.x + ballDiff;
                        }
                }
        } else if (e.key == "ArrowRight") {
                if (platform.pos.x + platform.size.x < canvas.width) {
                        platform.pos.x += platform.move;

                        if (platformClone.enabled) {
                                platformClone.pos.x = canvas.width - platform.pos.x - platformClone.size.x;
                        }

                        if (platform.holdBall != null) {
                                let ballDiff = platform.holdBall.pos.x - oldPlatformPosX;

                                platform.holdBall.pos.x = platform.pos.x + ballDiff;
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
                platform.pos.x = (e.clientX - canvas.getBoundingClientRect().left) * (canvas.width / canvas.getBoundingClientRect().width) - platform.size.x / 2
        }

        if (platformClone.enabled) {
                platformClone.pos.x = canvas.width - platform.pos.x - platformClone.size.x;
        }

        // Odpowiada za przesuwanie piłki trzymanje przez platformę
        if (platform.holdBall != null) {
                let ballDiff = platform.holdBall.pos.x - oldPlatformPosX;

                platform.holdBall.pos.x = platform.pos.x + ballDiff;
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

        constructor(pos, dir, size, enemyBall = false, enemyParent) {
                this.pos = pos; // Przechowuje pozycje piłki
                this.dir = dir; // Przechowuje kierunek piłki
                this.size = size; // Przechowuje wielkość piłki
                this.enemyBall = enemyBall;

                if (enemyBall)
                        this.parent = enemyParent;

                if (enemyBall)
                        this.speed = 45;
                else
                        this.speed = 15; //Szybkość z jaką porusza się piłka
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

        think()
        {
                let hit = false; //Jeśli coś dotkneliśmy, nie sprawdzamy kolizji innych rzeczy
                let el = this;

                //Kolizja z ścianami
                if (el.pos.x <= 0 || el.pos.x + el.size.x >= canvas.width) // Kolizja z lewą i prawą ścianą
                {
                        hit = true;
                        el.invertDirX();
                        el.lastTouchedObj = null;
                }

                if (el.pos.y <= 0 || el.pos.y + el.size.y >= canvas.height) // Kolizja z górną i dolną ścianą
                {
                        hit = true;
                        el.invertDirY();
                        el.lastTouchedObj = null;
                }



                //Kolizja z cegłami
                if (!hit && !el.enemyBall) {
                        Brick.list.forEach((brick) => {
                                if (!hit) {
                                        let col = checkCollision(el, brick)

                                        if (col.hit && el.lastTouchedObj != brick) {
                                                if (el.power > 0 && brick.type != 9 && brick.type != 8)
                                                        el.power--;
                                                else if (el.power > 0 && brick.type == 8 && el.power >= brick.health)
                                                        el.power -= brick.health;
                                                else
                                                        if (col.side == 'left' || col.side == 'right') el.invertDirX(); else el.invertDirY();

                                                hit = true;
                                                el.lastTouchedObj = brick;
                                                brick.remove();
                                        }
                                }
                        })
                }

                //Kolizja z DOH'em
                if (!hit && !el.enemyBall)
                {
                        DOH.list.forEach((doh) => {
                                let col = checkCollision(el, doh)
                                
                                if (col.hit && el.lastTouchedObj != doh)
                                {
                                        if (col.side == 'left' || col.side == 'right')
                                                el.invertDirX();
                                        else
                                                el.invertDirY();

                                        if (doh.minionsNum <= 0)
                                                if (el.power > 0) doh.hp -= el.power; else doh.hp--;

                                        el.lastTouchedObj = doh;
                                }
                        })
                }

                //Kolizja z MiniDOH'em
                if (!hit && !el.enemyBall)
                {
                        MiniDOH.list.forEach((doh) => {
                                let col = checkCollision(el, doh)
                                
                                if (col.hit && el.lastTouchedObj != doh)
                                {
                                        if (col.side == 'left' || col.side == 'right')
                                                el.invertDirX();
                                        else
                                                el.invertDirY();

                                        if (el.power > 0) doh.hp -= el.power; else doh.hp--;
                                        el.lastTouchedObj = doh;

                                        if (doh.hp <= 0)
                                                doh.remove();
                                }
                        })
                }


                //Kolizja z platformą
                if (!hit && platform.holdBall != el && el.lastTouchedObj != platform) {
                        let col = checkCollision(el, platform)

                        if (col.hit && el.lastTouchedObj != platform) {
                                if (!el.enemyBall)
                                {
                                        if (col.side == 'left' || col.side == 'right')
                                                el.invertDirX();
                                        else {
                                                el.dir.x = col.hitFactor * 5;
                                                el.invertDirY();

                                                if (platform.canCatchBall && platform.holdBall == null)
                                                        platform.holdBall = el;
                                        }

                                        hit = true;
                                        el.lastTouchedObj = platform;
                                        el.power = Ball.ballPower;
                                } else {
                                        playerHealth--;
                                        resetToDefault(); 
                                }

                        }
                }

                //Kolizja z klonem platformy
                if (!hit && platformClone.enabled && el.lastTouchedObj != platformClone && !el.enemyBall) {
                        let col = checkCollision(el, platformClone)

                        if (col.hit && el.lastTouchedObj != platformClone) {
                                if (col.side == 'left' || col.side == 'right')
                                        el.invertDirX();
                                else {
                                        el.dir.x = col.hitFactor * 5;
                                        el.invertDirY();
                                }

                                hit = true;
                                el.lastTouchedObj = platformClone;
                                el.power = Ball.ballPower;
                        }
                }

                if (hit && platform.holdBall != el && !el.enemyBall) {
                        el.speed *= 1.015; //Zwiększamy prędkość piłki po kolizji
                        // console.log(el.speed);
                }

                //Ruch piłek
                if (platform.holdBall != el) {
                        let len = el.dir.length()
                        el.pos.x += (el.dir.x / len) * el.speed
                        el.pos.y += (el.dir.y / len) * el.speed
                }

                // Sprawdza czy piłka wypadła
                if (el.pos.y > canvas.height / 100 * 96.4 && !el.enemyBall) {
                        if (el == originalBall) {
                                playerHealth--;
                                resetToDefault();
                        } else {
                                el.remove();
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
                                context.drawImage(this.texture, this.pos.x - ((this.dir.x / len) * (this.size.x / 4) * (i + 1)), this.pos.y - ((this.dir.y / len) * (this.size.y / 4) * (i + 1)), this.size.x, this.size.y)
                        }

                        context.globalAlpha = 1;
                }

                //Dodatkowe piłki są przeźroczyste
                if (this != originalBall && !this.enemyBall)
                        context.globalAlpha = 0.5;

                context.drawImage(this.texture, this.pos.x, this.pos.y, this.size.x, this.size.y)

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
        new Vector2D(180, 180) // Size
);

// Na początku piłka pojawia się nad platformą
originalBall.pos.x = platform.pos.x + platform.size.x / 2 - originalBall.size.x / 2
originalBall.pos.y = platform.pos.y - 0 - originalBall.size.y
// ==================================================================================================== //

// =========================================[ Ulepszenia ]========================================= //

class Projectile {
        static list = [];
        static playerLasers = 0;
        static nextPlayerFire = 0;
        static playerLaserSize = new Vector2D(100, 250);

        constructor(pos, dir, size, speed, player, texture = "img/laserProjectile.png") {
                this.pos = pos;
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
                context.drawImage(this.texture, this.pos.x, this.pos.y, this.size.x, this.size.y);
        }

        remove() {
                Portal.list.forEach((el, index) => {
                        if (el == this)
                                Portal.list.splice(index, 1);
                })
        }
}

new Portal(new Vector2D(canvas.width * 0.0005 - 25, canvas.height - canvas.height * 0.025 - 500), new Vector2D(200, 500));
new Portal(new Vector2D(canvas.width - canvas.width * 0.0005 - 200 + 25, canvas.height - canvas.height * 0.025 - 500), new Vector2D(200, 500));


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
// TODO: Zmienić szerokość portalu żeby dobrze wyglądało
// TODO: Zrobić portal tylko po prawej stronie, ewentualnie po lewej moze cofac poziom
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

        static nextUpgradePoints = 500; //Punkty do kolejnego upgrade'u
        static platformSizeIncrease = 250;

        constructor(pos, type) {
                this.pos = pos;
                this.velY = 16;
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
                                break;
                        case UPGRADE_LASER:
                                Projectile.playerLasers++;
                                break;
                        case UPGRADE_SKIP:
                                Portal.enabled = true;
                                break;

                        //Piłki
                        case UPGRADE_MOREBALLS:
                                removeUpgradeEffect(UPGRADE_BALLPOWER);
                                new Ball(new Vector2D(platform.pos.x + platform.size.x / 2 - 180 / 2, platform.pos.y - 180), new Vector2D(0.25, 1), new Vector2D(180, 180));
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

let nextUpgrade = playerPoints + Upgrade.nextUpgradePoints;

// ==================================================================================================== //

// ==============================================[ DOH ]=============================================== //

class MiniDOH
{
        static list = [];

        constructor(pos, size, parent, hp = 3)
        {
                this.pos = pos;
                this.size = size;
                this.hp = hp;
                this.parent = parent;

                this.texture = new Image();
                this.texture.src = "img/doh.png";

                MiniDOH.list.push(this);
        }

        draw()
        {
                context.drawImage(this.texture, this.pos.x, this.pos.y, this.size.x, this.size.y);      
        }

        remove()
        {
                MiniDOH.list.forEach((el, index) => {
                        if (el == this)
                        {
                                this.parent.minionsNum--;
                                MiniDOH.list.splice(index, 1);
                        }
                })  
        }
}

class DOH {
        static list = [];

        constructor(pos, size, hp = 20)
        {
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
        }

        think(cTime)
        {
                this.fireBalls.forEach((el) => {
                        if (el != null) el.think();
                })

                if (this.hp <= 0)
                        this.remove();

                if (this.hp <= 10 && !this.summonedMinions)
                {
                        this.summonedMinions = true;

                        new MiniDOH(new Vector2D(this.pos.x - 200, this.pos.y + this.size.y * 0.95), new Vector2D(400, 720), this);
                        new MiniDOH(new Vector2D(this.pos.x + 400, this.pos.y + this.size.y), new Vector2D(400, 720), this);
                        new MiniDOH(new Vector2D(this.pos.x + this.size.x - 800, this.pos.y + this.size.y), new Vector2D(400, 720), this);
                        new MiniDOH(new Vector2D(this.pos.x + this.size.x - 200, this.pos.y + this.size.y * 0.95), new Vector2D(400, 720), this);

                        this.minionsNum = 4;
                }

                if (this.fireBalls[0] == null && platform.holdBall == null)
                {
                        this.fireBalls[0] = new Ball(new Vector2D(this.pos.x + this.size.x * 0.35, this.pos.y + this.size.y * 0.6), new Vector2D(0.2, 1), new Vector2D(250, 250), true, this);
                }

                if (this.fireBalls[1] == null && platform.holdBall == null && this.hp <= 10)
                {
                        this.fireBalls[1] = new Ball(new Vector2D(this.pos.x + this.size.x * 0.35, this.pos.y + this.size.y * 0.6), new Vector2D(-0.2, 1), new Vector2D(250, 250), true, this);
                }
        }

        draw()
        {
                context.drawImage(this.texture, this.pos.x, this.pos.y, this.size.x, this.size.y);

                this.fireBalls.forEach((el) => {
                        if (el != null) el.draw();
                })
        }

        remove()
        {
                DOH.list.forEach((el, index) => {
                        if (el == this)
                        {
                                victory();
                                DOH.list.splice(index, 1);
                        }
                })
        }
}



function summonDOH()
{
        Brick.list = [];

        let width, height;
        width = 2000;
        height = 2500;

        new DOH(new Vector2D(canvas.width / 2 - width / 2, canvas.height / 2 - height / 1.5), new Vector2D(width, height));
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
        }

        // Rysuje cegłe
        draw() {
                context.drawImage(this.texture, this.pos.x, this.pos.y, canvas.width / 10 - 0.1, canvas.height / 20 - 0.1);
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
                                                nextUpgrade = playerPoints + Upgrade.nextUpgradePoints;
                                                new Upgrade(new Vector2D(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2), Math.floor(Math.random() * 8));
                                                // new Upgrade(new Vector2D(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2), UPGRADE_SKIP);
                                        }
                                        Brick.list.splice(index, 1);    // Wyrzuca cegłe z listy wszystkich cegieł
                                }
                        })
                }
        }
}



function checkCollision(obj1, obj2) {
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
// ==================================================================================================== //

// =======================================[ Funkcje cykliczne ]======================================== //
function gameLoop(cTime) {
        if (gameStarted && !gamePaused && !gameOvered) {
                think(cTime);
                draw();

                // TODO: Dodac warunek na koniec gry
                if (!Brick.list.filter(el => el.type != 9).length && playerLevel != 33) // Jeżeli nie ma już żadnych cegieł poza złotymi to przechodzi do następnego poziomu
                        nextLevel()
        } else if (!gamePaused && !gameOvered)
                restartTheGame();

        // Rysuije napis pauzy jeśli gra jest wstrzymana
        if (gamePaused && !gameOvered && gameStarted) {
                let texture = new Image()
                texture.src = "img/gamePaused.png"
                context.clearRect(796, canvas.height - 1500, 3408, 852) // FIXME: Jeśli chcieć zrobić bez dublowania brodera napisu, ale pilke (texture) moze ucinac
                context.drawImage(texture, 796, canvas.height - 1500, 3408, 852)
                // TODO: Naprawić border
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
                        let el = new Projectile(new Vector2D((platform.pos.x + (platform.size.x / (Projectile.playerLasers + 1)) * (i + 1)) - Projectile.playerLaserSize.x / 2, platform.pos.y - Projectile.playerLaserSize.y), new Vector2D(0, -1), Projectile.playerLaserSize, 65, true);
                        el.dir.x = (el.pos.x + el.size.x / 2 - (platform.pos.x + platform.size.x / 2)) / platform.size.x //Zmieniamy kierunek wzgłedem położenia platformy - identycznie jak piłke gdy się odbija od niej
                }

                if (platformClone.enabled) {
                        for (let i = 0; i < Projectile.playerLasers; i++) {
                                let el = new Laser(new Vector2D((platformClone.pos.x + (platformClone.size.x / (Projectile.playerLasers + 1)) * (i + 1)) - Projectile.playerLaserSize.x / 2, platformClone.pos.y - Projectile.playerLaserSize.y), new Vector2D(0, -1), Projectile.playerLaserSize, 65, true);
                                el.dir.x = (el.pos.x + el.size.x / 2 - (platformClone.pos.x + platformClone.size.x / 2)) / platformClone.size.x //Zmieniamy kierunek wzgłedem położenia platformy - identycznie jak piłke gdy się odbija od niej
                        }
                }
        }

        // Logika laserów
        Projectile.list.forEach((el) => {
                //Sprawdzamy kolizje z cegłami jeśli laser jest gracza
                if (el.isPlayers) {
                        Brick.list.forEach((brick) => {
                                let col = checkCollision(el, brick);

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

                let len = el.dir.length();
                el.pos.x += (el.dir.x / len) * el.speed;
                el.pos.y += (el.dir.y / len) * el.speed;
        })

        // Logika upgrade'ów
        Upgrade.list.forEach((el) => {
                if (el.velY > -42)
                        el.velY -= 0.35;

                el.pos.y -= el.velY * 0.75;

                //Wyjście poza ekran
                if (el.pos.y > canvas.height)
                        el.remove();


                //Kolizja z platformą
                let col = checkCollision(el, platform)

                if (col.hit)
                        el.collect();

                //Kolizja z klonem platformy
                if (platformClone.enabled && !col.hit) {
                        col = checkCollision(el, platformClone);

                        if (col.hit)
                                el.collect();
                }
        })

        //Logika portali
        if (Portal.enabled)
                Portal.list.forEach((el) => {
                        let col = checkCollision(el, platform)

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

                DOH.list.forEach((el) => el.draw());
                MiniDOH.list.forEach((el) => el.draw());

                if (Portal.enabled)
                        Portal.list.forEach((el) => el.draw());

                // Rysuje każdą piłke
                Ball.list.forEach((el) => el.draw())

                // Rysuje każdą cegłe
                Brick.list.forEach((el) => el.draw());

                //Rysuje każdy upgrade
                Upgrade.list.forEach((el) => el.draw());

                //Rysuje kazdy laser
                Projectile.list.forEach((el) => el.draw());



                // Wyświetla statystyki
                context.font = `bold ${canvas.height / 18.5}px Arial`;
                context.fillStyle = '#0090e1';

                context.fillText(`${playerPoints}💎`, canvas.width / 50, canvas.height / 15.625) // Punkty

                context.fillStyle = '#f8312f';
                context.fillText(`${playerHealth}❤️`, canvas.width - canvas.width / 9, canvas.height / 15.625) // Życie

                //Pasek życia DOH'a
                if (DOH.list.length > 0)
                {
                        let doh = DOH.list[0];

                        context.fillStyle = '#0e0a24';
                        context.fillRect(canvas.width * 0.2, canvas.height / 15.625 - canvas.height / 18.5, canvas.width * 0.6, canvas.height / 18.5);

                        if (doh.minionsNum > 0) context.fillStyle = '#0089c4'; else context.fillStyle = '#de4f35';
                        context.fillRect(canvas.width * 0.2 + 25, canvas.height / 15.625 - canvas.height / 18.5 + 25, (canvas.width * 0.6 - 50) * (doh.hp / 20), canvas.height / 18.5 - 50);
                }


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




