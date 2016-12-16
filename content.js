chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	var source=document.documentElement.outerHTML;
	console.log(source.length);
 // if(request.action == "getText");
  //{
   // var result = document.all[0].outerHTML; // innerText
    //sendResponse({content: result});
  //}
});