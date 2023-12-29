var database;

var drawing = [];
var currentPath = [];
var isDrawing = false;

function setup() {
  canvas = createCanvas(600, 400);

  canvas.mousePressed(startPath);
  canvas.parent('canvascontainer');
  canvas.mouseReleased(endPath);

  var saveButton = select('#saveButton');
  saveButton.mousePressed(saveDrawing);

  var clearButton = select('#clearButton');
  clearButton.mousePressed(clearDrawing);

  var config = {
    apiKey: '%FIREBASE_API_KEY%',
    authDomain: "clouds-watch.firebaseapp.com",
    projectId: "clouds-watch",
    databaseURL: 'https://clouds-watch-default-rtdb.firebaseio.com/',
    storageBucket: "clouds-watch.appspot.com",
    messagingSenderId: "613527026195",
    appId: "1:613527026195:web:918ec1d042432cc6bb9de6"
  };
  firebase.initializeApp(config);
  database = firebase.database();

  var params = getURLParams();
  console.log(params);
  if (params.id) {
    console.log(params.id);
    showDrawing(params.id);
  }

  var ref = database.ref('drawings');
  ref.on('value', gotData, errData);
}

function startPath() {
  isDrawing = true;
  currentPath = [];
  drawing.push(currentPath);
}

function endPath() {
  isDrawing = false;
}

function draw() {
    background(50,180,250);

  if (isDrawing) {
    let xNoise = random(-20, 20);
    let yNoise = random(-10, 10);
    var point = {
      x: mouseX + xNoise,
      y: mouseY + yNoise
    };
    currentPath.push(point);
  }

  stroke(255, 255, 255, 255*0.95);
  strokeWeight(50);
  strokeJoin(ROUND);
  noFill();
  for (var i = 0; i < drawing.length; i++) {
    var path = drawing[i];
    beginShape();
    for (var j = 0; j < path.length; j++) {
    let xNoise = random(-0.8, 0.8);
    let yNoise = random(-0.5, 0.5);
      vertex(path[j].x + xNoise, path[j].y + yNoise);
    }
    endShape();
  }
}

function saveDrawing() {
  var ref = database.ref('drawings');
  var data = {
    name: 'Dan',
    drawing: drawing
  };
  var result = ref.push(data, dataSent);
  console.log(result.key);

  function dataSent(err, status) {
    console.log(status);
  }
}

function gotData(data) {
  // clear the listing
  var elts = selectAll('.listing');
  for (var i = 0; i < elts.length; i++) {
    elts[i].remove();
  }

  var drawings = data.val();
  var keys = Object.keys(drawings);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    //console.log(key);
    var li = createElement('li', '');
    li.class('listing');
    var ahref = createA('#', key);
    ahref.mousePressed(showDrawing);
    ahref.parent(li);

    var perma = createA('?id=' + key, 'permalink');
    perma.parent(li);
    perma.style('padding', '4px');

    li.parent('drawinglist');
  }
}

function errData(err) {
  console.log(err);
}

function showDrawing(key) {
  //console.log(arguments);
  if (key instanceof MouseEvent) {
    key = this.html();
  }

  var ref = database.ref('drawings/' + key);
  ref.once('value', oneDrawing, errData);

  function oneDrawing(data) {
    var dbdrawing = data.val();
    drawing = dbdrawing.drawing;
    //console.log(drawing);
  }
}

function clearDrawing() {
  drawing = [];
}