'use client';

import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ListIcon from '@mui/icons-material/List';

export default function NuevaPersona() {
  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!nombre.trim()) {
      enqueueSnackbar('El nombre y apellido son obligatorios', { 
        variant: 'error',
        autoHideDuration: 10000 
      });
      return;
    }

    if (!dni.trim()) {
      enqueueSnackbar('El DNI es obligatorio', { 
        variant: 'error',
        autoHideDuration: 10000 
      });
      return;
    }

    const dniNumber = parseInt(dni);
    if (isNaN(dniNumber) || dniNumber <= 0) {
      enqueueSnackbar('El DNI debe ser un número válido', { 
        variant: 'error',
        autoHideDuration: 10000 
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/personas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          DNI: dniNumber,
          ingreso: false
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Éxito
        enqueueSnackbar('Persona creada exitosamente', { 
          variant: 'success',
          autoHideDuration: 2000 
        });
        
        // Limpiar formulario
        setNombre('');
        setDni('');
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          router.push('/nueva');
        }, 2000);
        
      } else {
        // Error del servidor
        const errorMessage = data.error || 'Error al crear la persona';
        enqueueSnackbar(errorMessage, { 
          variant: 'error',
          autoHideDuration: 10000 
        });
        
        // Redirigir después de 10 segundos
        setTimeout(() => {
          router.push('/nueva');
        }, 10000);
      }
    } catch (error) {
      // Error de red o conexión
      enqueueSnackbar('Error de conexión. Intente nuevamente.', { 
        variant: 'error',
        autoHideDuration: 10000 
      });
      
      // Redirigir después de 10 segundos
      setTimeout(() => {
        router.push('/nueva');
      }, 10000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="volver"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Nueva Persona
          </Typography>
          <Button
            color="inherit"
            startIcon={<ListIcon />}
            onClick={() => router.push('/lista')}
          >
            Ver Lista
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Registrar Nueva Persona
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Nombre y Apellido"
              variant="outlined"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              inputProps={{ maxLength: 100 }}
            />
            
            <TextField
              fullWidth
              label="DNI"
              variant="outlined"
              type="number"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              inputProps={{ 
                min: 1,
                max: 99999999 
              }}
            />
            
            <Box sx={{ mt: 3, position: 'relative' }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ height: 48 }}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
              
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
