{
  "name": "mi-proyecto",  // Nombre de tu aplicación
  "version": "1.0.0",  // Versión del proyecto
  "main": "app.js",  // Archivo principal (solo relevante para el backend, no necesario en React)

  "scripts": {
    "start": "react-scripts start",  // Inicia el servidor de desarrollo React con `npm start`
    "build": "react-scripts build",  // Genera una versión optimizada para producción con `npm run build`
    "test": "react-scripts test",  // Ejecuta pruebas con `npm test`
    "eject": "react-scripts eject"  // Extrae configuraciones internas de React (irreversible)
  },

  "keywords": [],  // Puedes agregar palabras clave descriptivas para tu proyecto
  "author": "",  // Puedes poner tu nombre o el de tu equipo
  "license": "ISC",  // Tipo de licencia del proyecto
  "description": "",  // Descripción breve del proyecto

  "dependencies": {
    "react": "^18.2.0",  // Biblioteca principal para construir interfaces de usuario
    "react-dom": "^18.2.0",  // Permite que React interactúe con el DOM en el navegador
    "react-scripts": "latest",  // Herramientas necesarias para desarrollar con React (`create-react-app`)
    "axios": "^1.4.0"  // Biblioteca para hacer solicitudes HTTP a la API del backend
  }
}
