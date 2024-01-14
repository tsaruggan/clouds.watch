export default function sketch(p5) {
    var clouds = [];
    var visibleClouds = [];

    const MAX_NUM_VISIBLE = 2;
    const MAX_AGE = 3;

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
    
        p5.stroke(cloud.color);
        p5.strokeWeight(cloud.strokeWeight);
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

       drawText(cloud)
    }

    function drawText(cloud) {
        p5.push();
        p5.translate(cloud.position.x, cloud.position.y);
        p5.fill(255);
        p5.stroke(0);
        p5.strokeWeight(10);
        p5.textSize(14);
        // p5.text(cloud.name,
        //         cloud.boundingBox.width+cloud.strokeWeight/2 - p5.textWidth(cloud.name) - 5, 
        //         cloud.boundingBox.height+cloud.strokeWeight/2 + 5);
        p5.text(cloud.name,
                cloud.drawing.at(-1).at(-1).x,
                cloud.drawing.at(-1).at(-1).y);
        p5.pop();
    }

    function updateCloudPositions() {
        for (let i = 0; i < visibleClouds.length; i++) {
            visibleClouds[i].position.x = visibleClouds[i].position.x + visibleClouds[i].speed;
            if (visibleClouds[i].position.x > p5.width + visibleClouds[i].strokeWeight/2) { 
                let numChannels = clouds.length;
                visibleClouds[i].position = generateRandomInitialPosition(visibleClouds[i], numChannels);
                visibleClouds[i].speed = p5.random(0.5, 2.5);

                let channel = visibleClouds[i].channel;
                clouds[channel].unshift(visibleClouds[i]);
                visibleClouds[i] = clouds[channel].pop();
            }
        }
    }

    function getCloudDrawingColor(age) {
        return p5.color(255, 255, 255, 255 * p5.map(age, 0, 3, 0.95, 0.50, true));
    }

    function getCloudDrawingStrokeWeight(age) {
        return p5.map(age, 0, 3, 50, 75, true);
    }

    function getAge(timestamp) {
        const maxTimestamp = Date.now();
        const minTimestamp = maxTimestamp - 86400000 * MAX_AGE;
        const age = MAX_AGE - p5.map(timestamp, minTimestamp, maxTimestamp, 0, MAX_AGE, true);
        console.log(timestamp, minTimestamp, maxTimestamp)
        console.log(age);
        return age;
    }

    function getJitter(age) {
        let jitter = p5.map(age, 0, 3, 0.05, 0.5, true);
        return p5.randomGaussian(0, jitter);
    }

    function updateWithProps(props) {
        if (props.clouds) {
            let numChannels = p5.min(props.clouds.length, MAX_NUM_VISIBLE);
            for (let channel = 0; channel < numChannels; channel++) {
                clouds[channel] = [];
            }

            let channel = 0;
            for (let i = 0; i < props.clouds.length; i++) {
                let cloud = props.clouds[i];
                cloud.channel = channel;
                cloud.age = getAge(cloud.timestamp);
                cloud.strokeWeight = p5.map(cloud.age, 0, MAX_AGE, 50, 75, true);
                cloud.color = p5.color(255, 255, 255, 255 * p5.map(cloud.age, 0, MAX_AGE, 0.95, 0.50, true));
                cloud.position = generateRandomInitialPosition(cloud, numChannels);
                cloud.speed = p5.random(0.5, 2.5);
                clouds[channel].push(cloud);
                channel = (channel == numChannels-1) ? 0 : channel + 1;
            }
            console.log(clouds);

            visibleClouds = [];
            for (let channel = 0; channel < numChannels; channel++) {
                visibleClouds.push(clouds[channel].pop());
            }
            console.log(visibleClouds);

        }
    }

    function generateRandomInitialPosition(cloud, numChannels) {
        let x = -1 * cloud.boundingBox.width * (cloud.channel+1) - cloud.strokeWeight/2;
        let y = p5.random(p5.height / numChannels * cloud.channel, p5.height / numChannels * (cloud.channel+1));
        y = p5.max(10 + cloud.strokeWeight/2, p5.min(y, p5.height - 10 - cloud.boundingBox.height-cloud.strokeWeight/2));
        return {x: x, y: y};
    }

    p5.setup = setup;
    p5.windowResized = windowResized;
    p5.draw = draw;
    p5.updateWithProps = updateWithProps;
}
