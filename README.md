# Taxi El Transporter 2

Este proyecto comprende el desarrollo completo del sitio web y backend para **Taxi El Transporter 2**, un servicio premium de traslados ejecutivos y turísticos en Buenos Aires. Cuenta con una landing page de alto impacto visual y un backend dedicado para la administración de imágenes y videos de la flota.

---

## Estructura del Proyecto

El proyecto está organizado en un monorepo con las siguientes carpetas principales:

```text
taxi-transporter-2/
├── frontend/          # Aplicación React + Vite
│   ├── src/
│   │   ├── components/  # Componentes reutilizables
│   │   ├── sections/    # Secciones principales de la Landing Page
│   │   ├── hooks/       # Hooks de React (IntersectionObserver y breakpoints)
│   │   └── assets/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── netlify.toml   # Configuración de despliegue en Netlify
├── backend/           # API en FastAPI
│   ├── main.py        # Punto de entrada de la aplicación
│   ├── routers/
│   │   └── media.py   # Rutas y validación de archivos multimedia
│   ├── services/
│   │   └── supabase.py# Cliente de integración con Supabase
│   ├── requirements.txt
│   ├── render.yaml    # Configuración de despliegue en Render
│   └── .env.example
└── README.md          # Documentación general
```

---

## Setup de Supabase (Base de Datos & Almacenamiento)

El backend interactúa directamente con Supabase para el almacenamiento de archivos (Bucket) y registros en la base de datos.

### 1. Bucket de Storage
Crea un bucket público en Supabase llamado `"media"` con las siguientes carpetas internas:
- `flota/` (para almacenar las fotos de los vehículos)
- `videos/` (para almacenar los videos de la flota)

Asegúrate de que la política del bucket permita el acceso de lectura público (`SELECT`) sin autenticación.

### 2. Tabla de Base de Datos
Ejecuta la siguiente consulta SQL en el editor de Supabase para crear la tabla `fleet_media`:

```sql
CREATE TABLE fleet_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT CHECK (type IN ('photo', 'video')) NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE fleet_media ENABLE ROW LEVEL SECURITY;

-- Crear política de lectura pública (SELECT)
CREATE POLICY "Public Read Access" 
ON fleet_media 
FOR SELECT 
USING (active = true);

-- Las operaciones de INSERT/UPDATE/DELETE quedan restringidas al backend a través de la service_role key.
```

---

## Variables de Entorno

### Backend (`backend/.env`)
Crea un archivo `.env` en el directorio `backend/` basándote en `.env.example`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_role_key
SUPABASE_BUCKET=media
ALLOWED_ORIGINS=http://localhost:5173,https://taxieltransportador2.com
```

### Frontend (`frontend/.env`)
Crea un archivo `.env` en el directorio `frontend/` basándote en `.env.example`:

```env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## Setup Local

### 1. Iniciar el Backend (FastAPI)

1. Ve al directorio del backend:
   ```bash
   cd backend
   ```
2. Crea un entorno virtual e instálalo:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
3. Ejecuta el servidor de desarrollo:
   ```bash
   uvicorn main:app --reload
   ```
   El backend estará disponible en `http://localhost:8000`.

### 2. Iniciar el Frontend (React + Vite)

1. Ve al directorio del frontend:
   ```bash
   cd ../frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   La aplicación se abrirá en `http://localhost:5173`.

---

## Instrucciones de Despliegue (Deploy)

### Frontend (Netlify)
La carpeta `frontend/` incluye una configuración lista para Netlify en [netlify.toml](file:///Users/germanocampo/dtsanddog-studio/taxi-transporter-2/frontend/netlify.toml).
- **Comando de compilación:** `npm run build`
- **Directorio de publicación:** `dist`
- **Redirecciones:** Configurado para Single Page Application (SPA), redirigiendo todas las rutas a `/index.html`.

### Backend (Render)
La carpeta `backend/` contiene el archivo [render.yaml](file:///Users/germanocampo/dtsanddog-studio/taxi-transporter-2/backend/render.yaml) configurado para despliegues tipo Web Service de Render.
- Al crear el Web Service en Render, conecta tu repositorio Git, selecciona el directorio `backend/` y proporciona las variables de entorno especificadas.

---

## Fase 2 — Funcionalidades Pendientes (Futuras Mejoras)

En la siguiente etapa de desarrollo se planea implementar:
1. **Panel de Administración (Admin Dashboard):**
   - Panel web privado seguro (protegido por Supabase Auth) para que el propietario pueda subir, modificar el orden, ocultar o eliminar fotos/videos de los autos de la flota sin usar el cliente Supabase directamente.
2. **Formulario de Contacto Activo:**
   - Integrar un endpoint `POST /contact` en el backend para enviar correos electrónicos automatizados con las consultas y reservas recibidas.
