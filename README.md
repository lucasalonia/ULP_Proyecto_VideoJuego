# ULP Proyecto VideoJuego

## Descripción del Proyecto

Este repositorio contiene la aplicación web del **Juego Educativo del Área de Pensamiento Lógico de la Universidad de La Punta (ULP)**.  
El sistema gestiona el acceso y autenticación de usuarios, incluyendo registro, inicio de sesión, recuperación de contraseñas y administración general de cuentas.

---

## Tabla de Contenidos

1. [Tecnologías Utilizadas](#tecnologías-utilizadas)  
2. [Estructura del Proyecto](#estructura-del-proyecto)  
3. [Instalación y Configuración](#instalación-y-configuración)  
4. [Variables de Entorno](#configuración-del-entorno)  
5. [Scripts Disponibles](#scripts-disponibles)  
6. [Flujos Principales](#flujos-principales)  
7. [Estructura de Autenticación](#estructura-de-autenticación)  
8. [Contribuciones](#contribuciones)  
9. [Licencia](#licencia)

---

## Tecnologías Utilizadas

El proyecto está construido sobre una pila moderna basada en Node.js:

- Node.js  
- Express  
- Pug (Jade)  
- Bootstrap 5  
- jQuery / Fetch API  
- Toastr.js  
- JSON Web Tokens (JWT)  
- Nodemailer  
- bcrypt  

---

## Estructura del Proyecto

/project-root
│
├── app.js
├── package.json
├── README.md
├── .env # Variables de entorno (no se sube al repo)
│
├── src
│ ├── API/ # Endpoints o módulos externos si aplica
│ ├── config/ # Configuración de la base de datos y otros ajustes globales
│ ├── controllers/ # Controladores de la lógica del sistema
│ ├── db/ # Esquema referancial de la base de datos
│ ├── middlewares/ # Middlewares (autenticación, validaciones, contexto para vistas)
│ ├── models/ # Modelos de datos
│ ├── public/ # Archivos estáticos (CSS, JS, imágenes)
│ ├── routes/ # Rutas de la aplicación
│ ├── services/ # Servicios (email, hashing-autenticacion)
│ └── views/ # Plantillas Pug

---

## Instalación y Configuración

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/lucasalonia/ULP_Proyecto_VideoJuego.git](https://github.com/lucasalonia/ULP_Proyecto_VideoJuego.git)
    ```

2.  **Acceder al directorio del proyecto:**
    ```bash
    cd ULP_Proyecto_VideoJuego
    ```

## Configuración del Entorno

Este proyecto utiliza **variables de entorno** para su configuración.

1.  Copia el archivo de ejemplo para crear tu archivo de configuración personal (`.env`):

    ```bash
    cp .env.example .env
    ```

2.  Edita el archivo **`.env`** y reemplaza los valores de ejemplo con tus credenciales y configuraciones específicas.




<--------------------------------------------- .env Basico !------------------------------------------->

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=comarcas_1
DB_PORT=3306
PORT=3309
JWT_SECRET_KEY="ClaveSecretaParaComarcasDeSanLuisUnProyectoDeLaULP"
JWT_ISSUER="Comarcas de San Luis ULP"
JWT_AUDIENCE="Jugadores"
MAIL_USER=testcomarcas@gmail.com
MAIL_PASS=alsk bqpm tykf tvij
