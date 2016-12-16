var flag = false;
var currentTabId;
var debug = false;
var pause = true;
var session_start = false;
var json_bak;
var cur_url;
var mail = '';
var client_name = '';
var validPage = true;
var taskID = '';
var serverAddr;//= '116.228.187.165:8090';
var ver = '161203';
chrome.alarms.onAlarm.addListener(function(alarm) {
	if(pause){
		validPage = true;
		return;
	}
	if(validPage){
		validPage = false;
		console.log('wait valid page');
	}
	else{
		console.log('timeout id=' + currentTabId );
		chrome.tabs.remove(currentTabId, function() {
	 		console.log('The tabs has been closed.');
	 	});
		openURL();
	}
});

chrome.browserAction.onClicked.addListener(function(tab) {
	currentTabId = tab.id;
	$.getJSON("http://116.228.187.164:8090/server_2/ConfigurationInfo", function(data){
		serverAddr = data.interfaceip;
		console.log(serverAddr);
		chrome.storage.sync.get([
			'mail',
			'client_name',
			], function(items) {
				mail = items.mail;
				client_name = items.client_name;

			});
		if(pause == true){
			pause = false;
			chrome.browserAction.setIcon({path:"pause.png"}); 
		}
		else{
			pause = true;
			chrome.browserAction.setIcon({path:"play.png"});
			return;
		}

		chrome.alarms.create("checktask", {delayInMinutes: 0.1, periodInMinutes: 0.5} );

		//	test = '杨氏蜜蜂园自然成熟农家自产土蜂蜜枸杞蜜玻璃瓶装'
		//	test_base54 = encode64(utf16to8(test));
		//	console.log(test);
		//	return;


		counter = 40;
		flag = true;

		//alert(pause);


		if(session_start == true)
			return;

		session_start = true;
		openURL();
	});
	
});


function openURL(){
	if(debug == true){

		data = {"retries":"4","buildTime":"1477887900316","industry":"food","buildDate":"2016-10-31 12:25:00","type":"detail","category":"feng_mi","platformName":"yhd","uuid":"c160b309-8c13-4a86-adb5-4772eae19617","injectTime":"1477887900316","url":"https://detail.tmall.com/item.htm?id=8689817029","status":"builded","lastRecTime":"1477887900316"};
		setJson(data);
		t_url = data.url;
		chrome.tabs.create({url: t_url}, function(tab) {
	  		//	sendMsg(tab.id);
			  });
	}
	else{
		$.getJSON("http://" + serverAddr + "/server_2/task", function(data){
			t_url = data.url;
			
			setJson(data);
			console.log(t_url);
			taskID = t_url.match(/id=\d+/);
			chrome.tabs.create({url: t_url}, function(tab) {
	  			//sendMsg(tab.id);
			  });
		});

	}
}

chrome.webNavigation.onCompleted.addListener(function( tab ){
	console.log('加载完成***' + tab.url + '   id=' + tab.tabId);
	currentTabId = tab.tabId;
    if(tab.url != json_bak.url){
    	incomingID = tab.url.match(/id=\d+/);
    	if(incomingID == null || taskID == null){
    		console.log('url not match');
    		return;
    	}
    	if(incomingID[0]==taskID[0]){
    		console.log("id match --" + incomingID + "--" + taskID);
    	}
    	else{
    		console.log("id not match --" + incomingID + "--" + taskID);
    		return;
    	}
    }
    validPage = true;
	cur_url = tab.url;
	currentTabId = tab.tabId;
	sendMsg( tab.tabId, tab.url ); 
	//if( flag ){
	//	sendMsg( tab.tabId );
	//}
});

function sleep(milliSeconds) { 
    var startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + milliSeconds);
 };


function base64_encode(str){
    var c1, c2, c3;
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";        
    var i = 0, len= str.length, string = '';
 
    while (i < len){
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len){
            string += base64EncodeChars.charAt(c1 >> 2);
            string += base64EncodeChars.charAt((c1 & 0x3) << 4);
            string += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len){
            string += base64EncodeChars.charAt(c1 >> 2);
            string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            string += base64EncodeChars.charAt((c2 & 0xF) << 2);
            string += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        string += base64EncodeChars.charAt(c1 >> 2);
        string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        string += base64EncodeChars.charAt(c3 & 0x3F)
    }
        return string
}

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request.url + " finished"); 
    
    //console.log(request);
    content = encode64(utf16to8(request.content));

