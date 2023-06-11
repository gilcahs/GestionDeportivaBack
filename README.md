# GestionDeportivaBack

GestionDeportivaBack es un servidor backend construido con Node.js y Express.js para gestionar la reserva de pistas deportivas. Utiliza MongoDB como base de datos y está diseñado para ser fácil de usar y altamente escalable.

## Tecnologías y Dependencias

El proyecto utiliza las siguientes tecnologías y dependencias:

- Node.js: Un entorno de ejecución de JavaScript en el servidor.
- Express.js: Un marco de aplicación web para Node.js.
- MongoDB: Una base de datos NoSQL orientada a documentos.
- Mongoose: Una biblioteca de JavaScript que proporciona una solución de modelado de objetos para MongoDB.
- bcryptjs: Una biblioteca para hashear y verificar contraseñas.
- cors: Un paquete de Node.js para proporcionar un middleware Connect/Express que puede utilizarse para habilitar CORS con varias opciones.
- dotenv: Un módulo de cero dependencias que carga variables de entorno de un archivo .env a process.env.
- express-validator: Un conjunto de middlewares de validación y saneamiento para Express.js.
- jsonwebtoken: Una implementación de JSON Web Tokens.
- nodemailer: Un módulo para Node.js para enviar correos electrónicos fácilmente.

## Diseño de la Base de Datos

El proyecto utiliza MongoDB como base de datos y Mongoose para modelar los datos. Los datos se almacenan en la nube a través de MongoDB Atlas. Los modelos de datos incluyen Usuario, Pista, Deporte y Reserva.

## Servicios CRUD

El proyecto proporciona una serie de servicios CRUD para gestionar usuarios, pistas, deportes y reservas. Cada servicio tiene su propio endpoint, parámetros y tipo de servicio. Los servicios incluyen la creación de nuevos usuarios, pistas, deportes y reservas, la actualización de usuarios y pistas, la obtención de usuarios, pistas, deportes y reservas, y la eliminación de usuarios, pistas y reservas.

## Middlewares

El proyecto utiliza varios middlewares para validar las peticiones, autenticar a los usuarios y gestionar los roles. Los middlewares incluyen la validación de campos, la validación de JWT, la validación de roles, la validación de deportes, la validación de pistas y la validación de reservas.

## Autenticación

El proyecto utiliza JWT para la autenticación de usuarios. Los tokens se generan cuando un usuario inicia sesión y se utilizan para autenticar las peticiones subsiguientes del usuario.

## Instrucciones de Instalación

1. Clona el repositorio en tu máquina local.
2. Navega hasta el directorio del proyecto.
3. Ejecuta `npm install` para instalar las dependencias.
4. Crea un archivo `.env` en la raíz del proyecto y añade tus variables de entorno.
5. Ejecuta `npm start` para iniciar el servidor.

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o realiza un pull request si tienes algo que añadir.

## Licencia

GestionDeportivaBack está licenciado bajo la licencia MIT.
