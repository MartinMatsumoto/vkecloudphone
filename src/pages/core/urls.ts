export class Url {
	
	static http_header : string = "http://cl.evervke.cn/";// url头
	
	static login_url : string = Url.http_header + "outside/login.htm";// 登录
	
	static register_url : string = Url.http_header + "outside/user/register.htm";// 注册

	static retrieve_password : string = Url.http_header + "outside/user/retrieve_password.htm";// 找回密码

	static find_all_course:string = Url.http_header + "outside/user/find_all_course.htm";// 获得所有我的课程

	static search_course:string = Url.http_header + "outside/search/commodity_search.htm";// 搜索全部课程
	
	static get_maptree:string = Url.http_header + "outside/pad/map_tree/get_list.htm";// 获得码表

	static catalogue_children:string = Url.http_header + "outside/course/catalogue_children.htm";// 获得目录

	static get_praxistem_assessement:string = Url.http_header + "outside/user/get_praxistem_assessement.htm";// 获得习题是否已做

	static praxis_stem_in_wrong:string = Url.http_header + "outside/wrong/praxis_stem_in_wrong.htm";// 是否加入错题集

	static add_wrong:string = Url.http_header + "outside/wrong/add_wrong.htm";// 加入错题集

	static do_exercise:string = Url.http_header + "outside/praxis_stem/do_exercise.htm";// 做习题

	static find_relation:string = Url.http_header + "outside/course/find_relation.htm";// 查找关联

	static list_my_notes:string = Url.http_header + "outside/notes/list_my_notes.htm";// 获得我的笔记
	
	static list_my_questions:string = Url.http_header + "outside/question/list_my_questions.htm";// 获得我的答疑

	static list_all_questions:string = Url.http_header + "outside/question/list_all_questions.htm";// 获得课程内的答疑

	static list_all_notes:string = Url.http_header + "outside/notes/list_all_notes.htm";// 获得课程内的笔记

	static question_reply:string = Url.http_header + "outside/question_reply/reply.htm";// 获得答疑回复
	
	static question_add_reply:string = Url.http_header + "outside/question_reply/add_reply.htm";// 答疑回复

	static notes_delete:string = Url.http_header + "outside/notes/delete.htm";// 删除笔记

	static notes_update:string = Url.http_header + "outside/notes/update.htm";// 修改笔记

	static question_create:string = Url.http_header + "outside/question/create.htm";// 创建答疑

	static notes_create:string = Url.http_header + "outside/notes/create.htm";// 创建笔记
	
	static follow_list:string = Url.http_header + "outside/user/follow_list.htm";// 关注人列表

	static notice_list:string = Url.http_header + "outside/notice/list.htm";// 系统消息列表

	static message_list:string = Url.http_header + "outside/message/list.htm";// 个人消息列表

	static send_letters_list:string = Url.http_header + "outside/message/send_letters_list.htm";// 对话消息列表

	static send_letter:string = Url.http_header + "outside/message/send.htm";// 发送消息
	
	static canel_following:string = Url.http_header + "outside/user/canel_following.htm";// 取消关注

	static modify_user:string = Url.http_header + "outside/user/modify.htm";// 修改用户信息

	static search_user:string = Url.http_header + "outside/user/search.htm";// 搜索用户

	static following_user:string = Url.http_header + "outside/user/following.htm";// 关注用户

	static modify_password:string = Url.http_header + "outside/user/modify_password.htm";// 修改密码

	static has_buy:string = Url.http_header + "outside/user/has_buy.htm";// 是否购买课程

	static application_join_course:string = Url.http_header + "outside/commodity_course/application_join_course.htm";// 加入课程

}
