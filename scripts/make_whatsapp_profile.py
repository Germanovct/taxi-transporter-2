from PIL import Image
import os

# Abrir imagen original
img_path = os.path.expanduser("~/Downloads/watermarked_img_16691478908092203146.jpg")
if not os.path.exists(img_path):
    print(f"❌ Error: No se encontró la imagen en {img_path}")
    exit(1)

img = Image.open(img_path)

# Canvas cuadrado 800x800 con fondo oscuro #06060e
canvas = Image.new('RGB', (800, 800), color=(6, 6, 14))

# Redimensionar logo manteniendo aspect ratio
# para que entre en ~700px de ancho centrado
ratio = min(700 / img.width, 700 / img.height)
new_size = (int(img.width * ratio), int(img.height * ratio))
img_resized = img.resize(new_size, Image.Resampling.LANCZOS)

# Si tiene fondo blanco, convertir a RGBA y hacer blanco transparente
img_rgba = img_resized.convert('RGBA')
data = img_rgba.getdata()
new_data = []
for item in data:
    # Hacer blanco/casi blanco transparente
    if item[0] > 230 and item[1] > 230 and item[2] > 230:
        new_data.append((6, 6, 14, 255))  # reemplazar con fondo oscuro
    else:
        new_data.append(item)
img_rgba.putdata(new_data)

# Centrar en canvas
x = (800 - new_size[0]) // 2
y = (800 - new_size[1]) // 2
canvas.paste(img_rgba.convert('RGB'), (x, y))

# Guardar
output_path = os.path.expanduser("~/Desktop/transporter_whatsapp.jpg")
canvas.save(output_path, 'JPEG', quality=95)
print(f"✅ Guardado en: {output_path}")
