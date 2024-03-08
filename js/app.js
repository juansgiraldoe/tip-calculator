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
  
  if (cliente.pedido.length) {
    actualizarPedido();
  } else {
    mensjeVacio();
  };
};

function actualizarPedido() {
  const contenido =  document.querySelector('#resumen .contenido');
  limpiarHtml(contenido);
  
  const resumen = document.createElement('DIV');
  resumen.classList.add('col-md-6', 'card', 'py-5', 'py-3', 'shadow', 'rounded-3');
  
  //Informacin de la mesa.
  const mesa = document.createElement('P');
  mesa.classList.add('fw-bold', 'border', 'py-2', 'd-inline', 'rounded', 'px-4');
  mesa.textContent = `Mesa: `
  const span = document.createElement('SPAN');
  span.classList.add('fw-normal');
  span.textContent = cliente.mesa;
  
  //Informacion de la hora.
  const hora = document.createElement('P');
  hora.classList.add('fw-bold', 'border', 'py-2', 'd-inline', 'rounded', 'px-4');
  hora.textContent = `Hora: `
  
  const spanH = document.createElement('SPAN');
  spanH.classList.add('fw-normal');
  spanH.textContent = cliente.hora;
  
  mesa.appendChild(span);
  hora.appendChild(spanH);
  
  //Titulo de la sección.
  const heading = document.createElement('H3');
  heading.classList.add(`my-4`, `text-center`);
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
  const descriptionDiv = document.createElement('DIV');
  descriptionDiv.classList.add('d-flex', 'justify-content-around');
  descriptionDiv.appendChild(mesa);
  descriptionDiv.appendChild(hora);
  
  resumen.appendChild(heading);
  resumen.appendChild(descriptionDiv);
  resumen.appendChild(grupo);
  
  contenido.appendChild(resumen);

  //Imprimir formulario de propinas.
  formularioPropinas();
};

function eliminarProducto(id) {
  const {pedido} = cliente
  const contenido =  document.querySelector('#resumen .contenido');
  const resultado = pedido.filter(articulo => articulo.id !== id);
  cliente.pedido = [...resultado];
  limpiarHtml(contenido);
  
  if (cliente.pedido.length) {
    actualizarPedido();
  } else {
    mensjeVacio();
  };

  const productoEliminado = `#producto-${id}`;
  const inputEliminar = document.querySelector(productoEliminado);
  inputEliminar.value = 0;
};

function mensjeVacio() {
  const contenido = document.querySelector('#resumen .contenido');
  limpiarHtml(contenido)
  const texto = document.createElement('P');
  texto.classList.add('text-center');
  texto.textContent = `Añade los elementos del pedido.`;
  contenido.appendChild(texto);
};

function formularioPropinas() {
  const contenido = document.querySelector('#resumen .contenido');
  contenido.classList.add('justify-content-around')
  const formulario = document.createElement('DIV');
  formulario.classList.add('col-md-6', 'formulario', 'px-0');
  const heading = document.createElement('H3');
  heading.classList.add('mb-4', 'text-center');
  heading.textContent = `Propina.`;
  
  const divForm = document.createElement('DIV')
  divForm.classList.add('card', 'py-5', 'px-3', 'shadow', 'rounded-3');

  const radio10 = document.createElement('INPUT');
  radio10.type = 'radio';
  radio10.name = 'propina';
  radio10.value = 10;
  radio10.classList.add('form-check-input');
  radio10.onclick = calcularPropina;
  const radio10Label = document.createElement('LABEL');
  radio10Label.textContent = '10%';
  radio10Label.classList.add('form-check-label');

  const radio10Div = document.createElement('DIV');
  radio10Div.classList.add('form-check');

  radio10Div.appendChild(radio10);
  radio10Div.appendChild(radio10Label);

  const radio20 = document.createElement('INPUT');
  radio20.type = 'radio';
  radio20.name = 'propina';
  radio20.value = 15;
  radio20.classList.add('form-check-input');
  radio20.onclick = calcularPropina;
  const radio20Label = document.createElement('LABEL');
  radio20Label.textContent = '15%';
  radio20Label.classList.add('form-check-label');

  const radio20Div = document.createElement('DIV');
  radio20Div.classList.add('form-check');

  radio20Div.appendChild(radio20);
  radio20Div.appendChild(radio20Label);

  const radio30 = document.createElement('INPUT');
  radio30.type = 'radio';
  radio30.name = 'propina';
  radio30.value = 20;
  radio30.classList.add('form-check-input');
  radio30.onclick = calcularPropina;
  const radio30Label = document.createElement('LABEL');
  radio30Label.textContent = '20%';
  radio30Label.classList.add('form-check-label');

  const radio30Div = document.createElement('DIV');
  radio30Div.classList.add('form-check');

  radio30Div.appendChild(radio30);
  radio30Div.appendChild(radio30Label);

  divForm.appendChild(heading);

  const divOpciones = document.createElement('DIV');
  divOpciones.classList.add('d-flex','justify-content-around');
  divOpciones.appendChild(radio10Div);
  divOpciones.appendChild(radio20Div);
  divOpciones.appendChild(radio30Div);
  divForm.appendChild(divOpciones);
  formulario.appendChild(divForm);

  contenido.appendChild(formulario);
};
function limpiarHtml(selector) {
  while (selector.firstChild) {
    selector.removeChild(selector.firstChild);
  }
};

function calcularPropina() {
  
  const {pedido} = cliente
  let subtotal = 0;

  //Calcular el subtotal.
  pedido.forEach(articulo => {
    subtotal += articulo.cantidad * articulo.precio
  });
  const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;
  
  //Calcular propina.
  const propina = ((subtotal * parseInt(propinaSeleccionada))/100);

  //Calcular total a pagar.

  const total = (subtotal + propina);

  totalPedido(subtotal, total, propina);
};

function totalPedido(subtotal, total, propina) {

  const divTotales = document.createElement('DIV');
  divTotales.classList.add('total-pagar', 'card', 'py-5', 'px-3', 'shadow', 'rounded-3', 'mt-3');
  const formulario = document.querySelector('.formulario');
  const totalPagar = document.querySelector('.formulario .total-pagar');

  if (totalPagar) {
    totalPagar.remove();
  }

  const subtotalP = document.createElement('P');
  subtotalP.classList.add('fs-3','fw-bold');
  subtotalP.textContent = 'Total consumo: ';

  const subtotalSpan = document.createElement('SPAN');
  subtotalSpan.classList.add('fw-normal');
  subtotalSpan.textContent = `$${subtotal}`;

  subtotalP.appendChild(subtotalSpan);

  const propinaP = document.createElement('P');
  propinaP.classList.add('fs-3','fw-bold');
  propinaP.textContent = 'Total propina: ';

  const propinaSpan = document.createElement('SPAN');
  propinaSpan.classList.add('fw-normal');
  propinaSpan.textContent = `$${propina}`;

  propinaP.appendChild(propinaSpan);

  const totalP = document.createElement('P');
  totalP.classList.add('fs-3','fw-bold');
  totalP.textContent = 'Total a pagar: ';

  const totalSpan = document.createElement('SPAN');
  totalSpan.classList.add('fw-normal');
  totalSpan.textContent = `$${total}`;

  totalP.appendChild(totalSpan);


  divTotales.appendChild(subtotalP);
  divTotales.appendChild(propinaP);
  divTotales.appendChild(totalP);

  formulario.appendChild(divTotales);


};