export default function sketch(p5) {
    let name = ""

    function setup() {
        p5.createCanvas(640, 420);
    }

    function draw() {
        p5.background(50, 180, 250);
        drawBorder();

        p5.stroke(0)
        p5.strokeWeight(1)
        p5.text(name, 10, 10);
    }

    function drawBorder() {
        p5.noFill();
        p5.stroke(255);
        p5.strokeWeight(4);
        p5.rect(0, 0, 640, 420, 8);

    }

    function updateWithProps(props) {
        if (props.name) {
            name = props.name;
            console.log(name);
        }
    }

    p5.setup = setup;
    p5.draw = draw;
    p5.updateWithProps = updateWithProps;
}