import base64
import json
import qrcode
from PIL import Image # type: ignore
from io import BytesIO

def convert_to_dictionary(file):
    js = json.loads(file)
    return js

# Remove data URI prefix and decode base64 str into bytes
def base64_to_image(base64_str):
    image_bytes = base64.b64decode(base64_str)
    return image_bytes

def create_qr_image(base64_str):
    img = qrcode.make(base64_str)
    type(img)
    img.save("qr.png")

def decode_response(file):
    response = convert_to_dictionary(file)
    base64_str = response["oobContentData"]
    create_qr_image(base64_str)

