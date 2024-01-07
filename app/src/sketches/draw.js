export default function sketch(p5) {
    function setup() {
        p5.createCanvas(640, 420);
    }

    function draw() {
        p5.background(50, 180, 250);
        drawBorder();
    }

    function drawBorder() {
        p5.noFill();
        p5.stroke(255);
        p5.strokeWeight(4);
        p5.rect(0, 0, 640, 420, 8);

    }

    function updateWithProps(props) {

    }

    p5.setup = setup;
    p5.draw = draw;
    p5.updateWithProps = updateWithProps;
}