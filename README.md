# Meligurumis con Amor

Proyecto Final de Front-End: sitio e-commerce responsive para un emprendimiento de crochet y amigurumis. Incluye catálogo dinámico, carrito persistente, validación de contacto y simulación de compra.

## Funcionalidades

- Estructura semántica con navegación interna.
- Catálogo cargado con Fetch desde la API REST de [DummyJSON](https://dummyjson.com/docs/products).
- Tarjetas dinámicas con imagen, título, descripción, precio y acción de compra.
- Catálogo artesanal local de respaldo si la API no está disponible.
- Carrito con cantidades editables, eliminación de productos, subtotales y total.
- Persistencia del carrito mediante localStorage.
- Contador de unidades actualizado en tiempo real.
- Simulación de compra con feedback visible.
- Formulario conectado a Formspree con validación desde JavaScript.
- Diseño responsive y navegación accesible mediante teclado.
- Mensajes dinámicos anunciados con regiones aria-live.

> Los artículos cargados desde DummyJSON son datos de demostración y no representan el stock real del emprendimiento. La finalización de compra también es una simulación: no procesa pagos.

## Tecnologías

- HTML5 semántico.
- CSS3.
- Bootstrap 5.3.3 mediante CDN oficial con Subresource Integrity.
- Flexbox para productos.
- CSS Grid para reseñas y distribución del carrito.
- Media Queries para contacto y adaptación responsive.
- JavaScript Vanilla.
- Fetch API.
- Web Storage API (localStorage).
- Formspree.
- Google Fonts (Nunito).

## Estructura

    .
    ├── css/
    │   └── styles.css
    ├── img/
    │   ├── gato-negro.jpg
    │   ├── gato-tricolor.jpg
    │   ├── logo.jpg
    │   └── muneca-crochet.jpg
    ├── js/
    │   └── script.js
    ├── .gitignore
    ├── index.html
    ├── netlify.toml
    └── README.md

## Ejecución local

El proyecto no requiere instalación de dependencias ni proceso de compilación. Debido al consumo de recursos externos, se recomienda servirlo mediante HTTP:

1. Abrir la carpeta en Visual Studio Code.
2. Iniciar index.html con la extensión Live Server.
3. Abrir la URL local indicada por Live Server.

También se puede usar cualquier servidor estático:

    python3 -m http.server 8000

Después, visitar http://localhost:8000.

## Catálogo y carrito

El archivo js/script.js consulta la categoría home-decoration de DummyJSON. Si la consulta falla o no devuelve productos válidos, se muestran tres artículos locales de respaldo.

El carrito se guarda con la clave meligurumis-carrito. Cada modificación vuelve a calcular:

- Cantidad total de unidades.
- Subtotal por producto.
- Total general.

La información permanece disponible al recargar o cerrar el navegador hasta que se elimine manualmente, se finalice la compra simulada o se borren los datos del sitio.

## Formulario de contacto

El formulario envía nombre, correo electrónico y mensaje al endpoint configurado de Formspree. Antes del envío, JavaScript comprueba:

- Nombre obligatorio de al menos 2 caracteres.
- Correo obligatorio con formato válido.
- Mensaje obligatorio de al menos 10 caracteres.

El resultado del envío se muestra dentro de la misma página. Para cambiar la cuenta receptora debe reemplazarse el atributo action del formulario en index.html.

## Accesibilidad y SEO

- Textos alternativos descriptivos.
- Indicadores de foco visibles.
- Enlace para saltar al contenido principal.
- Etiquetas y errores asociados a los campos.
- Controles del carrito con nombres accesibles.
- Soporte para prefers-reduced-motion.
- Meta description, robots, Open Graph, idioma y tema de navegador.

## Despliegue

- [Repositorio en GitHub](https://github.com/demonkey-al/meligurumis-con-amor)
- [GitHub Pages](https://demonkey-al.github.io/meligurumis-con-amor/)
- La URL de Netlify se añadirá después del primer despliegue.

El archivo netlify.toml publica directamente la raíz del repositorio porque el sitio es estático y no necesita un comando de build.

## Créditos de imágenes

Las imágenes locales se guardaron desde el perfil público del emprendimiento con autorización del responsable del proyecto:

- [Instagram de Meligurumis con Amor](https://www.instagram.com/meligurumis_con_amor/)
- [Muñeca de cabello azul](https://www.instagram.com/meligurumis_con_amor/reel/DbUJpPctBn6/)
- [Gatito negro](https://www.instagram.com/meligurumis_con_amor/reel/DaN6PCmBiEq/)
- [Gatito tricolor](https://www.instagram.com/meligurumis_con_amor/reel/DaN55DnBAV2/)
