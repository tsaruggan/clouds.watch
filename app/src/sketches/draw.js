import { cloneDeep } from "lodash";

export default function sketch(p5) {
    let drawing = [];
    let currentPath = [];
    let isDrawing = false;
    let updateDrawing = undefined;

    function setup() {
        let canvas = p5.createCanvas(640, 420);
        canvas.mousePressed(startPath);
        canvas.mouseReleased(endPath);
    }

    function draw() {
        p5.background(50, 180, 250);
        drawBorder();

        if (isDrawing) {
            let point = {
                x: p5.mouseX + p5.random(-20, 20),
                y: p5.mouseY + p5.random(-10, 10)
            };
            currentPath.push(point);
        }

        p5.stroke(255, 255, 255, 255*0.9);
        p5.strokeWeight(50);
        p5.strokeJoin(p5.ROUND);
        p5.noFill();
        for (let i = 0; i < drawing.length; i++) {
            let path = drawing[i];
            p5.beginShape();
            for (let j = 0; j < path.length; j++) {
                path[j].x  =  path[j].x + p5.randomGaussian(0, 0.05);
                path[j].y  =  path[j].y + p5.randomGaussian(0, 0.025);
                p5.vertex(path[j].x, path[j].y);
            }
            p5.endShape();
        }
        drawBoundingBox();
    }

    function drawBorder() {
        p5.noFill();
        p5.stroke(255);
        p5.strokeWeight(4);
        p5.rect(0, 0, 640, 420, 8);

    }

    function drawBoundingBox() {
        if (drawing.length === 0) {
            return;
        }
    
        let minX = p5.width;
        let minY = p5.height;
        let maxX = 0;
        let maxY = 0;
    
        for (let path of drawing) {
            for (let point of path) {
                let x = point.x;
                let y = point.y;
                minX = p5.min(minX, x);
                minY = p5.min(minY, y);
                maxX = p5.max(maxX, x);
                maxY = p5.max(maxY, y);
            }
        }

        p5.noFill();
        p5.stroke(255, 0, 0);
        p5.strokeWeight(1);
        let boxWidth = maxX - minX;
        let boxHeight = maxY - minY;
        p5.rect(minX - 50/2, 
            minY - 50/2, 
            boxWidth + 50, 
            boxHeight + 50);
    }

    function updateWithProps(props) {
        if (props.drawing) {
            drawing = cloneDeep(props.drawing);
        }

        if (props.updateDrawing) {
            updateDrawing = props.updateDrawing;
        }
    }

    function startPath() {
        isDrawing = true;
        currentPath = [];

        drawing.push(currentPath);
    }

    function endPath() {
        isDrawing = false;
        console.log("current path", currentPath)
        updateDrawing(currentPath);
    }

    p5.setup = setup;
    p5.draw = draw;
    p5.updateWithProps = updateWithProps;
}