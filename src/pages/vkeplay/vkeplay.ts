import {
	Component
} from '@angular/core';

import {
	ScreenOrientation,
	StatusBar
} from 'ionic-native';

import {
	NavController,
	NavParams
} from 'ionic-angular';

import {
	DomSanitizer
} from '@angular/platform-browser';

import {
	Url
} from '../core/urls';

@Component({
	templateUrl: 'vkeplay.html'
})
export class Vkeplay {

	playerPathHeader: string = Url.http_header + "play/html5_vke/";
	playerPath: any;
	vkeId: number;

	constructor(params: NavParams, public navCtrl: NavController, private sanitizer: DomSanitizer) {
		ScreenOrientation.lockOrientation('landscape');
		StatusBar.hide();
		this.vkeId = params.data.vkeId;
		this.play();
	}

	play() {
		this.playerPath = this.playerPathHeader + this.vkeId;
		this.playerPath = this.sanitizer.bypassSecurityTrustResourceUrl(this.playerPath);
	}
	
	/**
	 * 返回按钮
	 */
	back(){
		this.navCtrl.pop();
	}
	
	ngOnDestroy(){
		ScreenOrientation.lockOrientation('portrait');
		StatusBar.show();
	}

}