'use client';

import React from "react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";

const sketch = (p5) => {

    p5.setup = () => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);

    };

    p5.windowResized = () => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    }

    p5.draw = () => {
        p5.background(50,180,250);
    };
};

export default function Sky() {
    return <NextReactP5Wrapper sketch={sketch} />;
}