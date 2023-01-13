let datosSeguros;

const pedidoData = async () => {
  const res = await fetch("Json/data.json");
  datosSeguros = await res.json();

  cargarSeguroPersonas(datosSeguros.tipoSeguroPersonas);
  cargarSeguroEmpresas(datosSeguros.tipoSeguroEmpresas);
};

pedidoData();

//armado e inserción de tarjeta seguro personas***********************************************

const armarTarjetaPersonas = (elem) => {
  return `
  <div class="col-md-6 col-lg-4 col-xl-3 p-2 " id="${elem.id}">
      <div class="special-img position-relative overflow-hidden">
        <button id="segPers" type ="submit" class = "boton" >
            <img src="${elem.url}" class="w-100" data-bs-toggle="modal" data-bs-target="#modalPersonas" alt="" >
        </buttom>
      </div>
      <div class="text-center">
          <p class="my-1 mt-3">${elem.nombre}</p>
          <span class="fw-bold">${elem.estado}</span>
      </div>
  </div>`;
};

const cargarSeguroPersonas = (array) => {
  let tarjetas = "";
  if (array.length > 0) {
    array.forEach((elem) => {
      tarjetas += armarTarjetaPersonas(elem);
    });
    document.querySelector("#segurosPersonas").innerHTML = tarjetas;
  }
};

//armado e inserción de tarjeta seguro empresas **********************************************

const armarTarjetaEmpresas = (elem) => {
  return `
    <div class="col-md-6 col-lg-4 col-xl-3 p-2" id="${elem.id}" >
        <div class="special-img position-relative overflow-hidden" >
          <button id="segPers" type ="submit" class = "boton" >
            <img src="${elem.url}" alt="" class="w-100" data-bs-toggle="modal" data-bs-target="#modalEmpresas">
          </buttom>
        </div>
        <div class="text-center">
            <p class="text-capitalize mt-3 mb-1">${elem.nombre}</p>
            <span class="fw-bold d-block">${elem.estado}</span>
        </div>
    </div>`;
};

const cargarSeguroEmpresas = (array) => {
  let tarjetas = "";
  if (array.length > 0) {
    array.forEach((elem) => {
      tarjetas += armarTarjetaEmpresas(elem);
    });
    document.querySelector("#segurosEmpresas").innerHTML = tarjetas;
  }
};

/****************************************************************************************************/


/********************  filtro de seguros  ************************** */

let filterZone = document.querySelector(".filter");
let busquedaSinResultados = "No encontramos coincidencias!!";
let busquedaSinParametros =
  "Por favor, ingrese un parámetro para realizar la búsqueda";
let accesoBusquedaConEnter = document.querySelector("#busquedaSeguros");


// defino plantilla para cargar los elementos del array
const armarTarjetaBusqueda = (elem) => {
  return `
    <div class="col-md-6 col-lg-4 col-xl-3 p-2" >
        <div class="special-img position-relative overflow-hidden" >
            <a href="#${elem.id}"><img src="${elem.url}" alt="" class="w-100" data-bs-dismiss="modal"></a>
        </div>
        <div class="text-center">
            <p class="text-capitalize mt-3 mb-1">${elem.nombre}</p>
        </div>
    </div>`;
};


const cargarBusqueda = (result) => {
  let searchCard = "";
  result.forEach((elem) => {
    searchCard += armarTarjetaBusqueda(elem);
  });

  filterZone.innerHTML = searchCard;
};

//presenta un mensaje en el modal de busqueda --- el mensaje se recibe como parámetro
function cargarMensajeBusqueda (param)  {
  filterZone.innerHTML = `
  <h6 class = "text-muted">${param}</h6>`;
};



const filtroSeguros = () => {
  let listaSeguros = [
    ...datosSeguros.tipoSeguroPersonas,//toma los datos de seguroPersonas
    ...datosSeguros.tipoSeguroEmpresas,//toma los datos de seguroEmpresas
  ];

  let text = busquedaSeguros.value.trim().toUpperCase(); //parámetro de busqueda

  let resultNombre = listaSeguros.filter((e) => //se filtra por el nombre
    e.nombre.toUpperCase().includes(text)
  );
  let resultDescripcion = listaSeguros.filter((e) => // se filtra por la descripcion
    e.descripcion.toUpperCase().includes(text)
  );
  let totalResult = [...resultNombre, ...resultDescripcion];

  if (text === "") { 
    
    cargarMensajeBusqueda(busquedaSinParametros);

  } else if (totalResult.length > 0) {

    cargarBusqueda(totalResult);

  } else cargarMensajeBusqueda(busquedaSinResultados);
};
/******************************************************************************************************/


