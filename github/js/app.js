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
       ".modal_mask" : "modalEl",
      //".form-control":"searchEl",
      //".right-list button":"viewBtn",
      //"button.close":"closeBtn",
      ".login-name":"username",
      ".login-id":"usersegm"
      //".table-container":"viewList",
      /*".viewport":"viewImage",
      ".bread-box":"breadEl",
     
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
      "click .main_opt_button.bemail":"sendEmail",
      "click .bnote":"toggleTemplate",
      "click .delete-temp":"deleteTemplate",
      "click .edit-temp":"editTemplate",
      "change .type":"filterTemplate",  
      "click .newtemp":"newTemplate",
      "click .category_button":"showSubCategories",
      "click .sub_category a":"setCompositions",
      "keyup input[name='FEIR_DESC']":"toUpperCaseValue",
      "keyup input[name='FORN_DESC']":"toUpperCaseValue",
      "click .goback-relative":"goBack"
      /*"submit .search":"submit",
      "click button.icon.go_back_default":"goBack",
      "click button.close":"getOut"*/
    },
    init:function(){
      this.view = "images";
      this.page = "amostras";
      this.nsort="AMOS_DESC";
      this.itens = $([]);
      this.data=[];
      this.fdata = [];
      this.loading=!1;
      this.action_name="";
      this.callback=null;
      this.bfair;
      this.bforn; 
      this.filterisdone=!0;
      this.itens_by_page=20;
      this.itens_page_default=this.itens_by_page;
      this.ajaxrequest=!1;

      //Var to storage the basic data
      this.fair=[];
      this.ffair=[];
      this.cities=[];
      this.forn=[];
      this.email=[];
      this.segm=[];
      this.prices=[];
      this.select_items=[];
      this.fstatus=null;
      this.fairval="";
      this.fornval="";
      this.amosval="";
      this.initialTime='2000-01-01';
      this.endTime='2020-10-10';
      this.notcombo=0;
      this.unable_select=!1;



      /*this.loja="";
      this.area="";
      this.father=!0;
      this.searchname="";*/
      this.breadarr = [];
      this.usr = jQuery.parseJSON($.cookie("webfair"));
      if(!this.usr)
        window.location.href = 'login.html';

      this.cookiefair=[];

      this.header.addClass("goDown");
      
      console.dir(this.usr);
      this.username.text(this.usr.USU_NOME);
      this.usersegm.text(this.usr.SEGM_DESC);
      
      this.el.find("#wrap").removeClass("hide");

      this.modal = new Modal({el:this.modalEl,callService:this.proxy(this.callService),usr:this.usr,getPage:this.proxy(this.getPage),setEmailSent:this.proxy(this.setEmailSent)});
      this.content = new Content({el:this.contentEl,usr:this.usr/*bread:this.breadEl, type:this.usr.TIPO*/});
      this.fornecedores = new Fornecedores({
        getloading:this.proxy(this.getloading),
        setloading:this.proxy(this.setloading),
        getdata:this.proxy(this.getdata),
        callService:this.proxy(this.callService),
        deleteNote:this.proxy(this.deleteNote),
        getSegm:this.proxy(this.getSegm),
        setSegm:this.proxy(this.setSegm),
        createComponent:this.proxy(this.createComponent),
        setDate:this.proxy(this.setDate),
        usr:this.usr,
        fair:this.fair,
        modal:this.modal
      });

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
        deleteNote:this.proxy(this.deleteNote),
        usr:this.usr,
        modal:this.modal,
        cookiefair:this.cookiefair
      });

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
          this.menuopt.eq(2)[0].click();
        },
        "amostras":function(){
          var context=this;
          this.page ="amostras";
          this.view = "images";
          console.log("AMOSTRAS NORMAL");
          $("html").attr("class","").addClass(this.page);
          $(".zoomContainer").remove();
          this.restartValues();
          this.writePage(this.page);
        },
        "amostras/*fairval/*fornval/*amosval":function(res){
          var a,b,c;
          console.log("this.cookiefair");
          $(".zoomContainer").remove();
          this.filterisdone=!0;
          this.fairval = a=res.fairval !== "padrao" ? parseInt(res.fairval) : ""; 
          this.fornval = b=res.fornval !== "padrao" ? res.fornval.replace("_"," ").replace("_"," ").replace("_"," ") : "";
          this.amosval = c=res.amosval !== "padrao" ? res.amosval.replace("_"," ").replace("_"," ").replace("_"," ") : ""; 

          if(this.cookiefair.length){
            console.dir(this.cookiefair);
            if(a == this.cookiefair[0].fairval && b === this.cookiefair[0].fornval  && c === this.cookiefair[0].amosval ){
              console.log("bateu parametros do cookie");
              this.initialTime=this.cookiefair[0].dates[0];
              this.endTime=this.cookiefair[0].dates[1];
              this.prices=this.cookiefair[0].prices;
              this.fstatus=this.cookiefair[0].fstatus;
              this.nsort=this.cookiefair[0].nsort;
            }
            else{
              console.log("WINDOW 0");
              this.cookiefair=[];
              $.removeCookie('posscroll', { path: '/' });
              $(".container-fullsize.scroller").scrollTop(0);
            }
          }
          else{
            console.log("nao achou");
            if(jQuery.parseJSON($.cookie("posscroll"))){
              this.cookiefair.push(jQuery.parseJSON($.cookie("posscroll")));
              if(a == this.cookiefair[0].fairval && b === this.cookiefair[0].fornval  && c === this.cookiefair[0].amosval ){
                console.log("bateu parametros do cookie");
                this.initialTime=this.cookiefair[0].dates[0];
                this.endTime=this.cookiefair[0].dates[1];
                this.prices=this.cookiefair[0].prices;
                this.fstatus=this.cookiefair[0].fstatus;
                this.nsort=this.cookiefair[0].nsort;
              }
              else{
                console.log("WINDOW 0");
                this.cookiefair=[];
                $.removeCookie('posscroll', { path: '/' });
                $(".container-fullsize.scroller").scrollTop(0);
              }
            }
            else{
              console.log("WINDOW 0");
              $(".container-fullsize.scroller").scrollTop(0);
            }
          }

          if(b.length){
             if(isNaN(b)){
              b="<FORN_DESC>"+b+"</FORN_DESC>";
             }
             else{
              b="<FORN_ID>"+b+"</FORN_ID>";
             }
          }
          else{
            b="";
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
          this.restartValues();
          $("html").attr("class","").addClass(this.page);
          this.writePage(this.page);
        },
        "fornecedores/*fairval/*fornval/*amosval":function(res){
          var a,b,c;
          console.log("ok");
          $(".zoomContainer").remove();

          if(this.cookiefair.length){
            console.dir(this.cookiefair);
            this.initialTime=this.cookiefair[0].dates[0];
            this.endTime=this.cookiefair[0].dates[1];
            this.prices=this.cookiefair[0].prices;
            this.fstatus=this.cookiefair[0].fstatus;
            this.nsort=this.cookiefair[0].nsort;
          }
          else{
            if(jQuery.parseJSON($.cookie("posscroll"))){
              this.cookiefair.push(jQuery.parseJSON($.cookie("posscroll")));
              this.initialTime=this.cookiefair[0].dates[0];
              this.endTime=this.cookiefair[0].dates[1];
              this.prices=this.cookiefair[0].prices;
              this.fstatus=this.cookiefair[0].fstatus;
              this.nsort=this.cookiefair[0].nsort;
            }
            else{
              this.cookiefair=[];
              $.removeCookie('posscroll', { path: '/' });
              $(".container-fullsize.scroller").scrollTop(0);
            }
          }

          this.fairval = a=res.fairval !== "padrao" ? parseInt(res.fairval) : ""; 
          this.fornval = b=res.fornval !== "padrao" ? res.fornval.replace("_"," ").replace("_"," ").replace("_"," ") : "";
          this.amosval = c=res.amosval !== "padrao" ? res.amosval.replace("_"," ").replace("_"," ").replace("_"," ") : ""; 

          if(parseInt(b)){
            b="<FORN_ID>"+b+"</FORN_ID>";
          }
          else{
            if(b){
              if(b.slice(0, 3) === "alt"){
                b=b.slice(3,(b.length));
              }
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
          $("html").attr("class","fornecedor_cadastro edit_forn");
          $(".zoomContainer").remove();
          this.writePage(this.page,a.code);
        },
        "fornecedores/*func":function(a){
          var context=this;
          console.log("criar novo fornecedor");
          this.page ="fornecedor_cadastro";
          $("html").attr("class","fornecedor_cadastro add_forn");
          $(".zoomContainer").remove();
          this.writePage(this.page,"new");
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
          $("html").attr("class","").addClass(this.page);
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
      window.history.go(-1);
    },
    writePage:function(hash,val){
      var context=this;  
      if(this.page !== "detail" && this.page !== "fornecedor_cadastro"){
        context.reset();
      }

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
              //defaultDate: "+1w",
              changeMonth: true,
              numberOfMonths: 1,
              //defaultDate:'01-01-01',
              monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
              monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
              dayNamesMin: ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'],
              dateFormat:"yy-mm-dd",
              onClose: function( selectedDate ) {
                $( "input[name='end_date']" ).datepicker( "option", "minDate", selectedDate );
              }
            });
            $( "input[name='end_date']" ).datepicker({
              //defaultDate: "+1w",
              changeMonth: true,
              numberOfMonths: 1,
              //defaultDate:context.endTime,
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
              if(context.fornval.slice(0,3) ===  "alt"){
                context.bforn.val(context.fornval.slice(3,(context.fornval.length)));
              }
              else{
                context.bforn.val(context.fornval);
              }
            }

            $( "input[name='initial_date']" ).datepicker({
              defaultDate: "+1w",
              changeMonth: true,
              numberOfMonths: 1,
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
              numberOfMonths: 1,
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
            if(context.usr.SEGM_COD !== "TD"){
              $(".bnew-fair").hide();
            }
            if(!context.fair.length){
              status=setInterval(function(){
                if(context.fair.length){
                  context.ajaxrequest=!1;
                  context.setdata(context.fair,"local");
                  clearInterval(status);
                }
              },100);
            }
            else{
              context.setdata(context.fair,"local");
            }          
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
              context.fair.filter(function(a,b){
                if((parseInt(a.FEIR_COD) == (parseInt(val)))){
                  context.popComponent(a);
                }
              });
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
            //$.getScript("js/lib/external-script.js");
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
            context.fornecedores.reload(val);
            break;
          case "template_email":
            if(!context.fair.length){
              status=setInterval(function(){
                if(context.fair.length){
                  context.ajaxrequest=!1;
                  context.callService("template_email",'','<TEMP_DESC></TEMP_DESC><SEGM_COD></SEGM_COD>');
                  clearInterval(status);
                }
              },100);
            }
            else{
              context.callService("template_email",'','<TEMP_DESC></TEMP_DESC><SEGM_COD></SEGM_COD>');
            }
            break;
          default:
            alert("dssda");
        }
      });
    },
    popComponent:function(item){
      var elem=$(".form-control"),context=this;
      elem.each(function(a,b){
        $(b).attr("disabled","disabled").val(item[$(b).attr("name")]);
      });
      this.fairval=item;
      if(this.usr.SEGM_COD === "TD"){
        $(".edit-fair").trigger('click');
      }
      else{
        console.dir($(".container-fullsize"));
        $(".container-fullsize").hide();
      }
      this.callService("cities",'<PAIS_COD>'+item.PAIS_COD+'</PAIS_COD>','<PAIS_DESC></PAIS_DESC>','<REGI_COD></REGI_COD>','<REGI_DESC></REGI_DESC>');
      status=setInterval(function(){
        if(context.cities.length){
          $(".city option").each(function(a,b){
            if($(b).attr("value") === item["REGI_COD"]){
              $(b).attr("selected","selected");
            }
          });
          clearInterval(status);
        }
      },100);
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
        this.modal.open("message","Selecione ao menos uma feira para filtrar!!!",!1,!0);
        return !0;
      }
      this.reset();
      this.resetFilters();
      this.initialTime=$("input[name='initial_date']").val() || (new Date().getFullYear())+"-01-01";
      this.endTime=$("input[name='end_date']").val() || (new Date().getFullYear())+"-12-30";
      if(this.cookiefair.length){
        this.cookiefair[0].posscroll=0;
      }
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
      var context=this;
      a.preventDefault();
      if($(a.target).hasClass("sel")){
        this.select_items = this.select_items.filter(function(element,i){
           return element.AMOS_ID !== parseInt($(a.target).attr("name"));
        });
      }
      else{
        console.log("aqui");
        this.data.filter(function(element,i){
          if(element.AMOS_ID === parseInt($(a.target).attr("name"))){
            context.select_items.push({"AMOS_ID":parseInt(element.AMOS_ID),"AMOS_DESC":element.AMOS_DESC,"FORN_ID":element.FORN_ID,"FORN_DESC":element.FORN_DESC});
          }
        });
      }
      $(a.target).toggleClass("sel");
      if($(a.target).attr("bselection-edit")){
        this.action_name="edit";
      }
      else{
        this.action_name="select";
      }
          console.dir(this.select_items);

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
            'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ListarAmostras xmlns="http://tempuri.org/">'+a+''+b+''+c+''+d+''+e+''+f+''+g+'<SEGM_COD>'+(core.usr.SEGM_COD === "TD" ? "" : core.usr.SEGM_COD)+'</SEGM_COD></ListarAmostras></soap:Body></soap:Envelope>',
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
              this.modal.open("message","Local Salvo com Sucesso!!!",!1,!0);
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
            'name':'email_fornecedor',
            'serviceName':'ListarFornecedores',
            'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ListarFornecedores xmlns="http://tempuri.org/">'+a+''+b+''+c+''+d+''+e+''+f+'</ListarFornecedores></soap:Body></soap:Envelope>',
            callback:function(data,req){
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
            'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GravarAnotacao xmlns="http://tempuri.org/"><note><NOTA_ID>0</NOTA_ID>'+a+'<PLAT_ID>2</PLAT_ID>'+b+'</note><action>I</action></GravarAnotacao></soap:Body></soap:Envelope>',
            'callback':function(){
              switch (core.page){
                case "detail":
                  core.detail.writeNote();
                  break;
                case "fornecedor_cadastro":
                  core.fornecedores.writeNote();
                  break;
              }    
            }
          },
          {
            'name':'gravarAmostraComposicao',
            'serviceName':'GravarAmostraComposicao',
            'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GravarAmostraComposicao xmlns="http://tempuri.org/"><AMOS_ID>'+a+'</AMOS_ID><compositions>'+b+'</compositions></GravarAmostraComposicao></soap:Body></soap:Envelope>',
            'callback':function(){
              console.log("ok");
              core.setloading(!1);
            }
          },
          {
            'name':'listarSegmentos',
            'serviceName':'ListarSegmentos',
            'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ListarSegmentos xmlns="http://tempuri.org/"><SEGM_COD></SEGM_COD></ListarSegmentos></soap:Body></soap:Envelope>',
            'callback':function(data,req){
              core.convertData(data,req,name);
            }
          },
          {
            'name':'GravarFornecedor',
            'serviceName':'GravarFornecedor',
            'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GravarFornecedor xmlns="http://tempuri.org/"><supplier>'+a+''+b+''+c+''+d+'<PLAT_ID>2</PLAT_ID></supplier>'+e+'</GravarFornecedor></soap:Body></soap:Envelope>',
            'callback':function(data,req){
              core.setloading(!1);
            }
          },
          {
            'name':'GravarFornecedorContato',
            'serviceName':'GravarFornecedorContato',
            'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GravarFornecedorContato xmlns="http://tempuri.org/"><contact>'+a+''+b+''+c+'<PLAT_ID>2</PLAT_ID></contact>'+d+'</GravarFornecedorContato></soap:Body></soap:Envelope>',
            'callback':function(data,req){
              core.setloading(!1);
            }
          },
          {
            'name':'GravarFornecedorFavorito',
            'serviceName':'GravarFornecedorFavorito',
            'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GravarFornecedorFavorito xmlns="http://tempuri.org/">'+a+'<segments>'+b+'</segments></GravarFornecedorFavorito></soap:Body></soap:Envelope>',
            'callback':function(data,req){
              core.setloading(!1);
            }
          },
          {
            'name':'GravarFornecedorProfile',
            'serviceName':'GravarFornecedorProfile',
            'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GravarFornecedorProfile xmlns="http://tempuri.org/">'+a+'<profiles>'+b+'</profiles></GravarFornecedorProfile></soap:Body></soap:Envelope>',
            'callback':function(data,req){
              core.setloading(!1);
            }
          },
          {
            'name':'GravarFornecedorComposicao',
            'serviceName':'GravarFornecedorComposicao',
            'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GravarFornecedorComposicao xmlns="http://tempuri.org/">'+a+'<compositions>'+b+'</compositions></GravarFornecedorComposicao></soap:Body></soap:Envelope>',
            'callback':function(data,req){
              core.setloading(!1);
            }
          },
          {
            'name':'GravarFornecedorProduto',
            'serviceName':'GravarFornecedorProduto',
            'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GravarFornecedorProduto xmlns="http://tempuri.org/">'+a+'<products>'+b+'</products></GravarFornecedorProduto></soap:Body></soap:Envelope>',
            'callback':function(data,req){
              core.setloading(!1);
            }
          },
          {
            'name':'GravarFornecedorMercado',
            'serviceName':'GravarFornecedorMercado',
            'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GravarFornecedorMercado xmlns="http://tempuri.org/">'+a+'<markets>'+b+'</markets></GravarFornecedorMercado></soap:Body></soap:Envelope>',
            'callback':function(data,req){
              core.setloading(!1);
            }
          },
          {
            'name':'template_email',
            'serviceName':'listarTemplates',
            'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ListarEmailTemplates xmlns="http://tempuri.org/">'+a+''+b+'</ListarEmailTemplates></soap:Body></soap:Envelope>',
            callback:function(data,req){
              core.convertData(data,req,name);
            }
          },
          {
            'name':'gravarTemplate',
            'serviceName':'gravarTemplate',
            'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GravarEmailTemplate xmlns="http://tempuri.org/"><template>'+a+''+b+'</template>'+c+'</GravarEmailTemplate></soap:Body></soap:Envelope>',
            'callback':function(data,req){
              console.log(core.ajaxrequest);
              core.modal.close(core.page);
            }
          },
        ];

        $.support.cors=true;
        soapRequest.filter(function(a,b){
          if(a['name'] === name){
            //console.log(a['code']);
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
        else if(!$(a.target).val().length){
          search="";
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
      this.fornecedores.ajaxrequest=!1;
    },
    setdata:function(a,b){  
      var i,length;
      //this.content.page = 0;
      /*this.setBreadcrumb(a,val);
      this.breadEl.find(".bread-load").text(0);*/

      

      if (!this.data.length && b !="local") {        
        return this.modal.open("message","Nenhum Item Encontrado!!!",!1,!0), $('.bread-search').find(".spec").text("0 Resultados");
        //return this.modal.open(),this.breadEl.find('.bread-colec a').text("").removeClass('active'),this.setloading(!1), this.searchEl.find('input').blur();
      }  
      switch(b){
        case 'amostras':
          this.data = a.sortBy(this.nsort);
          this.content.changeview(this.view);
          console.dir(this.data);
          var scroll={
            "fornval":''+this.fornval,
            "fairval":''+this.fairval,
            "amosval":""+this.amosval,
            "dates":[this.initialTime,this.endTime],
            "prices":this.prices,
            "fstatus":this.fstatus,
            "nsort":this.nsort,
            "view":""+this.view,
            "posscroll":0,
            "total":20
          };
          $.cookie.json = !0;
          this.cookiefair=[];
          this.cookiefair.push(scroll);
          console.dir(scroll);
          $.cookie("posscroll", scroll, {expires:7, path:"/"});

          //REOPEN
          //console.log("reopen: "+this.content.page);
          //this.createbox(this.data, this.content.page, !0);
          this.reopenFilter(this.data, this.content.page, !0);

          break;
        case 'template':
          this.data = a.sortBy("TEMP_ID");
          this.content.changeview("list");
          this.createbox(this.data, this.content.page, !0,"list");
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
        var query;
        this.ajaxrequest=!1;
        this.fornecedores.ajaxrequest=!1;
        if (status == "success") {
          if(this.page === "fornecedor_cadastro" && jQuery.parseJSON($(req.responseXML).text()).OBJ_ID){
            console.log("salvou: "+jQuery.parseJSON($(req.responseXML).text()).OBJ_ID);
            query=data.URL.replace("http://192.168.10.100/WebService.asmx?op=","");
            console.log(query === "GravarAnotacao");
            if(query === "GravarFornecedor"){
              if(!this.fornecedores.item){
                this.fornecedores.item={};
              }
              //OBJ_ID
              this.fornecedores.item["FORN_ID"]=jQuery.parseJSON($(req.responseXML).text()).OBJ_ID;
            }
            else{
              this.fornecedores.noteid=jQuery.parseJSON($(req.responseXML).text()).OBJ_ID;
            }
            
          }
          if(this.page === "detail" && jQuery.parseJSON($(req.responseXML).text()).OBJ_ID){
            this.detail.noteid=jQuery.parseJSON($(req.responseXML).text()).OBJ_ID;
          }
          if(this.callback && "function" === typeof this.callback){
            this.callback(data,req);
          }
        }
    },
    convertData:function(data,req,what,notcombo){
        var context=this;
        switch(what){
          case "amostras":
            if(!this.data.length){
              this.data=jQuery.parseJSON($(req.responseXML).text()).unique();
              this.data=this.data.filter(function(a,b){
                console.dir(a.SEGM_COD);
                if(a.SEGM_COD === context.usr.SEGM_COD || context.usr.SEGM_COD === "TD"){
                  return a;
                }
              });
              this.setDate(this.data);
              this.setdata(this.data,"amostras");
            }
            else{
              var temp=jQuery.parseJSON($(req.responseXML).text()).unique().sortBy(this.nsort);
              this.data=this.data.filter(function(a,b){
                if(a.SEGM_COD === context.usr.SEGM_COD || context.usr.SEGM_COD === "TD"){
                  return a;
                }
              });
              this.setDate(temp);
              this.data=this.data.concat(temp);
              console.dir(this.data);

              //REOPEN
              //console.log("reopen: "+this.content.page);
              //this.createbox(this.data, this.content.page, !0);
              this.reopenFilter(this.data, this.content.page, !0);
            }
            break;
          case "local":
            this.fair.push(jQuery.parseJSON($(req.responseXML).text()).sortBy('FEIR_DESC').unique());
            this.fair=this.fair[0];
           // context.setdata(this.fair,"local");
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
          case 'email_fornecedor':
            this.sendEmailGo(jQuery.parseJSON($(req.responseXML).text()).unique());
            break;
          case "cities":
            this.cities=jQuery.parseJSON($(req.responseXML).text());//.sortBy('FEIR_DESC').unique();
            this.createComponent(this.cities,this.bcity,what);
            break;
          case "listarSegmentos":
            this.setSegm(jQuery.parseJSON($(req.responseXML).text()));//.sortBy('FEIR_DESC').unique();
            break;
          case "template_email":
            var context=this;
            console.log("convert");
            if(this.page === "template_email"){
              this.data=jQuery.parseJSON($(req.responseXML).text());//.sortBy('FEIR_DESC').unique();
              this.data=this.data.filter(function(a,b){
                if(a.SEGM_COD === context.usr.SEGM_COD || context.usr.SEGM_COD === "TD"){
                  return a;
                }
              });
              this.setdata(this.data,"template");
            }
            else{
              this.email=jQuery.parseJSON($(req.responseXML).text());//.sortBy('FEIR_DESC').unique();
              this.email=this.email.filter(function(a,b){
                if(a.SEGM_COD === context.usr.SEGM_COD || context.usr.SEGM_COD === "TD"){
                  return a;
                }
              });
            }
            break;
          default:
        }
    },
    showComboTemplateEmail:function(){
      console.log("show");
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
            html+="<option value='"+parseInt(data[i].FEIR_COD)+"'>"+data[i].FEIR_DESC+" - "+data[i].PAIS_COD+" - "+data[i].REGI_DESC+"</option>";
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
        case "segm":
          comp.empty();
          html+="<option value=''>Segmentos: </option>";
          for(i=0;i<data.length;i++){
            html+="<option value='"+data[i].SEGM_COD+"'>"+data[i].SEGM_DESC+"</option>";
          }
          break;
      }
      comp.html(html);
    },
    createbox : function(a, b, d, c,length) {  
        var f, g, n, m,v;     
        var context=this; 
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
          var p, h, q, k = (0*length), l = length, e = this,countf=1;
          if (a[k]) {
            f = setInterval(function() {
                h = a[k];   
                if (!h) {

                    clearInterval(f);
                    e.setloading(!1);
                    if(e.filterisdone){
                      //e.reopenFilter();
                    }
                    if(e.cookiefair.length){
                      //console.log("scroll: "+e.cookiefair[0].posscroll);
                      $(".container-fullsize.scroller").scrollTop(e.cookiefair[0].posscroll);
                    }
                }

                if ("images" === c && l > 0) {
                  //console.log("images");

                    if (h && v === h.AMOS_ID)
                      return !1;

                    v = h.AMOS_ID || null; 
                    //Usando por enquanto o caminho para a imagem large, pois as amostras antigas eram salvas em tamanho muito pequeno
                    p = new Image, q = "http://bdb/ifair_img/"+h.IMG_PATH_SAMPLE.replace("thumb","large")/*"http://192.168.10.100/webfair/ifairimg/"+h.IMG_PATH_SAMPLE.replace("thumb","large")*/, $(p).load(function() {
                        if (!l > 0)
                          return !1;

                        p.name=parseInt(h.FEIR_COD)+"/"+h.AMOS_ID;
                        g = new Box({
                            item : h,
                            view : c,
                            tag : n,
                            usr:e.usr,
                            unable_select:e.unable_select,
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
                            usr:e.usr,
                            unable_select:e.unable_select,
                            // reloadcart : e.proxy(e.reloadcart),
                            detail : e.detail,
                            url : a
                        });
                        e.active.create(g.render());
                        l--;
                        k++;
                    }).attr("src", q);

                    // Mostrando (box sendo carregados)
                    if(h.FORN_ID !== a[k-1].FORN_ID){
                      console.log(h.FORN_ID+" = "+a[k-1].FORN_ID);
                      console.log(countf);
                      countf++;
                    }
                    $('.bread-search').find(".spec").text(k+1+" de "+h.COUNT_AMOS+" Resultados / "+countf+" Fornecedores");
                } else {
                  //console.log("list");
                    if (l > 0) {
                        if(h.FORN_ID !== a[k-1].FORN_ID){
                          console.log(h.AMOS_ID+" = "+a[k-1].AMOS_ID);
                          countf++;
                        }
                        return g = new Box({
                            item : h,
                            view : c,
                            tag : n,
                            detail : e.detail,
                            usr:e.usr,
                            unable_select:e.unable_select,
                            modal : e.modal,
                            page: e.page
                        }), e.active.create(g.render()),$('.bread-search').find(".spec").text(k+1+" de "+h[count]+" Resultados / "+countf+" Fornecedores"),l--, $("tbody .bstar").unbind("click").bind("click",function(a){context.starForn(a)}), k++,!1;
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
          console.log("ESCREVENDO SEM SORTBY");
          m=((this.content.page+1)*this.itens_by_page);
          var p, h, q, k = (this.content.page*this.itens_by_page), l = this.itens_by_page, e = this,countf=1;
          if (a[k]) {
            f = setInterval(function() {
                h = a[k];   
                if (!h) {

                    clearInterval(f);
                    e.setloading(!1);
                    if(e.filterisdone){
                      //e.reopenFilter();
                    }
                    
                    if(e.cookiefair.length){
                      //console.log("scroll: "+e.cookiefair[0].posscroll);
                      $(".container-fullsize.scroller").scrollTop(e.cookiefair[0].posscroll);
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
                    p = new Image, q = "http://bdb/ifair_img/"+h.IMG_PATH_SAMPLE.replace("thumb","large")/*"http://192.168.10.100/webfair/ifairimg/"+h.IMG_PATH_SAMPLE.replace("thumb","large")*/, $(p).load(function() {
                        if (!l > 0)
                            return !1;

                        p.name=parseInt(h.FEIR_COD)+"/"+h.AMOS_ID;
                        g = new Box({
                            item : h,
                            view : c,
                            tag : n,
                            usr:e.usr,
                            unable_select:e.unable_select,
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
                            usr:e.usr,
                            unable_select:e.unable_select,
                            // reloadcart : e.proxy(e.reloadcart),
                            detail : e.detail,
                            url : a
                        });
                        e.active.create(g.render());
                        l--;
                        k++;
                    }).attr("src", q);

                    // Mostrando (box sendo carregados)
                    if(h.FORN_ID !== a[k-1].FORN_ID){
                      console.log(h.FORN_ID+" = "+a[k-1].FORN_ID);
                      //console.log(countf);
                      countf++;
                    }
                    $('.bread-search').find(".spec").text(k+1);
                    $('.bread-search').find(".specall").text(h.COUNT_AMOS);
                     $('.bread-search').find(".specforn").text("/ "+countf+" Fornecedores");
                } else {
                    var count="COUNT_FORN";
                    if(context.page === "amostras"){
                      count="COUNT_AMOS";

                      if(a[k-1]){
                        console.log(h.FORN_ID+" , "+a[k-1].FORN_ID);
                        if(h.FORN_ID !== a[k-1].FORN_ID){
                          console.log(h.FORN_ID+" = "+a[k-1].FORN_ID);
                          countf++;
                        }
                      }
                    }
                    if (l > 0) {
                        return g = new Box({
                            item : h,
                            view : c,
                            tag : n,
                            detail : e.detail,
                            unable_select:e.unable_select,
                            modal : e.modal,
                            usr:e.usr,
                            page: e.page
                        }), e.active.create(g.render()),$('.bread-search').find(".spec").text(k+1),$('.bread-search').find(".specall").text(h[count]),$('.bread-search').find(".specforn").text("/ "+countf+" Fornecedores"),$("tbody .bstar").unbind("click").bind("click",function(a){context.starForn(a)}),l--, k++,!1;

                        //, $('.bread-box').find(".bread-load").text(k+1), l--, k++, !1*/
                    } else {
                      if(c === "list"){
                        $("button.main_opt_button.bselect.bsel").trigger('click');
                      }
                      clearInterval(f), e.setloading(!1);
                    }
                }
            }, 300);
          } else {
            //    $("tbody .bstar").unbind("click").bind("click",function(a){context.starForn(a)});
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
      this.callService("delete",obj.attr("title"),obj.attr("name"));
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
        this.nsort=type;
        length= this.data.length;
        temp = this.data.sortBy(type).unique();
        this.createbox(temp, this.content.page,!1,!1,length);
      }
      else{
        this.nsort="AMOS_PRECO";
        temp = this.data.sortBy(this.nsort).unique();
        length=this.data.length-1;
        for(i=length;i>=0;i--){
          temp.push(this.data[i]);
        }
        this.createbox(temp.unique(), this.content.page,!1,!1,length+1);
        //this.createbox(temp.unique(), this.content.page,!1,!1,length);
      }
    },
    enableSelect : function(a){
      console.log("ok");
      var context=this;
      if(!context.email.length){
        status=setInterval(function(){
          console.log("enable select");
          if(context.fair.length && !context.email.length){
            context.ajaxrequest=!1;
            context.callService("template_email",'','<TEMP_DESC></TEMP_DESC><SEGM_COD></SEGM_COD>');
            clearInterval(status);
          }
        },100);
      }
      else{
        context.callService("template_email",'','<TEMP_DESC></TEMP_DESC><SEGM_COD></SEGM_COD>');
      }

      if($(a.target).hasClass("sel") && this.view !== "list"){
        //Reseta array
        this.select_items=[];
        this.unable_select=!1;
        $(a.target).removeClass("sel");
        $(".thumbnail .icon").attr("class","icon");
        $("html").attr("class","amostras");
        this.action_name="";
      }
      else if($(a.target).hasClass("sel") && this.view === "list"){
        this.select_items=[];
        $(".icon.bselection").removeClass('sel');
      }
      else{
        //Inicia gravação
        this.select_items=[];
        this.unable_select=!0;
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
        if(Boolean(a[$(ev.target).find("option:selected").attr("name")]) === $(ev.target).find("option:selected").val().bool()){
          return a;
        }
      });
      this.data=aux;
      //console.dir(this.fdata);
      //this.content.page = 0;
      this.createbox(this.fdata, this.content.page, !0,"list");
      //console.dir(typeof Boolean($(a.target).find("option:selected").val()));
    },
    starForn:function(ev){
      var el,i,html="",diff=!1,item;
      el=this.data.filter(function(a,b) {
        if(parseInt(a.FORN_ID) == parseInt($(ev.target).attr('name'))){
          item=a.FAVORITES;
          //a.FAVORITES.push({"SEGM_COD":context.usr.SEGM_COD,"SEGM_DESC":context.usr.SEGM_DESC});
          return a;
        }
      });
      if(el.length){
        if($(ev.target).hasClass('has')){
          console.log("entrou has");
          for(i=0;i<el[0].FAVORITES.length;i++){
            if(el[0].FAVORITES[i].SEGM_COD !== this.usr.SEGM_COD){
              console.log("diferente");
              html+="<string>"+el[0].FAVORITES[i].SEGM_COD+"</string>";
              diff=!0;
            }
            else{
              console.log("igual");
              el[0].FAVORITES.slice(i, 1);
              //item.push({"SEGM_COD":this.usr.SEGM_COD,"SEGM_DESC":this.usr.SEGM_DESC});
              if(el[0].FAVORITES[i].length >=1){
                console.log("mais que 1");
                diff=!0;
              }
              else{
                diff=!1;
              }
            }
          }
          if(diff){
            $(ev.target).removeClass('nothas').removeClass('has').addClass('middle');
          }
          else{
            $(ev.target).removeClass('middle').removeClass('has').addClass('nothas');
          }
        }

        else if($(ev.target).hasClass('middle')){
          console.log("middle");
          for(i=0;i<el[0].FAVORITES.length;i++){
            html+="<string>"+el[0].FAVORITES[i].SEGM_COD+"</string>";
          }
          html+="<string>"+this.usr.SEGM_COD+"</string>";
          $(ev.target).removeClass('nothas').removeClass('middle').addClass('has');
        }
        else{
          console.log("nova");
          html+="<string>"+this.usr.SEGM_COD+"</string>";
          item.push({"SEGM_COD":this.usr.SEGM_COD,"SEGM_DESC":this.usr.SEGM_DESC});
          $(ev.target).removeClass('nothas').removeClass('middle').addClass('has');
        }
      }

      this.callService("GravarFornecedorFavorito","<Forn_ID>"+parseInt($(ev.target).attr("name"))+"</Forn_ID>",html);

    },
    AmosByStatus:function(ev){
      if($(ev.target).hasClass("sel")){
        this.fstatus=null;
      }
      else{
        $(".tooltip-content.status button").removeClass("sel");
        this.fstatus=$(ev.target).attr("name").bool();
      }
      $(ev.target).toggleClass("sel");
      this.Componentfilter(this.fdata, this.content.page, !0);
    },AmosByPrice:function(){
      console.dir(this.data);
      this.Componentfilter(this.data, this.content.page, !0);
    },

    Componentfilter:function(data,page,d,view,haslength){
      //Componente para todos os filtros, vou passar em todo o data e filtrar todos os filtros sempre que o filtro for mudado.
      console.dir(page);
      var aux,context=this,status;
      aux=this.data;
      this.prices=[];
      this.prices.push($("input[name='initial_price']").val() || 0);
      this.prices.push($("input[name='end_price']").val() || 100000);
      this.fdata = aux.filter(function(a,b){
        if(parseInt(a["AMOS_PRECO"]) >= parseInt(context.prices[0]) && parseInt(a["AMOS_PRECO"]) <= parseInt(context.prices[1]) && (Boolean(a["AMOS_STATUS"]) === context.fstatus || context.fstatus === null)){
          return a;
        }
      });
      if(!this.fdata.length){
        this.modal.open("message","Nenhum Item Encontrado!!!",!1,!0);
        $('.bread-search').find(".spec").text("0 Amostras");
        this.data=aux;
        return !1;
      }
      console.dir(aux);
      var scroll={
        "fornval":''+this.fornval,
        "fairval":''+this.fairval,
        "amosval":""+this.amosval,
        "dates":[this.initialTime,this.endTime],
        "prices":this.prices,
        "fstatus":this.fstatus,
        "nsort":this.nsort,
        "view":""+this.view,
        "posscroll":this.posscroll,
        "total": this.content.itens.length
      };
      $.cookie.json = !0;
      this.cookiefair=[];
      this.cookiefair.push(scroll);
      console.dir(scroll);
      $.cookie("posscroll", scroll, {expires:7, path:"/"});
      this.data=aux;
      this.setloading(!1);
      this.createbox(this.fdata, page,d,view,haslength);
    },

    goDetail:function(a){
      this.navigate("detail/"+$(a.target).attr("name"), !0);
    },
    sendEmail:function(){
      console.log("clicou");
      var i,context=this,error=!1;
      if(!this.select_items.length){
        this.modal.open("message","Selecione ao menos um item",!1,!0);
        return !1;
      }

      for(i=0;i<=this.select_items.length;i++){
        if(this.select_items[i]){
          if(i>0 && this.select_items[i].FORN_ID !== context.select_items[i-1].FORN_ID){
            error=!0;
          }
        }
        else{
          if(error){
            context.modal.open("message","Email pode ser enviado para apenas 1 fornecedor",!1,!0);
            return !1;
          }
          else{
            this.callService("email_fornecedor","<FEIR_COD></FEIR_COD>","<FORN_ID>"+this.select_items[0].FORN_ID+"</FORN_ID>",'<LINHA_I>'+'1'+'</LINHA_I>','<LINHA_F>'+'20'+'</LINHA_F>','<CREATE_DATE_I>2010-04-10</CREATE_DATE_I>','<CREATE_DATE_F>2050-04-10</CREATE_DATE_F>');
          }
        } 
      }
      //alert("Enviar email para: "+this.select_items.join(" , "));
    },
    sendEmailGo:function(item){
      var i,j,length,amos_code=[],amos_id=[],counter,any_principal=!0,email="",context=this;

      length=item[0].CONTACTS.length;
      if(!length){
        this.modal.open("message","O Fornecedor não possui contatos cadastrados",!1,!0);
        return !1;
      }
      else{
        for(i=0;i<=length;i++){
          if(item[0].CONTACTS[i]){
            if(item[0].CONTACTS[i].CONT_PRINCIPAL){
              if(item[0].CONTACTS[i].CONT_EMAIL.length){
                email=item[0].CONTACTS[i].CONT_EMAIL;
                any_principal=!1;
              }   
            }
          }
          else{
            for(j=0;j<this.select_items.length;j++){
              amos_code.push(this.select_items[j].AMOS_DESC);
              amos_id.push(this.select_items[j].AMOS_ID);
            }
            if(any_principal){
              //this.modal.open("message","O Fornecedor não possui um contato principal Cadastrado",!1,!0);
                item[0].CONTACTS.forEach(function(element,index){
                  console.log(!email.length);
                  if(element.CONT_EMAIL.length && !email.length){
                    email=element.CONT_EMAIL;

                    console.log("entrou");
                    context.modal.open("template",[context.email,amos_code,amos_id,element.CONT_EMAIL,item,item[0]],!1,!1);
                    return !1;
                  }
                  else{
                    if(!email.length){
                      context.modal.open("message","Os Contatos deste fornecedor não possuem email cadastrado",!1,!0);
                    }
                  }

                });
            }
            else{
              /*for(j=0;j<this.select_items.length;j++){
                amos_code.push(this.select_items[j].AMOS_DESC);
              }*/
              console.log("email para: "+email);
              context.modal.open("template",[context.email,amos_code,amos_id,email,item,item[0]],!1,!1);
            }
          }
        }
      }
    },
    toggleTemplate:function(a){
      console.dir($(".template"+$(a.target).attr("name")));
      if(!$(a.target).hasClass('sel')){
        $(".show-hide").addClass('hide');
        $(".bnote").removeClass('sel');
        $(a.target).addClass('sel');
        $(".template"+$(a.target).attr("name")).removeClass('hide');
      }
      else{
        $(a.target).removeClass('sel');
        $(".show-hide").addClass('hide');
      }
    },
    deleteTemplate:function(a){
      this.callService("gravarTemplate","<TEMP_ID>"+$(a.target).attr('title')+"</TEMP_ID>","<TP_TEMP_ID>"+$(a.target).attr('name')+"</TP_TEMP_ID>","<action>D</action>");
      $(a.target).closest('tr').remove();
    },
    editTemplate:function(a){
      var item,el=$(a.target);
      console.dir(this.data)
      item=this.data.filter(function(a,b){
        if(parseInt(a.TEMP_ID) == parseInt(el.attr("name"))){
          return a;
        }
      });
      this.modal.open("dialog",item);
    },
    filterTemplate:function(ev){
      //console.dir();
      var aux,val;
      val=$(ev.target).find("option:selected").val();
      aux=this.data;
      this.reset();

      if(!val.length){
        console.dir(this.data); 
        this.fdata=aux;
      }
      else{
        this.fdata = aux.filter(function(a,b){
          if(parseInt(a.TP_TEMP_ID) === parseInt(val)){
            return a;
          }
        });
      }
      
      if(!this.fdata.length){
        this.modal.open("message","Nenhum Item Encontrado!!!",!1,!0);
        return !1;
      }
      this.data=aux;
      this.createbox(this.fdata, this.content.page, !0,"list");
      //country=$(".countries").find("option:selected").val();
    },
    newTemplate:function(){
      this.modal.open("dialog","");
    },
    showSubCategories:function(a){
      a.preventDefault();
      if($(a.target).hasClass('actived')){
        $(".category_button").removeClass('actived');
        $(".sub_category").removeClass('maximum');
      }
      else{
        $(".category_button").removeClass('actived');
        $(".sub_category").removeClass('maximum');
        $(a.target).addClass('actived').parent().find(".sub_category").addClass('maximum');
      }

    },
    setCompositions:function(a){
      var length,context=this,l=0,obj;
      if($(a.target).prop("tagName") ===  "SPAN"){
        a.preventDefault();
        obj=$(a.target).parent();
      }
      else{
        obj=$(a.target);
        a.preventDefault();
      }
      length=this.select_items.length;
      if(!length){
        this.modal.open("message","Por favor, selecione ao menos uma amostra para alterar!!!",!1,!0);
        return !1;
      }
      this.setloading(!0,!1);
      if(obj.attr("name") === "COMP"){
        status=setInterval(function(){
          if(l<length){
            var html="";
            context.data.filter(function(elem,index){
              if(elem.AMOS_ID == context.select_items[l].AMOS_ID){
                elem.COMPOSITIONS.push({"COMP_COD":obj.attr("href").replace("#",""),"COMP_DESC":obj.attr("title")})
              }
            });
            $("#"+context.select_items[l].AMOS_ID+" .caption-downside ul").append("<li><a href='#"+obj.attr('href').replace("#","")+"' name='"+context.select_items[l].AMOS_ID+"'>"+obj.attr('title').toUpperCase()+"</a></li>");
            $("#"+context.select_items[l].AMOS_ID+" .caption-downside a").each(function(index, el) {
              html+="<Composition><COMP_COD>"+obj.attr("href").replace("#","")+"</COMP_COD><COMP_OTHERS></COMP_OTHERS><TP_COMP_ID>1</TP_COMP_ID></Composition>";
            });
            context.callService("gravarAmostraComposicao",context.select_items[l].AMOS_ID,html);     
            l++;
          }
          else{
            clearInterval(status);
            context.setloading(!1);
          }
        },200);
      }
      else{
        status=setInterval(function(){
          if(l<length){
            var html="",pattern="";
            if(!$("#"+context.select_items[l].AMOS_ID+" .caption-downside a[href='"+obj.attr('href')+"']").length){
              //Fazer identificar se ja tem um para aquele atributo e remover
              if($("#"+context.select_items[l].AMOS_ID+" .caption-downside a[name='"+obj.attr('name')+"']").length){
                $("#"+context.select_items[l].AMOS_ID+" .caption-downside a[name='"+obj.attr('name')+"']").parent().remove();
              }
              $("#"+context.select_items[l].AMOS_ID+" .caption-downside ul").append("<li><a href='#"+obj.attr('href').replace("#","")+"' name='"+obj.attr('name')+"'>"+obj.attr('title').toUpperCase()+"</a></li>");
              context.data.filter(function(elem,index){
                if(elem.AMOS_ID == context.select_items[l].AMOS_ID){
                  var day,date;
                  date=new Date();
                  if(parseInt(date.getDate())<10){
                    day="0"+date.getDate();
                  }
                  else{
                    day=date.getDate();
                  }
                  date=""+date.getFullYear()+"-0"+(date.getMonth()+1)+"-"+day;
                  //pattern+="<AMOS_ID>"+parseInt(elem.AMOS_ID)+"</AMOS_ID><FORN_ID>"+parseInt(elem.FORN_ID)+"</FORN_ID><FEIR_COD>"+parseInt(elem.FEIR_COD)+"</FEIR_COD><USU_COD>"+parseInt(elem.USU_COD)+"</USU_COD><AMOS_DESC>"+elem.AMOS_DESC+"</AMOS_DESC><AMOS_STATUS>"+elem.AMOS_STATUS+"</AMOS_STATUS><AMOS_ENV_EMAIL>"+elem.AMOS_ENV_EMAIL+"</AMOS_ENV_EMAIL><TECI_COD>"+(elem.TECI_COD || "")+"</TECI_COD><BASE_COD>"+(elem.BASE_COD || "")+"</BASE_COD><GRUP_COD>"+(elem.GRUP_COD || "")+"</GRUP_COD><SUBG_COD>"+(elem.SUBG_COD || "")+"</SUBG_COD><SEGM_COD>"+(elem.SEGM_COD || "")+"</SEGM_COD><FLAG_PRIORIDADE>"+elem.FLAG_PRIORIDADE+"</FLAG_PRIORIDADE><AMOS_HOMOLOGAR>"+elem.AMOS_HOMOLOGAR+"</AMOS_HOMOLOGAR><FLAG_FISICA>"+elem.FLAG_FISICA+"</FLAG_FISICA><CREATE_DATE>"+date+"</CREATE_DATE>";
                  //html+="<AMOS_PRECO>"+elem.AMOS_PRECO+"</AMOS_PRECO><AMOS_LARGURA_TOTAL>"+elem.AMOS_LARGURA_TOTAL+"</AMOS_LARGURA_TOTAL><AMOS_GRAMATURA_M>"+elem.AMOS_GRAMATURA_M+"</AMOS_GRAMATURA_M><AMOS_COTACAO_M>"+elem.AMOS_COTACAO_M+"</AMOS_COTACAO_M><AMOS_COTACAO_KG>"+elem.AMOS_COTACAO_KG+"</AMOS_COTACAO_KG><AMOS_LARGURA_UTIL>"+elem.AMOS_LARGURA_UTIL+"</AMOS_LARGURA_UTIL><AMOS_GRAMATURA_ML>"+elem.AMOS_GRAMATURA_ML+"</AMOS_GRAMATURA_ML><AMOS_ONCAS>"+elem.AMOS_ONCAS+"</AMOS_ONCAS><AMOS_PRECO_UM>"+elem.AMOS_PRECO_UM+"</AMOS_PRECO_UM>";
                  
                  elem[obj.attr("name")]=obj.attr("href").replace("#","");
                  elem[obj.attr("name").replace("_COD","_DESC")]=obj.attr("title");
                  console.dir(elem);
                  pattern+="<AMOS_ID>"+parseInt(elem.AMOS_ID)+"</AMOS_ID><FORN_ID>"+parseInt(elem.FORN_ID)+"</FORN_ID><FEIR_COD>"+parseInt(elem.FEIR_COD)+"</FEIR_COD><USU_COD>"+parseInt(elem.USU_COD)+"</USU_COD><AMOS_DESC>"+elem.AMOS_DESC+"</AMOS_DESC><AMOS_STATUS>"+elem.AMOS_STATUS+"</AMOS_STATUS><AMOS_ENV_EMAIL>"+elem.AMOS_ENV_EMAIL+"</AMOS_ENV_EMAIL><TECI_COD>"+(elem.TECI_COD || "")+"</TECI_COD><BASE_COD>"+(elem.BASE_COD || "")+"</BASE_COD><GRUP_COD>"+(elem.GRUP_COD || "")+"</GRUP_COD><SUBG_COD>"+(elem.SUBG_COD || "")+"</SUBG_COD><SEGM_COD>"+(elem.SEGM_COD || "")+"</SEGM_COD><FLAG_PRIORIDADE>"+elem.FLAG_PRIORIDADE+"</FLAG_PRIORIDADE><AMOS_HOMOLOGAR>"+elem.AMOS_HOMOLOGAR+"</AMOS_HOMOLOGAR><FLAG_FISICA>"+elem.FLAG_FISICA+"</FLAG_FISICA><CREATE_DATE>"+date+"</CREATE_DATE>";
                  html+="<AMOS_DESC>"+elem.AMOS_DESC+"</AMOS_DESC><AMOS_PRECO>"+elem.AMOS_PRECO+"</AMOS_PRECO><AMOS_LARGURA_TOTAL>"+elem.AMOS_LARGURA_TOTAL+"</AMOS_LARGURA_TOTAL><AMOS_GRAMATURA_M>"+elem.AMOS_GRAMATURA_M+"</AMOS_GRAMATURA_M><AMOS_COTACAO_KG>"+elem.AMOS_COTACAO_KG+"</AMOS_COTACAO_KG><AMOS_LARGURA_UTIL>"+elem.AMOS_LARGURA_UTIL+"</AMOS_LARGURA_UTIL><AMOS_GRAMATURA_ML>"+elem.AMOS_GRAMATURA_ML+"</AMOS_GRAMATURA_ML><AMOS_ONCAS>"+elem.AMOS_ONCAS+"</AMOS_ONCAS><AMOS_PRECO_UM>"+elem.AMOS_PRECO_UM+"</AMOS_PRECO_UM>";

                  context.callService("gravarAmostras",pattern,html,"U");
                }
              });
              
            }  
            l++;
          }
          else{
            clearInterval(status);
            context.setloading(!1);
          }
        },200);
      }

      //this.callService("gravarAmostraComposicao","102004997","<Composition><COMP_COD>CL_1</COMP_COD><COMP_OTHERS></COMP_OTHERS><TP_COMP_ID>1</TP_COMP_ID></Composition>");
    },
    setEmailSent:function(a){
      console.dir(a);
      var length,context=this,l=0,obj;
      length=a.length;
      this.setloading(!0,!1);
      status=setInterval(function(){
        if(l<length){
            var html="",pattern="";
            context.data.filter(function(elem,index){
              if(elem.AMOS_ID == a[l]){
                console.dir(elem);
                var day,date;
                date=new Date();
                if(parseInt(date.getDate())<10){
                  day="0"+date.getDate();
                }
                else{
                  day=date.getDate();
                }
                date=""+date.getFullYear()+"-0"+(date.getMonth()+1)+"-"+day;
                $(".bemail[name='"+elem.AMOS_ID+"']").removeClass('disabled');
                pattern+="<AMOS_ID>"+parseInt(elem.AMOS_ID)+"</AMOS_ID><FORN_ID>"+parseInt(elem.FORN_ID)+"</FORN_ID><FEIR_COD>"+parseInt(elem.FEIR_COD)+"</FEIR_COD><USU_COD>"+parseInt(elem.USU_COD)+"</USU_COD><AMOS_DESC>"+elem.AMOS_DESC+"</AMOS_DESC><AMOS_STATUS>"+elem.AMOS_STATUS+"</AMOS_STATUS><AMOS_ENV_EMAIL>1</AMOS_ENV_EMAIL><TECI_COD>"+(elem.TECI_COD || "")+"</TECI_COD><BASE_COD>"+(elem.BASE_COD || "")+"</BASE_COD><GRUP_COD>"+(elem.GRUP_COD || "")+"</GRUP_COD><SUBG_COD>"+(elem.SUBG_COD || "")+"</SUBG_COD><SEGM_COD>"+(elem.SEGM_COD || "")+"</SEGM_COD><FLAG_PRIORIDADE>"+elem.FLAG_PRIORIDADE+"</FLAG_PRIORIDADE><AMOS_HOMOLOGAR>"+elem.AMOS_HOMOLOGAR+"</AMOS_HOMOLOGAR><FLAG_FISICA>"+elem.FLAG_FISICA+"</FLAG_FISICA><CREATE_DATE>"+date+"</CREATE_DATE>";
                html+="<AMOS_DESC>"+elem.AMOS_DESC+"</AMOS_DESC><AMOS_PRECO>"+elem.AMOS_PRECO+"</AMOS_PRECO><AMOS_LARGURA_TOTAL>"+elem.AMOS_LARGURA_TOTAL+"</AMOS_LARGURA_TOTAL><AMOS_GRAMATURA_M>"+elem.AMOS_GRAMATURA_M+"</AMOS_GRAMATURA_M><AMOS_COTACAO_KG>"+elem.AMOS_COTACAO_KG+"</AMOS_COTACAO_KG><AMOS_LARGURA_UTIL>"+elem.AMOS_LARGURA_UTIL+"</AMOS_LARGURA_UTIL><AMOS_GRAMATURA_ML>"+elem.AMOS_GRAMATURA_ML+"</AMOS_GRAMATURA_ML><AMOS_ONCAS>"+elem.AMOS_ONCAS+"</AMOS_ONCAS><AMOS_PRECO_UM>"+elem.AMOS_PRECO_UM+"</AMOS_PRECO_UM>";
                context.callService("gravarAmostras",pattern,html,"U");
              }
            });
          l++;
        }
        else{
          clearInterval(status);
          context.setloading(!1);
        }
      },200);
    },
    toUpperCaseValue:function(a){
      $(a.target).val($(a.target).val().toUpperCase());
    },
    getPage:function(){
      return this.page;
    },
    compChange:function(ev){
      ev.preventDefault();
      var aux,html="",context=this;
      if(typeof ev === "object"){
        var el=$(ev.target);
      }
      else{
        var el=ev;
      }
      aux=el.closest("ul");
      if(aux.find("a").length>1){
        if(!isNaN(parseInt(el.attr("name")))){
          el.parent().remove();
          var items=aux.find("a");
        }
        else{
          var html="",pattern="";
          el.parent().remove();
          context.data.filter(function(elem,index){
            if(elem.AMOS_ID == el.attr("title")){
              var day;
              date=new Date();
              if(parseInt(date.getDate())<10){
                day="0"+date.getDate();
              }
              else{
                day=date.getDate();
              }
              date=""+date.getFullYear()+"-0"+(date.getMonth()+1)+"-"+day;
              
              elem[el.attr("name")]=null;
              elem[el.attr("name").replace("_COD","_DESC")]="";
              pattern+="<AMOS_ID>"+parseInt(elem.AMOS_ID)+"</AMOS_ID><FORN_ID>"+parseInt(elem.FORN_ID)+"</FORN_ID><FEIR_COD>"+parseInt(elem.FEIR_COD)+"</FEIR_COD><USU_COD>"+parseInt(elem.USU_COD)+"</USU_COD><AMOS_DESC>"+elem.AMOS_DESC+"</AMOS_DESC><AMOS_STATUS>"+elem.AMOS_STATUS+"</AMOS_STATUS><AMOS_ENV_EMAIL>"+elem.AMOS_ENV_EMAIL+"</AMOS_ENV_EMAIL><TECI_COD>"+(elem.TECI_COD || "")+"</TECI_COD><BASE_COD>"+(elem.BASE_COD || "")+"</BASE_COD><GRUP_COD>"+(elem.GRUP_COD || "")+"</GRUP_COD><SUBG_COD>"+(elem.SUBG_COD || "")+"</SUBG_COD><SEGM_COD>"+(elem.SEGM_COD || "")+"</SEGM_COD><FLAG_PRIORIDADE>"+elem.FLAG_PRIORIDADE+"</FLAG_PRIORIDADE><AMOS_HOMOLOGAR>"+elem.AMOS_HOMOLOGAR+"</AMOS_HOMOLOGAR><FLAG_FISICA>"+elem.FLAG_FISICA+"</FLAG_FISICA><CREATE_DATE>"+date+"</CREATE_DATE>";
              html+="<AMOS_DESC>"+elem.AMOS_DESC+"</AMOS_DESC><AMOS_PRECO>"+elem.AMOS_PRECO+"</AMOS_PRECO><AMOS_LARGURA_TOTAL>"+elem.AMOS_LARGURA_TOTAL+"</AMOS_LARGURA_TOTAL><AMOS_GRAMATURA_M>"+elem.AMOS_GRAMATURA_M+"</AMOS_GRAMATURA_M><AMOS_COTACAO_KG>"+elem.AMOS_COTACAO_KG+"</AMOS_COTACAO_KG><AMOS_LARGURA_UTIL>"+elem.AMOS_LARGURA_UTIL+"</AMOS_LARGURA_UTIL><AMOS_GRAMATURA_ML>"+elem.AMOS_GRAMATURA_ML+"</AMOS_GRAMATURA_ML><AMOS_ONCAS>"+elem.AMOS_ONCAS+"</AMOS_ONCAS><AMOS_PRECO_UM>"+elem.AMOS_PRECO_UM+"</AMOS_PRECO_UM>";

              context.callService("gravarAmostras",pattern,html,"U");
            }
          });
        }
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
      console.log("mudou feira, RESETOU COOKIE")
      /*this.initialTime='2000-01-01';
      this.endTime='2020-10-10';*/
      //this.scroller=0;
      if(this.page === "fornecedor_cadastro"){
        this.fornecedores.setfair=$(a.target).find("option:selected").val();
        this.notcombo=!1;
        this.submit("<FEIR_COD>"+this.fairval+"</FEIR_COD>",!1,!1,!0);
        return !1;
      }
      this.restartValues();
      $.removeCookie('posscroll', { path: '/' });
      $(".container-fullsize.scroller").scrollTop(0);
      //this.reopenFilter();
      this.itens_by_page=this.itens_page_default;
      this.resetFilters();
      this.bforn.val("");
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
        this.resetFilters();
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
    getSegm:function(){
      return this.segm;
    },
    setSegm:function(a){
      this.segm=a;
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
          //$("html").attr("id",'noscroll');
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
          //$("html").attr("id",'noscroll');
          this.loading = !0;
        } else {
          this.maskEl.fadeOut();
          this.loader.fadeIn();
          //$("html").removeAttr("id");
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
          if(a.AMOS_ID){
            if(a.AMOS_ID == filter){
              itens.push(a);
              itens.push(context.data[b-1]);
              itens.push(context.data[b+1]);
              return itens;
            }
          }
          else{
            if(a.FORN_ID == filter){
              itens.push(a);
              return itens;
            }
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
      z = z || $(".container-fullsize.scroller");
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
            if(e.view === "images"){
              f= $(".viewport").height()-600;
            }
            else{
              f= $("#table").height()-550;
            }

            if(d<f){
              console.log("entrou");
              var scroll={
                "fornval":''+e.fornval,
                "fairval":''+e.fairval,
                "amosval":""+e.amosval,
                "dates":[e.initialTime,e.endTime],
                "prices":e.prices,
                "fstatus":e.fstatus,
                "nsort":e.nsort,
                "view":""+e.view,
                "posscroll":d,
                "total":b
              };
              $.cookie.json = !0;
              e.cookiefair=[];
              e.cookiefair.push(scroll);
              $.cookie("posscroll", scroll, {expires:7, path:"/"});
            }


            console.log(d+" , "+f);
            if (d >= f && b) {
              console.log("chegou");
              e.content.page++;
              e.setloading(!0,!1);
              e.submit("<FEIR_COD>"+(e.fairval || "")+"</FEIR_COD>","<FORN_DESC>"+(e.fornval || "")+"</FORN_DESC>",(e.amosval || ""),!0);
            }
            break;
          case "fornecedores":
            d = z.scrollTop();
            b = e.content.itens.length;
            f= $("#table").height()-680;

            if(d<f){
              console.log("entrou");
              var scroll={
                "fornval":''+e.fornval,
                "fairval":''+e.fairval,
                "amosval":""+e.amosval,
                "dates":[e.initialTime,e.endTime],
                "prices":e.prices,
                "fstatus":e.fstatus,
                "nsort":e.nsort,
                "view":""+e.view,
                "posscroll":d,
                "total":b
              };
              $.cookie.json = !0;
              e.cookiefair=[];
              e.cookiefair.push(scroll);
              $.cookie("posscroll", scroll, {expires:7, path:"/"});
            }
            
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
          case "local":
            d = z.scrollTop();
            b = e.content.itens.length;
            f= $("#table").height()-550;
 
            /*if(d<f){
              console.log("entrou");
              var scroll={
                "fornval":''+e.fornval,
                "fairval":''+e.fairval,
                "amosval":""+e.amosval,
                "dates":[e.initialTime,e.endTime],
                "prices":e.prices,
                "fstatus":e.fstatus,
                "view":""+e.view,
                "nsort":e.nsort,
                "posscroll":d,
                "total":b
              };
              $.cookie.json = !0;
              e.cookiefair=[];
              e.cookiefair.push(scroll);
              $.cookie("posscroll", scroll, {expires:7, path:"/"});
            }*/
            
            if (d >= f && b) {
              console.log("chegou");
              e.content.page++;
              e.setloading(!0,!1);
              e.createbox(e.fair, e.content.page, !1,"list");
              //e.submit("<FEIR_COD>"+(e.fairval || "")+"</FEIR_COD>","<FORN_DESC>"+(e.fornval || "")+"</FORN_DESC>",(e.amosval || ""),!0);
            }
            break;
        }
      });
      /* Act on the event */
    },
    reopenFilter:function(data,page,d,view,haslength){
       console.log("reOpen");
      //this.setloading(!0,!1);
      this.filterisdone=!1;
      $("input[name='initial_date']").datepicker('setDate', this.initialTime.slice(0,4)+'-'+this.initialTime.slice(5, 7)+"-"+this.initialTime.slice(8, 10));
      $("input[name='end_date']").datepicker('setDate', this.endTime.slice(0,4)+'-'+this.endTime.slice(5, 7)+"-"+this.endTime.slice(8, 10));
      
      if(this.prices.length){
        //Fazer o trigger no filtro
        $("input[name='initial_price']").val(this.prices[0]);
        $("input[name='end_price']").val(this.prices[1]);
      }
      console.log(this.fstatus);
      if(this.fstatus !==null){
        $(".status[name='"+this.fstatus+"']").addClass('sel');
      }

      //REOPEN
      console.log(page);
      
      this.Componentfilter(data,page,d,view,haslength);
    },
    reset:function(){
      //console.log("resetou APP");
      this.data = [];
      this.fdata = [];
      this.itens = $([]);
      this.itens.remove();
      this.unable_select=!1;
      this.content.reset();
    },
    restartValues:function(){
      //Var to storage the basic data
      console.log("restartValues");
      this.unable_select=!1;
      this.cookiefair=[];
      this.prices=[];
      this.fstatus=null;
      this.fairval="";
      this.fornval="";
      this.amosval="";
      this.nsort="AMOS_DESC";
      this.initialTime='2000-01-01';
      this.endTime='2020-10-10';
      this.notcombo=0;
      $.removeCookie('posscroll', { path: '/' });
    },
    resetFilters:function(){
      console.log("resetou FILTROS");
      //DATE
      $("input[name='initial_date']").val("");
      $("input[name='end_date']").val("");
      this.initialTime='2000-01-01';
      this.endTime='2020-10-10';

      //PRICE
      $("input[name='initial_price']").val("");
      $("input[name='end_price']").val("");
      this.prices=[];

      this.fstatus=null;
      this.nsort="AMOS_DESC";
    }
  });
  new App;
  Spine.Route.setup();
});