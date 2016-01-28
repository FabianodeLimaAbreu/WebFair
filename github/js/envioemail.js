/**
*@fileOverview Send Email's Page
* @module App
*
*/

/**
*@classDesc This class deal with all action of users' `send email`
*@exports App
*@constructor
*/

var App={
	elements:{
		'el':$("body"),
		"loginName" : $(".login-name"),
		"loginId" : $(".login-id"),
        "loginName":$(".login-name")
	},

	/**
	*This method is responsible for call all listeners, in our case, call submit listener
	* @memberOf Login#
	* @name events
	*/
	events:function(){
		var core=this;
		$(".send-temp").bind("click",this.submit);
		$(".hash").bind("click",function(a){core.addHash(a)});
		$(".info-template textarea").bind("focus",this.focusArea);
        $(".send-temp").bind("click",function(a){core.submitTemp(a)});
	},

	/**
	*Initial method, responsible for call events method and verify if user is logged or not.
	* @memberOf Login#
	* @name init
	*/
	init:function(){
		this.usr = null;
		this.usr = jQuery.parseJSON($.cookie("webfair")); 
		this.tempcookie=null;
        this.tempforn=null;
        this.tempforn=$.cookie("tempforn");
		this.tempcookie=$.cookie("sendemail"); 
		if(!this.usr)
            window.location.href = 'login.html';

        if(this.tempcookie && this.tempforn){
        	this.tempcookie=jQuery.parseJSON(this.tempcookie);
            this.tempforn=jQuery.parseJSON(this.tempforn);
            this.elements.loginName.text(this.tempcookie.opt[2].USU_NOME);
            this.elements.loginId.text(this.tempcookie.opt[2].SEGM_DESC);
        }
        else{
        	alert("um erro ocorreu");
        }

        this.requestService(getQueryStringValue("template"));
	},

	requestService:function(id){
		var core=this;
		$.support.cors=true;
    	core.ajaxrequest=!0;                                                                        
        $.ajax({
            type: "POST",
            url: nodePath+"listarTemplates",
            contentType: "text/xml; charset=utf-8",
            dataType: "xml",
            crossDomain: true,
            context: core,
            data: '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ListarEmailTemplates xmlns="http://tempuri.org/"><TEMP_ID>'+id+'</TEMP_ID><TEMP_DESC></TEMP_DESC><SEGM_COD></SEGM_COD></ListarEmailTemplates></soap:Body></soap:Envelope>',
            success: core.callRequest,
            error: core.processError
        });
	},

	callRequest:function(data, status, req){
		var a=jQuery.parseJSON($(req.responseXML).text())[0];
		var result="";
        result='<tr class="tropened"><td style="max-width:200px;">'+a.TEMP_ID+'<br/><div class="info-template item'+a.TEMP_ID+'"><div class="text-template"><p><b>ASSUNTO</b></p><br><form><textarea name="TEMP_SUBJECT">'+this.replaceTags(a.TEMP_SUBJECT)+'</textarea><br><p><b>TEXTO</b></p><br><textarea name="TEMP_BODY" class="edit-text">'+this.replaceTags(a.TEMP_BODY)+'</textarea></form></div><ul class="custombuttons"><li><p><b>ITENS PERSONALIZADOS</b></p></li><li><button type="button" class="icon floatLeft s-four  hash" alt="SUPPLIER" name="'+a.TEMP_ID+'">Fornecedor</button></li><li><button type="button" class="icon floatLeft s-four  hash" alt="SAMPLES" name="'+a.TEMP_ID+'">Amostras</button></li><li><button type="button" class="icon floatLeft s-four  hash" alt="CONTACT" name="'+a.TEMP_ID+'">Contato</button></li></ul><ul class="ulbottom"><li><button type="button" class="icon floatLeft s-four send-temp" alt="list" name="'+a.TEMP_ID+'">Enviar</button></li></ul></div></td></td><td>'+a.SEGM_DESC+'</td><td>'+a.TEMP_DESC+'</td><td>'+a.TP_TEMP_DESC+'</td></tr>';
        $("tbody").html(result);
        this.events();
        this.replaceTags();
	},

	processError:function(data, status, req){
        var modal=new Modal(!0,"Um erro ocorreu!!!");
        modal.open();
    },

    replaceTags:function(val){
    	if(!val){
    		return "";
    	}
    	var amos_code=[],principal;

    	//Pegando todos os códigos
    	for(var i=0;i<this.tempcookie.opt[0].length;i++){
    		amos_code.push(this.tempcookie.opt[0][i].AMOS_DESC);
    	}

    	val = val.replace("##SAMPLES"," "+amos_code.join(" ; ")+"").replace("##SUPPLIER",this.tempforn.opt[0].FORN_DESC).replace("##CONTACT",this.tempcookie.opt[1].CONT_NOME);
    	return val;
    },

    addHash:function(a){	
      var el=$(a.target),area,core=this;
      area=$(".info-template textarea.focused");
      var caretPos = area[0].selectionStart;    
      var textAreaTxt = area.val();
      var txtToAdd = this.replaceTags("##"+el.attr("alt"));
      area.val(textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos) );
    },

    focusArea:function(a){
      $(".info-template textarea").removeClass('focused');
      $(a.target).addClass('focused');
    },

	/**
	*Submit method
	* @param {event} a - Submit event itself
	* @memberOf Login#
	*/
	submitTemp:function(a){
        var EMAIL_TO,EMAIL_FROM,EMAIL_SUBJECT,EMAIL_BODY;
        EMAIL_TO=this.tempcookie.opt[1].CONT_EMAIL;
        EMAIL_FROM=this.tempcookie.opt[2].USU_EMAIL;
        EMAIL_SUBJECT=$("textarea[name='TEMP_SUBJECT']").val();
        EMAIL_BODY=$("textarea[name='TEMP_BODY']").val();

        /*EMAIL_TO="fabianoabreu@focustextil.com.br";
        EMAIL_FROM="fabianoabreu@focustextil.com.br";*/

		var core=this;
        $.support.cors=true;
        core.ajaxrequest=!0;                                                                        
        $.ajax({
            type: "POST",
            url: nodePath+"EnviarEmail",
            contentType: "text/xml; charset=utf-8",
            dataType: "xml",
            crossDomain: true,
            context: core,
            data: '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><EnviarEmail xmlns="http://tempuri.org/"><email><EMAIL_FROM>'+EMAIL_FROM+'</EMAIL_FROM><EMAIL_TO>'+EMAIL_TO+'</EMAIL_TO><EMAIL_SUBJECT>'+EMAIL_SUBJECT.replace("&", "%%")+'</EMAIL_SUBJECT><EMAIL_BODY>'+EMAIL_BODY.replace(/(\r\n|\n|\r)/gm, "\r\n").replace("&", "%%")+'</EMAIL_BODY><USU_COD>1</USU_COD></email></EnviarEmail></soap:Body></soap:Envelope>',
            success: core.emailSent,
            error: core.processError
        });
	},
    emailSent:function(data, status, req){
        var modal=new Modal(!1,"Email enviado com sucesso!!!");
        modal.open();
    }
};

function Modal(isbad,msg){
    var core=this;
    this.container=$(".modal_mask");
    this.el=$(".modal");
    this.modal_text=$(".modal-text");
    this.btnclose=$(".alertclose");
    this.btnclose.bind("click",function(){core.close()});

    this.open=function(){
        if(isbad){  
            this.el.addClass('bad');
        }
        this.modal_text.text(msg);
        this.container.fadeIn();
    };
    this.close=function(){
        this.el.removeClass('bad');
        this.container.fadeOut();
        window.close();
    }
}
App.init();