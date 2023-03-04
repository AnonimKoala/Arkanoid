// ========================================[ Ustawia pole gry ]======================================== //
const canvas = document.getElementById('canvas');                 // Pole gry - obiekty dynamiczne
const staticCanvas = document.getElementById('staticCanvas');    // Pole gry - obiekty statyczne
const context = canvas.getContext('2d');                        // Ustawia kontekst canvasa na 2d
const contextStatic = staticCanvas.getContext('2d');           // Ustawia kontekst canvasa statycznego na 2d
// ==================================================================================================== //

// ========================================= [ Ustawia guziki ] ======================================= //
const playButton = document.getElementById('playButton') // Przycisk startu gry
const introScreen = document.getElementById('introScreen') // Ekran startowy
// ==================================================================================================== //

// ===============================[ Ukrywa ekran startowy ]=========================================== // 
playButton.addEventListener('click', () => {                    // Po kliknięciu w przycisk startu gry
        playSound("clicked")                                    // Odtwarza dźwięk kliknięcia
        introScreen.style.display = "none";                     // Ukrywa ekran startowy
        gameStarted = true                                      // Ustawia grę jako rozpoczętą
        gameOvered = false                                      // Ustawia grę jako nie zakończoną
        gamePaused = false                                      // Ustawia grę jako nie zatrzymaną

        document.addEventListener("keydown", pauseTheGame) // Dodaje event listenera pozwalający na pauzy gry
})
// ==================================================================================================== //

// ================================[ Otwiera ekran pomocy ]============================================ //
const helpScreen = document.getElementById('helpScreen')        // Ekran pomocy
helpScreen.addEventListener("click", function () {              // Po kliknięciu w ekran pomocy
        playSound("clicked")                                    // Odtwarza dźwięk kliknięcia
        helpScreen.style.display = "none"                       // Ukrywa ekran pomocy
})
function openHelp() {                                          // Funkcja otwierająca ekran pomocy
        helpScreen.style.display = "block"
}
document.querySelector("#helpButton").addEventListener("click", () => { // Po kliknięciu w przycisk pomoc 
        playSound("clicked")                                            // Odtwarza dźwięk kliknięcia
        openHelp()                                                      // Otwiera ekran pomocy
})
// ==================================================================================================== //


// ================================[ Otwiera ekran edytora ]============================================ //
const loadButton = document.getElementById('loadButton')                 // Przycisk do "WCZYTAJ" w menu głównym
loadButton.addEventListener("click", function () {                      // Po kliknięciu w przycisk "WCZYTAJ"
        playSound("clicked")                                           // Odtwarza dźwięk kliknięcia
        setTimeout(() => {
                window.open("generator/index.html", "_self")         // Otwiera ekran edytora po 150ms - częściowo zapobiega błędom wczytywania
        }, 150);
})
// ==================================================================================================== //

// ============================[ Ustawianie rozdzielczości okienka canvas ]============================ //
canvas.width = 1000                             // Ustawia szerokość canvasa na 1000px
canvas.height = 1000                           // Ustawia wysokość canvasa na 1000px
staticCanvas.width = canvas.width;            // Ustawia szerokość canvasa statycznego na 1000px
staticCanvas.height = canvas.height;         // Ustawia wysokość canvasa statycznego na 1000px
// ==================================================================================================== //

// ========================================[ Odtwarza dźwięk ]======================================== // 
function playSound(sound, type = 0) {
        switch (sound) {
                case 'hitEdge':                                            // Dźwięk uderzenia w krawędź      
                        new Audio('audio/balHitEdge.ogg').play()
                        break;
                case "brickHit":                                            // Dźwięk uderzenia w cegłę 
                        if (type != 8 && type != 9)
                                new Audio('audio/brickHit.ogg').play() // Domyślny dźwięk uderzenia w cegłę
                        else if (type == 9)
                                new Audio('audio/goldHitSound.ogg').play() // Dźwięk srebrnej cegły
                        else if (type == 8)
                                new Audio('audio/silverHitSound.ogg').play() // Dźwięk złotej cegły
                        break;
                case "hitPlatform":                                         // Dźwięk uderzenia w platformę
                        new Audio('audio/platformHit.ogg').play()
                        break;
                case "hitSmallDOH":                                       // Dźwięk uderzenia w małego DOH'a
                        new Audio('audio/smallDohHit.ogg').play()
                        break;
                case "hitDOH":                                          // Dźwięk uderzenia w DOH'a
                        new Audio('audio/dohHit.ogg').play()
                        break;
                case "gameOver":                                        // Dźwięk przegranej gry
                        new Audio('audio/gameOver.ogg').play()
                        break;
                case "fallOfScreen":                                   // Dźwięk spadnięcia piłki poza ekran
                        new Audio('audio/fallOfScreen.ogg').play()
                        break;
                case "hitedByEnemy":                                 // Dźwięk uderzenia pocisku przeciwnika w platformę
                        new Audio('audio/hitedByEnemy.ogg').play()
                        break;
                case "clicked":                                     // Dźwięk kliknięcia
                        new Audio('audio/click.ogg').play()
                        break;
                case "victory":                                   // Dźwięk wygranej gry
                        new Audio('audio/soundOfVictory.mp3').play()



        }
}
// ==================================================================================================== //

// =======================================[ Dotyczy pauzy gry ]======================================== //
let gameStarted = false // Przechowuje stan czy gra jest uruchomiona
let gamePaused = false // Czy gra się zatrzymana
let gameOvered = false // Czy gra jest zakończona

function pauseTheGame(e) {                              // Funkcja pauzy gry
        if (e.key == 'Escape' && gameStarted) {        // Jeśli naciśnięto klawisz "Escape" i gra jest uruchomiona
                gamePaused = !gamePaused              // Zmienia stan pauzy gry na jej przeciwny
        }                                            // Jeśli gra jest zatrzymana, to ją wznawia, a jeśli jest wznowiona, to ją zatrzymuje
}
// ==================================================================================================== //


// =============================[ Uruchamiane po stracie wszystkich żyć ]============================== //
function gameOver() {                                                   // Funkcja kończąca grę
        context.clearRect(0, 0, canvas.width, canvas.height)           // Czyści canvas
        document.querySelector("#staticCanvas").style.backgroundImage = "url(./img/background.jpg)" // Ustawia tło na domyślne
        document.querySelector("#canvas").style.cursor = "none"       // Ukrywa kursor
        document.removeEventListener("click", gameOver)              // Usuwa event listenera z documentu
        restartTheGame()                                            // Uruchamia funkcję restartującą grę
}
// ==================================================================================================== //


// ========================================[ Dotyczące gracza ]======================================== //
let playerLevel = 1     // Poziom gracza
let playerHealth = 3   // Życie gracza
let playerPoints = 0  // Punkty gracza
// ==================================================================================================== //


