export class Pagination {

	pageSize: number;
	currentPage: number;

	constructor() {}

	static generate(pageSize: number, currentPage: number) {
		let pagination : Pagination = new Pagination();
		pagination.pageSize = pageSize;
		pagination.currentPage = currentPage;
		return pagination;
	}

}