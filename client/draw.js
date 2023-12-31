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
    AGE = 0.5;
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

    drawBoundingBox();
}

function drawBoundingBox() {
    if (drawing.length === 0) {
        return;
    }

    let minX = width;
    let minY = height;
    let maxX = 0;
    let maxY = 0;

    for (let path of drawing) {
        for (let point of path) {
            let x = point.x;
            let y = point.y;
            minX = min(minX, x);
            minY = min(minY, y);
            maxX = max(maxX, x);
            maxY = max(maxY, y);
        }
    }
    noFill();
    stroke(255, 0, 0);
    strokeWeight(1);
 
    let boxWidth = maxX - minX;
    let boxHeight = maxY - minY;
    rect(minX - CLOUD_DRAWING_STROKE_WEIGHT/2, 
        minY - CLOUD_DRAWING_STROKE_WEIGHT/2, 
        boxWidth + CLOUD_DRAWING_STROKE_WEIGHT, 
        boxHeight + CLOUD_DRAWING_STROKE_WEIGHT);
}

function saveDrawing() {
    let minX = width;
    let minY = height;
    let maxX = 0;
    let maxY = 0;
    for (var i = 0; i < drawing.length; i++) {
        let path = drawing[i];
        for (var j = 0; j < path.length; j++) {
            let point = path[j];
            let x = point.x;
            let y = point.y;
            minX = min(minX, x);
            minY = min(minY, y);
            maxX = max(maxX, x);
            maxY = max(maxY, y);
        }
    }
    let boxWidth = maxX - minX;
    let boxHeight = maxY - minY;

    let drawingCopy = _.cloneDeep(drawing);
    for (var i = 0; i < drawingCopy.length; i++) {
        var path = drawingCopy[i];
        for (var j = 0; j < path.length; j++) {
            let point = path[j];
            let x = point.x;
            let y = point.y;
            path[j].x  =  x - minX;
            path[j].y  =  y - minY;
        }
    }
    
    var data = {
        name: "Saru",
        drawing: drawingCopy,
        boundingBox: {width: boxWidth, height: boxHeight}
    };
    console.log(data);

    var ref = database.ref('clouds');
    ref.push(data);
}

function clearDrawing() {
    drawing = [];
}