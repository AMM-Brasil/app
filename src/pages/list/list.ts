import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Push } from "@ionic-native/push";
import { Storage } from '@ionic/storage';
import { AMMPush } from "../../app/amm.push";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  icons: string[];
  items: Array<{title: string, topic: string, note: string, icon: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public push: Push, public alertCtrl: AlertController, public storage: Storage) {
	storage.ready().then(() => {
		storage.keys().then((k:any) => {
			storage.get(k).then((val) => {
				console.log(k + ":" + val); 
			});
		});
		// Let's populate this page with some filler content for funzies
		this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
		'american-football', 'boat', 'bluetooth', 'build'];

		this.items = [];
		
		this.isSubscribed('Rondônia', 'ro');
		this.isSubscribed('São Paulo', 'sp');
	});        
  }
  
  isSubscribed(title, topic) {
	this.storage.get(topic).then((val) => {
		this.items.push({
			title: title,
			topic: topic,
			note: val ? 'SIM' : 'NÃO',
			icon: this.icons[Math.floor(Math.random() * this.icons.length)]
		});
	});
  }

  itemTapped(event, item) {
    this.storage.get(item.topic).then((val) => {
		this.storage.set(item.topic, !val);
		item.note = !val ? 'SIM' : 'NÃO';
		let ammPush = new AMMPush(this.push, this.alertCtrl, this.storage);
		if (!val) {
			ammPush.subscribe(item.topic);
		} else {
			ammPush.unsubscribe(item.topic);
		}
	});
  }
}
