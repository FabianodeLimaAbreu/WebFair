/**
* Details's class and actions
* @exports Detail
* @constructor
*/
window.Detail = Spine.Controller.sub({
elements:{
  /*".title":"title",
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
  ".close-bar span":"closebar"*/
  //".color-list":"colorlist"
}, events:{
  "click button.bgoselect":"close"
   /*"click .bsku":"sku",
   //"click .bcolor":"color",
   "click .brapport":"rapport",
   "click .bformas":"formas",
   "click .color-thumb":"reload",
   "click .go_back":"close",
   "click .benviar":"enviar",
   "click .close-bar":"openbar"*/
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
  result+='<li><a href="#fav" class="caption-icons-icon setitem oneline bfisica nothas">Anexar<br/> Arquivo</a></li>';
  result+='<li><a href="#fav" class="caption-icons-icon setitem oneline bfisica nothas">Arquivos<br/> Anexos</a></li>';
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
  console.log(result);
  $(".description-noteside").append(result);

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
  console.log(pattern+html);
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