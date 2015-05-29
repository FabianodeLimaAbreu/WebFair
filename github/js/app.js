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
require(["methods","sp/min"/*, "app/content", "app/detail"*/], function() {
  /**
  * Main application class, responsible for all main funcionalities and call anothers classes constructors
  * @exports App
  * @constructor
  */
  window.App = Spine.Controller.sub({
    el:$("body"),
    elements: {
      /*".container":"container",
      "#toggle-menu a":"menuopt",
      "#wrap .mask":"maskEl",
      ".search":"searchEl",
      ".right-list button":"viewBtn",
      "button.close":"closeBtn",
      ".login-name":"username",
      ".table-container":"viewList",
      ".viewport":"viewImage",
      ".content":"contentEl",
      ".bread-box":"breadEl",
      "#modal" : "modalEl",
      ".detail":"detailEl"*/
    },

    events: {      
      /*"click .right-list button":"changeview",
      "submit .search":"submit",
      "click button.icon.go_back_default":"goBack",
      "click button.close":"getOut"*/
    },
    init:function(){
      this.view = "images";
      this.mode = "artigos-pai";
      this.itens = $([]);
      this.data=[];
      this.fdata = [];
      this.loja="";
      this.area="";
      this.father=!0;
      this.searchname="";
      this.breadarr = [];
      //this.content = new Content({el:this.contentEl});
      //this.modal = new Modal({el:this.modalEl});
      //this.detail = new Detail({el:this.detailEl, breadEl:this.breadEl,getloading:this.proxy(this.getloading), setloading:this.proxy(this.setloading),stage:this.proxy(this.stage), body:this.el,getfdata:this.proxy(this.getfdata)});

      this.usr = jQuery.parseJSON($.cookie("portal"));
        /*if(!this.usr)
          window.location.href = 'login.html';
      this.username.text(this.usr.Nome);*/
      
      this.el.find("#wrap").removeClass("hide");


      // this.spotlight = new Spotlight({el:this.spotEl});
      this.routes({
        "":function() {
          //alert("vazio");
          //this.menuopt.eq(0).trigger("click");
        },
        "search/*loja/*area/*code":function(a){
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
      if (this.loading){
        return !1;
      }            
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
    submit:function(e){
      var _type, path;
      e.preventDefault();
      var val=$(e.target).find(".text").val();
      /*This part of code deal with hash value and search form values, for exemplo
        User came from home with a loja=verao and a search=Tule, then its hash is http://institucionalteste/briefing/app.html#search/verao/tule
        Then, this same user do a search with form search by Renda, the app do a request for rendas but hash continue ..verao/tule, didn't change to /renda
        Then this part verify if hash's value is igual form value, if it isn't change reload hash's value*/                  
        
      if(-1 !== this.mode.indexOf(val)){
        this.navigate(this.mode, !1);
      }
      else{
        this.mode="artigos-pai/"+this.loja+"/"+this.area+"/"+val;
        this.navigate(this.mode, !1);
      }
      if (this.getloading() || !val) {
        return!1;
      }


      
      $('body').hasClass('pai') ? _type = "Briefing/"+this.loja+"/"+this.area+"/"+val : _type = "BriefingZwte/"+this.loja+"/"+this.code;
      if(this.searchname === _type){
        this.setdata(this.fdata);
      }
      else{
        this.searchname=_type;

        $.getJSON( nodePath + "service=SearchMaterial.svc/" + _type + "?callback=?", this.proxy(this.setdata)).fail(function() {
          return!1;
        }); 

      }
            
      return this.setloading(!0), !1;
    },
    setdata:function(a,b){      
      var val = this.searchEl.find(".text").val();
      this.setBreadcrumb(a,val);
      this.fdata = a.sortBy("MAKTX").unique();
      this.breadEl.find(".bread-load").text(0);

      if (!this.fdata.length) {        
        return this.modal.open(),this.breadEl.find('.bread-colec a').text("").removeClass('active'),this.setloading(!1), this.searchEl.find('input').blur();
      }  
      
      this.content.page = 0;
      
      b ? (this.data = this.fdata || this.data) : this.fdata = this.data;
      this.content.changeview(this.view);
      this.createbox(this.fdata, this.content.page, !0);      
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
      //this.fdata = [];
      this.itens.remove();
      this.itens = $([]);
    }
  });
  new App;
  Spine.Route.setup();
});