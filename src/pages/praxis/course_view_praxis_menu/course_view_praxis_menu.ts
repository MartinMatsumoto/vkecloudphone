import {
	Component
} from '@angular/core';

import {
	NavParams,
	ViewController
} from 'ionic-angular';

import {
	PraxisResolvePage
} from '../praxis_resolve/praxis_resolve';

import {
	QuestionCreatePage
} from '../../questions/question_create/question_create';

import {
	NotesCreatePage
} from '../../notes/notes_create/notes_create';

@Component({
	templateUrl: 'course_view_praxis_menu.html'
})
export class CourseViewPraxisMenu {

	praxis;
	courseId;
	catalogueId;
	navCtrl;

	constructor(params: NavParams, public viewCtrl: ViewController) {
		this.praxis = params.data.praxis;
		this.courseId = params.data.courseId;
		this.navCtrl = params.data.navCtrl;
		this.catalogueId = params.data.catalogueId;
	}

	showResolve() {
		this.navCtrl.push(PraxisResolvePage, {
			praxis: this.praxis,
			courseId: this.courseId
		});

		this.viewCtrl.dismiss();
	}
	
	createQuestion(){
		this.navCtrl.push(QuestionCreatePage, {
			catalogueId: this.catalogueId,
			pauseTime: 0,
			courseId: this.courseId,
			courseContent: this.praxis
		});
		
		this.viewCtrl.dismiss();
	}
	
	createNotes(){
		this.navCtrl.push(NotesCreatePage, {
			catalogueId: this.catalogueId,
			pauseTime: 0,
			courseId: this.courseId,
			courseContent: this.praxis
		});
		
		this.viewCtrl.dismiss();
	}
}