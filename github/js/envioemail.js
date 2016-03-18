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
		if(!this.usr)
            window.location.href = 'login.html';

        if(jQuery.parseJSON(localStorage.getItem('tempforn')) && jQuery.parseJSON(localStorage.getItem('sendemail'))){
            this.tempforn=jQuery.parseJSON(localStorage.getItem('tempforn'));
            this.tempcookie=jQuery.parseJSON(localStorage.getItem('sendemail'));
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
        var EMAIL_TO,EMAIL_FROM,EMAIL_SUBJECT,EMAIL_BODY,EMAIL_CC,status,last,last_request,EMAIL_CC_list=[];

        /*EMAIL_TO=this.tempcookie.opt[1].CONT_EMAIL;
        EMAIL_FROM=this.tempcookie.opt[2].USU_EMAIL;
        EMAIL_CC=this.tempcookie.opt[2].SEGM_COD;*/
        EMAIL_SUBJECT=$("textarea[name='TEMP_SUBJECT']").val();
        EMAIL_BODY=$("textarea[name='TEMP_BODY']").val();

        /*EMAIL_TO="fabianoabreu@focustextil.com.br";
        EMAIL_FROM="fabianoabreu@focustextil.com.br";*/

        var core=this;

        status=setInterval(function(){
            last_request=!0;
            $.ajax({
                type: "POST",
                url: nodePath+"EnviarEmail",
                contentType: "text/xml; charset=utf-8",
                dataType: "xml",
                crossDomain: true,
                context: core,
                data: '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ListarUsuarios xmlns="http://tempuri.org/"><SEGM_COD>'+EMAIL_CC+'</SEGM_COD></ListarUsuarios></soap:Body></soap:Envelope>',
                success:function(data, status, req){
                    var emails_list;
                    emails_list=jQuery.parseJSON($(req.responseXML).text()).unique();
                    emails_list.forEach(function(el, index) {
                        if(el.USU_RECEIVE_EMAIL){
                            EMAIL_CC_list.push("fabianoabreu@focustextil.com.br");
                            //EMAIL_CC_list.push(el.USU_EMAIL);
                        }
                    });
                    last_request=!1; 
                },
                error: core.processError
            });
            clearInterval(status);
        },100);

        last=setInterval(function(){
          //console.log(!context.ajaxrequest && goout && !last_request);
          if(!last_request){
            var modal=new Modal(!1,"");
            modal.load();
            $.support.cors=true;
            $.ajax({
                type: "POST",
                url: nodePath+"EnviarEmail",
                contentType: "text/xml; charset=utf-8",
                dataType: "xml",
                crossDomain: true,
                context: core,
                data: '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><EnviarEmail xmlns="http://tempuri.org/"><email><EMAIL_FROM>'+EMAIL_FROM+'</EMAIL_FROM><EMAIL_TO>'+EMAIL_TO+'</EMAIL_TO><EMAIL_CC>'+EMAIL_CC_list.join(";")+'</EMAIL_CC><EMAIL_SUBJECT>'+EMAIL_SUBJECT.replace("&", "%%")+'</EMAIL_SUBJECT><EMAIL_BODY>'+EMAIL_BODY.replace(/(\r\n|\n|\r)/gm, "\r\n").replace("&", "%%")+'</EMAIL_BODY><USU_COD>1</USU_COD></email></EnviarEmail></soap:Body></soap:Envelope>',
                success: core.emailSent,
                error: core.processError
            });
            clearInterval(last);
          }
        },100);
	},
    emailSent:function(data, status, req){
        this.setEmailSent(this.tempcookie.opt[0]);
    },
    setEmailSent:function(a){
        console.dir(a);
        var length,core=this,l=0,obj,status;
        length=a.length;
        var day,date,month;
        date=new Date();
        if(parseInt(date.getDate())<10){
          day="0"+parseInt(date.getDate());
        }
        else{
          day=date.getDate();
        }

        if((parseInt(date.getMonth())+1)<10){
          month="0"+parseInt(date.getMonth()+1);
        }
        else{
          month=parseInt(date.getMonth()+1);
        }

        date=""+date.getFullYear()+"-"+month+"-"+day;

        status=setInterval(function(){
            if(l<length){

                $.support.cors=true;
                $.ajax({
                    type: "POST",
                    url: nodePath+'ListarAmostras',
                    contentType: "text/xml; charset=utf-8",
                    dataType: "xml",
                    crossDomain: true,
                    context: core,
                    data: '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ListarAmostras xmlns="http://tempuri.org/"><AMOS_ID>'+a[l].AMOS_ID+'</AMOS_ID><FEIR_COD></FEIR_COD><LINHA_I>1</LINHA_I><LINHA_F>20000</LINHA_F><CREATE_DATE_I>2000-01-01</CREATE_DATE_I><SEGM_COD>'+core.tempcookie.opt[2].SEGM_COD+'</SEGM_COD></ListarAmostras></soap:Body></soap:Envelope>',
                    success: function(data, status, req){
                        var html="",pattern="";
                        var item=jQuery.parseJSON($(req.responseXML).text());
                        pattern+="<AMOS_ID>"+parseInt(item[0].AMOS_ID)+"</AMOS_ID><FORN_ID>"+parseInt(item[0].FORN_ID)+"</FORN_ID><FEIR_COD>"+parseInt(item[0].FEIR_COD)+"</FEIR_COD><USU_COD>"+parseInt(item[0].USU_COD)+"</USU_COD><AMOS_DESC>"+item[0].AMOS_DESC+"</AMOS_DESC><AMOS_STATUS>"+item[0].AMOS_STATUS+"</AMOS_STATUS><AMOS_ENV_EMAIL>1</AMOS_ENV_EMAIL><TECI_COD>"+(item[0].TECI_COD || "")+"</TECI_COD><BASE_COD>"+(item[0].BASE_COD || "")+"</BASE_COD><GRUP_COD>"+(item[0].GRUP_COD || "")+"</GRUP_COD><SUBG_COD>"+(item[0].SUBG_COD || "")+"</SUBG_COD><SEGM_COD>"+(item[0].SEGM_COD || "")+"</SEGM_COD><FLAG_PRIORIDADE>"+item[0].FLAG_PRIORIDADE+"</FLAG_PRIORIDADE><AMOS_HOMOLOGAR>"+item[0].AMOS_HOMOLOGAR+"</AMOS_HOMOLOGAR><FLAG_FISICA>"+item[0].FLAG_FISICA+"</FLAG_FISICA><CREATE_DATE>"+date+"</CREATE_DATE>";
                        html+="<AMOS_PRECO>"+item[0].AMOS_PRECO+"</AMOS_PRECO><AMOS_LARGURA_TOTAL>"+item[0].AMOS_LARGURA_TOTAL+"</AMOS_LARGURA_TOTAL><AMOS_GRAMATURA_M>"+item[0].AMOS_GRAMATURA_M+"</AMOS_GRAMATURA_M><AMOS_COTACAO_KG>"+item[0].AMOS_COTACAO_KG+"</AMOS_COTACAO_KG><AMOS_LARGURA_UTIL>"+item[0].AMOS_LARGURA_UTIL+"</AMOS_LARGURA_UTIL><AMOS_GRAMATURA_ML>"+item[0].AMOS_GRAMATURA_ML+"</AMOS_GRAMATURA_ML><AMOS_ONCAS>"+item[0].AMOS_ONCAS+"</AMOS_ONCAS><AMOS_PRECO_UM>"+item[0].AMOS_PRECO_UM+"</AMOS_PRECO_UM>";
                        $.support.cors=true;
                        console.log('<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GravarAmostra xmlns="http://tempuri.org/"><sample>'+pattern+''+html+'</sample><action>U</action></GravarAmostra></soap:Body></soap:Envelope>FIMMM');
                        $.ajax({
                            type: "POST",
                            url: nodePath+'GravarAmostra',
                            contentType: "text/xml; charset=utf-8",
                            dataType: "xml",
                            crossDomain: true,
                            context: core,
                            data: '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GravarAmostra xmlns="http://tempuri.org/"><sample>'+pattern+''+html+'</sample><action>U</action></GravarAmostra></soap:Body></soap:Envelope>',
                            error: core.processError
                        });
                    },
                    error: core.processError
                });
                l++;
            }
            else{  
                clearInterval(status);
                var modal=new Modal(!1,"Email enviado com sucesso!!!");
                modal.open();
            }
        },200);
    }
};

function Modal(isbad,msg){
    var core=this;
    this.mask=$(".mask");
    this.container=$(".modal_mask");
    this.el=$(".modal");
    this.modal_text=$(".modal-text");
    this.btnclose=$(".alertclose");
    this.btnclose.bind("click",function(){core.close()});

    this.open=function(){
        this.mask.hide();
        if(isbad){  
            this.el.addClass('bad');
        }
        this.modal_text.text(msg);
        this.container.fadeIn();
    };
    this.load=function(){
        this.mask.fadeIn();
    };
    this.close=function(){
        this.el.removeClass('bad');
        this.container.fadeOut();
        localStorage.clear();
        window.close();
    }
}
App.init();

$(window).bind('beforeunload', function(event) {
    localStorage.clear();
});