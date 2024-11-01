#!/usr/bin/env python3

from flask import Flask, request, jsonify
import json
import RPi.GPIO as GPIO
from time import sleep
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# GPIO Pin setup for lock mechanisim
Pin = 3
GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)
GPIO.setup(Pin, GPIO.OUT)
pwm=GPIO.PWM(Pin, 50)
pwm.start(0)

@app.route('/webhook', methods=['PUT'])
def webhook():
	response = json.loads(request.data)
	verified_user = response['eventData']['verified']
	if verified_user:
		unlockDoor()
		return jsonify({"message": "Door successfully unlocked"})
	else:
		return jsonify({"message": "Invalid credentials or user"})

def unlockDoor():
	sleep(1)
	duty = 0 / 18 + 2
	GPIO.output(Pin, True)
	pwm.ChangeDutyCycle(duty)
	sleep(1)
	GPIO.output(Pin, False)
	pwm.ChangeDutyCycle(0)
	sleep(5) # delay before relock
	duty = 180 / 18 + 2
	GPIO.output(Pin, True)
	pwm.ChangeDutyCycle(duty)
	sleep(1)
	GPIO.output(Pin, False)
	pwm.ChangeDutyCycle(0)

if __name__ == '__main__':
	app.run()