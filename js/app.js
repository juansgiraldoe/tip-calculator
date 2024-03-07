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

  const categorias = {
    1: 'Comida. 🍽',
    2: 'Bebidas. 🥤',
    3: 'Postres. 🥧',
  }
  
  limpiarHtml(contenido);

  platillos.forEach( platillo => {
    
    const row = document.createElement('DIV');
    row.classList.add('row', 'py-2', 'border-top');

    const nombre = document.createElement('DIV');
    nombre.classList.add('col-md-4', 'fw-semibold')
    nombre.textContent = platillo.nombre;
    
    const precio = document.createElement('DIV');
    precio.classList.add('col-md-3', 'fw-bolder');
    precio.textContent = `$${platillo.precio}`;
    
    const categoria = document.createElement('DIV');
    categoria.classList.add('col-md-3');
    categoria.textContent = categorias[platillo.categoria];

    const inputCantidad = document.createElement('INPUT');
    inputCantidad.type = 'number';
    inputCantidad.min = 0;
    inputCantidad.value = 0;
    inputCantidad.id = `producto-${platillo.id}`;
    inputCantidad.classList.add('form-control');
    //Deteccion de cantidades en el platillo.
    inputCantidad.onchange = ()=>{
      const cantidad = parseInt(inputCantidad.value);
      agregarPlato({...platillo, cantidad});
    };

    const cantidad = document.createElement('DIV');
    cantidad.classList.add('col-md-2');
    
    //Imprimir en el Html.
    cantidad.appendChild(inputCantidad);
    row.appendChild(nombre);
    row.appendChild(precio);
    row.appendChild(categoria);
    row.appendChild(cantidad);
    contenido.appendChild(row);
  });

};

function agregarPlato(producto) {
  
  const {cantidad} = producto
  const {pedido} = cliente;
  
  //Validar que la cantidad sea mayor a 0.
  if (cantidad > 0) {
    //Comprobar si el articulo esta en el Arryay.
    if (pedido.some( plato => plato.id === producto.id)) {
      //Si existe actualiza la cantidad.
      const pedidoActualizado = pedido.map( articulo => {
        if (articulo.id === producto.id) {
          articulo.cantidad = producto.cantidad;
        };
        return articulo;
      });
      //Se asigna el nuevo array.
      
      cliente.pedido = [...pedidoActualizado];
    } else {
      //Si no existe lo agrega.
      cliente.pedido = [...pedido, producto];
    }
  } else {
    //Eliminar elementos con cantidad 0.
    const resultado = pedido.filter(articulo => articulo.id !== producto.id);
    cliente.pedido = [...resultado];
  };
  actualizarPedido();
};

function actualizarPedido() {
  const contenido =  document.querySelector('#resumen .contenido');
  limpiarHtml(contenido);
  
  const resumen = document.createElement('DIV');
  resumen.classList.add('col-md-6', 'card', 'py-5', 'py-3', 'shadow', 'rounded-3');
  
  //Informacin de la mesa.
  const mesa = document.createElement('P');
  mesa.classList.add('fw-bold');
  mesa.textContent = `Mesa: `
  
  const span = document.createElement('SPAN');
  span.classList.add('fw-normal');
  span.textContent = cliente.mesa;
  
  //Informacion de la hora.
  const hora = document.createElement('P');
  hora.classList.add('fw-bold');
  hora.textContent = `Hora: `
  
  const spanH = document.createElement('SPAN');
  spanH.classList.add('fw-normal');
  spanH.textContent = cliente.hora;
  
  mesa.appendChild(span);
  hora.appendChild(spanH);
  
  //Titulo de la sección.
  const heading = document.createElement('H3');
  heading.classList.add(`mb-4`, `text-center`);
  heading.textContent = `Platillos consumidos.`;
  
  const grupo = document.createElement('UL');
  grupo.classList.add('list-group');
  const {pedido} = cliente;
  pedido.forEach(articulo => {
    const {nombre, cantidad, precio, id} = articulo;
    const lista = document.createElement('LI');
    lista.classList.add('list-group-item');
    
    const nombreEl = document.createElement('H4');
    nombreEl.classList.add('my-4');
    nombreEl.textContent = nombre;
    
    const cantidadEl = document.createElement('P');
    cantidadEl.classList.add('fw-bold');
    cantidadEl.textContent = `Cantidad: `;
    const cantidadValor = document.createElement('SPAN');
    cantidadValor.classList.add('fw-normal');
    cantidadValor.textContent = cantidad;
    
    cantidadEl.appendChild(cantidadValor);

    const precioEl = document.createElement('P');
    precioEl.classList.add('fw-bold');
    precioEl.textContent = `Precio: `;
    const precioValor = document.createElement('SPAN');
    precioValor.classList.add('fw-normal');
    precioValor.textContent = `$${precio}`;
    
    precioEl.appendChild(precioValor);
    
    const subtotalEl = document.createElement('P');
    subtotalEl.classList.add('fw-bold');
    subtotalEl.textContent = `Subtotal: `;
    const subtotalValor = document.createElement('SPAN');
    subtotalValor.classList.add('fw-normal');
    subtotalValor.textContent = `$${precio*cantidad}`;
    
    subtotalEl.appendChild(subtotalValor);
    
    const btnEliminar = document.createElement('BUTTON');
    btnEliminar.classList.add('btn', 'btn-danger');
    btnEliminar.textContent = `Eliminar`;
    btnEliminar.onclick = () => {
      eliminarProducto(id);
    }

    lista.appendChild(nombreEl);
    lista.appendChild(cantidadEl);
    lista.appendChild(precioEl);
    lista.appendChild(subtotalEl);
    lista.appendChild(btnEliminar);
    
    grupo.appendChild(lista);
  });
  
  //Mostrar en el html.
  resumen.appendChild(heading);
  resumen.appendChild(mesa);
  resumen.appendChild(hora);
  resumen.appendChild(grupo);
  
  contenido.appendChild(resumen);
};

function eliminarProducto(id) {
  const {pedido} = cliente
  const contenido =  document.querySelector('#resumen .contenido');
  const resultado = pedido.filter(articulo => articulo.id !== id);
  cliente.pedido = [...resultado];
  limpiarHtml(contenido);
  actualizarPedido();
}

function limpiarHtml(selector) {
  while (selector.firstChild) {
    selector.removeChild(selector.firstChild)
  }
};