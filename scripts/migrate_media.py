import os
import mimetypes
import uuid
import time
from dotenv import load_dotenv
from supabase import create_client

# Cargar variables de entorno del backend
load_dotenv(dotenv_path="taxi-transporter-2/backend/.env")

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
bucket_name = os.getenv("SUPABASE_BUCKET", "media")

if not supabase_url or not supabase_key:
    print("❌ Error: No se encontraron las variables de entorno en backend/.env")
    exit(1)

print(f"🔗 Conectando a Supabase: {supabase_url}")
supabase = create_client(supabase_url, supabase_key)

# 1. Crear el bucket 'media' público si no existe
try:
    print(f"📦 Creando bucket público '{bucket_name}'...")
    supabase.storage.create_bucket(bucket_name, options={"public": True})
    print(f"   ✅ Bucket '{bucket_name}' creado.")
except Exception as e:
    # Si ya existe, suele dar error, lo ignoramos
    print(f"   ℹ️  Info (posiblemente ya existe): {str(e)}")

# Archivos a migrar (fotos ya subidas anteriormente)
media_files = [
    # {
    #     "local_path": "taxi-transporter-2/frontend/public/images/toyota-corolla.jpg",
    #     "type": "photo",
    #     "folder": "flota",
    #     "description": "Toyota Corolla — Sedán ejecutivo, amplio y confortable",
    #     "order_index": 1
    # },
    # {
    #     "local_path": "taxi-transporter-2/frontend/public/images/renault-kangoo.jpg",
    #     "type": "photo",
    #     "folder": "flota",
    #     "description": "Renault Kangoo — Ideal para grupos y equipaje extra",
    #     "order_index": 2
    # },
    # {
    #     "local_path": "taxi-transporter-2/frontend/public/images/chevrolet-spin.jpg",
    #     "type": "photo",
    #     "folder": "flota",
    #     "description": "Chevrolet Spin — 7 pasajeros, perfecto para familias",
    #     "order_index": 3
    # },
    {
        "local_path": "taxi-transporter-2/frontend/public/videos/buenos-aires-hero-compressed.mp4",
        "type": "video",
        "folder": "videos",
        "description": "Traslados Premium en Buenos Aires",
        "order_index": 0
    }
]

for item in media_files:
    path = item["local_path"]
    if not os.path.exists(path):
        print(f"⚠️ Archivo no encontrado localmente: {path}. Saltando.")
        continue

    filename = os.path.basename(path)
    content_type, _ = mimetypes.guess_type(path)
    if not content_type:
        content_type = "image/jpeg" if item["type"] == "photo" else "video/mp4"

    # Generar nombre único similar al del backend
    unique_id = uuid.uuid4()
    timestamp = int(time.time())
    ext = os.path.splitext(filename)[1]
    unique_filename = f"{item['type']}_{unique_id}_{timestamp}{ext}"
    storage_path = f"{item['folder']}/{unique_filename}"

    print(f"🚀 Subiendo {filename} a {bucket_name}/{storage_path}...")

    try:
        # Leer bytes del archivo
        with open(path, "rb") as f:
            file_bytes = f.read()

        # 2. Subir a Supabase Storage
        supabase.storage.from_(bucket_name).upload(
            path=storage_path,
            file=file_bytes,
            file_options={"content-type": content_type}
        )

        # Obtener URL pública
        url_res = supabase.storage.from_(bucket_name).get_public_url(storage_path)
        public_url = url_res if isinstance(url_res, str) else getattr(url_res, "public_url", str(url_res))

        print(f"   🔗 URL Pública: {public_url}")

        # 3. Registrar en base de datos
        db_data = {
            "filename": unique_filename,
            "original_name": filename,
            "url": public_url,
            "type": item["type"],
            "description": item["description"],
            "order_index": item["order_index"],
            "active": True
        }

        db_res = supabase.table("fleet_media").insert(db_data).execute()
        if db_res.data:
            print(f"   ✅ Registrado en base de datos (ID: {db_res.data[0]['id']})")
        else:
            print("   ❌ Error: No se pudo registrar en la base de datos.")

    except Exception as e:
        print(f"   ❌ Error al subir/registrar {filename}: {str(e)}")

print("🎉 Proceso de migración de multimedia completado.")