/* Sección solicitudes */


// variables formulario personas*********************************
let inputNombrePersona = document.querySelector("#formNombrePersona");
let inputEmailPersona = document.querySelector("#formEmailPersona");
let inputSelectPersona = document.querySelector("#formSelectPersona");
let formPersona = document.querySelector("#formPersona");

// variables formulario empresas***************************************
let inputNombreEmpresa = document.querySelector("#formNombreEmpresa");
let inputEmailEmpresa = document.querySelector("#formEmailEmpresa");
let inputSelectEmpresa = document.querySelector("#formSelectEmpresa");
let formEmpresa = document.querySelector("#formEmpresa");

// id random
let idConsulta = Math.trunc(Math.random() * 100000); // asigna un id aleatorio a la solicitud

let consultas = [];
let infoLocalStorage = [];

/**************  Carrito de consultas  ***************************************/

formPersona.addEventListener("submit", (e) => {

  const datosConsulta = {
    iDConsulta: idConsulta,
    nombre: inputNombrePersona.value,
    email: inputEmailPersona.value,
    motivo: inputSelectPersona.value,
  };
  consultas = [...consultas, datosConsulta];

  // verifico la existencia de "solicitudes" en el localStorage

  if (localStorage.getItem("solicitudes")) {

    //traigo la información de local storage
    infoLocalStorage = JSON.parse(localStorage.getItem("solicitudes"));

    //sumo datos al array de consultas
    infoLocalStorage = [...infoLocalStorage, datosConsulta];

    //convierto a json la info y la envio al local storage
    localStorage.setItem("solicitudes", JSON.stringify(infoLocalStorage));
  } else {
    // genero el json de datos en local Storage
    const consultasAJson = JSON.stringify(consultas);
    localStorage.setItem("solicitudes", consultasAJson);
  }
});

formEmpresa.addEventListener("submit", (e) => {
  const datosConsulta = {
    iDConsulta: idConsulta,
    nombre: inputNombreEmpresa.value,
    email: inputEmailEmpresa.value,
    motivo: inputSelectEmpresa.value,
  };
  consultas = [...consultas, datosConsulta];

  // verifico la existencia de "solicitudes" en el localStorage

  if (localStorage.getItem("solicitudes")) {

    //traigo la información de local storage
    infoLocalStorage = JSON.parse(localStorage.getItem("solicitudes"));

    //sumo datos al array de consultas
    infoLocalStorage = [...infoLocalStorage, datosConsulta];

    //convierto a json la info y la envio al local storage
    localStorage.setItem("solicitudes", JSON.stringify(infoLocalStorage));
  } else {
    // genero el json de datos en local Storage
    const consultasAJson = JSON.stringify(consultas);
    localStorage.setItem("solicitudes", consultasAJson);
  }
});


/* agrega el numero de solicitudes al portafolio*/

let addNumero = document.querySelector(".numero");

function numeroSolicitud() {
  if (
    localStorage.getItem("solicitudes") &&
    localStorage.getItem("solicitudes").length > 2
  ) {
    infoLocalStorage = JSON.parse(localStorage.getItem("solicitudes"));
    addNumero.innerHTML = infoLocalStorage.length;
  }
}
numeroSolicitud();

/****************************           ******************************/

//Seccion Vista de solicitudes


let consulta = document.querySelector(".consulta");

