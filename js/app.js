var height = 6;
var width = 5;
var maxGuesses = 6;
//var answer = "";
var guesses = [];

var row = 0;
var col = 0;

var gameOver = false;
var answer = "tests";
answer = answer.toUpperCase();


window.onload = function() {
    init();
}

function init() {
    console.log("answer : ", answer);
    //creat board
    for (r = 0; r < height; r++) {
        for (c = 0; c < width; c++) {
            // <span id = "0-0 class = "tile"><span>
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);

        }
    }

    document.addEventListener("keyup", (ev) => {
        if (gameOver) {
            return;
        }

        let key = ev.key;
        if(key >= 'a' && key <= 'z') {
            if (col < width) {
                let currentTile = document.getElementById(row.toString() + "-" + col.toString());
                if (currentTile.innerText == "") {
                    currentTile.innerText = key.toUpperCase();
                    col++;
                }
            }
        }
        else if (key == "Backspace") {
            if (col > 0 && col <= width) {
                let currentTile = document.getElementById(row.toString() + "-" + (col - 1).toString());
                currentTile.innerText = "";
                col--;
            }
        }
        else if (key == "Enter") {
            if (col == width) {
                updateWord();
                if (!gameOver) {  
                    row++;
                }
                col = 0;
            }
        }

        if (!gameOver && row == height) {
            gameOver = true;
            document.getElementById("answer").innerText = answer;
        }
    });
}

function updateWord() {

    let letterCount = {};
    for (let i = 0; i < answer.length; i++) {
        let letter = answer[i];
        if (letterCount[letter]) {
            letterCount[letter]++;
        }
        else {
            letterCount[letter] = 1;
        }
    }
    console.log(letterCount);

    let correct = 0;
    let present = 0;
    let absent = 0;

    // for correct letters
    for (let c = 0; c < width; c++) {
        let currentTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currentTile.innerText.toUpperCase();
        console.log(letter);

        if (letter == answer[c]) {
            currentTile.classList.remove("present");
            currentTile.classList.add("correct");
            correct++;
            letterCount[letter]--;
        }
    }

    console.log(letterCount);

    // for present and absent letters
    for (let c = 0; c < width; c++) {
        let currentTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currentTile.innerText.toUpperCase();
        console.log(letter);

        if(!currentTile.classList.contains("correct")) {
            if(answer.includes(letter) && letterCount[letter] > 0 ) {
                currentTile.classList.add("present");
                present++;
                letterCount[letter]--;
            }
            else {
                currentTile.classList.add("absent");
                absent++;
            }
        }

    }
    
    if (correct == width) {
        gameOver = true;
        return;
    }
    
}
