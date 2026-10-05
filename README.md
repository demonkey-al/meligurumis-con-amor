# Meligurumis con Amor

Pre-Entrega del curso de Front-End. Página de presentación y catálogo simple de un emprendimiento de crochet y amigurumis hechos a mano.

## Objetivo y tecnologías

Aplicar lo visto en las clases 1 a 8: HTML5 semántico, CSS externo, Google Fonts, modelo de caja, Flexbox, Grid, Media Queries, Git y GitHub. No incluye JavaScript, frameworks, carrito ni backend propio.

## Organización

- `index.html`: inicio, productos, reseñas y contacto en una sola página.
- `css/styles.css`: estilos y adaptación a celular, tablet y computadora.
- `img/`: logo y tres imágenes locales de los trabajos.
- `README.md`: descripción e instrucciones.

Productos usa Flexbox con `flex-wrap`; reseñas usa Grid con una, dos o tres columnas. Las Media Queries de 768px y 992px adaptan el diseño. El contacto pasa de una columna a texto y formulario uno al lado del otro.

## Cómo verlo

Abrir `index.html` en el navegador o usar Live Server desde Visual Studio Code. No requiere instalación de paquetes. Google Fonts y los enlaces externos necesitan conexión a Internet.

## Formspree

El formulario usa `action="https://formspree.io/f/mjygvpvj"` y `method="POST"`. Nombre, email y mensaje tienen `label`, `name` y `required`.

Formspree recibe los datos y gestiona las notificaciones sin que tengamos que programar un servidor. La cuenta y el formulario “Contacto Meligurumis” ya están creados. No se usa JavaScript.

Para cambiar el destino, crear otro formulario en Formspree y reemplazar la URL del atributo `action` por el endpoint que proporcione el servicio. Verificar siempre la recepción de una consulta de prueba.

## Contenido e imágenes

Las tres reseñas son espacios demostrativos, no testimonios reales. Reemplazarlas únicamente con comentarios verificables y autorizados.

Las imágenes se guardaron localmente desde el perfil público indicado por el dueño del proyecto. Son portadas de publicaciones, no fotografías originales en alta resolución:

- `img/logo.jpg`: imagen del [perfil de Meligurumis con Amor](https://www.instagram.com/meligurumis_con_amor/).
- `img/muneca-crochet.jpg`: [muñeca de cabello azul](https://www.instagram.com/meligurumis_con_amor/reel/DbUJpPctBn6/).
- `img/gato-negro.jpg`: [gatito negro](https://www.instagram.com/meligurumis_con_amor/reel/DaN6PCmBiEq/).
- `img/gato-tricolor.jpg`: [gatito tricolor](https://www.instagram.com/meligurumis_con_amor/reel/DaN55DnBAV2/).

Se pueden reemplazar por los archivos originales del emprendimiento. Al cambiarlos, actualizar también los atributos `width`, `height` y `alt` si corresponde. No se publicaron precios, medidas, materiales específicos ni datos de contacto no confirmados. La disponibilidad se consulta en Instagram.

## Publicación

- Repositorio GitHub: pendiente de creación y verificación.
- Sitio publicado: pendiente de activar y verificar GitHub Pages.

Para publicar: crear el repositorio público `meligurumis-con-amor`, subir la rama `main` y elegir Settings → Pages → Deploy from a branch → `main` → `/ (root)`. Agregar aquí los enlaces reales cuando estén verificados.
