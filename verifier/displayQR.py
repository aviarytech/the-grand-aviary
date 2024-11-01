from luma.core.interface.serial import spi
from luma.oled.device import sh1106
from PIL import Image
from PIL import ImageDraw

serial = spi(device=0, port=0)
device = sh1106(serial)

width =  device.width
height = device.height
size_x = 64
size_y = 64

def display_image(file):

    qr_code = Image.open(file) \
        .resize((size_x, size_y)) \
        .transform(device.size, Image.AFFINE, (1, 0, 0, 0, 1, 0), Image.BILINEAR) \
        .convert("L") \
        .convert(device.mode)

    device.display(qr_code)

if __name__ == "__display_image__":
    try:
        device = get_device()
        display_image()
    except KeyboardInterrupt:
        pass