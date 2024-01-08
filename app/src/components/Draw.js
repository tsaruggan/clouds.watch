'use client';

import React from "react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";

import sketch from "../sketches/draw";
import styles from '@/styles/Draw.module.css';

export default function Draw({ toggleDrawVisible, name, onNameInputChange }) {

    return (
        <>
            <div className={`${styles.draw}`}>
                <NextReactP5Wrapper fallback={<h1>loading draw...</h1>} sketch={sketch}/>
                <div>
                    <input 
                        type="text" 
                        name="name"
                        className={`${styles.name}`}  
                        maxLength={24} 
                        placeholder="name (optional)"
                        autoComplete="off"
                        value={name} 
                        onChange={onNameInputChange}
                        // autoFocus
                    />
                </div>
                <div>
                    <button className={`${styles.button} & ${styles.back}`} onClick={toggleDrawVisible}>back</button>
                    <button className={`${styles.button} & ${styles.clear}`} >clear</button>
                    <button className={`${styles.button} & ${styles.submit}`}>submit</button>
                </div>
            </div>
            
        </>
    ); 
} 