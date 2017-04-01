import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire, FirebaseObjectObservable} from 'angularfire2';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	private openCompartmentRef;
	private isThereOpenCompartment = false;
	private openCompartments: Array<string> = [];
	private days = ['Sunday' ,'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	constructor(public navCtrl: NavController, public navParams: NavParams, private af: AngularFire) {}

	ionViewWillEnter(){
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
  	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad HomePage');
	}

}
