'use client';

import React from "react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";

import sketch from "../sketches/draw";
import styles from '@/styles/Draw.module.css';

export default function Draw(props) {
    return (
        <NextReactP5Wrapper fallback={<h1>loading draw...</h1>} sketch={sketch}> 
        </NextReactP5Wrapper> 
    ); 
} 