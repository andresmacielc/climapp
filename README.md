# ClimApp

## 📄 Descripción

Aplicación web de consulta del clima que utiliza la API de OpenWeather para mostrar pronósticos en tiempo real.

## 🛠️ Tecnologías

* HTML, CSS, JavaScript
* API: OpenWeatherMap
* Opcional: notificaciones de navegador, localStorage

## 🚀 Características

* Búsqueda de ciudad y visualización de temperatura, humedad y clima
* Animaciones CSS según condiciones climáticas
* Gestión de preferencias de usuario en `localStorage`
* Notificaciones del navegador con pronósticos diarios

## 🛠️ Requisitos previos

* Navegador moderno
* Clave de API de OpenWeatherMap

## ⚙️ Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/andresmacielc/climapp.git
   cd climapp
   ```
2. Obtén tu API Key en [https://openweathermap.org/](https://openweathermap.org/) y crea un archivo `.env` en la raíz:

   ```env
   API_KEY=TU_API_KEY
   ```
3. Abre `index.html` en tu navegador o sirve con un servidor local:

   ```bash
   npx http-server .
   ```

## ⚙️ Configuración

* Ajusta `API_KEY` en `.env` y reinicia la aplicación.

## 🚨 Uso

* Ingresa el nombre de la ciudad en el buscador y presiona Enter.
* Activa o desactiva notificaciones en la interfaz.

## 📁 Estructura de Proyecto

climapp/
├── css/
├── js/
│   ├── app.js
│   └── notifications.js
├── images/
└── index.html


## 🤝 Contribuciones

1. Fork > rama > pull request.

## 📄 Licencia

MIT
