import { AlertController } from 'ionic-angular';
import { Push, PushObject, PushOptions } from "@ionic-native/push";
import { Storage } from '@ionic/storage';

export class AMMPush {
	
  pushObject: PushObject;

  constructor(public push: Push, public alertCtrl: AlertController, public storage: Storage) {
	this.pushsetup();
  };
  
  public pushsetup() {
	  
	const options: PushOptions = {
		android: {
			topics: ['nacional']
		},
		ios: {
			topics: ['nacional']
		}
	};
	
	this.pushObject = this.push.init(options);

	this.pushObject.on("registration").subscribe((registration: any) => {
		this.storage.ready().then(() => {
			this.storage.keys().then((stTopics:any) => {
				var splitTopics = stTopics.toString().split(',');
				for (let topic of splitTopics) {
					this.storage.get(topic).then((val) => {
						if (val) {
							this.pushObject.subscribe(topic);
							console.log("subscribed to " + topic); 
						}
					});
				}
			});
		});
	});

	this.pushObject.on("notification").subscribe((notification: any) => {
		let youralert = this.alertCtrl.create({
			title: notification.title,
			message: notification.message
		});
		youralert.present();
	});
	
  }
  
  public subscribe(topic) {
	this.pushObject.subscribe(topic);  
  }
  
  public unsubscribe(topic) {
	  this.pushObject.unsubscribe(topic);
  }
  
}
