// WELCOME SCREEEN
var welcomeScreen = document.querySelector(".welcome-screen");
var myButton = document.querySelector('.btn');
var myInput1 = document.getElementById('myInput1');
var myInput2 = document.getElementById('myInput2');
var myUl1 = document.getElementById('ulOne');
var myUl2 = document.getElementById('ulTwo');

myButton.addEventListener('click', function(){
  var liOne = document.createElement('li');
  var liTwo = document.createElement('li');
  liOne.textContent = myInput1.value;
  liTwo.textContent = myInput2.value;
  myUl1.appendChild(liOne);
  myUl2.appendChild(liTwo);
  welcomeScreen.classList.add("welcome-screen-hide");
});

// TIMER
function printDuration() {
  var cnt = 0;
  setInterval(function () {
    cnt += 1;
    document.getElementById("timer").innerHTML = cnt + " seconds";
  }, 1000);
}

// LAST SCREEEN
var lastScreenHide = document.querySelector(".last-screen-hide");
var lastButton = document.querySelector('.btn-last');

lastButton.addEventListener('click', function(){
  lastScreenHide.classList.add("last-screen");
});

function resetGame() {
  window.location.reload();
}
var resetBtn = document.querySelector('.reset-btn');
resetBtn.addEventListener('click', resetGame);