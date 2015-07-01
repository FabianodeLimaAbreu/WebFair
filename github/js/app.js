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
      /*this.loja="";
      this.area="";
      this.father=!0;
      this.searchname="";*/
      this.breadarr = [];
      this.content = new Content({el:this.contentEl, /*bread:this.breadEl, type:this.usr.TIPO*/});
      //this.modal = new Modal({el:this.modalEl});
      //this.detail = new Detail({el:this.detailEl, breadEl:this.breadEl,getloading:this.proxy(this.getloading), setloading:this.proxy(this.setloading),stage:this.proxy(this.stage), body:this.el,getfdata:this.proxy(this.getfdata)});

      this.header.addClass("goDown");
      this.usr = jQuery.parseJSON($.cookie("portal"));
        if(!this.usr)
          window.location.href = 'login.html';
      this.username.text(this.usr.Nome);
      
      this.el.find("#wrap").removeClass("hide");


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
        }
        /*"search/*loja/*area/*code":function(a){
          this.setMenu(a.loja.toUpperCase());
          this.mode = "artigos-pai/"+a.loja+"/"+a.area+"/"+a.code;
          this.loja=a.loja.toUpperCase();
          this.area = a.area;
          this.code = a.code;
          this.searchEl.find(".text").val(this.code).focus();
          this.searchEl.trigger('submit');
        },
        "artigos-pai/*loja/*area/*code":function(a){
          this.reset();
          $(".detail").hide();
          this.setMenu(a.loja.toUpperCase());
          this.mode = "artigos-pai/"+a.loja+"/"+a.area+"/"+a.code;
          this.loja = a.loja.toUpperCase();
          this.area = a.area;
          this.code = a.code;
          this.father=!0;
          $('body').removeClass().addClass('pai');
          this.searchEl.find(".text").val(a.code).focus();
          this.searchEl.trigger('submit');
        },
        "artigos-filho/*loja/*artigo/*code":function(a){
          this.reset();
          $(".detail").hide();

          this.setMenu(a.loja);
          this.code = a.code;
          this.artigo = a.artigo;
          this.loja=a.loja;
          this.father=!1;
          this.mode = "artigos-filho/"+a.loja+"/"+a.artigo+"/"+a.code;
          this.searchEl.find(".text").val(a.code).focus();
          $('body').removeClass().addClass('filho');
          this.searchEl.trigger('submit');
        },
        "detail/*loja/*tipo/*code" : function(a) {
          this.detail.reload(!0,a.loja,a.tipo,a.code);
        },
        "detail/*tipo/*code" : function(a) {
          this.detail.reload(!0,!1,a.tipo, a.code);
        }*/
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
        if(context.page === "amostras"){
          if(typeof context.viewBtn !== "object"){
            context.viewBtn=$(".changeview button");
          }

        }
        //context.reset();
        context.submit(context.page,10,4200000,1,20);
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
    submit:function(name,a,b,c,d){
      var core=this;
      var soapRequest=[
        {
          'name':'amostras',
          'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GetSamples xmlns="http://tempuri.org/"><FEIR_COD>10</FEIR_COD><FORN_ID>4200000</FORN_ID><LINHA_I>1</LINHA_I><LINHA_F>20</LINHA_F></GetSamples></soap:Body></soap:Envelope>'
        },
        {
          'name':'teste',
          'code':'<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ListSamples xmlns="http://tempuri.org/"><FEIR_COD>10</FEIR_COD><FORN_ID>4200000</FORN_ID><LINHA_I>1</LINHA_I><LINHA_F>20</LINHA_F></ListSamples></soap:Body></soap:Envelope>'
        }
      ];
      $.support.cors=true;
      soapRequest.filter(function(a,b){
        if(a['name'] === name){
          $.ajax({
              type: "POST",
              url: nodePath,
              contentType: "text/xml; charset=utf-8",
              dataType: "xml",
              crossDomain: true,
              context: core,
              data: a['code'],
              success: core.convertData,
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
      /*this.setBreadcrumb(a,val);
      this.breadEl.find(".bread-load").text(0);

      if (!this.fdata.length) {        
        return this.modal.open(),this.breadEl.find('.bread-colec a').text("").removeClass('active'),this.setloading(!1), this.searchEl.find('input').blur();
      }  
      
      this.content.page = 0;
      
      b ? (this.data = this.fdata || this.data) : this.fdata = this.data;*/
      this.content.changeview(this.view);
      this.content.create(this.fdata[0]);
      //this.createbox(this.fdata, this.content.page, !0);    
    },
    convertData:function(data, status, req){
      if (status == "success") {
        this.fdata=jQuery.parseJSON($(req.responseXML).text()).sortBy('AMOS_DESC').unique();
        this.setdata(this.fdata);
      }
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

      this.breadEl.find(".bread-total").text(a.length);      
      if (d < a.length && a[k]) {
          f = setInterval(function() {
              h = a[k];              
              if (!h) {
                  clearInterval(f);
                  e.endloading();
                  return !1;
              }
              if ("images" === c && l > 0) {
                  if (h && v === h.MATNR)
                    return !1;

                  v = h.MATNR || null;                  
                  var material = h.MATERIAL_REF.replace(' ','');

                  p = new Image, q = "http://189.126.197.169/img/small/small_" + material + ".jpg", $(p).load(function() {
                      if (!l > 0)
                          return !1;
                      g = new Box({
                          item : h,
                          view : c,
                          tag : n,
                          // reloadcart : e.proxy(e.reloadcart),
                          detail : e.detail,
                          url : this,
                          pai : "PAI"
                      });

                      e.active.create(g.render());
                      // Mostrando (box sendo carregados)
                      $('.bread-box').find(".bread-load").text(k+1);

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
                      l--;
                      k++;
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
      b.active.tbody.find("tr").removeClass('odd').filter(":odd").addClass("odd");
      b.active.tbody.find("input").parent().addClass("ajust");
      b.active.itens.fadeIn(function() {
          b.getloading(!1);
      });            
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