// =============[ Ustawia domyśle wartości pozycji i piłki po uruchominiu nowego poziomu ]============= //
function resetToDefault() {
        // -------------------------- [ Usuwa upgrade'y ] -------------------------- //
        prevUpgrade = curUpgrade;        //Zapisuje obecny upgrade jako poprzedni
        curUpgrade = null;              //Usuwa obecny upgrade
        removeAllUpgrades();           //Usuwa wszystkie upgrade'y
        Upgrade.list = [];            //Usuwa wszystkie upgrade'y z listy
        // ----------------------------------------------------------------------- //

        // ---------------------[ Usuwa lasery i fireballe ]--------------------- //
        Projectile.list = [];                   //Usuwa wszystkie pociski z listy
        DOH.list.forEach((el) => {
                el.fireBalls = [null, null];    //Usuwa fireballe DOH'a
        })
        // --------------------------------------------------------------------- //

        // ----------------------------[ Platforma ]----------------------------- //
        platform.holdBall = originalBall; //Przywraca trzymanie piłki przez platformę
        platform.pos = new Vector2D(canvas.width / 2 - platform.size.x / 2, canvas.height - platform.size.y * 2.5) //Przywraca pozycję platformy na środek ekranu
        // --------------------------------------------------------------------- //

        // ----------------------------[ Piłka ]-------------------------------- //
        originalBall.pos.x = platform.pos.x + platform.size.x / 2 - originalBall.radius         // Ustawia pozycję piłki na środku platformy
        originalBall.pos.y = platform.pos.y - 4 - originalBall.radius * 2                      // Ustawia pozycję piłki nad platformą

        originalBall.speed = 4.5;                 // Ustawia prędkość piłki na domyślną - 4.5
        originalBall.dir.x = 0.25;               // Ustawia kierunek X piłki na 0.25
        originalBall.dir.y = -1;                // Ustawia kierunek Y piłki na -1
        originalBall.lastTouchedObj = null;    // Ustawia ostatnio dotknięty obiekt na null
        // --------------------------------------------------------------------- //
        setTimeout(() => {
                updateStaticCanvas(); //Aktualizuje canvas statyczny po 50ms
        }, 50)
}
// ==================================================================================================== //



// ====================================[ Uruchami kolejny poziom ]===================================== //
function nextLevel() {
        playerLevel++           // Zwiększa poziom gracza o 1

        if (playerLevel == 33)  // Jeżeli poziom gracza jest równy 33
                summonDOH();   // Uruchamia poziom z DOH'em
        else                  // Jeżeli nie 
                loadLevel(); // Wczytuje kolejny poziom

        resetToDefault()   // Ustawia domyśle wartości pozycji i piłki po uruchominiu nowego poziomu   
}
// ==================================================================================================== //


// ====================================[ Generuje pozycje cegieł ]===================================== //
function generateBricks(startFrom = null) { // Funkcja generująca cegiełki
        let json
        if (startFrom != null) {                                // Jeżeli wybrano poziomu od którego zacząć
                json = localStorage.getItem(startFrom)         // Wczytuje do json poziom z localStorage
                introScreen.style.display = "none";           // Ukrywa ekran startowy


                if (startFrom.includes("Poziom"))                                       // Jeżeli jest to zwykły poziom to wpisuje jego numer do playerLevel
                        playerLevel = parseInt(startFrom.replace("Poziom ", ""))        // Wpisuje numer poziomu do playerLevel

        } else                                                          // Jeżeli nie wybrano poziomu od którego zacząć
                json = localStorage.getItem(`Poziom ${playerLevel}`)   // Wczytuje do json I poziom z localStorage

        let allBricks = JSON.parse(json) // Parsuje json z localStorage do tablicy cegieł

        Brick.list = []; // Usuwa wszystkie cegiełki z listy

        allBricks.forEach((el, i) => { // Tworzy nowe cegły korzystając z tablicy allBricks
                new Brick(
                        new Vector2D(parseInt(el.x), parseInt(el.y)), // Pozycja cegły
                        new Vector2D(99.9, 49.9),                    // Rozmiar cegły
                        parseInt(el.type)                           // Typ cegły
                )
        })
}
// ==================================================================================================== //


// ======================================[ Wczytuje nowy poziom ]====================================== //
function loadLevel(startFrom = null) {                                  // Funkcja wczytująca poziom
        if (localStorage.length == 0) {                                // Jeżeli localstorage jest pusty
                fetch("generator/basicLevels.json")                   // Wczytuje plik json zawierający poziomy
                        .then(function (response) {
                                return response.json();
                        })
                        .then(function (jsonFile) {
                                jsonFile.forEach((el, i) => {                                            // Dla każdego poziomu w pliku json
                                        if (localStorage.getItem(el.id) == null)                        // Jeśli nie ma go w localStorage
                                                localStorage.setItem(el.id, JSON.stringify(el.bricks)) // Dodaje go do localStorage
                                })
                        })
                        .then(() => {
                                generateBricks(startFrom) // Generuje cegły z parametru startFrom - domyślnie null
                        })

        } else {                           // Jeżeli localstorage nie jest pusty
                generateBricks(startFrom) // Generuje cegły z parametru startFrom - domyślnie null
        }
}
// ==================================================================================================== //


// =========================================[ Restartuje gre ]========================================= //
function restartTheGame() {
        // ------------------------------[ Flagi ]------------------------------- //
        gameStarted = false       // Zatrzymuje grę
        gameOvered = false       // Ustawia stan gry na "nie przegrana"
        gamePaused = false      // Ustawia stan gry na "nie wstrzymana"
        // ---------------------------------------------------------------------- //


        // -------------------------[ Listener canvas ]-------------------------- //
        canvas.addEventListener("click", () => { // Uruchamia grę po kliknięciu w obszarze pola canvas
                gameStarted = true              // Uruchamia grę
                gameOvered = false             // Ustawia stan gry na "nie przegrana"
                gamePaused = false            // Ustawia stan gry na "nie wstrzymana"

                document.addEventListener("keydown", pauseTheGame) // Dodaje event listener do pauzowania gry
        })
        // ---------------------------------------------------------------------- //


        // -------------------------------[ DOH ]-------------------------------- //
        DOH.list.forEach((el) => {      // Dla każdego DOH'a
                el.remove();            // Usuwa wszystkie jego pociski
        })

        MiniDOH.list = [];             // Usuwa wszystkie MiniDOH'y
        // ---------------------------------------------------------------------- //


        // ------------------------------[ Gracz ]------------------------------- //
        playerPoints = 0               // Ustawia punkty gracza na 0
        playerLevel = 1               // Ustawia poziom gracza na 1
        playerHealth = 3             // Ustawia życie gracza na 3
        // ---------------------------------------------------------------------- //


        // ---------------------[ Wczytuje pierwszy poziom ]--------------------- //
        if (localStorage.getItem("_startFrom") != null) { // Wczytuje poziom wybrany przez gracza w edytorze
                gameStarted = true       // Uruchamia grę
                gameOvered = false      // Ustawia stan gry na "nie przegrana"
                gamePaused = false     // Ustawia stan gry na "nie wstrzymana"

                if (localStorage.getItem("_startFrom") != "Poziom 1")    // Jeśli wybrany poziom nie jest pierwszym
                        playerLevel = 0                                 // Ustawia poziom gracza na 0

                loadLevel(localStorage.getItem("_startFrom"))         // Wczytuje wybrany poziom
                localStorage.removeItem("_startFrom")                // Usuwa zmienną tymczasową z localStorage
        } else
                loadLevel() // Wczytuje pierwszy poziom jeśli nie ma wybranego przez gracza
        // ---------------------------------------------------------------------- //


        // -------------------------------[ Inne ]------------------------------- //
        playerLevel = 1                           // Ustawia poziom gracza na 1
        introScreen.style.display = "grid";      // Pokazuje ekran startowy
        resetToDefault()                        // Resetuje wszystkie ustawienia do wartości domyślnych
        // ---------------------------------------------------------------------- //

}
// ==================================================================================================== //

