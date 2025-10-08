// Ejemplos de uso simplificado del modelo Persona
import connectToDatabase from '@/lib/mongodb';
import Persona from '@/models/Persona';

// Crear una nueva persona
export async function crearPersona(nombre: string, DNI: number) {
  await connectToDatabase();
  
  const nuevaPersona = new Persona({
    nombre,
    DNI,
    ingreso: false,
    fecha_ingreso: null
  });
  
  return await nuevaPersona.save();
}

// Marcar ingreso de una persona
export async function marcarIngreso(DNI: number) {
  await connectToDatabase();
  
  const persona = await Persona.findOne({ DNI });
  if (!persona) {
    throw new Error('Persona no encontrada');
  }
  
  persona.ingreso = true;
  persona.fecha_ingreso = new Date();
  
  return await persona.save();
}

// Marcar salida de una persona
export async function marcarSalida(DNI: number) {
  await connectToDatabase();
  
  const persona = await Persona.findOne({ DNI });
  if (!persona) {
    throw new Error('Persona no encontrada');
  }
  
  persona.ingreso = false;
  // Mantenemos fecha_ingreso para historial
  
  return await persona.save();
}

// Obtener todas las personas que están dentro
export async function obtenerPersonasDentro() {
  await connectToDatabase();
  return await Persona.find({ ingreso: true });
}

// Obtener todas las personas
export async function obtenerTodasLasPersonas() {
  await connectToDatabase();
  return await Persona.find({}).sort({ nombre: 1 });
}

// Buscar persona por DNI
export async function buscarPersonaPorDNI(DNI: number) {
  await connectToDatabase();
  return await Persona.findOne({ DNI });
}