//data = {"retries":"4","buildTime":"1477887900316","industry":"food",
//"buildDate":"2016-10-31 12:25:00","type":"detail","category":"feng_mi",
//"platformName":"yhd","uuid":"c160b309-8c13-4a86-adb5-4772eae19617",
//"injectTime":"1477887900316","url":"http://item.yhd.com/item/10409648","status":"builded","lastRecTime":"1477887900316"};
	
	var json_result = {};     
	json_result.client_name = client_name;
	json_result.ver = ver;
    json_result.category = json_bak.category;
    json_result.platform_name = json_bak.platformName;
    json_result.type = json_bak.type;
    json_result.url = json_bak.url;
    json_result.retries  = json_bak.retries;
    json_result.build_date = json_bak.buildDate;
    json_result.uuid = json_bak.uuid;
    json_result.buildtime = json_bak.buildtime;
    json_result.metadata = request.content.length;
    json_result.size = request.content.length;
    json_result.fail_tag = 'false';
    if(request.content.indexOf('您查看的商品找不到了')!= -1){
    	json_result.fail_tag = 'true';
    	console.log('Not found');
    	//alert("商品找不到");
    }
    json_result.content = request.content;
    

   	if(json_result.size < 100000){
   		console.log('json_result.size < 100000');
   		json_result.fail_tag = 'true';
   		//alert("网页长度<100000");
   	}

   	if(json_result.fail_tag == 'true'){
   		pause = true;
		//chrome.browserAction.setIcon({path:"play.png"});
		$.getJSON("http://116.228.187.164:8090/SendEmail?to=" + mail, function(data){
			console.log('send mail to ' + mail);
		});
   	}

   //console.log(json_result);

	//alert(json_bak);
	if(debug){
		return;
	}
	
	json_result_str =  JSON.stringify(json_result);

	if(1){

		$.ajax({
			url: "http://" + serverAddr + "/server_2/PlugInUploadInfo",
			cache: false,
			type: "POST",
			data: json_result_str,
			contentType: "text/html; charset=utf-8",
		}).done(function(msg) {
		
			
		}).fail(function(jqXHR, textStatus) {
			
		});



	}
	
	chrome.tabs.remove(currentTabId, function() {
	 	console.log('The tabs has been closed.');
	 });
	session_start = false;

	//console.log(request.content);
	//return;

	//sleep(5000);
	if(pause == true)
		return;
	openURL();

 });

 function sendSku2Info(colores){
	 chrome.tabs.query(
			{active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {"cmd":"ok", "sku": colores}, 
				function(response) {    
					console.log(response);  	
				}); });
}
 
function sendMsg( tabid, cur_url ){
	console.log(tabid + "--sendMsg()----eventPage.js");
	chrome.tabs.sendMessage(tabid, { "url": cur_url}, function(response) {
	});
}

function setJson(json_data){
	json_bak = json_data;
}

var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
//将Ansi编码的字符串进行Base64编码

function encode64(input) {
var output = "";
var chr1, chr2, chr3 = "";
var enc1, enc2, enc3, enc4 = "";
var i = 0;
do {
chr1 = input.charCodeAt(i++);
chr2 = input.charCodeAt(i++);
chr3 = input.charCodeAt(i++);
enc1 = chr1 >> 2;
enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
enc4 = chr3 & 63;
if (isNaN(chr2)) {
enc3 = enc4 = 64;
} else if (isNaN(chr3)) {
enc4 = 64;
}
output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2)
+ keyStr.charAt(enc3) + keyStr.charAt(enc4);
chr1 = chr2 = chr3 = "";
enc1 = enc2 = enc3 = enc4 = "";
} while (i < input.length);
return output;
}
//将Base64编码字符串转换成Ansi编码的字符串
function decode64(input) {
var output = "";
var chr1, chr2, chr3 = "";
var enc1, enc2, enc3, enc4 = "";
var i = 0;
if (input.length % 4 != 0) {
return "";
}
var base64test = /[^A-Za-z0-9\+\/\=]/g;
if (base64test.exec(input)) {
return "";
}
do {
enc1 = keyStr.indexOf(input.charAt(i++));
enc2 = keyStr.indexOf(input.charAt(i++));
enc3 = keyStr.indexOf(input.charAt(i++));
enc4 = keyStr.indexOf(input.charAt(i++));
chr1 = (enc1 << 2) | (enc2 >> 4);
chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
chr3 = ((enc3 & 3) << 6) | enc4;
output = output + String.fromCharCode(chr1);
if (enc3 != 64) {
output += String.fromCharCode(chr2);
}
if (enc4 != 64) {
output += String.fromCharCode(chr3);
}
chr1 = chr2 = chr3 = "";
enc1 = enc2 = enc3 = enc4 = "";
} while (i < input.length);
return output;
}
function utf16to8(str) {
 var out, i, len, c;
 out = "";
 len = str.length;
 for(i = 0; i < len; i++) {
  c = str.charCodeAt(i);
  if ((c >= 0x0001) && (c <= 0x007F)) {
   out += str.charAt(i);
  } else if (c > 0x07FF) {
   out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
   out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
   out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
  } else {
   out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
   out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
  }
 }
 return out;
}