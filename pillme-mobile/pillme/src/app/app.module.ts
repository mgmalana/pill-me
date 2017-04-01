import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {HomePage} from '../pages/home/home';
import { MedicationPage } from '../pages/medication/medication';
import { CalendarPage } from '../pages/calendar/calendar'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from './config.ts'
import { ValuesPipe } from '../pipes/pipes';
import { DataProvider } from '../providers/data';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MedicationPage,
    CalendarPage,
    ValuesPipe,

  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MedicationPage,
    CalendarPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DataProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
