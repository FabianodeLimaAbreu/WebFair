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
},plusNote:function(){
  this.callService("gravarNotes");
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
  $("button.fav-big").bind("click",function(a){context.setFav(a);});  //setFavorito
  //$(".navbar-nav li a").bind("click",function(a){context.saveForn(a);});  
  
  //ScrollSpy by http://jsfiddle.net/mekwall/up4nu/
  $(".ScrollSpy").find(".nav-item").bind("click",function(a){context.changeTab(a);});
  $(".supplier-scroller").bind("scroll",function(a){context.scrollTab(a);})
  $(".favcontact").bind("click",function(a){context.setFavContact(a);});
  $(".bplus-big").bind("click",function(a){context.showSomething(a);});
},
open: function(a){
  "use strict";
  var context=this;
  /*this.item = a;
  if(!this.item){
    return !1;
  }*/
  this.callerEvents();
  $(".ScrollSpy").find(".nav-item").eq(0).trigger('click');
  if(!this.getSegm().length){
    this.callService("listarSegmentos");
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

      if(id !== "dados" && this.setfair){
        $(".fair").attr("disabled","disabled");
      }
      else{
        $(".fair").removeAttr('disabled');
      }
   }
},showSomething:function(a){
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
},setFav:function(a){
  var i,el=$(a.target),html="";
  console.log(el.hasClass('sel'));
  if(el.hasClass('sel')){
    this.fav=0;
    el.removeClass('sel');
  }
  else{
    this.fav=1;
    el.addClass('sel');
  }
  console.log("clicado no FAVORITO");
  if(this.item.FORN_ID){
    this.waitingfav=!1;
    context.ajaxrequest=!0;
    if(this.item.FAVORITES.length){
      for(i=0;i<this.item.FAVORITES.length;i++){
        html+="<string>"+this.item.FAVORITES[i].SEGM_COD+"</string>";
      }
    }
    else{
      html+="<string>"+this.usr.SEGM_COD+"</string>";
    }
    this.callService("GravarFornecedor",'<FORN_ID>'+this.item.FORN_ID+'</FORN_ID>',html);
  }
  else{
    this.waitingfav=!0;
  }

},setFavContact:function(a){
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
        clearInterval(status);
      }
    },100);
  }
  else{
    context.createComponent(context.fair,context.bfair,'fair');
  }
  this.setloading(!1);
},saveForn:function(a){
  var date=new Date(),html="",context=this,pattern="";
  date=""+date.getFullYear()+"-0"+(date.getMonth()+1)+"-"+date.getDate();
  pattern+="<USU_COD>"+this.usr.USU_COD+"</USU_COD>"+"<CREATE_DATE>"+date+"</CREATE_DATE>"+"<FEIR_COD>"+this.setfair+"</FEIR_COD>";
 /*if(this.tab === "dados" && !this.scroller){
    return !1;
  }*/
  if(this.setfair){
    this.setloading(!0,!1);
    switch (this.lasttab){
      case 'dados':
        console.log(this.tab);
        console.log(this.lasttab);
        console.log(date);
        html+="<FORN_STATUS>0</FORN_STATUS><FORN_INATIVO>0</FORN_INATIVO>";
        context.ajaxrequest=!0;
        this.callService("GravarFornecedor",'<FORN_ID>0</FORN_ID>',html+""+pattern,"<FORN_DESC>"+$("input[name='FORN_DESC']").val()+"</FORN_DESC>",'<action>I</action>');
        
        status=setInterval(function(){
          if(!context.ajaxrequest){
            console.log("ENTROU NO SEGUNDO");
            $(".contact.actived").each(function(a,b){
              html="";
              $(b).find("input").each(function(a,b){
                html+="<"+$(b).attr("name")+">"+$(b).val()+"</"+$(b).attr("name")+">";
              });
              html+="<SEGM_COD>"+$(".SEGM_COD option:selected").attr("value")+"</SEGM_COD>";
              html+="<CONT_PRINCIPAL>"+context.favcontact[a].fav+"</CONT_PRINCIPAL>";
              html+="<IMG_PATH_FRENTE>0</IMG_PATH_FRENTE><IMG_PATH_VERSO>0</IMG_PATH_VERSO><IMG_PATH_CONTATO>0</IMG_PATH_CONTATO>";
              html+="<FORN_ID>"+context.item.FORN_ID+"</FORN_ID><CONT_INATIVO>0</CONT_INATIVO>";

              context.callService("GravarFornecedorContato",html,pattern,"",'<action>I</action>');
            });
            clearInterval(status);
          }
        },100);
        context.setloading(!1);
        // console.log(this.setDate());
        break;
      case 'profile':
        console.log(this.tab);
        console.log(this.lasttab);
        break;
      case 'composition':
        console.log(this.tab);
        console.log(this.lasttab);
        break;
      case 'products':
        console.log(this.tab);
        console.log(this.lasttab);
        break;
      case 'markets':
        console.log(this.tab);
        console.log(this.lasttab);
        break;
    }
    /*$("#"+this.tab).find("input[required='required']").each(function(a,b){
      console.dir(b);
    });*/
  }
  else{
    if(this.lasttab && this.tab !=="dados"){
      alert("Selecione uma feira");
    }
  }
  //this.setloading(!1);
  //console.dir($("input[required='required']"));
},reload:function(fair,code) {
  "use strict";
  var result;
  this.setloading(!0,!1);
  this.open();
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
},init:function() {
  this.item = {};
  this.on=!1;
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