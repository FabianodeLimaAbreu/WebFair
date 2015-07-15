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
require(["methods","sp/min", "app/content"/*, "app/detail"*/], function() {
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
      ".spotlight":"spotEl",
      "#wrap .mask":"maskEl",
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
      "click .bsel":"selectItems",
      "click .btrash-big":'deleteNote',
      "click .bfav":'actionHeart',
      "click .bfisica":'actionFlag',
      "click .bhomologado":'actionHomolog',
      "change .countries": "changeCountries",
      "keyup .forn": "getSpot",
      "change .fair":"changeFair"
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
      this.callback=null;
      this.bfair;
      this.bforn;

      //Var to storage the basic data
      this.fair=[];
      this.cities=[];
      this.forn=[];
      this.fairval=0;



      /*this.loja="";
      this.area="";
      this.father=!0;
      this.searchname="";*/
      this.breadarr = [];
      this.content = new Content({el:this.contentEl, /*bread:this.breadEl, type:this.usr.TIPO*/});
      //this.spotlight = new Spotlight({el: this.spotEl});
      //this.modal = new Modal({el:this.modalEl});
      //this.detail = new Detail({el:this.detailEl, breadEl:this.breadEl,getloading:this.proxy(this.getloading), setloading:this.proxy(this.setloading),stage:this.proxy(this.stage), body:this.el,getfdata:this.proxy(this.getfdata)});

      this.header.addClass("goDown");
      this.usr = jQuery.parseJSON($.cookie("portal"));
        if(!this.usr)
          window.location.href = 'login.html';
      this.username.text(this.usr.Nome);
      
      this.el.find("#wrap").removeClass("hide");

      if(!this.fair.length){
        this.callService("local",'<FEIR_COD></FEIR_COD>','<PAIS_COD></PAIS_COD>','<REGI_COD></REGI_COD>');
      }
      /*if(!this.forn.length){
        this.callService("fornecedores",'<FEIR_COD></FEIR_COD>','<PAIS_COD></PAIS_COD>','<REGI_COD></REGI_COD>');
      }*/
      // this.spotlight = new Spotlight({el:this.spotEl});
      this.routes({
        "":function() {
          this.menuopt.eq(3)[0].click();
        },
        "amostras":function(){
          var context=this;
          this.page ="amostras";
          this.writePage(this.page);
        },
        "fornecedor":function(){
          var context=this;
          this.page ="fornecedor";
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
          this.writePage(this.page);
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
        "detail/*code" : function(a) {
          alert(a.code);
          //this.detail.reload(a.code);
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
        var grupo = this.fdata[0].GRUPO;
        var area = this.fdata[0].TYPE_MAT;
        this.navigate && this.navigate("artigos-pai", this.loja,area,grupo,!0);        
      }       

    },
    writePage:function(hash,callback){
      var context=this;
      $("html").attr("class","").addClass(hash);
      this.container.load("pages/"+hash+".html",function( response, status, xhr){
        switch(context.page){
          case "amostras":
            context.viewBtn=$(".changeview button");
            context.order_box=$(".tooltip.borderby");
            context.bfair=$(".fair");
            context.bforn=$(".forn");
            context.createComponent(context.fair,context.bfair,'fair');
            //context.callService("fornecedores",'<FORN_DESC></FORN_DESC>','<FEIR_COD></FEIR_COD>','<CREATE_DATE_I>1900-10-17</CREATE_DATE_I>','<CREATE_DATE_F>2020-10-17</CREATE_DATE_F>',20);
            //context.callService(context.page,"<FEIR_COD>10</FEIR_COD>","<FORN_ID>4200000</FORN_ID>",1,20);
            break;
          case "fornecedor":
            context.bfair=$(".fair");
            context.createComponent(context.fair,context.bfair,'fair');
            //console.dir(context.fair);
            break;
          case "local":
            context.bcity=$(".city");
            context.callService(context.page,"<FEIR_COD></FEIR_COD>","<PAIS_COD>BR</PAIS_COD>","<REGI_COD>SP</REGI_COD>");
            break;
          default:
            alert("dssda");
        }

        //context.reset();
      });
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
      a.hasClass("sel") || (this.viewBtn.removeClass("sel"), a.addClass("sel"), this.view = a.attr('alt'), this.setdata(this.fdata));
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
    callService:function(name,a,b,c,d,e){
      var core=this;
      var soapRequest=[
        {
          //FEIR_COD e FORN_ID are optional fields
          'name':'amostras',
          'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ListarAmostras xmlns="http://tempuri.org/">'+a+''+b+'<LINHA_I>1</LINHA_I><LINHA_F>20</LINHA_F></ListarAmostras></soap:Body></soap:Envelope>',
          callback:function(data,req){
            core.convertData(data,req,name);
          }
        },
        {
          'name':'delete',
          'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GravarAnotacao xmlns="http://tempuri.org/"><note><NOTA_ID>'+a+'</NOTA_ID><USU_COD>'+b+'</USU_COD><PLAT_ID>2</PLAT_ID><CREATE_DATE>2016-07-08</CREATE_DATE></note><action>D</action></GravarAnotacao></soap:Body></soap:Envelope>',
          'callback':null
        },
        {
          'name':'local',
          'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ListarFeiras xmlns="http://tempuri.org/">'+a+''+b+''+c+'</ListarFeiras></soap:Body></soap:Envelope>',
          callback:function(data,req){
            core.convertData(data,req,name);
          }
        },
        {
          'name':'fornecedores',
          'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ListarFornecedores xmlns="http://tempuri.org/">'+a+''+b+''+c+''+d+'<LINHA_I>1</LINHA_I><LINHA_F>'+e+'</LINHA_F></ListarFornecedores></soap:Body></soap:Envelope>',
          callback:function(data,req){
            core.convertData(data,req,name);
          }
        },
        {
          'name':'cities',
          'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ListarRegioes xmlns="http://tempuri.org/">'+a+''+b+''+c+''+d+'</ListarRegioes></soap:Body></soap:Envelope>',
          callback:function(data,req){
            core.convertData(data,req,name);
          }
        }
      ];

      $.support.cors=true;
      soapRequest.filter(function(a,b){
        if(a['name'] === name){
          core.callback=a['callback'];
          $.ajax({
              type: "POST",
              url: nodePath,
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
    processError:function(data, status, req){
      console.log("DEU ERRO");
    },
    setdata:function(a,b){   
      var val = $(".form-control-search").val("ddssa");
      this.content.changeview(this.view);
      this.fdata = a.sortBy("MAKTX").unique();
      this.content.page = 0;
      //console.dir(this.fdata);
      /*this.setBreadcrumb(a,val);
      this.breadEl.find(".bread-load").text(0);

      if (!this.fdata.length) {        
        return this.modal.open(),this.breadEl.find('.bread-colec a').text("").removeClass('active'),this.setloading(!1), this.searchEl.find('input').blur();
      }  
      
      this.content.page = 0;
      
      b ? (this.data = this.fdata || this.data) : this.fdata = this.data;*/
      this.content.changeview(this.view);
      //this.content.create(this.fdata[0]);
      this.createbox(this.fdata, this.content.page, !0);    
    },
    callRequest:function(data, status, req){
      if (status == "success") {
        if(this.callback && "function" === typeof this.callback){
          this.callback(data,req);
        }
      }
    },
    convertData:function(data,req,what){
      switch(what){
        case "amostras":
          this.fdata=jQuery.parseJSON($(req.responseXML).text()).sortBy('AMOS_DESC').unique();
          this.setdata(this.fdata);
          break;
        case "local":
          this.fair=jQuery.parseJSON($(req.responseXML).text()).sortBy('FEIR_DESC').unique();
          
          break;
        case "fornecedores":
          this.forn=jQuery.parseJSON($(req.responseXML).text()).sortBy('FORN_DESC').unique();
          this.createComponent(this.forn,this.bforn,what);
          break;
        case "cities":
          this.cities=jQuery.parseJSON($(req.responseXML).text());//.sortBy('FEIR_DESC').unique();
          this.createComponent(this.cities,this.bcity,what);
          break;
        default:
      }
    },
    createComponent:function(data,comp,what){
      console.dir(data);
      var i,html="";
      switch (what){
        case "fair":
          html+="<option value='0'>Local de Coleta: </option>";
          for(i=0;i<data.length;i++){
            html+="<option value='"+data[i].FEIR_COD.replace("         ","").replace("        ","")+"'>"+data[i].FEIR_DESC+"</option>";
          }
          break;
        case "fornecedores":
          html+="<option value='Local'>Fornecedores: </option>";
          for(i=0;i<data.length;i++){
            html+="<option value='"+data[i].FORN_ID+"'>"+data[i].FORN_DESC+"</option>";
          }
          break;
        case "cities":
          comp.empty();
          html+="<option value='Local'>Cidades: </option>";
          for(i=0;i<data.length;i++){
            html+="<option value='"+data[i].REGI_COD+"'>"+data[i].REGI_DESC+"</option>";
          }
      }
      comp.html(html);
    },
    createbox : function(a, b, d, c) {  
      var f, m, g, n, v;      
      c = c || this.view;
      n = "images" === c ? "li" : "tr";
      this.loading = !0; 
      this.maskEl.fadeIn().find(".loader").show();
      this.active = this.active || this.content;
      d = this.active.itens && !d ? this.active.itens.length : 0;
      m = 300 * (b + 1) < a.length ? 300 * (b + 1) : a.length;
      var p, h, q, k = 300 * b, l = m - k, e = this;
      if (d < a.length && a[k]) {
          f = setInterval(function() {
              h = a[k];   
              if (!h) {
                  clearInterval(f);
                  e.endloading();
                  return !1;
              }
              if ("images" === c && l > 0) {
                  if (h && v === h.AMOS_ID)
                    return !1;

                  v = h.AMOS_ID || null; 
                  //console.dir(h);   
                  //var material = h.MATERIAL_REF.replace(' ','');
                  p = new Image, q = "http://189.126.197.169/img/small/small_P11JF0157306705.jpg", $(p).load(function() {
                      if (!l > 0)
                          return !1;
                      g = new Box({
                          item : h,
                          view : c,
                          tag : n,
                          // reloadcart : e.proxy(e.reloadcart),
                          detail : e.detail,
                          url : this
                      });

                      e.active.create(g.render());

                      // Mostrando (box sendo carregados)
                      $('.bread-search').find(".spec").text(k+1+" Amostras");

                      l--;
                      k++;
                  }).error(function() {

                      if (!l > 0)
                          return !1;
                      var a = new Image;
                      //console.log('Sem imagem: *' + h.MATNR + " " + h.MAKTX + " " + h.GRUPO + " " + h.SGRUPO);
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
                  }).attr("src", q);
              } else {
                  if (l > 0) {
                      return g = new Box({
                          item : h,
                          view : c,
                          tag : n,
                          // reloadcart : e.proxy(e.reloadcart),
                          detail : e.detail,
                          modal : e.modal
                      }), e.active.create(g.render()), $('.bread-box').find(".bread-load").text(k+1), l--, k++, !1;
                  } else {
                      clearInterval(f), e.endloading();
                  }
              }
          }, 0.1);
      } else {
          return this.endloading(), !1;
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
    this.content.reset();
    this.order_box.find("button").removeClass("sel");
    $(a.target).addClass("sel");
    if(type !== "BIGPRICE"){
      length= this.fdata.length;
      temp = this.fdata.sortBy(type).unique();
      this.createbox(temp, this.content.page);
    }
    else{
      temp = this.fdata.sortBy("PE").unique();
      length=this.fdata.length-1;
      for(i=length;i>=0;i--){
        temp.push(this.fdata[i]);
      }
      this.createbox(temp.unique(), this.content.page);
    }
  },
  selectItems : function(a){
    $(".thumbnail .icon").attr("class","icon").addClass($(a.target).attr("name"));
    $("html").attr("class","amostras").addClass("select");
  },
  changeCountries: function(a){
    this.callService("cities",'<PAIS_COD>'+$(a.target).find("option:selected").val()+'</PAIS_COD>','<PAIS_DESC></PAIS_DESC>','<REGI_COD></REGI_COD>','<REGI_DESC></REGI_DESC>');
  },
  changeFair:function(a){
    this.fairval=$(a.target).find("option:selected").val();
  },
  getSpot:function(a){
    //13 === a.keyCode ? (this.spotlight.close(), this.searchEl.trigger("submit")) : (this.filter.close(), 1 < a.target.value.length ? this.spotlight.open(a) : this.spotlight.close());
    return !1;
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
          this.loading = !0;
        } else {
          this.maskEl.fadeOut();
          this.loading = !1;
        }
      } else {
        if (a) {
          this.loader.fadeOut();
          this.maskEl.fadeIn();
          this.loading = !0;
        } else {
          this.maskEl.fadeOut();
          this.loader.fadeIn();
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
    getfdata:function(){
      return this.fdata;
    },
    reset:function(){
      //this.data = [];
      //this.fdata = [];
      /*this.itens = $([]);
      this.itens.remove();*/
      this.content.reset();
    }
  });
  new App;
  Spine.Route.setup();
});