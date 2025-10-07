"use client";

import { useState } from "react";
import styles from "./page.module.css";

interface HomeProps {
  searchParams: { q?: string };
}

export default function Home({ searchParams }: HomeProps) {
  const [inputValue, setInputValue] = useState("");
  const [showPasswordError, setShowPasswordError] = useState(false);

  // Si hay error de password, mostrar pantalla de error
  if (showPasswordError) {
    return (
      <div style={{ 
        backgroundColor: 'red', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        margin: 0
      }}>
        <h1 style={{ color: 'white', fontSize: '2rem' }}>PASS INCORRECTO</h1>
      </div>
    );
  }

  // Si no hay parámetro q, mostrar pantalla de error
  if (!searchParams.q) {
    return (
      <div style={{ 
        backgroundColor: 'red', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        margin: 0
      }}>
        <h1 style={{ color: 'white', fontSize: '2rem' }}>NO VALIDO</h1>
      </div>
    );
  }
  
  // Convertir q a número y verificar si es válido
  const number = parseFloat(searchParams.q);
  
  // Si no es un número válido o es negativo, mostrar pantalla de error
  if (isNaN(number) || number < 0) {
    return (
      <div style={{ 
        backgroundColor: 'red', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        margin: 0
      }}>
        <h1 style={{ color: 'white', fontSize: '2rem' }}>NO VALIDO</h1>
      </div>
    );
  }
  
  // Calcular la raíz cuadrada
  const squareRoot = Math.sqrt(number);
  
  // Verificar si la raíz cuadrada es un número exacto (entero)
  if (Number.isInteger(squareRoot)) {
    const handleValidate = () => {
      if (inputValue === "1580") {
        // Por ahora no hacer nada si es correcto
        console.log("Password correcto");
      } else {
        setShowPasswordError(true);
      }
    };

    return (
      <div className={styles.page}>
        <h1>{squareRoot}</h1>
        <input 
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Ingrese un número"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{
            marginTop: '20px',
            padding: '10px',
            fontSize: '16px',
            border: '2px solid #ccc',
            borderRadius: '5px',
            width: '200px'
          }}
        />
        <br />
        <button 
          onClick={handleValidate}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007cba',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Validar
        </button>
      </div>
    );
  } else {
    // Si la raíz cuadrada no es exacta, mostrar pantalla de error
    return (
      <div style={{ 
        backgroundColor: 'red', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        margin: 0
      }}>
        <h1 style={{ color: 'white', fontSize: '2rem' }}>NO VALIDO</h1>
      </div>
    );
  }
}
