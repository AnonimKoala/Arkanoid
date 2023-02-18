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
        prevUpgrade = curUpgrade;
        curUpgrade = null;
        removeAllUpgrades();

        Upgrade.list = [];

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


// =================================[ Przechowuje wszystkie poziomy ]================================== //
const levels = []
levels[0] = '[{"x":"1999.9","y":"750","type":"3"},{"x":"1499.9","y":"1000","type":"6"},{"x":"1999.9","y":"1000","type":"7"},{"x":"2499.9","y":"1000","type":"6"},{"x":"-0.1","y":"1250","type":"1"},{"x":"1499.9","y":"1250","type":"7"},{"x":"1999.9","y":"1250","type":"7"},{"x":"2499.9","y":"1250","type":"7"},{"x":"3999.9","y":"1250","type":"1"},{"x":"499.9","y":"1500","type":"1"},{"x":"1499.9","y":"1500","type":"4"},{"x":"1999.9","y":"1500","type":"7"},{"x":"2499.9","y":"1500","type":"4"},{"x":"3499.9","y":"1500","type":"1"},{"x":"999.9","y":"1750","type":"1"},{"x":"1499.9","y":"1750","type":"7"},{"x":"1999.9","y":"1750","type":"4"},{"x":"2499.9","y":"1750","type":"7"},{"x":"2999.9","y":"1750","type":"1"},{"x":"1999.9","y":"2000","type":"5"},{"x":"1999.9","y":"2250","type":"5"},{"x":"1499.9","y":"2500","type":"5"},{"x":"2499.9","y":"2500","type":"5"}]'
levels[1] = '[{"x":"-0.1","y":"500","type":"2"},{"x":"499.9","y":"500","type":"2"},{"x":"3999.9","y":"500","type":"2"},{"x":"4499.9","y":"500","type":"2"},{"x":"-0.1","y":"750","type":"2"},{"x":"1499.9","y":"750","type":"4"},{"x":"2999.9","y":"750","type":"4"},{"x":"4499.9","y":"750","type":"2"},{"x":"-0.1","y":"1000","type":"3"},{"x":"999.9","y":"1000","type":"4"},{"x":"1499.9","y":"1000","type":"4"},{"x":"1999.9","y":"1000","type":"4"},{"x":"2499.9","y":"1000","type":"4"},{"x":"2999.9","y":"1000","type":"4"},{"x":"3499.9","y":"1000","type":"4"},{"x":"4499.9","y":"1000","type":"3"},{"x":"499.9","y":"1250","type":"3"},{"x":"999.9","y":"1250","type":"4"},{"x":"1499.9","y":"1250","type":"9"},{"x":"1999.9","y":"1250","type":"4"},{"x":"2499.9","y":"1250","type":"4"},{"x":"2999.9","y":"1250","type":"9"},{"x":"3499.9","y":"1250","type":"4"},{"x":"3999.9","y":"1250","type":"3"},{"x":"999.9","y":"1500","type":"4"},{"x":"1499.9","y":"1500","type":"4"},{"x":"1999.9","y":"1500","type":"4"},{"x":"2499.9","y":"1500","type":"4"},{"x":"2999.9","y":"1500","type":"4"},{"x":"3499.9","y":"1500","type":"4"},{"x":"999.9","y":"1750","type":"4"},{"x":"1499.9","y":"1750","type":"8"},{"x":"1999.9","y":"1750","type":"4"},{"x":"2499.9","y":"1750","type":"4"},{"x":"2999.9","y":"1750","type":"8"},{"x":"3499.9","y":"1750","type":"4"},{"x":"499.9","y":"2000","type":"3"},{"x":"999.9","y":"2000","type":"4"},{"x":"1499.9","y":"2000","type":"4"},{"x":"1999.9","y":"2000","type":"8"},{"x":"2499.9","y":"2000","type":"8"},{"x":"2999.9","y":"2000","type":"4"},{"x":"3499.9","y":"2000","type":"4"},{"x":"3999.9","y":"2000","type":"3"},{"x":"-0.1","y":"2250","type":"3"},{"x":"1499.9","y":"2250","type":"4"},{"x":"1999.9","y":"2250","type":"4"},{"x":"2499.9","y":"2250","type":"4"},{"x":"2999.9","y":"2250","type":"4"},{"x":"4499.9","y":"2250","type":"3"},{"x":"-0.1","y":"2500","type":"2"},{"x":"1999.9","y":"2500","type":"4"},{"x":"2499.9","y":"2500","type":"4"},{"x":"4499.9","y":"2500","type":"2"},{"x":"-0.1","y":"2750","type":"2"},{"x":"499.9","y":"2750","type":"2"},{"x":"1499.9","y":"2750","type":"6"},{"x":"2999.9","y":"2750","type":"6"},{"x":"3999.9","y":"2750","type":"2"},{"x":"4499.9","y":"2750","type":"2"}]'
levels[2] = '[{"x":"499.9","y":"1000","type":"6"},{"x":"2999.9","y":"1000","type":"6"},{"x":"499.9","y":"1250","type":"6"},{"x":"2999.9","y":"1250","type":"6"},{"x":"499.9","y":"1750","type":"4"},{"x":"2999.9","y":"1750","type":"4"},{"x":"999.9","y":"2000","type":"4"},{"x":"1499.9","y":"2000","type":"4"},{"x":"1999.9","y":"2000","type":"4"},{"x":"2499.9","y":"2000","type":"4"}]'
// ==================================================================================================== //


