/**
*@fileOverview Detail and Menu's class.
* @module Menu
* @module Detail
*
*/

/**
* Menu's class and actions
* @exports Menu
* @constructor
*/
window.Menu = Spine.Controller.sub({elements:{"li a":"buttons"}, events:{"click a":"action"}, action:function(a) {
  if("object" === typeof a) {
    a.preventDefault();
  }else {
    return!1;
  }
  var b = $(a.target).attr("href") || $(a.target).parent().attr("href");  
  b = b.split("#")[1];
  switch(b) {
    case "tutorial":
      this.opentutorial();
      break;
    case "logout":
      this.logout();
      break;
    default:
      alert(b);
  }
  this.close();
}, 

/**
* `OK Set thed loading state`
* @memberOf Menu#
* @param {Boolean} a. If true show mask, else hide mask.
*/  
close:function(a) {
  if(a && (a.preventDefault(), a = $(a.target), this.el.find(a).length)) {
    return!1;
  }
  this.el.offset({top:0, left:0});
  this.doc.unbind("click");
  this.el.hide();
  
  
        
  return!1;
}, open:function(a) {
  this.el.offset({top:a.pageY, left:a.pageX}).show();
  this.doc.unbind("click").bind("click", this.proxy(this.close));
}, init:function() {  
  this.doc = $(document);  
  // this.el.disableSelection && this.el.disableSelection();
}});