//abre ventana modal de Solicitudes
function htmlConsultas() {
  //solicito información de solicitudes del localStorage
  infoLocalStorage = JSON.parse(localStorage.getItem("solicitudes"));
  resetearConsultas();
  if (  // verificamos que localStorage cumpla los requicitos necesarios
    localStorage.getItem("solicitudes") &&
    localStorage.getItem("solicitudes").length > 2
  ) {
    // genero la vista de cada solicitud que exista en el array
    infoLocalStorage.forEach((elem) => {
      const div = document.createElement("div");
      div.innerHTML = `
      <div class="p-2" id="prueba">
      <ul class="list-group list-group-flush">
      <li class="list-group-item">${elem.motivo}</li>
      <li class="list-group-item">ID solicitud ${elem.iDConsulta}</li>
      </ul>
      <button id="${elem.iDConsulta}" class = "eliminarElemento btn btn-primary danger" >Eliminar</button>
      </div>`;
      consulta.appendChild(div);
    });
  } else {
    //en el caso de que no haya elementos en el array
    const div = document.createElement("div");
    div.innerHTML = `
      <div class="p-2" >
      <p>No hay solicitudes pendientes!</p>
      </div>`;
    consulta.appendChild(div);
  }
  //agrego evento a los botones para poder eliminar elementos
  let prueba = document.querySelectorAll(".eliminarElemento");
  prueba.forEach((el) => {
    el.addEventListener("click", eliminarElemento);
  });
}

//eliminar elementos de manera individual del portafolio de solicitudes
// se agrega la libreria sweet alert
function eliminarElemento(e) {
  if (e.target.classList.contains("eliminarElemento")) {
    let productoID = parseInt(e.target.getAttribute("id"));
    infoLocalStorage = infoLocalStorage.filter(
      (producto) => producto.iDConsulta !== productoID
    );
    const infoAJson = JSON.stringify(infoLocalStorage);
    localStorage.setItem("solicitudes", infoAJson);
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Solicitud eliminada",
      showConfirmButton: false,
    });
    setTimeout(() => {
      location.reload();
    }, 1000);
    htmlConsultas();
  }
}


//deja vacio el portafolio de solicitudes para no repetir elementos
function resetearConsultas() {
  consulta.innerHTML = "";
}


//elimina el total de solicitudes del local Storage - boton ubicado en HTML "onclick"
function eliminarSolicitudes() {
  infoLocalStorage = JSON.parse(localStorage.getItem("solicitudes"));
  if (
    localStorage.getItem("solicitudes") &&
    localStorage.getItem("solicitudes").length > 2
  ) {
    localStorage.removeItem("solicitudes");
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Su/ sus solicitudes han sido eliminadas",
      showConfirmButton: false,
    });
    setTimeout(() => {
      location.reload();
    }, 2500);
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No encontramos ninguna solicitud para eliminar",
      showConfirmButton: false,
    });
  }
}

//Simula el envio de solicitudes - boton en el HTML - "onclick" - elimina info del local storage
function enviarSolicitudes() {
  infoLocalStorage = JSON.parse(localStorage.getItem("solicitudes"));
  if (
    localStorage.getItem("solicitudes") &&
    localStorage.getItem("solicitudes").length > 2
  ) {
    localStorage.removeItem("solicitudes");
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Su/ sus solicitudes han sido enviadas",
      showConfirmButton: false,
    });
    setTimeout(() => {
      location.reload();
    }, 2500);
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No encontramos ninguna solicitud para enviar",
      showConfirmButton: false,
    });
  }
}


//formulario de consultas

// Variables
let messageName = document.querySelector("#message-name");
let messageEmail = document.querySelector("#message-email");
let messageText = document.querySelector("#message-text");
let messageForm = document.querySelector("#message-form");
let modalMessages = document.querySelector("#modalMessage");
let btnCloseModalMessage = document.querySelector("#btn-close-modal-message");
let infoModalMessage = document.querySelector(".info-message");

// Eventos
// toma los datos del formulario de consultas y lo reutiliza en un modal
const printMessage = messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  infoModalMessage.innerHTML = `
  <h5>Hola: ${messageName.value}!</h5>
  <h6>Tu mensaje:</h6>
  <h6 class="lead text-muted fst-italic">"${messageText.value}"</h6>
  <h6>ha sido enviado con éxito!</h6>
  <h7 class="fs-7">A la brevedad obtendras una respuesta a ${messageEmail.value}</h7>`;
  modalMessages.showModal();
});

const deleteMessage = btnCloseModalMessage.addEventListener("click", (e) => {
  modalMessages.close();
});

