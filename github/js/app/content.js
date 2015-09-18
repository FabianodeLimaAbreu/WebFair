window.Spotlight = Spine.Controller.sub({
  elements:{
    //dd:"buttons"
  }, 
  events:{
    //"click .spotlight button":"select"
  }, 
  select:function(a) {
    var fair="<FEIR_COD>",name="<FORN_ID>",amos="<AMOS_DESC>";
    if("object" === typeof a) {
     a = $(a.target);
    }else {
      return!1;
    }
    if(a.attr("type") === "button"){
      name+=a.attr("name")+"</FORN_ID>";
      this.setFornVal(a.attr("name"));
      $(".forn").val(a.text());
    }
    else{
      if(!a.val().length){

      }
      else{
        name="<FORN_DESC>"+a.val()+"</FORN_DESC>";
      }
      
      if(isNaN(a.val())){
        this.setFornVal(a.val());
      }
      else{
        this.setFornVal("alt"+a.val());
      }
    }
    this.reset();
    if(this.getFairVal()){
      fair+=this.getFairVal()+"</FEIR_COD>";
    }
    else{
      fair+="</FEIR_COD>";
    }

    if(this.getAmosVal()){
      if(isNaN(this.getAmosVal())){
        amos+=this.getAmosVal()+"</AMOS_DESC>";
      }
      else{
        amos="<AMOS_ID>"+this.getAmosVal()+"</AMOS_ID>";
      }
    }
    else{
      amos+="</AMOS_DESC>";
    }
    $(window).scrollTop(0);
    if(this.getPage() === "amostras"){
      this.mode="amostras/"+((""+this.getFairVal()).replace(" ","_") || "padrao")+"/"+((""+this.getFornVal()).replace(" ","_") || "padrao")+"/"+((""+this.getAmosVal()).replace(" ","_") || "padrao");
      this.navigate(this.mode, !1);
      this.callService("amostras",fair,name,amos,'<LINHA_I>'+'1'+'</LINHA_I>','<LINHA_F>'+'20'+'</LINHA_F>','<CREATE_DATE_I>2000-01-01</CREATE_DATE_I>','<CREATE_DATE_F>2020-01-01</CREATE_DATE_F>');
      this.close();
    }
    else{
      this.setNotCombo(!0);
      this.mode="fornecedores/"+((""+this.getFairVal()).replace(" ","_") || "padrao")+"/"+((""+this.getFornVal()).replace(" ","_") || "padrao")+"/"+"padrao";
      this.navigate(this.mode, !1);
      this.callService("fornecedores",fair,name,'<LINHA_I>'+'1'+'</LINHA_I>','<LINHA_F>'+'20'+'</LINHA_F>','<CREATE_DATE_I>2000-01-01</CREATE_DATE_I>','<CREATE_DATE_F>2020-01-01</CREATE_DATE_F>');
      this.close();
    }
}, over:function(a) {
  a.addClass("sel");
  this.input.val(a.text()).focus();
}, close:function(a) {
  this.list = "";
  this.id = -1;
  this.doc.unbind("click");
  this.el.empty().fadeOut();
  return!1;
}, open:function() {
  var i,length,html="";
  length=this.forn.length;
  this.doc.unbind("click").bind("click", this.proxy(this.close));
  if(2 > length) {
      this.close();
      return!1;
  }
  for(i=0;i<length;i++){
    html+="<li><button type='button' name='"+this.forn[i].FORN_ID+"'>"+this.forn[i].FORN_DESC+"</button></li>";
  }
  this.el.html(html).show();
  $(".spotlight button").bind("click",this.proxy(this.select));
}, hint:function(a, b) {
  var c, d, e = [];
  this.el.empty();
  if(!a.length)
    return !1;
  this.doc.unbind("click").bind("click", this.proxy(this.close));
  d = 26 * a.length + 10;
  e.push("<dt style='height:" + d + "px'>Você quis dizer:</dt>");
    for(c = 0;c < a.length;c++) {
        e.push("<dd>" + a[c].WORD.capitalize() + "</dd>");
    }
    this.el.html(e.join(" ")).fadeIn();
    this.buttons = this.el.find("dd");
}, arrow:function(a) {
  a = a || window.event;
  this.buttons=$(".spotlight button");
  this.buttons.removeClass("sel");
  switch(a.keyCode) {
    case 38:
      this.id--;
      this.id < -this.buttons.length && (this.id = 0);
      a = this.buttons.eq(this.id);
      this.over(a);
      break;
    case 40:
      this.id++, this.id > this.buttons.length - 1 && (this.id = 0), a = this.buttons.eq(this.id), this.over(a);
  }
  return !1;
}, gettips: function(a){
    $.getJSON(nodePath + "index.js?service=SearchMaterial.svc/searchTermo/&query=" + a + "?callback=?", this.proxy(this.hint));
}, init:function() {
  this.forn=[];
  this.input=null;
  this.id = -1;
  this.doc = $(document);
  /*this.spot = [];
  this.list = "";
  this.id = 0;
  this.input = null;
  this.doc = $(document);
  $.getJSON("/library/ajax/spotlight.js", this.proxy(function(a) {
    this.spot = a;
  }));
  this.el.disableSelection && this.el.disableSelection();*/
}});

