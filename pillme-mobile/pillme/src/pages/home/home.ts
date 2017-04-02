import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire} from 'angularfire2';
import {Observable} from 'rxjs/Rx';

import {DataProvider} from '../../providers/data'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	private openCompartmentRef;
	private isThereOpenCompartment = false;
	private openCompartments: Array<string> = [];
	private days = ['Sunday' ,'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	private dayToday: number; //0-6
	private notifs: Array<any>;

	medication: Array<any> = [];
	private medicationRef;

	private notifsIntervalRef;

	constructor(public navCtrl: NavController, public navParams: NavParams,
		private af: AngularFire, private data: DataProvider) {}

	ionViewWillEnter(){
		let startEndDate = this.getInterval();
	    this.medicationRef = this.af.database.object('/medicine').subscribe(snapshot =>{
	      this.medication = snapshot;
	    });

	    this.openCompartmentRef = this.af.database.object('/open').subscribe(snapshot =>{
	    	this.isThereOpenCompartment = false;
	    	this.openCompartments.length = 0;

	    	for(let compartment in snapshot){
	    		if(snapshot[compartment]){
	    			this.isThereOpenCompartment = true;
	    			this.openCompartments.push(this.days[compartment]);
	    		}
	    	}
	    });

	    this.updateNotifs();
		this.notifsIntervalRef = Observable.interval(10 * 60 * 1000).subscribe(x => { //update baka may new notification
			this.updateNotifs();
		});

	    this.af.database.list('/drink', { //handles if someone drinks new meds
	    	query: {
	    		orderByChild: 'timestamp',
	    		startAt: startEndDate[0],
	    	}
	    }).subscribe(snapshot=>{
	    	for(let s in snapshot){
	    		if(snapshot[s].day == this.dayToday || snapshot[s].day== (this.dayToday + 6) % 7){ //today or the prev day
	    			for(let m in this.data.medications){
	    				for(let intake of this.data.medications[m]){
	    					if(!(intake.haveDrunk) && this.isWithinInterval(intake.time, intake.hoursGap, snapshot[s].timestamp)){
	    						intake.haveDrunk = true;
	    						this.updateNotifs();
	    					}
	    				}
	    			}
	    		}
	    	}
	    });

  	}

  	ionViewDidLeave() {
		if(this.openCompartmentRef){
			this.openCompartmentRef.unsubscribe();
		}
    	if(this.medicationRef){
	      this.medicationRef.unsubscribe();
	    }

	    if(this.notifsIntervalRef){
	    	this.notifsIntervalRef.unsubscribe();
	    }

  	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad HomePage');
	}

	private getInterval() {
		let date = new Date();

		if(this.dayToday != null && this.dayToday != date.getDay()){
			this.data.resetIntakeFlag();
		}
		this.dayToday = date.getDay(); //gets day today

		let tzoffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
		let startDate:number = date.setTime(date.getTime() + tzoffset - 43200000); // add offset and minus 12 hours

		return [startDate, startDate + 43200000]; //end time is plus 12 hours
	}

	private isWithinInterval(time: number, gap: number, compareTime: number): boolean{
		let status = this.withinIntervalStatus(time, gap, compareTime);

		return status == 1 || status == 2;
	}

	private withinIntervalStatus(time: number, gap: number, compareTime): number{  //0 = Up next, 1 = Due, 2 = Late
		let millisToday; //can be today or comparetime
		
		if(compareTime){
			millisToday = compareTime;
		} else {
			millisToday =  new Date().getTime();
		}

		let millisOfIntake = new Date().setHours(time, 0, 0);
		let millisGap = gap * 60 * 60 * 1000; //hours => min => sec => milli
		let withinLeftGap = false;
		let withinRightGap = false;

		if(millisToday >= (millisOfIntake - millisGap) && millisToday < millisOfIntake){
			withinLeftGap = true;
		} else if(millisToday < millisOfIntake + millisGap && millisToday >= millisOfIntake){
			withinRightGap = true;
		}

		if(withinLeftGap){
			return 1;
		} else if(withinRightGap){
			return 2;
		} else {
			if(millisToday < millisOfIntake){
				return 0;
			} else {
				return 4;
			}
		}
	}

	private updateNotifs(){
		this.notifs = [];

		for(let m in this.data.medications){
			for(let intake of this.data.medications[m]){
				if(!(intake.haveDrunk)){
					if(!(intake.isLate)){
						//checks first if late na ba
						let status: number = this.checkStatus(intake);

						if(status == 1){
							this.notifs.push({
								status: "Next",
								time: intake.time,
								rawtime: intake.time,
								medication: m,
								color: "primary"
							});
						} else if(status == 2){
							this.notifs.push({
								status: "Due",
								time: intake.time,
								medication: m,
								color: "danger"
							});
						} else if(status == 3){
							intake.isLate = true;
						}
					}
				}
			}
		}

		this.notifs.sort(function(a, b){ //sort notifs
			return a.time - b.time;
		});
	}
	private checkStatus(medication): number{ //0 = Early, 1 = Next,  2 = Due, 3 = Late
		return this.withinIntervalStatus(medication.time, medication.hoursGap, null);
	}
}
