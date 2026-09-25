# Wikinguin React

Frontend React de Wikinguin para organizar, consultar y comentar enlaces reutilizando la API REST del backend.

## Requisitos

- Node.js 20.19 o superior.
- npm.
- Backend y MongoDB funcionando en el puerto configurado.
- API base local: `http://localhost:3000/api/links`.

## Puesta en marcha

1. Inicia el backend desde la carpeta `backend`:

   ```powershell
   cd ..\backend
   npm install
   npm run dev
   ```

2. En otra terminal, inicia React:

   ```powershell
   cd ..\front_react
   npm install
   npm run dev
   ```

3. Abre la dirección que muestra Vite, normalmente `http://localhost:5173`.

El backend debe estar ejecutándose antes de cargar la aplicación React.

## Scripts

```powershell
npm run dev       # servidor de desarrollo
npm run lint      # validaciones con Oxlint
npm run build     # build de producción en dist/
npm run preview   # sirve localmente el build
```

## Funcionalidades

- Listado de links desde la API.
- Filtro local por etiqueta, parcial e insensible a mayúsculas.
- Etiquetas visibles y utilizables para activar el filtro.
- Vista de detalle de un link.
- Votación desde el listado o el detalle.
- Consulta y creación de comentarios.
- Formulario para crear nuevos links.
- Layout responsivo de dos columnas en escritorio y una columna en móvil.

No existe autenticación ni gestión de usuarios. Los usuarios pueden enviar votos y los comentarios usan un autor escrito manualmente.

## Estructura

```text
front_react/
├── index.html
├── package.json
├── public/
└── src/
    ├── api.js
    ├── App.jsx
    ├── App.css
    ├── index.css
    ├── main.jsx
    └── components/
        ├── CommentForm.jsx
        ├── CommentList.jsx
        ├── CreateLinkForm.jsx
        ├── LinkCard.jsx
        ├── LinkDetail.jsx
        ├── LinkList.jsx
        └── TagFilter.jsx
```

- `main.jsx` monta la aplicación React.
- `App.jsx` conserva el estado principal y coordina las vistas.
- `api.js` contiene las funciones de acceso al backend.
- `components/` contiene las piezas reutilizables de la interfaz.

## API utilizada

El cliente de `src/api.js` utiliza estas rutas:

- `GET /api/links`
- `GET /api/links/:id`
- `POST /api/links`
- `POST /api/links/:id/vote`
- `GET /api/links/:id/comments`
- `POST /api/links/:id/comments`

El filtro se realiza en el cliente para permitir coincidencias parciales. La URL de la API está definida en `src/api.js` y usa `localhost` para el entorno local.

## Build y despliegue

```powershell
npm run lint
npm run build
```

La carpeta generada es `dist/`. Para desplegar en otro entorno, sirve esa carpeta con un servidor estático y cambia la URL del backend en `src/api.js` antes de reconstruir. El backend debe permitir el origen del frontend mediante CORS.
