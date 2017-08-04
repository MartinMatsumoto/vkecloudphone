import {
	Component
} from '@angular/core';

import {
	NavController,
	MenuController
} from 'ionic-angular';

import { MyCoursePage } from '../mycourse/mycourse';
import { AllCoursePage } from '../allcourse/allcourse';
import { MessagePage } from '../message/message';
import { FollowPage } from '../follow/follow';
import { NotesPage } from '../notes/notes';
import { QuestionsPage } from '../questions/questions';
import { SettingsPage } from '../settings/settings';
import {
	Constant
} from '../core/constant';

@Component({
	templateUrl: 'main.html'
})
export class MainPage {

	public rootPage: any = MyCoursePage;
	user = Constant.user;
	
	constructor(public navCtrl: NavController, public menuCtrl: MenuController) {
	}
	
	toogleMyCourse(){
		this.rootPage = MyCoursePage;
		this.toogleMenu();
	}
	
	toogleAllCourse(){
		this.rootPage = AllCoursePage;
		this.toogleMenu();
	}
	
	toogleMessage(){
		var this_ = this;
		if(!MessagePage.callback){
			MessagePage.setCallBack(function(){
				this_.rootPage = FollowPage;
			});
		}
		this.rootPage = MessagePage;
		this.toogleMenu();
	}
	
	toogleFollow(){
		this.rootPage = FollowPage;
		this.toogleMenu();
	}
	
	toogleNotes(){
		this.rootPage = NotesPage;
		this.toogleMenu();
	}
	
	toogleQuestions(){
		this.rootPage = QuestionsPage;
		this.toogleMenu();
	}
	
	toogleSettings(){
		if(!SettingsPage.globalNavCtrl){
			SettingsPage.globalNavCtrl = this.navCtrl;
		}
		this.rootPage = SettingsPage;
		this.toogleMenu();
	}
	
	toogleMenu(){
		this.menuCtrl.toggle();
	}
	
}