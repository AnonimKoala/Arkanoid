
// =================================[ Odpowiada za działanie cegieł ]================================== //
class Brick {
    static list = [];

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
            Brick.list.forEach((el, index) => {
                if (el == this) {
                    playerPoints += this.value // Dodaje pkt po rozbiciu cegły
                    Brick.list.splice(index, 1);    // Wyrzuca cegłe z listy wszystkich cegieł
                }
            })
    }
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





const rows = document.querySelectorAll(".row")
const allBricks = document.querySelectorAll(".row > li")
const chooseColorDiv = document.querySelectorAll("#chooseType > li")
let pickedColor
let pickedType



function setPalette() {
    let brickX = -0.1
    let brickY = 500
    allBricks.forEach((el, i) => {
        el.dataset.x = brickX
        el.dataset.y = brickY

        if (brickX > 4400) {
            brickX = -0.1
            brickY += 250
        }
        else
            brickX += 500





    })
}
setPalette()

chooseColorDiv.forEach((el, i) => {
    el.addEventListener("click", e => {
        chooseColorDiv.forEach(eC => {
            eC.classList.remove("picked")
        })

        el.classList.add("picked")
        pickedColor = e.target.dataset.color
        pickedType = i
    })
})

allBricks.forEach((el, i) => {
    el.addEventListener("click", e => {
        e.target.style.backgroundColor = pickedColor
        e.target.dataset.type = pickedType
    })
})


function printJSON() {
    // allBricks.forEach((el, i) => {
    //     if (el.dataset.type != 10)
    //         new Brick(
    //             new Vector2D(el.dataset.x, el.dataset.y),
    //             new Vector2D(499.9, 249.9),
    //             el.dataset.type
    //         )
    // })
    // console.log(JSON.stringify(Brick.list));
    JSON.stringify(allBricks)
}










// read local JSON file in javascript
// fetch("../list.json")
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     console.log(data);
//   })















