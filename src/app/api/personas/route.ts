import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Persona from '@/models/Persona';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const ingreso = searchParams.get('ingreso');
    
    let query: Record<string, any> = {};
    if (ingreso !== null) {
      query.ingreso = ingreso === 'true';
    }
    
    const personas = await Persona.find(query);
    
    return NextResponse.json({
      success: true,
      data: personas
    });
  } catch (error: any) {
    console.error('Error al obtener personas:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { nombre, DNI } = body;
    
    if (!nombre || !DNI) {
      return NextResponse.json({
        success: false,
        error: 'Nombre y DNI son requeridos'
      }, { status: 400 });
    }
    
    const nuevaPersona = new Persona({
      nombre,
      DNI,
      ingreso: false,
      fecha_ingreso: null
    });
    
    const personaGuardada = await nuevaPersona.save();
    
    return NextResponse.json({
      success: true,
      data: personaGuardada
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Error al crear persona:', error);
    
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        error: 'Ya existe una persona con ese DNI'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}
