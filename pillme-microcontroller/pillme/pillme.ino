/*
TODO:
light up blue if may open
send data to firebase
set up firebase database
create app
light up red if may due na iinumin

*/

int pins []= {5, 4, 0, 2, 14, 12, 13}; //S,M,T,W,H,F,S values
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
  lightUpIfOpen();  
  delay(1000);
}

void lightUpIfOpen(){
  boolean isOpen = false;
  for(int i = 0; i < PINS_SIZE; i++){
    if(digitalRead(pins[i]) == HIGH){
      Serial.print("OPEN: ");
      Serial.println(pins[i], DEC);
      isOpen = true;
    }
  }

  if(isOpen){
    digitalWrite(openPin, HIGH);
  } else{
    digitalWrite(openPin, LOW);
  }
}
