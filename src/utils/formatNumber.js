export function formatoPesos(valor) {
    console.log(valor);
    
  return "$" + new Intl.NumberFormat('es-CO').format(valor);
}
