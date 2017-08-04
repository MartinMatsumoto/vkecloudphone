import {
	Component
} from '@angular/core';

import {
	NavController,
	ModalController,
	LoadingController,
	NavParams,
	ToastController
} from 'ionic-angular';

import {
	HttpModule,
	Http,
	Response
} from '@angular/http';

import {
	Constant
} from '../../core/constant';

import {
	Url
} from '../../core/urls';

import {
	Pagination
} from '../../core/pagination';

import {
	CatalogueItem
} from '../../core/catalogue_item';

import {
	CourseDetailPage
} from '../../course_detail/course_detail';

@Component({
	templateUrl: 'course_unbuy_detail.html'
})
export class CourseUnbuyDetailPage {
	
	playerHeight:number;
	course;
	course_detail:string = "catalogue";
	urlHeader:string = Url.http_header;
	
	catalogueInit:boolean = false;
	
	coverPath:string = "";
	
	hasBuy:boolean = false;
	catalogueItems = [];
	currentItem : CatalogueItem;
	
	constructor(params: NavParams, public navCtrl: NavController, public modalCtrl: ModalController, private http: Http, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
		this.course = params.data.course;
//		console.log(this.course);
		this.playerHeight = 200;
//发布手机版本的时候打开,电脑屏幕太大了.
//		this.playerHeight = screen.width / 16 * 9;
		this.changeCatalogue();
		
		this.coverPath = Url.http_header + this.course.cover;
		this.loadHasBuy();
	}
	
	loadHasBuy(){
		var this_ = this;

		this.http.post(Url.has_buy, JSON.stringify({
			courseId: this.course.id
		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				if(success) {
					this_.hasBuy = result.hasBuy;
				} else {
					this_.toastCtrl.create({
						message: result,
						duration: 2000,
						position: 'middle'
					}).present();
				}
			}));
	}
	
	changeCatalogue() {
		if(!this.catalogueInit) {
			this.loadCatalogue(this.course.rootCatalogueId, 0, 0);
			this.catalogueInit = true;
		}
	}
	
	/**
	 * 返回按钮
	 */
	back(){
		this.navCtrl.pop();
	}
	
	/**
	 * 加载目录
	 */
	loadCatalogue(parentId:number,index:number,parentLevel:number){
		var this_ = this;

		let loading = this.loadingCtrl.create({
			content: "加载中请稍等"
		});
		loading.present();
		this.http.post(Url.catalogue_children, JSON.stringify({
			status: 3,
			cataId: parentId
		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				loading.dismiss();
				if(success) {
					this_.processResult(result,index,parentId,parentLevel);
				} else {
					this_.toastCtrl.create({
						message: result,
						duration: 2000,
						position: 'middle'
					}).present();
				}
			}));
	}
	
	processResult(result,index:number,parentId:number,parentLevel:number){
		var catalgoueChildren = result.catalgoueChildren;
		var itemTos = result.itemTos;
		var catalogueParent = this.catalogueItems[this.getItemIndex(parentId,CatalogueItem.CATALOGUE_TYPE)];
		if(catalgoueChildren && catalgoueChildren.length > 0) {
			for(var resultIndex in catalgoueChildren){
				var catalgoue = catalgoueChildren[resultIndex];
				var catalogueItem = CatalogueItem.generate(catalgoue);
				catalogueItem.level = parentLevel+1;
				this.plusCatalogueChild(catalogueParent,catalogueItem);
				this.catalogueItems.splice(index, 0, catalogueItem);
				index ++;
			}
		} else if(itemTos && itemTos.length > 0) {
			for(var resultIndex in itemTos){
				var item = itemTos[resultIndex];
				var catalogueItem = CatalogueItem.generate(item);
				catalogueItem.level = parentLevel+1;
				this.plusCatalogueChild(catalogueParent,catalogueItem);
				this.catalogueItems.splice(index, 0, catalogueItem);
				index ++;
			}
		}
	}
	
