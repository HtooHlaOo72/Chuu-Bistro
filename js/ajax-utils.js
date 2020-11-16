(function(global){
    var ajaxUtils={};
    var getRequestObject=function (){
        if(window.XMLHttpRequest){
            console.log("sent req");
            return (new XMLHttpRequest());
        }
        else if(window.ActiveXObject){
            return (new ActiveXObject());
        }
        else{
            global.alert("Ajax is not supported");
            return null;
        }
    }
    ajaxUtils.sendGetRequest=function (requestUrl,responseHandler,isJsonResponse){
        console.log("in send req original");
        var request=getRequestObject();
        request.onreadystatechange=function(){
            handleResponse(request,responseHandler,isJsonResponse);
        }
        request.open("GET",requestUrl,true);
        request.send();
    }
    function handleResponse(request,responseHandler,isJsonResponse){
        console.log("in handle response "+request.readyState );
        if((request.readyState==4)&&(request.status==200)){
            if(isJsonResponse==undefined){
                isJsonResponse=true;
                console.log("Json is undefined "+isJsonResponse);
            }

            if(isJsonResponse==true){
                responseHandler(JSON.parse(request.responseText));
                console.log("parsed to obj");
            }
            else{
                responseHandler(request.responseText);
                console.log("finished response as text.... ");
            }
            console.log("in handle response");
            
        }
    }
    global.$ajaxUtils=ajaxUtils;




})(window);