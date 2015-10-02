/**
*	Login's Page
**
*/

var App={
	elements:{
		'el':$("body"),
		"loginEl" : $(".login"),
		"inputs" : $(".login input"),
		"warn" : $(".warn")
	},
	events:function(){
		this.elements.loginEl.find("form").bind("submit",this.submit);
	},
	init:function(){
		this.usr = null;
		this.events();
		//this.usr = jQuery.parseJSON($.cookie("portal")); 
		this.elements.inputs.attr("autocomplete", "off");
		/*if(this.usr)
            window.location.href = './';*/
	},
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
	    	val = val.join("/");
	    	$(".mask").fadeIn();
	    	$.getJSON("http://189.126.197.169/node/express/setuser?query=" + val + "?callback=?", function(a) {   
			    if(a.TIPO && null !== a.TIPO) {
			    	return $.cookie.json = !0, $.cookie("portal", a, {expires:7, path:"/"}), window.location.href = "./", !1;
			    }
			    contex.elements.warn.fadeIn();
			    $(".mask").fadeOut();
		  	});
	    }
	    else{
	    	contex.elements.warn.fadeIn();
	    	return !1;
	    }
	}
	
};

App.init();