// ========================================[ Funkcja victory ]========================================= //
function victory() { // Wyświetla ekran końcowy i restartuje grę po przejściu gry
        playerHealth = 99               // Ustawia życie gracza na 99
        gameStarted = false            // Zatrzymuje grę
        document.querySelector("#victory").style.display = "grid"; // Pokazuje ekran końcowy

        playSound("victory") // Odtwarza dźwięk zwycięstwa

        document.querySelector("#victory").addEventListener("click", () => { // Po kliknięciu w ekran końcowy
                playSound("clicked") // Odtwarza dźwięk kliknięcia
                document.querySelector("#victory").style.display = "none";  // Ukrywa ekran końcowy
                restartTheGame() // Restartuje grę
        })
}


// ================================[ Klasa wektorów ]========================= //
// Pomogą nam w lepszej organizacji dwunumerycznych list                       //
class Vector2D {
        constructor(x, y) {   // Konstruktor wektora
                this.x = x;  // Wartość x
                this.y = y; // Wartość y
        }


        add(vec) {                 // Dodaje wektoru
                this.x += vec.x;  // Dodaje do siebie wartości x
                this.y += vec.y; // Dodaje do siebie wartości y
        }


        mul(num) {               // Mnoży wektory
                this.x *= num;  // Mnoży wartości x
                this.y *= num; // Mnoży wartości y
        }


        length() {                                                       // Zwraca długość wektora
                return Math.sqrt((this.x * this.x) + (this.y * this.y)) // Zwraca pierwiastek z sumy kwadratów wartości x i y
        }

        dist(vec) {                                                    // Zwraca dystans do podanego wektora
                return new Vector2D(this.x - vec.x, this.y - vec.y);  // Zwraca wektor z wartościami różnicy wartości x i y
        }

        normalized() {                                                  // Zwraca znormalizowany wektor (liczby w zakresie 0-1)
                let len = this.length();                               // Zapisuje długość wektora
                return new Vector2D(this.x / len, this.y / len)       // Zwraca wektor z wartościami podzielonymi przez długość wektora
        }


        normalize() {                              // Zwraca znormalizowany wektor (liczby w zakresie 0-1)                                
                let norm = this.normalized();     // Zapisuje znormalizowany wektor do norm
                this.x = norm.x;                 // Nadpisuje wartości x i y znormalizowanymi wersjami
                this.y = norm.y;                // Nadpisuje wartości x i y znormalizowanymi wersjami
        }
}
// =========================================================================== //


// ================================[ Odpowiada za działanie platformy ]================================ //

// ------------------------------[ Obiekt ]------------------------------ //
let platform = {
        size: new Vector2D(canvas.width / 4.54, canvas.height / 100 * 2.5), // Długość i szerokość platformy
        pos: null, // Pozycja platformy
        prevPos: null, //Poprzednia pozycja
        move: canvas.width / 100 * 5, //Ilość dodawanej pozycji przy poruszaniu się strzałkami
        holdBall: null, //Czy nasza platforma trzyma piłke
        timesIncreased: 0, //Ile razy nasza platforma została powiększona upgradem
        canCatchBall: false, //Czy może złapać piłke (upgrade łapania)
        texture: new Image(), //Tekstura platformy

        draw() { // Funkcja rysująca platformę
                // Jeśli platforma może złapać piłkę to zmienia teksturę na sticky
                if (this.canCatchBall) this.texture.src = "img/textures/platform_sticky.png"; else this.texture.src = "img/textures/platform.png";
                context.drawImage(this.texture, this.pos.x, this.pos.y, this.size.x, this.size.y) // Rysuje platformę
        }
}
// ---------------------------------------------------------------------- //


// -----------------------------[ Pozycje ]------------------------------ //
platform.pos = new Vector2D(Math.floor(canvas.width / 2 - platform.size.x / 2), Math.floor(canvas.height - platform.size.y * 2.5)); // Ustawia pozycję platformy na środku
platform.prevPos = new Vector2D(platform.pos.x, platform.pos.y); // Ustawia poprzednią pozycję platformy na tą samą jak aktualna
// ---------------------------------------------------------------------- //


// -------------------------------[ Klon ]------------------------------- //
let platformClone = { //Klon platformy używany do upgrade'u
        ...platform, //Klonuje platformę
}

platformClone.enabled = false;                                    //Klon platformy jest zawsze wyłączony na starcie
platformClone.texture.src = "img/textures/platform.png";         //Tekstura klonu platformy
platformClone.draw = () => {                                    //Funkcja rysująca klon platformy
        context.globalAlpha = 0.5;                             //Klon platformy jest przeźroczysty
        context.drawImage(platformClone.texture, platformClone.pos.x, platformClone.pos.y, platformClone.size.x, platformClone.size.y) // Rysuje klon platformy
        context.globalAlpha = 1;                             //Przywraca normalną przezroczystość
}
// ---------------------------------------------------------------------- //

