var database;

var drawing = [];

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
var clouds;
var v_x = 0.5;
var v_y = 0;

function setup() {
    AGE = 0.5;
    MAX_AGE = 3;
    CANVAS_WIDTH = windowWidth;
    CANVAS_HEIGHT = windowHeight;
    BACKGROUND_COLOR = color(50,180,250);
    X_DRAWING_NOISE = 20;
    Y_DRAWING_NOISE = 10;
    CLOUD_DRAWING_COLOR = color(255, 255, 255, 255 * map(AGE, 0, MAX_AGE, 0.95, 0.50, true));
    CLOUD_DRAWING_STROKE_WEIGHT = map(AGE, 0, MAX_AGE, 50, 75, true);
    X_JITTER = map(AGE, 0, MAX_AGE, 0.05, 0.5, true);
    Y_JITTER = X_JITTER / 2;
    
    canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent('canvascontainer');

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
    ref.on('value', (data) => {
        const firebaseData = data.val();
        clouds = Object.keys(firebaseData).map(key => {
            const cloud = firebaseData[key];
            return {name: cloud.name, drawing: cloud.drawing} 
        });
        console.log(clouds[0]);
        drawing = clouds[0].drawing;
    }, (err) => {
        console.log(err);
    }); 
}

function draw() {
    background(BACKGROUND_COLOR);
    drawCloud(drawing, 1, 0.1)
}

function drawCloud(cloudDrawing, v_x, v_y) {
    stroke(CLOUD_DRAWING_COLOR);
    strokeWeight(CLOUD_DRAWING_STROKE_WEIGHT);
    strokeJoin(ROUND);
    noFill();
    for (var i = 0; i < cloudDrawing.length; i++) {
        var path = cloudDrawing[i];
        push()
        beginShape();
        translate(-300, 100)
        for (var j = 0; j < path.length; j++) {
            let xJitter = randomGaussian(0, X_JITTER);
            let yJitter = randomGaussian(0, Y_JITTER);
            path[j].x  =  path[j].x + xJitter + v_x
            path[j].y  =  path[j].y + yJitter + v_y
            vertex(path[j].x, path[j].y);
        }
        endShape();
        pop()
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
 }