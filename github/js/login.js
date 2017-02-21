/**
*@fileOverview Login Page
* @module Login
*
*/

/**
*@classDesc This class deal with all action of users' `login`
*@exports Login
*@constructor
*/
var App={
	elements:{
		'el':$("body"),
		"loginEl" : $(".login"),
		"inputs" : $(".login input"),
		"warn" : $(".warn")
	},
	/**
	* `This method is responsible for call all listeners, in our case, call submit listener.`
	* @memberOf Login#
	*/
	events:function(){
		this.elements.loginEl.find("form").bind("submit",this.submit);
	},

	/**
	* `Initial method, responsible for call events method and verify if user is logged or not.`
	* @memberOf Login#
	*/
	init:function(){
		this.usr = null;
		this.events();
		this.usr = jQuery.parseJSON($.cookie("portal")); 
		this.elements.inputs.attr("autocomplete", "off");
		/*if(this.usr)
            window.location.href = './index.html';*/
	},

	/**
	* `Submit method.`
	* @param {event} a - Submit event itself
	* @memberOf Login#
	*/
	submit:function(a){
		a.preventDefault();
		var complet,val=[],contex=App;
		contex.elements.inputs.removeClass("error");

		//Pass into all inputs
		$.each(contex.elements.inputs, function(index, obj) {
		  complet = !1;
	      if(!obj.value) {
	      	//If if empty and is required
	        return $(this).addClass('error'), !1;
	      }
	      val.push(obj.value);
	      complet = !0;
	    });
	    if(complet){
	    	$(".mask").fadeIn();
	    	var wsUrl = "../../WebService.asmx?op=Login";
	    	var soapRequest ='<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><Login xmlns="http://tempuri.org/"><USU_LOGIN>'+val[0]+'</USU_LOGIN><USU_PASS>'+val[1]+'</USU_PASS></Login></soap:Body></soap:Envelope>';
	    	$.support.cors=true;
			$.ajax({
				type: "POST",
				url: wsUrl,
				contentType: "text/xml; charset=utf-8",
				dataType: "xml",
				crossDomain: true,
				data: soapRequest,
				success: function(data, status, req){
					if (status == "success") {
						$(".mask").fadeOut();
						var result=jQuery.parseJSON($(req.responseXML).text());
						console.log(result);
				        if(result.USU_LOGIN !== null){
				        	return $.cookie.json = !0, $.cookie("webfair", result, {expires:7, path:"/"}), window.location.href = "./index.html", !1;
				        }
				        else{
				        	contex.elements.warn.fadeIn();
				        }
				    }
				},
				error: function(data, status, req) {
					alert(req.responseText + " " + status);
				}
			});
	    }
	    else{
	    	contex.elements.warn.fadeIn();
	    	return !1;
	    }
	}
	
};
App.init();