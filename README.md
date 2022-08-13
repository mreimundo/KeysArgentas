# KeysArgentas
Simulación de una página con diseño poco trabajado y con enfoque en la funcionalidad de la misma, con el fin de cumplir los requisitos estipulados por la entrega final del curso "JavaScript" en la plataforma Coderhouse.

KeysArgentas es un negocio digital (e-commerce) de venta de llaves de acceso para distintos productos de software, como pueden ser juegos, sistemas operativos, herramientas, entre otros.

El proyecto se llevó a cabo utilizando el editor de texto Visual Studio Code y cuenta con lenguaje escrito en HTML, CSS, JavaScript, y se hizo uso del framework Bootstrap y librería SweetAlert2.

¿Con qué interactúa el cliente en KeysArgentas?
-----------------------------------------------
El usuario hace uso de las tarjetas que representan el catálogo del e-commerce, donde al presionar "Comprar" se agrega el producto en cuestión a un carrito y en el mismo puede añadir más cantidad, eliminarlo, vaciar el carrito, o proceder a una hipotética compra.

Organización del proyecto
-------------------------
La estructura de la información está diseñada en HTML con etiquetas estáticas, donde se les brindó un diseño simple en CSS y con uso de Bootstrap.

La información de cada producto se almacena en un archivo JSON y se guarda en un array de objetos convertido en JavaScript mediante un fetch. Una vez obtenidos los productos, se crean las tarjetas y el contenido desde el mismo script.

Finalmente, se declaran los eventos de cada botón y entrada cuando el usuario interactúa con algún elemento.

Notas
-----
- Según la interacción que el usuario tenga con los componentes, los cambios de los botones de cada producto y el carrito se almacenan en localStorage, de manera tal que es posible recuperarlos luego de que se pierda una sesión.
- La página no es responsive.
