import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFire} from 'angularfire2';
@Component({
  selector: 'page-medication',
  templateUrl: 'medication.html'
})
export class MedicationPage {
	medication: Array<any> = [];
	private medicationRef;
	constructor(public navCtrl: NavController, public navParams: NavParams,
		public alertCtrl: AlertController,private af: AngularFire) {}

	ionViewDidLoad() {
		console.log('ionViewDidLoad MedicationPage');
	}

	ionViewWillEnter(){
	    this.medicationRef = this.af.database.object('/medicine').subscribe(snapshot =>{
	      this.medication = snapshot;
	      console.log(snapshot);
	    });
  	}

  	ionViewDidLeave() {
	    if(this.medicationRef){
	      this.medicationRef.unsubscribe();
	    }
  	}

  	add(routine: number){
		let prompt = this.alertCtrl.create({
			title: 'Medicine',
			message: "Add name of medicine to add",
			inputs: [
			{
			  name: 'medicine',
			  placeholder: 'Medicine'
			},
			],
			buttons: [
			{
				text: 'Cancel',
				handler: data => {
					console.log('Cancel clicked');
				}
			},
			{
				text: 'Save',
				handler: data => {
					console.log('Saved clicked, ' + data.medicine);
					this.af.database.list('/medicine/' + routine).push(data.medicine);
				}
			}
			]
		});

		prompt.present();
	}

}
