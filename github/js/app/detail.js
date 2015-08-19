/**
* Details's class and actions
* @exports Detail
* @constructor
*/
window.Detail = Spine.Controller.sub({
elements:{
}, events:{
},close:function() {
  //this.el.hide();
  this.on = !1;
  window.history.go(-1);
  //$(window).scrollTop(this.scrollp);
}, 
/**
* `OK Set thed loading state`
* @memberOf Detail#
* @param {Bothoolean} a. If true show mask, else hide mask.
*/
callerEvents:function(){
  var context=this;
  $("button.bgoselect").bind("click",function(){context.close();});  //close
  $(".sample-buttons button").bind("click",function(a){context.showImage(a);});
  $(".submit-detail").bind("click",function(){context.saveDetail();});
  $(".delete").unbind("click").bind("click",function(){
    context.deleteSample();
    return !1;
  });
  $(".bnext").unbind("click").bind("click",function(){
    context.nextSample();
    return !1;
  });
  $(".btrash-big").bind("click",function(){
    context.deleteNote();
    return !1;
  });
  $(".bplus-big").bind("click",function(){
    context.plusNote();
    return !1;
  });
},
open: function(a){
  "use strict";
  var context=this;
  this.item = a;
  if(!this.item){
    return !1;
  }
  this.callerEvents();
  $(".sample-buttons button").eq(0).trigger('click');
  this.populateDetail();
  this.setloading(!1);
}, populateDetail:function(){
  var i,context=this,item=this.item,name;

  var homologado,note,fisica,fav,email,annex,status,result="";
  homologado= item.AMOS_HOMOLOGAR ? "has":"nothas";
  note= item.NOTES.length   ? true:false;
  fisica= item.FLAG_FISICA ? "has":"nothas";
  fav= item.FLAG_PRIORIDADE ? "has":"nothas";
  annex= item.AMOS_HOMOLOGAR ? true:false;
  status= item.AMOS_STATUS ? "complet":"incomplet";
  email= item.AMOS_ENV_EMAIL? "sent":"disabled";

  //STATUS
  if(item.AMOS_STATUS){
    $(".detail-status").html('<p class="caption-icons-icon bstatus complet">Cadastro Completo</p>');
  }
  else{
    $(".detail-status").html('<p class="caption-icons-icon bstatus incomplet">Completar Cadastro</p>');
  }

  //TOP DO DETALHE, NOS BOTOES
  result+='<li class="first"><a href="#'+item.AMOS_ID+'" class="caption-icons-icon setitem bfav '+fav+'" title="Favoritar">Favorita</a></li>';
  result+='<li><a href="#'+item.AMOS_ID+'" class="caption-icons-icon setitem oneline bfisica '+fisica+'" title="Fisica">Amostra<br/>Fisica</a></li>';
  result+='<li><a href="#'+item.AMOS_ID+'" class="caption-icons-icon setitem bhomologado '+homologado+'" title="Homologar">Homologar</a></li>';
  result+='<li><a href="#bannex_file" class="caption-icons-icon oneline bannex_file has">Anexar<br/> Arquivo</a><input type="file" name="pic" class="hide"></li>';
  result+='<li><a href="#bannex" class="caption-icons-icon oneline bannex has">Arquivos<br/> Anexos</a></li>';
  $(".description-overview.description-top ul").html(result);
  

  //TOP DO DETALHE, LISTA DE VALORES
  var list=["AMOS_ID","FEIR_DESC","FORN_DESC","CREATE_DATE"/*,"AMOS_PRECO_UM","AMOS_PRECO"*/];
  var list_item=$(".description-top").find("dd");
  for(i=0;i<list.length;i++){
    name=list[i];
    if(item[name] !== ""){
      list_item.eq(i).text(item[name]);
    }
  }

  //TAB COMPOSICOES
  var elm=$("table tbody");
  result="<tr>";
  if(item.TECI_DESC){
    result+="<td>";
    for(i=0;i<item.COMPOSITIONS.length;i++){
      result+=""+item.COMPOSITIONS[i].COMP_DESC+"<br/>";
    }
    result+="</td>";
  }
  else{
    result+="<td> - </td>";
  }
  
  if(item.TECI_DESC){
    result+="<td>";
    for(i=0;i<item.COMPOSITIONS.length;i++){
      result+=""+item.COMPOSITIONS[i].COMP_DESC+"<br/>";
    }
    result+="</td>";
  }
  else{
    result+="<td> - </td>";
  }
  if(item.TECI_DESC){
    result+="<td>";
    for(i=0;i<item.COMPOSITIONS.length;i++){
      result+=""+item.COMPOSITIONS[i].COMP_DESC+"<br/>";
    }
    result+="</td>";
  }
  else{
    result+="<td> - </td>";
  }
  if(item.TECI_DESC){
    result+="<td>";
    for(i=0;i<item.COMPOSITIONS.length;i++){
      result+=""+item.COMPOSITIONS[i].COMP_DESC+"<br/>";
    }
    result+="</td>";
  }
  else{
    result+="<td> - </td>";
  }

  if(item.COMPOSITIONS.length){
    result+="<td>";
    for(i=0;i<item.COMPOSITIONS.length;i++){
      result+=""+item.COMPOSITIONS[i].COMP_DESC+"<br/>";
    }
    result+="</td>";
  }
  else{
    result+="<td> - </td>";
  }
  result+="<tr>fdsfdssfd</tr>";
  elm.html(result);

  //DESCRIÇÃO COMPLETA INPUTS
  $(".detail-description").find("input").each(function(a,b){
    $(b).val(item[$(b).attr("name")]);
  });
  $(".AMOS_PRECO_UM option").each(function(a,b){
    if($(b).attr("value") === item["AMOS_PRECO_UM"]){
      $(b).attr("selected","selected");
    }
  });


  //ANOTAÇÕES
  if(note){
    result="";
    result+='<div class="supplier-form-container note contact actived"><ul class="notepad supplier-note-side">';
    for(i=0;i<item.NOTES.length;i++){
      result+="<li><article><div class='notepad-note blockquote'><p>"+item.NOTES[i].CREATE_DATE+" | "+ item.NOTES[i].USU_NOME+" | "+item.NOTES[i].OBJ_ID+"</p><p>"+item.NOTES[i].SEGM_DESC+" - Assunto:</p><p>"+item.NOTES[i].NOTA_DESC+"</p></div><div class='blockquote'><button type='button' class='tooltip-item caption-icons-icon btrash-big' id='"+item.NOTES[i].NOTA_ID+"' name='"+item.NOTES[i].USU_COD+"'></button></div></article></li>"
    }
    result+="</ul></div>"
  }
  else{
    result="";
  }
  $(".description-noteside").append(result);
  $(".bannex_file").bind("click",function(a){
    a.preventDefault();
    $(a.target).parent().find("input").trigger('click');
  });
  $(".bannex").bind("click",function(a){
    a.preventDefault();
    alert("LISTA ANEXO");
  });

},showImage:function(a){
  var html="",item=this.item,name=$(a.target).attr("name");
  if(!$(a.target).hasClass('sel')){
    $(".zoomContainer").remove();
    $(".sample-buttons button").removeClass('sel');
    $(a.target).addClass('sel');
    html='<button class="icon bzoom"></button>';
    if(item[name]){
      console.dir(this.item[$(a.target).attr("name")]);
      html+='<img id="zoom" src="//bdb/ifair_img/'+item[name].replace("thumb","large")+'" data-zoom-image="//bdb/ifair_img/'+item[name].replace("thumb","large")+'"/>';
    }
    else{
      html+='<img id="zoom_01" src="http://189.126.197.169/img/large/large_NONE.jpg" data-zoom-image="http://189.126.197.169/img/large/large_NONE.jpg"/>';
    }
    $(".detail-sample-image").html(html);

    $('#zoom').elevateZoom({
      zoomType: "inner",
      cursor: "crosshair",
      zoomWindowFadeIn: 500,
      zoomWindowFadeOut: 750
    }); 
  }
},saveDetail:function(){
  var html="",item=this.item;
  $(".detail-description").find("input").each(function(a,b){
    html+="<"+$(b).attr("name")+">"+$(b).val()+"</"+$(b).attr("name")+">";
  });
  html+="<AMOS_PRECO_UM>"+$(".AMOS_PRECO_UM option:selected").attr("value")+"</AMOS_PRECO_UM>";
  pattern="<AMOS_ID>"+item.AMOS_ID+"</AMOS_ID><FORN_ID>"+item.FORN_ID+"</FORN_ID><FEIR_COD>"+parseInt(item.FEIR_COD)+"</FEIR_COD><USU_COD>"+item.USU_COD+"</USU_COD><AMOS_DESC>"+item.AMOS_DESC+"</AMOS_DESC><AMOS_STATUS>"+item.AMOS_STATUS+"</AMOS_STATUS><AMOS_ENV_EMAIL>"+item.AMOS_ENV_EMAIL+"</AMOS_ENV_EMAIL><TECI_COD>"+(item.TECI_COD || "")+"</TECI_COD><BASE_COD>"+(item.BASE_COD || "")+"</BASE_COD><GRUP_COD>"+(item.GRUP_COD || "")+"</GRUP_COD><SUBG_COD>"+(item.SUBG_COD || "")+"</SUBG_COD><SEGM_COD>"+item.SEGM_COD+"</SEGM_COD><FLAG_PRIORIDADE>"+item.FLAG_PRIORIDADE+"</FLAG_PRIORIDADE><AMOS_HOMOLOGAR>"+item.AMOS_HOMOLOGAR+"</AMOS_HOMOLOGAR><FLAG_FISICA>"+item.FLAG_FISICA+"</FLAG_FISICA><CREATE_DATE>"+"2015-01-01"+"</CREATE_DATE>";
  this.setloading(!0,!1);
  this.callService("gravarAmostras",pattern,html,'U');
},deleteSample:function(){
  alert("DELETAR AMOSTRA");
},nextSample:function(){
  $(".sample-buttons button").eq(1).trigger('click');
  if(!this.nextsample){
    alert("CARREGUE MAIS ITENS");
    return !1;
  }
  this.reload(this.nextsample.FEIR_COD,this.nextsample.AMOS_ID);
},plusNote:function(){
  this.addNote();
  //this.callService("gravarNotes");
},reload:function(fair,code) {
  "use strict";
  var result;
  this.setloading(!0,!1);
  result=this.getdata(code);
  console.dir(result);
  if(result.length){
    this.open(result[0]);
    this.nextsample=result[1];
  }
  else{
    //this.open(jQuery.parseJSON('{"AMOS_COD":null,"AMOS_COTACAO_KG":0,"AMOS_COTACAO_M":0,"AMOS_DESC":"TESTE NACIONAL","AMOS_ENV_EMAIL":0,"AMOS_GRAMATURA_M":0,"AMOS_GRAMATURA_ML":0,"AMOS_HOMOLOGAR":0,"AMOS_ID":200000101,"AMOS_LARGURA_TOTAL":0,"AMOS_LARGURA_UTIL":0,"AMOS_ONCAS":0,"AMOS_PRECO":0,"AMOS_PRECO_UM":"","AMOS_STATUS":0,"BASE_COD":null,"BASE_DESC":"","COMPOSITIONS":[{"COMP_COD":"CJ ","COMP_DESC":"JUTE","TP_COMP_ID":0},{"COMP_COD":"CJ ","COMP_DESC":"JUTE","TP_COMP_ID":0}],"CREATE_DATE":"\/Date(1339642800000-0300)\/","FEIR_COD":"1 ","FEIR_DESC":"FOCUS TEXTIL - Sao Paulo\/Brazil","FLAG_FISICA":0,"FLAG_PRIORIDADE":0,"FORN_DESC":"TESTE FORNECEDOR IMPORTADORNECEDOR","FORN_ID":4200083,"GRUP_COD":null,"GRUP_DESC":"","IMG_PATH_SAMPLE":"","IMG_PATH_TICKET":"","NOTES":[],"SEGM_COD":"ML","SEGM_DESC":null,"SUBG_COD":null,"SUBG_DESC":"","TECI_COD":null,"TECI_DESC":"","USU_COD":36}'));
    this.open(jQuery.parseJSON('{"AMOS_COD":null,"AMOS_COTACAO_KG":0,"AMOS_COTACAO_M":0,"AMOS_DESC":"TESTE NACIONAL","AMOS_ENV_EMAIL":0,"AMOS_GRAMATURA_M":0,"AMOS_GRAMATURA_ML":0,"AMOS_HOMOLOGAR":0,"AMOS_ID":200000101,"AMOS_LARGURA_TOTAL":0,"AMOS_LARGURA_UTIL":0,"AMOS_ONCAS":0,"AMOS_PRECO":0,"AMOS_PRECO_UM":"","AMOS_STATUS":0,"BASE_COD":null,"BASE_DESC":"","COMPOSITIONS":[{"COMP_COD":"CA ","COMP_DESC":"ACETATE","TP_COMP_ID":0},{"COMP_COD":"CJ ","COMP_DESC":"JUTE","TP_COMP_ID":0}],"CREATE_DATE":"\/Date(1339642800000-0300)\/","FEIR_COD":"1 ","FEIR_DESC":"FOCUS TEXTIL - Sao Paulo\/Brazil","FLAG_FISICA":0,"FLAG_PRIORIDADE":0,"FORN_DESC":"TESTE FORNECEDOR IMPORTADORNECEDOR","FORN_ID":4200083,"GRUP_COD":null,"GRUP_DESC":"","IMG_PATH_SAMPLE":"","IMG_PATH_TICKET":"","NOTES":[{"CREATE_DATE":"\/Date(1436508000000-0300)\/","NOTA_DESC":"Teste de Anotação2","NOTA_ID":339,"OBJ_ID":200000101,"PLAT_ID":0,"SEGM_DESC":"Todos ","TP_NOTA_ID":2,"USU_COD":36,"USU_NOME":"JACQUES STERN"}],"SEGM_COD":"ML","SEGM_DESC":null,"SUBG_COD":null,"SUBG_DESC":"","TECI_COD":null,"TECI_DESC":"","USU_COD":36}'));
  }
},init:function() {
  this.item = null;
  this.nextsample=null;
  this.on=!1;
}});

