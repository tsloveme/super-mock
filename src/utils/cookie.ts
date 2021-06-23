
function _addCookie(name:string,value:number,iDay:number){
	if(iDay){
		//设置过期时间
		var oDate = new Date();
		oDate.setDate(oDate.getDate()+iDay);
		document.cookie = name+'='+value+'; PATH=/; EXPIRES='+oDate.toUTCString();
	}else{
		//默认不设置过期时间
		document.cookie = name+'='+value+'; PATH=/';
	}
}
export const addCookie = _addCookie;
 
function _getCookie(name:string){
	//name=李四; age=18; sex=男; weight=50
	var arr = document.cookie.split('; ');
	for(var i=0;i<arr.length;i++){
		var arr2 = arr[i].split('=');
		if(arr2[0]==name){
			return arr2[1];
		}
	}
}
export const getCookie = _getCookie;

function _removeCookie(name:string){
	_addCookie(name,1,-1);
}
export const removeCookie = _removeCookie;
