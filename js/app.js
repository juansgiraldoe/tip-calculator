let cliente = {
  mesa: '',
  hora: '',
  pedido: [],
};

const btnCliente = document.querySelector('#guardar-cliente');
window.onload = ()=> btnCliente.addEventListener('click', guardarCliente);

function guardarCliente() {
  const mesa = document.querySelector('#mesa').value;
  const hora = document.querySelector('#hora').value;
  const camposVacios = [mesa, hora].some( campo => campo === '');

  if (camposVacios) {
    imprimirAlerta('Ambos campor son obligatorios.');
    return;
  };
};

function imprimirAlerta(msg) {
  const claseAlerta = document.querySelector('.invalid-feedback');
  if (!claseAlerta) {
    const alerta = document.createElement('DIV');
    alerta.classList.add('invalid-feedback', 'd-block', 'text-center', 'border', 'border-danger', 'py-2', 'rounded');
    alerta.textContent = `${msg}`;
    document.querySelector('.modal-body form').appendChild(alerta);
    setTimeout(() => {
      alerta.remove();
    }, 2000);
  };
};