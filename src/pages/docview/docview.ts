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
	templateUrl: 'docview.html'
})
export class Docview {

	docPathHeader:string = Url.http_header + "play/html5_doc/";
	playerPath: any;
	docId: number;

	constructor(params: NavParams, public navCtrl: NavController, private sanitizer: DomSanitizer) {
		ScreenOrientation.lockOrientation('landscape');
		StatusBar.hide();
		this.docId = params.data.docId;
		this.play();
	}

	play() {
		this.playerPath = this.docPathHeader + this.docId;
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