var database;

var drawing = [];
var currentPath = [];
var isDrawing = false;

var AGE;
var MAX_AGE;
var CANVAS_WIDTH;
var CANVAS_HEIGHT;
var BACKGROUND_COLOR;
var X_DRAWING_NOISE;
var Y_DRAWING_NOISE;
var CLOUD_DRAWING_COLOR;
var CLOUD_DRAWING_STROKE_WEIGHT;
var X_JITTER;
var Y_JITTER;

function setup() {
    AGE = 3;
    MAX_AGE = 3;
    CANVAS_WIDTH = 600;
    CANVAS_HEIGHT = 400;
    BACKGROUND_COLOR = color(50,180,250);
    X_DRAWING_NOISE = 20;
    Y_DRAWING_NOISE = 10;
    CLOUD_DRAWING_COLOR = color(255, 255, 255, 255 * map(AGE, 0, MAX_AGE, 0.95, 0.50, true));
    CLOUD_DRAWING_STROKE_WEIGHT = map(AGE, 0, MAX_AGE, 50, 75, true);
    X_JITTER = map(AGE, 0, MAX_AGE, 0.05, 0.5, true);
    Y_JITTER = X_JITTER / 2;
    
    canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

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
    if (params.id) {
    showDrawing(params.id);
    }

    var ref = database.ref('clouds');
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
    background(BACKGROUND_COLOR);

    if (isDrawing) {
        var point = {
            x: mouseX + random(-1 * X_DRAWING_NOISE, X_DRAWING_NOISE),
            y: mouseY + random(-1 * Y_DRAWING_NOISE, Y_DRAWING_NOISE)
        };
        currentPath.push(point);
    }

    stroke(CLOUD_DRAWING_COLOR);
    strokeWeight(CLOUD_DRAWING_STROKE_WEIGHT);
    strokeJoin(ROUND);
    noFill();
    for (var i = 0; i < drawing.length; i++) {
        var path = drawing[i];
        beginShape();
        for (var j = 0; j < path.length; j++) {
            let xJitter = randomGaussian(0, X_JITTER);
            let yJitter = randomGaussian(0, Y_JITTER);
            path[j].x  =  path[j].x + xJitter
            path[j].y  =  path[j].y + yJitter
            vertex(path[j].x, path[j].y);
        }
        endShape();
    }
}

function saveDrawing() {
    var ref = database.ref('clouds');
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

  var clouds = data.val();
  var keys = Object.keys(clouds);
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

    var ref = database.ref('clouds/' + key);
    ref.once('value', oneDrawing, errData);

    function oneDrawing(data) {
        var cloud = data.val();
        drawing = cloud.drawing;
    //console.log(drawing);
    }
}

function clearDrawing() {
    drawing = [];
}