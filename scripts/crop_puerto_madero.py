from PIL import Image
import os

img_path = 'frontend/public/images/puerto-madero.jpg'
if not os.path.exists(img_path):
    print(f"❌ Error: {img_path} no existe")
    exit(1)

# Abrir imagen (que fue restaurada al original 1200x750)
img = Image.open(img_path)
width, height = img.size
print(f"Dimensiones de entrada: {width}x{height}")

# Queremos que la imagen final sea de 1200x800 (relación de aspecto 3:2, igual que monumental.jpg)
target_width = 1200
target_height = 800
target_aspect = target_width / target_height  # 1.5

# Para obtener una relación de aspecto de 1.5 a partir de 1200x750 sin estirar:
# El ancho debe ser: 750 * 1.5 = 1125
crop_width = int(height * target_aspect)
crop_height = height

# Recortar centrado horizontalmente
left = (width - crop_width) // 2
top = 0
right = left + crop_width
bottom = height

img_cropped = img.crop((left, top, right, bottom))
print(f"Recortado temporal a: {img_cropped.size} (aspect ratio {img_cropped.width/img_cropped.height})")

# Redimensionar a 1200x800
img_resized = img_cropped.resize((target_width, target_height), Image.Resampling.LANCZOS)
img_resized.save(img_path, 'JPEG', quality=95)
print(f"✅ Imagen adaptada con éxito a: {img_resized.size} (3:2) y guardada en {img_path}")
