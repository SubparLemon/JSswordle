window.addEventListener("load", (event) => {
/////// INIT //////

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
    // the onkeydown funtion limits the range of possible inputs, the oninput function ensures that the input is capitalized
    this.toHtml = "<input class='box' onkeydown='return /[a-zA-Z]/i.test(event.key)' oninput='let p=this.selectionStart;this.value=this.value.toUpperCase();this.setSelectionRange(p, p);' id='box"+this.ID+"'></div>"
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
function addCharacter(boxID, string){
  $("#box"+boxID).append("<p>"+string+"</p>");
}
//changes the color of the given box
// boxID: in in [xy] format
//color: hex value
function changeColor(boxID, color){
  $("#box"+boxID).css("background-color", "#"+color);
}
function processInput(){
  if ((this.value.length) == 0){
    	$(this).prev('.box').focus();
    } else if (this.value.length == 1) {
      $(this).next('.box').focus();
    }
  
}
//actual code 
  addBoxes();
  $(".box").keydown(processInput);
  $(".box").oninput()
});
