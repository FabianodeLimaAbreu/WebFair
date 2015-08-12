/**
*@fileOverview Main application class, responsible for all main funcionalities and call anothers classes constructors
* @module App
*
*/

require.config({
  shim: {
    spine: {
      deps: ["jquery"],
      exports: "Spine"
    }
  },
  baseUrl: "js/lib",
  paths: {
    app: "../app",
    models: "../models",
    sp: "spine"
  }
});
require(["methods","jquery.elevatezoom","sp/min", "app/content", "app/detail"], function() {
  /**
  * Main application class, responsible for all main funcionalities and call anothers classes constructors
  * @exports App
  * @constructor
  */
  window.App = Spine.Controller.sub({
    el:$("body"),
    elements: {
      ".container":"container",
      ".nav-menu a":"menuopt",
      "header":"header",
      ".content":"contentEl",
      "#wrap .mask":"maskEl",
      "#wrap .loader":"loader",
      //".form-control":"searchEl",
      //".right-list button":"viewBtn",
      //"button.close":"closeBtn",
      ".login-name":"username",
      //".table-container":"viewList",
      /*".viewport":"viewImage",
      ".bread-box":"breadEl",
      "#modal" : "modalEl",
      ".detail":"detailEl"*/
    },

    events: {      
      "click .changeview button":"changeview",
      "click .tooltip.borderby .tooltip-item":"sortItems",
      "click .bsel":"enableSelect",
      "click .btrash-big":'deleteNote',
      "click .bfav":'actionHeart',
      "click .bfisica":'actionFlag',
      "click .bhomologado":'actionHomolog',
      "change .countries": "changeCountries",
      "change .city": "changeCity",
      "keyup .forn": "getSpot",
      "change .fair":"changeFair",
      "click .export":"exportExcel",
      "blur .form-control-search":"search",
      "keyup .form-control-search":"search",
      "change .filter-data":"filterForn",
      "click .caption-downside a":"compChange",
      "click .edit-fair":"editFair",
      "click .fair-save":"saveFair",
      "click .delete-fair":"deleteFair",
      "click .date-filter":"showPicker",
      "click .save-date-filter":"submitDateFilter",
      "click .setitem":"SetItemAmos",
      "click .bselection-edit":"selectItem",
      "click .bselection":"selectItem",
      "click .tooltip-content.status button":"AmosByStatus",
      "click .filter-price":"AmosByPrice",
      "click .thumbnail img":"goDetail",
      "click .main_opt_button.bemail":"sendEmail"
      /*"submit .search":"submit",
      "click button.icon.go_back_default":"goBack",
      "click button.close":"getOut"*/
    },
    init:function(){
      this.view = "images";
      this.page = "amostras";
      this.itens = $([]);
      this.data=[];
      this.fdata = [];
      this.loading=!1;
      this.action_name="";
      this.callback=null;
      this.bfair;
      this.bforn; 
      this.itens_by_page=20;
      this.itens_page_default=this.itens_by_page;
      this.ajaxrequest=!1;
      console.log("INIT DA APP");
      this.cookiefair={};

      //Var to storage the basic data
      this.fair=[];
      this.ffair=[];
      this.cities=[];
      this.forn=[];
      this.segm=[];
      this.select_items=[];
      this.fairval="";
      this.fornval="";
      this.amosval="";
      this.initialTime='2011-01-08';
      this.endTime='2015-10-10';
      this.notcombo=0;



      /*this.loja="";
      this.area="";
      this.father=!0;
      this.searchname="";*/
      this.breadarr = [];
      //this.modal = new Modal({el:this.modalEl});
      this.detail = new Detail({
        getloading:this.proxy(this.getloading),
        setloading:this.proxy(this.setloading),
        body:this.el,
        getdata:this.proxy(this.getdata),
        actionHeart:this.proxy(this.actionHeart),
        actionFlag:this.proxy(this.actionFlag),
        actionHomolog:this.proxy(this.actionHomolog),
        SetItemAmos:this.proxy(this.SetItemAmos),
        callService:this.proxy(this.callService),
        deleteNote:this.proxy(this.deleteNote)
      });

      this.header.addClass("goDown");
      this.usr = jQuery.parseJSON($.cookie("webfair"));
      if(!this.usr)
        window.location.href = 'login.html';
      this.username.text(this.usr.USU_NOME);
      
      this.el.find("#wrap").removeClass("hide");

      this.content = new Content({el:this.contentEl,usr_segm:this.usr.SEGM_COD/*bread:this.breadEl, type:this.usr.TIPO*/});
      this.fornecedores = new Fornecedores();

      this.spotlight = new Spotlight({
        callService:this.proxy(this.callService),
        reset:this.proxy(this.reset),
        getFornVal:this.proxy(this.getFornVal),
        setFornVal:this.proxy(this.setFornVal),
        getFairVal:this.proxy(this.getFairVal),
        setFairVal:this.proxy(this.setFairVal),
        getAmosVal:this.proxy(this.getAmosVal),
        getNotCombo:this.proxy(this.getNotCombo),
        setNotCombo:this.proxy(this.setNotCombo),
        getPage:this.proxy(this.getPage)
      });

      if(!this.fair.length){
        this.callService("local",'<FEIR_COD></FEIR_COD>','<PAIS_COD></PAIS_COD>','<REGI_COD></REGI_COD>');
      }
      this.routes({
        "":function() {
          this.menuopt.eq(3)[0].click();
        },
        "amostras":function(){
          var context=this;
          this.page ="amostras";
          console.log("AMOSTRAS NORMAL");
          $("html").attr("class","").addClass(this.page);
          $(".zoomContainer").remove();
          this.restartValues();
          this.writePage(this.page);
        },
        "amostras/*fairval/*fornval/*amosval":function(res){
          var a,b,c;
          console.log("ok");
          $(".zoomContainer").remove();
          //cookiefair=jQuery.parseJSON($.cookie("posscroll"));

          this.cookiefair=jQuery.parseJSON($.cookie("posscroll"));
          this.fairval = a=res.fairval !== "padrao" ? parseInt(res.fairval) : ""; 
          this.fornval = b=res.fornval !== "padrao" ? res.fornval.replace("_"," ").replace("_"," ").replace("_"," ") : "";
          this.amosval = c=res.amosval !== "padrao" ? res.amosval.replace("_"," ").replace("_"," ").replace("_"," ") : ""; 
          if(this.cookiefair){
            //console.log(a+" , "+this.cookiefair.fairval+" / "+(a == this.cookiefair.fairval));
            if(a == this.cookiefair.fairval && b === this.cookiefair.fornval  && c === this.cookiefair.amosval ){
              console.log("bateu parametros do cookie");
              this.initialTime=this.cookiefair.initialTime;
              this.endTime=this.cookiefair.endTime;
            }
            else{
              console.log("NÃO bateu parametros do cookie");
              this.cookiefair={};
              $.removeCookie('posscroll', { path: '/' });
            }
          } 
          if(parseInt(b)){
            b="<FORN_ID>"+b+"</FORN_ID>";
          }
          else{
            if(b){
              b="<FORN_DESC>"+b+"</FORN_DESC>";
            }
            else{
              b="";
            }
          }
          if(parseInt(c)){
            c="<AMOS_ID>"+c+"</AMOS_ID>";
          }
          else{
            if(c){
              c="<AMOS_DESC>"+c+"</AMOS_DESC>";
            }
            else{
              c="";
            }
          }
          a="<FEIR_COD>"+a+"</FEIR_COD>";
          var context=this;
          this.page ="amostras";
          $("html").attr("class","").addClass(this.page);
          this.writePage(this.page);
          this.submit(a,b,c,!1);
        },
        "fornecedores":function(){
          var context=this;
          this.page ="fornecedores";
          $("html").attr("class","").addClass(this.page);
          this.writePage(this.page);
        },
        "fornecedores/*fairval/*fornval/*amosval":function(res){
          var a,b,c;
          $(".zoomContainer").remove();
          //cookiefair=jQuery.parseJSON($.cookie("posscroll"));

          this.cookiefair=jQuery.parseJSON($.cookie("posscroll"));
          this.fairval = a=res.fairval !== "padrao" ? parseInt(res.fairval) : ""; 
          this.fornval = b=res.fornval !== "padrao" ? res.fornval.replace("_"," ").replace("_"," ").replace("_"," ") : "";
          this.amosval = c=res.amosval !== "padrao" ? res.amosval.replace("_"," ").replace("_"," ").replace("_"," ") : ""; 
          if(this.cookiefair){
            //console.log(a+" , "+this.cookiefair.fairval+" / "+(a == this.cookiefair.fairval));
            if(a == this.cookiefair.fairval && b === this.cookiefair.fornval  && c === this.cookiefair.amosval ){
              console.log("bateu parametros do cookie");
              this.initialTime=this.cookiefair.initialTime;
              this.endTime=this.cookiefair.endTime;
            }
            else{
              console.log("NÃO bateu parametros do cookie");
              this.cookiefair={};
              $.removeCookie('posscroll', { path: '/' });
            }
          } 
          if(parseInt(b)){
            b="<FORN_ID>"+b+"</FORN_ID>";
          }
          else{
            if(b){
              b="<FORN_DESC>"+b+"</FORN_DESC>";
            }
            else{
              b="";
            }
          }
          if(parseInt(c)){
            c="<AMOS_ID>"+c+"</AMOS_ID>";
          }
          else{
            if(c){
              c="<AMOS_DESC>"+c+"</AMOS_DESC>";
            }
            else{
              c="";
            }
          }
          a="<FEIR_COD>"+a+"</FEIR_COD>";
          var context=this;
          this.page ="fornecedores";
          $("html").attr("class","").addClass(this.page);
          this.notcombo=!0;
          this.writePage(this.page);
          this.submit(a,b,c,!1);
        },
        "fornecedores/*func/*code":function(a){
          var context=this;
          this.page ="fornecedor_cadastro";
          $("html").attr("class","").addClass(this.page);
          $(".zoomContainer").remove();
          this.writePage(this.page);
        },
        "fornecedores/*func":function(a){
          var context=this;
          console.log("criar novo fornecedor");
          this.page ="fornecedor_cadastro";
          $("html").attr("class","fornecedor_cadastro add_forn");
          $(".zoomContainer").remove();
          this.writePage(this.page);
        },
        "relatorio":function(){
          var context=this;
          this.page ="relatorio";
          this.writePage(this.page);
        },
        "local":function(){
          var context=this;
          this.page ="local";
          $("html").attr("class","").addClass(this.page);
          this.writePage(this.page);
        },
        "local/*func/*code":function(a){
          var context=this;
          this.page ="local_cadastro";
          $("html").attr("class","local_cadastro view_fair");
          this.writePage(this.page,a.code);
        },
        "local/*func":function(a){
          var context=this;
          this.page ="local_cadastro";
          $("html").attr("class","local_cadastro add_fair");
          this.writePage(this.page,"new");
        },
        "template_email":function(){
          var context=this;
          this.page ="template_email";
          this.writePage(this.page);
        },
        "gestao":function(){
          var context=this;
          this.page ="gestao";
          this.writePage(this.page);
        },
        "detail/*fair/*code" : function(a) {
          //alert(a.code);
          /*this.cookiefair=jQuery.parseJSON($.cookie("posscroll"));
          console.dir(this.cookiefair);*/
          this.page ="detail";
          this.writePage(this.page);
          this.fairval=a.fair;
          this.amosval=a.code;
        }
      });
    },

    getOut : function(a){
      a.preventDefault();
      Logout();
    },
    goBack : function(){
      if(this.father){
        window.location.href = './#'+this.loja;
      }else{
        var bread = $('.bread-colec').find("a").text();
        var grupo = this.data[0].GRUPO;
        var area = this.data[0].TYPE_MAT;
        this.navigate && this.navigate("artigos-pai", this.loja,area,grupo,!0);        
      }       

    },
    writePage:function(hash,val){
      var context=this;  
      if(this.page !== "detail"){
        context.reset();
      }
      /*if(this.page !== "detail" && !this.scroller){
        //context.restartValues();
      }*/
      this.container.load("pages/"+hash+".html",function( response, status, xhr){
        switch(context.page){
          case "amostras":
            console.log(context.fairval);
            context.viewBtn=$(".changeview button");
            context.order_box=$(".tooltip.borderby");
            context.bfair=$(".fair");
            context.bforn=$(".forn");
            context.spotlight.el=$(".spotlight");
            this.view = "images";
            $("body").removeAttr("class");
            if(!context.fair.length){
              status=setInterval(function(){
                if(context.fair.length){
                  context.ajaxrequest=!1;
                  context.createComponent(context.fair,context.bfair,'fair');
                  clearInterval(status);
                }
              },100);
            }
            else{
              context.createComponent(context.fair,context.bfair,'fair');
            }
            if(context.fairval){
              $(".fair option").each(function(a,b){
                if(parseInt($(b).attr("value")) ==  parseInt(context.fairval)){
                  $(b).attr("selected","selected");
                }
              });
            }
            if(context.fornval){
              context.bforn.val(context.fornval);
            }
            if(context.amosval){
              $(".form-control-search").val(context.amosval);
            }
            $( "input[name='initial_date']" ).datepicker({
              defaultDate: "+1w",
              changeMonth: true,
              numberOfMonths: 2,
              monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
              monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
              dayNamesMin: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
              dateFormat:"yy-mm-dd",
              onClose: function( selectedDate ) {
                $( "input[name='end_date']" ).datepicker( "option", "minDate", selectedDate );
              }
            });
            $( "input[name='end_date']" ).datepicker({
              defaultDate: "+1w",
              changeMonth: true,
              numberOfMonths: 2,
              monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
              monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
              dayNamesMin: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
              dateFormat:"yy-mm-dd",
              onClose: function( selectedDate ) {
                $( "input[name='initial_date']").datepicker( "option", "maxDate", selectedDate );
              }
            }); 
            //context.callService("fornecedores",'<FORN_DESC></FORN_DESC>','<FEIR_COD></FEIR_COD>','<CREATE_DATE_I>1900-10-17</CREATE_DATE_I>','<CREATE_DATE_F>2020-10-17</CREATE_DATE_F>',20);
            break;
          case "fornecedores":
            context.bfair=$(".fair");
            context.bforn=$(".forn");
            context.spotlight.el=$(".spotlight");
            if(!context.fair.length){
              status=setInterval(function(){
                if(context.fair.length){
                  context.ajaxrequest=!1;
                  context.createComponent(context.fair,context.bfair,'fair');
                  clearInterval(status);
                }
              },100);
            }
            else{
              context.createComponent(context.fair,context.bfair,'fair');
            }

            if(context.fairval){
              $(".fair option").each(function(a,b){
                if(parseInt($(b).attr("value")) ==  parseInt(context.fairval)){
                  $(b).attr("selected","selected");
                }
              });
            }
            if(context.fornval){
              context.bforn.val(context.fornval);
            }

            $( "input[name='initial_date']" ).datepicker({
              defaultDate: "+1w",
              changeMonth: true,
              numberOfMonths: 2,
              monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
              monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
              dayNamesMin: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
              dateFormat:"yy-mm-dd",
              onClose: function( selectedDate ) {
                $( "input[name='end_date']" ).datepicker( "option", "minDate", selectedDate );
              }
            });
            $( "input[name='end_date']" ).datepicker({
              defaultDate: "+1w",
              changeMonth: true,
              numberOfMonths: 2,
              monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
              monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
              dayNamesMin: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
              dateFormat:"yy-mm-dd",
              onClose: function( selectedDate ) {
                $( "input[name='initial_date']").datepicker( "option", "maxDate", selectedDate );
              }
            });
            //console.dir(context.fair);
            break;
          case "local":
            context.bcity=$(".city");
            //context.callService(context.page,"<FEIR_COD></FEIR_COD>","<PAIS_COD>BR</PAIS_COD>","<REGI_COD>SP</REGI_COD>");
            break;
          case "local_cadastro":
            context.bcity=$(".city");
            if(context.ffair.length){
              context.createComponent(context.cities,context.bcity,"cities");
              context.fair.filter(function(a,b){
                if((parseInt(a.FEIR_COD) == (parseInt(val)))){
                  context.popComponent(a);
                }
              });
            }
            else{
              //Mandar para pagina anterior
            }
            //context.callService(context.page,"<FEIR_COD></FEIR_COD>","<PAIS_COD>BR</PAIS_COD>","<REGI_COD>SP</REGI_COD>");
            break;
          case "detail":
            $("html").attr("class","").addClass(context.page);
            context.detail.reload(context.fairval,context.amosval);
            break;
          case "fornecedor_cadastro":
            context.bfair=$(".fair");
            context.bcity=$(".city");
            console.log("fornecedor cadastro");
            $.getScript("js/lib/external-script.js");
            if(!context.fair.length){
              status=setInterval(function(){
                if(context.fair.length){
                  context.ajaxrequest=!1;
                  context.createComponent(context.fair,context.bfair,'fair');
                  clearInterval(status);
                }
              },100);
            }
            else{
              context.createComponent(context.fair,context.bfair,'fair');
            }
            break;
          default:
            alert("dssda");
        }
      });
    },
    popComponent:function(item){
      var elem=$(".form-control");
      elem.each(function(a,b){
        $(b).attr("disabled","disabled").val(item[$(b).attr("name")]);
      });
      this.fairval=item;
    },
    editFair:function(a){
      $(a.target).addClass("sel");
      $("html").attr("class","local_cadastro edit-fair");
      var elem=$(".form-control").removeAttr("disabled");
    },
    saveFair:function(){
      var elem=$(".form-control"),html="";
      if($("html").hasClass("edit-fair")){
        html+="<FEIR_COD>"+parseInt(this.fairval.FEIR_COD)+"</FEIR_COD>";
        elem.each(function(a,b){
          //console.log($(b).attr("class"));
          if($(b).hasClass("bselect")){
            //console.log($(b).find("option:selected").val());
            html+="<"+$(b).attr("name")+">"+$(b).find("option:selected").val().replace(' ',"")+"</"+$(b).attr("name")+">";
          }
          else{
            html+="<FEIR_DESC>"+$(b).val()+"</FEIR_DESC>";
          }9
        });
        //html+="<CREATE_DATE>"+new Date().toLocaleDateString().replace("/","-").replace("/","-")+"</CREATE_DATE>";
        html+="<CREATE_DATE>"+"2015-12-12"+"</CREATE_DATE>";
        console.dir(html);
        this.callService("gravarLocal",html,"U");
      }
      else{
        html+="<FEIR_COD></FEIR_COD>";
        elem.each(function(a,b){
          //console.log($(b).attr("class"));
          if($(b).hasClass("bselect")){
            //console.log($(b).find("option:selected").val());
            html+="<"+$(b).attr("name")+">"+$(b).find("option:selected").val().replace(' ',"")+"</"+$(b).attr("name")+">";
          }
          else{
            html+="<FEIR_DESC>"+$(b).val()+"</FEIR_DESC>";
          }
        });
        //html+="<CREATE_DATE>"+new Date().toLocaleDateString().replace("/","-").replace("/","-")+"</CREATE_DATE>";
        html+="<CREATE_DATE>"+"2015-12-12"+"</CREATE_DATE>";
        this.callService("gravarLocal",html,"I");
      }
    },
    deleteFair:function(){
      var html="";
      html+="<FEIR_COD>"+parseInt(this.fairval.FEIR_COD)+"</FEIR_COD>"+"<CREATE_DATE>"+"2015-12-12"+"</CREATE_DATE>";
      this.callService("gravarLocal",html,"D");
    },
    showPicker:function(a){
      if($(a.target).hasClass("sel")){
        $(a.target).removeClass("sel");
        return !1;
      }
      $(a.target).addClass("sel");
    },
    submitDateFilter:function(a){
      if(!this.fairval){
        alert("selecione pelo menos a feira!");
        return !0;
      }
      this.reset();
      this.initialTime=$("input[name='initial_date']").val() || (new Date().getFullYear())+"-01-01";
      this.endTime=$("input[name='end_date']").val() || (new Date().getFullYear())+"-12-30";
      switch (this.page){
        case "fornecedores":
          this.callService("fornecedores",'<FORN_DESC>'+this.fornval+'</FORN_DESC>','<FEIR_COD>'+this.fairval+'</FEIR_COD>','<LINHA_I>'+(this.content.page*20+1)+'</LINHA_I>','<LINHA_F>'+((this.content.page+1)*20)+'</LINHA_F>','<CREATE_DATE_I>'+this.initialTime+'</CREATE_DATE_I>','<CREATE_DATE_F>'+this.endTime+'</CREATE_DATE_F>');
          break;
        case "amostras":
          this.callService("amostras",'<AMOS_DESC>'+this.amosval+'</AMOS_DESC>','<FEIR_COD>'+this.fairval+'</FEIR_COD>','<LINHA_I>'+(this.content.page*20+1)+'</LINHA_I>','<LINHA_F>'+((this.content.page+1)*20)+'</LINHA_F>','<CREATE_DATE_I>'+this.initialTime+'</CREATE_DATE_I>','<CREATE_DATE_F>'+this.endTime+'</CREATE_DATE_F>');
          break;
      }
      $(".date-filter").removeClass("sel");
    },
    SetItemAmos:function(ev){
      console.log("CLICOU EM UM JUSTIT");
      var el=$(ev.target);
      var item=[],result,pattern="",html="";
      if(this.page === "amostras"){
        item=this.data.filter(function(a,b){
          if(a.AMOS_ID == el.attr("name")){
            return a;
          }
        });
        item=item[0];
      }
      else{
        item=this.detail.item;
      }
      if(el.hasClass("has")){
        el.removeClass("has").addClass("nothas");
      }
      else{
        el.removeClass("nothas").addClass("has");
      }

      switch (el.attr("title")){
        case "Fisica":
          result= el.hasClass("has") ? 1 : 0;
          item.FLAG_FISICA=result;
          html+="<FLAG_PRIORIDADE>"+item.FLAG_PRIORIDADE+"</FLAG_PRIORIDADE><AMOS_HOMOLOGAR>"+item.AMOS_HOMOLOGAR+"</AMOS_HOMOLOGAR><FLAG_FISICA>"+result+"</FLAG_FISICA>";
          break;
        case "Homologar":
          result= el.hasClass("has") ? 1 : 0;
          item.AMOS_HOMOLOGAR=result;
          html+="<FLAG_PRIORIDADE>"+item.FLAG_PRIORIDADE+"</FLAG_PRIORIDADE><AMOS_HOMOLOGAR>"+result+"</AMOS_HOMOLOGAR><FLAG_FISICA>"+item.FLAG_FISICA+"</FLAG_FISICA>";
          break;
        case "Favoritar":
          result= el.hasClass("has") ? 1 : 0;
          item.FLAG_PRIORIDADE=result;
          html+="<FLAG_PRIORIDADE>"+result+"</FLAG_PRIORIDADE><AMOS_HOMOLOGAR>"+item.AMOS_HOMOLOGAR+"</AMOS_HOMOLOGAR><FLAG_FISICA>"+item.FLAG_FISICA+"</FLAG_FISICA>";
          break;
        default:
          console.log("ALGO DE ERRADO OCORREU!!!");
          return !1;
      }
      pattern="<AMOS_ID>"+item.AMOS_ID+"</AMOS_ID><FORN_ID>"+item.FORN_ID+"</FORN_ID><FEIR_COD>"+parseInt(item.FEIR_COD)+"</FEIR_COD><USU_COD>"+item.USU_COD+"</USU_COD><AMOS_DESC>"+item.AMOS_DESC+"</AMOS_DESC><AMOS_LARGURA_TOTAL>"+item.AMOS_LARGURA_TOTAL+"</AMOS_LARGURA_TOTAL><AMOS_LARGURA_UTIL>"+item.AMOS_LARGURA_UTIL+"</AMOS_LARGURA_UTIL><AMOS_GRAMATURA_M>"+item.AMOS_GRAMATURA_M+"</AMOS_GRAMATURA_M><AMOS_GRAMATURA_ML>"+item.AMOS_GRAMATURA_ML+"</AMOS_GRAMATURA_ML><AMOS_ONCAS>"+item.AMOS_ONCAS+"</AMOS_ONCAS><AMOS_COTACAO_M>"+item.AMOS_COTACAO_M+"</AMOS_COTACAO_M><AMOS_COTACAO_KG>"+item.AMOS_COTACAO_KG+"</AMOS_COTACAO_KG><AMOS_STATUS>"+item.AMOS_STATUS+"</AMOS_STATUS><AMOS_ENV_EMAIL>"+item.AMOS_ENV_EMAIL+"</AMOS_ENV_EMAIL><AMOS_PRECO_UM>"+item.AMOS_PRECO_UM+"</AMOS_PRECO_UM><AMOS_PRECO>"+item.AMOS_PRECO+"</AMOS_PRECO><TECI_COD>"+(item.TECI_COD || "")+"</TECI_COD><BASE_COD>"+(item.BASE_COD || "")+"</BASE_COD><GRUP_COD>"+(item.GRUP_COD || "")+"</GRUP_COD><SUBG_COD>"+(item.SUBG_COD || "")+"</SUBG_COD><SEGM_COD>"+item.SEGM_COD+"</SEGM_COD><CREATE_DATE>"+"2015-01-01"+"</CREATE_DATE>";
      this.setloading(!0,!1);
      this.callService("gravarAmostras",pattern,html,'U');
    },
    selectItem:function(a){
      a.preventDefault();
      if($(a.target).hasClass("sel")){
        this.select_items = this.select_items.filter(function(element,i){
           return element !== $(a.target).attr("name");
        });
      }
      else{
        this.select_items.push($(a.target).attr("name"));
      }
      $(a.target).toggleClass("sel");


      if($(a.target).hasClass("bselection-edit")){
        this.action_name="edit";
      }
      else{
        this.action_name="select";
      }
    },
    setBreadcrumb : function(a, val){
      var loja, area, grupo, artigo, bread_text;
        
      // Error
      if(!a[0]){
        return this.modal.open(),this.breadEl.find('.bread-colec a').text("").removeClass('active'),this.setloading(!1), this.searchEl.find('input').blur();
      }

      loja        = a[0].DESC_STORE;
      grupo       = a[0].GRUPO;
      area        = a[0].TYPE_MAT;
      artigo      = this.artigo;
      bread_text  = loja+' - '+area+' - '+val;



      // FILHO
      if(!loja){
        this.area=a[0].TYPE_MAT;
        this.breadEl.find('.bread-colec a').text(area+' - '+grupo+' - '+artigo).addClass('active');
        return false;
      }
      // PAI      
      (this.area=="X") ? (bread_text=loja+' - '+val) : bread_text=(loja+' - '+area+' - '+val);
      this.breadEl.find('.bread-colec a').text(bread_text).addClass('active')   
    },
    changeview : function(a) {
      if ("object" === typeof a) {
          a.preventDefault(), a = $(a.target);
      } else {
          return !1;
      }
      /*if (this.loading){
        return !1;
      }*/ 
      $(".thumbnail .icon").attr("class","icon");
      $("html").attr("class","amostras");
      a.hasClass("sel") || (this.viewBtn.removeClass("sel"), a.addClass("sel"), this.view = a.attr('alt'), this.setdata(this.data, "amostras"));
    },
    setMenu:function(loja){
        if(this.menuopt.hasClass("sel")){
          this.menuopt.removeClass("sel");
        }
        this.menuopt.each(function(a,b){
          if(b.hash === "#"+loja){
            $(b).addClass("sel");
          }        
        });
    },
    callService:function(name,a,b,c,d,e,f,g){
        var core=this;
        var soapRequest=[
          {
            //FEIR_COD e FORN_ID are optional fields
            'name':'amostras',
            'serviceName':'ListarAmostras',
            'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ListarAmostras xmlns="http://tempuri.org/">'+a+''+b+''+c+''+d+''+e+''+f+''+g+'</ListarAmostras></soap:Body></soap:Envelope>',
            callback:function(data,req){
              core.convertData(data,req,name);
            }
          },
          {
            'name':'delete',
            'serviceName':'GravarAnotacao',
            'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GravarAnotacao xmlns="http://tempuri.org/"><note><NOTA_ID>'+a+'</NOTA_ID><USU_COD>'+b+'</USU_COD><PLAT_ID>2</PLAT_ID><CREATE_DATE>2016-07-08</CREATE_DATE></note><action>D</action></GravarAnotacao></soap:Body></soap:Envelope>',
            'callback':null
          },
          {
            'name':'local',
            'serviceName':'ListarFeiras',
            'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ListarFeiras xmlns="http://tempuri.org/">'+a+''+b+''+c+'</ListarFeiras></soap:Body></soap:Envelope>',
            callback:function(data,req){
              core.convertData(data,req,name);
            }
          },
          {
            'name':'gravarLocal',
            'serviceName':'GravarFeira',
            'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GravarFeira xmlns="http://tempuri.org/"><fair>'+a+'</fair><action>'+b+'</action></GravarFeira></soap:Body></soap:Envelope>',
            callback:function(data,req){
              alert("gravou no banco");
              //core.convertData(data,req,name);
              window.location.reload();
            }
          },
          {
            'name':'fornecedores',
            'serviceName':'ListarFornecedores',
            'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ListarFornecedores xmlns="http://tempuri.org/">'+a+''+b+''+c+''+d+''+e+''+f+'</ListarFornecedores></soap:Body></soap:Envelope>',
            callback:function(data,req){
              if(core.notcombo){
                core.convertData(data,req,name,!0);
              }
              core.convertData(data,req,name);
            }
          },
          {
            'name':'cities',
            'serviceName':'ListarRegioes',
            'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ListarRegioes xmlns="http://tempuri.org/">'+a+''+b+''+c+''+d+'</ListarRegioes></soap:Body></soap:Envelope>',
            callback:function(data,req){
              core.convertData(data,req,name);
            }
          },
          {
            'name':'gravarAmostras',
            'serviceName':'GravarAmostra',
            'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GravarAmostra xmlns="http://tempuri.org/"><sample>'+a+''+b+'</sample><action>'+c+'</action></GravarAmostra></soap:Body></soap:Envelope>',
            'callback':function(){
              core.setloading(!1);
            }
          },
          {
            'name':'gravarNotes',
            'serviceName':'GravarAnotacao',
            'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GravarAnotacao xmlns="http://tempuri.org/"><note><NOTA_ID>0</NOTA_ID><OBJ_ID>200000101</OBJ_ID><TP_NOTA_ID>2</TP_NOTA_ID><USU_COD>37</USU_COD><PLAT_ID>2</PLAT_ID><NOTA_DESC>Teste de Anotação2</NOTA_DESC><CREATE_DATE>2015-07-10</CREATE_DATE></note><action>I</action></GravarAnotacao></soap:Body></soap:Envelope>',
            'callback':null
          },
          {
            'name':'gravarAmostraComposicao',
            'serviceName':'GravarAmostraComposicao',
            'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GravarAmostraComposicao xmlns="http://tempuri.org/"><AMOS_ID>'+a+'</AMOS_ID><compositions>'+b+'</compositions></GravarAmostraComposicao></soap:Body></soap:Envelope>',
            'callback':null
          },
        ];

        $.support.cors=true;
        soapRequest.filter(function(a,b){
          if(a['name'] === name){
            console.log(a['code']);
            core.callback=a['callback'];
            core.ajaxrequest=!0;                                                                        
            $.ajax({
                type: "POST",
                url: nodePath+a['serviceName'],
                contentType: "text/xml; charset=utf-8",
                dataType: "xml",
                crossDomain: true,
                context: core,
                data: a['code'],
                success: core.callRequest,
                error: core.processError
            });
          }
        });
    },
    submit:function(a,b,c,d){
      var status,core=this;
      var b=b || "";
      var c=c || "";
      status=setInterval(function(){
        if(!core.ajaxrequest){
          //console.log("STATUS: "+core.ajaxrequest);

          core.ajaxrequest=!1;
          clearInterval(status);
          if(!d){
            core.reset();
          }
          if(core.page ===  "amostras"){
            core.callService(core.page,a,b,c,'<LINHA_I>'+(core.content.page*core.itens_by_page+1)+'</LINHA_I>','<LINHA_F>'+((core.content.page+1)*core.itens_by_page)+'</LINHA_F>','<CREATE_DATE_I>'+core.initialTime+'</CREATE_DATE_I>',"<CREATE_DATE_F>"+core.endTime+"</CREATE_DATE_F>");
          }
          else{
            core.callService(core.page,a,b,'<LINHA_I>'+(core.content.page*core.itens_by_page+1)+'</LINHA_I>','<LINHA_F>'+((core.content.page+1)*core.itens_by_page)+'</LINHA_F>','<CREATE_DATE_I>'+core.initialTime+'</CREATE_DATE_I>',"<CREATE_DATE_F>"+core.endTime+"</CREATE_DATE_F>");
          }
        }
      },100);
    },
    search:function(a){
      /*this.initialTime='2015-01-08';
      this.endTime='2015-10-10';*/
      var search;
      var forn_desc=this.fornval || "";
      this.itens_by_page=this.itens_page_default;
      //this.scroller=0;
      if(isNaN(forn_desc)){
        forn_desc="<FORN_DESC>"+forn_desc+"</FORN_DESC>";
      }
      else{
        if(forn_desc.length){
          forn_desc="<FORN_ID>"+forn_desc+"</FORN_ID>";
        }
        else{
          forn_desc="";
        }
      }
      var fair_id="<FEIR_COD>"+this.fairval+"</FEIR_COD>";
      if(13 === a.keyCode){
        if(isNaN($(a.target).val())){
          search="<AMOS_DESC>"+$(a.target).val()+"</AMOS_DESC>";
        }
        else{
          search="<AMOS_ID>"+$(a.target).val()+"</AMOS_ID>";
        }
        this.amosval=$(a.target).val();
        this.mode="amostras/"+((""+this.fairval).replace(" ","_") || "padrao")+"/"+(this.fornval.replace(" ","_") || "padrao")+"/"+($(a.target).val().replace(" ","_") || "padrao");
        this.navigate(this.mode, !1);
        this.submit(fair_id,forn_desc,search);
      }
    },
    processError:function(data, status, req){
      console.log("DEU ERRO");
      this.ajaxrequest=!1;
    },
    setdata:function(a,b){  
      var i,length;
      //this.content.page = 0;
      /*this.setBreadcrumb(a,val);
      this.breadEl.find(".bread-load").text(0);*/

      

      if (!this.data.length && b !="local") {        
        return alert("NENHUMA AMOSTRA***"), $('.bread-search').find(".spec").text("0 Resultados");
        //return this.modal.open(),this.breadEl.find('.bread-colec a').text("").removeClass('active'),this.setloading(!1), this.searchEl.find('input').blur();
      }  
      switch(b){
        case 'amostras':
          this.data = a.sortBy("AMOS_ID");
          this.content.changeview(this.view);
          this.createbox(this.data, this.content.page, !0);
          break;
        case 'fornecedores':
          this.data = a.sortBy("FORN_ID");
          this.content.changeview("list");
          this.createbox(this.data, this.content.page, !0,"list");
          break;
        case 'local':
          this.content.changeview("list");
          this.createbox(a, this.content.page, !0,"list");
          break;
        default:
          console.log("ALGO ERRADO");
      }
      ("images" !== this.view) ? this.scroll($("table tbody")) : this.scroll();
      /*if(b){
        
      }
      else{
        
      }*/
      
      /*this.content.page = 0;
      
      b ? (this.data = this.data || this.data) : this.data = this.data;*/
      
      //this.content.create(this.data[0]);
            
    },
    callRequest:function(data, status, req){
        this.ajaxrequest=!1;
        if (status == "success") {
          if(this.callback && "function" === typeof this.callback){
            this.callback(data,req);
          }
        }
    },
    convertData:function(data,req,what,notcombo){
        switch(what){
          case "amostras":
            if(!this.data.length){
              this.data=jQuery.parseJSON($(req.responseXML).text()).unique();
              this.setDate(this.data);
              this.setdata(this.data,"amostras");
            }
            else{
              var temp=jQuery.parseJSON($(req.responseXML).text()).unique().sortBy("AMOS_ID");
              this.setDate(temp);
              this.data=this.data.concat(temp);
              //console.dir(this.data);
              this.createbox(this.data, this.content.page, !0);
            }
            break;
          case "local":
            this.fair.push(jQuery.parseJSON($(req.responseXML).text()).sortBy('FEIR_DESC').unique());
            this.fair=this.fair[0];
            break;
          case "fornecedores":
            if(notcombo){
              if(!this.data.length){
                this.data=jQuery.parseJSON($(req.responseXML).text()).unique();
                this.setDate(this.data);
                console.dir(this.data);
                this.setdata(this.data,"fornecedores");
              }
              else{
                var temp=jQuery.parseJSON($(req.responseXML).text()).unique().sortBy('FORN_ID');
                /*console.dir(temp);
                console.dir(this.data);*/
                this.setDate(temp);
                this.data=this.data.concat(temp);
                //console.dir(this.data);
                this.createbox(this.data, this.content.page, !0,"list");
              }
            }
            else{
              this.spotlight.forn=[];
              this.spotlight.forn=jQuery.parseJSON($(req.responseXML).text()).sortBy('FORN_DESC').unique();
              //this.createComponent(this.forn,this.bforn,what);
              this.spotlight.open();
              //this.callService(this.page,"<FEIR_COD>10</FEIR_COD>","<FORN_ID>4200000</FORN_ID>",1,20);
            }
            break;
          case "cities":
            this.cities=jQuery.parseJSON($(req.responseXML).text());//.sortBy('FEIR_DESC').unique();
            this.createComponent(this.cities,this.bcity,what);
            break;
          default:
        }
    },
    setDate:function(list){
      var i,length;
      length=list.length;
      //console.dir(list);
      for(i=0;i<length;i++){
        list[i].CREATE_DATE=parseJsonDate(list[i].CREATE_DATE).toLocaleDateString();
      }
    },
    createComponent:function(data,comp,what){
      var i,html="";
      switch (what){
        case "fair":
          html+="<option value=''>Local de Coleta: </option>";
          for(i=0;i<data.length;i++){
            html+="<option value='"+data[i].FEIR_COD.replace("         ","").replace("        ","")+"'>"+data[i].FEIR_DESC+" - "+data[i].PAIS_COD+"</option>";
          }
          break;
        case "fornecedores":
          html+="<option value=''>Fornecedores: </option>";
          for(i=0;i<data.length;i++){
            html+="<option value='"+data[i].FORN_ID+"'>"+data[i].FORN_DESC+"</option>";
          }
          break;
        case "cities":
          comp.empty();
          html+="<option value=''>Cidades: </option>";
          for(i=0;i<data.length;i++){
            html+="<option value='"+data[i].REGI_COD+"'>"+data[i].REGI_DESC+"</option>";
          }
          break;
      }
      comp.html(html);
    },
    createbox : function(a, b, d, c,length) {  
        var f, g, n, m,v;      
        c = c || this.view;
        n = "images" === c ? "li" : "tr";
        this.setloading(!0,!1);
        this.active = this.active || this.content;
        

        /*d = this.content.itens && !d ? this.content.itens.length : 0;
        m = 40 * (b + 1) < a.length ? 40 * (b + 1) : a.length;
        console.log("d: "+d);
        console.log("a.length: "+a.length);
        console.log("m: "+m);
        var p, h, q, k = 20*b, l = 20, e = this;
        console.log("l: "+l);
        console.log("k: "+k);
        console.log("d < a.length: "+(d < a.length));*/

        /*console.log("m: "+m);
        console.log("l: "+l);
        console.log("k: "+k);*/

        if(length){
          var i;
          //console.log("ENTROU PARA SORTBY");
          m=((0+1)*length);
          var p, h, q, k = (0*length), l = length, e = this;
          if (a[k]) {
            f = setInterval(function() {
                h = a[k];   
                if (!h) {

                    clearInterval(f);
                    e.setloading(!1);
                    if(e.cookiefair){
                      //console.log("scroll: "+e.cookiefair.posscroll);
                      $(window).scrollTop(e.cookiefair.posscroll);
                    }
                    if(c ==="list"){
                      /*console.dir($("#table tbody"));
                      $("#table").DataTable();
                      console.dir($("#table"));*/
                    }
                }

                if ("images" === c && l > 0) {
                  //console.log("images");

                    if (h && v === h.AMOS_ID)
                      return !1;

                    v = h.AMOS_ID || null; 
                    //Usando por enquanto o caminho para a imagem large, pois as amostras antigas eram salvas em tamanho muito pequeno
                    p = new Image, q = "http://bdb/ifair_img/"+h.IMG_PATH_SAMPLE.replace("thumb","large"), $(p).load(function() {
                        if (!l > 0)
                          return !1;

                        p.name=parseInt(h.FEIR_COD)+"/"+h.AMOS_ID;
                        g = new Box({
                            item : h,
                            view : c,
                            tag : n,
                            // reloadcart : e.proxy(e.reloadcart),
                            detail : e.detail,
                            url : this
                        });
                        e.active.create(g.render());
                        l--;
                        k++;
                    }).error(function() {

                        if (!l > 0)
                            return !1;
                        var a = new Image;
                        a.name=parseInt(h.FEIR_COD)+"/"+h.AMOS_ID;
                        a.src = "http://189.126.197.169/img/small/small_NONE.jpg";

                        g = new Box({
                            item : h,
                            view : c,
                            tag : n,
                            // reloadcart : e.proxy(e.reloadcart),
                            detail : e.detail,
                            url : a
                        });
                        e.active.create(g.render());
                        l--;
                        k++;
                    }).attr("src", q);

                    // Mostrando (box sendo carregados)
                    $('.bread-search').find(".spec").text(k+1+" Resultados");
                } else {
                  //console.log("list");
                    if (l > 0) {
                        return g = new Box({
                            item : h,
                            view : c,
                            tag : n,
                            detail : e.detail,
                            modal : e.modal,
                            page: e.page
                        }), e.active.create(g.render()),$('.bread-search').find(".spec").text(k+1+" Resultados"),l--, k++,!1;
                        //, $('.bread-box').find(".bread-load").text(k+1), l--, k++, !1*/
                    } else {
                        clearInterval(f), e.setloading(!1);
                    }
                }
            }, 300);
          } else {
            //return setTimeout(function(){ e.setloading(!1); }, 3000),!1;
            return this.setloading(!1), !1;
          }
        }
        else{
          //console.log("ESCREVENDO SEM SORTBY");
          m=((this.content.page+1)*this.itens_by_page);
          var p, h, q, k = (this.content.page*this.itens_by_page), l = this.itens_by_page, e = this;
          if (a[k]) {
            f = setInterval(function() {
                h = a[k];   
                if (!h) {

                    clearInterval(f);
                    e.setloading(!1);
                    if(e.cookiefair){
                      //console.log("scroll: "+e.cookiefair.posscroll);
                      $(window).scrollTop(e.cookiefair.posscroll);
                    }

                    if(c ==="list"){
                      /*console.dir($("#table tbody"));
                      $("#table").DataTable();
                      console.dir($("#table"));*/
                    }
                }

                if ("images" === c && l > 0) {
                  //console.log("images");

                    if (h && v === h.AMOS_ID)
                      return !1;

                    v = h.AMOS_ID || null; 
                    //Usando por enquanto o caminho para a imagem large, pois as amostras antigas eram salvas em tamanho muito pequeno
                    p = new Image, q = "http://bdb/ifair_img/"+h.IMG_PATH_SAMPLE.replace("thumb","large"), $(p).load(function() {
                        if (!l > 0)
                            return !1;

                        p.name=parseInt(h.FEIR_COD)+"/"+h.AMOS_ID;
                        g = new Box({
                            item : h,
                            view : c,
                            tag : n,
                            // reloadcart : e.proxy(e.reloadcart),
                            detail : e.detail,
                            url : this
                        });
                        e.active.create(g.render());
                        l--;
                        k++;
                    }).error(function() {

                        if (!l > 0)
                            return !1;

                        var a = new Image;
                        a.name=parseInt(h.FEIR_COD)+"/"+h.AMOS_ID;
                        a.src = "http://189.126.197.169/img/small/small_NONE.jpg";

                        g = new Box({
                            item : h,
                            view : c,
                            tag : n,
                            // reloadcart : e.proxy(e.reloadcart),
                            detail : e.detail,
                            url : a
                        });
                        e.active.create(g.render());
                        l--;
                        k++;
                    }).attr("src", q);

                    // Mostrando (box sendo carregados)
                    $('.bread-search').find(".spec").text(k+1+" Resultados");
                } else {
                  //console.log("list");
                    if (l > 0) {
                        return g = new Box({
                            item : h,
                            view : c,
                            tag : n,
                            detail : e.detail,
                            modal : e.modal,
                            page: e.page
                        }), e.active.create(g.render()),$('.bread-search').find(".spec").text(k+1+" Resultados"),l--, k++,!1;
                        //, $('.bread-box').find(".bread-load").text(k+1), l--, k++, !1*/
                    } else {
                        clearInterval(f), e.setloading(!1);
                    }
                }
            }, 300);
          } else {
            //return setTimeout(function(){ e.setloading(!1); }, 3000),!1;
            return this.setloading(!1), !1;
          } 
        }
    },  
    stage:function() {
      var a, c;
      "number" === typeof window.innerWidth ? (a = window.innerWidth, c = window.innerHeight) : (a = document.documentElement.clientWidth, c = document.documentElement.clientHeight);
      return{w:a, h:c};
    },  
    endloading : function(a) {
        a && clearInterval(a);
        var b = this;
        b.getloading(!1);
        /*b.content.itens.fadeIn(function() { 
            b.getloading(!1);
        });  */          
    },
    deleteNote:function(a){
      a.preventDefault();
      var obj=$(a.target);
      this.callService("delete",obj.attr("id"),obj.attr("name"));
      obj.closest("li").fadeOut();
    },
    actionHeart:function(a){
      a.preventDefault();
      var obj=$(a.target);
    },
    actionFlag:function(a){
      a.preventDefault();
      var obj=$(a.target);
    },
    actionHomolog:function(a){
      a.preventDefault();
      var obj=$(a.target);
    },
    sortItems : function(a){
      var type,i,length,temp=[];
      if($(a.target).hasClass("sel") || this.loading){
        return !1;
      }
      type=$(a.target).attr("name");
      $("html").attr("class","amostras");
      this.content.clean();
      this.order_box.find("button").removeClass("sel");
      $(a.target).addClass("sel");
      if(type !== "BIGPRICE"){
        length= this.data.length;
        temp = this.data.sortBy(type).unique();
        this.createbox(temp, this.content.page,!1,!1,length);
      }
      else{
        temp = this.data.sortBy("AMOS_PRECO").unique();
        length=this.data.length-1;
        for(i=length;i>=0;i--){
          temp.push(this.data[i]);
        }
        this.createbox(temp.unique(), this.content.page,!1,!1,length);
      }
      //"images" !== this.view ? (this.content.table.show(), this.scroll(this.content.tbody)) : this.scroll();
    },
    enableSelect : function(a){
      if($(a.target).hasClass("sel") && this.view !== "list"){
        //Reseta array
        this.select_items=[];
        $(a.target).removeClass("sel");
        $(".thumbnail .icon").attr("class","icon");
        $("html").attr("class","amostras");
        this.action_name="";
      }
      else{
        //Inicia gravação
        this.select_items=[];
        $(".bsel").removeClass("sel");
        $(a.target).addClass("sel");
        $(".thumbnail .icon").attr("class","icon").addClass($(a.target).attr("name"));
        $("html").attr("class","amostras").addClass("select");
        if($(a.target).hasClass("bedit") && !$(a.target).hasClass('unable')){
          $("html").addClass("edit");
        }
      }
    },
    changeCountries: function(a){
      this.callService("cities",'<PAIS_COD>'+$(a.target).find("option:selected").val()+'</PAIS_COD>','<PAIS_DESC></PAIS_DESC>','<REGI_COD></REGI_COD>','<REGI_DESC></REGI_DESC>');
    },
    filterForn:function(ev){
      var aux;
      aux=this.data;
      this.reset();
      this.fdata = aux.filter(function(a,b){
        if(Boolean(a[$(ev.target).find("option:selected").attr("name")].length) === $(ev.target).find("option:selected").val().bool()){
          return a;
        }
      });
      this.data=aux;
      //console.dir(this.fdata);
      //this.content.page = 0;
      this.createbox(this.fdata, this.content.page, !0,"list");
      //console.dir(typeof Boolean($(a.target).find("option:selected").val()));
    },
    AmosByStatus:function(ev){
      var aux;
      aux=this.data;
      this.reset();
      if($(ev.target).hasClass("sel")){
        this.fdata=aux;
        this.data=aux;
      }
      else{
        $(".tooltip-content.status button").removeClass("sel");
        this.fdata = aux.filter(function(a,b){
          if(Boolean(a["AMOS_STATUS"]) === $(ev.target).attr("name").bool()){
            return a;
          }
        });
        this.data=aux;
      }
      $(ev.target).toggleClass("sel");
      //this.content.page = 0;
      if(!this.fdata.length){
        alert("NENHUM ITEM !!!");
        $('.bread-search').find(".spec").text("0 Resultados");
        return !1;
      }
      this.createbox(this.fdata, this.content.page, !0);
      //console.dir(typeof Boolean($(a.target).find("option:selected").val()));
    },AmosByPrice:function(){
      //AMOS_PRECO
      var aux,initial,end;
      aux=this.data;
      initial=$("input[name='initial_price']").val();
      end=$("input[name='end_price']").val();
      this.reset();
      this.fdata = aux.filter(function(a,b){
        if(parseInt(a["AMOS_PRECO"]) > parseInt(initial) && parseInt(a["AMOS_PRECO"]) < parseInt(end)){
          return a;
        }
      });
      this.data=aux;
      if(!this.fdata.length){
        alert("NENHUM ITEM !!!");
        $('.bread-search').find(".spec").text("0 Resultados");
        return !1;
      }
      this.createbox(this.fdata, this.content.page, !0);
    },
    goDetail:function(a){
      this.navigate("detail/"+$(a.target).attr("name"), !0);
    },
    sendEmail:function(){
      if(!this.select_items.length){
        alert("Selecione ao menos um item");
        return !1;
      }
      alert("Enviar email para: "+this.select_items.join(" , "));
    },
    compChange:function(ev){
      ev.preventDefault();
      var aux,html="";
      var el=$(ev.target);
      aux=el.closest("ul");
      //console.log(aux.find("a").length);
      if(aux.find("a").length>1){
        el.parent().remove();
        var items=aux.find("a");
        items.each(function(a,b){
          html+="<string>"+$(b).attr("href").replace("#","")+"</string>";
        });
        this.callService("gravarAmostraComposicao",$(items[0]).attr("name"),html);
      }
      else{
        this.callService("gravarAmostraComposicao",el.attr("name"),"");
        el.parent().remove();
      }
    },
    changeCity:function(val){
      var country,city,context=this,arr=[];
      country=$(".countries").find("option:selected").val();
      city=$(".city").find("option:selected").val();
      this.ffair=[];
      if(this.page !== "local_cadastro" && this.page !== "fornecedor_cadastro"){
        if(this.fair.length){
          arr.push(this.fair.filter(function(a,b){
            if(a.PAIS_COD === country && a.REGI_COD === city){
              return a;
            }
          }));
          this.ffair=arr[0];
          context.setdata(arr[0],"local");
        }
        else{
          this.callService("local",'<FEIR_COD></FEIR_COD>','<PAIS_COD>'+country+'</PAIS_COD>','<REGI_COD>'+city+'</REGI_COD>');
        }
      }
    },
    changeFair:function(a){
      this.initialTime='2015-01-08';
      this.endTime='2015-10-10';
      this.cookiefair={};
      $("input[name='initial_date']").val("");
      $("input[name='end_date']").val("");
      this.itens_by_page=this.itens_page_default;
      //this.scroller=0;
      this.bforn.val("");
      $(".form-control-search").val("");
      if(this.page === "fornecedor_cadastro"){
        this.fornecedores.setfair=$(a.target).find("option:selected").val();
        this.notcombo=!1;
        this.submit("<FEIR_COD>"+this.fairval+"</FEIR_COD>",!1,!1,!0);
        return !1;
      }
      this.fairval=$(a.target).find("option:selected").val();
      this.notcombo=!0;
      this.mode=this.page+"/"+(this.fairval.replace(" ","_") || "padrao")+"/"+"padrao"+"/"+"padrao";
      this.navigate(this.mode, !1);
      this.submit("<FEIR_COD>"+this.fairval+"</FEIR_COD>");
    },
    exportExcel:function(){
      //Extracted from: http://stackoverflow.com/questions/22317951/export-html-table-data-to-excel-using-javascript-jquery-is-not-working-properl/24081343#24081343

      
      var tab_text="<table border='2px'><tr bgcolor='#71abcc'>";
      var textRange; var j=0;
      tab = document.getElementById('table'); // id of table

      for(j = 0 ; j < tab.rows.length ; j++) 
      {     
          tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
          //tab_text=tab_text+"</tr>";
      }

      tab_text=tab_text+"</table>";
      tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
      tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
      tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

      var ua = window.navigator.userAgent;
      var msie = ua.indexOf("MSIE "); 

      if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
      {
          txtArea1.document.open("txt/html","replace");
          txtArea1.document.write(tab_text);
          txtArea1.document.close();
          txtArea1.focus(); 
          sa=txtArea1.document.execCommand("SaveAs",true,"WebFair Report.xls");
      }  
      else                 //other browser not tested on IE 11
          sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));  

      return (sa);
    },
    getSpot:function(a){
      //13 === a.keyCode ? (this.spotlight.close(), this.searchEl.trigger("submit")) : (this.filter.close(), 1 < a.target.value.length ? this.spotlight.open(a) : this.spotlight.close());
      if(13 === a.keyCode){
        this.spotlight.select(a);
      }
      else{
        if(3 < a.target.value.length){
          this.spotlight.input=$(a.target);
          if(48 <= a.keyCode && 90 >= a.keyCode || 8 == a.keyCode) {
                this.notcombo=!1;
                this.callService("fornecedores",'<FORN_DESC>'+a.target.value+'</FORN_DESC>','<FEIR_COD>'+this.fairval+'</FEIR_COD>','<LINHA_I>'+'1'+'</LINHA_I>','<LINHA_F>'+'60'+'</LINHA_F>','<CREATE_DATE_I>1900-10-17</CREATE_DATE_I>','');
              }
          else{
            if(40 === a.keyCode || 38 === a.keyCode) {
              return this.spotlight.arrow(a), !1;
              //return this.arrow(a), !1;
            }
          }
        }
        else{
          this.fornval=a.target.value;
          this.spotlight.close();
        }
      }
      return !1;
    },
    getFornVal:function(){
      return this.fornval;
    },
    getFairVal:function(){
      return this.fairval;
    },
    setFairVal:function(a){
      this.fairval=a;
    },
    setFornVal:function(a){
      this.fornval=a;
    },
    getAmosVal:function(){
      return this.amosval;
    },
    setAmosVal:function(a){
      this.amosval=a;
    },
    getNotCombo:function(){
      return this.notcombo;
    },
    setNotCombo:function(a){
      this.notcombo=a;
    },
    getPage:function(){
      return this.page;
    },
    setPage:function(a){
      this.page=a;
    },
    /**
    * `Set the loading state`
    * @memberOf App#
    * @param {Boolean} a. If true show mask, else hide mask.
    * @param {Boolean} b. If is false, open the loader ebook, else open just the mask div
    */
    setloading: function(a, b) {
      if (!b) {
        if (a) {
          this.maskEl.fadeIn();
          $("html").attr("id",'noscroll');
          this.loading = !0;
        } else {
          this.maskEl.fadeOut();
          $("html").removeAttr("id");
          this.loading = !1;
        }
      } else {
        if (a) {
          this.loader.fadeOut();
          this.maskEl.fadeIn();
          $("html").attr("id",'noscroll');
          this.loading = !0;
        } else {
          this.maskEl.fadeOut();
          this.loader.fadeIn();
          $("html").removeAttr("id");
          this.loading = !1;
        }
      }
      return this.loading;
    },

    /**
    * `Return loading status`
    * @memberOf App#
    *@return {boolean} status - return loading status
    *
    */
    getloading:function(a){
      a && !this.loading ? (this.maskEl.fadeIn(), this.loading = !0) : !1 === a && this.loading && (this.maskEl.fadeOut(), this.loading = !1);
      return this.loading;
    },

    getdata:function(filter){
      if(filter){
        var context=this,itens=[];
        this.data.filter(function(a,b){
          if(a.AMOS_ID == filter){
            itens.push(a);
            itens.push(context.data[b+1]);
            return itens;
          }
        });
        return itens;
      }
      else{
        return this.data;
      }
    },
    scroll:function(z) {
      var b, c, f, clone,e = this;
      z = z || $(window);
      $.hasData(z[0]) && z.unbind("scroll");
      //console.dir(e.content.itens);
      if (!e.content.itens) {
        return !1;
      }
      z.scroll(function() {
        if (e.loading || e.page === "detail") {
          return!1;
        }

        switch (e.page){
          case "amostras":
            d = z.scrollTop();
            b = e.content.itens.length;
            //console.dir(e.content.itens);
            //c =  20* e.itens.length;  
            console.log("SCROLLED"); 
            var scroll={
              fornval:''+e.fornval,
              fairval:''+e.fairval,
              amosval:""+e.amosval,
              initialTime:""+e.initialTime,
              endTime:""+e.endTime,
              view:""+e.view,
              posscroll:d,
              total:b
            };
            console.dir(scroll);
            $.cookie.json = !0;
            $.cookie("posscroll", scroll, {expires:7, path:"/"});

            d=d+200;
            f= $(".container").height();
            console.log(d+" , "+f);
            if (d >= f && b) {
              //console.log("chegou");
              e.content.page++;
              e.setloading(!0,!1);
              e.submit("<FEIR_COD>"+(e.fairval || "")+"</FEIR_COD>","<FORN_DESC>"+(e.fornval || "")+"</FORN_DESC>",(e.amosval || ""),!0);
            }
            break;
          case "fornecedores":
            d = z.scrollTop();
            b = e.content.itens.length;
            //console.dir(e.content.itens);
            //c =  20* e.itens.length;  
            console.log("SCROLLED"); 
            var scroll={
              fornval:''+e.fornval,
              fairval:''+e.fairval,
              amosval:""+e.amosval,
              initialTime:""+e.initialTime,
              endTime:""+e.endTime,
              view:""+e.view,
              posscroll:d,
              total:b
            };
            console.dir(scroll);
            $.cookie.json = !0;
            $.cookie("posscroll", scroll, {expires:7, path:"/"});

            d=d+680;
            f= $("table").height();
            console.log(d+" , "+f);
            if (d >= f && b) {
              //console.log("chegou");
              e.content.page++;
              e.setloading(!0,!1);
              e.submit("<FEIR_COD>"+(e.fairval || "")+"</FEIR_COD>","<FORN_DESC>"+(e.fornval || "")+"</FORN_DESC>",(e.amosval || ""),!0);
            }
            break;
          case "fornecedor_cadastro":
            console.log("SCROLL CADASTRO");
            break;
        }
        /*f.modal.close();
        b = z.scrollTop();
        d = ('list' === f.view || f.active !== f.content) ? f.active.itens.length * 40 : $(document).height();
        c = z.height();
        a = (f.active === f.content) ? Math.ceil(f.fdata.length / 24) : Math.ceil(f.active.data.length / 24);
        0.95 < b / (d - c) && (!f.loading && f.active.page < a && (f.active.page++, f.pt = b, (f.active === f.content) ? f.createbox(f.fdata, f.active.page) : f.createbox(f.active.data, f.active.page, !0, "list")));*/
      });
      /* Act on the event */
    },
    reset:function(){
      //console.log("resetou APP");
      this.data = [];
      this.fdata = [];
      this.itens = $([]);
      this.itens.remove();
      this.content.reset();
    },
    restartValues:function(){
      //Var to storage the basic data
      console.log("restartValues");
      this.fairval="";
      this.fornval="";
      this.amosval="";
      /*this.initialTime='2015-01-08';
      this.endTime='2015-10-10';*/
      this.notcombo=0;
    }
  });
  new App;
  Spine.Route.setup();
});