// ---------------------[ Sterowanie - klawiatura ]---------------------- //
document.addEventListener("keydown", e => {                     // Sterowanie platformą za pomocą klawiatury
        if (e.key == "ArrowLeft") {                            // Ruch w lewo - strzałka w lewo
                if (platform.pos.x > 0) {                     // Jeśli platforma nie jest w lewej krawędzi
                        platform.prevPos.x = platform.pos.x; //Stara pozycja platformy która będzie używana do obliczenia pozycji złapanej piłki

                        platform.pos.x -= platform.move;                // Przesuwa platformę w lewo
                        platform.pos.x = Math.floor(platform.pos.x);   // Zaokrągla pozycję platformy

                        if (platformClone.enabled) {                                                                      //Jeśli klon platformy jest włączony
                                platformClone.prevPos.x = platformClone.pos.x;                                           // Zapisuje poprzednią pozycję klonu platformy
                                platformClone.pos.x = Math.floor(canvas.width - platform.pos.x - platformClone.size.x); //Ustawiamy klona po przeciwnej stronie
                        }

                        if (platform.holdBall != null) {                                                //Jeśli platforma trzyma piłkę
                                //Pozycja trzymanej piłki jest responsywna do nowej pozycji platformy
                                let ballDiff = platform.holdBall.pos.x - platform.prevPos.x;            //Oblicza różnicę między pozycją piłki a platformy

                                platform.holdBall.prevPos.x = platform.holdBall.pos.x;              //Zapisuje poprzednią pozycję piłki x
                                platform.holdBall.prevPos.y = platform.holdBall.pos.y;             //Zapisuje poprzednią pozycję piłki y

                                platform.holdBall.pos.x = Math.floor(platform.pos.x + ballDiff); //Ustawia pozycję piłki na nową
                        }
                }
        } else if (e.key == "ArrowRight") { // Ruch w prawo - strzałka w prawo
                if (platform.pos.x + platform.size.x < canvas.width) {                  // Jeśli platforma nie jest w prawej krawędzi
                        platform.prevPos.x = platform.pos.x;                            //Zapisuje poprzednią pozycję platformy

                        platform.pos.x += platform.move;                                // Przesuwa platformę w prawo   
                        platform.pos.x = Math.floor(platform.pos.x)                     // Zaokrągla pozycję platformy

                        if (platformClone.enabled) {                                    //Jeśli klon platformy jest włączony
                                platformClone.prevPos.x = platformClone.pos.x;          //Zapisuje poprzednią pozycję klonu platformy
                                platformClone.pos.x = Math.floor(canvas.width - platform.pos.x - platformClone.size.x); //Ustawiamy klona po przeciwnej stronie
                        }

                        if (platform.holdBall != null) {                                            //Jeśli platforma trzyma piłkę
                                let ballDiff = platform.holdBall.pos.x - platform.prevPos.x;       //Oblicza różnicę między pozycją piłki a platformy

                                platform.holdBall.prevPos.x = platform.holdBall.pos.x;           //Zapisuje poprzednią pozycję piłki x
                                platform.holdBall.prevPos.y = platform.holdBall.pos.y;          //Zapisuje poprzednią pozycję piłki y

                                platform.holdBall.pos.x = Math.floor(platform.pos.x + ballDiff); //Ustawia pozycję piłki na nową
                        }
                }
        }



        // Wyrzucenie piłki gdy ją trzymamy
        if (platform.holdBall != null && e.key == " ") {
                platform.holdBall = null;
        }

})
// ---------------------------------------------------------------------- //

// ---------------------[ Sterowanie - myszka ]---------------------- //
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
        }
})
// ---------------------------------------------------------------------- //

// ==================================================================================================== //

// ==========================================[ Klasa piłek ]=========================================== //
class Ball {
        static list = []; // Lista wszystkich piłek
        static ballPower = 0; // Moc wszystkich piłek związana z upgradem mocy. Liczba wskazuje na ilość razy w których piłka może swobodnie usunąć cegłe bez jej odbicia
        static ballSpeedIncrease = 0.012; //Wartość dodawana do predkości piłki przy kazdym uderzeniu

