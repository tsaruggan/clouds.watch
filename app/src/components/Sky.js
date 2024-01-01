'use client';

import React from "react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";

import sketch from "../sketches/sky";


export default function Sky() {
    return <NextReactP5Wrapper sketch={sketch} />;
}