/**
*@fileOverview Content's page with Modal, Content and Boxes classes
* @module Content
* @module Modal
* @module Box
*
*/

/**
* Modal's class and actions
* @exports Modal
* @constructor
*/
window.Modal = Spine.Controller.sub({
  elements:{
    ".modal-text":"msg_container", ".modal-cotent":"content",".question":"buttons_container",".question button":"buttons",".modal":"main",".dialog-save":"bsave"
  },events:{
    "click .alertclose":"close",
    "click .dialog-save":"save",
    "click .link":"goEmail",
    "click .question button":"actions"
  },

  /**
  * `OK Set thed loading state`
  * @memberOf Modal#
  * @param {Boolean} a. If true show mask, else hide mask.
  */
  close:function(a){
    if(typeof a === "object"){
      a.preventDefault();
    }
    else{
      if(a === "detail"){
        var date,result="";
        date=new Date();
        date=date.getDate()+"/0"+(date.getMonth()+1)+"/"+date.getFullYear();
        result+='<div class="supplier-form-container note contact actived"><ul class="notepad supplier-note-side">';
        result+="<li><article><div class='notepad-note blockquote'><p>"+date+" | "+ this.usr.USU_NOME+" | "+this.objid+"</p><p>"+this.usr.SEGM_COD+"</p><p>"+$(".notebook textarea").val()+"</p></div><div class='blockquote'><button type='button' class='tooltip-item caption-icons-icon btrash-big' id='"+this.noteid+"' name='"+this.usr.USU_COD+"'></button></div></article></li>"
        result+="</ul></div>";
        $(".description-noteside").append(result);
      }
      /*else{
        window.location.reload();
      }*/
    }
    this.el.fadeOut('fast');
    this.content.addClass('hide');
    this.buttons_container.addClass('hide');
    this.clean();
    this.callback && this.callback();
  },
  actions:function(a){
    $(a.target).attr("name") === "yes" ? this.callback() : this.callback=null,this.close();;   
  },
  goEmail:function(a){
    var listemail=[],amos_code=[],amos_id=[],address,counter,supplier;
    a.preventDefault();
    listemail=this.email[0][parseInt($(a.target).attr("name"))];
    amos_code=this.email[1];
    amos_id=this.email[2];
    address=this.email[3];
    supplier=this.email[4][0];

    counter=amos_code.join(" ; ").length;

    var texto=encodeURIComponent(listemail.TEMP_BODY.replace("##SAMPLES"," "+amos_code.join(" ; ")+" ").replace("##SUPPLIER",supplier.FORN_DESC).replace("##CONTACT",supplier.FORN_DESC).slice(0,(1290 - counter)));
    this.setEmailSent(amos_id);
    this.close();   
    window.open("mailto:"+address+"?subject="+encodeURIComponent(listemail.TEMP_SUBJECT)+"&body="+texto);
  },
  open:function(who,msg,call,isbad,isquest) {
    var a;
    msg= msg || "";
    this.email=msg;
    this.objid=msg;
    this.content.addClass('hide');
    $("."+who).removeClass('hide');
    isbad && this.main.addClass("bad");
    isquest && this.buttons_container.removeClass('hide');
    this.main.removeClass('foremail');
    if(typeof msg === "object"){
      if(who === "template"){
        this.main.addClass('foremail');
        this.populateTemp(msg);
      }
      else{
        this.populateForn(who,msg);
      }
    }
    else{
      this.msg_container.html(msg);
    }
    this.el.fadeIn('fast');
    if(call && "function" === typeof call)
      //If d is a function
      this.callback = call;
  },
  populateTemp:function(msg){
    var i,html="";
    this.email=msg;
    this.main.find("tbody").empty();
    for(i=0;i<msg[0].length;i++){
      html+="<tr><td><a href='#"+i+"' class='link' name='"+i+"'>"+msg[0][i].TEMP_DESC+"</a></td><td><a href='#"+i+"' class='link' name='"+i+"'>"+msg[0][i].TP_TEMP_DESC+"</a></td></tr>";
    }
    console.log(html);
    this.main.find("tbody").append(html);
    /*counter=msg[1].join(" ; ").length;
    console.log(msg[1].join(" ; "));*/
  },
  populateForn:function(who,msg){
    $("."+who).find("input").each(function(a,b){
      $(b).val(msg[0][$(b).attr("name")]);
    });
    $("."+who).find("textarea").val(msg[0].TEMP_BODY);
  },
  save:function(a){
    var TEMP_ID,date;
    switch($(a.target).attr("name")){
      case "isnote":
        if($(".notebook textarea").val().length){
          if(this.getPage() === "detail"){
            TEMP_ID=1;
          }
          else{
            TEMP_ID=2;
          }
          var day,date;
          date=new Date();
          if(parseInt(date.getDate())<10){
            day="0"+date.getDate();
          }
          else{
            day=date.getDate();
          }
          date=""+date.getFullYear()+"-0"+(date.getMonth()+1)+"-"+day;
          this.callService("gravarNotes","<OBJ_ID>"+this.objid+"</OBJ_ID><TP_NOTA_ID>"+TEMP_ID+"</TP_NOTA_ID><USU_COD>"+this.usr.USU_COD+"</USU_COD>","<NOTA_DESC>"+$(".notebook textarea").val()+"</NOTA_DESC><CREATE_DATE>"+date+"</CREATE_DATE>");
        }
        else{
          this.modal.open("message","Digite o texto da anotação!!!",!1,!0);
        }
        break;
      case 'istemp':
        console.dir(this.objid);
        this.callService("gravarTemplate","<TEMP_ID>"+(this.objid[0].TEMP_ID || 0)+"</TEMP_ID>"+"<TEMP_DESC>"+$(".dialog input[name='TEMP_DESC']").val()+"</TEMP_DESC><TEMP_SUBJECT>"+$(".dialog input[name='TEMP_SUBJECT']").val()+"</TEMP_SUBJECT><TEMP_BODY>"+$(".dialog textarea").val()+"</TEMP_BODY><SEGM_COD>"+this.objid[0].SEGM_COD+"</SEGM_COD>","<TP_TEMP_ID>"+(this.objid[0].TP_TEMP_ID || 2)+"</TP_TEMP_ID>","<action>U</action>");
        break;
    }
  },
  clean:function(){
    this.main.find("input").val("");
    this.main.find("textarea").val("");
    this.objid="";
    this.email=[];
  }
});

