// Utility para manejar parámetros de Next.js 15+
export async function getParams<T>(params: Promise<T>): Promise<T> {
  return await params;
}

// Helper para validar DNI
export function validateDNI(dni: string): { isValid: boolean; value?: number; error?: string } {
  const dniNumber = parseInt(dni);
  
  if (isNaN(dniNumber)) {
    return { isValid: false, error: 'DNI debe ser un número válido' };
  }
  
  if (dniNumber <= 0) {
    return { isValid: false, error: 'DNI debe ser un número positivo' };
  }
  
  return { isValid: true, value: dniNumber };
}
