/**
*@fileOverview Detail's page with Fornecedores's Cadastre
* @module Detail
* @module Fornecedores
*
*/

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
  var cookie;
  //window.history.go(-1);
  //$(window).scrollTop(this.scrollp);

  cookie=$.cookie("posscroll"+"amostras");
  this.on = !1;
  this.mode="amostras/"+(cookie.fairval || "padrao")+"/"+(cookie.fornval || "padrao")+"/"+(cookie.amosval || "padrao");
  this.navigate(this.mode, !0);
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
  $(".bprev-detail").unbind("click").bind("click",function(){
    context.previousSample();
    return !1;
  });
  $(".btrash-big").bind("click",function(){
    context.deleteNote();
    return !1;
  });
  $(".bplus-big").bind("click",function(a){
    context.plusNote(a);
    return !1;
  });
  $(".savenote").unbind("click").bind("click",function(a){
    context.saveNote(a);
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

  var homologado,note,fisica,fav,email,annex,status,context=this,result="";
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
  //result+='<li><a href="#bannex_file" class="caption-icons-icon oneline bannex_file has">Anexar<br/> Arquivo</a><input type="file" name="pic" class="hide"></li>';
  //result+='<li><a href="#bannex" class="caption-icons-icon oneline bannex has">Arquivos<br/> Anexos</a></li>';
  $(".description-overview.description-top ul").html(result);
  

  //TOP DO DETALHE, LISTA DE VALORES
  var list=[/*"AMOS_DESC",*/"FEIR_DESC","FORN_DESC","CREATE_DATE"/*,"AMOS_PRECO_UM","AMOS_PRECO"*/];
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
    result+=""+item.TECI_DESC+"<br/>";
    result+="</td>";
  }
  else{
    result+="<td> - </td>";
  }
  
  if(item.BASE_DESC){
    result+="<td>";
    result+=""+item.BASE_DESC+"<br/>";
    result+="</td>";
  }
  else{
    result+="<td> - </td>";
  }
  if(item.GRUP_DESC){
    result+="<td>";
    result+=""+item.GRUP_DESC+"<br/>";
    result+="</td>";
  }
  else{
    result+="<td> - </td>";
  }
  if(item.SUBG_DESC){
    result+="<td>";
    result+=""+item.SUBG_DESC+"<br/>";
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
    $(b).val(item[$(b).attr("name").replace(".",",")]);
  });
  $(".AMOS_PRECO_UM option").each(function(a,b){
    //console.dir(item["AMOS_PRECO_UM"]);
    if($(b).attr("value") === item["AMOS_PRECO_UM"]){
      $(b).attr("selected","selected");
    }
  });


  //ANOTAÇÕES
  if(note){
    var segnote=[],result="";
    for(i=0;i<item.NOTES.length;i++){
      if(item.NOTES[i].SEGM_COD === this.usr.SEGM_COD || this.usr.SEGM_COD === "TD"){
        segnote.push(item.NOTES[i]);
      }
    }
    if(segnote.length){
      for(i=0;i<segnote.length;i++){
        result+="<li><article><div class='notepad-note blockquote'><p><b>"+segnote[i].CREATE_DATE+" | "+item.FORN_ID+" - "+item.FORN_DESC+" | "+segnote[i].NOTA_ID+" - "+item.AMOS_DESC+"</b></p><p>"+segnote[i].USU_NOME+" - "+segnote[i].SEGM_DESC+"</p><p>"+segnote[i].NOTA_DESC+"</p></div><div class='blockquote'>";
        if(segnote[i].USU_COD === this.usr.USU_COD || this.usr.SEGM_COD === "TD"){
          result+= "<button type='button' class='tooltip-item caption-icons-icon btrash-big viewer' title='"+segnote[i].NOTA_ID+"' name='"+segnote[i].USU_COD+"'></button>";
        }
        result+="</div></article></li>";
      }
      result+="</ul></td>";
    }
    else{
      result+="</ul></td>";
    }
  }
  else{
    result="";
  }
  $(".description-noteside .note ul").append(result);
  $(".bplus-big").attr("name",item.AMOS_ID);
  $(".bannex_file").bind("click",function(a){
    a.preventDefault();
    $(a.target).parent().find("input").trigger('click');
  });
  $(".bannex").bind("click",function(a){
    a.preventDefault();
    context.modal.open("message","Elemento de deletar amostra não ativo no momento!!!",!1,!0);
  });

},writeNote:function(){
  var result="";
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

  date=day+"/"+month+"/"+date.getFullYear();

  var item={
    "CREATE_DATE":date,
    "NOTA_DESC":$(".samplenote").val(),
    "NOTA_ID":this.noteid
  };
  this.item.NOTES.push(item);
  result+="<li><article><div class='notepad-note blockquote'><p><b>"+date+" | "+this.item.FORN_ID+" - "+this.item.FORN_DESC+" | "+this.noteid+" - "+this.item.AMOS_DESC+"</b></p><p>"+this.usr.USU_NOME+" - "+this.usr.SEGM_DESC+"</p><p>"+$(".samplenote").val()+"</p></div><div class='blockquote'><button type='button' class='tooltip-item caption-icons-icon btrash-big' id='"+this.noteid+"' name='"+this.usr.USU_COD+"'></button></div></article></li>";
  $(".samplenote").val("");
  $(".description-noteside .note ul").prepend(result);
},showImage:function(a){
  var html="",item=this.item,name=$(a.target).attr("name");
  if(!$(a.target).hasClass('sel')){
    $(".zoomContainer").remove();
    $(".sample-buttons button").removeClass('sel');
    $(a.target).addClass('sel');
    html='<button class="icon bzoom"></button>';
    if(item[name]){
      //html+='<img id="zoom" src="//bdb/ifair_img/'+item[name].replace("thumb","large")+'" data-zoom-image="//bdb/ifair_img/'+item[name].replace("thumb","large")+'"/>';
      html+='<img id="zoom" src="'+imgPath+item[name].replace("thumb","large")+'" data-zoom-image="'+imgPath+item[name].replace("thumb","large")+'"/>';
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
  var html="",item=this.item,complet=1;
  $(".detail-description").find("input").each(function(a,b){
    html+="<"+$(b).attr("name")+">"+$(b).val().replace(",",".")+"</"+$(b).attr("name")+">";
    if($(b).attr('required')){
      if(item.COMPOSITIONS.length){  
        if((parseInt($(b).val()) === 0) || !$(b).val().length){
          complet=0; 
        }
      }
      else{
        complet=0;
      }
    }
    
  });
  html+="<AMOS_PRECO_UM>"+$(".AMOS_PRECO_UM option:selected").attr("value")+"</AMOS_PRECO_UM>";
  pattern="<AMOS_ID>"+item.AMOS_ID+"</AMOS_ID><FORN_ID>"+item.FORN_ID+"</FORN_ID><FEIR_COD>"+parseInt(item.FEIR_COD)+"</FEIR_COD><USU_COD>"+item.USU_COD+"</USU_COD><AMOS_STATUS>"+complet+"</AMOS_STATUS><AMOS_ENV_EMAIL>"+item.AMOS_ENV_EMAIL+"</AMOS_ENV_EMAIL><TECI_COD>"+(item.TECI_COD || "")+"</TECI_COD><BASE_COD>"+(item.BASE_COD || "")+"</BASE_COD><GRUP_COD>"+(item.GRUP_COD || "")+"</GRUP_COD><SUBG_COD>"+(item.SUBG_COD || "")+"</SUBG_COD><SEGM_COD>"+item.SEGM_COD+"</SEGM_COD><FLAG_PRIORIDADE>"+item.FLAG_PRIORIDADE+"</FLAG_PRIORIDADE><AMOS_HOMOLOGAR>"+item.AMOS_HOMOLOGAR+"</AMOS_HOMOLOGAR><FLAG_FISICA>"+item.FLAG_FISICA+"</FLAG_FISICA><CREATE_DATE>"+"2015-01-01"+"</CREATE_DATE>";
  if(complet){
    $(".detail-status .bstatus").removeClass('incomplet').addClass('complet');
  }
  else{
    $(".detail-status .bstatus").removeClass('complet').addClass('incomplet');
  }
  this.setloading(!0,!1);
  this.callService("gravarAmostras",pattern,html,'U');
},deleteSample:function(){
  this.modal.open("message","Elemento de deletar amostra não ativo no momento!!!",!1,!0);
},nextSample:function(){
  if(!this.nextsample){
    this.modal.open("message","Carregue mais itens na busca!!!",!1,!0);
    return !1;
  }
  $(".sample-buttons button").eq(1).trigger('click');
  this.reload(this.nextsample.FEIR_COD,this.nextsample.AMOS_ID);
},previousSample:function(){
  if(!this.previoussample){
    this.modal.open("message","Este é o primeiro item na busca!!!",!1,!0);
    return !1;
  }
  $(".sample-buttons button").eq(1).trigger('click');
  this.reload(this.previoussample.FEIR_COD,this.previoussample.AMOS_ID);
},plusNote:function(a){
  $(a.target).addClass('hide');
  $(".show-to-note").find("div").removeClass('hide');
  //this.callService("gravarNotes");
},saveNote:function(){
  if($(".samplenote").val().length){
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
    this.callService("gravarNotes","<OBJ_ID>"+this.item.AMOS_ID+"</OBJ_ID><TP_NOTA_ID>1</TP_NOTA_ID><USU_COD>"+this.usr.USU_COD+"</USU_COD>","<NOTA_DESC>"+$(".samplenote").val()+"</NOTA_DESC><SEGM_COD>"+this.usr.SEGM_COD+"</SEGM_COD><CREATE_DATE>"+date+"</CREATE_DATE>");
  }
  else{
    this.modal.open("message","Digite o texto da anotação!!!",!1,!0);
  }
},reload:function(fair,code) {
  "use strict";
  var result;
  this.setloading(!0,!1);
  result=this.getdata(code);
  $(".description-noteside .note li").remove();
  $(".bplus-big").removeClass('hide');
  $(".show-to-note").find("div").addClass('hide');
  if(result.length){
    this.open(result[0]);
    this.nextsample=result[2];
    this.previoussample=result[1]
  }
  else{
    //this.open(jQuery.parseJSON('{"AMOS_COD":null,"AMOS_COTACAO_KG":0,"AMOS_COTACAO_M":0,"AMOS_DESC":"TESTE NACIONAL","AMOS_ENV_EMAIL":0,"AMOS_GRAMATURA_M":0,"AMOS_GRAMATURA_ML":0,"AMOS_HOMOLOGAR":0,"AMOS_ID":200000101,"AMOS_LARGURA_TOTAL":0,"AMOS_LARGURA_UTIL":0,"AMOS_ONCAS":0,"AMOS_PRECO":0,"AMOS_PRECO_UM":"","AMOS_STATUS":0,"BASE_COD":null,"BASE_DESC":"","COMPOSITIONS":[{"COMP_COD":"CJ ","COMP_DESC":"JUTE","TP_COMP_ID":0},{"COMP_COD":"CJ ","COMP_DESC":"JUTE","TP_COMP_ID":0}],"CREATE_DATE":"\/Date(1339642800000-0300)\/","FEIR_COD":"1 ","FEIR_DESC":"FOCUS TEXTIL - Sao Paulo\/Brazil","FLAG_FISICA":0,"FLAG_PRIORIDADE":0,"FORN_DESC":"TESTE FORNECEDOR IMPORTADORNECEDOR","FORN_ID":4200083,"GRUP_COD":null,"GRUP_DESC":"","IMG_PATH_SAMPLE":"","IMG_PATH_TICKET":"","NOTES":[],"SEGM_COD":"ML","SEGM_DESC":null,"SUBG_COD":null,"SUBG_DESC":"","TECI_COD":null,"TECI_DESC":"","USU_COD":36}'));
    this.open(jQuery.parseJSON('{"AMOS_COD":null,"AMOS_COTACAO_KG":0,"AMOS_COTACAO_M":0,"AMOS_DESC":"TESTE NACIONAL","AMOS_ENV_EMAIL":0,"AMOS_GRAMATURA_M":0,"AMOS_GRAMATURA_ML":0,"AMOS_HOMOLOGAR":0,"AMOS_ID":200000101,"AMOS_LARGURA_TOTAL":0,"AMOS_LARGURA_UTIL":0,"AMOS_ONCAS":0,"AMOS_PRECO":0,"AMOS_PRECO_UM":"","AMOS_STATUS":0,"BASE_COD":null,"BASE_DESC":"","COMPOSITIONS":[{"COMP_COD":"CA ","COMP_DESC":"ACETATE","TP_COMP_ID":0},{"COMP_COD":"CJ ","COMP_DESC":"JUTE","TP_COMP_ID":0}],"CREATE_DATE":"\/Date(1339642800000-0300)\/","FEIR_COD":"1 ","FEIR_DESC":"FOCUS TEXTIL - Sao Paulo\/Brazil","FLAG_FISICA":0,"FLAG_PRIORIDADE":0,"FORN_DESC":"TESTE FORNECEDOR IMPORTADORNECEDOR","FORN_ID":4200083,"GRUP_COD":null,"GRUP_DESC":"","IMG_PATH_SAMPLE":"","IMG_PATH_TICKET":"","NOTES":[{"CREATE_DATE":"\/Date(1436508000000-0300)\/","NOTA_DESC":"Teste de Anotação2","NOTA_ID":339,"OBJ_ID":200000101,"PLAT_ID":0,"SEGM_DESC":"Todos ","TP_NOTA_ID":2,"USU_COD":36,"USU_NOME":"JACQUES STERN"}],"SEGM_COD":"ML","SEGM_DESC":null,"SUBG_COD":null,"SUBG_DESC":"","TECI_COD":null,"TECI_DESC":"","USU_COD":36}'));
  }
},init:function() {
  this.item = null;
  this.nextsample=null;
  this.previoussample=null;
  this.on=!1;
}});

