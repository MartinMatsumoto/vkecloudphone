import {
	Component
} from '@angular/core';

import {
	NavController,
	ModalController,
	LoadingController,
	ToastController
} from 'ionic-angular';

import {
	Http,
	Response
} from '@angular/http';

import {
	Constant
} from '../core/constant';

import {
	Url
} from '../core/urls';

import {
	CourseDetailPage
} from '../course_detail/course_detail';

@Component({
	templateUrl: 'mycourse.html'
})
export class MyCoursePage {

	urlHeader:string = Url.http_header;
	currentPage:number = 1;
	pageSize:number = 10;
	courses = [];
	infiniteScroll;

	constructor(public navCtrl: NavController, public modalCtrl: ModalController, private http: Http, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
		this.loadCourse(null);
	}

	loadCourse(infiniteScroll) {
		var this_ = this;
		
		let loading = this.loadingCtrl.create({
			content: "加载中请稍等"
		});
		if(!infiniteScroll){
			loading.present();
		}
		this.http.post(Url.find_all_course, JSON.stringify({
			pageSize : this.pageSize,
			currentPage : this.currentPage
		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				if(infiniteScroll){
					infiniteScroll.complete();
				}else{
					loading.dismiss();
				}
				if(success) {
					for(var index in result.MyCommodityTos){
						this_.courses.push(result.MyCommodityTos[index]);
					}
					this_.currentPage++;
					if(!result.MyCommodityTos || (infiniteScroll && result.MyCommodityTos.length < this_.pageSize)){
						infiniteScroll.enable(false);
					}
					
				} else {
					this_.toastCtrl.create({
						message: result,
						duration: 2000,
						position: 'middle'
					}).present();
				}
			}));
	}
	
	loadmore(infiniteScroll){
		this.infiniteScroll = infiniteScroll;
		this.loadCourse(infiniteScroll);
	}

	openCourse(course) {
		this.navCtrl.push(CourseDetailPage, {
			course: course.commodityCourseTo
		});
	}
}