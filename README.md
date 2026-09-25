# Wikinguin

Aplicación para guardar, filtrar y compartir enlaces de aprendizaje. Incluye una versión Vanilla JS y otra React, conectadas al mismo backend.

## Ejecutar el proyecto

### Requisitos

- Node.js 20.19 o superior.
- npm.
- MongoDB local en `localhost:27100`, base `link_manager`.
- Python para servir Vanilla estáticamente.

### 1. Backend

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

API disponible en `http://localhost:3000/api/links`.

### 2. Frontend Vanilla

En otra terminal, desde la raíz:

```powershell
Set-Location .\front_vanilla
python -m http.server 5174
```

Abre `http://localhost:5174`.

### 3. Frontend React

En otra terminal, desde la raíz:

```powershell
Set-Location .\front_react
npm install
npm run dev
```

Abre la dirección que indique Vite, normalmente `http://localhost:5173`.

## Carpetas

- `backend/`: API REST, conexión con MongoDB, modelos y controladores.
- `front_vanilla/`: primera versión SPA usando JavaScript y DOM.
- `front_react/`: versión SPA usando React, Vite y componentes reutilizables.

## Comandos útiles

Backend:

```powershell
Set-Location .\backend
npm start
```

React:

```powershell
Set-Location .\front_react
npm run lint
npm run build
npm run preview
```

## API rápida

- `GET /api/links`
- `GET /api/links/:id`
- `POST /api/links`
- `PUT /api/links/:id`
- `DELETE /api/links/:id`
- `POST /api/links/:id/vote`
- `GET /api/links/:id/comments`
- `POST /api/links/:id/comments`

No existe autenticación; los autores de comentarios se escriben manualmente.

## Git y configuración

- `.env`, `node_modules`, builds y logs están excluidos por `.gitignore`.
- Revisa los cambios con `git status` antes de subirlos.
- Para producción, cambia la URL de la API en ambos frontends antes de construir.
