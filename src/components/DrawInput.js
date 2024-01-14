'use client';

import React from "react";

import styles from '@/styles/Draw.module.css';

export default function DrawInput({ toggleDrawVisible, name, onNameInputChange, clearDrawing, submitDrawing }) {
    return (
        <>
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
                    autoFocus
                />
            </div>
            <div>
                <button className={`${styles.button} & ${styles.back}`} onClick={toggleDrawVisible}>back</button>
                <button className={`${styles.button} & ${styles.clear}`} onClick={clearDrawing}>clear</button>
                <button className={`${styles.button} & ${styles.submit}`} onClick={submitDrawing}>submit</button>
            </div>
        </>
    ); 
} 