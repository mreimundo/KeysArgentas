//Código en el cual el usuario selecciona los productos que quiere agregar al carrito (en este caso se agregan 3), luego se procede a elegir el método de pago y finalmente se imprime por alerta en pantalla el monto.

window.onload = function() {

    //Se obtienen los datos de los productos a partir de un JSON y se crean las tarjetas correspondientes a cada uno. Luego, se recupera el carrito.

    function inicializarHTML() {
        fetch("./assets/db/productos.json")
        .then((res) => res.json())
        .then((data) => {
            data.forEach((prod) => {
                productos.push(prod);
                let tarjetaProducto = document.createElement("div");
                tarjetaProducto.classList.add("card");
                tarjetaProducto.innerHTML = `
                    <img class="card-img-top" src=${prod.imagen}>
                    <div class="card-body">
                        <h4 class="card-title">${prod.nombre}</h4>
                        <h5 class="precio">$ ${prod.precio}</h5>
                        <button id="${prod.id}" class="btn btn-prod">Comprar</button>
                    </div>`;
                document.querySelector(".row").append(tarjetaProducto);

                const botonesProductos = document.querySelectorAll(".btn-prod");
                botonesProductos.forEach((btn) => {
                    btn.addEventListener("click", agregarAlCarrito);
                });
                
            })
            recuperarCarrito();
        })
    }

    let contenedorCarrito = document.querySelector("#carrito"); 

    //Se ejecuta cuando se presiona "Confirmar pago" en el carrito y dependiendo de si hay o no elementos en el, se llama a la función de confirmar compra o al de error.
    function comprarCarrito() {
        (contenedorCarrito.hasChildNodes())?mensajeConfirmarCompra():mensajeErrorCompra(); 
    }

//Alerta que aparece al presionar "Confirmar pago" sobre el carrito, y le pregunta al usuario si desea proceder.
    function mensajeConfirmarCompra(){
        Swal.fire({
            title: '¿Desea proceder a la compra?',
            icon: 'question',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonColor: 'rgb(41, 8, 230)',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Comprar'
        }).then((result) => { (result.isConfirmed) && confirmarCompra()})
    }

//Alerta que se despliega cuando no hay productos en el carrito y se intenta comprar
    function mensajeErrorCompra(){
        Swal.fire({
            title: 'Error',
            text: 'No hay productos en el carrito',
            icon: 'error',
            confirmButtonColor: 'rgb(41, 8, 230)'
        })
    }

//Se invoca cuando se confirma la compra mediante el boton "Comprar" de la alerta
    function confirmarCompra(){
        vaciarCarrito();
        Swal.fire({
            title: 'Productos comprados',
            text: '¡Gracias por confiar en nosotros!',
            icon: 'success',
            confirmButtonColor: 'rgb(41, 8, 230)'
        })
    }

//Se llama al concretar una compra o al presionar el botón "Vaciar" sobre el carrito
    function vaciarCarrito() {
        while (contenedorCarrito.hasChildNodes()) {
            contenedorCarrito.removeChild(contenedorCarrito.firstChild);
        }
        productosCarrito = [];
        actualizacionCarrito(productosCarrito);
        inicializarBotones();
        inicializarCarrito();
    }



    function cambiarCantidadProducto(e) {
        const entrada = e.target;
        let productosLocales = JSON.parse(localStorage.getItem("carrito"));
        let productoVariado = productosLocales.find((prod) => `#${prod.id}` === this.id);
        console.log(productoVariado);
        productoVariado.cantidad = entrada.value;
        actualizarTotal(productosLocales);
    }

//Se ejecuta al presionar el boton "Eliminar", y actualiza el total del carrito removiendo todos los elementos de ese producto.
    function eliminarProductoCarrito() {
        let productosLocales = JSON.parse(localStorage.getItem("carrito"));
        let productoAEliminar = productosLocales.find((prod) => `#${prod.id}` === this.id);
        let idProducto = productoAEliminar.id;
        let btnProducto = document.getElementById(idProducto);
        document.getElementById(idProducto).innerHTML = "Comprar";
        btnProducto.disabled = false;
        let posicionProducto = productosLocales.indexOf(productoAEliminar);
        productosLocales.splice(posicionProducto, 1);
        localStorage.setItem("carrito", JSON.stringify(productosLocales));
        actualizacionCarrito(productosLocales);
    }


//Se ejecuta cuando se presiona "Comprar" en un producto. Adquiere sus propiedades y valores y los agrega llamando a "agregarProducto". Finalmente actualiza el monto total.
    function agregarAlCarrito(e) {
        let boton = e.target;
        boton.setAttribute("disabled", true);
        boton.innerHTML = "Agregado";
        let producto = productos.find((prod) => prod.id == boton.id);
        producto.cantidad = 1;
        let productosLocales = JSON.parse(localStorage.getItem("carrito"));
        productosLocales.push(producto);
        localStorage.setItem("carrito", JSON.stringify(productosLocales));
        actualizacionCarrito(productosLocales);
        actualizacionBotones(productosLocales);
    }


    function actualizacionCarrito(productosCarrito) {
        contenedorCarrito.innerHTML = "";
        productosCarrito.forEach((prod) => {
            let filaCarrito = document.createElement("div");
            filaCarrito.classList.add("cart-row");
            filaCarrito.innerHTML += `
            <div class="cart-item cart-column">
            <img class="cart-item-image" src="${prod.imagen}">
            <span class="cart-item-title">${prod.nombre}</span>
            </div>
            <span class="cart-price cart-column">${prod.precio}</span>
            <div class="cart-quantity cart-column">
            <input id="#${prod.id}" type="number" min="1" value=${prod.cantidad} class="cart-quantity-input">
            <button id="#${prod.id}" class="btn btn-danger" type="button">Eliminar</button>
            </div>
            `;
            contenedorCarrito.appendChild(filaCarrito);
        })
        
        let inputsCantidad = document.querySelectorAll(".cart-quantity-input");
        inputsCantidad.forEach((input) => {
            input.addEventListener('change', cambiarCantidadProducto);
        })

        let botonesEliminar = document.querySelectorAll(".btn-danger");
        botonesEliminar.forEach((boton) => {
            boton.addEventListener('click', eliminarProductoCarrito);
        })


        actualizarTotal(productosCarrito);
    }

    //Se llama al agregar un producto al carrito y al recuperarlo desde el localStorage. Se establece el boton de este a deshabilitado para que no se pueda duplicar
    function actualizacionBotones(productosCarrito){
        const botonesProductos = document.querySelectorAll(".btn-prod");
        productosCarrito.forEach((prod) => {
            botonesProductos.forEach((btn) => {
                (prod.id == btn.id) && establecerProductoAgregado(prod);
            })
        })
    }
    
    //Actualiza el estado de un boton cuando el producto fue agregado al carrito
    function establecerProductoAgregado(producto){
        let botonAdd = document.getElementById(`${producto.id}`);
        botonAdd.setAttribute("disabled", true);
        botonAdd.innerHTML = "Agregado"; 
    }

    //Se reinicia el botón, pero dado que el producto fue comprado, queda inhabilitado para otra compra
    function inicializarBotones(){
        const botonesProductos = document.querySelectorAll(".btn-prod");
        botonesProductos.forEach((btn) => {
            btn.innerHTML = "Comprar";
            btn.removeAttribute("disabled");
        })
    }

    //Actualiza el importe del carrito, recorriendo dicho array y acumulando el precio de cada uno. Finalmente muestra el valor en el HTML.
    function actualizarTotal(carrito) {
        let totalCarrito = carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
        document.querySelector(".cart-total-price").innerText = `$${totalCarrito}`;
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }
    
    //Recupera el carrito si hay elementos en el localStorage, o instancia uno nuevo en este en caso contrario.
    function recuperarCarrito() {
        (localStorage.getItem("carrito") !== null)?dibujarProductosDesdeDB():inicializarCarrito();
    }

    //Al recuperar el carrito, se actualizan los botones y elementos correspondientes que estaban en este.
    function dibujarProductosDesdeDB(){
        let productosRecuperados = JSON.parse(localStorage.getItem("carrito"));
        actualizacionBotones(productosRecuperados);
        actualizacionCarrito(productosRecuperados);
    }

    //Se inicializa un item en localStorage de clave "carrito" y vacío
    function inicializarCarrito() {
        localStorage.setItem("carrito", "[]");
    }

    //1 - Se crean los productos
    let productos = [];    
    
    //2 - Introducimos el contenido de los productos en un contenedor en forma de fila (row) y los cargamos al arreglo definido anteriormente
    inicializarHTML();

    //3- Asignamos eventos a los botones de comprar y vaciar carrito
    document.getElementsByClassName('confirmarCarrito')[0].addEventListener('click', comprarCarrito);
    document.getElementsByClassName('vaciarCarrito')[0].addEventListener('click', vaciarCarrito);
};
