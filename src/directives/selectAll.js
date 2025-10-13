// Esta diretiva seleciona todo o texto de um input nativo
export const selectAllDirective = {
  mounted(el) {
    const input = el.querySelector('.q-field__native');
    
    if (input) {
      input.addEventListener('focus', () => {
        if (input.value.length) {
          input.select();
        }
      });
    }
  }
}