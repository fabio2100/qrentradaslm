import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Persona from '@/models/Persona';

// GET - Obtener todas las personas o filtrar por estado de ingreso
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const ingreso = searchParams.get('ingreso');
    
    let query = {};
    if (ingreso !== null) {
      query.ingreso = ingreso === 'true';
    }
    
    const personas = await Persona.find(query);
    
    return NextResponse.json({
      success: true,
      data: personas,
      count: personas.length
    });
    
  } catch (error) {
    console.error('Error al obtener personas:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al obtener las personas'
    }, { status: 500 });
  }
}

// POST - Crear una nueva persona
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { nombre, DNI, ingreso = false } = body;
    
    // Validaciones básicas
    if (!nombre || !DNI) {
      return NextResponse.json({
        success: false,
        error: 'Nombre y DNI son obligatorios'
      }, { status: 400 });
    }
    
    // Verificar si ya existe una persona con ese DNI
    const personaExistente = await Persona.findOne({ DNI });
    if (personaExistente) {
      return NextResponse.json({
        success: false,
        error: 'Ya existe una persona con ese DNI'
      }, { status: 409 });
    }
    
    const nuevaPersona = new Persona({
      nombre,
      DNI,
      ingreso,
      fecha_ingreso: ingreso ? new Date() : null
    });
    
    await nuevaPersona.save();
    
    return NextResponse.json({
      success: true,
      data: nuevaPersona,
      message: 'Persona creada exitosamente'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error al crear persona:', error);
    
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        error: 'Ya existe una persona con ese DNI'
      }, { status: 409 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Error al crear la persona'
    }, { status: 500 });
  }
}
