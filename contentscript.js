var totalPage;
var page = 0;
//注册前台页面监听事件

function dragpage()
{
	$('html, body').animate({scrollTop: $(document).height()}, 'slow'); 
}

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
		//totalPage = $("input[name=totalPage]").val();
		//console.log("totalPage----------" + totalPage);
		console.log("msg----------contentscript.js " + request.url);
		//getOrderInfo( sendResponse );
		
		var interval = window.setInterval("dragpage()",2000);
		setTimeout(function() {
			window.clearInterval(interval);

			$('html, body').animate({scrollTop: $(document).height()}, 'slow'); 
			var source=document.documentElement.outerHTML;
			console.log(source.length);
			sendMsg(source, request.url);

		},10000);
		
}); 



//将获取内容传递给后台文件进行处理
function sendMsg( content, url){
	chrome.extension.sendMessage({"content": content, "url": url}, function(response) {});
}

