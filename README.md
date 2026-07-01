# Taxi El Transporter 2

Este proyecto comprende el desarrollo completo del sitio web y backend para **Taxi El Transporter 2**, un servicio premium de traslados ejecutivos y turísticos en Buenos Aires. Cuenta con una landing page de alto impacto visual con cotizador en tiempo real integrado a Mercado Pago y un backend dedicado para la administración de imágenes y el procesamiento de reservas.

---

## Estructura del Proyecto

El proyecto está organizado en un monorepo con las siguientes carpetas principales:

```text
taxi-transporter-2/
├── frontend/          # Aplicación React + Vite
│   ├── src/
│   │   ├── components/  # Componentes (Navbar, AudioPlayer, etc.)
│   │   ├── sections/    # Secciones principales de la Landing Page
│   │   ├── pages/       # Páginas de confirmación de reserva (Mercado Pago)
│   │   ├── hooks/       # Hooks de React (IntersectionObserver y breakpoints)
│   │   └── i18n/        # Configuración de localización multi-idioma (i18next)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── netlify.toml   # Configuración de despliegue en Netlify
├── backend/           # API en FastAPI
│   ├── main.py        # Punto de entrada de la aplicación
│   ├── routers/
│   │   ├── media.py   # Rutas y validación de archivos de la flota
│   │   └── booking.py # Rutas del cotizador de distancias y pagos en Mercado Pago
│   ├── requirements.txt
│   ├── render.yaml    # Configuración de despliegue en Render
│   └── .env.example
├── scripts/           # Scripts de migración SQL y carga de archivos
└── README.md          # Documentación general
```

---

## Setup de Supabase (Base de Datos & Almacenamiento)

El backend interactúa directamente con Supabase para almacenar archivos (Bucket) y persistir las reservas y la flota.

### 1. Bucket de Storage
Crea un bucket público en Supabase llamado `"media"` con las siguientes carpetas internas:
- `flota/` (para almacenar las fotos de los vehículos)
- `videos/` (para almacenar los videos de la flota)

Asegúrate de habilitar el acceso público al bucket (`SELECT` y opcionalmente `INSERT`/`UPDATE` para la service_role).

### 2. Tablas en la Base de Datos
Ejecuta las siguientes consultas SQL en el editor SQL de Supabase para crear las tablas del proyecto:

#### Tabla `fleet_media`
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

ALTER TABLE fleet_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON fleet_media FOR SELECT USING (active = true);
```

#### Tabla `bookings`
```sql
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  passenger_name TEXT NOT NULL,
  passenger_email TEXT NOT NULL,
  passenger_phone TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  distance_km NUMERIC(10, 2) NOT NULL,
  duration_minutes NUMERIC(10, 2) NOT NULL,
  price_ars NUMERIC(15, 2) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  passengers INTEGER NOT NULL DEFAULT 1,
  luggage TEXT,
  notes TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  payment_id TEXT,
  preference_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Anon Insert Bookings" ON bookings FOR INSERT WITH CHECK (true);
```

---

## Variables de Entorno

### Backend (`backend/.env`)
Crea un archivo `.env` en el directorio `backend/` basándote en `.env.example`:

```env
SUPABASE_URL=https://your_supabase_project.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_secret_key
SUPABASE_BUCKET=media

# Mercado Pago Credentials
MERCADO_PAGO_PUBLIC_KEY=APP_USR-xxxx
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-xxxx

# OSRM Fallback & Routing (Opcional, si no se tiene Google Maps API Key)
GOOGLE_MAPS_API_KEY=

# URL del Frontend (Utilizado para redirección post-pago)
FRONTEND_URL=https://taxi-eltransporter2.netlify.app
ALLOWED_ORIGINS=http://localhost:5173,https://taxieltransporter2.com,https://taxi-eltransporter2.netlify.app
```

### Frontend (`frontend/.env`)
Crea un archivo `.env` en el directorio `frontend/` basándote en `.env.example`:

```env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://your_supabase_project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
```

---

## Setup Local

### 1. Iniciar el Backend (FastAPI)

1. Ve al directorio del backend:
   ```bash
   cd backend
   ```
2. Crea un entorno virtual e instala dependencias:
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

## Integraciones y Mejoras Implementadas (Fase 2)

1. **Cotizador inteligente multi-paso:** Formulario guiado que permite cargar origen, destino, fecha, hora, pasajeros y equipaje. Consume la API de enrutamiento OSRM de OpenStreetMap para calcular kilómetros y tiempo de viaje reales de forma gratuita y calcular tarifas dinámicas.
2. **Checkout Pro de Mercado Pago:** Pasarela de pago integrada que redirecciona a los usuarios para abonar con tarjeta, saldo o transferencia.
3. **Páginas de resultado dinámicas:** Páginas diseñadas específicamente para éxito (`/reserva/confirmada`), pendiente (`/reserva/pendiente`) y error (`/reserva/error`) con un botón CTA para contactar directamente a Marcelo por WhatsApp.
4. **Reproductor de Música flotante:** Widget minimalista y transparente de audio con ondas animadas neón y control slider de volumen que se activa tras la primera interacción del usuario en cualquier parte de la web.
5. **Optimización Móvil extrema:** Reducción de más del 90% en recursos de imágenes, desactivación de animaciones IntersectionObserver en móviles para fluidez del scroll, y adaptabilidad multi-idioma (i18n) en todas las secciones.
