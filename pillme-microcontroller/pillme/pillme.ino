/*
TODO:
create app
light up red if may due na iinumin
add a switch for refill

*/

/*
 FIREBASE_HOST, FIREBASE_AUTH, WIFI_SSID, WIFI_PASSWORD were all defined in config.h file
  5 - S
  4 - M
  0 - T
  2 - W
  14 - H
  12 - F
  13 - S
  16 - open flag
*/

#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#include "config.h"

int pins []= {5, 4, 0, 2, 14, 12, 13}; //S,M,T,W,H,F,S values

//boolean flag to check if the "open" was already detected.
boolean pinsSentFlag [] = {false, false, false, false, false, false, false};
int PINS_SIZE = 7;
int openPin  = 16;

void setup() {
  //set up pins
  pinMode(openPin, OUTPUT);
  for(int i = 0; i < PINS_SIZE; i++){
    pinMode(pins[i], INPUT_PULLUP);
  }
  Serial.begin(115200);

  // connect to wifi.
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
ion}
 
void loop() {
  if(analogRead(A0) == 1024){
    Serial.println("REFILL MODE: ON");
  } else {
    checkCompartments();
  }
  delay(500);
}

void checkCompartments(){
  boolean isOpen = false;
  for(int i = 0; i < PINS_SIZE; i++){
    if(digitalRead(pins[i]) == HIGH){ 
      if(!pinsSentFlag[i]){
        pinsSentFlag[i] = true;
        sendIsOpenCompartment(i, true);
        sendDrinkData(i);
      }
      isOpen = true;
    } else if(digitalRead(pins[i]) == LOW && pinsSentFlag[i]){
      pinsSentFlag[i] = false;
      sendIsOpenCompartment(i, false);
    }
  }

  if(isOpen){
    digitalWrite(openPin, HIGH);
  } else{
    digitalWrite(openPin, LOW);
  }
}

void resetPinsFlags(){
  for(int i = 0; i < PINS_SIZE; i++){
    pinsSentFlag[i] = false;
  }
}

void sendDrinkData(int day){ //day: 0-6
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
  JsonObject& tempTime = root.createNestedObject("timestamp");
  root["day"] = day;
  tempTime[".sv"] = "timestamp";
  Firebase.push("drink/", root);
  
  
  if (Firebase.failed()) {
    Serial.println(Firebase.error());
  }
}

void sendIsOpenCompartment(int day, boolean isOpen){ //day: 0-6  
  String tempString = "open/";

  //print open
  if(isOpen){
    Serial.print("OPENED: ");
  } else {
    Serial.print("CLOSED: ");
  }
  Serial.println(pins[day], DEC);

  //send to firebase
  Firebase.setBool(tempString + day, isOpen);
  
  if (Firebase.failed()) {
    Serial.println(Firebase.error());
  }
}