/**
* Content's class
* @exports Content
* @constructor
*/
window.Content = Spine.Controller.sub({
  elements:{
    /*".viewport":"table",
    ".table tbody":"tbody",
    ".floatThead":"tcontainer"*/
  },

  /**
  * `OK Set thed loading state`
  * @memberOf Content#
  * @param {Boolean} a. If true show mask, else hide mask.
  */
  changeview:function(a) {
    //console.log("1");
    if(typeof this.table !== "object"){
      this.table=$(".viewport");
      this.tbody=$("#table tbody");
      this.tcontainer=$(".floatThead");
      this.bedit=$(".bedit");
    }
    this.create = this[a];
    "images" === a ? this.itens && this.bedit.removeClass("unable") && this.clean(): this.itens && this.bedit.addClass("unable") && this.reset();
    this.tbody.empty();
    this.table.empty();
  }, images:function(a) {
    var viewport=$(".viewport");
    $("body").attr("class","").addClass("images");
    console.dir(a);
    a.appendTo($(".viewport").eq(viewport.length-1));
    this.itens = $(".viewport").find(".col");
  }, list:function(a) {
    var view=this.itens = $("#table tbody");
    $("body").attr("class","").addClass("list");
    a.appendTo($("#table tbody"));
    this.itens = $("#table tbody").find('tr');
  }, clean:function() {
    this.itens.remove();
    this.itens = $([]);
  }, reset:function() {
    /*this.table.hide();
    this.tbody.hide();*/
    //this.bread.fadeOut();
    console.log("RESETOU");
    this.page = 0;
    this.clean();
  }, init:function() {
    // (this.type !== "CLIENTE" && this.type !== "VISITANTE") ? this.table.addClass('cseven') : this.table.addClass('cfive');
    console.log("RESETOU");
    this.itens = $([]);
    this.page = 0;
    // this.el.disableSelection && this.el.disableSelection();
  }
  });

