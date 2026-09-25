# Wikinguin

Wikinguin es una aplicación para organizar y compartir enlaces de aprendizaje. El proyecto incluye una implementación SPA con JavaScript Vanilla y otra con React, ambas conectadas a la misma API REST.

## Estructura

```text
backend/       API REST, modelos y MongoDB
front_vanilla/ Implementación SPA con JavaScript puro
front_react/   Implementación React con componentes
docs/          Requisitos del challenge
```

## Requisitos

- Node.js 20.19 o superior.
- npm.
- MongoDB local en el puerto `27100`, usando la base `link_manager`.
- Backend en el puerto `3000`.

## Ejecutar el backend

Desde la raíz del proyecto:

```powershell
Set-Location .\backend
Copy-Item .env.example .env
```

Configura `backend/.env`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27100/link_manager
```

Instala y ejecuta:

```powershell
npm install
npm run dev
```

API base:

```text
http://localhost:3000/api/links
```

## Ejecutar Vanilla

Vanilla no necesita instalación de dependencias, pero debe servirse mediante un servidor estático:

```powershell
Set-Location .\front_vanilla
python -m http.server 5174
```

Abre `http://localhost:5174`.

## Ejecutar React

En otra terminal:

```powershell
Set-Location .\front_react
npm install
npm run dev
```

Abre la dirección indicada por Vite, normalmente `http://localhost:5173`.

## API

| Método | Ruta | Función |
|---|---|---|
| `GET` | `/api/links` | Listar links |
| `GET` | `/api/links?tag=javascript` | Filtrar por etiqueta |
| `GET` | `/api/links/:id` | Obtener detalle |
| `POST` | `/api/links` | Crear link |
| `PUT` | `/api/links/:id` | Actualizar link |
| `DELETE` | `/api/links/:id` | Eliminar link |
| `POST` | `/api/links/:id/vote` | Votar |
| `GET` | `/api/links/:id/comments` | Listar comentarios |
| `POST` | `/api/links/:id/comments` | Crear comentario |

No hay autenticación. Los autores de los comentarios se escriben manualmente.

## Funcionalidades

- Listado y filtro local por etiquetas.
- Etiquetas visibles y utilizables.
- Creación de links.
- Vista de detalle.
- Votación desde el listado y el detalle.
- Consulta y creación de comentarios.
- Navegación SPA entre listado y detalle.

## Validación

React:

```powershell
Set-Location .\front_react
npm run lint
npm run build
```

Backend:

```powershell
Set-Location .\backend
node --check app.js
```

No hay framework de pruebas automatizadas configurado; la validación funcional se realiza contra la API y los frontends con el backend local.

## Git y despliegue

- `.env`, `node_modules`, builds y logs están excluidos por `.gitignore`.
- Revisa los cambios antes de subirlos con `git status`.
- Para desplegar, configura `MONGODB_URI`, `PORT` y CORS en el servidor.
- Ejecuta `npm run build` en React y sirve `front_react/dist/` como archivos estáticos.
- Para Vanilla, sirve `front_vanilla/` como archivos estáticos.
- Cambia la URL local de la API en ambos frontends antes de construir para producción.

La documentación específica de React está en [`front_react/README.md`](front_react/README.md).