/**
* Details's class and actions
* @exports Detail
* @constructor
*/
window.Detail = Spine.Controller.sub({
elements:{
  ".title":"title",
  ".info-text dd":"toplist",
  ".info-back":"infoback",
  ".info-box":"infobox",
  ".util":"util",
  //".bcolor":"colorbt",
  ".bsku":"skubt",
  ".brapport":"rapportbt",
  ".slides-container":"slides_container",
  ".bsku":"bsku",
  ".blavado":"blavado",
  ".bficha":"bficha",
  ".bcostura":"bcostura",
  ".bformas":"bformas",
  ".info-side":"infoside",
  ".close-bar":"closebar",
  ".info-list": "infolist",
  ".warn":"warn",
  ".similar":"similar",
  ".date":"date",
  ".close-bar span":"closebar"
  //".color-list":"colorlist"
}, events:{
   "click .bsku":"sku",
   //"click .bcolor":"color",
   "click .brapport":"rapport",
   "click .bformas":"formas",
   "click .color-thumb":"reload",
   "click .go_back":"close",
   "click .benviar":"enviar",
   "click .close-bar":"openbar"
},close:function(a) {
  this.el.hide();
  
  "object" === typeof a && a.preventDefault();
  this.on = !1;
  this.colors=[];
  this.el.fadeOut();
  if(this.father){
    this.navigate && this.navigate("artigos-pai", this.item.STORE,this.item.TYPE_MAT,this.item.GRUPO,!0);
    // window.location.hash = "artigos-pai/"+this.item.STORE+"/"+this.item.TYPE_MAT+"/"+this.item.GRUPO;
  }
  else{
    window.history.go(-1);
  }
  $(window).scrollTop(this.scrollp);
  this.infobox.css({right:-520}); //Return the bar to its initial position
  // $('.content .viewport').show();
  return!1;
}, 
/**
* `OK Set thed loading state`
* @memberOf Detail#
* @param {Boolean} a. If true show mask, else hide mask.
*/
open: function(a){
  
  "use strict";
  // console.log("ENTROU DETALHE");
  $(".view-form").load("slider_template.html");
  // $(".table-container").fadeOut();
  // $(".viewport").fadeOut();
  $(".table-container").hide();
  $(".viewport").hide();
  

  var b,image,rendimento,data;
  this.item = $.isArray(a) ? a[0] : a;
  if(!this.item){
    return !1;
  }
  if(!this.father){
    ga('send', 'pageview', '/detail/'+this.item.STORE+"/"+this.tipo+"/"+this.item.MATNR);
    this.navigate && this.navigate("detail", this.tipo,this.item.MATNR, !1);
  }
  else{
    ga('send', 'pageview', '/detail/'+this.item.STORE+"/"+this.item.TYPE_MAT+"/"+this.item.MATNR);
    //console.log('/detail/'+this.tipo+"/"+this.item.MATNR);
  }
  this.writebread();
  this.el.find('.rend').hide();
  this.body.removeAttr("class");

  rendimento = this.item.RENDIMENTO.replace(/\s+/g, '') || 0;
  (rendimento > 0) && this.el.find('.rend').show();
  
  // Tratamento das informações do produto
  var pilling, char, caracteristicas;
  
  // Pilling
  pilling = this.item.PILLING.toString().replace(".",",");
  if(pilling=="0"){
    pilling="Não tem";
  }
  // Características
  caracteristicas = this.item.CARACTERISTICAS.toLowerCase();
  char = caracteristicas[0].toUpperCase() + caracteristicas.substring(1);
  
// alert(this.item.ETIQUETA)  
  if(this.father){
    this.body.addClass("pai").addClass("detail-page");
    data = [this.item.MATERIAL_REF, this.cmplist(), this.item.GRAMATURA_M + " g/m² ", this.item.GRAMATURA_ML + " g/m ",parseFloat(this.item.LARGURA_UTIL) + "m ", parseFloat(this.item.LARGURA_TOTAL) + "m ",this.item.ELASTICIDADE, pilling, rendimento + " m/Kg ", this.item.GRUPO, this.item.SGRUPO, this.item.EBOOK_CODE + " / " + this.item.EBOOK_PAGE,this.item.UNIDADE_MEDIDA,  this.item.UNIDADE_MEDIDA /*PE*/, " " + this.item.UNIDADE_MEDIDA /*atc*/, "DATA","PREÇO",this.item.TextoSD,this.item.ETIQUETA, this.item.UTILIZACAO,this.item.ATRIBUTOS.initialCaps(), char];
    //this.rapportlist(this.item.MATERIAL_REF);
  }
  else{
    this.body.addClass("filho").addClass("detail-page");
    data = [this.item.MATERIAL_REF, this.cmplist(), this.item.GRAMATURA_M + " g/m² ", this.item.GRAMATURA_ML + " g/m ",parseFloat(this.item.LARGURA_UTIL) + "m ", parseFloat(this.item.LARGURA_TOTAL) + "m ", this.item.ELASTICIDADE, pilling , rendimento + " m/Kg ", this.item.GRUPO, this.item.SGRUPO, this.item.EBOOK_CODE + " / " + this.item.EBOOK_PAGE,this.item.UNIDADE_MEDIDA,  " " +parseInt(this.item.PE), " " + parseInt(this.item.ATC), this.item.DATA_CHEGADA,"R$ "+numDecimal(this.item.PRECO.toString().replace(".",","))+" | $ "+numDecimal(this.item.PRECO_DOLAR.toString().replace(".",",")),this.item.TextoSD,this.item.ETIQUETA, this.item.UTILIZACAO,this.item.ATRIBUTOS.initialCaps(), char];
    //this.rapportlist(this.item.MATNR);
    //this.getcolorlist(this.item.MATNR);
    this.lavadolist(this.item.MATNR);
    this.fichalist(this.item.MATNR);
  }
  this.rapportlist(this.item.MATERIAL_REF);
  this.utillist();
  this.size();
  // console.dir(this.item);
  this.getPdfPaths(this.item.MATNR); //Costurabilidade
  this.GetImgPaths(this.item.MATNR); //Formas
  window.scroll(0, 0);
  image = "http://189.126.197.169/img/large/large_" + this.item.MATERIAL_REF + ".jpg";
  this.title.text(this.item.MAKTX);
  for(var c = 0;c < this.toplist.length;c++) {
    b = data[c] && " " !== data[c] ? data[c] : "N\u00e3o tem", this.toplist.eq(c).text(b);
  }
  this.warning();
  this.getsimilaridade(this.item.MATNR);
  this.convertData(this.item.DATA_CHEGADA);
  this.infoback.fadeOut(function() {
    //fadeOut the infoback and fadein it with another img init
     var p,q,context=$(this);
      p=new Image, q = image, $(p).load(function() {

          context.find(".image_detail").html("<img src='"+image+"'/>");
          context.fadeIn("slow"); 
      }).error(function(){
          //If don't find the image
          //context.html("<img src='http://189.126.197.169/img/large/large_P21NL0055307414.jpg' />").fadeIn("slow");
          context.html("<img src='http://189.126.197.169/img/large/large_NONE.jpg' />").fadeIn("slow");
      }).attr("src", q);
  });
  /*-1 !== this.item.SGRUPO.indexOf("Estampado") && (this.colorbt.addClass("disable"), this.el.find('.info-color').hide());*/
  if(this.on){
    //this.colorbt.removeClass("sel");
  }
  //this.on || this.colorbt.removeClass("sel");
  this.el.fadeIn();
}, writebread:function(){
  var href,text;
  if(this.breadEl.find(".bread-colec a").text()){
     this.breadEl.find(".bread-colec a").removeClass("active").attr("href","javascript:history.go(-1)");
  }
  else{
    if(this.father){
      href="#artigos-pai"+"/"+this.item.STORE+"/"+this.item.TYPE_MAT+"/"+this.item.GRUPO;
      text=this.item.DESC_STORE;
      this.breadEl.find(".bread-colec a").text(text+" - "+this.item.TYPE_MAT+' - '+this.item.GRUPO).attr("href",""+href);
    }
    else{
      href="#artigos-filho";
      text=this.tipo;
      this.breadEl.find(".bread-colec a").text(this.item.TYPE_MAT+' - '+this.item.GRUPO+' - '+text).attr("href",""+href+"/"+text+"/"+this.item.MATNR);
    }
    //

    //this.item.DESC_STORE+' - '+this.item.TYPE_MAT+' - '+this.item.GRUPO
  }
  this.breadEl.find(".bread-artigo a").text(this.item.MAKTX).addClass("active");
},// link para SKU
  sku:function(a) {
    window.location.hash="artigos-filho/"+this.item.STORE+"/"+this.item.MAKTX+"/"+this.item.MATNR;
    return!1;
},openbar:function(){
  var a,d=this;
  a=parseInt(this.infobox.css("right")); //Take the right position of infobox

  if(this.el.hasClass("large") && a === 0){
    //In large resolutions the bar don't close all
    this.infobox.animate({right:-520}, 400, function(){
      d.closebar.toggleClass("arrow-close");
    });
  }
  else{
    //In small resolutions
  }

  this.bformas.removeClass("sel");
  this.rapportbt.removeClass("sel");
},utillist:function() {
  "use strict";
  var context=this;
  if(" " === this.item.UTILIZACAO) {
    return!1;
  }
  // console.log("http://189.126.197.163/node/server/" + "index.js?service=SearchMaterial.svc/util&query="+ this.item.UTILIZACAO+"?callback=?");
  var nodePath2 = "http://189.126.197.169/node/server/index.js?"
  $.getJSON( nodePath2 + "service=SearchMaterial.svc/util/&query="+ this.item.UTILIZACAO+"?callback=?", this.proxy(function(a) {
    context.util.text(a.capitalize() + ".");
  }));

  // $.getJSON("http://189.126.197.163/node/server/" + "index.js?service=SearchMaterial.svc/util&query="+ this.item.UTILIZACAO+"?callback=?", this.proxy(function(a) {
  //   context.util.text(a.capitalize() + ".");
  // }));
},warning:function(){
  "use strict";
  if(this.item.TEXTOSD === ""){
    this.warn.text("Sem recomendações adicionais.");
  }
},convertData:function(data){
  //date
  var aData   = data;
  var Data    = convertDate(aData);
  
  if(Data=="00/00/000"){
    Data="Não disponível"
  }
  this.date.text(Data);

},getsimilaridade:function(a){
  var obj,i,length,c=[],context=this;
  if(" " === this.item.UTILIZACAO) {
    return!1;
  }
  //M11ML0049
  
  $.getJSON( nodePath + "service=SearchMaterial.svc/GetSimilaridade/"+a+"?callback=?", this.proxy(function(a) {

  // $.getJSON("http://was-dev/Focus24/Services/SearchMaterial.svc/GetSimilaridade/"+a+"?callback=?", this.proxy(function(a) {
    obj=JSON.parse(a);
    length=obj.length;
    console.dir(a);
    if(length){
      for(i=0;i<length;i++){
        c.push( "<b>Nome:</b> "+obj[i].MAKTX+" | <b>Código:</b> "+obj[i].MATNR+" | <b>Tipo:</b> "+obj[i].TIPO);
      }
      context.similar.html("<br/>"+c.join("<br/>"));
    }
    else{
      context.similar.text("Não tem.");
    }
  }));
},enviar:function(){
  /*if(!this.bformas.hasClass("sel")){
    this.bformas.trigger("click");
  }  */
  //window.open('print.html#detail/I15/Jeanswear/P21JF0174','_blank');
  window.print();
},formas:function(a){
  "use strict"
  if("object" === typeof a) {
    a.preventDefault(), a = $(a.target);
  }else {
    return!1;
  }
  if(a.hasClass("disable")) {    
    return!1;
  }
  var b, d = this, c = [], e;
  this.on = !0;
  b = this.item.MATNR.slice(0, -6);
  d.el.find('.info-rapport').hide();
  //d.el.find('.info-color').hide();
  d.el.removeClass("rapport").find('.info-form').show();
  //d.colorlist.show();

 this.animateDetail(a);
},color:function(a) {
  if("object" === typeof a) {
    a.preventDefault(), a = $(a.target);
  }else {
    return!1;
  }
  if(a.hasClass("disable")) {
    return!1;
  }
  var b, d = this, c = [], e;
  this.on = !0;
  b = this.item.MATNR.slice(0, -6);
  d.el.find('.info-rapport').hide();
  d.el.removeClass("rapport").find('.info-form').hide();
  //d.el.find('.info-color').show();
  d.colorlist.show();

  this.animateDetail(a);
}, rapport:function(a) {
  if("object" === typeof a) {
    a.preventDefault(), a = $(a.target);
  }else {
    return!1;
  }
  if(a.hasClass("disable")) {
    return!1;
  }
  var b, d = this, c = [];
  this.on = !0;
  //this.el.find('.info-color').hide();
  this.el.find('.info-form').hide();
  this.el.addClass("rapport").find('.info-rapport').show();
  //this.colorbt.removeClass("sel");

  this.animateDetail(a);
}, animateDetail:function(a){
  //Responsavel pela animação responsiva na tela de detalhes
  var b,d=this
  
  d.infolist.find('.sel').removeClass('sel');
  if(this.el.hasClass("large")){
    b=parseInt(this.infobox.css("right"));
    b !== 0 && a.addClass("sel");
    this.infobox.animate({right:-520 === b ? 0 : -520}, 400, function(){
      d.closebar.toggleClass("arrow-close");
    });
  }
  else{
    b=parseInt(this.infoside.css("right"));
    b !== 0 && a.addClass("sel");
    this.infoside.animate({right:-270 === b ? 0 : -270}, 400);
    //this.infobox.animate({right:-520 === b ? 0 : -520}, 400);
  } 
},size:function() {
  "use strict";
  if(this.stage().w>=1200){
    this.el.addClass("large"); //To larg resolutions
    this.infobox.css("right","-520px"); //0
  }
  else{
    this.infobox.css("right","0");
  }
}, reset: {

},cmplist:function() {
  "use strict";
  for(var a = [], b = 1;7 > b;b++) {
    this.item["CMP" + b] && a.push(this.item["PERCENT" + b] + "% " + this.item["CMP" + b].capitalize());
  }
  return a.join(", ");
}, getPdfPaths:function(a){
  this.bcostura.removeClass('sel').addClass("disable");

  $.getJSON( nodePath + "service=SearchMaterial.svc/GetPDFPaths/"+a+"?callback=?", this.proxy(function(a) {
    if(a.length){
      return this.bcostura.attr("href",""+a),this.bcostura.removeClass("disable");
    }
    else{
      this.bcostura.removeAttr("href");
    }
    return false; 
  }));

  // $.getJSON("http://was-dev/Focus24/Services/SearchMaterial.svc/GetPDFPaths/"+a+"?callback=?", this.proxy(function(a) {
  //   if(a.length){
  //     return this.bcostura.attr("href",""+a),this.bcostura.removeClass("disable");
  //   }
  //   return false; 
  // }));
},GetImgPaths:function(a){    
  //Formas
  var i,length,obj,context=this,c=[];
  this.bformas.removeClass('sel').addClass("disable");
  /*$.getJSON("http://was-dev/Focus24/Services/SearchMaterial.svc/GetPDFPaths/"+a+"?callback=?", this.proxy(function(a) {
      this.bformas.attr("href",""+a),this.bformas.removeClass("disable")
  }));*/
  // $.getJSON("http://was-dev/Focus24/Services/SearchMaterial.svc/GetImgPaths/"+"P11NM0113"+"?callback=?", this.proxy(function(a) {
    $.getJSON( nodePath + "service=SearchMaterial.svc/GetImgPaths/"+a+"?callback=?", this.proxy(function(a) {
    //   return!1;
    // });
    // $.getJSON("http://was-dev/Focus24/Services/SearchMaterial.svc/GetImgPaths/"+a+"?callback=?", this.proxy(function(a) {
    obj=JSON.parse(a);
    if(!obj.length)
      $('#print-form').hide();
    if(obj.length){
      // $('#print-form').show();
      length=obj.length;
      for(i=0;i<length;i++){

        var img = new Image();
        img.src= obj[i].FILENAME;

        var pna = "<img src='"+img.src+"'/>";
        img.onload = function(){
          document.getElementById("print-form").appendChild(this);
        }
        // img.onload = function(){
        //   var pna = "<img src='"+img.src+"'/>";
        //   alert(pna);
        // };        
        
        

        
        // $(img).load(function() {
          
        // }).error(function(){

        // })                

        // alert(img.src);
        c.push("<div><img u='image' src='"+img.src.replace(".163/focus24h",".169")+"'/>"+"<img u='thumb' src='"+img.src.replace(".163/focus24h",".169")+"'/><div u='caption' t='NO' t2='CAP' class='caption'><p>"+obj[i].CRIADOR+" - "+obj[i].ESTACAO+"</p></div></div>");
      }


      c.length && this.bformas.removeClass("disable");
      
      // console.dir($(".slides-container"));
      $(".slides-container").html(c.join(""));

    
      //Animated forms

      var options = {

        $AutoPlay: false,                                   //[Optional] Whether to auto play, to enable slideshow, this option must be set to true, default value is false
        $DragOrientation: 3,                                //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $DisplayPieces is greater than 1, or parking position is not 0)

        $BulletNavigatorOptions: {                                //[Optional] Options to specify and enable navigator or not
            $Class: $JssorBulletNavigator$,                       //[Required] Class to create navigator instance
            $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
            $ActionMode: 1,                                 //[Optional] 0 None, 1 act by click, 2 act by mouse hover, 3 both, default value is 1
            $AutoCenter: 0,                                 //[Optional] Auto center navigator in parent container, 0 None, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
            $Steps: 1,                                      //[Optional] Steps to go for each navigation request, default value is 1
            $Lanes: 1,                                      //[Optional] Specify lanes to arrange items, default value is 1
            $SpacingX: 0,                                   //[Optional] Horizontal space between each item in pixel, default value is 0
            $SpacingY: 10,                                   //[Optional] Vertical space between each item in pixel, default value is 0
            $Orientation: 2                                 //[Optional] The orientation of the navigator, 1 horizontal, 2 vertical, default value is 1
        },
        $ArrowNavigatorOptions: {
            $Class: $JssorArrowNavigator$,              //[Requried] Class to create arrow navigator instance
            $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
            $AutoCenter: 2,                                 //[Optional] Auto center arrows in parent container, 0 No, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
            $Steps: 6                                       //[Optional] Steps to go for each navigation request, default value is 1
        },
        $ThumbnailNavigatorOptions: {
            $Class: $JssorThumbnailNavigator$,              //[Required] Class to create thumbnail navigator instance
            $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always

            $Loop: 1,                                       //[Optional] Enable loop(circular) of carousel or not, 0: stop, 1: loop, 2 rewind, default value is 1
            $SpacingX: 0,                                   //[Optional] Horizontal space between each thumbnail in pixel, default value is 0
            $SpacingY: 10,                                   //[Optional] Vertical space between each thumbnail in pixel, default value is 0
            $DisplayPieces: 5,                              //[Optional] Number of pieces to display, default value is 1
            $ParkingPosition: 204,                          //[Optional] The offset position to park thumbnail,
            $Orientation: 2
            
        } 
      };
      var jssor_slider1 = new $JssorSlider$("slider", options);
    }
  }));
  /*if(a.length) {
      for(var b = 0;b < a.length;b++) {
        (-1 === a[b].Desc.indexOf("0")) && c.push("<a href='#" + a[b].Grupo + a[b].Cod + "' class='color-thumb'><img src='/library/colors/" + a[b].Cod + ".jpg' class='color-thumb'/><span class='color-name'>" + a[b].Desc.capitalize() + "</span></a>");
      }
      c.length && d.colorbt.removeClass("disable");
      d.colorlist.html("<li>" + c.join("</li><li>") + "</li>").delay(500).fadeIn(function() {
        //d.infoside.tinyscrollbar && d.infoside.tinyscrollbar_update();
      });
      d.el.find('.info-color').show();
    }*/
},lavadolist:function(c) {
  this.blavado.removeClass('sel').addClass("disable");

  $.getJSON("/library/ajax/lavagem.js", this.proxy(function(a) {
      var b = a.filter(function(b) {
          return -1 !== c.indexOf(b.MATNR);
      });
      if(b.length){
        this.blavado.attr("href","/library/jeans/recepies/"+b[0].MATNR+".pdf"),this.blavado.removeClass("disable");
      }
      else{
        this.blavado.removeAttr("href");
      }
  }));
},fichalist:function(c){
  this.bficha.removeClass('sel').addClass("disable");

  $.getJSON("/library/ajax/fichas.js", this.proxy(function(a) {
      var b = a.filter(function(b) {
          return -1 !== c.indexOf(b.MATNR); 
      });
      if(b.length){
        this.bficha.attr("href","/library/jeans/fichas/"+b[0].MATNR+".pdf"),this.bficha.removeClass("disable");
      }
      else{
        this.bficha.removeAttr("href");
      }
  }));

},getcolorlist:function(a) {
  "use strict";
  var obj,c = [], d = this;
  //this.colorbt.addClass("disable");

  if(this.father){
    a=a;
  }
  else{
    a = a.slice(0, -6); 
  }
  //console.log(nodePath + "index.js?service=CorMaterial.svc/get/&query="+ a +"/E?callback=?");
  $.getJSON( nodePath + "service=CorMaterial.svc/getbriefing/"+a+"?callback=?", function(a) {
  //   return!1;
  // });
  // $.getJSON("http://was-dev/Focus24/Services/CorMaterial.svc/getbriefing/"+a+"?callback=?", function(a) {
    a = a.sortBy("Grupo");
    if(a.length) {
      d.colors=a;
      for(var b = 0;b < a.length;b++) {
        (-1 === a[b].Desc.indexOf("0")) && c.push("<a href='#" + a[b].Grupo + a[b].Cod + "' class='color-thumb'><img src='/library/colors/" + a[b].Cod + ".jpg' class='color-thumb'/><span class='color-name'>" + a[b].Desc.capitalize() + "</span></a>");
      }
      //c.length && d.colorbt.removeClass("disable");
      d.colorlist.html("<li>" + c.join("</li><li>") + "</li>").delay(500).fadeIn(function() {
        //d.infoside.tinyscrollbar && d.infoside.tinyscrollbar_update();
      });
      //d.el.find('.info-color').show();
    }
  });
},
rapportlist:function(c) {
  "use strict";
  this.rapportbt.removeClass('sel').addClass("disable");
  
  //this.el.find('.info-rapport').hide();

  $.getJSON("/library/ajax/rapport.js", this.proxy(function(a) {
      var b = a.filter(function(b) {
          //return -1 !== b.MATNR.indexOf(c);M31CR0002E12286
          return -1 !== b.MATNR.indexOf(c);
      });
      // alert(b.length);
      if(b.length==0)
        $('.info-view').hide();
      
      b.length && (this.rapportbt.removeClass("disable"), this.el.find('.info-rapport img').attr('src','http://189.126.197.169/img/rapport/raprt_' + b[0].MATNR + ".jpg"));
      
  }));
}, reload:function(event,loja,tipo,material) {
  "use strict";
  var a,obj,context=this;

  
  $('#toggle-menu a').each(function(a,b){
    if(b.hash === "#"+loja){
      $(b).addClass("sel");
    }        
  });

  if("object" === typeof event) {
    event.preventDefault();
    a= $(event.target), a = a.parent().attr("href").split("#")[1], a = this.item.MATNR.slice(0, -6) + a;
  }else {
    if(!event) {
      return!1;
    }
  }
 obj=this.getfdata();

   if(!loja){
    //Filho
    if(!material){
      material=a;
    }
    this.father=!1;
    // console.log("filho");
    this.tipo=tipo;
    if(obj.length){
      $.each(obj,function(index){
       if(obj[index].MATNR === material){
        return context.open(obj[index]);
       }
      });
    }
    else{
      $.getJSON( nodePath + "service=SearchMaterial.svc/BriefingZwte/"+material+"?callback=?",this.proxy(this.open));
      //   return!1;
      // });
      // $.getJSON("http://was-dev/Focus24/Services/SearchMaterial.svc/BriefingZwte/"+material+"?callback=?",this.proxy(this.open));
    }
  }
  else{
    //pai
    this.father=!0;
    if(obj.length){
      $.each(obj,function(index){
       if(obj[index].MATNR === material){
        return context.open(obj[index]);
       }
      });
    }
    else{
      $.getJSON( nodePath + "service=SearchMaterial.svc/Briefing/"+loja+"/"+tipo+"/"+material+"?callback=?",this.proxy(this.open));


      //   return!1;
      // });

      // $.getJSON("http://was-dev/Focus24/Services/SearchMaterial.svc/Briefing/"+loja+"/"+tipo+"/"+material+"?callback=?",this.proxy(this.open));
    }
  }
},init:function() {
  this.father=!0; //true if is father code, false if isn't.
  this.item = null;
  this.on=!1;
  this.tipo="";
  this.colors=[];
}});