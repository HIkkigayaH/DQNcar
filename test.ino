#include <AFMotor.h>
#include<SoftwareSerial.h>
#include<string.h>
AF_DCMotor motor1 (1, MOTOR12_64KHZ);
AF_DCMotor motor2 (2, MOTOR12_64KHZ); 
AF_DCMotor motor3 (3, MOTOR34_64KHZ);
AF_DCMotor motor4 (4, MOTOR34_64KHZ);
SoftwareSerial BT(2,17);
String voice, prev;
int avoid = 0;
const int fr[] = {65,66,115,65};
const int rotate = 150;
const int trigs[5] = {18, 14, 15, 10, 16};//{18, 4, 8, 10, 12};
const int echos[5] = {19, 0, 1, 9, 13};//{19, 5, 7, 9, 13};
void setup() {
//  Serial.begin(9600);
  BT.begin(9600);
  for(int i = 0; i < 5; i++){
    pinMode(trigs[i], OUTPUT);
    pinMode(echos[i], INPUT);
  }
}
 
void loop() {
  if(BT.available()){
    Listen();
    if(avoid){

       if(voice == "1" && prev != "1"){
        leftA();
       }
       else if(voice == "0" && prev != "0"){
        rightA();
       }
        
       else if(voice == "2" && prev != "2"){
        forwardA();
       }
       prev = voice;
       sendSensorValues();
    }
    else{
       if(voice == "f")
        forward();
       else if(voice == "b")
        backward();
       else if(voice == "r")
        right();
       else if(voice == "l")
        left();
    }
  voice = "";
  }
}

void Listen(){
    while(BT.available()){
      char c = BT.read();
      if(c == '#'){ 
        break;
      }
      voice += (char)c;
      delay(2);
    }
    if(voice == "a"){
      avoid = 1;
    }
    else if(voice == "n"){
      avoid = 0;
      motor4.run(RELEASE);
      motor1.run(RELEASE);
      motor2.run(RELEASE);
      motor3.run(RELEASE);
      delay(100);
    }
}

void sendSensorValues(){
    String sensorValues;
    int store;
    int duration;
    for(int i = 0; i < 5; i++){
        digitalWrite(trigs[i], LOW);
        delayMicroseconds(2);
        digitalWrite(trigs[i], HIGH);
        delayMicroseconds(10);
        digitalWrite(trigs[i], LOW);
        if(i == 1)
          duration = pulseIn(echos[i], HIGH, 4845);//4550
        else
          duration = pulseIn(echos[i], HIGH, 2295);//2000
        store = duration/29/2;
        if(store == 0)
          store = 30;
        if(i == 4)
          sensorValues += String(store);
        else
          sensorValues += (String(store) + " ");
        delayMicroseconds(10);
    }
//    Serial.println(sensorValues);
    BT.println(sensorValues);
}

//void parseData(String str){
//    int idx = voice.indexOf(',');
//    String x = str.substring(0, idx);
//    String y = str.substring(idx+1);
//    char buffX[x.length() + 1];
//    x.toCharArray(buffX, x.length() + 1);
//    param[0] = atof(buffX);
//    Serial.println(param[0]);
//    char buffY[y.length() + 1];
//    y.toCharArray(buffY, y.length() + 1);
//    param[1] = atof(buffY);
//    Serial.println(param[1]);
//    delay(10);
//  }
//  
void forward(){
    motor4.setSpeed(255);
    motor4.run(BACKWARD);
    motor3.setSpeed(255);
    motor3.run(BACKWARD);

    motor1.setSpeed(255);
    motor1.run(BACKWARD);
    motor2.setSpeed(255);
    motor2.run(BACKWARD);
     delay(300);
 
 
     motor4.run(RELEASE);
     motor1.run(RELEASE);
     motor2.run(RELEASE);
     motor3.run(RELEASE);
     delay(5);
  }

void backward(){
    motor4.setSpeed(255);
    motor4.run(BACKWARD);
    motor3.setSpeed(255);
    motor3.run(BACKWARD);

    motor1.setSpeed(255);
    motor1.run(BACKWARD);
    motor2.setSpeed(255);
    motor2.run(BACKWARD);
    delay(300);
 
     motor4.run(RELEASE);
     motor1.run(RELEASE);
     motor2.run(RELEASE);
     motor3.run(RELEASE);
     delay(5);
  }

void left(){
    motor4.setSpeed(255);
    motor4.run(FORWARD);
    motor3.setSpeed(255);
    motor3.run(FORWARD);

    motor1.setSpeed(255);
    motor1.run(BACKWARD);
    motor2.setSpeed(255);
    motor2.run(BACKWARD);
    delay(500);
 
 
     motor4.run(RELEASE);
     motor1.run(RELEASE);
     motor2.run(RELEASE);
     motor3.run(RELEASE);
     delay(5);
  }
  
void right(){
    motor4.setSpeed(255);
    motor4.run(BACKWARD);
    motor3.setSpeed(255);
    motor3.run(BACKWARD);

    motor1.setSpeed(255);
    motor1.run(FORWARD);
    motor2.setSpeed(255);
    motor2.run(FORWARD);
    delay(500);
 
 
     motor4.run(RELEASE);
     motor1.run(RELEASE);
     motor2.run(RELEASE);
     motor3.run(RELEASE);
     delay(5);
  }

void forwardA(){
    
    motor1.run(FORWARD);
    motor1.setSpeed(fr[0]);
    
    motor2.run(FORWARD);
    motor2.setSpeed(fr[1]);
    
    motor3.run(FORWARD);
    motor3.setSpeed(fr[2]);
    
    motor4.run(FORWARD);
    motor4.setSpeed(fr[3]);
    delay(10);
  }


void leftA(){
    motor1.run(BACKWARD);
    motor1.setSpeed(rotate);
    
    motor2.run(BACKWARD);
    motor2.setSpeed(rotate);
    
    motor4.setSpeed(rotate);
    motor3.setSpeed(rotate);
  }

void rightA(){
    motor3.run(BACKWARD);
    motor3.setSpeed(rotate);
    
    motor4.run(BACKWARD);
    motor4.setSpeed(rotate);
    
    motor1.setSpeed(rotate);
    motor2.setSpeed(rotate);
  }
