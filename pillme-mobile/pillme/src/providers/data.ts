import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class DataProvider {
	medications;
	startDate = 1487088000000; //feb 15, 2017
	isThereMissed = false;

	constructor() {
		this.medications = {
			1: [new Intake(8, 12)],
			2: [new Intake(8, 6),
				new Intake(20, 6)],
			3: [new Intake(8, 3),
				new Intake(14, 3),
				new Intake(20, 3)],
			4: [new Intake(8, 2.5),
				new Intake(13, 2.5),
				new Intake(18, 2.5),
				new Intake(23, 2.5)]
		}

		console.log('Hello Data Provider');
	}

	resetIntakeFlag(){
		for(let m in this.medications){
			for(let intake of this.medications[m]){
				intake.haveDrunk = false;
			}
		}	
	}
}

export class Intake{
	time: number;
	hoursGap: number;
	haveDrunk: boolean = false;
	isLate: boolean = false;
	constructor(time: number, hoursGap: number){
		this.time = time;
		this.hoursGap = hoursGap;
	}
}