// ====================================[ Uruchami kolejny poziom ]===================================== //
function nextLevel() {
        playerLevel++
        console.log("Next Level", playerLevel);
        // console.log(levelsTempTab);
        // generateBricksPos()

        // generateBricksPos()
        loadLevel()

        // levelsTempTab.push(Brick.list)
        resetToDefault()

        // if(playerLevel == 3)
        //         Brick.list = [...levelsTempTab[0]]

}
// ==================================================================================================== //


// ======================================[ Wczytuje nowy poziom ]====================================== //
function loadLevel(){
        const json = levels[playerLevel-1]
        let allBricks = JSON.parse(json)

        Laser.list = [];

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

        // generateBricksPos()
        loadLevel()

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
        timesIncreased: 0, //Ile razy nasza platforma została powiększona upgradem

        // Funkcja do rysowania platformy
        draw() {
                context.fillStyle = 'blue';
                context.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y)
        }

}

platform.pos = new Vector2D(canvas.width / 2 - platform.size.x / 2, canvas.height - platform.size.y * 2.5)

//Klon platformy używany do upgrade'u
let platformClone = {
        ...platform,
}

platformClone.enabled = false;
platformClone.draw = () => {
        context.fillStyle = 'blue';
        context.globalAlpha = 0.5;
        context.fillRect(platformClone.pos.x, platformClone.pos.y, platformClone.size.x, platformClone.size.y);
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
        )
        {
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

        constructor(pos, dir, size) {
                this.pos = pos; // Przechowuje pozycje piłki
                this.dir = dir; // Przechowuje kierunek piłki
                this.size = size; // Przechowuje wielkość piłki

                this.speed = 15; //Szybkość z jaką porusza się piłka
                this.texture = new Image(); // Tekstura piłki
                this.texture.src = "img/ball.png";

                this.power = Ball.ballPower;

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
                //Efekt gdy piłka ma więcej mocy
                if (this.power > 0)
                {
                        let len = this.dir.length();

                        for (let i = 0; i < this.power; i++)
                        {
                                context.globalAlpha = 0.75 - (0.75 / (this.power + 1) * (i + 1));
                                context.drawImage(this.texture, this.pos.x - ((this.dir.x / len) * (this.size.x / 4) * (i + 1)), this.pos.y - ((this.dir.y / len) * (this.size.y / 4) * (i + 1)), this.size.x, this.size.y)   
                        }

                        context.globalAlpha = 1;
                }

                context.drawImage(this.texture, this.pos.x, this.pos.y, this.size.x, this.size.y)
        }

        remove()
        {
                Ball.list.forEach((el, index) => {
                        if (el == this)
                                Ball.list.splice(index, 1);
                })     
        }

        static refreshBallPower()
        {
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

class Laser
{
        static list = [];
        static playerLasers = 0;
        static nextPlayerFire = 0;
        static playerLaserSize = new Vector2D(100, 250);

        constructor(pos, dir, size, speed, player)
        {
                this.pos = pos;
                this.dir = dir;
                this.size = size;
                this.speed = speed;
                this.isPlayers = player

                this.texture = new Image();
                this.texture.src = "img/laserProjectile.png";

                Laser.list.push(this);
        }

        draw()
        {       
                context.save()
                context.translate(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2)
                context.rotate((90 * this.dir.x) * Math.PI / 180)
                context.translate(-this.pos.x - this.size.x / 2, -this.pos.y - this.size.y / 2)
                context.drawImage(this.texture, this.pos.x, this.pos.y, this.size.x, this.size.y)
                context.restore()
        }

        remove()
        {
                Laser.list.forEach((el, index) => {
                        if (el == this)
                                Laser.list.splice(index, 1);
                })
        }
}

let upgradeFrequency = 4;
let nextUpgrade = upgradeFrequency;
let prevUpgrade;
let curUpgrade = null;

//Dla lepszej czytelności kodu
const UPGRADE_MOREHP = 0; //Więcej życia (x)
const UPGRADE_BALLPOWER = 1; //Większa siła piłki 
const UPGRADE_MOREBALLS = 2; //Więcej piłek (x)
const UPGRADE_BALLGRAB = 3; //Tryb chwytania piłki (x)
const UPGRADE_PLATFORMCLONE = 4; //Klon platformy
const UPGRADE_PLATFORMSIZE = 5; //Powiększenie platformy (x)
const UPGRADE_LASER = 6; //Laser

function removeUpgradeEffect(upgrade)
{
        switch(upgrade)
        {
                case UPGRADE_LASER:
                        Laser.playerLasers = 0;
                        break;
                case UPGRADE_BALLPOWER:
                        Ball.ballPower = 0;
                        Ball.refreshBallPower();
                        break;
                case UPGRADE_MOREBALLS:
                        Ball.list.splice(1);
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

function removeAllUpgrades()
{
        for (let i = 0; i <= 6; i++)
        {
                removeUpgradeEffect(i);
        }
}

class Upgrade
{
        static list = [];
        static typeToTexture = [
                "img/upgrades/upgrade_hp.svg",
                "img/upgrades/upgrade_strength.svg",
                "img/upgrades/upgrade_moreballs.svg",
                "img/upgrades/upgrade_stick.svg",
                "img/upgrades/upgrade_doppelganger.svg",
                "img/upgrades/upgrade_size.svg",
                "img/upgrades/upgrade_laser.svg",
        ]

        static platformSizeIncrease = 250;

        constructor(pos, type)
        {
                this.pos = pos;
                this.velY = 16;
                this.type = type;
                this.size = new Vector2D(canvas.width / 10 - 0.1, canvas.width / 10 - 0.1);

                this.texture = new Image();
                this.texture.src = Upgrade.typeToTexture[this.type];

                Upgrade.list.push(this);
        }

        draw()
        {
                context.drawImage(this.texture, this.pos.x, this.pos.y, this.size.x, this.size.y);
        }

        collect()
        {
                prevUpgrade = curUpgrade;
                curUpgrade = this.type;

                switch(curUpgrade)
                {
                        //Ogólne
                        case UPGRADE_MOREHP:
                                playerHealth++;
                                break;
                        case UPGRADE_LASER:
                                Laser.playerLasers++;
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
                        case UPGRADE_BALLGRAB:
                                removeUpgradeEffect(UPGRADE_PLATFORMSIZE);
                                removeUpgradeEffect(UPGRADE_PLATFORMCLONE);
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
                        if (nextUpgrade == 0)
                        {
                                nextUpgrade = upgradeFrequency;
                                // new Upgrade(new Vector2D(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2), Math.floor(Math.random() * 7));
                                new Upgrade(new Vector2D(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2), UPGRADE_BALLPOWER);
                        } else nextUpgrade--;

                        Brick.list.forEach((el, index) => {
                                if (el == this) {
                                        playerPoints += this.value // Dodaje pkt po rozbiciu cegły
                                        Brick.list.splice(index, 1);    // Wyrzuca cegłe z listy wszystkich cegieł
                                }
                        })
                }
        }
}



function checkCollision(obj1, obj2)
{
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

                if (!Brick.list.length)
                        nextLevel()
        } else if (!gamePaused && !gameOvered)
                restartTheGame();

        window.requestAnimationFrame(gameLoop) // Kontynuacja game loopa
}

// Funkcja mająca na celu zająć się logiką gry
function think(cTime) {
        //Strzela laserami z platformy
        if (Laser.playerLasers > 0 && Laser.nextPlayerFire < cTime)
        {
                Laser.nextPlayerFire = cTime + 2500; //Następny strzał laserami - 2,5s
                
                for (let i = 0; i < Laser.playerLasers; i++)
                {
                        let el = new Laser(new Vector2D((platform.pos.x + (platform.size.x / (Laser.playerLasers + 1)) * (i+1)) - Laser.playerLaserSize.x / 2, platform.pos.y - Laser.playerLaserSize.y), new Vector2D(0, -1), Laser.playerLaserSize, 65, true);
                        el.dir.x = (el.pos.x + el.size.x / 2 - (platform.pos.x + platform.size.x / 2)) / platform.size.x //Zmieniamy kierunek wzgłedem położenia platformy - identycznie jak piłke gdy się odbija od niej
                }

                if (platformClone.enabled)
                {
                        for (let i = 0; i < Laser.playerLasers; i++)
                        {
                                let el = new Laser(new Vector2D((platformClone.pos.x + (platformClone.size.x / (Laser.playerLasers + 1)) * (i+1)) - Laser.playerLaserSize.x / 2, platformClone.pos.y - Laser.playerLaserSize.y), new Vector2D(0, -1), Laser.playerLaserSize, 65, true);
                                el.dir.x = (el.pos.x + el.size.x / 2 - (platformClone.pos.x + platformClone.size.x / 2)) / platformClone.size.x //Zmieniamy kierunek wzgłedem położenia platformy - identycznie jak piłke gdy się odbija od niej
                        }
                }
        }

        // Logika laserów
        Laser.list.forEach((el) => {
                //Sprawdzamy kolizje z cegłami jeśli laser jest gracza
                if (el.isPlayers)
                {
                        Brick.list.forEach((brick) => {
                                let col = checkCollision(el, brick);

                                if (col.hit)
                                {
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
                if (platformClone.enabled && !col.hit)
                {
                        col = checkCollision(el, platformClone);

                        if (col.hit)
                                el.collect();
                }
        })

        // System kolizji piłki
        Ball.list.forEach((el, index) => {
                let hit = false; //Jeśli coś dotkneliśmy, nie sprawdzamy kolizji innych rzeczy

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
                if (!hit) {

                        Brick.list.forEach((brick) => {
                                if (!hit) {
                                        let col = checkCollision(el, brick)

                                        if (col.hit && el.lastTouchedObj != brick)
                                        {
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


                //Kolizja z platformą
                if (!hit && platform.holdBall != el && el.lastTouchedObj != platform) {
                        let col = checkCollision(el, platform)

                        if (col.hit && el.lastTouchedObj != platform)
                        {
                                if (col.side == 'left' || col.side == 'right')
                                        el.invertDirX();
                                else
                                {
                                        el.dir.x = col.hitFactor * 5;
                                        el.invertDirY();

                                        if (curUpgrade == UPGRADE_BALLGRAB && platform.holdBall == null)
                                                platform.holdBall = el;
                                }

                                hit = true;
                                el.lastTouchedObj = platform;
                                el.power = Ball.ballPower;
                        }
                }

                //Kolizja z klonem platformy
                if (!hit && platformClone.enabled && el.lastTouchedObj != platformClone) {
                        let col = checkCollision(el, platformClone)

                        if (col.hit && el.lastTouchedObj != platformClone)
                        {
                                if (col.side == 'left' || col.side == 'right')
                                        el.invertDirX();
                                else
                                {
                                        el.dir.x = col.hitFactor * 5;
                                        el.invertDirY();
                                }

                                hit = true;
                                el.lastTouchedObj = platformClone;
                                el.power = Ball.ballPower;
                        }
                }

                if (hit && platform.holdBall != el) {
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
                if (el.pos.y > canvas.height / 100 * 96.4) {
                        playerHealth--;
                        resetToDefault();
                }

        })
}

function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height) //Usuwa poprzednią klatke

        if (playerHealth > 0) {
                platform.draw(); // Rysuje platformę

                if (platformClone.enabled)
                        platformClone.draw(); //Rysuję klona platformy jeśli mamy jego upgrade

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

                //Rysuje kazdy laser
                Laser.list.forEach((el) => {
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




