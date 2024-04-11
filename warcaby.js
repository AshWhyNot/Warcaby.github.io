// create board
function createBoard() {
    var board = document.getElementById("board");
  
    var z = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
    var g = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (var y = 0; y < 10; y++) {
      var row = document.createElement("div");
      row.className = "row";
      board.appendChild(row);
  
  
      for (var x = 0; x < 10; x++) {
        var cell = document.createElement("div");
        cell.id = x.toFixed() + y.toString();
        if ((x + y) % 2) {
          cell.className = "black";
          cell.innerText = g[x] + z[y];
        }
        else {
          cell.className = "white";
          cell.innerText = g[x] + z[y];
        }
  
  // adding pawns
        if ((x + y) % 2 != 0 && y != 4 && y != 5) {
          var img = document.createElement("img");
          if (y < 5) {
            img.id = "w" + cell.id;
            img.src = "Picsart_24-04-11_16-12-53-338.png";
          }
          else {
            img.id = "b" + cell.id;
            img.src = "Picsart_24-04-11_14-04-35-663.png";
          }
          img.className = "pawn";
          img.setAttribute("move", "true");
          cell.appendChild(img);
        }
        cell.setAttribute("move", "false");
        row.appendChild(cell);
      }
    }
  }
  
  function canDrop() {
  
  
    var cells = document.querySelectorAll('.black');
    var i = 0;
    while (i < cells.length) {
      var c = cells[i++];
      // Add the event listeners
      c.addEventListener('dragover', dragOver, false);
      c.addEventListener('drop', drop, false);
      c.addEventListener('dragenter', dragEnter, false);
      c.addEventListener('dragleave', dragLeave, false);
    }
  
    i = 0;
    var pawns = document.querySelectorAll('img');
    while (i < pawns.length) {
      var p = pawns[i++];
      p.addEventListener('dragstart', dragStart, false);
      p.addEventListener('dragend', dragEnd, false);
    }
  }
  
  createBoard();
  canDrop();
  
  function dragOver(e) {
    e.preventDefault();
    // Get the img pawn which is being dragged
    var dragID = e.dataTransfer.getData("text");
    var dragPawn = document.getElementById(dragID);
  
    if (dragPawn) {
      if (e.target.tagName === "DIV" &&
        isValidMove(dragPawn, e.target, false)) {
        e.dataTransfer.dropEffect = "move";
      }
      else {
        e.dataTransfer.dropEffect = "none";
      }
    }
  }
  
  function dragStart(e) {
    if (e.target.draggable) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text", e.target.id);
      e.target.classList.add("selected");
    }
  }
  
  function dragEnd(e) {
    e.target.classList.remove("selected");
  }
  
  function drop(e) {
    e.stopPropagation();
    e.preventDefault();
  
    var droppedID = e.dataTransfer.getData("text");
    var droppedPawn = document.getElementById(droppedID);
  
    if (droppedPawn &&
      e.target.tagName === "DIV" &&
      isValidMove(droppedPawn, e.target, true)) {
  
      var newPawn = document.createElement("img");
      newPawn.src = droppedPawn.src;
      newPawn.id = droppedPawn.id.substr(0, 1) + e.target.id;
      newPawn.draggable = droppedPawn.draggable;
  
      if (droppedPawn.draggable) {
        newPawn.classList.add("jumpOnly");
      }
      newPawn.classList.add("pawn");
  
      newPawn.addEventListener("dragstart", dragStart, false);
      newPawn.addEventListener("dragend", dragEnd, false);
      e.target.appendChild(newPawn);
  
      // Remove the previous image
      droppedPawn.parentNode.removeChild(droppedPawn);
  
      king(newPawn);
    }
  }
  
  function dragEnter(e) {
    var dragID = e.dataTransfer.getData("text");
    var dragPawn = document.getElementById(dragID);
  
    if (dragPawn &&
      e.target.tagName === "DIV" &&
      isValidMove(dragPawn, e.target, false)) {
      e.target.classList.add('drop');
    }
  }
  
  function dragLeave(e) {
    e.target.classList.remove("drop");
  }
  
  var pointOne = 0;
  var pointTwo = 0;
  
  function isValidMove(source, target, drop, pawn) {
    var startPos = source.id.substr(1, 2);
    var prefix = source.id.substr(0, 1);
    var endPos = target.id;
    if (endPos.length > 2) {
      endPos = endPos.substr(1, 2);
    }
    // Drop pawn only on free cell
    if (target.childElementCount != 0) {
      return false;
    }
  
    var jumpOnly = false;
    if (source.classList.contains("jumpOnly")) {
      jumpOnly = true;
    }
    // Position x and y
    var xStart = parseInt(startPos.substr(0, 1));
    var yStart = parseInt(startPos.substr(1, 1));
    var xEnd = parseInt(endPos.substr(0, 1));
    var yEnd = parseInt(endPos.substr(1, 1));
  // Pawns can't move backwards
    switch (prefix) {
      case "w":
        if (yEnd <= yStart)
          return false;
        break;
  
      case "b":
        if (yEnd >= yStart)
          return false;
        break;
    }
    // Move must be diagonal
    if (yStart === yEnd || xStart === xEnd)
      return false;
    if (Math.abs(yEnd - yStart) > 2 || Math.abs(xEnd - xStart) > 2)
      return false;
  
    if (Math.abs(xEnd - xStart) === 1 && jumpOnly)
      return false;
  //Player can't delete pawn of the same color
    var jumped = false;
    var pointContainerOne = document.getElementById('pointOne');
    var pointContainerTwo = document.getElementById('pointTwo');
    if (Math.abs(xEnd - xStart) === 2) {
      var pos = ((xStart + xEnd) / 2).toString() +
        ((yStart + yEnd) / 2).toString();
      var div = document.getElementById(pos);
      var img = div.children[0];
      if (img.id.substr(0, 1).toLowerCase() === prefix.toLowerCase())
        return false;
  
      if (drop) {
        div.removeChild(img);
        pointOne = pointOne + 1;
        pointTwo = pointTwo + 1;
        pointContainerOne.textContent = pointOne + ' points';
        pointContainerTwo.textContent = pointTwo + ' points';
        jumped = true;
      }
  
    }
  
    if (drop) {
      enableNextPlayer(source);
      if (jumped) {
        source.draggable = true;
        source.classList.add("jumpOnly");
      }
    }
    return true;
  }
  
  function king(pawn){
  if (pawn.id.substr(0, 1) === "W" || pawn.id.substr(0, 1) === "B")
    return;
  
    var newPawn;
    // White King
    if (pawn.id.substr(0, 1) === "w" && pawn.id.substr(2, 1) === "9") {
      newPawn = document.createElement("img");
      newPawn.src = "Picsart_24-04-11_14-07-26-900.png";
      newPawn.id = "W" + pawn.id.substr(1, 2);
    }
  
    // Black King
    if (pawn.id.substr(0, 1) === "b" && pawn.id.substr(2, 1) === "0") {
      var newPawn = document.createElement("img");
      newPawn.src = "Picsart_24-04-11_14-05-47-290.png";
      newPawn.id = "B" + pawn.id.substr(1, 2);
    }
  
    // Set properties to new pawn
    if (newPawn) {
      newPawn.draggable = true;
      newPawn.classList.add("pawn");
      newPawn.addEventListener('dragstart', dragStart, false);
      newPawn.addEventListener('dragend', dragEnd, false);
      var parent = pawn.parentNode;
      parent.removeChild(pawn);
      parent.appendChild(newPawn);
    }
  }
  
  function enableNextPlayer(pawn) {
    var pawns = document.querySelectorAll('img');
    var i = 0;
    while (i < pawns.length) {
      var p = pawns[i++];
      if (p.id.substr(0, 1).toUpperCase() ===
        pawn.id.substr(0, 1).toUpperCase()) {
        p.draggable = false;
      }
      else {
        p.draggable = true;
      }
      p.classList.remove("jumpOnly");
    }
  }
