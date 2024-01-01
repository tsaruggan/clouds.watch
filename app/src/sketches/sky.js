export default function sketch(p5) {
    function setup() {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
    }

    function windowResized() {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    }

    function draw() {
        p5.background(50,180,250);
    }

    p5.setup = setup;
    p5.windowResized = windowResized;
    p5.draw = draw;
}
