# Tienda de Ropa

## Descripción

Esta es una aplicación web de una tienda de ropa con un catálogo de productos y un dashboard para el administrador. Los productos se guardarán en una base de datos de mongo en Atlas

## Tecnologías Utilizadas

- Node.js
- Express.js
- MongoDB
- Mongoose
- HTML
- CSS

## Instalación

### Prerrequisitos

Tener instalado Node.js y MongoDB en tu sistema.

### Pasos

1. Clona el repositorio de github:
    ```bash
    git clone https://github.com/FennecNaN/backend-project-break.git
    ```
2. Instala las dependencias:
    ```bash
    npm install express mongoose dotenv bcryptjs express-session
    ```
3. Crea un archivo `.env` en la raíz del proyecto y añade las variables de entorno PORT para el puerto y MONGO_URI :
    ```env
    PORT= XXXX
    MONGO_URI = mongodb+srv://<usuario>:<password>@cluster0tucluster.xxxxxx.mongodb.net/
    SESSION_SECRET= el secreto que vayas a utilizar
    ```
4. Inicia la aplicación:
    ```bash
    npm run dev
    ```

La aplicación debería ejecutarse en el puerto indicado `http://localhost:xxxx`.

## Endpoints

### Usuarios

- `GET /products` - Devuelve todos los productos.
- `GET /products/:productId` - Devuelve el detalle de un producto específico por su ID.

### Administrador

- `GET /dashboard` - Panel de administrador con opciones para editar y eliminar productos.
- `GET /dashboard/new` - Formulario para crear un nuevo producto.
- `POST /dashboard` - Crea un nuevo producto.
- `GET /dashboard/:productId/edit` - Formulario para editar un producto existente.
- `POST /dashboard/:productId/edit` - Actualiza un producto existente.
- `POST /dashboard/:productId/delete` - Elimina un producto existente.

## Estructura del Proyecto

```
.
├── src
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   ├── productController.js
│   │   └──authController.js (BONUS)
│   ├── models
│   │   ├── User.js
│   │   └── Product.js
│   ├── routes
│   │   └── productRoutes.js
│   │   └── authRoutes.js
│   ├── middlewares
│   │   └── authMiddleware.js
│   └── index.js
├── public
│   ├── styles.css
│   └── images (OPCIONAL)
├── .env
└── package.json

```