"use client";

import { useState, useEffect } from "react";
import { TextField, Box, ThemeProvider, createTheme } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import styles from "./page.module.css";

// Crear tema oscuro
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#007cba',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
    },
  },
});

interface HomeProps {
  searchParams: { q?: string };
}

export default function Home({ searchParams }: HomeProps) {
  const [inputValue, setInputValue] = useState("");
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Efecto para recargar la página después de 5 segundos si hay error de password
  useEffect(() => {
    if (showPasswordError) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 2000);

      // Limpiar el timer si el componente se desmonta
      return () => clearTimeout(timer);
    }
  }, [showPasswordError]);

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
    const handleValidate = async () => {
      setIsLoading(true);
      
      
      
      if (inputValue === "1580") {
        // Por ahora no hacer nada si es correcto
        console.log("Password correcto");
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setShowPasswordError(true);
      }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' && !isLoading) {
        handleValidate();
      }
    };

    return (
      <ThemeProvider theme={darkTheme}>
        <div className={styles.page}>
          <h1>{squareRoot}</h1>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start', mt: 2 }}>
            <TextField
              type="password"
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*'
              }}
              placeholder="Ingrese código"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              size="medium"
              sx={{ width: '200px' }}
            />
            <LoadingButton
              onClick={handleValidate}
              loading={isLoading}
              variant="contained"
              sx={{ 
                width: '200px',
                backgroundColor: '#007cba',
                '&:hover': {
                  backgroundColor: '#005a8b'
                }
              }}
            >
              Validar
            </LoadingButton>
          </Box>
        </div>
      </ThemeProvider>
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