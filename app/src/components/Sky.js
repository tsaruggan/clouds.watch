'use client';

import React from "react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { P5WrapperClassName } from "@p5-wrapper/react";

import sketch from "../sketches/sky";
import styles from '@/styles/Sky.module.css';

export default function Sky({ clouds }) {
    return (
        <NextReactP5Wrapper fallback={<h1>loading...</h1>} sketch={sketch} clouds={clouds}> 
            
           <span className={`.${P5WrapperClassName} & ${styles.title}`}>clouds.watch</span>
        </NextReactP5Wrapper> 
    ); 
} 