/**
* Fornecedores's class and actions
* @exports Fornecedores
* @constructor
*/
window.Fornecedores = Spine.Controller.sub({
elements:{

}, events:{
},close:function(a) {
  //this.el.hide();
  if(a){
    if(!this.item.FORN_ID){
      this.modal.open("message","O Fornecedor ainda não foi salvo! Deseja realmente voltar?", this.proxy(this.requestCancel),!0, !0);
      return !1;
    }
    if(this.tab === this.lasttab){
      this.tab="profile";
    }
    else{
      this.lasttab=this.tab;
      if(this.tab !== "dados"){
        this.tab = "dados";
      }
      else{
        if(this.tab === "profile"){
          this.tab = "compositions";
        }
        else{
          this.tab = "profile";
        }
      }
    }
    this.saveForn(!0);
  }
  else{
    //console.log("saiu");
    this.on = !1;
    window.history.go(-1);
  }
  
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
  $("#profile .row-top .bcircle").bind("click",function(a){context.setTopProfile(a);});
  $("#profile .row-down .bsquare").bind("click",function(a){context.setDownProfile(a);});
  $("#profile .bmore").bind("click",function(a){context.addElem(a,!1);});
  $("#composition .bmore").bind("click",function(a){context.addElem(a,!0);});
  $("#products .bmore").bind("click",function(a){context.addElem(a,!0);});
  $("#markets .bmore").bind("click",function(a){context.addElem(a,!0);});
  $(".delete").bind("click",function(a){context.removeAll(a);});
  $("button.fav-big").bind("click",function(a){context.setFav(a);});  //setFavorito
  $(".finishit").bind("click",function(a){context.finishForn(a);});
  $(".savenote").bind("click",function(a){context.saveNote(a);});
  $(".form-control-bmore").bind("click",function(a){context.stopOnMore(a);});
  $(".form-control-bmore").bind("keyup",function(a){context.setOthers(a);});
  $(".gotop").bind("click",function(a){context.goTop();});
  $(".goback").bind("click",function(a){context.close(a);});

  /*if(!$("html").hasClass('view_forn')){
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
  });*/
},
open: function(a){
  "use strict";
  var context=this;
  this.item = a;

  if(!this.item){
    return !1;
  }
  //console.dir(this.item);
  this.setFornClick=this.item.FORN_DESC;
  this.savingCookie("fornecedores",!0,this.item.FORN_DESC);
  //$("html").attr("class","fornecedor_cadastro edit_forn");
  $("input").removeAttr('disabled');
  $("select").removeAttr('disabled');
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
  if(this.item.CONTACTS){
    if(this.item.CONTACTS.length){
      //Filtrando contatos do segmento correto
      var aux=[],i;
      aux=this.item.CONTACTS;
      this.item.CONTACTS=[];
      for(i=0;i<aux.length;i++){
        if(aux[i].SEGM_COD === this.usr.SEGM_COD || this.usr.SEGM_COD === "TD"){
          this.item.CONTACTS.push(aux[i]);
        }
      }
      if(this.item.CONTACTS.length){
        this.populateForn();
      }
      else{
        this.populateForn();
      }
    }
    else{
      this.populateForn();
    }
  }
  else{
    this.populateForn();
  }
  

},requestCancel:function(){
  this.on = !1;
  this.setFornClick="";
  this.savingCookie("fornecedores",!0,"");
  window.location.hash="fornecedores";
},stopOnMore:function(ev){
  ev.stopPropagation();
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
    if(context.tab === "dados"){
      $("form").attr('class', 'dados');
    }
    else{
      $("form").removeAttr('class');
    }
    $(".ScrollSpy").find(".nav-item")
     .parent().removeClass("active")
     .end().filter("[href=#"+context.tab+"]").parent().addClass("active");
    context.saveForn();
  });
},scrollTab:function(a){

},deleteFornNote:function(a){
  $(".contact"+$(a.target).attr("name")).addClass('hide');
  
},showSomething:function(a){
  if($("html").hasClass('view_forn')){
    return !1;
  }
  var a=$(a.target);
  a.addClass('hide');
  switch (a.attr("name")){
    case 'CONT_TEL2':
      // id="'+(length+1)+'"
      $(".contact"+a.attr("id")).find(".CONT_TEL2").removeClass('hide');
      //$("."+a.attr("name")).removeClass('hide');
      break;
    case 'showcontact':
      var context=this;length=$(".cont.actived").length;
      $(".contact"+(length+1)).addClass('actived');
      var template="";
      template+='<div class="supplier-photo-side"><div class="photo-container">';
      template+='<img src="images/contact.png" width="100%" class="noimage">';
      template+='</div></div><div class="supplier-firstform"><div class="row"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="text" class="form-control" name="CONT_NOME" placeholder="Nome" autofocus="" autocomplete="off"></div></div><button type="button" class="icon floatLeft trash-big" name="'+(length+2)+'"></button></div><div class="row"><div class="fake-form"><div class="form-group"><input type="text" class="form-control" name="CONT_EMAIL" placeholder="E-mail" autofocus="" autocomplete="off"></div></div></div><div class="row top-ten"><div class="fake-form fake-form-supplier-equal floatLeft">';
      template+='<button type="button" class="tooltip-item tooltip-item-supplier caption-icons-icon bcircle favcontact" name="'+(length+2)+'">Contato Principal </button>';
      template+='</div><div class="fake-form fake-form-supplier-equal right"><div class="form-group"><input type="text" class="form-control" name="SEGM_COD" placeholder="Segmento" autofocus="" autocomplete="off" value="'+this.usr.SEGM_DESC+'" disabled="disabled" title="'+this.usr.SEGM_COD+'"></div></div></div><div class="row"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="tel" class="form-control" name="CONT_TEL" placeholder="Tel 1" autofocus="" autocomplete="off"></div></div><button type="button" class="icon floatLeft bplus-big teste" name="CONT_TEL2" id="'+(length+2)+'"></button></div><div class="row CONT_TEL2 top-ten hide"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="tel" class="form-control" name="CONT_TEL2" placeholder="Tel 2" autofocus="" autocomplete="off"></div></div></div></div></div>';
      template='<div class="supplier-form-container contact contact'+(length+2)+' cont"><h2><span>Contato '+(length+2)+'</span><button type="button" class="icon floatLeft bplus-big" name="showcontact"></button></h2>'+template+'</div>';
      $("#dados .contact-container").append(template);
      $(".bplus-big").unbind("click").bind("click",function(a){context.showSomething(a);});
      $(".trash-big").bind("click",function(a){context.deleteFornNote(a);});
      $(".favcontact").unbind("click").bind("click",function(a){context.setFavContact(a);});
      $(".photo-container img").bind("click",function(a){context.showCard(a);});
      break;
    case 'shownote':
      $(".show-to-note").find("div").removeClass('hide');
      break;
  }
},setTopProfile:function(a){
  if($("html").hasClass('view_forn')){
    return !1;
  }
  var el=$(a.target);
  if(el.attr("name") === "3"){
    if(el.hasClass('sel')){
      $("#profile .row-top .bcircle").removeClass('sel');
      $(".sel-factory.is-sel").addClass("hide");
    }
    else{
      $("#profile .row-top .bcircle").removeClass('sel');
      el.addClass('sel');
      $(".sel-factory.is-sel").removeClass("hide");
    }
  }
  else{
    if(el.hasClass('sel')){
      $("#profile .row-top .bcircle").removeClass('sel');
    }
    else{
      $("#profile .row-top .bcircle").removeClass('sel');
      el.addClass('sel');
    }
    $(".sel-factory.is-sel").addClass("hide");
  }
},setDownProfile:function(a){
  if($("html").hasClass('view_forn')){
    return !1;
  }
  var el=$(a.target);
  if(el.attr("name") === "9999"){
    if(el.hasClass('sel')){
      el.removeClass('sel');
      $(".form-control-other").attr('disabled', 'disabled');
    }
    else{
      el.addClass('sel');
      $(".form-control-other").removeAttr('disabled');
    }
    //Mostra caixa de texto
    
  }
  else{
    if(el.hasClass('sel')){
      el.removeClass('sel');
    }
    else{
      el.addClass('sel');
    }
  }
},addElem:function(a,b){
  if($("html").hasClass('view_forn')){
    return !1;
  }
  var el=$(a.target),html="",context=this;
  name=el.attr("name");
  pos_string=name.indexOf("/")+1;
  cod_detalhe=name.substr(pos_string, name.length);
  group=name.substr(0,pos_string-1);
  if(b){
    if(cod_detalhe == "9999" || cod_detalhe == "999"){
      if(!el.find("input").val().length || el.find("input").val() === "Digite o valor e tecle enter:"){
        el.find("input").val("Digite o valor e tecle enter:");
        return !0;
      }
      else{
        html+='<div class="row row-fixed row-item"><button type="button" class="tooltip-item tooltip-item-supplier caption-icons-icon bminus" name="'+name+'">'+'<input type="text" class="form-control form-control-bmore" name="'+name+'" placeholder="Other" autocomplete="off" disabled="disabled" value="'+el.find("input").val()+'"/></button></div>';
      }
    }
    else{
      html+='<div class="row row-fixed row-item"><button type="button" class="tooltip-item tooltip-item-supplier caption-icons-icon bminus" name="'+name+'">'+el.text()+'</button></div>';
    }
  }
  else{
    html+='<div class="row row-item"><button type="button" class="tooltip-item tooltip-item-supplier caption-icons-icon bminus" name="'+name+'">'+el.text()+'</button></div>';
  }

  el.addClass("hide").parent().addClass("hide");
  $("."+group+"-rem").append(html);
  $(".bminus").bind("click",function(a){context.remElem(a);});
},setOthers:function(a){
  if($("html").hasClass('view_forn')){
    return !1;
  }

  var name,pos_string,cod_detalhe,group,html="",context=this;
  var el=$(a.target);
  name=el.attr("name");
  pos_string=name.indexOf("/")+1;
  cod_detalhe=name.substr(pos_string, name.length);
  group=name.substr(0,pos_string-1);
  if(13 === a.keyCode){
    html+='<div class="row row-fixed row-item"><button type="button" class="tooltip-item tooltip-item-supplier caption-icons-icon bminus" name="'+name+'">'+'<input type="text" class="form-control form-control-bmore" name="'+name+'" placeholder="Other" autocomplete="off" disabled="disabled" value="'+el.val()+'"/></button></div>';
    el.parent().addClass("hide");
    $("."+group+"-rem").append(html);
    $(".bminus").bind("click",function(a){context.remElem(a);});
  }
},removeAll:function(a){
  if($("html").hasClass('view_forn')){
    return !1;
  }
  var el=$(a.target);
  $('.'+el.attr('name')+"-rem").find(".row-item").remove();
  $("."+el.attr('name')+"-add .row .hide").each(function(a,b){
    $(b).removeClass('hide').parent().removeClass('hide');
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
  $("."+group+"-add .row .hide").each(function(a,b){
    if($(b).attr("name").substr($(b).attr("name").indexOf("/")+1, $(b).attr("name").length) == cod_detalhe){
      $(b).removeClass('hide').parent().removeClass('hide');
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
    if(!this.setfair || !$("input[name='FORN_DESC']").val()){
      this.modal.open("message","Fornecedor e/ou Feira não selecionados",!1,!0);
      return !1;
    }
    this.fav=1;
    el.addClass('sel');
  }
  if(this.item.FORN_ID){
    this.ajaxrequest=!0;
    if(this.item.FAVORITES.length){
      if(!el.hasClass('sel')){
        for(i=0;i<this.item.FAVORITES.length;i++){
          if(this.item.FAVORITES[i].SEGM_COD !== this.usr.SEGM_COD){
            html+="<string>"+this.item.FAVORITES[i].SEGM_COD+"</string>";
          }
        }
      }
      else{
        for(i=0;i<this.item.FAVORITES.length;i++){
          html+="<string>"+this.item.FAVORITES[i].SEGM_COD+"</string>";
        }
        html+="<string>"+this.usr.SEGM_COD+"</string>";
      }
    }
    else{
      if(el.hasClass('sel')){
        html+="<string>"+this.usr.SEGM_COD+"</string>";
      }
      else{
        html+="<string></string>";
      }
    }
    this.callService("GravarFornecedorFavorito",'<Forn_ID>'+this.item.FORN_ID+'</Forn_ID>',html);
  }
  else{ 
    if(!this.setfair || !$("input[name='FORN_DESC']").val()){
      this.modal.open("message","Fornecedor e/ou Feira não selecionados",!1,!0);
      return !1;
    }

    var context=this;
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

    context.setloading(!0,!1);
    context.ajaxrequest=!0;
    context.callService("GravarFornecedor",'<FORN_ID>0</FORN_ID>','<FEIR_COD>'+context.setfair+'</FEIR_COD>',"<FORN_DESC>"+$("input[name='FORN_DESC']").val()+"</FORN_DESC><CREATE_DATE>"+date+"</CREATE_DATE><FORN_STATUS>0</FORN_STATUS><FORN_INATIVO>0</FORN_INATIVO>","<USU_COD>"+context.usr.USU_COD+"</USU_COD>",'<action>I</action>');
    var status;
    status=setInterval(function(){
      if(!context.ajaxrequest){
        context.callService("GravarFornecedorFavorito",'<Forn_ID>'+context.item.FORN_ID+'</Forn_ID>',"<string>"+context.usr.SEGM_COD+"</string>");
        //this.callService("GravarFornecedor",'<FORN_ID>0</FORN_ID>',',,'<action>I</action>');
        clearInterval(status);
      }
    },100);
    context.setloading(!1);
    return !0;
  }

},saveNote:function(){
  if($("html").hasClass('view_forn')){
    return !1;
  }
  if(!this.setfair || !$("input[name='FORN_DESC']").val()){
    this.modal.open("message","Fornecedor e/ou Feira não selecionados",!1,!0);
    return !1;

  }

  var context=this;
  var day,date,month,status;
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

  if($(".addnote").val().length){
    if(this.item.FORN_ID){
      this.callService("gravarNotes","<OBJ_ID>"+this.item.FORN_ID+"</OBJ_ID><TP_NOTA_ID>2</TP_NOTA_ID><USU_COD>"+this.usr.USU_COD+"</USU_COD>","<NOTA_DESC>"+$(".addnote").val()+"</NOTA_DESC><SEGM_COD>"+this.usr.SEGM_COD+"</SEGM_COD><CREATE_DATE>"+date+"</CREATE_DATE>");
    }
    else{
      context.setloading(!0,!1);
      context.ajaxrequest=!0;
      context.callService("GravarFornecedor",'<FORN_ID>0</FORN_ID>','<FEIR_COD>'+context.setfair+'</FEIR_COD>',"<FORN_DESC>"+$("input[name='FORN_DESC']").val()+"</FORN_DESC><CREATE_DATE>"+date+"</CREATE_DATE><FORN_STATUS>0</FORN_STATUS><FORN_INATIVO>0</FORN_INATIVO>","<USU_COD>"+context.usr.USU_COD+"</USU_COD>",'<action>I</action>');
      status=setInterval(function(){
        if(!context.ajaxrequest){
          context.callService("gravarNotes","<OBJ_ID>"+context.item.FORN_ID+"</OBJ_ID><TP_NOTA_ID>2</TP_NOTA_ID><USU_COD>"+context.usr.USU_COD+"</USU_COD>","<NOTA_DESC>"+$(".addnote").val()+"</NOTA_DESC><CREATE_DATE>"+date+"</CREATE_DATE>");
          clearInterval(status);
        }
      },100);
      context.setloading(!1);
      return !0;
    }
  }
  else{
    this.modal.open("message","Digite o texto da anotação!!!",!1,!0);
  }
},writeNote:function(){
  var result="";
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
  date=day+"/"+month+"/"+date.getFullYear();
  result+="<li><article><div class='notepad-note blockquote'><p><b>"+date+" | "+(this.item.FORN_DESC || $("input[name='FORN_DESC']").val()) +" | "+this.noteid+"</b></p><p>"+this.usr.USU_NOME+" - "+this.usr.SEGM_DESC+"</p><p>"+$(".addnote").val()+"</p></div><div class='blockquote'><button type='button' class='tooltip-item caption-icons-icon btrash-big' id='"+this.noteid+"' name='"+this.usr.USU_COD+"'></button></div></article></li>";
  $(".addnote").val("");
  $(".note ul").prepend(result);
},finishForn:function(){
  this.tab="dados";
  this.lasttab="markets";
  this.saveForn(!0);
},setFavContact:function(a){
  if($("html").hasClass('view_forn')){
    return !1;
  }
  var el=$(a.target);
  if(el.hasClass('sel')){;
    this.favcontact=null;
    $(".favcontact").removeClass('sel');
  }
  else{
    this.favcontact=parseInt(el.attr("name"))-1;
    $(".favcontact").removeClass('sel');
    el.addClass('sel');
  }

},showCard:function(a){
  if($(a.target).attr("name")){
    this.item.CONTACTS.forEach(function(el,index) {
      if(parseInt(el.CONT_ID) === parseInt($(a.target).attr("name"))){
        $(".card-side img").each(function(i, elem) {
          if(el[''+$(elem).attr("name")].length){
            $(elem).attr("src",imgPath+el[''+$(elem).attr("name")]).attr("alt",parseInt(el.CONT_ID));
          }
          else{
            $(elem).attr("src",'images/camera.png').attr("alt",parseInt(el.CONT_ID));
          }
        });
      }
    });
  }
  else{
    $(".card-side img").each(function(i, elem) {
      $(elem).attr("src",'images/camera.png').attr("alt","");
    });
  }
},populateForn:function(){
  var context=this,status,statusfair;
  if(!this.getSegm().length){
    status=setInterval(function(){
      /*if(context.getSegm().length){
        context.ajaxrequest=!1;
        //context.createComponent(context.getSegm(),$(".SEGM_COD"),'segm');
        if(context.fair.length){
          context.setloading(!1);
          //context.inputValues();
        }
        clearInterval(status);
      }*/

      context.ajaxrequest=!1;
      //context.createComponent(context.getSegm(),$(".SEGM_COD"),'segm');
      if(context.fair.length){
        context.setloading(!1);
        context.inputValues();
      }
      clearInterval(status);
    },100);
  }
  else{
    //context.createComponent(context.getSegm(),$(".SEGM_COD"),'segm');
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
  var context=this,complet=!0;
  if(this.item.FORN_ID){
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
    //ANOTAÇÕES
    if(this.item.NOTES.length){
      var segnote=[];
      var result="";
      for(i=0;i<this.item.NOTES.length;i++){
        if(this.item.NOTES[i].SEGM_COD === this.usr.SEGM_COD || this.usr.SEGM_COD === "TD"){
          segnote.push(this.item.NOTES[i]);
        }
      }
      if(segnote){
        //this.setDate(segnote);
        for(i=0;i<segnote.length;i++){
          result+="<li><article><div class='notepad-note blockquote'><p><b>"+segnote[i].CREATE_DATE+" | "+this.item.FORN_ID+" - "+this.item.FORN_DESC+" | "+segnote[i].NOTA_ID+"</b></p><p>"+segnote[i].USU_NOME+" - "+segnote[i].SEGM_DESC+"</p><p>"+segnote[i].NOTA_DESC+"</p></div><div class='blockquote'>";

          if(segnote[i].USU_COD === this.usr.USU_COD || this.usr.SEGM_COD === "TD"){
            result+= "<button type='button' class='tooltip-item caption-icons-icon btrash-big viewer' title='"+segnote[i].NOTA_ID+"' name='"+segnote[i].USU_COD+"'></button>";
          }
          result+="</div></article></li>";
        }
      }
      else{
        result="";
      }
    }
    else{
      result="";
    }
    $(".note ul").append(result);

    if(context.item.CONTACTS.length>1){
      //Mais de um contato/
      //console.log("tem Mais de um contato");
      for(var i=(context.item.CONTACTS.length-1);i>=0;i--){
        var template="",temp="";
        temp='<div class="supplier-form-container contact contact'+(i+1)+' actived cont"><h2><span>Contato '+(i+1)+'</span></h2>';
        template+='<div class="supplier-photo-side"><div class="photo-container">';
        if(context.item.CONTACTS[i].IMG_PATH_CONTATO.length){
          //template+='<img src="http://bdb/ifair_img/'+context.item.CONTACTS[i].IMG_PATH_CONTATO+'" width="100%">';
          template+='<img src="'+imgPath+context.item.CONTACTS[i].IMG_PATH_CONTATO+'" width="100%" name="'+context.item.CONTACTS[i].CONT_ID+'">';
        } 
        else{
          template+='<img src="images/contact.png" width="100%" class="noimage" name="'+context.item.CONTACTS[i].CONT_ID+'">';
        } 
        template+='</div></div><div class="supplier-firstform"><div class="row"><div class="fake-form fake-form-supplier-middle"><div class="form-group">';
        template+='<input type="text" class="form-control" name="CONT_NOME" placeholder="Nome" autofocus="" autocomplete="off" value="'+context.item.CONTACTS[i].CONT_NOME+'"';
        if(i === 0){
          template+=' required="required">';
        }
        else{
          template+=' >';
        }
        
        template+='</div></div><button type="button" class="icon floatLeft trash-big" name="'+(i+1)+'"></button></div><div class="row"><div class="fake-form"><div class="form-group"><input type="text" class="form-control" name="CONT_EMAIL" placeholder="E-mail" autofocus="" autocomplete="off" value="'+context.item.CONTACTS[i].CONT_EMAIL+'"';
        
        if(i === 0){
          template+=' required="required" ></div></div></div><div class="row top-ten"><div class="fake-form fake-form-supplier-equal floatLeft">';
        }
        else{
          template+='></div></div></div><div class="row top-ten"><div class="fake-form fake-form-supplier-equal floatLeft">';;
        }

        if(context.item.CONTACTS[i].CONT_PRINCIPAL){
          context.favcontact=i;
          template+='<button type="button" class="tooltip-item tooltip-item-supplier caption-icons-icon bcircle favcontact sel" name="'+(i+1)+'">Contato Principal </button>'
        }
        else{
          template+='<button type="button" class="tooltip-item tooltip-item-supplier caption-icons-icon bcircle favcontact" name="'+(i+1)+'">Contato Principal </button>'
        }
        template+='</div><div class="fake-form fake-form-supplier-equal right"><div class="form-group"><input type="text" class="form-control" name="SEGM_COD" placeholder="Segmento" autofocus="" autocomplete="off" value="'+context.item.CONTACTS[i].SEGM_DESC+'" title="'+context.item.CONTACTS[i].SEGM_COD+'" disabled="disabled"></div></div></div><div class="row"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="tel" class="form-control" name="CONT_TEL" placeholder="Tel 1" autofocus="" autocomplete="off" value="'+context.item.CONTACTS[i].CONT_TEL+'"></div></div>';

        if(context.item.CONTACTS[i].CONT_TEL2.length){
          template+='</div><div class="row CONT_TEL2 top-ten"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="tel" class="form-control" name="CONT_TEL2" placeholder="Tel 2" autofocus="" autocomplete="off" value="'+context.item.CONTACTS[i].CONT_TEL2+'"></div></div></div></div></div>';
        }
        else{
          template+='<button type="button" class="icon floatLeft bplus-big" name="CONT_TEL2" id="'+(i+1)+'"></button></div><div class="row CONT_TEL2 top-ten hide"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="tel" class="form-control" name="CONT_TEL2" placeholder="Tel 2" autofocus="" autocomplete="off" value="'+context.item.CONTACTS[i].CONT_TEL2+'"></div></div></div></div></div>';
        }

        $("#dados .contact-container").prepend(temp+template);
      }
      
        var template="",temp="",cont="",template1="",template2="";
        template='<div class="supplier-form-container contact contact'+(context.item.CONTACTS.length+1)+' cont"><h2><span>Contato '+(context.item.CONTACTS.length+1)+'</span><button type="button" class="icon floatLeft bplus-big" name="showcontact"></button></h2>';
        template+='<div class="supplier-photo-side"><div class="photo-container">';
        template+='<img src="images/contact.png" width="100%" class="noimage">';
        template1+='</div></div><div class="supplier-firstform"><div class="row"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="text" class="form-control" name="CONT_NOME" placeholder="Nome" autofocus="" autocomplete="off"></div></div><button type="button" class="icon floatLeft trash-big" name="'+(context.item.CONTACTS.length+1)+'"></button></div><div class="row"><div class="fake-form"><div class="form-group"><input type="text" class="form-control" name="CONT_EMAIL" placeholder="E-mail" autofocus="" autocomplete="off"></div></div></div><div class="row top-ten"><div class="fake-form fake-form-supplier-equal floatLeft">';
        cont+='<button type="button" class="tooltip-item tooltip-item-supplier caption-icons-icon bcircle favcontact" name="1">Contato Principal </button>';
        template2+='</div><div class="fake-form fake-form-supplier-equal right"><div class="form-group"><input type="text" class="form-control" name="SEGM_COD" placeholder="Segmento" autofocus="" autocomplete="off" value="'+context.usr.SEGM_DESC+'" title="'+context.usr.SEGM_COD+'" disabled="disabled"></div></div></div><div class="row"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="tel" class="form-control" name="CONT_TEL" placeholder="Tel 1" autofocus="" autocomplete="off"></div></div><button type="button" class="icon floatLeft bplus-big" name="CONT_TEL2" name="CONT_TEL2" id="'+(context.item.CONTACTS.length+1)+'"></button></div><div class="row CONT_TEL2 top-ten hide"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="tel" class="form-control" name="CONT_TEL2" placeholder="Tel 2" autofocus="" autocomplete="off"></div></div></div></div></div>';
        $("#dados .contact-container").append(template+template1+cont+template2);
    }
    else{
      if(context.item.CONTACTS.length){
        var template="",temp="",cont="",template1="",template2="";
        //Tem apenas 1 contato
        //console.log("Tem apenas 1 contato");
        var template="",temp="",cont="",template2="";
        temp+='<div class="supplier-form-container contact contact1 actived cont"><h2><span>Contato 1</span></h2><div class="supplier-photo-side"><div class="photo-container">';
        if(context.item.CONTACTS[0].IMG_PATH_CONTATO.length){
          //template+='<img src="http://bdb/ifair_img/'+context.item.CONTACTS[i].IMG_PATH_CONTATO+'" width="100%">';
          template+='<img src="'+imgPath+context.item.CONTACTS[0].IMG_PATH_CONTATO+'" width="100%"  name="'+context.item.CONTACTS[0].CONT_ID+'">';        } 
        else{
          template+='<img src="images/contact.png" width="100%" class="noimage" name="'+context.item.CONTACTS[0].CONT_ID+'">';
        } 
        template1+='</div></div><div class="supplier-firstform"><div class="row"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="text" class="form-control" name="CONT_NOME" placeholder="Nome" autofocus="" autocomplete="off" value="'+context.item.CONTACTS[0].CONT_NOME+'" required="required"></div></div><button type="button" class="icon floatLeft trash-big" name="1"></button></div><div class="row"><div class="fake-form"><div class="form-group"><input type="text" class="form-control" name="CONT_EMAIL" placeholder="E-mail" autofocus="" autocomplete="off" value="'+context.item.CONTACTS[0].CONT_EMAIL+'" required="required"></div></div></div><div class="row top-ten"><div class="fake-form fake-form-supplier-equal floatLeft">';
        cont+='<button type="button" class="tooltip-item tooltip-item-supplier caption-icons-icon bcircle favcontact sel" name="1">Contato Principal </button>';
        template2+='</div><div class="fake-form fake-form-supplier-equal right"><div class="form-group"><input type="text" class="form-control" name="SEGM_COD" placeholder="Segmento" autofocus="" autocomplete="off" value="'+context.item.CONTACTS[0].SEGM_DESC+'" title="'+context.item.CONTACTS[0].SEGM_COD+'" disabled="disabled"></div></div></div><div class="row"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="tel" class="form-control" name="CONT_TEL" placeholder="Tel 1" autofocus="" autocomplete="off" value="'+context.item.CONTACTS[0].CONT_TEL+'"></div></div>';

        if(context.item.CONTACTS[0].CONT_TEL2.length){
          template2+='</div><div class="row CONT_TEL2 top-ten"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="tel" class="form-control" name="CONT_TEL2" placeholder="Tel 2" autofocus="" autocomplete="off" value="'+context.item.CONTACTS[0].CONT_TEL2+'"></div></div></div></div></div>';
        }
        else{
          template2+='<button type="button" class="icon floatLeft bplus-big" name="CONT_TEL2" id="1"></button></div><div class="row CONT_TEL2 top-ten hide"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="tel" class="form-control" name="CONT_TEL2" placeholder="Tel 2" autofocus="" autocomplete="off" value="'+context.item.CONTACTS[0].CONT_TEL2+'"></div></div></div></div></div>';
        }

        context.favcontact=0;
        $("#dados .contact-container").prepend(temp+template+template1+cont+template2);
        template='<div class="supplier-photo-side"><div class="photo-container">';
        template+='<img src="images/contact.png" width="100%" class="noimage">';
        template1='</div></div><div class="supplier-firstform"><div class="row"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="text" class="form-control" name="CONT_NOME" placeholder="Nome" autofocus="" autocomplete="off"></div></div><button type="button" class="icon floatLeft trash-big" name="2"></button></div><div class="row"><div class="fake-form"><div class="form-group"><input type="text" class="form-control" name="CONT_EMAIL" placeholder="E-mail" autofocus="" autocomplete="off"></div></div></div><div class="row top-ten"><div class="fake-form fake-form-supplier-equal floatLeft">';
        cont='<button type="button" class="tooltip-item tooltip-item-supplier caption-icons-icon bcircle favcontact" name="2">Contato Principal </button>';
        template2='</div><div class="fake-form fake-form-supplier-equal right"><div class="form-group"><input type="text" class="form-control" name="SEGM_COD" placeholder="Segmento" autofocus="" autocomplete="off" value="'+context.usr.SEGM_DESC+'" title="'+context.usr.SEGM_COD+'" disabled="disabled"></div></div></div><div class="row"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="tel" class="form-control" name="CONT_TEL" placeholder="Tel 1" autofocus="" autocomplete="off" value=""></div></div><button type="button" class="icon floatLeft bplus-big" name="CONT_TEL2" id="2"></button></div><div class="row CONT_TEL2 top-ten hide"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="tel" class="form-control" name="CONT_TEL2" placeholder="Tel 2" autofocus="" autocomplete="off" value=""></div></div></div></div></div>';
        template='<div class="supplier-form-container contact contact2 cont"><h2><span>Contato 2</span><button type="button" class="icon floatLeft bplus-big" name="showcontact"></button></h2>'+template+template1+cont+template2+'</div>';
        $("#dados .contact-container").append(template);
      }
      else{
        //Nao possui contato
        //console.log("Nao possui contato");
        var template="",temp="",cont="",template1="",template2="";
        temp='<div class="supplier-form-container contact contact1 cont"><h2><span>Contato 1</span><button type="button" class="icon floatLeft bplus-big" name="showcontact"></button></h2>';
        template+='<div class="supplier-photo-side"><div class="photo-container">';
        template+='<img src="images/contact.png" width="100%" class="noimage">';
        template1+='</div></div><div class="supplier-firstform"><div class="row"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="text" class="form-control" name="CONT_NOME" placeholder="Nome" autofocus="" autocomplete="off" required="required"></div></div><button type="button" class="icon floatLeft trash-big" name="1"></button></div><div class="row"><div class="fake-form"><div class="form-group"><input type="text" class="form-control" name="CONT_EMAIL" placeholder="E-mail" autofocus="" autocomplete="off" required="required"></div></div></div><div class="row top-ten"><div class="fake-form fake-form-supplier-equal floatLeft">';
        cont+='<button type="button" class="tooltip-item tooltip-item-supplier caption-icons-icon bcircle favcontact" name="1">Contato Principal </button>';
        template2+='</div><div class="fake-form fake-form-supplier-equal right"><div class="form-group"><input type="text" class="form-control" name="SEGM_COD" placeholder="Segmento" autofocus="" autocomplete="off" value="'+context.usr.SEGM_DESC+'" title="'+context.usr.SEGM_COD+'" disabled="disabled"></div></div></div><div class="row"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="tel" class="form-control" name="CONT_TEL" placeholder="Tel 1" autofocus="" autocomplete="off"></div></div><button type="button" class="icon floatLeft bplus-big" name="CONT_TEL2" name="CONT_TEL2"></button></div><div class="row CONT_TEL2 top-ten hide"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="tel" class="form-control" name="CONT_TEL2" placeholder="Tel 2" autofocus="" autocomplete="off"></div></div></div></div></div>';
        context.favcontact=null;
        $("#dados .contact-container").prepend(temp+template+template1+cont+template2);

        template1='</div></div><div class="supplier-firstform"><div class="row"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="text" class="form-control" name="CONT_NOME" placeholder="Nome" autofocus="" autocomplete="off"></div></div><button type="button" class="icon floatLeft trash-big" name="2"></button></div><div class="row"><div class="fake-form"><div class="form-group"><input type="text" class="form-control" name="CONT_EMAIL" placeholder="E-mail" autofocus="" autocomplete="off"></div></div></div><div class="row top-ten"><div class="fake-form fake-form-supplier-equal floatLeft">';
        cont='<button type="button" class="tooltip-item tooltip-item-supplier caption-icons-icon bcircle favcontact" name="2">Contato Principal </button>';
        template='<div class="supplier-form-container contact contact2 cont"><h2><span>Contato 2</span><button type="button" class="icon floatLeft bplus-big" name="showcontact"></button></h2>'+template+template1+cont+template2+'</div>';
        $("#dados .contact-container").append(template);

        $(".contact2").remove();

        /*var template="",temp="",cont="",template1="",template2="";
        temp='<div class="supplier-form-container contact contact1 actived cont"><h2><span>Contato 1</span></h2>';
        template+='<div class="supplier-photo-side"><div class="photo-container">';
        template+='<img src="images/contact.png" width="100%" class="noimage">';
        template1+='</div></div><div class="supplier-firstform"><div class="row"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="text" class="form-control" name="CONT_NOME" placeholder="Nome" autofocus="" autocomplete="off" required="required"></div></div><button type="button" class="icon floatLeft trash-big" name="1"></button></div><div class="row"><div class="fake-form"><div class="form-group"><input type="text" class="form-control" name="CONT_EMAIL" placeholder="E-mail" autofocus="" autocomplete="off" required="required"></div></div></div><div class="row top-ten"><div class="fake-form fake-form-supplier-equal floatLeft">';
        cont+='<button type="button" class="tooltip-item tooltip-item-supplier caption-icons-icon bcircle favcontact" name="1">Contato Principal </button>';
        template2+='</div><div class="fake-form fake-form-supplier-equal right"><div class="form-group"><input type="text" class="form-control" name="SEGM_COD" placeholder="Segmento" autofocus="" autocomplete="off" value="'+context.usr.SEGM_DESC+'" title="'+context.usr.SEGM_COD+'" disabled="disabled"></div></div></div><div class="row"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="tel" class="form-control" name="CONT_TEL" placeholder="Tel 1" autofocus="" autocomplete="off"></div></div><button type="button" class="icon floatLeft bplus-big" name="CONT_TEL2" name="CONT_TEL2"></button></div><div class="row CONT_TEL2 top-ten hide"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="tel" class="form-control" name="CONT_TEL2" placeholder="Tel 2" autofocus="" autocomplete="off"></div></div></div></div></div>';
        context.favcontact=null;
        $("#dados .contact-container").prepend(temp+template+template1+cont+template2);

        template1='</div></div><div class="supplier-firstform"><div class="row"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="text" class="form-control" name="CONT_NOME" placeholder="Nome" autofocus="" autocomplete="off"></div></div><button type="button" class="icon floatLeft trash-big" name="2"></button></div><div class="row"><div class="fake-form"><div class="form-group"><input type="text" class="form-control" name="CONT_EMAIL" placeholder="E-mail" autofocus="" autocomplete="off"></div></div></div><div class="row top-ten"><div class="fake-form fake-form-supplier-equal floatLeft">';
        cont='<button type="button" class="tooltip-item tooltip-item-supplier caption-icons-icon bcircle favcontact" name="2">Contato Principal </button>';
        template='<div class="supplier-form-container contact contact2 cont"><h2><span>Contato 2</span><button type="button" class="icon floatLeft bplus-big" name="showcontact"></button></h2>'+template+template1+cont+template2+'</div>';
        $("#dados .contact-container").append(template);*/
      }      
    }

    $(".card-side img").each(function(index, el) {
      for(var j=0;j<context.item.CONTACTS.length;j++){
        if(context.item.CONTACTS[j]['CONT_PRINCIPAL'] === 1){
          if(context.item.CONTACTS[j][''+$(el).attr("name")].length){
            $(el).attr("src",imgPath+context.item.CONTACTS[j][''+$(el).attr("name")]).attr('alt', context.item.CONTACTS[j].CONT_ID);;
          }
          else{
            $(el).attr('alt', context.item.CONTACTS[j].CONT_ID);
          }
        }
      }
    });

    if(context.item.PROFILES.length){
      $("a[href='#profile'] button").removeClass('incomplet').addClass('complet');
      for(var i=0;i<context.item.PROFILES.length;i++){
        //console.log("profiles: "+context.item.PROFILES[i].PERF_COD);
        if(context.item.PROFILES[i].PERF_COD == 3){
          if(!$("#profile button.sel-factory").hasClass('sel')){
            $("#profile button.sel-factory").trigger('click');
          }
          if(context.item.PROFILES[i].TP_FAB_COD === 1){
            $(".ownfab-add").find("button[name='ownfab/"+context.item.PROFILES[i].FAB_COD+"']").trigger('click');
          }
          else{
            $(".colfab-add").find("button[name='colfab/"+context.item.PROFILES[i].FAB_COD+"']").trigger('click');
          }
        }
        else{
          $(".form-control-other").attr('disabled', 'disabled');
          $("#profile button[name='"+context.item.PROFILES[i].PERF_COD+"']").addClass('sel');
          if(context.item.PROFILES[i].PERF_COD === 9999){
            $(".form-control-other").removeAttr('disabled').val(context.item.PROFILES[i].PERF_OTHERS);
          }
        }
      }
    }
    if(context.item.COMPOSITIONS.length){
      $("a[href='#composition'] button").removeClass('incomplet').addClass('complet');
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
        if($(".comp-add button[name='comp/"+n+"']").attr("name") === "comp/9999"){
          $(".comp-add button[name='comp/"+n+"']").find("input").val(context.item.COMPOSITIONS[i].COMP_OTHERS);
        }
        $(".comp-add button[name='comp/"+n+"']").trigger('click');
      }
    }
    if(context.item.PRODUCTS.length){
      $("a[href='#products'] button").removeClass('incomplet').addClass('complet');
      for(var i=0;i<context.item.PRODUCTS.length;i++){
        //console.log($(".prod-add button[name='prod/"+parseInt(context.item.PRODUCTS[i].PROD_COD)+"']").attr("name"));
        if($(".prod-add button[name='prod/"+parseInt(context.item.PRODUCTS[i].PROD_COD)+"']").attr("name") === "prod/9999"){
          $(".prod-add button[name='prod/"+parseInt(context.item.PRODUCTS[i].PROD_COD)+"']").find("input").val(context.item.PRODUCTS[i].PROD_OTHERS);
        }
        $(".prod-add button[name='prod/"+parseInt(context.item.PRODUCTS[i].PROD_COD)+"']").trigger('click');
      }
    }
    if(context.item.MARKETS.length){
      $("a[href='#markets'] button").removeClass('incomplet').addClass('complet');
      for(var i=0;i<context.item.MARKETS.length;i++){
        if($(".mark-add button[name='mark/"+parseInt(context.item.MARKETS[i].MERC_COD)+"']").attr("name") === "mark/9999"){
          $(".mark-add button[name='mark/"+parseInt(context.item.MARKETS[i].MERC_COD)+"']").find("input").val(context.item.MARKETS[i].MERC_OTHERS);
        }
        $(".mark-add button[name='mark/"+parseInt(context.item.MARKETS[i].MERC_COD)+"']").trigger('click');
      }
    }
  }
  else{
    //console.log("ELSE ELSE");
    var template="",temp="",cont="",template1="",template2="";
    temp+='<div class="supplier-form-container contact contact1 cont"><h2><span>Contato 1</span><button type="button" class="icon floatLeft bplus-big" name="showcontact"></button></h2>';
    template+='<div class="supplier-photo-side"><div class="photo-container"><img src="images/contact.png" width="100%" class="noimage">';
    template1+='</div></div><div class="supplier-firstform"><div class="row"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="text" class="form-control" name="CONT_NOME" placeholder="Nome" autofocus="" autocomplete="off" required="required"></div></div><button type="button" class="icon floatLeft trash-big" name="1"></button></div><div class="row"><div class="fake-form"><div class="form-group"><input type="text" class="form-control" name="CONT_EMAIL" placeholder="E-mail" autofocus="" autocomplete="off" required="required"></div></div></div><div class="row top-ten"><div class="fake-form fake-form-supplier-equal floatLeft">';
    cont+='<button type="button" class="tooltip-item tooltip-item-supplier caption-icons-icon bcircle favcontact" name="1">Contato Principal </button>';
    template2+='</div><div class="fake-form fake-form-supplier-equal right"><div class="form-group"><input type="text" class="form-control" name="SEGM_COD" placeholder="Segmento" autofocus="" autocomplete="off" value="'+context.usr.SEGM_DESC+'" title="'+context.usr.SEGM_COD+'" disabled="disabled"></div></div></div><div class="row"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="tel" class="form-control" name="CONT_TEL" placeholder="Tel 1" autofocus="" autocomplete="off"></div></div><button type="button" class="icon floatLeft bplus-big" name="CONT_TEL2" id="1"></button></div><div class="row CONT_TEL2 top-ten hide"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="tel" class="form-control" name="CONT_TEL2" placeholder="Tel 2" autofocus="" autocomplete="off"></div></div></div></div></div>';
    context.favcontact=null;
    $("#dados .contact-container").prepend(temp+template+template1+cont+template2);
    temp='</div></div><div class="supplier-firstform"><div class="row"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="text" class="form-control" name="CONT_NOME" placeholder="Nome" autofocus="" autocomplete="off"></div></div><button type="button" class="icon floatLeft trash-big" name="2"></button></div><div class="row"><div class="fake-form"><div class="form-group"><input type="text" class="form-control" name="CONT_EMAIL" placeholder="E-mail" autofocus="" autocomplete="off"></div></div></div><div class="row top-ten"><div class="fake-form fake-form-supplier-equal floatLeft">';
    cont='<button type="button" class="tooltip-item tooltip-item-supplier caption-icons-icon bcircle favcontact" name="2">Contato Principal </button>';
    template2='</div><div class="fake-form fake-form-supplier-equal right"><div class="form-group"><input type="text" class="form-control" name="SEGM_COD" placeholder="Segmento" autofocus="" autocomplete="off" value="'+context.usr.SEGM_DESC+'" title="'+context.usr.SEGM_COD+'" disabled="disabled" disabled="disabled"></div></div></div><div class="row"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="tel" class="form-control" name="CONT_TEL" placeholder="Tel 1" autofocus="" autocomplete="off"></div></div><button type="button" class="icon floatLeft bplus-big" name="CONT_TEL2" id="2"></button></div><div class="row CONT_TEL2 top-ten hide"><div class="fake-form fake-form-supplier-middle"><div class="form-group"><input type="tel" class="form-control" name="CONT_TEL2" placeholder="Tel 2" autofocus="" autocomplete="off"></div></div></div></div></div>';
    template='<div class="supplier-form-container contact contact2 cont"><h2><span>Contato 2</span><button type="button" class="icon floatLeft bplus-big" name="showcontact"></button></h2>'+template+temp+cont+template2+'</div>';
    $("#dados .contact-container").append(template);
    $(".contact2").remove();
    
    $(".favcontact").bind("click",function(a){context.setFavContact(a);});
    $(".photo-container img").bind("click",function(a){context.showCard(a);});
    $(".cardboard").bind("click",function(a){context.slideCard(a);});
    $(".closebt").bind("click",function(a){context.slideCard(a);});
    $(".contact1 .favcontact").trigger('click');
    $(".form-control-other").attr('disabled', 'disabled');
  }

  $("#dados input[required='required']").each(function(index,el){
    //console.log($(el).val().length+" , "+$(el).val()+" , "+$(el).val().length === true);
    if(!$(el).val().length && complet){
      complet=!1;
    }
  });
  if(complet){
    $("a[href='#dados'] button").removeClass('incomplet').addClass('complet');
  }
  $(".bplus-big").bind("click",function(a){context.showSomething(a);});
  $(".favcontact").bind("click",function(a){context.setFavContact(a);});
  $(".trash-big").bind("click",function(a){context.deleteFornNote(a);});
  $(".photo-container img").bind("click",function(a){context.showCard(a);});
  $(".cardboard").bind("click",function(a){context.slideCard(a);});
  $(".closebt").bind("click",function(a){context.closeSlide(a);});
},slideCard:function(a){
  var hasimg=!1;
  if(!this.item.FORN_ID){
    this.modal.open("message","O fornecedor ainda não foi salvo!!!",!1,!0);
    return !1;
  }
  if(!this.item.CONTACTS.length){
    this.modal.open("message","Ainda não existem contatos cadastrados!!!",!1,!0);
    return !1;
  }
  this.item.CONTACTS.forEach(function(el,index) {
    if(parseInt(el.CONT_ID) === parseInt($(a.target).attr("alt"))){
      $(".supplier-img-containter img").each(function(i, elem) {
        if(el[''+$(elem).attr("name")].length){
          hasimg=!0;
          $(elem).attr("src",imgPath+el[''+$(elem).attr("name")]);
        }
      });
    }
  });
  if(hasimg){
    $("#"+$(a.target).attr("name")).attr("checked","checked");
    $(".supplier-img-containter").fadeIn();
  }
  else{
    this.modal.open("message","Este contato não possui imagens salvas!!!",!1,!0);
  }
},closeSlide:function(){
  $(".supplier-img-containter").fadeOut();
  $(".supplier-img-containter .cnt-slide").each(function(index, el) {
    if($(el).hasClass('cnt-slide1')){
      $(el).find("img").attr("src","images/camera_biggest.png");
    }
    else{
      $(el).find("img").attr("src","images/camera_big.png");
    }
  });
},saveForn:function(goout){
  var html="",context=this,pattern="",complet=!0,status;
  var addforn=($("html").hasClass('add_forn') && !this.item.FORN_ID) ? "I" : "U";
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
  //console.log(this.tab);
  //console.log(this.lasttab);
  //console.log(this.setfair);
  pattern+="<USU_COD>"+this.usr.USU_COD+"</USU_COD>"+"<CREATE_DATE>"+date+"</CREATE_DATE>"+"<FEIR_COD>"+this.setfair+"</FEIR_COD>";
 /*if(this.tab === "dados" && !this.scroller){
    return !1;
  }*/
  if(this.setfair && !$("html").hasClass('view_forn') && (this.lasttab !== this.tab)){
    //console.log("SALVANDO");
    //console.log(this.lasttab);
    this.setloading(!0,!1);
    switch (this.lasttab){
      case 'dados':
        var isFinished=0;
        //console.log(this.tab);
        //console.log(this.lasttab);

        //console.log(($(".ScrollSpy .nav-item button.complet").length >= 4)+" , "+$("input[name='FORN_DESC']").val().length+" , "+$(".contact1 input[name='CONT_NOME']").val().length+" , "+$(".contact1 input[name='CONT_EMAIL']").val().length);
        if($(".ScrollSpy .nav-item button.complet").length >= 4 && $("input[name='FORN_DESC']").val().length && $(".contact1 input[name='CONT_NOME']").val().length && $(".contact1 input[name='CONT_EMAIL']").val().length){
          isFinished=1
        }
        context.ajaxrequest=!0;
        this.callService("GravarFornecedor",'<FORN_ID>'+(context.item.FORN_ID || 0)+'</FORN_ID>',html+""+pattern,"<FORN_DESC>"+$("input[name='FORN_DESC']").val()+"</FORN_DESC>",'<FORN_STATUS>'+isFinished+'</FORN_STATUS><FORN_INATIVO>0</FORN_INATIVO>','<action>'+addforn+'</action>');
        $(".fair").attr('disabled', 'disabled');
        status=setInterval(function(){
          if(!context.ajaxrequest){
            //console.log("entrou no interval: "+complet);
            if(!$(".cont.actived").not(".hide").length){
              complet=!1;
            }
            $(".cont.actived").each(function(a,b){
              html="";
              $(b).find("input").each(function(index,el){
                if($(el).attr("required") && !$(el).val().length && complet){
                  //console.dir($(el));
                  complet=!1;
                }

                if($(el).attr("name") === "SEGM_COD"){
                  //console.log("segmento");
                  html+="<"+$(el).attr("name")+">"+$(el).attr("title")+"</"+$(el).attr("name")+">";
                }
                else{
                  html+="<"+$(el).attr("name")+">"+$(el).val()+"</"+$(el).attr("name")+">";
                }
              });
              if(a === context.favcontact){
                html+="<CONT_PRINCIPAL>1</CONT_PRINCIPAL>";
              }
              else{
                html+="<CONT_PRINCIPAL>0</CONT_PRINCIPAL>";
              }
              html+="<FORN_ID>"+context.item.FORN_ID+"</FORN_ID>";
              if($(b).hasClass('hide')){

                html+="<CONT_INATIVO>1</CONT_INATIVO>";
              }
              else{
                html+="<CONT_INATIVO>0</CONT_INATIVO>";
              }

              if(addforn === "I"){
                html+="<FORN_STATUS>1</FORN_STATUS>";
              }
              else{
                if(complet){
                  //console.log("cadastro completo 1");
                  $("a[href='#dados'] button").removeClass('incomplet').addClass('complet');
                  context.item.FORN_STATUS=1;
                }
                else{
                  //console.log("cadastro incompleto 2 ");
                  $("a[href='#dados'] button").removeClass('complet').addClass('incomplet');
                  context.item.FORN_STATUS=0;
                }
                html+="<FORN_STATUS>"+context.item.FORN_STATUS+"</FORN_STATUS>";
              }

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
                if(!goout){
                  html+="<IMG_PATH_FRENTE>0</IMG_PATH_FRENTE><IMG_PATH_VERSO>0</IMG_PATH_VERSO><IMG_PATH_CONTATO>0</IMG_PATH_CONTATO>";
                  context.callService("GravarFornecedorContato",html,pattern,"",'<action>I</action>');
                }
              }
            });
            if(goout){
              context.on = !1;
              context.setFornClick="";
              context.savingCookie("fornecedores",!0,"");
              window.history.go(-1);
            }
            if(complet){
              //console.log("cadastro completo");
              $("a[href='#dados'] button").removeClass('incomplet').addClass('complet');
              context.item.FORN_STATUS=1;
            }
            else{
              //console.log("cadastro incompleto");
              $("a[href='#dados'] button").removeClass('complet').addClass('incomplet');
              context.item.FORN_STATUS=0;
            }
            clearInterval(status);
          }
        },100);
        
        
        context.setloading(!1);
        // console.log(this.setDate());
        break;
      case 'profile':
        if(!this.item.FORN_ID){
          this.modal.open("message","Você deve primeiro salvar um fornecedor!!!",!1,!0);
          context.setloading(!1);
          return !1;
        }
        var html="",other="",complet=!0,last_request=!1;
        //console.log(this.tab);
        //console.log(this.lasttab);
        if($("#profile .row-top .bcircle").hasClass('sel')){
          if($("#profile .row-top .bcircle.sel").attr("name") !== "3"){
            html+="<Profile><FAB_COD>0</FAB_COD><PERF_COD>"+$("#profile .row-top .bcircle.sel").attr("name")+"</PERF_COD><TP_FAB_COD>0</TP_FAB_COD><PERF_OTHERS></PERF_OTHERS></Profile>";
          }
          else{
            $(".ownfab-rem .row-item").each(function(a,b){
              var el=$(b).find(".bminus").attr("name");
              html+="<Profile><FAB_COD>"+el.substr(el.indexOf("/")+1, el.length)+"</FAB_COD><PERF_COD>3</PERF_COD><PERF_OTHERS></PERF_OTHERS>";
              html+="<TP_FAB_COD>1</TP_FAB_COD></Profile>";
            });
              $(".colfab-rem .row-item").each(function(a,b){
                var el=$(b).find(".bminus").attr("name");
              html+="<Profile><FAB_COD>"+el.substr(el.indexOf("/")+1, el.length)+"</FAB_COD><PERF_COD>3</PERF_COD><PERF_OTHERS></PERF_OTHERS>";
              html+="<TP_FAB_COD>2</TP_FAB_COD></Profile>";
            });
          }
        }
        else{
          //console.log("nenhum profile selecionado encima");
          complet=!1;
        }

        $("#profile .row-down .bsquare.sel").each(function(a,b){
          if($(b).attr("name") == "9999"){
            other=$(b).parent().find("input").val();
          }
          html+="<Profile><FAB_COD>0</FAB_COD><PERF_COD>"+$(b).attr("name")+"</PERF_COD><TP_FAB_COD>0</TP_FAB_COD><PERF_OTHERS>"+other+"</PERF_OTHERS></Profile>";
        });
        if(complet){
          $("a[href='#profile'] button").removeClass('incomplet').addClass('complet');
        }
        else{
          $("a[href='#profile'] button").removeClass('complet').addClass('incomplet');
        }

        if($(".ScrollSpy .nav-item button.complet").length === 5){
          //console.log("cadastro completo");
          context.ajaxrequest=!0;
          this.callService("GravarFornecedor",'<FORN_ID>'+context.item.FORN_ID+'</FORN_ID>',html+""+pattern,"<FORN_DESC>"+$("input[name='FORN_DESC']").val()+"</FORN_DESC>",'<FORN_STATUS>1</FORN_STATUS><FORN_INATIVO>0</FORN_INATIVO>','<action>U</action>');
        }
        else{
          //console.log("cadastro incompleto");
          context.ajaxrequest=!0;
          this.callService("GravarFornecedor",'<FORN_ID>'+context.item.FORN_ID+'</FORN_ID>',html+""+pattern,"<FORN_DESC>"+$("input[name='FORN_DESC']").val()+"</FORN_DESC>",'<FORN_STATUS>0</FORN_STATUS><FORN_INATIVO>0</FORN_INATIVO>','<action>U</action>');
        }

        var status,last;
        status=setInterval(function(){
          last_request=!0;
          if(!context.ajaxrequest){
            context.callService("GravarFornecedorProfile",'<Forn_ID>'+context.item.FORN_ID+'</Forn_ID>',html);
            if(goout){
              context.on = !1;
              clearInterval(status);
              last_request=!1;
            }
            else{
              clearInterval(status);
            }
          }
        },100);

        last=setInterval(function(){
          //console.log(!context.ajaxrequest && goout && !last_request);
          if(!context.ajaxrequest && goout && !last_request){
            context.on = !1;
            context.setFornClick="";
            context.savingCookie("fornecedores",!0,"");
            window.history.go(-1);
            clearInterval(last);
          }
        },100);

        break;
      case 'composition':
        if(!this.item.FORN_ID){
          this.modal.open("message","Você deve primeiro salvar um fornecedor!!!",!1,!0);
          context.setloading(!1);
          return !1;
        }
        var html="",others="",last_request=!1;
        //console.log(this.tab);
       // console.log(this.lasttab);

        $(".comp-rem .row-item").each(function(a,b){
          var el=$(b).find(".bminus").attr("name");
          //html+="<string>"+el.substr(el.indexOf("/")+1, el.length)+"</string>";
          if(el.substr(el.indexOf("/")+1, el.length) === "9999"){
            others=$(b).find(".bminus").find("input").val();
          }
          else{
            others="";

          }
          html+="<Composition><COMP_COD>"+el.substr(el.indexOf("/")+1)+"</COMP_COD><COMP_OTHERS>"+others+"</COMP_OTHERS><TP_COMP_ID>2</TP_COMP_ID></Composition>";
        });
        if(html.length){
          $("a[href='#composition'] button").removeClass('incomplet').addClass('complet');
        }
        else{
          $("a[href='#composition'] button").removeClass('complet').addClass('incomplet');
        }

        if($(".ScrollSpy .nav-item button.complet").length === 5){
          //console.log("cadastro completo");
          context.ajaxrequest=!0;
          this.callService("GravarFornecedor",'<FORN_ID>'+context.item.FORN_ID+'</FORN_ID>',html+""+pattern,"<FORN_DESC>"+$("input[name='FORN_DESC']").val()+"</FORN_DESC>",'<FORN_STATUS>1</FORN_STATUS><FORN_INATIVO>0</FORN_INATIVO>','<action>U</action>');
        }
        else{
          //console.log("cadastro incompleto");
          context.ajaxrequest=!0;
          this.callService("GravarFornecedor",'<FORN_ID>'+context.item.FORN_ID+'</FORN_ID>',html+""+pattern,"<FORN_DESC>"+$("input[name='FORN_DESC']").val()+"</FORN_DESC>",'<FORN_STATUS>0</FORN_STATUS><FORN_INATIVO>0</FORN_INATIVO>','<action>U</action>');
        }
        var status,last;
        status=setInterval(function(){
          last_request=!0;
          if(!context.ajaxrequest){
            context.callService("GravarFornecedorComposicao",'<FORN_ID>'+context.item.FORN_ID+'</FORN_ID>',html);
            //console.log(goout);
            if(goout){
              context.on = !1;
              clearInterval(status);
              last_request=!1;
            }
            else{
              clearInterval(status);
            }
          }
        },100);

        last=setInterval(function(){
          //console.log(!context.ajaxrequest && goout && !last_request);
          if(!context.ajaxrequest && goout && !last_request){
            context.setFornClick="";
            context.savingCookie("fornecedores",!0,"");
            context.on = !1;
            window.history.go(-1);
            clearInterval(last);
          }
        },100);

        break;
      case 'products':
        if(!this.item.FORN_ID){
          this.modal.open("message","Você deve primeiro salvar um fornecedor!!!",!1,!0);
          context.setloading(!1);
          return !1;
        }
        //console.log(this.tab);
        //console.log(this.lasttab);
        var html="",last_request=!1;
        //console.log(this.tab);
        //console.log(this.lasttab);
        $(".prod-rem .row-item").each(function(a,b){
          var el=$(b).find(".bminus").attr("name"),others="";
          if(el.substr(el.indexOf("/")+1, el.length) === "9999"){
            others=$(b).find(".bminus").find("input").val();
          }
          else{
            others="";
          }
          html+="<Product><PROD_COD>"+el.substr(el.indexOf("/")+1, el.length)+"</PROD_COD><PROD_OTHERS>"+others+"</PROD_OTHERS></Product>";
        });
        if(html.length){
          $("a[href='#products'] button").removeClass('incomplet').addClass('complet');
        }
        else{
          $("a[href='#products'] button").removeClass('complet').addClass('incomplet');
        }

        if($(".ScrollSpy .nav-item button.complet").length === 5){
          //console.log("cadastro completo");
          context.ajaxrequest=!0;
          this.callService("GravarFornecedor",'<FORN_ID>'+context.item.FORN_ID+'</FORN_ID>',html+""+pattern,"<FORN_DESC>"+$("input[name='FORN_DESC']").val()+"</FORN_DESC>",'<FORN_STATUS>1</FORN_STATUS><FORN_INATIVO>0</FORN_INATIVO>','<action>U</action>');
        }
        else{
          //console.log("cadastro incompleto");
          context.ajaxrequest=!0;
          this.callService("GravarFornecedor",'<FORN_ID>'+context.item.FORN_ID+'</FORN_ID>',html+""+pattern,"<FORN_DESC>"+$("input[name='FORN_DESC']").val()+"</FORN_DESC>",'<FORN_STATUS>0</FORN_STATUS><FORN_INATIVO>0</FORN_INATIVO>','<action>U</action>');
        }
        var status,last;
        status=setInterval(function(){
          last_request=!0;
          if(!context.ajaxrequest){
            context.callService("GravarFornecedorProduto",'<Forn_ID>'+context.item.FORN_ID+'</Forn_ID>',html);
            if(goout){
              context.on = !1;
              clearInterval(status);
              last_request=!1;
            }
            else{
              clearInterval(status);
            }
          }
        },100);

        last=setInterval(function(){
          //console.log(!context.ajaxrequest && goout && !last_request);
          if(!context.ajaxrequest && goout && !last_request){
            context.on = !1;
            context.setFornClick="";
            context.savingCookie("fornecedores",!0,"");
            window.history.go(-1);
            clearInterval(last);
          }
        },100);

        break;
      case 'markets':
        if(!this.item.FORN_ID){
          this.modal.open("message","Você deve primeiro salvar um fornecedor!!!",!1,!0);
          context.setloading(!1);
          return !1;
        }
        //console.log(this.tab);
        //console.log(this.lasttab);
        var html="",others="",last_request=!1;
        $(".mark-rem .row-item").each(function(a,b){
          var el=$(b).find(".bminus").attr("name");
          if(el.substr(el.indexOf("/")+1, el.length) === "9999"){
            others=$(b).find(".bminus").find("input").val();
          }
          else{
            others="";
          }
          html+="<Market><MERC_COD>"+el.substr(el.indexOf("/")+1, el.length)+"</MERC_COD><MERC_OTHERS>"+others+"</MERC_OTHERS></Market>"
        });
        if(html.length){
          $("a[href='#markets'] button").removeClass('incomplet').addClass('complet');
        }
        else{
          $("a[href='#markets'] button").removeClass('complet').addClass('incomplet');
        }

        if($(".ScrollSpy .nav-item button.complet").length === 5){
          //console.log("cadastro completo");
          context.ajaxrequest=!0;
          this.callService("GravarFornecedor",'<FORN_ID>'+context.item.FORN_ID+'</FORN_ID>',html+""+pattern,"<FORN_DESC>"+$("input[name='FORN_DESC']").val()+"</FORN_DESC>",'<FORN_STATUS>1</FORN_STATUS><FORN_INATIVO>0</FORN_INATIVO>','<action>U</action>');
        }
        else{
          //console.log("cadastro incompleto");
          context.ajaxrequest=!0;
          this.callService("GravarFornecedor",'<FORN_ID>'+context.item.FORN_ID+'</FORN_ID>',html+""+pattern,"<FORN_DESC>"+$("input[name='FORN_DESC']").val()+"</FORN_DESC>",'<FORN_STATUS>0</FORN_STATUS><FORN_INATIVO>0</FORN_INATIVO>','<action>U</action>');
        }
        var status,last;
        status=setInterval(function(){
          last_request=!0;
          if(!context.ajaxrequest){
            context.callService("GravarFornecedorMercado",'<Forn_ID>'+context.item.FORN_ID+'</Forn_ID>',html);
            clearInterval(status);
            last_request=!1;
          }
        },100);

        last=setInterval(function(){
          //console.log(!context.ajaxrequest && goout && !last_request);
          if(!context.ajaxrequest && goout && !last_request){
            context.setloading(!1);
            context.close();
            clearInterval(last);
          }
        },100);
        break;
    }
    /*$("#"+this.tab).find("input[required='required']").each(function(a,b){
      console.dir(b);
    });*/
  }
  else{
    if(this.lasttab && this.tab !=="dados" && !this.setfair){
      this.modal.open("message","Você deve primeiro salvar um fornecedor!!!",!1,!0);
    }
  }
  //this.setloading(!1);
  //console.dir($("input[required='required']"));
},goTop:function(){
  $(".nav-item").eq(0).trigger('click');
},reload:function(code) {
  "use strict";
  var result;
  this.setloading(!0,!1);
  this.item = {};
  this.reset();
  this.callService("singleForn",'<FEIR_COD></FEIR_COD><FORN_ID>'+code+'</FORN_ID><LINHA_I>1</LINHA_I><LINHA_F>20</LINHA_F>');
  /*if(!isNaN(code)){
    result=this.getdata(code);
  }
  if(result.length){
    this.open(result[0]);
  }
  else{
    this.open(this.item);
  }*/
},reset:function(){
  this.item = {};
  this.isviewforn=!1;
  this.setfair=null;
  this.fav=0;
  this.favcontact=null;
  this.ajaxrequest=!1;
  this.tab="";
  this.lasttab="";
  this.scroller=0;
},init:function() {
  this.item = {};
  this.isviewforn=!1;
  this.setfair=null;
  this.fav=0;
  this.favcontact=null;
  this.ajaxrequest=!1;
  this.tab="";

  //Na linha abaixo, na segunda, utilizarei para saber se uma tab ja foi salva ou não, porque caso ja tenha sido salva, não vou salvar dinovo qual o cara voltar. Se nao tiver sido salva ainda eu volto
  //Posso realizar um listener nos inputs da pagina se ao mudar o valor, busco o closest(nav-item) e vejo o href, entao produto no array, se ja foi salva, seto para false pra salvar denovo
  //this.tab=[{'tab':'dados','save':0},{'tab':'profile','fav':0},{'tab':'composition','fav':0},{'tab':'products','fav':0},{'tab':'markets','fav':0}];
  this.lasttab="";
  this.scroller=0;
}});