int[] pins= {5, 4, 15, 16, 14, 12, 13}//S,M,T,W,T,F,S values

void setup() {
  pinMode(0, OUTPUT);
  for(int i = 0; i < sizeof(pins), i++){
    pinMode(pins[i], INPUT_PULLUP);
  }
  Serial.begin(9600);
}
 
void loop() {
  if(digitalRead(2) == HIGH){
      digitalWrite(0, HIGH);
  } else {
      digitalWrite(0, LOW);
  }
}
