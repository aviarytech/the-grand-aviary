import RPi.GPIO as GPIO # type: ignore
from time import sleep
from get_qr import ping_extrimian
from generateQR import decode_response
from displayQR import display_image

# GPIO button define
BTN_PIN = 23

GPIO.setmode(GPIO.BCM)
GPIO.setup(BTN_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP) # GPIO 23 set up a input

def button_callback(channel):
	response = ping_extrimian()
	decode_response(response)
	display_image('qr.png')

GPIO.add_event_detect(BTN_PIN,GPIO.FALLING,callback=button_callback, bouncetime=200)

message = input("Press enter to quit\n\n")

GPIO.cleanup()