	/**
	 * 目录内容点击,包含目录或者是目录内容的点击都在这里
	 */
	onCatalogueItemClick(catalogueItem,index:number){
		this.currentItem = catalogueItem;
		//类型是目录的操作
		if(catalogueItem.type == CatalogueItem.CATALOGUE_TYPE){
			this.coverPath = Url.http_header + this.course.cover;
			if(catalogueItem.isOpen) {
				//打开的目录收折
				this.removeChildren(catalogueItem,index);
			} else {
				//未打开的目录加载更多
				this.loadCatalogue(catalogueItem.id, index + 1, catalogueItem.level);
			}
		}else if(catalogueItem.type == CatalogueItem.VKE_TYPE || catalogueItem.type == CatalogueItem.MEDIA_TYPE){
			//类型是点击了微课或者多媒体
			this.coverPath = Url.http_header + catalogueItem.cover;
		}else if(catalogueItem.type == CatalogueItem.DOC_TYPE){
			//类型是点击了文档
			this.coverPath = Url.http_header + catalogueItem.cover;
		}else if(catalogueItem.type == CatalogueItem.PRAXIS_TYPE){
			//类型是点击了习题
			this.coverPath = Url.http_header + catalogueItem.cover;
		}
//		console.log(this.coverPath);
	}
	
	removeChildren(catalogueItem,index:number){
		catalogueItem.isOpen = false;
//		console.log(catalogueItem);
		var contentArr = catalogueItem.contentArr;
		if(contentArr && contentArr.length > 0){
			this.removeItem(index * 1 + 1,contentArr.length);
			contentArr.splice(0,contentArr.length);
		}
		
		var childrenArr = catalogueItem.childrenArr;
		if(childrenArr && childrenArr.length > 0){
			for(var indexChild in childrenArr){
				var child = childrenArr[indexChild];
				var catalogueChildIndex = this.getItemIndex(child.id,child.type);
				//console.log(this.catalogueItems[catalogueChildIndex]);
				this.removeChildren(this.catalogueItems[catalogueChildIndex],catalogueChildIndex);
			}
			this.removeItem(index + 1,childrenArr.length);
			childrenArr.splice(0,childrenArr.length);
		}
	}
	
	getItemIndex(id:number,itemType:string):number{
		for(var index in this.catalogueItems){
			if(this.catalogueItems[index].id == id && this.catalogueItems[index].type == itemType){
				return <number><any>index;
			}
		}
		
		return -1;
	}
	
	removeItem(index:number,howmany:number){
		this.catalogueItems.splice(index,howmany);
	}
	
	/**
	 * 目录儿子数量计数,再次点击目录的时候删除对应数量的child
	 */
	plusCatalogueChild(catalogue,child){
		if(catalogue){
			catalogue.isOpen = true;
			if(child.type == CatalogueItem.CATALOGUE_TYPE) {
				catalogue.childrenArr.push({
					id: child.id,
					type: child.type
				});
			} else {
				catalogue.contentArr.push({
					id: child.id,
					type: child.type
				});
			}
		}
	}
	
	getItemIcon(type:string){
//		console.log(type);
		return CatalogueItem.getItemIcon(type);
	}
	
	getColor(catalogueItem){
		if(this.currentItem && catalogueItem.id == this.currentItem.id && catalogueItem.type == this.currentItem.type){
			return "selected_color";
		}
		return "white";
	}
	
	enjoyCourse(){
		var this_ = this;

		let loading = this.loadingCtrl.create({
			content: "加载中请稍等"
		});
		loading.present();
		this.http.post(Url.application_join_course, JSON.stringify({
			courseId : this.course.id
		}), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				loading.dismiss();
				if(success) {
					this_.hasBuy = true;
				} else {
					this_.toastCtrl.create({
						message: result,
						duration: 2000,
						position: 'middle'
					}).present();
				}
			}));
	}
	
	startCourse(){
		this.navCtrl.pop();
		this.navCtrl.push(CourseDetailPage, {
			course: this.course
		});
	}
}