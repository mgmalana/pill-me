import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {DataProvider} from '../../providers/data';
import { AngularFire} from 'angularfire2';

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html'
})
export class CalendarPage {
    eventSource;
    viewTitle;

    isToday:boolean;
    calendar = {
        mode: 'month',
        currentDate: new Date()
    };

    constructor(private navController:NavController, private dataProvider: DataProvider, private af: AngularFire) {

    }

    loadEvents() {
        this.eventSource = this.showMissedMedication();
    }

    onViewTitleChanged(title) {
        this.viewTitle = title;
    }

    onEventSelected(event) {
        console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
    }

    changeMode(mode) {
        this.calendar.mode = mode;
    }

    today() {
        this.calendar.currentDate = new Date();
    }

    onTimeSelected(ev) {
        console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
            (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
    }

    onCurrentDateChanged(event:Date) {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        event.setHours(0, 0, 0, 0);
        this.isToday = today.getTime() === event.getTime();
    }

    showMissedMedication() {
        var events = [];
        let now = new Date();
    	let startDate = new Date(this.dataProvider.startDate);
		let daysList = [];

		for (var d = startDate; d <= new Date(); d.setDate(d.getDate() + 1)) {
		    daysList.push(new Date(d).setHours(0,0,0));
		}
		daysList.push(d.getTime()); //add tomorrow
		for (let i = 0; i < daysList.length - 1; ++i) { //di kasali yung tomorrow
			this.dataProvider.resetIntakeFlag();

			for(let m in this.dataProvider.medications){ //loop through medication everyday
				for(let intake of this.dataProvider.medications[m]){
					this.af.database.list('/drink', { //handles if someone drinks new meds
				    	query: {
				    		orderByChild: 'timestamp',
				    		startAt: daysList[i] + intake.time * 3600000 - intake.hoursGap * 3600000,
				    		endAt: daysList[i] + intake.time * 3600000 + intake.hoursGap * 3600000,
				    	}
				    }).take(1).subscribe(snapshot =>{
				    	if(snapshot.length == 0){
				    		let schedDate = new Date(daysList[i] + intake.time * 3600000);

				    		if(now.getTime() > daysList[i] + intake.time * 3600000 + intake.hoursGap * 3600000){ //if tapos na end time
								events.push({  //push late event
									title: 'Late - ' + m +'x medication',
									startTime: schedDate,
									endTime: schedDate,
									allDay: false
								});
							}
						}
				    });
				}
			}
		}

		return events;
    }

    onRangeChanged(ev) {
        console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
    }

    markDisabled = (date:Date) => {
        var current = new Date();
        current.setHours(0, 0, 0);
        return date < current;
    };


    //above is for the calendar




}
