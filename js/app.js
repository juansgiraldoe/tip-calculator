let cliente = {
  mesa: '',
  hora: '',
  pedido: [],
};

const categorias = {
  1: 'Comida. 🍽',
  2: 'Bebidas. 🥤',
  3: 'Postres. 🥧',
}

const btnCliente = document.querySelector('#guardar-cliente');
window.onload = ()=> btnCliente.addEventListener('click', guardarCliente);

function guardarCliente() {
  const mesa = document.querySelector('#mesa').value;
  const hora = document.querySelector('#hora').value;
  const camposVacios = [mesa, hora].some( campo => campo === '');
  const formulario = document.querySelector('form');

  if (camposVacios) {
    imprimirAlerta('Ambos campor son obligatorios.');
    return;
  };
  //Asignar datos del form.
  cliente = {...cliente, mesa, hora};

  //Cerrar modal
  const modalForm = document.querySelector('#formulario');
  const modalBootstrap = bootstrap.Modal.getInstance(modalForm);
  modalBootstrap.hide();

  //Mostrar secciones.
  mostrarSecciones();

  //Consultar la Api.
  obtenerPlatillos();
  formulario.reset();
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

function mostrarSecciones() {
  const seccionesOcultas = document.querySelectorAll('.d-none');
  seccionesOcultas.forEach(seccion  => seccion.classList.remove('d-none'));
};

function obtenerPlatillos() {
  const url = `http://localhost:4000/platillos`;
  fetch(url)
    .then(res => res.json())
    .then(res => mostrarPlatillos(res))
    .catch(error => console.log(error))
};

function mostrarPlatillos(platillos) {

  const contenido = document.querySelector('#platillos .contenido');
  
  limpiarHtml(contenido);

  platillos.forEach( plattillo => {
    
    const row = document.createElement('DIV');
    row.classList.add('row', 'py-2', 'border-top');

    const nombre = document.createElement('DIV');
    nombre.classList.add('col-md-4', 'fw-semibold')
    nombre.textContent = plattillo.nombre;
    
    const precio = document.createElement('DIV');
    precio.classList.add('col-md-3', 'fw-bolder');
    precio.textContent = `$${plattillo.precio}`;
    
    const categoria = document.createElement('DIV');
    categoria.classList.add('col-md-3');
    categoria.textContent = categorias[plattillo.categoria];


    
    //Imprimir en el Html.
    row.appendChild(nombre);
    row.appendChild(precio);
    row.appendChild(categoria);
    contenido.appendChild(row);
  });

};

function limpiarHtml(selector) {
  while (selector.firstChild) {
    selector.removeChild(selector.firstChild)
  }
}