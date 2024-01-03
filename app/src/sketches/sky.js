export default function sketch(p5) {
    var clouds = [];

    var AGE;
    var MAX_AGE;
    var BACKGROUND_COLOR;
    var CLOUD_DRAWING_COLOR;
    var CLOUD_DRAWING_STROKE_WEIGHT;
    var X_JITTER;
    var Y_JITTER;

    function setup() {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);

        AGE = 0;
        MAX_AGE = 3;
        BACKGROUND_COLOR = p5.color(50,180,250);
        CLOUD_DRAWING_COLOR = p5.color(255, 255, 255, 255 * p5.map(AGE, 0, MAX_AGE, 0.95, 0.50, true));
        CLOUD_DRAWING_STROKE_WEIGHT = p5.map(AGE, 0, MAX_AGE, 50, 75, true);
        X_JITTER = p5.map(AGE, 0, MAX_AGE, 0.05, 0.5, true);
        Y_JITTER = X_JITTER / 2;
    }

    function windowResized() {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    }

    function draw() {
        p5.background(BACKGROUND_COLOR);
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
    
        p5.stroke(CLOUD_DRAWING_COLOR);
        p5.strokeWeight(CLOUD_DRAWING_STROKE_WEIGHT);
        p5.strokeJoin(p5.ROUND);
        p5.noFill();
    
        for (var i = 0; i < cloud.drawing.length; i++) {
            var path = cloud.drawing[i];
            p5.push()
            p5.beginShape();
            p5.translate(cloud.position.x, cloud.position.y);
            for (var j = 0; j < path.length; j++) {
                let xJitter = p5.randomGaussian(0, X_JITTER);
                let yJitter = p5.randomGaussian(0, Y_JITTER);
                path[j].x  =  path[j].x + xJitter
                path[j].y  =  path[j].y + yJitter
                p5.vertex(path[j].x, path[j].y);
            }
            p5.endShape();
            p5.pop()
        }
    
        cloud.position.x = cloud.position.x + cloud.speed;
        if (cloud.position.x > p5.width + CLOUD_DRAWING_STROKE_WEIGHT/2) {
            cloud.position.x = -1 * cloud.boundingBox.width - CLOUD_DRAWING_STROKE_WEIGHT/2;
            cloud.position.y = p5.random(p5.height);
            cloud.speed = p5.random(1, 2);
        }
    }

    function updateWithProps(props) {
        if (props.clouds) {
            clouds = props.clouds;

            for (let i = 0; i < clouds.length; i++) {
                clouds[i].position = {x: p5.random(p5.width), y: p5.random(p5.height)};
                clouds[i].speed = p5.random(1, 2);
            }
        }
    }

    p5.setup = setup;
    p5.windowResized = windowResized;
    p5.draw = draw;
    p5.updateWithProps = updateWithProps;
}
