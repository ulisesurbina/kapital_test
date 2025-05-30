# Desarrollo Frontend de obtención de datos del Clima Consumiendo una API

## Descripción
Este proyecto implementa una aplicación web completa con arquitectura React/JSX, que incluye componentes reutilizables, gestión de estado, y utilidades para el manejo de activos estáticos. La aplicación está diseñada para mostrar el estado del clima en su posición actual, de las ciudades que se busquen en el input y muestra las gráficas de información referida a esa locación.
Para poder detectar su ubicación actual debe permitir el servicio de geolocalización que aparece al cargar la página.
Para marcar/desmarcar una ciudad o país como favorito se debe hacer click en la estrella ⭐, por lo que se guardaran en la sección de favoritos mediante el local storage, en el cual se tiene las opción de poder eliminar.


# 📁 Estructura de Directorios
```
proyecto/
├── src/
│   ├── assets/             # Recursos estáticos (imágenes)
│   ├── components/         # Componentes React reutilizables
│   ├── data/               # Información para librerias
│   ├── utils/              # Utilidades y helpers
└── public/                 # Archivos públicos
```

# 🚀 Características Principales

Arquitectura Basada en Componentes: Utiliza React para crear una interfaz modular y reutilizable
Gestión de Estado: Implementación de patrones de estado para manejo de datos
Componentes UI Reutilizables: Biblioteca de componentes base para consistencia visual
Utilidades Modulares: Funciones auxiliares organizadas en módulos especializados
Gestión de Activos: Manejo optimizado de CSS e imágenes estáticas

# 🛠️ Tecnologías Utilizadas
Frontend: React, JSX, JavaScript ES6+, PrimeReact
Estilos: CSS3, Tailwind
Otras librerias: Chart.js, PrimeReact
APIS públicas: Weather API de OpenWeather

# 📦 Instalación

## Clonar el repositorio
git clone <https://github.com/ulisesurbina/kapital_test.git>

## Navegar al directorio del proyecto
cd nombre-del-proyecto

## Instalar dependencias
npm install

## Iniciar el proyecto
npm run dev

# 🐛 Solución de Problemas

## Errores Comunes
Error de dependencias: Ejecutar npm install para actualizar dependencias
Problemas de build: Limpiar cache con npm run clean

# 📄 Licencia
Este proyecto está bajo la Licencia de Ulises Urbina Maldonado
Desarrollador Frontend

# 📞 Soporte
Para soporte técnico o preguntas:

```
📧 Email: ulisesurbinam@gmail.com
🐛 GitHub: https://github.com/ulisesurbina
📖 Link de proyecto en Netlify: https://kapitaltest.netlify.app/
```