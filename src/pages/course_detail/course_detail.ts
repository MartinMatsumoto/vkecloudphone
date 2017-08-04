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
	Pagination
} from '../core/pagination';

import {
	CatalogueItem
} from '../core/catalogue_item';

import {
	CourseViewPraxis
} from '../praxis/course_view_praxis';

import {
	QuestionsDetailPage
} from '../questions/questions_detail/questions_detail';

import {
	NotesDetailPage
} from '../notes/notes_detail/notes_detail';

import {
	Vkeplay
} from '../vkeplay/vkeplay';

import {
	Docview
} from '../docview/docview';

import {
	DomSanitizer
} from '@angular/platform-browser';

@Component({
	templateUrl: 'course_detail.html'
})
export class CourseDetailPage {
	
	playerHeight:number;
	course;
	course_detail:string = "catalogue";
	
	catalogueInit:boolean = false;
	showCover:boolean = true;
	
	//playerPath:string = "http://www.v-school.cn/play/html5_vke/52890";
	
	urlHeader:string = Url.http_header;
	docPathHeader:string = Url.http_header + "play/html5_doc/";
	playerPathHeader:string = Url.http_header + "play/html5_vke/";
	playerPath:any = "";
	coverPath:string = "";
	questionInfiniteScroll;
	notesInfiniteScroll;
	
	catalogueItems = [];
	currentItem : CatalogueItem;
	
	questions = [];
	notes = [];
	pageSize:number = 10;
	currentQuestionPage:number = 1;
	currentNotesPage:number = 1;
	
	constructor(params: NavParams, public navCtrl: NavController, public modalCtrl: ModalController, private http: Http, private toastCtrl: ToastController, private loadingCtrl: LoadingController,private sanitizer: DomSanitizer) {
		this.course = params.data.course;
//		console.log(this.course);
		this.playerHeight = 200;
//发布手机版本的时候打开,电脑屏幕太大了.
//		this.playerHeight = screen.width / 16 * 9;
		this.changeCatalogue();
		
		this.coverPath = Url.http_header + this.course.cover;
	}
	
	changeCatalogue() {
		if(!this.catalogueInit) {
			this.loadCatalogue(this.course.rootCatalogueId, 0, 0);
			this.catalogueInit = true;
		}
	}
	
