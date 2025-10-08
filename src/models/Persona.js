import mongoose from 'mongoose';

const PersonaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  DNI: {
    type: Number,
    required: [true, 'El DNI es obligatorio'],
    unique: true,
    index: true
  },
  ingreso: {
    type: Boolean,
    default: false
  },
  fecha_ingreso: {
    type: Date,
    default: null
  }
}, {
  collection: 'personas'
});

// Índices básicos
PersonaSchema.index({ DNI: 1 }, { unique: true });

// Verificar si el modelo ya existe antes de compilarlo
const Persona = mongoose.models.Persona || mongoose.model('Persona', PersonaSchema);

export default Persona;
