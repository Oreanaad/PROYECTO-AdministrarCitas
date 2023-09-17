//Campos del formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

//User interface
const formulario = document.querySelector('#nueva-cita');

const contenedorCitas = document.querySelector('#citas');

let editando;

class Citas {
    constructor(){
        this.citas = [];
    }

    agregarCitas(cita){
        this.citas = [...this.citas, cita];
    }

    eliminarCita(id){
        this.citas = this.citas.filter( cita => cita.id !== id) //Asi eliminamos las citas 
    }

    editarCita(citaActualizada){
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita)//.map recorre al menos una vez cada elementos y crea un nuevo arreglo
    }
}

class UI{
    imprimirAlerta(mensaje, tipo){
        //Crear el div
        const divMensaje = document.createElement('Div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        //Agregar clase en base al tipo de error
        if (tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }
        //Mensaje de error
        divMensaje.textContent = mensaje;

        //Agregr al DOM 
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'))
         
        //Quitar la alerta luego
        setTimeout(() => {
            divMensaje.remove()
        }, 5000);
    }

    imprimirCitas({citas}){

        this.limpiarHTML();

        citas.forEach(cita => {
            
        const{ mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

        const divCita = document.createElement('div');
        divCita.classList.add('cita', 'p-3');
        divCita.dataset.id = id;

        //Scripting de los elementos de la cita

        const mascotaParrafo = document.createElement('h2')
        mascotaParrafo.classList.add('card-tittle', 'font-weight-bolder')
        mascotaParrafo.textContent = mascota;

        const propietarioParrafo = document.createElement('p')
        propietarioParrafo.innerHTML= `<span class = 'font-weight-bolder'>Propietario: </span> ${propietario}`

        
        const telefonoParrafo = document.createElement('p')
        telefonoParrafo.innerHTML= `<span class = 'font-weight-bolder'>Teléfono: </span> ${telefono}`
        
        const fechaParrafo = document.createElement('p')
        fechaParrafo.innerHTML= `<span class = 'font-weight-bolder'>Fecha: </span> ${fecha}`
       
        const horaParrafo = document.createElement('p')
        horaParrafo.innerHTML= `<span class = 'font-weight-bolder'>Hora: </span> ${hora}`
        
        const sintomasParrafo = document.createElement('p')
       sintomasParrafo.innerHTML= `<span class = 'font-weight-bolder'>Síntomas: </span> ${sintomas}`



        //Boton para eliminar esta cita

        const btnEliminar = document.createElement('button')
        btnEliminar.classList.add('btn', 'btn-danger', 'mr-2')
        btnEliminar.innerHTML = 'Eliminar '

        btnEliminar.onclick = () => eliminarCita (id);

        //Agregar el boton de editar cita

        const btnEditar = document.createElement('button')
        btnEditar.classList.add('btn', 'btn-info')
        btnEditar.innerHTML = 'Editar'
        btnEditar.onclick = () => cargarEdicion(cita)


        //Agregar los parrafos al divCita
        divCita.appendChild(mascotaParrafo);
        divCita.appendChild(propietarioParrafo);
        divCita.appendChild(telefonoParrafo);
        divCita.appendChild(fechaParrafo);
        divCita.appendChild(horaParrafo);
        divCita.appendChild(sintomasParrafo);
        divCita.appendChild(btnEliminar);
        divCita.appendChild(btnEditar);

        //Agregar las citas al HTML
        contenedorCitas.appendChild(divCita)
        })

    }
    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild)
        }
    }
}

//Instanciamos las clases 
const ui = new UI();
const administrarCitas = new Citas();



//Registrar eventos
eventListeners()

function eventListeners(){
 mascotaInput.addEventListener('input', datosCita)
 propietarioInput.addEventListener('input', datosCita)
 telefonoInput.addEventListener('input', datosCita)
 fechaInput.addEventListener('input', datosCita)
 horaInput.addEventListener('input', datosCita)
 sintomasInput.addEventListener('input', datosCita)

 formulario.addEventListener('submit', nuevaCita)
}

//Obj con informacion de la cita 
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}
//Agregar datos al obj de cita 
function datosCita(e){
citaObj[e.target.name]= e.target.value;

}

//Valida y agrega una nueva cita a la clase de cita
function nuevaCita(e){
    e.preventDefault();

    //Extraer la info del obj de citas con un distructuring
    const{ mascota, propietario, telefono, fecha, hora, sintomas } = citaObj

    //Validar 
    if (mascota === '' || propietario === '' || telefono === '' || fecha  === '' || hora === '' || sintomas === '' ){
         ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
         return
    }

    if(editando){

     ui.imprimirAlerta('Editado correctamente')

    // Pasar el bojeto de la dita a edicion
        administrarCitas.editarCita({...citaObj}) //Para pasarle una copia del objeto y que no modifique el original
    
     //Regresar el texto del btn a su estado original
    formulario.querySelector('button[type = "submit"]').textContent = 'Crear cita';

    //Quiar modo edicion
    editando = false;

    }else{
    //generar un id unico
    citaObj.id = Date.now()

    //Creando una nueva cita
    administrarCitas.agregarCitas({...citaObj}); //Tomamos uns copia del objeto para que asi no se duplique el resultado

    //Mensaje de agregado correctamente
    ui.imprimirAlerta('Se agregó correctamente')

    }

    
    //Reinicar el objeto para la validacion
    reiniciarObj();

    //Reiniciar el formulario
    formulario.reset();

    //Mostrar el html de las citas
    ui.imprimirCitas(administrarCitas);
}

function reiniciarObj(){
    citaObj.mascota = '',
    citaObjpropietario = '',
    citaObjtelefon = '',
    citaObjfecha = '',
    citaObjhora ='',
    citaObjsintomas = ''
}

function eliminarCita(id){


    //Eliminar la cita
    administrarCitas.eliminarCita(id);

    //Muestre un mensaje
    ui.imprimirAlerta('La cita se eliminó correctamente')

    //Eliminar la cita
    ui.imprimirCitas(administrarCitas);

}

//Carga los datos y el modo edicion
function cargarEdicion(cita){
    const{ mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    //Llenar los inputs luego de editarlo
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //Llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono =telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    //Cambiar el texto del boton 
    formulario.querySelector('button[type = "submit"]').textContent = 'Guardar cambios';

    editando = true;
}