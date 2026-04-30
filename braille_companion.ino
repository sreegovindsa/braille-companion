#include <Servo.h>

Servo s1, s2, s3, s4, s5, s6;

const int UP_ANGLE = 70;
const int DOWN_ANGLE = 0;

String inputString = "";
bool stringComplete = false;

void setup() {
  s1.attach(13);
  s2.attach(12);
  s3.attach(8);
  s4.attach(7);
  s5.attach(4);
  s6.attach(2);

  Serial.begin(9600);

  resetAll();
}

void loop() {
  if (stringComplete) {
    processInput(inputString);
    inputString = "";
    stringComplete = false;
  }
}

void serialEvent() {
  while (Serial.available()) {
    char inChar = (char)Serial.read();

    if (inChar == '\n') {
      stringComplete = true;
    } else {
      inputString += inChar;
    }
  }
}

void processInput(String data) {
  if (data.length() != 6) return;

  controlServo(s1, data[0]);
  controlServo(s2, data[1]);
  controlServo(s3, data[2]);
  controlServo(s4, data[3]);
  controlServo(s5, data[4]);
  controlServo(s6, data[5]);
}

void controlServo(Servo &servo, char state) {
  if (state == '1') {
    servo.write(UP_ANGLE);
  } else {
    servo.write(DOWN_ANGLE);
  }
}

void resetAll() {
  s1.write(DOWN_ANGLE);
  s2.write(DOWN_ANGLE);
  s3.write(DOWN_ANGLE);
  s4.write(DOWN_ANGLE);
  s5.write(DOWN_ANGLE);
  s6.write(DOWN_ANGLE);
}