'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Box,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RefreshIcon from '@mui/icons-material/Refresh';

interface Persona {
  _id: string;
  nombre: string;
  DNI: number;
  ingreso: boolean;
  fecha_ingreso: string | null;
}

export default function ListaPersonas() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const fetchPersonas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/personas');
      const data = await response.json();

      if (response.ok && data.success) {
        setPersonas(data.data);
      } else {
        const errorMessage = data.error || 'Error al cargar las personas';
        setError(errorMessage);
        enqueueSnackbar(errorMessage, { 
          variant: 'error',
          autoHideDuration: 5000 
        });
      }
    } catch (error) {
      const errorMessage = 'Error de conexión al cargar las personas';
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { 
        variant: 'error',
        autoHideDuration: 5000 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonas();
  }, []);

  const formatearFecha = (fecha: string | null) => {
    if (!fecha) return '';
    
    const date = new Date(fecha);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calcular estadísticas
  const totalPersonas = personas.length;
  const personasDentro = personas.filter(persona => persona.ingreso === true).length;
  const personasFuera = totalPersonas - personasDentro;

  if (loading) {
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
              Lista de Personas
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress size={60} />
          </Box>
        </Container>
      </>
    );
  }

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
            Lista de Personas
          </Typography>
          <Button
            color="inherit"
            startIcon={<RefreshIcon />}
            onClick={fetchPersonas}
            sx={{ mr: 1 }}
          >
            Actualizar
          </Button>
          <Button
            color="inherit"
            startIcon={<PersonAddIcon />}
            onClick={() => router.push('/nueva')}
          >
            Agregar
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Lista de Personas
          </Typography>
          
          {/* Estadísticas */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" color="primary">
                    {totalPersonas}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Personas
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" color="success.main">
                    {personasDentro}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Personas Dentro
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" color="text.secondary">
                    {personasFuera}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Personas Fuera
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {personas.length === 0 && !error ? (
            <Alert severity="info" sx={{ mt: 3 }}>
              No hay personas registradas aún.
            </Alert>
          ) : (
            <TableContainer component={Paper} elevation={1}>
              <Table sx={{ minWidth: 650 }} aria-label="tabla de personas">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">DNI</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Estado</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Fecha de Ingreso</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {personas.map((persona) => (
                    <TableRow
                      key={persona._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {persona.nombre}
                      </TableCell>
                      <TableCell align="center">
                        {persona.DNI.toLocaleString()}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={persona.ingreso ? 'Dentro' : 'Fuera'}
                          color={persona.ingreso ? 'success' : 'default'}
                          variant={persona.ingreso ? 'filled' : 'outlined'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {persona.fecha_ingreso ? (
                          <Typography variant="body2">
                            {formatearFecha(persona.fecha_ingreso)}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Sin registro
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </>
  );
}
