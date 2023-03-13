window.addEventListener("load", () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

// Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

// Create an array to store the confetti particles
    const confetti = [];

// Function to create a confetti particle
    function createConfetti() {
        // Generate random values for the confetti particle
        const size = Math.random() * 10 + 8;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height / 2;
        const angle = Math.random() * Math.PI / 1.2;
        const speed = Math.random() * 3 + 1;
        const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;

        // Add the confetti particle to the array
        confetti.push({ size, x, y, angle, speed, color });
    }

// Function to draw a confetti particle
    function drawConfetti(particle) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
    }

// Function to update the confetti particles
    function updateConfetti() {
        // Create new confetti particles at a random interval
        if (Math.random() > 0.9) {
            createConfetti();
        }

        // Loop through the confetti particles and update their position and angle
        for (let i = 0; i < confetti.length; i++) {
            const particle = confetti[i];

            // Update the position based on the angle and speed
            particle.x += Math.cos(particle.angle) * particle.speed;
            particle.y += Math.sin(particle.angle) * particle.speed;

            // Add gravity to the particle's speed
            particle.speed += 0.2;

            // Remove the particle if it goes off the screen
            if (particle.y > canvas.height) {
                confetti.splice(i, 1);
                i--;
            }
        }
    }

// Function to animate the confetti particles
    function animateConfetti() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw the confetti particles
        updateConfetti();
        confetti.forEach(drawConfetti);

        // Call the function again to create an animation loop
        requestAnimationFrame(animateConfetti);
    }
    /////// INIT //////
    console.log("display.js loaded");
    //the row size CSS for boxes is NOT dynamic, so if you want to change these values you'll have to change that too
    var columns = 6; //determines the number of boxes on the screen, should be equal to word length
    var rows = 6; //determines the number of rows on screen
    var $boxes = []; //stores the CSS id of every box

    //box class
    //the CSS ID of each individual box is two numbers, the first the row and the second for the column
    class Box {
        constructor(row, column){
            //row and column are 0 indexed
            this.row = row;
            this.column = column;
            this.ID = ""+this.row+this.column;
            this.toHtml = "<div class='box' id='box"+this.ID+"'></div>"
        }
    }
    function addBoxes(){
        var newBox;
        for (i = 0; i < rows*columns; i++){
            newBox = new Box(Math.trunc(i/6), (i % 6)); //create box variable
            $( "#table" ).append(newBox.toHtml); //add box to the actual HTML table
            $boxes.push(newBox); //add each box to the larger box array
        }
        console.log("Created boxes." );
    }

    //Adds the given string to the given box, only named addCharacter because of functionality
    // boxID: int in the [xy] format, where x is the row and y is the column
    function addCharacter(boxID, string) {
        $("#box"+boxID.toString()).append("<p>"+string+"</p>");
    }

    //changes the color of the given box
    // boxID: in [xy] format
    //color: hex value
    function changeColor(boxID, color){
        $("#box"+boxID).css("background-color", color);
    }
    //actual code
    addBoxes();
    function dispTextSet() {
        ctx.font = "50px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillRect(canvas.width / 2 - 200, canvas.height / 2 - 67, 400, 100)
        ctx.fillStyle = "black";
    }
    function compareWord(word, userWord, row) {
        for (i = 0; i < word.length; i++) {
            if (word.slice(i, i+1) === userWord.slice(i, i+1)) {
                changeColor(row.toString()+(i.toString()), "#05ab05")
            } else if (word.includes(userWord.slice(i, i+1))) {
                changeColor(row.toString()+(i.toString()), "#FFFF00")
            } else {
                changeColor(row.toString()+(i.toString()), "#FF0000")
            }
        }
    }
    function clearRow(row) {
        for (i = 0; i < columns; i++) {
            $("#box" + row + i).empty();
        }
    }
    function dispOut(word, row) {
        clearRow(row);
        for (i = 0; i < word.length; i++) {
            addCharacter(row.toString()+(i.toString()), word.substring(i,i+1));
        }
    }

    function check() {
        if (!(lost)) {
            if (userInput.length !== 6) {
                dispTextSet()
                ctx.fillText("Not 6 letters", canvas.width / 2, canvas.height / 2);
            } else if (!(words.includes(userInput.toLowerCase()))) {
                dispTextSet()
                ctx.fillText("Not in word list", canvas.width / 2, canvas.height / 2);
            } else if (userInput === wordleWord) {
                compareWord(wordleWord, userInput, row)
                animateConfetti()
            } else {
                compareWord(wordleWord, userInput, row)
                row++;
                userInput = "";
                if (row === 6) {
                    dispTextSet()
                    ctx.fillText("You Lost :(", canvas.width / 2, canvas.height / 2);
                    lost = true;
                }
            }
        }
    }

    // parses the json and converts into array. Used to check if user input is a real word
    let request = new XMLHttpRequest();
    request.open("GET", "./dictionary.json", false);
    request.send(null)
    let words = Object.keys(JSON.parse(request.responseText));
    // same but for the json that contains the words the game will use as the word to guess. Smaller list with only common words
    request = new XMLHttpRequest();
    request.open("GET", "./dictionaryUsedWords.json", false);
    request.send(null)
    let wordsUsed = Object.keys(JSON.parse(request.responseText));
    // gets a random word from the array
    let wordleWord = wordsUsed[Math.floor(Math.floor(Math.random()*wordsUsed.length))].toUpperCase();
    let userInput = "";
    let row = 0;
    let darkMode = false;
    let lost = false;
    console.log(wordleWord);
    // checks when key pressed, filters input, and modifies userinput
    window.addEventListener("keydown", function (event) {
        if (((userInput.length < 6) && event.key.match(/^[A-Za-z]+$/)) && event.key.length === 1) {
            userInput += event.key.toUpperCase();
            dispOut(userInput, row);
        } else if (event.key === "Backspace") {
            if (!(lost)) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                userInput = userInput.substring(0, userInput.length - 1);
            }
            dispOut(userInput, row);
        } else if (event.key === "Enter") {
            check();
        }
    }, true);
    //checks user word
    document.getElementById('button').onclick = function() {
        check();
    };

    document.getElementById('darkmode').onclick = function () {
        console.log("changing color")
        if (darkMode) {
            $("body").css("background-color", "#ffffff");
            $("button").css("background-color", "#383838");
            $("#desc").css("color", "#000000");
            $("h1").css("color", "#000000");
            $("h2").css("color", "#000000");
            $("h3").css("color", "#000000");
            darkMode = false;
        } else {
            $("body").css("background-color", "#1e1e1e");
            $("button").css("background-color", "#eaeaea");
            $("button").css("color", "#000000");
            $("#desc").css("color", "#ffffff");
            $("h1").css("color", "#ffffff");
            $("h2").css("color", "#ffffff");
            $("h3").css("color", "#ffffff");
            darkMode = true;
        }
    }
});

