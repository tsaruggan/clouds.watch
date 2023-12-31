var database;

var clouds;

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

function setup() {
    AGE = 0;
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
            const position = {x: random(width), y: random(height)}
            return {name: cloud.name, drawing: cloud.drawing, boundingBox: cloud.boundingBox, position: position, speed: random(1, 2)} 
        });
        console.log(clouds);
        // console.log(clouds[0]);
        // drawing = clouds[0].drawing;
        // cloud = clouds[0];
    }, (err) => {
        console.log(err);
    }); 
}

function draw() {
    background(BACKGROUND_COLOR);
    if (clouds !== undefined) {
        for (let cloud of clouds) {
            drawCloud(cloud)
        }
    }
}

function drawCloud(cloud) {
    if (cloud == undefined) {
        return;
    }

    stroke(CLOUD_DRAWING_COLOR);
    strokeWeight(CLOUD_DRAWING_STROKE_WEIGHT);
    strokeJoin(ROUND);
    noFill();

    // let initialX = -1 * cloud.boundingBox.width;
    // let initialY = height/2 - cloud.boundingBox.height/2;

    for (var i = 0; i < cloud.drawing.length; i++) {
        var path = cloud.drawing[i];
        push()
        beginShape();
        translate(cloud.position.x, cloud.position.y);
        for (var j = 0; j < path.length; j++) {
            let xJitter = randomGaussian(0, X_JITTER);
            let yJitter = randomGaussian(0, Y_JITTER);
            path[j].x  =  path[j].x + xJitter
            path[j].y  =  path[j].y + yJitter
            vertex(path[j].x, path[j].y);
        }
        endShape();
        pop()
    }

    cloud.position.x = cloud.position.x + cloud.speed;
    if (cloud.position.x > width + CLOUD_DRAWING_STROKE_WEIGHT/2) {
        cloud.position.x = -1 * cloud.boundingBox.width - CLOUD_DRAWING_STROKE_WEIGHT/2;
        cloud.position.y = random(height);
        cloud.speed = random(1, 2);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
 }