/**
* Details's class and actions
* @exports Detail
* @constructor
*/
window.Fornecedores = Spine.Controller.sub({
elements:{

}, events:{
},close:function() {
  //this.el.hide();
  this.on = !1;
  window.history.go(-1);
  //$(window).scrollTop(this.scrollp);
}, 
/**
* `OK Set thed loading state`
* @memberOf Detail#
* @param {Bothoolean} a. If true show mask, else hide mask.
*/
callerEvents:function(){
  var context=this;
  if($("html").hasClass('view_forn')){
    $("input").attr('disabled', 'disabled');
    $("select").attr('disabled', 'disabled');
  }

  //$(".navbar-nav li a").bind("click",function(a){context.saveForn(a);});  
  
  //ScrollSpy by http://jsfiddle.net/mekwall/up4nu/
  $(".ScrollSpy").find(".nav-item").bind("click",function(a){context.changeTab(a);});
  $(".supplier-scroller").bind("scroll",function(a){context.scrollTab(a);})
  $(".favcontact").bind("click",function(a){context.setFavContact(a);});
  $(".bplus-big").bind("click",function(a){context.showSomething(a);});
  $("#profile .bcircle").bind("click",function(a){context.setProfile(a);});
  $("#profile .bmore").bind("click",function(a){context.addElem(a,!1);});
  $("#composition .bmore").bind("click",function(a){context.addElem(a,!0);});
  $("#products .bmore").bind("click",function(a){context.addElem(a,!0);});
  $("#markets .bmore").bind("click",function(a){context.addElem(a,!0);});
  $(".delete").bind("click",function(a){context.removeAll(a);});
  $("button.fav-big").bind("click",function(a){context.setFav(a);});  //setFavorito

  if(!$("html").hasClass('view_forn')){
    $("input").removeAttr('disabled');
    $("select").removeAttr('disabled');
  }

  $(".bedit").bind("click",function(a){
    if($(a.target).hasClass('sel')){
      $(a.target).removeClass('sel');
      $("html").attr("class","fornecedor_cadastro view_forn");
    }
    else{
      $(a.target).addClass('sel');
      $("html").attr("class","fornecedor_cadastro edit_forn");
      $("input").removeAttr('disabled');
      $("select").removeAttr('disabled');
    }
  });
},
open: function(a){
  "use strict";
  var context=this;
  this.item = a;

  if(!this.item){
    return !1;
  }
  console.dir(this.item);
  $(".question-note").remove();
  this.callerEvents();
  $(".ScrollSpy").find(".nav-item").eq(0).trigger('click');
  if(!this.getSegm().length){
    this.callService("listarSegmentos");
  }
  if(!this.fair.length){
    this.callService("local",'<FEIR_COD></FEIR_COD>','<PAIS_COD></PAIS_COD>','<REGI_COD></REGI_COD>');
  }
  //this.fav=elemento.FLAG_PRIORIDADE;

  this.populateForn();

},changeTab:function(e){
  var context=this;
  e.preventDefault();
  // Bind click handler to menu items
  // so we can get a fancy scroll animation
  if(!$(e.target).hasClass('nav-item')){
    if($(e.target).prop("tagName") ===  "SPAN"){
      e=$(e.target).parent();
    }
    else{
      e=$(e.target).closest("a");
    }
  }
  else{
    e=$(e.target);
  }

  var href = e.attr("href");
  //this.lasttab=href.replace("#","");
  offsetTop = href === "#" ? 0 : $(href).position().top;
  //console.dir($(href));
  $('.supplier-scroller').stop().animate({
      scrollTop: offsetTop,
  }, 300,function(){
    context.lasttab=context.tab || "dados";
    context.tab=href.replace("#","");
    context.saveForn();
  });
},scrollTab:function(a){
  var lastId;
  // Bind to scroll
  // Get container scroll position

  scrollItems = $(".ScrollSpy").find(".nav-item").map(function(){
    var item = $($(this).attr("href"));
    if (item.length) { return item; }
  });

   //var fromTop = $(this).scrollTop()+topMenuHeight;
   var fromTop = $(a.target).scrollTop();
   this.scroller=fromTop;
   // Get id of current scroll item
   var cur = scrollItems.map(function(){
     if ($(this).position().top <= fromTop)
       return this;
   });
   // Get the id of the current element
   cur = cur[cur.length-1];
   var id = cur && cur.length ? cur[0].id : "";
   if (lastId !== id) {
       lastId = id;


       // Set/remove active class
       $(".ScrollSpy").find(".nav-item")
         .parent().removeClass("active")
         .end().filter("[href=#"+id+"]").parent().addClass("active");

   }
},showSomething:function(a){
  if($("html").hasClass('view_forn')){
    return !1;
  }
  var a=$(a.target);
  a.addClass('hide');
  switch (a.attr("name")){
    case 'CONT_TEL2':
      $("."+a.attr("name")).removeClass('hide');
      break;
    case 'CONT2_TEL2':
      $("."+a.attr("name")).removeClass('hide');
      break;
    case 'showcontact':
      $(".contact2").addClass('actived');
  }
},setProfile:function(a){
  if($("html").hasClass('view_forn')){
    return !1;
  }
  var el=$(a.target);
  if(el.attr("name") === "3"){
    $("#profile .bcircle").removeClass('sel');
    el.addClass('sel');
    $(".sel-factory.is-sel").removeClass("hide");
  }
  else{
    if(el.hasClass('sel')){
      $("#profile .bcircle").removeClass('sel');
    }
    else{
      $("#profile .bcircle").removeClass('sel');
      el.addClass('sel');
    }
    $(".sel-factory.is-sel").addClass("hide");
  }
},addElem:function(a,b){
  if($("html").hasClass('view_forn')){
    return !1;
  }
  var el=$(a.target),html="",context=this;
  name=el.attr("name");
  pos_string=name.indexOf("/")+1;
  //cod_detalhe=hash.substr(pos_string, hash.length);
  group=name.substr(0,pos_string-1);
  if(b){
    html+='<div class="row row-fixed row-item"><button type="button" class="tooltip-item tooltip-item-supplier caption-icons-icon bminus" name="'+name+'">'+el.text()+'</button></div>';
  }
  else{
    html+='<div class="row row-item"><button type="button" class="tooltip-item tooltip-item-supplier caption-icons-icon bminus" name="'+name+'">'+el.text()+'</button></div>';
  }
  el.addClass("hide");
  $("."+group+"-rem").append(html);
  $(".bminus").bind("click",function(a){context.remElem(a);});
},removeAll:function(a){
  if($("html").hasClass('view_forn')){
    return !1;
  }
  var el=$(a.target);
  $('.'+el.attr('name')+"-rem").find(".row-item").remove();
  console.dir($("."+el.attr('name')+"-add .row .hide"))
  $("."+el.attr('name')+"-add .row .hide").each(function(a,b){
    $(b).removeClass('hide');
  });
},
remElem:function(a){
  if($("html").hasClass('view_forn')){
    return !1;
  }
  var el=$(a.target),html="";
  name=el.attr("name");
  pos_string=name.indexOf("/")+1;
  cod_detalhe=name.substr(pos_string, name.length);
  group=name.substr(0,pos_string-1);
  console.dir($("."+group+"-add .row .hide"));
  $("."+group+"-add .row .hide").each(function(a,b){
    if($(b).attr("name").substr($(b).attr("name").indexOf("/")+1, $(b).attr("name").length) == cod_detalhe){
      $(b).removeClass('hide');
    }
  });
  el.parent().remove();
},
setFav:function(a){
  if($("html").hasClass('view_forn')){
    return !1;
  }
  var i,el=$(a.target),html="",hasfav=!1;
  if(el.hasClass('sel')){
    this.fav=0;
    el.removeClass('sel');
  }
  else{
    this.fav=1;
    el.addClass('sel');
  }
  console.log("clicado no FAVORITO");
  this.item.FORN_ID="4200000";
  this.item.FAVORITES=[];
  if(this.item.FORN_ID){
    this.waitingfav=!1;
    this.ajaxrequest=!0;
    if(this.item.FAVORITES.length){
      for(i=0;i<this.item.FAVORITES.length;i++){
        if(this.item.FAVORITES[i].SEGM_COD === this.usr.SEGM_COD){
          if(el.hasClass('sel')){
            html+="<string>"+this.item.FAVORITES[i].SEGM_COD+"</string>";
          }
        }
        else{
          html+="<string>"+this.item.FAVORITES[i].SEGM_COD+"</string>";
        }
      }
    }
    else{
      html+="<string>"+this.usr.SEGM_COD+"</string>";
    }
    //this.callService("GravarFornecedorFavorito",'<Forn_ID>'+this.item.FORN_ID+'</Forn_ID>',html);
  }
  else{
    this.waitingfav=!0;
  }

},setFavContact:function(a){
  if($("html").hasClass('view_forn')){
    return !1;
  }
  var el=$(a.target);
  if(el.hasClass('sel')){;
    this.favcontact[parseInt(el.attr("name"))-1].fav=0;
    el.removeClass('sel');
  }
  else{
    this.favcontact[parseInt(el.attr("name"))-1].fav=1;
    el.addClass('sel');
  }
  console.log("clicado no FAVORITO");
},populateForn:function(){
  var context=this;
  if(!this.getSegm().length){
    status=setInterval(function(){
      if(context.getSegm().length){
        context.ajaxrequest=!1;
        context.createComponent(context.getSegm(),$(".SEGM_COD"),'segm');
        if(context.fair.length){
          context.setloading(!1);
          context.inputValues();
        }
        clearInterval(status);
      }
    },100);
  }
  else{
    context.createComponent(context.getSegm(),$(".SEGM_COD"),'segm');
    if(context.fair.length){
      context.setloading(!1);
      context.inputValues();
    }
  }
  if(!this.fair.length){
    statusfair=setInterval(function(){
      if(context.fair.length){
        context.ajaxrequest=!1;
        context.createComponent(context.fair,$(".fair"),'fair');
        context.setloading(!1);
        context.inputValues();
        clearInterval(statusfair);
      }
    },100);
  }

  //Gravar dados nos campos

},inputValues:function(){
  var context=this;
  if(this.item.FORN_ID){
    $(".bedit").trigger('click');
    $(".fair option").each(function(a,b){
      if(parseInt($(b).attr("value")) === parseInt(context.item["FEIR_COD"])){
        $(b).attr("selected","selected");
        context.setfair=parseInt(context.item["FEIR_COD"]);
        $(".fair").attr('disabled', 'disabled');
      }
    });

    $("input[name='FORN_DESC']").val(context.item["FORN_DESC"]);

    if(this.item.FAVORITES.length){
      for(var i=0;i<this.item.FAVORITES.length;i++){
        if(this.usr.SEGM_COD === this.item.FAVORITES[i].SEGM_COD){
          $(".fav-big").addClass('sel');
        }
      }
    }
    for(var i=0;i<context.item.CONTACTS.length;i++){
      var content=$(".contact").eq(i),contact=context.item.CONTACTS[i];
      content.addClass('actived').find("input").each(function(index, el) {
        $(el).val(contact[""+$(el).attr("name")]);
        console.log(contact[""+$(el).attr("name")].length);
        $("button[name='"+"CONT_TEL2"+"']").addClass('hide');
        $(".CONT_TEL2").removeClass('hide');

        $("button[name='"+"CONT2_TEL2"+"']").addClass('hide');
        $(".CONT2_TEL2").removeClass('hide');
      });;
      if(contact.CONT_PRINCIPAL){
        content.find(".favcontact").addClass('sel');
      }
      content.find(".SEGM_COD option").each(function(a,b){
        // console.dir($(b).attr("value")+" , "+);
        if($(b).attr("value") === contact["SEGM_COD"]){
          $(b).attr("selected","selected");
        }
      });
      if(contact.IMG_PATH_CONTATO){
        $(".photo-container img").atrr("src",contact.IMG_PATH_CONTATO);
      }
      $(".card-side img").each(function(index, el) {
        if(contact[''+$(el).attr("name")].length){
          $(el).attr("src",'http://bdb/ifair_img/'+contact[''+$(el).attr("name")]);
        }
      });
    }
    if(context.item.PROFILES.length){
      for(var i=0;i<context.item.PROFILES.length;i++){
        if(context.item.PROFILES[i].PERF_COD == 3){
          $(".sel-factory").trigger('click');
          if(context.item.PROFILES[i].TP_FAB_COD === 1){
            $(".ownfab-add").find("button[name='ownfab/"+context.item.PROFILES[i].FAB_COD+"']").trigger('click');
          }
          else{
            $(".colfab-add").find("button[name='colfab/"+context.item.PROFILES[i].FAB_COD+"']").trigger('click');
          }
        }
        else{
          console.dir($("#profile button[name='"+context.item.PROFILES[i].PERF_COD+"']"));
          $("#profile button[name='"+context.item.PROFILES[i].PERF_COD+"']").addClass('sel');
        }
      }
    }
    if(context.item.COMPOSITIONS.length){
      for(var i=0;i<context.item.COMPOSITIONS.length;i++){
        var n;
        if(isNaN(context.item.COMPOSITIONS[i].COMP_COD.replace(" ",""))){
          n=context.item.COMPOSITIONS[i].COMP_COD.replace(" ","");
          while(n.indexOf(" ") != -1)
            n = n.replace(" ", "");
        }
        else{
          n=parseInt(context.item.COMPOSITIONS[i].COMP_COD.replace(" ",""));
        }
        console.dir( $(".comp-add button[name='comp/"+n+"']"));
        $(".comp-add button[name='comp/"+n+"']").trigger('click');
      }
    }
    if(context.item.PRODUCTS.length){
      for(var i=0;i<context.item.PRODUCTS.length;i++){
        $(".prod-add button[name='prod/"+parseInt(context.item.PRODUCTS[i].PROD_COD)+"']").trigger('click');
      }
    }
    if(context.item.MARKETS.length){
      for(var i=0;i<context.item.MARKETS.length;i++){
        $(".mark-add button[name='mark/"+parseInt(context.item.MARKETS[i].MERC_COD)+"']").trigger('click');
      }
    }
    //$("html").addClass('view_forn');
  }
  else{
    $(".contact").eq(0).addClass('actived');
  }
},saveForn:function(a){

  var date=new Date(),html="",context=this,pattern="";
  var addforn=$("html").hasClass('add_forn') ? "I" : "U";
  date=""+date.getFullYear()+"-0"+(date.getMonth()+1)+"-"+date.getDate();
  console.log(this.setfair);
  pattern+="<USU_COD>"+this.usr.USU_COD+"</USU_COD>"+"<CREATE_DATE>"+date+"</CREATE_DATE>"+"<FEIR_COD>"+this.setfair+"</FEIR_COD>";
 /*if(this.tab === "dados" && !this.scroller){
    return !1;
  }*/
  if(this.setfair && !$("html").hasClass('view_forn') && (this.lasttab !== this.tab)){
    this.setloading(!0,!1);
    switch (this.lasttab){
      case 'dados':
        console.log(this.tab);
        console.log(this.lasttab);
        html+="<FORN_INATIVO>0</FORN_INATIVO>";
        if(addforn === "I"){
          html+="<FORN_STATUS>0</FORN_STATUS>";
        }
        else{
          html+="<FORN_STATUS>"+this.item.FORN_STATUS+"</FORN_STATUS>";
        }


        context.ajaxrequest=!0;
        this.callService("GravarFornecedor",'<FORN_ID>'+(context.item.FORN_ID || 0)+'</FORN_ID>',html+""+pattern,"<FORN_DESC>"+$("input[name='FORN_DESC']").val()+"</FORN_DESC>",'<action>'+addforn+'</action>');
        
        status=setInterval(function(){
          if(!context.ajaxrequest){
            $(".contact.actived").each(function(a,b){
              html="";
              $(b).find("input").each(function(a,b){
                html+="<"+$(b).attr("name")+">"+$(b).val()+"</"+$(b).attr("name")+">";
              });
              html+="<SEGM_COD>"+$(".SEGM_COD option:selected").attr("value")+"</SEGM_COD>";
              html+="<CONT_PRINCIPAL>"+context.favcontact[a].fav+"</CONT_PRINCIPAL>";
              html+="<FORN_ID>"+context.item.FORN_ID+"</FORN_ID><CONT_INATIVO>0</CONT_INATIVO>";
              if(!$("html").hasClass('add_forn')){
                if(context.item.CONTACTS[a]){
                  html+="<CONT_ID>"+context.item.CONTACTS[a].CONT_ID+"</CONT_ID><IMG_PATH_FRENTE>"+context.item.CONTACTS[a].IMG_PATH_FRENTE+"</IMG_PATH_FRENTE><IMG_PATH_VERSO>"+context.item.CONTACTS[a].IMG_PATH_VERSO+"</IMG_PATH_VERSO><IMG_PATH_CONTATO>"+context.item.CONTACTS[a].IMG_PATH_CONTATO+"</IMG_PATH_CONTATO>";
                  context.callService("GravarFornecedorContato",html,pattern,"",'<action>U</action>');
                }
                else{
                  html+="<IMG_PATH_FRENTE>0</IMG_PATH_FRENTE><IMG_PATH_VERSO>0</IMG_PATH_VERSO><IMG_PATH_CONTATO>0</IMG_PATH_CONTATO>";
                  context.callService("GravarFornecedorContato",html,pattern,"",'<action>I</action>');
                }
              }
              else{
                html+="<IMG_PATH_FRENTE>0</IMG_PATH_FRENTE><IMG_PATH_VERSO>0</IMG_PATH_VERSO><IMG_PATH_CONTATO>0</IMG_PATH_CONTATO>";
                context.callService("GravarFornecedorContato",html,pattern,"",'<action>I</action>');
              }
            });
            clearInterval(status);
          }
        },100);
        context.setloading(!1);
        // console.log(this.setDate());
        break;
      case 'profile':
        var html="";
        console.log(this.tab);
        console.log(this.lasttab);
        $("#profile .bcircle.sel").each(function(a,b){
          if($(b).attr("name") !== "3"){
            console.dir($(b).attr("name"));
             html+="<Profile><FAB_COD>0</FAB_COD><PERF_COD>"+$(b).attr("name")+"</PERF_COD><TP_FAB_COD>0</TP_FAB_COD></Profile>";
          }
          else{
            $(".ownfab-rem .row-item").each(function(a,b){
              var el=$(b).find(".bminus").attr("name");
              console.dir(el);
              html+="<Profile><FAB_COD>"+el.substr(el.indexOf("/")+1, el.length)+"</FAB_COD><PERF_COD>3</PERF_COD>";
              html+="<TP_FAB_COD>1</TP_FAB_COD></Profile>";
            });
              $(".colfab-rem .row-item").each(function(a,b){
                var el=$(b).find(".bminus").attr("name");
              html+="<Profile><FAB_COD>"+el.substr(el.indexOf("/")+1, el.length)+"</FAB_COD><PERF_COD>3</PERF_COD>";
              html+="<TP_FAB_COD>2</TP_FAB_COD></Profile>";
            });
            console.log(html);
          }
        });
        this.callService("GravarFornecedorProfile",'<Forn_ID>'+this.item.FORN_ID+'</Forn_ID>',html);
        break;
      case 'composition':
        var html="";
        console.log(this.tab);
        console.log(this.lasttab);
        $(".comp-rem .row-item").each(function(a,b){
          var el=$(b).find(".bminus").attr("name");
          html+="<string>"+el.substr(el.indexOf("/")+1, el.length)+"</string>";
        });
        this.callService("GravarFornecedorComposicao",'<FORN_ID>'+this.item.FORN_ID+'</FORN_ID>',html);
        break;
      case 'products':
        console.log(this.tab);
        console.log(this.lasttab);
        var html="";
        console.log(this.tab);
        console.log(this.lasttab);
        $(".prod-rem .row-item").each(function(a,b){
          var el=$(b).find(".bminus").attr("name");
          html+="<Product><PROD_COD>"+el.substr(el.indexOf("/")+1, el.length)+"</PROD_COD><PROD_OTHERS></PROD_OTHERS></Product>";
        });
        this.callService("GravarFornecedorProduto",'<Forn_ID>'+context.item.FORN_ID+'</Forn_ID>',html);
        break;
      case 'markets':
        console.log(this.tab);
        console.log(this.lasttab);
        $(".mark-rem .row-item").each(function(a,b){
          var el=$(b).find(".bminus").attr("name");
          html+="<int>"+el.substr(el.indexOf("/")+1, el.length)+"</int>";
        });
        this.callService("GravarFornecedorMercado",'<Forn_ID>'+context.item.FORN_ID+'</Forn_ID>',html);
        break;
    }
    /*$("#"+this.tab).find("input[required='required']").each(function(a,b){
      console.dir(b);
    });*/
  }
  else{
    if(this.lasttab && this.tab !=="dados" && !this.setfair){
      alert("Selecione uma feira");
    }
  }
  //this.setloading(!1);
  //console.dir($("input[required='required']"));
},reload:function(code) {
  "use strict";
  var result;
  this.setloading(!0,!1);
  this.item = {};
  result=[];
  this.reset();
  if(!isNaN(code)){
    result=this.getdata(code);
  }
  if(result.length){
    this.open(result[0]);
  }
  else{
    this.open(this.item);
    //this.open(jQuery.parseJSON('{"AMOS_COD":null,"AMOS_COTACAO_KG":0,"AMOS_COTACAO_M":0,"AMOS_DESC":"TESTE NACIONAL","AMOS_ENV_EMAIL":0,"AMOS_GRAMATURA_M":0,"AMOS_GRAMATURA_ML":0,"AMOS_HOMOLOGAR":0,"AMOS_ID":200000101,"AMOS_LARGURA_TOTAL":0,"AMOS_LARGURA_UTIL":0,"AMOS_ONCAS":0,"AMOS_PRECO":0,"AMOS_PRECO_UM":"","AMOS_STATUS":0,"BASE_COD":null,"BASE_DESC":"","COMPOSITIONS":[{"COMP_COD":"CJ ","COMP_DESC":"JUTE","TP_COMP_ID":0},{"COMP_COD":"CJ ","COMP_DESC":"JUTE","TP_COMP_ID":0}],"CREATE_DATE":"\/Date(1339642800000-0300)\/","FEIR_COD":"1 ","FEIR_DESC":"FOCUS TEXTIL - Sao Paulo\/Brazil","FLAG_FISICA":0,"FLAG_PRIORIDADE":0,"FORN_DESC":"TESTE FORNECEDOR IMPORTADORNECEDOR","FORN_ID":4200083,"GRUP_COD":null,"GRUP_DESC":"","IMG_PATH_SAMPLE":"","IMG_PATH_TICKET":"","NOTES":[],"SEGM_COD":"ML","SEGM_DESC":null,"SUBG_COD":null,"SUBG_DESC":"","TECI_COD":null,"TECI_DESC":"","USU_COD":36}'));
  }
  /*result=this.getdata(code);
  console.dir(result);
  if(result.length){
    this.open(result[0]);
    this.nextsample=result[1];
  }
  else{
    //this.open(jQuery.parseJSON('{"AMOS_COD":null,"AMOS_COTACAO_KG":0,"AMOS_COTACAO_M":0,"AMOS_DESC":"TESTE NACIONAL","AMOS_ENV_EMAIL":0,"AMOS_GRAMATURA_M":0,"AMOS_GRAMATURA_ML":0,"AMOS_HOMOLOGAR":0,"AMOS_ID":200000101,"AMOS_LARGURA_TOTAL":0,"AMOS_LARGURA_UTIL":0,"AMOS_ONCAS":0,"AMOS_PRECO":0,"AMOS_PRECO_UM":"","AMOS_STATUS":0,"BASE_COD":null,"BASE_DESC":"","COMPOSITIONS":[{"COMP_COD":"CJ ","COMP_DESC":"JUTE","TP_COMP_ID":0},{"COMP_COD":"CJ ","COMP_DESC":"JUTE","TP_COMP_ID":0}],"CREATE_DATE":"\/Date(1339642800000-0300)\/","FEIR_COD":"1 ","FEIR_DESC":"FOCUS TEXTIL - Sao Paulo\/Brazil","FLAG_FISICA":0,"FLAG_PRIORIDADE":0,"FORN_DESC":"TESTE FORNECEDOR IMPORTADORNECEDOR","FORN_ID":4200083,"GRUP_COD":null,"GRUP_DESC":"","IMG_PATH_SAMPLE":"","IMG_PATH_TICKET":"","NOTES":[],"SEGM_COD":"ML","SEGM_DESC":null,"SUBG_COD":null,"SUBG_DESC":"","TECI_COD":null,"TECI_DESC":"","USU_COD":36}'));
    this.open(jQuery.parseJSON('{"AMOS_COD":null,"AMOS_COTACAO_KG":0,"AMOS_COTACAO_M":0,"AMOS_DESC":"TESTE NACIONAL","AMOS_ENV_EMAIL":0,"AMOS_GRAMATURA_M":0,"AMOS_GRAMATURA_ML":0,"AMOS_HOMOLOGAR":0,"AMOS_ID":200000101,"AMOS_LARGURA_TOTAL":0,"AMOS_LARGURA_UTIL":0,"AMOS_ONCAS":0,"AMOS_PRECO":0,"AMOS_PRECO_UM":"","AMOS_STATUS":0,"BASE_COD":null,"BASE_DESC":"","COMPOSITIONS":[{"COMP_COD":"CA ","COMP_DESC":"ACETATE","TP_COMP_ID":0},{"COMP_COD":"CJ ","COMP_DESC":"JUTE","TP_COMP_ID":0}],"CREATE_DATE":"\/Date(1339642800000-0300)\/","FEIR_COD":"1 ","FEIR_DESC":"FOCUS TEXTIL - Sao Paulo\/Brazil","FLAG_FISICA":0,"FLAG_PRIORIDADE":0,"FORN_DESC":"TESTE FORNECEDOR IMPORTADORNECEDOR","FORN_ID":4200083,"GRUP_COD":null,"GRUP_DESC":"","IMG_PATH_SAMPLE":"","IMG_PATH_TICKET":"","NOTES":[{"CREATE_DATE":"\/Date(1436508000000-0300)\/","NOTA_DESC":"Teste de Anotação2","NOTA_ID":339,"OBJ_ID":200000101,"PLAT_ID":0,"SEGM_DESC":"Todos ","TP_NOTA_ID":2,"USU_COD":36,"USU_NOME":"JACQUES STERN"}],"SEGM_COD":"ML","SEGM_DESC":null,"SUBG_COD":null,"SUBG_DESC":"","TECI_COD":null,"TECI_DESC":"","USU_COD":36}'));
  }*/
},reset:function(){
  this.item = {};
  this.isviewforn=!1;
  this.waitingfav=!1; // No final confirmo se o favorito ja foi setado, porque caso o usuario click no botao sem ter um favorito salvo, deixo para o final
  this.setfair=null;
  this.fav=0;
  this.favcontact=[{'ordem':1,'fav':0},{'ordem':2,'fav':0}];
  this.ajaxrequest=!1;
  this.tab="";
  this.lasttab="";
  this.scroller=0;
},init:function() {
  this.item = {};
  this.isviewforn=!1;
  this.waitingfav=!1; // No final confirmo se o favorito ja foi setado, porque caso o usuario click no botao sem ter um favorito salvo, deixo para o final
  this.setfair=null;
  this.fav=0;
  this.favcontact=[{'ordem':1,'fav':0},{'ordem':2,'fav':0}];
  this.ajaxrequest=!1;
  this.tab="";

  //Na linha abaixo, na segunda, utilizarei para saber se uma tab ja foi salva ou não, porque caso ja tenha sido salva, não vou salvar dinovo qual o cara voltar. Se nao tiver sido salva ainda eu volto
  //Posso realizar um listener nos inputs da pagina se ao mudar o valor, busco o closest(nav-item) e vejo o href, entao produto no array, se ja foi salva, seto para false pra salvar denovo
  //this.tab=[{'tab':'dados','save':0},{'tab':'profile','fav':0},{'tab':'composition','fav':0},{'tab':'products','fav':0},{'tab':'markets','fav':0}];
  this.lasttab="";
  this.scroller=0;
}});