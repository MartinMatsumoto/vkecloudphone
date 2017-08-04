export class CatalogueItem {
	
	public static VKE_TYPE = "vke";
	public static MEDIA_TYPE = "media";
	public static PRAXIS_TYPE = "praxis_stem";
	public static DOC_TYPE = "course_doc";
	public static CATALOGUE_TYPE = "catalogue";
	
	id:number;
	catalogueId:number;
	catalogueCode:string;
	type:string;
	name:string;
	cover:string;
	title:string;
	isOpen:boolean = false;
	isContent:boolean = true;
	contentDetail;
	contentArr = [];
	childrenArr = [];
	isCurrent:boolean = false;
	level:number = 1;
	
	static generate(obj) {
		var catalogueItem:CatalogueItem = new CatalogueItem();
		if(obj.vke) {
			catalogueItem.type = CatalogueItem.VKE_TYPE;
			catalogueItem.id = obj.vke.id;
			catalogueItem.name = obj.vke.name;
			catalogueItem.title = obj.vke.title;
			catalogueItem.cover = obj.vke.cover;
			catalogueItem.catalogueId = obj.catalogueId;
			catalogueItem.catalogueCode = obj.catalogueCode;
		} else if(obj.media) {
			catalogueItem.type = CatalogueItem.MEDIA_TYPE;
			catalogueItem.id = obj.media.id;
			catalogueItem.name = obj.media.name;
			catalogueItem.title = obj.media.title;
			catalogueItem.cover = obj.media.cover;
			catalogueItem.catalogueId = obj.catalogueId;
			catalogueItem.catalogueCode = obj.catalogueCode;
		} else if(obj.stem) {
			catalogueItem.type = CatalogueItem.PRAXIS_TYPE;
			catalogueItem.id = obj.stem.id;
			catalogueItem.name = obj.stem.tagNames;
			catalogueItem.title = obj.stem.title;
			catalogueItem.cover = obj.stem.imagePath;
			catalogueItem.contentDetail = obj.stem;
			catalogueItem.catalogueId = obj.catalogueId;
			catalogueItem.catalogueCode = obj.catalogueCode;
		} else if(obj.doc) {
			catalogueItem.type = CatalogueItem.DOC_TYPE;
			catalogueItem.id = obj.doc.id;
			catalogueItem.name = obj.doc.docName;
			catalogueItem.title = obj.doc.title;
			catalogueItem.cover = obj.doc.cover;
			catalogueItem.catalogueId = obj.catalogueId;
			catalogueItem.catalogueCode = obj.catalogueCode;
		} else {
			catalogueItem.type = CatalogueItem.CATALOGUE_TYPE;
			catalogueItem.id = obj.id;
			catalogueItem.catalogueId = obj.id;
			catalogueItem.name = obj.name;
			catalogueItem.isContent = false;
			catalogueItem.catalogueCode = obj.code;
		}
//		console.log(obj);
		return catalogueItem;
	}
	
	static getItemIcon(type:string){
		if(type == CatalogueItem.DOC_TYPE){
			return "attach";
		}else if(type == CatalogueItem.PRAXIS_TYPE){
			return "create";
		}else if(type == CatalogueItem.MEDIA_TYPE){
			return "film";
		}else if(type == CatalogueItem.VKE_TYPE){
			return "play";
		}
	}
}
