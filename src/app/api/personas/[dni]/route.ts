import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Persona from '@/models/Persona';

// GET - Obtener persona por DNI
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dni: string }> }
) {
  try {
    await connectToDatabase();
    
    const { dni } = await params;
    const DNI = parseInt(dni);
    
    if (isNaN(DNI)) {
      return NextResponse.json({
        success: false,
        error: 'DNI debe ser un número válido'
      }, { status: 400 });
    }
    
    const persona = await Persona.findOne({ DNI });
    
    if (!persona) {
      return NextResponse.json({
        success: false,
        error: 'Persona no encontrada'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: persona
    });
    
  } catch (error) {
    console.error('Error al obtener persona:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al obtener la persona'
    }, { status: 500 });
  }
}

// PATCH - Actualizar estado de ingreso de una persona
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ dni: string }> }
) {
  try {
    await connectToDatabase();
    
    const { dni } = await params;
    const DNI = parseInt(dni);
    const body = await request.json();
    const { ingreso } = body;
    
    if (isNaN(DNI)) {
      return NextResponse.json({
        success: false,
        error: 'DNI debe ser un número válido'
      }, { status: 400 });
    }
    
    if (typeof ingreso !== 'boolean') {
      return NextResponse.json({
        success: false,
        error: 'El campo ingreso debe ser true o false'
      }, { status: 400 });
    }
    
    const persona = await Persona.findOne({ DNI });
    
    if (!persona) {
      return NextResponse.json({
        success: false,
        error: 'Persona no encontrada'
      }, { status: 404 });
    }
    
    // Actualizar el estado de ingreso
    persona.ingreso = ingreso;
    if (ingreso) {
      persona.fecha_ingreso = new Date();
    }
    
    await persona.save();
    
    return NextResponse.json({
      success: true,
      data: persona,
      message: `Persona ${ingreso ? 'registrada como ingresada' : 'registrada como salida'} exitosamente`
    });
    
  } catch (error) {
    console.error('Error al actualizar persona:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al actualizar la persona'
    }, { status: 500 });
  }
}
