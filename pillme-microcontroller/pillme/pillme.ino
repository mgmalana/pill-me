/*
TODO:
only send data once
send data to firebase
add a switch for refill
set up firebase database
create app
light up red if may due na iinumin

*/

int pins []= {5, 4, 0, 2, 14, 12, 13}; //S,M,T,W,H,F,S values
//boolean flag to check if the "open" was already detected.
boolean pinsSentFlag [] = {false, false, false, false, false, false, false};
int PINS_SIZE = 7;
int openPin  = 16;

void setup() {
  pinMode(openPin, OUTPUT);
  for(int i = 0; i < PINS_SIZE; i++){
    pinMode(pins[i], INPUT_PULLUP);
  }
  Serial.begin(115200);
}
 
void loop() {
  checkCompartments();  
  delay(500);
}

void checkCompartments(){
  boolean isOpen = false;
  for(int i = 0; i < PINS_SIZE; i++){
    if(digitalRead(pins[i]) == HIGH){ 
      if(!pinsSentFlag[i]){
        Serial.print("OPEN: ");
        Serial.println(pins[i], DEC);
        pinsSentFlag[i] = true;
      }
      isOpen = true;
    } else if(digitalRead(pins[i]) == LOW && pinsSentFlag[i]){
      pinsSentFlag[i] = false;
      Serial.print("CLOSED: ");
      Serial.println(pins[i], DEC);
    }
  }

  if(isOpen){
    digitalWrite(openPin, HIGH);
  } else{
    digitalWrite(openPin, LOW);
  }
}