        constructor(pos, dir, radius, enemyBall = false, enemyParent) {
                this.pos = pos; // Przechowuje pozycje piłki
                this.prevPos = new Vector2D(pos.x, pos.y); // Przechowuje poprzednią pozycje piłki
                this.dir = dir; // Przechowuje kierunek piłki
                this.radius = radius; // Przechowuje promień piłki
                this.enemyBall = enemyBall; // Czy piłka jest fireballem?

                if (enemyBall)
                        this.parent = enemyParent; // Rodzic fireballa

                this.speed = 4.5; // Szybkość
                if (enemyBall)
                        this.speed = 9; // Fireball jest szybszy

                this.texture = new Image(); // Tekstura piłki

                if (enemyBall)
                        this.texture.src = "img/FireBall.svg";
                else
                        this.texture.src = "img/ball.png";

                this.power = Ball.ballPower; // Siła piłki

                if (!enemyBall) Ball.list.push(this); // Dodaje do listy wszystkich piłek, fireballe są dodawane do tablicy DOH'a
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

        // Logika i działanie piłki
        think() {
                let hit = false; //Jeśli coś dotkneliśmy, nie sprawdzamy kolizji innych rzeczy


                //Kolizja ze ścianami
                if (this.pos.x <= 0) {
                        if (this.lastTouchedObj != 'leftwall') playSound("hitEdge");
                        this.lastTouchedObj = 'leftwall';
                        this.dir.x = Math.abs(this.dir.x);
                        hit = true;
                } else if (this.pos.x + this.radius * 2 >= canvas.width) {
                        if (this.lastTouchedObj != 'rightwall') playSound("hitEdge");
                        this.lastTouchedObj = 'rightwall';
                        this.dir.x = -Math.abs(this.dir.x);
                        hit = true;
                } else if (this.pos.y <= 0) {
                        if (this.lastTouchedObj != 'topwall') playSound("hitEdge");
                        this.lastTouchedObj = 'topwall';
                        this.dir.y = Math.abs(this.dir.y);
                        hit = true;
                } else if (this.pos.y + this.radius * 2 >= canvas.height && this.enemyBall) {
                        if (this.lastTouchedObj != 'bottomwall') playSound("hitEdge");
                        this.lastTouchedObj = 'bottomwall';
                        this.dir.y = -Math.abs(this.dir.y);
                        hit = true;
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

                                                if (hit) {
                                                        //Jeśli piłka ma wystarczającą moc to nie odbija się
                                                        if (this.power > 0 && brick.type != 9 && brick.type != 8)
                                                                this.power--;
                                                        else if (this.power > 0 && brick.type == 8 && this.power >= brick.health)
                                                                this.power -= brick.health;
                                                        else //W przeciwnym wypadku piłka odbiję się normalnie
                                                                if (col.side == 'left' || col.side == 'right') this.invertDirX(); else this.invertDirY();

                                                        this.lastTouchedObj = brick;
                                                        brick.remove(); //Usuwa cegłe
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

                                        if (doh.minionsNum <= 0) //Jeżeli nie ma mini doh'ów, możemy zranić samego doh'a
                                                if (this.power > 0) doh.hp -= this.power; else doh.hp--;

                                        this.lastTouchedObj = doh;

                                        playSound('hitDOH'); // Odtwarzanie dźwięku uderzenia w DOHa

                                        updateStaticCanvas(); //Odświeża statyczny canvas by odświeżyło pasek życia
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
                                                this.dir.x = col.hitFactor * 5; //Kierunek piłki jest zależny od pozycji w którą wleciała w paletke
                                                this.invertDirY();

                                                if (platform.canCatchBall && platform.holdBall == null && col.side == 'top')
                                                        platform.holdBall = this; //Jeśli możemy to przechwytujemy piłke
                                        }

                                        playSound('hitPlatform'); // Odtwarzanie dźwięku uderzenia w platformę

                                        hit = true;
                                        this.lastTouchedObj = platform;
                                        this.power = Ball.ballPower; // Odświeżamy moc piłki
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
                        this.speed += Ball.ballSpeedIncrease; //Zwiększamy prędkość piłki po kolizji
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
                        } else { //Dodatkowe piłki są poprostu usuwane
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

        remove() {      // Usuwa piłkę
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

        static refreshBallPower() {     // Odświeża moc piłki
                Ball.list.forEach((el) => {
                        el.power = Ball.ballPower;
                })
        }
}

// ---------------------------[ Piłka główna ]--------------------------- //
let originalBall = new Ball( // Tworzy piłkę
        new Vector2D( // Ustawia pozycje
                null,   // x
                null    // y
        ),
        new Vector2D(0.25, -1), // Kierunek
        canvas.width / 27.22 / 2 // Size
);
// --------------------------------------------------------------------- //


// -----------[ Na początku piłka pojawia się nad platformą ]------------ //
originalBall.pos.x = platform.pos.x + platform.size.x / 2 - originalBall.radius
originalBall.pos.y = platform.pos.y - 0 - originalBall.radius * 2

originalBall.prevPos.x = originalBall.pos.x;
originalBall.prevPos.y = originalBall.pos.y;
// --------------------------------------------------------------------- //

// ==================================================================================================== //


// =========================================[ Ulepszenia ]========================================= //

// ---------------------------[ Klasa lasera ]--------------------------- //
class Projectile {
        static list = []; //Lista wszystkich
        static playerLasers = 0; //Ilość doładowań lasera gracza
        static nextPlayerFire = 0; //Czas następnego wystrzału lasera
        static playerLaserSize = new Vector2D(canvas.width / 50, canvas.height / 20); //Wielkość lasera gracza

        constructor(pos, dir, size, speed, player, texture = "img/laserProjectile.png") {
                this.pos = pos; // Pozycja
                this.prevPos = new Vector2D(pos.x, pos.y); // Poprzednia pozycja
                this.dir = dir; // Kierunek
                this.size = size; // Wielkość
                this.speed = speed; // Szybkość
                this.isPlayers = player // Czy laser należy do gracza

                this.texture = new Image(); // Tekstura
                this.texture.src = texture;

                Projectile.list.push(this);
        }

        draw() { //Rysowanie
                context.save()
                //Obracamy teksture względem kierunku
                context.translate(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2)
                context.rotate((90 * this.dir.x) * Math.PI / 180 * this.dir.y)
                context.translate(-(this.pos.x - this.size.x / 2), -(this.pos.y - this.size.y / 2))
                context.drawImage(this.texture, this.pos.x, this.pos.y, this.size.x, this.size.y)
                context.restore()
        }

        remove() { //Usuwanie
                Projectile.list.forEach((el, index) => {
                        if (el == this)
                                Projectile.list.splice(index, 1);
                })
        }
}
// --------------------------------------------------------------------- //


// --------------------------[ Klasa portali ]--------------------------- //
class Portal { //Portal
        static list = []; //Lista wszystkich
        static enabled = false; //Czy portal jest włączony

        constructor(pos, size) { //Tworzenie
                this.pos = pos;
                this.size = size;

                this.texture = new Image();
                this.texture.src = "img/portal.png";

                Portal.list.push(this);
        }

        draw() { //Rysowanie
                contextStatic.drawImage(this.texture, this.pos.x, this.pos.y, this.size.x, this.size.y);
        }

        remove() { //Usuwanie
                Portal.list.forEach((el, index) => {
                        if (el == this)
                                Portal.list.splice(index, 1); //Usuwa portal z listy
                })
        }
}
// --------------------------------------------------------------------- //


// ------------------------[ Ustawienia portalu ]------------------------ //
let portalW, portalH; //Wielkość portalu
portalW = canvas.width / 12.5; // Szerokość portalu
portalH = canvas.height / 10; // Wysokość portalu
new Portal(new Vector2D(canvas.width - canvas.width * 0.0005 - portalW + 25, canvas.height - canvas.height * 0.025 - portalH), new Vector2D(portalW, portalH)); // Portal będzie po prawej stronie
// --------------------------------------------------------------------- //


// ------------------------[ Ustawienia ulepszeń ]----------------------- //
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
// --------------------------------------------------------------------- //

// ----------------------[ Usuwa efekt ulepszenia ]---------------------- //
function removeUpgradeEffect(upgrade) {
        switch (upgrade) { //Usuwa efekt ulepszenia
                case UPGRADE_LASER: //Laser
                        Projectile.playerLasers = 0;
                        break;
                case UPGRADE_SKIP: //Przejście do następnego poziomu
                        Portal.enabled = false;
                        updateStaticCanvas();
                        break;

                case UPGRADE_BALLPOWER: //Większa siła piłki
                        Ball.ballPower = 0;
                        Ball.refreshBallPower();
                        break;
                case UPGRADE_MOREBALLS: //Więcej piłek
                        Ball.list.splice(1);
                        break;

                case UPGRADE_BALLCATCH: //Tryb chwytania piłki
                        platform.canCatchBall = false;
                        break;
                case UPGRADE_PLATFORMSIZE: //Powiększenie platformy
                        platform.size.x -= Upgrade.platformSizeIncrease * platform.timesIncreased;
                        platform.pos.x += Upgrade.platformSizeIncrease * platform.timesIncreased / 2;
                        platform.timesIncreased = 0;
                        break;
                case UPGRADE_PLATFORMCLONE: //Klon platformy
                        platformClone.enabled = false;
                        break;
                default:
                        break;
        }
}
// --------------------------------------------------------------------- //

// -----------------[ Usuwa wszystkie efekty ulepszeń ]------------------ //
function removeAllUpgrades() {
        for (let i = 0; i <= 7; i++) {
                removeUpgradeEffect(i);
        }
}
// --------------------------------------------------------------------- //


// ----------------------[ Klasa ulepszeń - byty ]----------------------- //
class Upgrade {
        static list = []; //Lista wszystkich
        static typeToTexture = [ //Tekstury ulepszeń
                "img/upgrades/upgrade_hp.svg",
                "img/upgrades/upgrade_strength.svg",
                "img/upgrades/upgrade_moreballs.svg",
                "img/upgrades/upgrade_stick.svg",
                "img/upgrades/upgrade_doppelganger.svg",
                "img/upgrades/upgrade_size.svg",
                "img/upgrades/upgrade_laser.svg",
                "img/upgrades/upgrade_skip.svg"
        ]

        static nextUpgradePoints = 1200; //Punkty do kolejnego upgrade'u
        static platformSizeIncrease = canvas.width / 25; //Ilość wydłużenia platformy

        constructor(pos, type) { //Tworzenie
                this.pos = pos; //Pozycja
                this.prevPos = new Vector2D(pos.x, pos.y); //Poprzednia pozycja
                this.velY = 3.2; // Szybkość w płaszczyźnie Y, zaczynamy od 3.2 by dodać efekt "podskoczenia" przy pojawieniu się ulepszenia
                this.type = type; //Typ
                this.size = new Vector2D(canvas.width / 10 - 0.1, canvas.width / 10 - 0.1); //Wielkość

                this.texture = new Image(); //Tekstura
                this.texture.src = Upgrade.typeToTexture[this.type]; //Tekstura - źródło

                Upgrade.list.push(this); //Dodaje do listy
        }

        draw() { //Rysowanie
                context.drawImage(this.texture, this.pos.x, this.pos.y, this.size.x, this.size.y);
        }

        collect() { //Zbieranie
                playSound("clicked") //Dźwięk
                prevUpgrade = curUpgrade;
                curUpgrade = this.type;

                switch (curUpgrade) {
                        //Ogólne
                        case UPGRADE_MOREHP: //Więcej życia
                                playerHealth++;
                                updateStaticCanvas();
                                break;
                        case UPGRADE_LASER: //Laser
                                Projectile.playerLasers++;
                                break;
                        case UPGRADE_SKIP: //Przejście do następnego poziomu
                                Portal.enabled = true;
                                updateStaticCanvas();
                                break;

                        //Piłki
                        case UPGRADE_MOREBALLS: //Więcej piłek
                                removeUpgradeEffect(UPGRADE_BALLPOWER); //Usuwa efekt większej siły piłki
                                new Ball(new Vector2D(Math.floor(platform.pos.x + platform.size.x / 2 - canvas.width / 27.77 / 2), platform.pos.y - canvas.width / 27.77), new Vector2D(0.25, 1), canvas.width / 27.77 / 2);
                                break;
                        case UPGRADE_BALLPOWER: //Większa siła piłki
                                removeUpgradeEffect(UPGRADE_MOREBALLS); //Usuwa efekt większej ilości piłek
                                Ball.ballPower++; //Zwiększa siłę piłki
                                Ball.refreshBallPower(); //Odświeża siłę piłki
                                break;

                        //Platforma
                        case UPGRADE_BALLCATCH: //Tryb chwytania piłki
                                removeUpgradeEffect(UPGRADE_PLATFORMSIZE); //Usuwa efekt powiększenia platformy
                                removeUpgradeEffect(UPGRADE_PLATFORMCLONE); //Usuwa efekt klonu platformy

                                platform.canCatchBall = true; //Włącza tryb chwytania piłki
                                break;
                        case UPGRADE_PLATFORMCLONE: //Klon platformy 
                                removeUpgradeEffect(UPGRADE_PLATFORMSIZE); //Usuwa efekt powiększenia platformy
                                platformClone.enabled = true; //Włącza klon platformy
                                platformClone.pos.x = canvas.width - platform.pos.x - platformClone.size.x; //Ustawia pozycję klonowi platformy
                                break;
                        case UPGRADE_PLATFORMSIZE: //Powiększenie platformy
                                removeUpgradeEffect(UPGRADE_PLATFORMCLONE); //Usuwa efekt klonu platformy
                                platform.size.x += Upgrade.platformSizeIncrease; //Powiększa platformę
                                platform.pos.x -= Upgrade.platformSizeIncrease / 2; //Przesuwa platformę w lewo
                                platform.pos.x = Math.floor(platform.pos.x); //Zaokrągla pozycję platformy

                                platform.timesIncreased++; //Zwiększa licznik powiększeń platformy
                                break;
                        default:
                                break;
                }

                this.remove(); //Usuwa ulepszenie
        }

        remove() { //Usuwanie
                Upgrade.list.forEach((el, index) => { //Przeszukuje listę
                        if (el == this)
                                Upgrade.list.splice(index, 1); //Usuwa z listy
                })
        }
}
// --------------------------------------------------------------------- //

let nextUpgrade = playerPoints + Upgrade.nextUpgradePoints + Math.floor(Math.random() * 501); // Punkty do następnego ulepszenia
// ==================================================================================================== //

// ==============================================[ DOH ]=============================================== //

// --------------------------[ Klasa MiniDOH ]--------------------------- //
class MiniDOH { //Klasa mini DOH
        static list = []; //Lista mini DOH

        constructor(pos, size, parent, hp = 3) { //Tworzenie
                this.pos = pos; //Pozycja
                this.size = size; //Wielkość
                this.hp = hp; //Życie
                this.parent = parent; //Rodzic

                this.texture = new Image(); //Tekstura
                this.texture.src = "img/doh.png"; //Tekstura - źródło

                MiniDOH.list.push(this); //Dodaje do listy

                updateStaticCanvas(); //Odświeża canvas statyczny
        }

        draw() { //Rysowanie
                contextStatic.drawImage(this.texture, this.pos.x, this.pos.y, this.size.x, this.size.y); //Rysuje mini DOH
        }

        remove() { //Usuwanie
                MiniDOH.list.forEach((el, index) => {
                        if (el == this) {
                                this.parent.minionsNum--;
                                MiniDOH.list.splice(index, 1); //Usuwa z listy
                        }
                })

                updateStaticCanvas(); //Odświeża canvas statyczny
        }
}
// --------------------------------------------------------------------- //


// ----------------------------[ Klasa DOH ]----------------------------- //
class DOH {
        static list = []; //Lista DOH

        constructor(pos, size, hp = 20) { //Tworzenie
                this.pos = pos; //Pozycja
                this.size = size; //Wielkość
                this.hp = hp; //Życie

                this.texture = new Image(); //Tekstura
                this.texture.src = "img/doh.png"; //Tekstura - źródło

                this.summonedMinions = false; //Czy przywołał mini-dohy?
                this.fireBalls = [null, null]; //Lista fireballi
                this.minionsNum = 0; //Ilość mini-dohów

                DOH.list.push(this); //Dodaje do listy  

                updateStaticCanvas(); //Odświeża canvas statyczny
        }

        think(cTime) { // Logika i działanie
                this.fireBalls.forEach((el) => { //Przeszukuje listę fireballi
                        if (el != null) el.think(); //Jeżeli fireball istnieje, to go porusza
                })

                if (this.hp <= 0) this.remove(); //Jeżeli hp jest mniejsze lub równe 0, to usuwa

                if (this.hp <= 10 && !this.summonedMinions) { //Jeżeli hp jest mniejsze lub równe 10 i nie przywołał mini-dohów
                        this.summonedMinions = true; // Zmienia wartość flagi na true

                        //Przywołał mini-dohy
                        new MiniDOH(new Vector2D(this.pos.x - canvas.width / 25, this.pos.y + this.size.y * 0.95), new Vector2D(canvas.width / 12.5, canvas.height / 6.94), this);
                        new MiniDOH(new Vector2D(this.pos.x + canvas.width / 12.5, this.pos.y + this.size.y), new Vector2D(canvas.width / 12.5, canvas.height / 6.94), this);
                        new MiniDOH(new Vector2D(this.pos.x + this.size.x - canvas.width / 6.25, this.pos.y + this.size.y), new Vector2D(canvas.width / 12.5, canvas.height / 6.94), this);
                        new MiniDOH(new Vector2D(this.pos.x + this.size.x - canvas.width / 25, this.pos.y + this.size.y * 0.95), new Vector2D(canvas.width / 12.5, canvas.height / 6.94), this);

                        this.minionsNum = 4; //Ustawia ilość mini-dohów na 4

                        updateStaticCanvas(); //Odświeża canvas statyczny
                }

                if (this.fireBalls[0] == null && platform.holdBall == null) { //Jeżeli nie ma fireballa i platforma nie trzyma piłki
                        // Tworzy fireballa
                        this.fireBalls[0] = new Ball(new Vector2D(Math.floor(this.pos.x + this.size.x * 0.35), Math.floor(this.pos.y + this.size.y * 0.6)), new Vector2D(0.75, 1), canvas.width / 20 / 2, true, this);
                }

                if (this.fireBalls[1] == null && platform.holdBall == null && this.hp <= 10) { //Jeżeli nie ma fireballa i platforma nie trzyma piłki i hp jest mniejsze lub równe 10
                        // Tworzy fireballa
                        this.fireBalls[1] = new Ball(new Vector2D(Math.floor(this.pos.x + this.size.x * 0.35), Math.floor(this.pos.y + this.size.y * 0.6)), new Vector2D(-0.75, 1), canvas.width / 20 / 2, true, this);
                }
        }

        draw() { //Rysowanie
                contextStatic.drawImage(this.texture, this.pos.x, this.pos.y, this.size.x, this.size.y); //Rysuje texture DOH'a
        }

        remove() { //Usuwanie po śmierci
                DOH.list.forEach((el, index) => {
                        if (el == this) {
                                if (playerHealth > 0)
                                        victory(); //Wywołuje funkcję zwycięstwa
                                DOH.list.splice(index, 1); //Usuwa z listy DOH'a
                        }
                })

                updateStaticCanvas(); //Odświeża canvas statyczny
        }
}
// --------------------------------------------------------------------- //

// -----------------[ Przywołuje DOH'a przy poziome 33 ]----------------- //
function summonDOH() {
        Brick.list = []; //Usuwa cegiełki

        let width, height; // Szerokość i wysokość
        width = canvas.width / 2.5; //Ustawia szerokość
        height = canvas.height / 2; //Ustawia wysokość

        // Tworzy DOH'a
        new DOH(new Vector2D(canvas.width / 2 - width / 2, canvas.height / 2 - height / 1.5), new Vector2D(width, height));

        setTimeout(() => {
                updateStaticCanvas(); //Odświeża canvas statyczny 
        }, 45)
}
// --------------------------------------------------------------------- //
// ==================================================================================================== //


// =================================[ Odpowiada za rysowanie cegieł ]================================== //

// ---------------------------[ Klasa cegieł ]--------------------------- //
class Brick {
        static list = []; //Lista cegieł
        static nextFreeHealth = 20000 // Punkty do zdobycia do następnego darmowego życia

        constructor(pos, size, type) { //Konstruktor
                this.pos = pos; //Pozycja
                this.size = size; //Rozmiar

                this.health = 1 // Życie cegły

                this.texture = new Image(); //Tekstura cegły

                this.type = type // Rodzaj cegły

                // Ustawia na podstawie typu:
                // - teksturę
                // - wartość punktową
                // - opcjonalnie życie
                if (this.type == 0) {  // Biała cegła
                        this.texture.src = "img/bricks/whiteBrick.jpg"
                        this.value = 50
                }
                else if (this.type == 1) { // Pomarańczowa cegła
                        this.texture.src = "img/bricks/orangeBrick.jpg"
                        this.value = 60
                }
                else if (this.type == 2) { // Cyjanowa cegła
                        this.texture.src = "img/bricks/cyanBrick.jpg";
                        this.value = 70
                }
                else if (this.type == 3) { // Zielona cegła
                        this.texture.src = "img/bricks/greenBrick.jpg"
                        this.value = 80
                }
                else if (this.type == 4) { // Czerwona cegła
                        this.texture.src = "img/bricks/redBrick.jpg"
                        this.value = 90
                }
                else if (this.type == 5) { // Niebieska cegła
                        this.texture.src = "img/bricks/blueBrick.jpg"
                        this.value = 100
                }
                else if (this.type == 6) { // Różowa cegła
                        this.texture.src = "img/bricks/pinkBrick.jpg"
                        this.value = 110
                }
                else if (this.type == 7) { // Żółta cegła
                        this.texture.src = "img/bricks/yellowBrick.jpg"
                        this.value = 120
                }
                else if (this.type == 8) { // Srebrna cegła
                        this.texture.src = "img/bricks/silverBrick.jpg"
                        this.value = 50 * playerLevel
                        this.health = parseInt(playerLevel / 8) + 2
                }
                else if (this.type == 9) { // Złota cegła
                        this.texture.src = "img/bricks/goldBrick.jpg"
                        this.health = -1 // Życie - nieśmeieralna
                }

                Brick.list.push(this); //Dodaje do listy cegieł

                updateStaticCanvas(); //Odświeża canvas statyczny
        }

        // Rysuje cegłe
        draw() {
                contextStatic.drawImage(this.texture, this.pos.x, this.pos.y, canvas.width / 10 - 0.1, canvas.height / 20 - 0.1);
        }

        // Usuwa cegłe
        remove() {
                playSound("brickHit", this.type) // Odtwarza dźwięk uderzenia w cegłę
                this.health-- // Odejmuje życie cegły
                if (this.health == 0) { // Jeśli cegła nie ma już życia
                        Brick.list.forEach((el, index) => {
                                if (el == this) {
                                        playerPoints += this.value // Dodaje pkt po rozbiciu cegły

                                        // Jeśli zdobyto wystarczającą ilość punktów to dodaje graczowi życie
                                        if (playerPoints >= Brick.nextFreeHealth) {
                                                Brick.nextFreeHealth += 60000
                                                playerHealth++
                                        }

                                        if (this.type != 8 && this.type != 9 && playerPoints >= nextUpgrade) {
                                                nextUpgrade = playerPoints + Upgrade.nextUpgradePoints + Math.floor(Math.random() * 51);

                                                let randUpgrade = Math.floor(Math.random() * 8);
                                                new Upgrade(new Vector2D(Math.floor(this.pos.x + this.size.x / 2), Math.floor(this.pos.y + this.size.y / 2)), randUpgrade);
                                        }
                                        Brick.list.splice(index, 1);    // Wyrzuca cegłe z listy wszystkich cegieł
                                }
                        })
                }

                updateStaticCanvas(); //Odświeża canvas statyczny
        }
}
// --------------------------------------------------------------------- //


// -----------------[ Kolizja prostokąta z prostokątem ]----------------- //
function rectXrectCollision(obj1, obj2) {
        if (obj1 == null || obj2 == null)
                return null;

        let colData = {}; //Obiekt które zwrócimy zawierający informację o kolizji

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
// --------------------------------------------------------------------- //


// -----------------[ Kolizja kółka z prostokątem ]--------------------- //
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
        colData.hitFactor = (circ.pos.x - (rect.pos.x + rect.size.x / 2)) / rect.size.x

        return colData;
}
// --------------------------------------------------------------------- //

// ==================================================================================================== //

// =======================================[ Funkcje cykliczne ]======================================== //
function gameLoop(cTime) { // Funkcja cykliczna odpowiadająca za całą grę

        // ---------------------------[ Cykliczność ]---------------------------- //
        if (gameStarted && !gamePaused && !gameOvered) {  // Jeżeli gra jest rozpoczęta i nie jest wstrzymana to wykonuje się cała logika gry
                think(cTime);                            // Wywołuje funkcję logiki gry
                draw();                                 // Wywołuje funkcję rysowania gry

                if (!Brick.list.filter(el => el.type != 9).length && playerLevel != 33)    // Jeżeli nie ma już żadnych cegieł poza złotymi to przechodzi do następnego poziomu
                        nextLevel()                                                       // Wywołuje funkcję przechodzenia do następnego poziomu
        } else if (!gamePaused && !gameOvered)                                           // Jeżeli gra nie jest wstrzymana i nie jest przegrana to rysuje napis rozpoczęcia gry
                restartTheGame();                                                       // Wywołuje funkcję rysującą napis rozpoczęcia gry
        // --------------------------------------------------------------------- //


        // ---------------------------[ Napis pauzy ]---------------------------- //
        if (gamePaused && !gameOvered && gameStarted) {                               // Jeżeli gra jest wstrzymana i nie jest przegrana i rozpoczęta to rysuje napis pauzy
                let texture = new Image()                                            // Tworzy obiekt obrazu
                texture.src = "img/gamePaused.png"                                  // Ustawia źródło obrazu
                context.drawImage(texture, 159.2, canvas.height - 300, 681, 170.4) // Rysuje obraz na ekranie
        }
        // --------------------------------------------------------------------- //

        window.requestAnimationFrame(gameLoop) // Kontynuacja game loopa
}


function think(cTime) { // Funkcja odpowiadająca za całą logikę gry

        // -----------------[ Wywołuje funkcję logiki u DOH'a ]------------------ //
        DOH.list.forEach((el) => el.think(cTime));
        // --------------------------------------------------------------------- //


        // -------------------[ Strzela laserami z platformy ]------------------- //
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
        // --------------------------------------------------------------------- //


        // -------------------------[ Logika laserów ]------------------------- //
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
        // ------------------------------------------------------------------ //


        // ------------------------[ Logika upgrade'ów ]------------------------- //
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
        // ------------------------------------------------------------------ //

        // --------------------------[ Logika portali ]-------------------------- //
        if (Portal.enabled)
                Portal.list.forEach((el) => { //Rysuje każdy portal
                        let col = rectXrectCollision(el, platform) //Kolizja z platformą

                        if (col.hit) // Jeśli się w niego wejdzie
                                nextLevel(); // Przejście do następnego poziomu
                })
        // ------------------------------------------------------------------ //

        // -----------------------[ System kolizji piłki ]----------------------- //
        Ball.list.forEach((el, index) => {
                el.think();
        })
        // ------------------------------------------------------------------ //
}

function draw() { // Funkcja odpowiadająca za całą grafikę gry
        context.clearRect(0, 0, canvas.width, canvas.height) //Usuwa poprzednią klatke

        if (playerHealth > 0) { //Jeśli gracz ma życia
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

                //Rysuje każdy upgrade
                Upgrade.list.forEach((el) => el.draw());

                //Rysuje kazdy laser
                Projectile.list.forEach((el) => el.draw());
        }
        else {
                // ---------------------[ Wyświetla zdobyte punkty ]--------------------- //
                context.font = `bold ${canvas.height / 18.5}px Arial`;   // Ustawia czcionkę
                context.fillStyle = '#0090e1';                          // Ustawia kolor
                context.fillText(`${playerPoints}💎`, canvas.width / 50, canvas.height / 15.625) // Wypisuje punkty
                // ------------------------------------------------------------------ //


                // -----------[ Wyświetla napis koniec gry i odtwarza dźwięk ]----------- //
                document.querySelector("#staticCanvas").style.backgroundImage = "url(./img/gameOverScreen.png)" // Zmienia tło statycznego canvasa na obrazek końca gry
                document.querySelector("#canvas").style.cursor = "pointer" // Zmienia kursor na strzałkę
                playSound("gameOver")                         // Odtwarza dźwięk końca gry
                // ------------------------------------------------------------------ //


                // -----------------[ Ustawia flagi pauzy i końca gry ]------------------ //
                gameOvered = true                                       // Ustawia flagę końca gry
                document.removeEventListener("keydown", pauseTheGame)  // Usuwa event listenera pauzy
                document.addEventListener("click", gameOver)          // Dodaje event listenera gameOver do documetu
                // ------------------------------------------------------------------ //
        }

        context.stroke(); //Kończy rysować nową klatke
}


function updateStaticCanvas() { //Odświeża statyczny canvas - canvas dla obiektów które rzadko mają potrzebę odświeżania
        contextStatic.clearRect(0, 0, staticCanvas.width, staticCanvas.height); //Usuwa poprzednią klatke

        if (playerHealth > 0) { //Jeśli gracz ma życia
                DOH.list.forEach((el) => el.draw()); //Rysuje każdego doha
                MiniDOH.list.forEach((el) => el.draw()); //Rysuje każdego mini doha

                if (Portal.enabled)                              //Jeśli portal jest włączony
                        Portal.list.forEach((el) => el.draw()); //Rysuje każdy portal

                Brick.list.forEach((el) => el.draw()); //Rysuje każdą cegłę


                // -------------------------[ Wyświetla punkty ]------------------------- //
                contextStatic.font = `bold ${staticCanvas.height / 18.5}px Arial`;
                contextStatic.fillStyle = '#0090e1';

                contextStatic.fillText(`${playerPoints}💎`, staticCanvas.width / 50, staticCanvas.height / 15.625) // Punkty
                // ------------------------------------------------------------------ //


                // ------------------------[ Wyświetla życie ]------------------------- //
                contextStatic.fillStyle = '#f8312f';
                if (playerHealth < 10)
                        contextStatic.fillText(`${playerHealth}❤️`, staticCanvas.width - staticCanvas.width / 9, staticCanvas.height / 15.625) // Życie
                else
                        contextStatic.fillText(`${playerHealth}❤️`, staticCanvas.width - staticCanvas.width / 7.6, staticCanvas.height / 15.625) // Życie
                // ------------------------------------------------------------------ //


                // ------------------------[ Pasek życia DOH'a ]------------------------- //
                if (DOH.list.length > 0) { //Jeśli jest jakiś doh
                        let doh = DOH.list[0]; //Pobiera pierwszego doha

                        contextStatic.fillStyle = '#0e0a24'; // Ustawia kolor tła paska życia

                        contextStatic.fillRect(staticCanvas.width * 0.2 + 8, staticCanvas.height / 15.625 - staticCanvas.height / 18.5, staticCanvas.width * 0.6 - 15, staticCanvas.height / 18.5); // Rysuje tło paska życia
                        if (doh.minionsNum > 0) contextStatic.fillStyle = '#0089c4'; else contextStatic.fillStyle = '#de4f35'; // Ustawia kolor paska życia zależnie od obecności minionów

                        // Rysuje pasek życia - jego szerokość zależy od ilości życia doha
                        contextStatic.fillRect(staticCanvas.width * 0.2 + 25, staticCanvas.height / 15.625 - staticCanvas.height / 18.5 + 10, (staticCanvas.width * 0.6 - 50) * (doh.hp / 20), staticCanvas.height / 18.5 - 20);
                }
                // ------------------------------------------------------------------ //
        }

        contextStatic.stroke(); //Kończy rysować nową klatke
}
// ==================================================================================================== //
gameLoop(0) //Zaczyna game loop