/**
* Box's class and actions like render and change by images or list
* @exports Box
* @constructor
*/
window.Box = Spine.Controller.sub({init:function() {
  this.template = this[this.view];
  }, elements:{
      a:"button"    
  }, 

  /**
  * `OK Set thed loading state`
  * @memberOf Box#
  * @param {Boolean} a. If true show mask, else hide mask.
  */
  render:function(a) {
    var context=this;
    a && (this.item = a);
    this.html(this.template(this.item));
    "images" === this.view && this.el.find(".thumbnail").prepend(this.url);
    return this;
  },
  setDate:function(list){
    var i,length;
    length=list.length;
    //console.dir(list);
    for(i=0;i<length;i++){
      list[i].CREATE_DATE=parseJsonDate(list[i].CREATE_DATE).toLocaleDateString();
    }
  }, images:function(a) {
    var homologado,note,fisica,fav,email,annex,status,result="",samesegm=!1;
    this.el.addClass('col col-small col-large');
    $(".bselect").removeClass("sel");
    homologado= a.AMOS_HOMOLOGAR ? "has":"nothas";  
    note= a.NOTES.length   ? true:false;
    fisica= a.FLAG_FISICA ? "has":"nothas";
    fav= a.FLAG_PRIORIDADE ? "has":"nothas";
    annex= a.AMOS_HOMOLOGAR ? true:false;
    status= a.AMOS_STATUS ? "complet":"incomplet";
    email= a.AMOS_ENV_EMAIL? "sent":"disabled";

    //Creating result
    result+="<a href='#detail/"+parseInt(a.FEIR_COD)+"/"+a.AMOS_DESC+"'><div class='thumbnail' id='"+a.AMOS_ID+"''>";
    if(!this.unable_select){
      result+="<button type='button' name='"+a.AMOS_ID+"' class='icon'></button>"; //bselection
    }
    else{
      if($("html").hasClass('edit')){
        $(".bselect[name='bselection-edit']").addClass('sel');
      }
      else{
        $(".bselect[name='bselection']").addClass('sel');
      }
      result+="<button type='button' name='"+a.AMOS_ID+"' class='icon bselection'></button>"; //bselection
    }
    //result+="<a href='#detail/"+parseInt(a.FEIR_COD)+"/"+a.AMOS_DESC+"'><div class='thumbnail' id="+a.AMOS_ID+"><button type='button' name='"+a.AMOS_ID+"' class='icon'></button>"; //bselection

    result+="<div class='caption'><div class='caption-upside'><ul class='caption-icons'><li><button type='button' class='caption-icons-icon justit bstatus "+status+"' title='"+status.capitalize()+"'></button></li><li><button type='button' class='caption-icons-icon justit bemail "+email+"' name='"+a.AMOS_ID+"'></button></li>";
    result+="<li><button type='button' class='caption-icons-icon justit setitem bhomologado "+homologado+"' name='"+a.AMOS_ID+"' title='Homologar'></button></li>"
    if(note){
      var segnote=[];
      for(i=a.NOTES.length;i>0;i--){
        if(a.NOTES[i-1].SEGM_COD === this.usr.SEGM_COD || this.usr.SEGM_COD === "TD"){
          segnote.push(a.NOTES[i-1]);
        }
      }
      if(segnote.length){
        this.setDate(segnote);
        result+="<li class='tooltip tooltip-selectable'><button type='button' class='caption-icons-icon justit bnote'></button><ul class='tooltip-content notepad notepadmess rightless'><li class='tooltip-title'><p class='tooltip-item'>Anotações</p></li>";
        for(i=0;i<segnote.length;i++){
          result+="<li><article><div class='notepad-note blockquote'><p><b>"+segnote[i].CREATE_DATE+" | "+a.FORN_ID+" - "+ a.FORN_DESC+" | "+segnote[i].OBJ_ID+"</b></p><p>"+segnote[i].USU_NOME+" - "+segnote[i].SEGM_DESC+"</p><p>"+segnote[i].NOTA_DESC+"</p></div><div class='blockquote'>";
          if(segnote[i].USU_COD === this.usr.USU_COD || this.usr.SEGM_COD === "TD"){
            result+= "<button type='button' class='tooltip-item caption-icons-icon btrash-big viewer' title='"+segnote[i].NOTA_ID+"' name='"+segnote[i].USU_COD+"'></button>";
          }
          result+="</div></article></li>";
        }
        result+="</ul></td>";
      }
      else{
        result+="";
      }
    }
    else{
      result+="";
    }

    result+="<li><button type='button' class='caption-icons-icon justit setitem bfisica "+fisica+"' name='"+a.AMOS_ID+"' title='Fisica'></button></li><li><button type='button' class='caption-icons-icon justit setitem bfav "+fav+"' name='"+a.AMOS_ID+"' title='Favoritar'></button></li></ul>";
    result+="<div class='caption-desc'><p><span>Código da Amostra: </span><span>"+a.AMOS_DESC+"</span></p><p><span>Fornecedor: </span><span>"+a.FORN_DESC+"</span></p><p><span>Data: </span><span>"+a.CREATE_DATE+"</span></p>";
    if(annex){
      result+="<button type='button' class='icon bannex'></button>";
    }
    result+="</div></div></a><div class='caption-downside'><ul>";
    if(a.TECI_DESC){
      result+="<li>";
      result+="<a href='#"+a.TECI_COD+"' name='TECI_COD' title='"+a.AMOS_ID+"'>"+a.TECI_DESC+"</a></li>";
    }
    if(a.BASE_DESC){
      result+="<li>";
      result+="<a href='#"+a.BASE_COD+"' name='BASE_COD' title='"+a.AMOS_ID+"'>"+a.BASE_DESC+"</a></li>";
    }
    if(a.GRUP_DESC){
      result+="<li>";
      result+="<a href='#"+a.GRUP_COD+"' name='GRUP_COD' title='"+a.AMOS_ID+"'>"+a.GRUP_DESC+"</a></li>";
    }
    if(a.SUBG_DESC){
      result+="<li>";
      result+="<a href='#"+a.SUBG_COD+"' name='SUBG_COD' title='"+a.AMOS_ID+"'>"+a.SUBG_DESC+"</a></li>";
    }
    if(a.COMPOSITIONS.length){
      //result+="<li>";
      for(i=0;i<a.COMPOSITIONS.length;i++){
        result+="<li>";
        result+="<a href='#"+a.COMPOSITIONS[i].COMP_COD.replace("   ","")+"' name='"+a.AMOS_ID+"'>"+a.COMPOSITIONS[i].COMP_DESC+"</a></li>";
        //concat.push(a.COMPOSITIONS[i].COMP_DESC);
      }
    }
    result+="</ul>";
    //Por Enquanto
    //result+="<li>Plano</li><li>Tinto</li><li>Transparências</li><li>Bordado</li><li>Viscose</li><li>Plano</li><li>Tinto</li><li>Transparências</li><li>Bordado</li><li>Viscose</li>";
    result+="</div></div></div>";
    return result;
  }, list:function(a) {
    switch (this.page){
      case "fornecedores":
        var result="",i,status,nome_contato,segmento=[],middlefav="";
        status= a.FORN_STATUS ? "complet":"incomplet";
        result+="<td><a href='#fornecedores/edit/"+a.FORN_ID+"'>"+a.FORN_DESC+"</a></td>"+"<td><a href='#fornecedores/edit/"+a.FORN_ID+"'>"+a.FEIR_DESC+"</a></td>"+"<td><a href='#fornecedores/edit/"+a.FORN_ID+"'>"+a.CREATE_DATE+"</a></td>";
        

        if(a.CONTACTS.length){
          var scont=[];
          for(i=0;i<a.CONTACTS.length;i++){
            if(a.CONTACTS[i].SEGM_COD === this.usr.SEGM_COD || this.usr.SEGM_COD === "TD"){
              scont.push(a.CONTACTS[i]);
            }
          }
          if(scont.length){
            result+="<td><a href='#fornecedores/edit/"+a.FORN_ID+"'>";
            for(i=0;i<scont.length;i++){
              if(scont[i].CONT_NOME.length){
                nome_contato=scont[i].CONT_NOME;
              }
              else{
                nome_contato="SEM NOME";
              }
              segmento.push(scont[i].SEGM_DESC);
              result+=""+nome_contato+"<br/>";
            }
            result+="</a></td>";
          }
          else{
             result+="<td><a href='#fornecedores/edit/"+a.FORN_ID+"'></a></td>";
          }
        }
        else{
          result+="<td><a href='#fornecedores/edit/"+a.FORN_ID+"'></a></td>";
        }

        if(segmento.length){
          result+="<td><a href='#fornecedores/edit/"+a.FORN_ID+"'>"+segmento.join("<br/>")+"</a></td>";
        }
        else{
          result+="<td><a href='#fornecedores/edit/"+a.FORN_ID+"'></td>";
        }

        if(a.NOTES.length ){
          var segnote=[];
          for(i=a.NOTES.length;i>0;i--){
            console.log(this.usr.USU_COD);
            if(a.NOTES[i-1].SEGM_COD === this.usr.SEGM_COD || this.usr.SEGM_COD === "TD"){
              segnote.push(a.NOTES[i-1]);
            }
          }
          if(segnote.length){
            this.setDate(a.NOTES);
            result+="<td class='tooltip tooltip-selectable'><button type='button' class='caption-icons-icon justit bnote'></button><ul class='tooltip-content notepad notepadmess col-large'><li class='tooltip-title'><p class='tooltip-item'>Anotações</p></li>";
            for(i=0;i<segnote.length;i++){
              result+="<li><article><div class='notepad-note blockquote'><p><b>"+segnote[i].CREATE_DATE+" | "+a.FORN_ID+" - "+a.FORN_DESC+" | "+segnote[i].NOTA_ID+"</b></p><p>"+segnote[i].USU_NOME+" - "+segnote[i].SEGM_DESC+"</p><p>"+segnote[i].NOTA_DESC+"</p></div><div class='blockquote'>";
              if(segnote[i].USU_COD === this.usr.USU_COD || this.usr.SEGM_COD === "TD"){
                result+= "<button type='button' class='tooltip-item caption-icons-icon btrash-big viewer' title='"+segnote[i].NOTA_ID+"' name='"+segnote[i].USU_COD+"'></button>";
              }
              result+="</div></article></li>"
            }
            result+="</ul></td>"
          }
          else{
            result+="<td></td>";
          }
        }
        else{
          result+="<td></td>";
        }
        if(a.FAVORITES.length){
          for(i=0;i<a.FAVORITES.length;i++){
            console.log(a.FAVORITES[i].SEGM_COD+" , "+this.usr.SEGM_COD);
            if(middlefav === ""){
              if(a.FAVORITES[i].SEGM_COD === this.usr.SEGM_COD){
                middlefav="has";
              }
              else{
                console.log("diferente");
                middlefav="middle";
              }
            }
          }
          result+="<td class='tooltip'><button type='button' class='caption-icons-icon justit bstar "+middlefav+"' name='"+a.FORN_ID+"'></button><ul class='tooltip-content col-large'>";
          for(i=0;i<a.FAVORITES.length;i++){
            result+="<li><button type='button' class='tooltip-item caption-icons-icon bstar has'>"+a.FAVORITES[i].SEGM_DESC+"</li>";
          }
          result+="</ul></td>";
        }
        else{
          result+="<td><button type='button' class='caption-icons-icon justit bstar nothas' name='"+a.FORN_ID+"'></button></td>";
        }

        result+="<td><button type='button' class='caption-icons-icon justit bstatus "+status+"' title='"+status.capitalize()+"'>"+status+"</button></td>";
        return result;
        break;
      case 'amostras':
        var homologado,note,fisica,fav,email,annex,status,result="",i;
        this.el.addClass('col col-small col-large');
        homologado= a.AMOS_HOMOLOGAR ? "has":"nothas";
        note= a.NOTES.length   ? true:false;
        fisica= a.FLAG_FISICA ? "has":"nothas";
        fav= a.FLAG_PRIORIDADE ? "has":"nothas";
        annex= a.AMOS_HOMOLOGAR ? true:false;
        status= a.AMOS_STATUS ? "complet":"incomplet";
        email= a.AMOS_ENV_EMAIL? "sent":"disabled";

        //Creating result
        result+="<td><button type='button' name='"+a.AMOS_ID+"' class='icon bselection'></button></td><td><a href='#detail/"+parseInt(a.FEIR_COD)+"/"+a.AMOS_ID+"'>"+a.FORN_DESC+"</a></td><td><a href='#detail/"+a.AMOS_ID+"'>"+a.AMOS_DESC+"</a></td><td><a href='#detail/"+a.AMOS_ID+"'>"+a.CREATE_DATE+"</a></td><td><button type='button' class='caption-icons-icon justit setitem bfisica "+fisica+"' name='"+a.AMOS_ID+"' title='Fisica'></button></td><td>"+a.AMOS_PRECO+"</td><td>"+a.AMOS_COTACAO_KG+"</td><td><button type='button' class='caption-icons-icon justit setitem bfav "+fav+"' name='"+a.AMOS_ID+"' title='Favoritar'></button></td><td><button type='button' class='caption-icons-icon justit setitem bhomologado "+homologado+"' name='"+a.AMOS_ID+"' title='Homologar'></button></td>";
        if(note){
          var segnote=[];
          for(i=a.NOTES.length;i>0;i--){
            if(a.NOTES[i-1].SEGM_COD === this.usr.SEGM_COD || this.usr.SEGM_COD === "TD"){
              segnote.push(a.NOTES[i-1]);
            }
          }
          if(segnote){
            this.setDate(segnote);
            result+="<td class='tooltip tooltip-selectable'><button type='button' class='caption-icons-icon justit bnote'></button><ul class='tooltip-content notepad notepadmess col-large'><li class='tooltip-title'><p class='tooltip-item'>Anotações</p></li>";
            for(i=0;i<segnote.length;i++){
              result+="<li><article><div class='notepad-note blockquote'><p><b>"+segnote[i].CREATE_DATE+" | "+ segnote[i].USU_NOME+" | "+segnote[i].NOTA_ID+"</b></p><p>"+segnote[i].SEGM_DESC+" - Assunto:</p><p>"+segnote[i].NOTA_DESC+"</p></div><div class='blockquote'>";
              if(segnote[i].USU_COD === this.usr.USU_COD || this.usr.SEGM_COD === "TD"){
                result+= "<button type='button' class='tooltip-item caption-icons-icon btrash-big viewer' title='"+segnote[i].NOTA_ID+"' name='"+segnote[i].USU_COD+"'></button>";
              }
              result+="</div></article></li>";
            }
            result+="</ul></td>";
          }
          else{
            result+="<td></td>";
          }
        }
        else{
          result+="<td></td>";
        }

        annex ? result+="<td><button type='button' class='icon bannex'></button></td>" : result+="<td></td>";
        result+="<td><button type='button' class='caption-icons-icon justit bemail "+email+"' name='"+a.AMOS_ID+"'></button></td><td><a href='#detail/"+a.AMOS_ID+"'>"+a.TECI_DESC+"</a></td><td><a href='#detail/"+a.AMOS_ID+"'>"+a.BASE_DESC+"</a></td><td><a href='#detail/"+a.AMOS_ID+"'>"+a.GRUP_DESC+"</a></td><td><a href='#detail/"+a.AMOS_ID+"'>"+a.SUBG_DESC+"</a></td>";
        if(a.COMPOSITIONS.length){
          var concat=[];
          result+="<td>";
          for(i=0;i<a.COMPOSITIONS.length;i++){
            concat.push(a.COMPOSITIONS[i].COMP_DESC);
          }
          concat.join();
          result+=concat+"</td>";
        }
        else{
          result+="<td></td>";
        }
        result+="<td><button type='button' class='caption-icons-icon justit bstatus "+status+"' title='"+status.capitalize()+"'>"+status+"</button></td>";
        return result;
        break;
      case 'local':
        var result="";
        result+="<td>"+a.FEIR_DESC+"</td>"+"<td>"+a.PAIS_DESC+"</td>"+"<td>"+a.REGI_DESC+"</td>"+"<td><a href='#local/edit/"+parseInt(a.FEIR_COD)+"' class='icon floatLeft edit-big'></a></td>";
        return result;
        break;
      case 'template_email':
        var result="";
        //result='<td style="max-width:200px;">'+a.TEMP_ID+"<br/></td>"+"<td>"+a.SEGM_DESC+"<br/><div class='template"+a.TEMP_ID+" show-hide hide'>Assunto</br>"+"Texto"+"</div></td>"+"<td>"+a.TEMP_DESC+"</br><div class='template"+a.TEMP_ID+" show-hide hide'>"+a.TEMP_SUBJECT+"</br>"+a.TEMP_BODY+"</div></td>"+"<td>"+a.TP_TEMP_DESC+"</br><div class='template"+a.TEMP_ID+" show-hide hide'>ITENS PERSONALIZADOS"+"<div class='close-size'>"+/*<button type='button' class='icon floatLeft s-four edit-temp' alt='list' name='"+a.TEMP_ID+"'>Editar</button><button type='button' class='icon floatLeft s-four delete-temp' alt='list' name='"+a.TP_TEMP_ID+"' title='"+a.TEMP_ID+"''>Deletar</button>*/'</div></div></td><td><button type="button" class="caption-icons-icon bstar  bnote" name="'+a.TEMP_ID+'"></button></td>';
        result='<td style="max-width:200px;">'+a.TEMP_ID+'<br/><div class="info-template hide item'+a.TEMP_ID+'"><div class="text-template"><p><b>ASSUNTO</b></p><br><form><textarea disabled="disabled" name="TEMP_SUBJECT">'+a.TEMP_SUBJECT+'</textarea><br><p><b>TEXTO</b></p><br><textarea disabled="disabled" name="TEMP_BODY" class="edit-text">'+a.TEMP_BODY+'</textarea></form></div><ul class="custombuttons hide"><li><p><b>ITENS PERSONALIZADOS</b></p></li><li><button type="button" class="icon floatLeft s-four  hash" alt="SUPPLIER" name="'+a.TEMP_ID+'">Fornecedor</button></li><li><button type="button" class="icon floatLeft s-four  hash" alt="SAMPLES" name="'+a.TEMP_ID+'">Amostras</button></li><li><button type="button" class="icon floatLeft s-four  hash " alt="CONTACTS" name="'+a.TEMP_ID+'">Contatos</button></li></ul><ul class="ulbottom"><li><button type="button" class="icon floatLeft s-four edit-temp" alt="list" name="'+a.TEMP_ID+'">Editar</button></li><li><button type="button" class="icon floatLeft s-four delete-temp" alt="list" title="'+a.TEMP_ID+'" name="'+a.TP_TEMP_ID+'">Excluir</button></li><li><button type="button" class="icon floatLeft s-four save-temp hide" alt="list" name="'+a.TEMP_ID+'">Salvar</button></li></ul><button type="button" class="icon s-four close-temp" alt="list" name="'+a.TEMP_ID+'">Fechar</button></div></td></td><td>'+a.SEGM_DESC+'</td><td>'+a.TEMP_DESC+'</td><td>'+a.TP_TEMP_DESC+'</td><td><button type="button" class="open-info" name="'+a.TEMP_ID+'"><span></span></button></td>';
        return result;
        break;
      default:
        console.log("ALGO ERRADO");
    }
  }
});