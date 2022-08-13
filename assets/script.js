//Código en el cual el usuario selecciona los productos que quiere agregar al carrito y se agregan al carrito, en donde puede incrementar/reducir la cantidad, eliminar el producto,
//vaciar el carrito o comprarlo.
window.onload = function() {
    // --------- Variables y constantes globales -----------
    const contenedorCarrito = document.querySelector("#carrito"); 
    let productos = [];    

    inicializarHTML();
    
    //Se obtienen los datos de los productos a partir de un JSON y se crean las tarjetas correspondientes a cada uno. Luego, se recupera el carrito y termina de inicializarse el HTML
    //definiendo los eventos para la compra del carrito.
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
            document.getElementsByClassName('confirmarCarrito')[0].addEventListener('click', comprarCarrito);
            document.getElementsByClassName('vaciarCarrito')[0].addEventListener('click', vaciarCarrito);
        })
    }

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

    //Alerta que se despliega cuando no hay productos en el carrito y se intenta comprar.
    function mensajeErrorCompra(){
        Swal.fire({
            title: 'Error',
            text: 'No hay productos en el carrito',
            icon: 'error',
            confirmButtonColor: 'rgb(41, 8, 230)'
        })
    }

    //Se invoca cuando se confirma la compra mediante el boton "Comprar" de la alerta. Vacía el carrito de los productos comprados e imprime una alerta por pantalla.
    function confirmarCompra(){
        vaciarCarrito();
        Swal.fire({
            title: 'Productos comprados',
            text: '¡Gracias por confiar en nosotros!',
            icon: 'success',
            confirmButtonColor: 'rgb(41, 8, 230)'
        })
    }

    //Se llama al concretar una compra o al presionar el botón "Vaciar" sobre el carrito. Remueve cada nodo del carrito hasta que no tenga hijos y vacía el arreglo, actualizando los
    //componentes.
    function vaciarCarrito() {
        while (contenedorCarrito.hasChildNodes()) {
            contenedorCarrito.removeChild(contenedorCarrito.firstChild);
        }
        let productosCarrito = [];
        actualizacionCarrito(productosCarrito);
        inicializarBotones();
        inicializarCarrito();
    }

    //Se ejecuta cuando se presiona "Comprar" en un producto. Adquiere sus propiedades y valores, y compara ese id con los del array "productos". Finalmente lo agrega al carrito del
    //almacenamiento local y actualiza todos los componentes.
    function agregarAlCarrito(e) {
        let boton = e.target;
        cambiarBoton(boton);
        let producto = productos.find((prod) => prod.id == boton.id);
        producto.cantidad = 1;
        let productosLocales = obtenerCarrito();
        productosLocales.push(producto);
        almacenarCarrito(productosLocales);
        actualizacionCarrito(productosLocales);
        actualizacionBotones(productosLocales);
    }

    //Recibe los productos que tiene el carrito actualmente y dibuja en el HTML los productos agregados o modificados, junto a los controladores de eliminar producto y modificar
    //cantidad. Por último actualiza el total del carrito.
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

    //Se invoca cuando se modifica la cantidad de un producto que está en el carrito. Actualiza su valor y el nuevo total.
    function cambiarCantidadProducto(e) {
        const entrada = e.target;
        let productosLocales = obtenerCarrito();
        let productoVariado = productosLocales.find((prod) => `#${prod.id}` === this.id);
        productoVariado.cantidad = entrada.value;
        actualizarTotal(productosLocales);
    }
    

    //Se ejecuta al presionar el boton "Eliminar". Encuentra el producto mediante el id y actualiza el total del carrito removiendo todos los elementos de ese producto.
    function eliminarProductoCarrito() {
        let productosLocales = obtenerCarrito();
        let productoAEliminar = productosLocales.find((prod) => `#${prod.id}` === this.id);
        let btnProducto = document.getElementById(productoAEliminar.id);
        reiniciarBoton(btnProducto);
        let posicionProducto = productosLocales.indexOf(productoAEliminar);
        productosLocales.splice(posicionProducto, 1);
        almacenarCarrito(productosLocales);
        actualizacionCarrito(productosLocales);
    }
    

    //Actualiza el importe total del carrito, recorriendo dicho array y acumulando el precio de cada uno multiplicado por su cantidad. Finalmente actualiza el valor en el HTML.
    function actualizarTotal(carrito) {
        let totalCarrito = carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
        document.querySelector(".cart-total-price").innerText = `$${totalCarrito}`;
        almacenarCarrito(carrito);
    }

    //Recorre los botones y los productos, y si coinciden los id, cambia su estado.
    function actualizacionBotones(productosCarrito){
        const botonesProductos = document.querySelectorAll(".btn-prod");
        productosCarrito.forEach((prod) => {
            botonesProductos.forEach((btn) => {
                (prod.id == btn.id) && establecerProductoAgregado(prod);
            })
        })
    }
    
    //Actualiza el estado de un boton cuando el producto fue agregado al carrito para que no pueda duplicarse.
    function establecerProductoAgregado(producto){
        let boton = document.getElementById(`${producto.id}`);
        cambiarBoton(boton);
    }

    //Recibe un boton y lo deshabilita estableciéndolo como agregado.
    function cambiarBoton(boton){
        boton.setAttribute("disabled", true);
        boton.innerHTML = "Agregado";
    }

    //Vuelve a los botones a su estado inicial cuando se vacía el carrito.
    function inicializarBotones(){
        const botonesProductos = document.querySelectorAll(".btn-prod");
        botonesProductos.forEach((btn) => reiniciarBoton(btn))
    }
    
    //Recibe un boton y lo restablece a su estado inicial.
    function reiniciarBoton(boton){
        boton.innerHTML = "Comprar";
        boton.removeAttribute("disabled");
    }
    
    //Obtiene el carrito desde el almacenamiento local y lo retorna al lugar de invocación.
    function obtenerCarrito() {
        return JSON.parse(localStorage.getItem("carrito"));
    }
    
    //Establece la nueva información del carrito al almacenamiento local.
    function almacenarCarrito(carrito){
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    //Recupera el carrito si hay elementos en el localStorage, o instancia uno nuevo en este en caso contrario.
    function recuperarCarrito() {
        (localStorage.getItem("carrito") !== null)?dibujarProductosDesdeDB():inicializarCarrito();
    }

    //Al recuperar el carrito, se actualizan los botones y elementos correspondientes que estaban en este.
    function dibujarProductosDesdeDB(){
        let productosRecuperados = obtenerCarrito();
        actualizacionBotones(productosRecuperados);
        actualizacionCarrito(productosRecuperados);
    }

    //Se inicializa un item en localStorage de clave "carrito" y vacío.
    function inicializarCarrito() {
        localStorage.setItem("carrito", "[]");
    }

};
