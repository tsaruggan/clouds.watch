'use client';

import React from "react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { P5WrapperClassName } from "@p5-wrapper/react";

import sketch from "../sketches/sky";
import styles from '@/styles/Sky.module.css';

export default function Sky({ clouds, toggleDrawVisible }) {
    return (
        <NextReactP5Wrapper fallback={<h1>loading sky...</h1>} sketch={sketch} clouds={clouds}> 
            <div className={`.${P5WrapperClassName} & ${styles.draw}`}>
                <button className={`.${P5WrapperClassName} & ${styles.button}`} onClick={toggleDrawVisible}>draw a cloud *.+</button>
            </div>
        </NextReactP5Wrapper> 
    ); 
} 