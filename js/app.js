var height = 6;
var width = 5;
var maxGuesses = 6;
//var answer = "";
var guesses = [];

var row = 0;
var col = 0;

var gameOver = false;
//var answer = "tests";
var answer = "tests";
answer = answer.toUpperCase();

window.onload = function() {
    fetch('data/words.txt') //source: https://www.rockpapershotgun.com/wordle-past-answers
        .then(response => response.text())
        .then(data => {
            const wordList = data.split(' ')
                .map(word => word.trim().toUpperCase())
                .filter(word => word.length === width);
            answer = wordList[Math.floor(Math.random() * wordList.length)];
            init(); 
        })
        .catch(error => console.error('Error loading word list:', error));
}

function init() {
    console.log("answer : ", answer);
    document.getElementById("newWordle").style.display = "none";
    document.getElementById("newWordle").addEventListener("click", function() {
        location.reload(); 
    });
    // game board
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

    // keyboard
    let keyboard = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫"]
    ]
    for (i = 0; i < keyboard.length; i++) {
        let currentRow = keyboard[i];
        let kbRow = document.createElement("div");
        kbRow.classList.add("kb-row");

        for (j = 0; j < currentRow.length; j++) {
            let key = currentRow[j];
            let keyTile = document.createElement("div");
            keyTile.innerText = key;

            if (key == "Enter") {
                keyTile.classList.add("enter-tile");
                keyTile.id = "Enter";
            }
            else if (key == "⌫") {
                keyTile.classList.add("backspace-tile");
                keyTile.id = "Backspace";
            }
            else if (key >= 'A' && key <= 'Z') {
                keyTile.classList.add("key-tile");
                keyTile.id = "key-" + key;
            }
            kbRow.appendChild(keyTile);
        }
        document.getElementById("keyboard").appendChild(kbRow);
    } 


    // event listener
    document.addEventListener("keyup", (ev) => {
        if (gameOver) {
            document.getElementById("newWordle").style.display = "flex";
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
            document.getElementById("newWordle").style.display = "flex";
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
        let currKeyTile = document.getElementById("key-" + letter);
        console.log("letter : ", letter);

        if (letter == answer[c]) {
            currentTile.classList.remove("present");
            currentTile.classList.add("correct");
            currKeyTile.classList.remove("key-present");
            currKeyTile.classList.add("key-correct");
            correct++;
            letterCount[letter]--;
        }
    }

    console.log("letterCount : ", letterCount);

    // for present and absent letters
    for (let c = 0; c < width; c++) {
        let currentTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currentTile.innerText.toUpperCase();
        let currKeyTile = document.getElementById("key-" + letter);
        console.log("letter : ", letter);

        if(!currentTile.classList.contains("correct")) {
            if(answer.includes(letter) && letterCount[letter] > 0 ) {
                currentTile.classList.add("present");
                if(!currKeyTile.classList.contains("key-correct")) {
                    currKeyTile.classList.add("key-present");
                }
                present++;
                letterCount[letter]--;
            }
            else {
                if(!currKeyTile.classList.contains("key-correct") && !currKeyTile.classList.contains("key-present")) {
                    currKeyTile.classList.add("key-absent");
                }
                currentTile.classList.add("absent");
                absent++;
            }
        }

    }
    if (correct == width) {
        document.getElementById("newWordle").style.display = "flex";
        gameOver = true;
        return;
    }
};

