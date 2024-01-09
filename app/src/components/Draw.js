'use client';

import React from "react";

import styles from '@/styles/Draw.module.css';
import DrawCanvas from "./DrawCanvas";
import DrawInput from "./DrawInput";

export default function Draw({ toggleDrawVisible, name, onNameInputChange, drawing, updateDrawing, clearDrawing }) {

    return (
        <>
            <div className={`${styles.draw}`}>
                <DrawCanvas 
                    drawing={drawing} 
                    updateDrawing={updateDrawing} 
                />
                <DrawInput 
                    toggleDrawVisible={toggleDrawVisible} 
                    name={name} 
                    onNameInputChange={onNameInputChange} 
                    clearDrawing={clearDrawing}
                />
            </div>
            
        </>
    ); 
} 