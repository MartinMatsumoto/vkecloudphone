import {
	SQLite
} from 'ionic-native';

export class SqlHelper {

	public static savePwdTableName: string = "savedpwd";
	public static userTableName: string = "users";
	public static idname: string = "id";

	static dbConfig = {
		name: 'vkecloudphone.db',
		location: 'default'
	}

	static insertOrUpdate(obj, tableName) {
		if(!obj || !tableName) {
			return;
		}

		SqlHelper.createTable(obj, tableName);

		var insertOrUpdateSql = "INSERT INTO " + tableName + "(";
		var questions = "";
		var valueArr = [];
		for(var i in obj) {
			if(obj.hasOwnProperty(i)) {
				insertOrUpdateSql += i + ",";
				questions += "?,"
				valueArr.push(obj[i]);
			};
		}
		insertOrUpdateSql = insertOrUpdateSql.substring(0, insertOrUpdateSql.length - 1);
		questions = questions.substring(0, questions.length - 1);
		insertOrUpdateSql += ") VALUES (" + questions + ");";

		SqlHelper.exeSql(insertOrUpdateSql, valueArr);
	}

	static createTable(obj, tableName) {
		var createSql = " CREATE TABLE IF NOT EXISTS " + tableName + " ( ";
		for(var i in obj) {
			if(obj.hasOwnProperty(i)) {
				if(i == SqlHelper.idname) {
					createSql = createSql + i + " INTEGER PRIMARY KEY ,"
				} else {
					createSql = createSql + i + " TEXT ,"
				}
			};
		}
		createSql = createSql.substring(0, createSql.length - 1);
		createSql += " );";

		SqlHelper.exeSql(createSql, []);
	}

	static exeSql(sql: string, params) {
		let db = new SQLite();

		SQLite.openDatabase(SqlHelper.dbConfig)
			.then((db: SQLite) => {
				db.executeSql(sql, params).then((data) => {
					console.log("INSERTED: " + JSON.stringify(data));
				}, (error) => {
					console.log("ERROR: " + JSON.stringify(error.err));
				});
			})
			.catch(error => {

			});

	}

	static select(tableName, where, orderBy, callback, errorback) {
		var selectSql = "SELECT * FROM " + tableName;
		var valueArr = [];
		var result = [];
		if(where) {
			var count = 1;
			for(var i in where) {
				if(where.hasOwnProperty(i)) {
					if(count == 1){
						selectSql += " WHERE " + i +" =? "
					}else{
						selectSql += " AND " + i +" =? "
					}
					valueArr.push(where[i]);
				}
			}
		}
		
		if(orderBy){
			for(var i in orderBy) {
				selectSql += " ORDER BY " + i + " " + orderBy[i];
			}
		}
		selectSql += ";";
		
		let db = new SQLite();
		db.openDatabase(SqlHelper.dbConfig)
			.then(() => {
				db.executeSql(selectSql, valueArr).then((data) => {
					if(data.rows.length > 0) {
		                for(var i = 0; i < data.rows.length; i++) {
		                    result.push(data.rows.item(i));
		                }
		            }
					if(callback){
	                	callback(result);
	                }
				}, (error) => {
					errorback(error);
				});
			})
			.catch(error => {
					if(errorback){
		        		errorback(error + selectSql + "---");
		        	}
			});
		
		/*SQLite.openDatabase(SqlHelper.dbConfig)
			.then((db: SQLite) => {
				db.executeSql(selectSql, valueArr).then((data) => {
		            if(data.rows.length > 0) {
		                for(var i = 0; i < data.rows.length; i++) {
		                    result.push(data.rows.item(i));
		                }
		            }
		            if(callback){
	                	callback(result);
	                }
		        }, (error) => {
		        	if(errorback){
		        		errorback(error + selectSql);
		        	}
		        });
			})
			.catch(error => {
					if(errorback){
		        		errorback(error + selectSql + "---");
		        	}
			});*/
			
		/*SQLite.openDatabase(SqlHelper.dbConfig)
			.then((db: SQLite) => {
				db.executeSql(selectSql, valueArr).then((data) => {
		            if(data.rows.length > 0) {
		                for(var i = 0; i < data.rows.length; i++) {
		                    result.push(data.rows.item(i));
		                }
		            }
		            if(callback){
	                	callback(result);
	                }
		        }, (error) => {
		        	if(errorback){
		        		errorback(error + selectSql);
		        	}
		        });
			})
			.catch(error => {
				if(errorback){
	        		errorback(error + "2222");
	        	}
			});*/
			
	}
	
	
	static delete(tableName, where) {
		var selectSql = "DELETE FROM " + tableName;
		var valueArr = [];
		var result = [];
		if(where) {
			var count = 1;
			for(var i in where) {
				if(where.hasOwnProperty(i)) {
					if(count == 1){
						selectSql += " WHERE " + i +" =? "
					}else{
						selectSql += " AND " + i +" =? "
					}
					valueArr.push(where[i]);
				}
			}
		}
		
		SQLite.openDatabase(SqlHelper.dbConfig)
		.then((db: SQLite) => {
			db.executeSql(selectSql, valueArr).then((data) => {
	        }, (error) => {
	            console.log("ERROR: " + JSON.stringify(error));
	        });
		})
		.catch(error => {

		});
	}
}