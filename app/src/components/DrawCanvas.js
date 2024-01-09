'use client';

import { NextReactP5Wrapper } from "@p5-wrapper/next";

import React from "react";

import sketch from "../sketches/draw";

export default function DrawCanvas({ drawing, updateDrawing }) {
    return (
        <NextReactP5Wrapper fallback={<h1>loading draw...</h1>} sketch={sketch} drawing={drawing} updateDrawing={updateDrawing} />
    ); 
} 