	changeDetail() {
		
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
		this.playerPath = this.sanitizer.bypassSecurityTrustResourceUrl("");
		this.showCover = true;
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
	
	showPlayBtn(){
		return this.currentItem && (this.currentItem.type == CatalogueItem.VKE_TYPE || this.currentItem.type == CatalogueItem.MEDIA_TYPE);
	}
	
	showEditBtn(){
		return this.currentItem && this.currentItem.type == CatalogueItem.DOC_TYPE;
	}
	
	showScanBtn(){
		return this.currentItem && this.currentItem.type == CatalogueItem.PRAXIS_TYPE;
	}
	
	play (){
		/*this.playerPath = this.playerPathHeader + this.currentItem.id;
		this.playerPath = this.sanitizer.bypassSecurityTrustResourceUrl(this.playerPath); 
		this.showCover = false;*/
		
		this.navCtrl.push(Vkeplay, {
			vkeId: this.currentItem.id
		});
	}
	
	viewDoc(){
		/*this.playerPath = this.docPathHeader + this.currentItem.id;
		this.playerPath = this.sanitizer.bypassSecurityTrustResourceUrl(this.playerPath); 
		this.showCover = false;*/
		
		this.navCtrl.push(Docview, {
			docId: this.currentItem.id
		});
	}
	
	viewPraxis(){
		this.navCtrl.push(CourseViewPraxis, {
			praxis: this.currentItem,
			courseId : this.course.id
		});
	}
	
	/**
	 * 讨论标签切换
	 */
	changeQuestion() {
		if(this.questionInfiniteScroll){
			this.questionInfiniteScroll.enable(true);
		}
		this.questions.splice(0,this.questions.length);
		this.currentQuestionPage = 1;
		this.loadQuestions(null);
	}
	
	/**
	 * 加载讨论
	 */
	loadQuestions(questionInfiniteScroll){
		//当前没点击任何内容
		if(!this.currentItem || this.currentItem.type == CatalogueItem.DOC_TYPE){
			if(questionInfiniteScroll){
				questionInfiniteScroll.enable(false);
			}
			return;
		}
		
		var requestObj = {
			pageSize: this.pageSize,
			contentMetaValue: this.currentItem.type,
			catalogueCode: this.currentItem.catalogueCode,
			courseId: this.course.id,
			currentPage: this.currentQuestionPage,
			contentId: this.currentItem.id
		}
		
		//目录点击  去掉类型和内容id
		if(this.currentItem.type == CatalogueItem.CATALOGUE_TYPE){
			delete requestObj.contentMetaValue;
			delete requestObj.contentId;
		}
		
		var this_ = this;

		let loading = this.loadingCtrl.create({
			content: "加载中请稍等"
		});
		if(!questionInfiniteScroll) {
			loading.present();
		} else {
			this.questionInfiniteScroll = questionInfiniteScroll;
		}
		this.http.post(Url.list_all_questions, JSON.stringify(requestObj), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				if(questionInfiniteScroll){
					questionInfiniteScroll.complete();
				}else{
					loading.dismiss();
				}
				if(success) {
					if(result.questions){
						this_.processQuestions(result.questions);
					}
					if(!result.questions || (questionInfiniteScroll && result.questions.length < this_.pageSize)){
						questionInfiniteScroll.enable(false);
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
	
	processQuestions(questions){
		for(var index in questions){
			this.questions.push(questions[index]);
		}
		this.currentQuestionPage++;
	}
	
	onQuestionClick(question){
		this.navCtrl.push(QuestionsDetailPage, {
			question: question
		});
	}
	
	/**
	 * 笔记标签切换
	 */
	changeNotes() {
		if(this.notesInfiniteScroll){
			this.notesInfiniteScroll.enable(true);
		}
		this.notes.splice(0,this.notes.length);
		this.currentNotesPage = 1;
		this.loadNotes(null);
	}
	
	/**
	 * 加载笔记
	 */
	loadNotes(notesInfiniteScroll){
		//当前没点击任何内容
		if(!this.currentItem || this.currentItem.type == CatalogueItem.DOC_TYPE){
			if(notesInfiniteScroll){
				notesInfiniteScroll.enable(false);
			}
			return;
		}
		
		var requestObj = {
			pageSize: this.pageSize,
			contentMetaValue: this.currentItem.type,
			catalogueCode: this.currentItem.catalogueCode,
			courseId: this.course.id,
			currentPage: this.currentNotesPage,
			contentId: this.currentItem.id
		}
		
		//目录点击  去掉类型和内容id
		if(this.currentItem.type == CatalogueItem.CATALOGUE_TYPE){
			delete requestObj.contentMetaValue;
			delete requestObj.contentId;
		}
		
		var this_ = this;

		let loading = this.loadingCtrl.create({
			content: "加载中请稍等"
		});
		if(!notesInfiniteScroll) {
			loading.present();
		} else {
			this.notesInfiniteScroll = notesInfiniteScroll;
		}
		this.http.post(Url.list_all_notes, JSON.stringify(requestObj), {
			headers: Constant.getHeader()
		}).subscribe((res: Response) => Constant.authHttpResult(res.json(),
			function(success: boolean, result) {
				if(notesInfiniteScroll){
					notesInfiniteScroll.complete();
				}else{
					loading.dismiss();
				}
				if(success) {
					if(result.notes){
						this_.processNotes(result.notes);
					}
					if(!result.notes || (notesInfiniteScroll && result.notes.length < this_.pageSize)){
						notesInfiniteScroll.enable(false);
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
	
	processNotes(notes){
		for(var index in notes){
			this.notes.push(notes[index]);
		}
		this.currentNotesPage++;
	}
	
	onNotesClick(note){
		var this_ = this;
		this.navCtrl.push(NotesDetailPage, {
			note: note,
			callBack : function(){
				this_.changeNotes();
			}
		});
	}
	
	getColor(catalogueItem){
		if(this.currentItem && catalogueItem.id == this.currentItem.id && catalogueItem.type == this.currentItem.type){
			return "selected_color";
		}
		return "white";
	}
}