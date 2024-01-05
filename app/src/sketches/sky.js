export default function sketch(p5) {
    var clouds = [];
    var visibleClouds = []; 

    function setup() {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
    }

    function windowResized() {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    }

    function draw() {
        p5.background(50,180,250);
        drawClouds();
        updateCloudPositions();
        updateVisibleClouds();
    }

    function drawClouds() {
        for (let cloud of visibleClouds) {
            drawCloud(cloud);
        }
    }

    function drawCloud(cloud) {
        if (cloud == undefined) {
            return;
        }
    
        let strokeWeight = getCloudDrawingStrokeWeight(cloud.age);
        p5.stroke(getCloudDrawingColor(cloud.age));
        p5.strokeWeight(strokeWeight);
        p5.strokeJoin(p5.ROUND);
        p5.noFill();
    
        for (var i = 0; i < cloud.drawing.length; i++) {
            var path = cloud.drawing[i];
            p5.push()
            p5.beginShape();
            p5.translate(cloud.position.x, cloud.position.y);
            for (var j = 0; j < path.length; j++) {
                let jitter = getJitter(cloud.age);
                path[j].x  =  path[j].x + jitter
                path[j].y  =  path[j].y + jitter/2;
                p5.vertex(path[j].x + jitter, path[j].y);
            }
            p5.endShape();
            p5.pop()
        }

        p5.push();
        p5.translate(cloud.position.x, cloud.position.y);
        p5.fill(255);
        p5.stroke(0);
        p5.strokeWeight(10);
        p5.textSize(14);
        p5.text(cloud.name, cloud.boundingBox.width+strokeWeight/2 -p5.textWidth(cloud.name) - 5, cloud.boundingBox.height+strokeWeight/2 + 5);
        p5.pop();
    }

    function updateCloudPositions() {
        for (let i = 0; i < visibleClouds.length; i++) {
            let strokeWeight = getCloudDrawingStrokeWeight(visibleClouds[i].age);
            visibleClouds[i].position.x = visibleClouds[i].position.x + visibleClouds[i].speed;
            if (visibleClouds[i].position.x > p5.width + strokeWeight/2) { 
                visibleClouds[i].position.x = -1 * visibleClouds[i].boundingBox.width - strokeWeight/2 - visibleClouds[i].boundingBox.width*i;
                visibleClouds[i].position.y = p5.random(0 + strokeWeight/2 + 25, p5.height - visibleClouds[i].boundingBox.height - strokeWeight/2 - 25);
                visibleClouds[i].speed = p5.random(0.5, 2.5);
                clouds.unshift(visibleClouds[i]);
                visibleClouds.splice(i, 1);
                i--;
            }
        }
    }

    function updateVisibleClouds() {
        while (visibleClouds.length < 4) {
            if (clouds.length != 0) {
                visibleClouds.push(clouds.pop());
            }
        }
    }

    function getCloudDrawingColor(age) {
        return p5.color(255, 255, 255, 255 * p5.map(age, 0, 3, 0.95, 0.50, true));
    }

    function getCloudDrawingStrokeWeight(age) {
        return p5.map(age, 0, 3, 50, 75, true);
    }

    function getJitter(age) {
        let jitter = p5.map(age, 0, 3, 0.05, 0.5, true);
        return p5.randomGaussian(0, jitter);
    }

    function shuffle(array) {
        let currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle.
        while (currentIndex > 0) {
      
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
    }

    function updateWithProps(props) {
        if (props.clouds) {
            clouds = props.clouds;

            for (let i = 0; i < clouds.length; i++) {
                let strokeWeight = getCloudDrawingStrokeWeight(clouds[i].age);
                clouds[i].position = {
                    x: -1 * clouds[i].boundingBox.width - strokeWeight/2 - clouds[i].boundingBox.width * i,
                    y: p5.random(0 + strokeWeight/2 + 25, p5.height - clouds[i].boundingBox.height - strokeWeight/2 - 25)
                };
                clouds[i].speed = p5.random(0.5, 2.5);
            }
            shuffle(clouds);
        }
    }

    p5.setup = setup;
    p5.windowResized = windowResized;
    p5.draw = draw;
    p5.updateWithProps = updateWithProps;
}
 