# Tienda de ropa

Vamos a montar una tienda de ropa con un catálogo de productos y un dashboard para el administrador. Los productos se guardarán en una base de datos de mongo en Atlas. Podemos usar como referencia el pdf [web_ejemplo.pdf](web_ejemplo.pdf) que contiene un ejemplo de cómo podría ser la interfaz de la tienda y el dashboard.

## Índice

  - [Estructura de archivos](#estructura-de-archivos)
  - [Creación de base de datos](#creación-de-base-de-datos)
  - [Creación del servidor](#creación-del-servidor)
  - [Creación de modelos](#creación-de-modelos)
  - [Creación de rutas](#creación-de-rutas)
  - [Creación de controladores](#creación-de-controladores)
  - [Despliegue](#despliegue)
  - [Documentación](#documentación)
  - [Bonus 1 - Tests](#bonus-1---tests)
  - [Bonus 2 - Autenticación con Firebase](#bonus-2---autenticación-con-firebase)
  - [Bonus 3 - API y documentación con Swagger](#bonus-3---api-y-documentación-con-swagger)
  - [Recursos](#recursos)

## Estructura de archivos

Vamos a crear la estructura de archivos que vamos a necesitar para el proyecto. 

```
.
├── src
│   ├── config
│   │   ├── db.js
│   │   └── firebase.js (BONUS)
│   ├── controllers
│   │   ├── productController.js
│   │   └──authController.js (BONUS)
│   ├── models
│   │   └── Product.js
│   ├── routes
│   │   └── productRoutes.js
│   │   └── authRoutes.js (BONUS)
│   ├── middlewares (BONUS)
│   │   └── authMiddleware.js
│   └── index.js
├── test (BONUS)
│   └── productController.test.js
├── public
│   ├── styles.css
│   └── images (OPCIONAL)
├── .env
└── package.json

```

### Características de los archivos

- `config/db.js`: Archivo que contendrá la configuración de la base de datos. Deberá conectarse a la base de datos de mongo en Atlas.
- `controllers/productController.js`: Archivo que contendrá la lógica para manejar las solicitudes CRUD de los productos. Devolverá las respuestas en formato HTML.
- `models/Product.js`: Archivo que contendrá la definición del esquema del producto utilizando Mongoose.
- `routes/productRoutes.js`: Archivo que contendrá la definición de las rutas CRUD para los productos. Este llama a los métodos del controlador.
- `index.js`: Archivo principal que iniciará el servidor Express. Importa las rutas y las usa. También tiene que estar configurado para servir archivos estáticos y para leer el body de las peticiones de formularios.
- `public/styles.css`: Archivo que contendrá los estilos de la aplicación (recomendable).
- `public/images`: Carpeta que contendrá las imágenes de los productos (opcional).Se puede evitar si se usan urls externas para las imágenes.
- `.env`: Archivo que contendrá las variables de entorno. En este caso, la uri de la base de datos de Atlas o el puerto de la aplicación. Más adelante añadiremos más variables de entorno, como la palabra secreta para la sesión.
- `package.json`: Archivo que contendrá las dependencias del proyecto. Crearemos un script para iniciar el servidor con node y otro para iniciar el servidor con nodemon.("start": "node src/index.js", "dev": "nodemon src/index.js").

**BONUS**
- `config/firebase.js`: Archivo que contendrá la configuración de firebase. Deberá inicializar la conexión con firebase.
- `controllers/authController.js`: Archivo que contendrá la lógica para manejar las solicitudes de autenticación. Devolverá las respuestas en formato HTML.
- `routes/authRoutes.js`: Archivo que contendrá la definición de las rutas para la autenticación. Este llama a los métodos del controlador.
- `middlewares/authMiddleware.js`: Archivo que contendrá el middleware para comprobar si el usuario está autenticado. Este buscará la sesión del usuario y, si no la encuentra, redirigirá al formulario de login.

## Creacíon de base de datos

Vamos a crear la base de datos en Atlas. Creamos un nuevo proyecto y lo desplegamos.

Una vez creada la base de datos, copiamos la uri y la guardamos en el archivo .env 
```
MONGO_URI=<uri_bd_atlas>
```

## Creación del servidor

Vamos a crear el servidor con express. El servidor devolverá las vistas usando template literals. Para interfaces más complejas, se podría usar un motor de plantillas como pug. También necesitaremos leer el body de las peticiones tipo post. Como trabajaremos con formularios html, necesitaremos el middleware `express.urlencoded` para leer el body de las peticiones.

Para poder añadir estilos, imágenes, etc. necesitaremos el middleware `express.static` para servir archivos estáticos. En nuestro caso, serviremos los archivos estáticos desde la carpeta `public`.

El puerto en el que escuchará el servidor lo cargaremos desde el archivo .env usando `dotenv`.


Creamos el archivo `index.js` en la carpeta `src` y añadimos el código necesario para crear el servidor. 

## Creación de modelo

Vamos a crear el modelo de producto. El modelo de producto tendrá los siguientes campos:

- Nombre
- Descripción
- Imagen
- Categoría
- Talla
- Precio

La categoría será un string que podrá ser "Camisetas", "Pantalones", "Zapatos", "Accesorios".

La talla será un string que podrá ser "XS", "S", "M", "L", "XL".


## Creación de rutas

Vamos a crear las rutas CRUD para los productos. Al usar formularios html, las rutas serán de tipo GET y POST.
 Las rutas deberían tener una estructura similar a esta:

- GET /products: Devuelve todos los productos. Cada producto tendrá un enlace a su página de detalle.
- GET /products/:productId: Devuelve el detalle de un producto.
- GET /dashboard: Devuelve el dashboard del administrador. En el dashboard aparecerán todos los artículos que se hayan subido. Si clickamos en uno de ellos nos llevará a su página para poder actualizarlo o eliminarlo.
- GET /dashboard/new: Devuelve el formulario para subir un artículo nuevo.
- POST /dashboard: Crea un nuevo producto.
- GET /dashboard/:productId: Devuelve el detalle de un producto en el dashboard.
- GET /dashboard/:productId/edit: Devuelve el formulario para editar un producto.
- PUT /dashboard/:productId: Actualiza un producto.
- DELETE /dashboard/:productId/delete: Elimina un producto.

## Creación de controladores

A continuación crearemos el controlador de productos. Este controlador se dedicará a manejar las solicitudes CRUD de los productos. Devolverá las respuestas en formato HTML.
Para ello, crearemos algunas funciones auxiliares que nos ayudarán a devolver las vistas con SSR.

Las funciones principales del controlador serán:

- showProducts: Devuelve la vista con todos los productos.
- showProductById: Devuelve la vista con el detalle de un producto.
- showNewProduct: Devuelve la vista con el formulario para subir un artículo nuevo.
- createProduct: Crea un nuevo producto. Una vez creado, redirige a la vista de detalle del producto o a la vista de todos los productos del dashboard.
- showEditProduct: Devuelve la vista con el formulario para editar un producto.
- updateProduct: Actualiza un producto. Una vez actualizado, redirige a la vista de detalle del producto o a la vista de todos los productos del dashboard.
- deleteProduct: Elimina un producto. Una vez eliminado, redirige a la vista de todos los productos del dashboard.

Las funciones showProducts y showProductById pueden devolver respuestas ligeramente distintas si se llega desde el dashboard o desde la vista principal. Por ejemplo, si se llega desde el dashboard, se mostrará un enlace para editar o eliminar el producto. Para ello podemos utilizar la url de la petición o pasar al controlador un parámetro extra que indique si se llega desde el dashboard o no.

Para generar el html de forma más eficiente y sacarlo de la lógica, podemos crear funciones y variables auxiliares que generen el html de los productos y del formulario.
Por ejemplo:
- baseHtml: html común a todas las páginas. Puede contener elementos como la importación de estilos, etc.
- getNavBar: Genera la barra de navegación con las categorías. En caso de estar en el dashboard, también generará un enlace para subir un nuevo producto.
- getProductCards: Genera el html de los productos. Recibe un array de productos y devuelve el html de las tarjetas de los productos.
- ...

Un ejemplo de una función para generar el html de los productos podría ser:

```javascript
function getProductCards(products) {
  let html = '';
  for (let product of products) {
    html += `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p>${product.price}€</p>
        <a href="/products/${product._id}">Ver detalle</a>
      </div>
    `;
  }
  return html;
}
```

Con estas funciones auxiliares, el controlador será más limpio y fácil de entender.
Ejemplo:

```javascript

const showProducts = async (req, res) => {
  const products = await Product.find();
  const productCards = getProductCards(products);
  const html = baseHtml + getNavBar() + productCards;
  res.send(html);
};
    
```

## Despliegue

Creamos un nuevo proyecto en fl0 y desplegamos el proyecto desde github. Recordad añadir las variables de entorno en fl0. Si no aparece el repositorio en fl0, tendremos que modificar los permisos de fl0 para que pueda acceder al repositorio.

## Documentación

Crearemos un archivo `README.md` que contenga la documentación del proyecto. En este readme explicaremos cómo poner en marcha la aplicación, las tecnologías que hemos usado, endpoints, etc.

## Bonus 1 - Tests

Para poder comprobar que el controlador de productos funciona correctamente, vamos a crear tests para las funciones. Para ello, necesitaremos instalar el paquete `jest` y crear el archivo `productController.test.js` en la carpeta `test`. En este archivo, importaremos el controlador y crearemos los tests. Podemos hacer tests tanto para las funciones que devuelven html como para las funciones que crean, actualizan o eliminan productos.

## Bonus 2 - API y documentación con Swagger

Para poder usar la aplicación con un frontend en React, vamos a crear una API que haga las mismas operaciones que el controlador de productos, pero que devuelva los datos en formato JSON. Documentaremos la API con Swagger, para que sea más fácil de entender y usar.

## Bonus 3 - Autenticación con Firebase

Vamos a crear un login y pass para el administrador con firebase. Para ello, necesitaremos instalar los paquetes `firebase` y `express-session` y configurar el proyecto en firebase. Podemos ver la guía de cómo hacerlo en el pdf [firebase.pdf](firebase.pdf).

Una vez configurado el proyecto en firebase, podremos crear un formulario de login. Este formulario enviará las credenciales a un endpoint que comprobará si son correctas. Si son correctas, redirigirá al dashboard. Si no, mostrará un mensaje de error. También tendremos una página de registro, a la que se podrá acceder desde el formulario de login. Además, tendremos que crear un archivo `firebase.js` que inicialice la conexión con firebase y que contenga las funciones para comprobar si las credenciales son correctas y para cerrar la sesión.

Para comprobar si las credenciales son correctas, necesitaremos el middleware `express-session` para guardar la sesión del usuario. Tendremos que modificar el archivo index.js para que inicialice el middleware y lo use en las rutas del dashboard. También tendremos que añadir una palabra secreta para la sesión en el archivo .env y crear un archivo `middlewares/authMiddleware.js` que contenga el middleware para comprobar si el usuario está autenticado. Este buscará la sesión del usuario y, si no la encuentra, redirigirá al formulario de login.



## Recursos

- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [Atlas](https://www.mongodb.com/cloud/atlas)
- [Fl0](https://fl0.io/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express-session](https://www.npmjs.com/package/express-session)
- [express.urlencoded](https://expressjs.com/en/api.html#express.urlencoded)
- [express.static](https://expressjs.com/en/api.html#express.static)
- [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
- [Pug](https://pugjs.org/api/getting-started.html)
- [Firebase](https://firebase.google.com/)
  - [Firebase Auth](https://firebase.google.com/docs/auth)
  - [Get Started with Firebase Authentication on Websites](https://firebase.google.com/docs/auth/web/start)


