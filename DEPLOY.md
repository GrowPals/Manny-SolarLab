# Guía de Despliegue en Vercel

Este proyecto está listo para ser desplegado en Vercel. Sigue estos pasos:

## Prerrequisitos

1.  Asegúrate de tener una cuenta en [Vercel](https://vercel.com).
2.  Ten el código subido a un repositorio de GitHub, GitLab o Bitbucket.

## Pasos para Desplegar

1.  **Importar Proyecto**:
    *   Ve a tu dashboard de Vercel y haz clic en "Add New..." -> "Project".
    *   Selecciona tu repositorio git.

2.  **Configuración de Build**:
    *   Vercel debería detectar automáticamente que es un proyecto **Vite**.
    *   **Framework Preset**: `Vite`
    *   **Build Command**: `npm run build` (o `vite build`)
    *   **Output Directory**: `dist`

3.  **Variables de Entorno**:
    *   El archivo `vite.config.ts` está configurado para leer `GEMINI_API_KEY`. Si tu aplicación utiliza esta API (aunque no parece estar activa en el código actual), asegúrate de agregarla en la sección "Environment Variables" de Vercel.
    *   Nombre: `GEMINI_API_KEY`
    *   Valor: `tu_clave_api_aqui`

4.  **Desplegar**:
    *   Haz clic en "Deploy".

## Notas Adicionales

*   Se ha generado un archivo `vercel.json` para asegurar que las rutas funcionen correctamente (útil si expandes la app a múltiples rutas).
*   Se ha corregido un problema con `index.css` que faltaba.
*   Las dependencias están instaladas y el build local funciona correctamente.
