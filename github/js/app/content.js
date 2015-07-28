window.Spotlight = Spine.Controller.sub({
  elements:{
    //dd:"buttons"
  }, 
  events:{
    //"click .spotlight button":"select"
  }, 
  select:function(a) {
    var fair="<FEIR_COD>",name="<FORN_ID>";
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
      name="<FORN_DESC>"+a.val()+"</FORN_DESC>";
      this.setFornVal(a.val());
    }
    this.reset();
    if(this.getFairVal()){
      fair+=this.getFairVal()+"</FEIR_COD>";
    }
    else{
      fair+="</FEIR_COD>";
    }

    if(this.getPage() === "amostras"){
      this.callService("amostras",fair,name,"",'<LINHA_I>'+'1'+'</LINHA_I>','<LINHA_F>'+'20'+'</LINHA_F>','<CREATE_DATE_I>2010-01-01</CREATE_DATE_I>','<CREATE_DATE_F>2050-01-01</CREATE_DATE_F>');
      this.close();
    }
    else{
      this.setNotCombo(!0);
      this.callService("fornecedores",fair,name,'<LINHA_I>'+'1'+'</LINHA_I>','<LINHA_F>'+'20'+'</LINHA_F>','<CREATE_DATE_I>2010-04-10</CREATE_DATE_I>','<CREATE_DATE_F>2050-04-10</CREATE_DATE_F>');
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
  events:{
    /*"click .bclose":"close" */
  },

  /**
  * `OK Set thed loading state`
  * @memberOf Modal#
  * @param {Boolean} a. If true show mask, else hide mask.
  */
  close:function(a){
    a.preventDefault();
    this.el.fadeOut('fast');
  },
  open:function() {
    this.el.fadeIn('fast');
    $(document).keypress(function(e) { 
      if (e.keyCode == 27) {
        $('#modal').fadeOut('fast');
      }
    });
  },
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
    $("body").attr("class","").addClass("images");
    a.appendTo($(".viewport"));
    this.itens = $(".viewport").find(".thumbnail");
  }, list:function(a) {
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
    this.page = "";
    this.clean();
  }, init:function() {
    // (this.type !== "CLIENTE" && this.type !== "VISITANTE") ? this.table.addClass('cseven') : this.table.addClass('cfive');
    this.itens = $([]);
    this.page = 0;
    this.tutpage = 1;
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
    a && (this.item = a);
    this.html(this.template(this.item));
    "images" === this.view && this.el.find(".thumbnail").prepend(this.url);  
    return this;
  }, images:function(a) {
    var homologado,note,fisica,fav,email,annex,status,result="";
    this.el.addClass('col col-small col-large');
    homologado= a.AMOS_HOMOLOGAR ? "has":"nothas";
    note= a.NOTES.length   ? true:false;
    fisica= a.FLAG_FISICA ? "has":"nothas";
    fav= a.FLAG_PRIORIDADE ? "has":"nothas";
    annex= a.AMOS_HOMOLOGAR ? true:false;
    status= a.AMOS_STATUS ? "complet":"incomplet";
    email= a.AMOS_ENV_EMAIL? "sent":"disabled";

    //Creating result
    result+="<a href='#detail/"+a.AMOS_ID+"'><div class='thumbnail'><button type='button' name='"+a.AMOS_ID+"' class='icon'></button>"; //bselection
    result+="<div class='caption'><div class='caption-upside'><ul class='caption-icons'><li><button type='button' class='caption-icons-icon justit bstatus "+status+"'></button></li><li><button type='button' class='caption-icons-icon justit bemail "+email+"'></button></li>";
    result+="<li><button type='button' class='caption-icons-icon justit bhomologado "+homologado+"' name='"+a.AMOS_ID+"' title='Homologar'></button></li>"
    if(note){
      result+="<li class='tooltip tooltip-selectable'><button type='button' class='caption-icons-icon justit bnote'></button><ul class='tooltip-content notepad notepadmess rightless'><li class='tooltip-title'><p class='tooltip-item'>Anotações</p></li>";
      for(i=0;i<a.NOTES.length;i++){
        result+="<li><article><div class='notepad-note blockquote'><p>"+a.NOTES[i].CREATE_DATE+/*a.NOTES[i].CREATE_DATE*/" | "+ a.NOTES[i].USU_NOME+" | "+a.NOTES[i].OBJ_ID+"</p><p>"+a.NOTES[i].SEGM_DESC+" - Assunto:</p><p>"+a.NOTES[i].NOTA_DESC+"</p></div><div class='blockquote'><button type='button' class='tooltip-item caption-icons-icon btrash-big' id='"+a.NOTES[i].NOTA_ID+"' name='"+a.NOTES[i].USU_COD+"'></button></div></article></li>"
      }
      result+="</ul></li>"
    }
    result+="<li><button type='button' class='caption-icons-icon justit bfisica "+fisica+"' name='"+a.AMOS_ID+"' title='Fisica'></button></li><li><button type='button' class='caption-icons-icon justit bfav "+fav+"' name='"+a.AMOS_ID+"' title='Favoritar'></button></li></ul>";
    result+="<div class='caption-desc'><p><span>Código da Amostra: </span><span>"+a.AMOS_ID+"</span></p><p><span>Fornecedor: </span><span>"+a.FORN_DESC+"</span></p><p><span>Data: </span><span>"+a.CREATE_DATE+"</span></p>";
    if(annex){
      result+="<button type='button' class='icon bannex'></button>";
    }
    result+="</div></div></a><div class='caption-downside'><ul>";
    if(a.COMPOSITIONS.length){
      //result+="<li>";
      for(i=0;i<a.COMPOSITIONS.length;i++){
        result+="<li>";
        result+="<a href='#"+a.COMPOSITIONS[i].COMP_COD.replace("   ","")+"' name='"+a.AMOS_ID+"'>"+a.COMPOSITIONS[i].COMP_DESC+"</a></li>";
        //concat.push(a.COMPOSITIONS[i].COMP_DESC);
      }
      result+="</ul>";
    }
    else{
      result+="</ul>";
    }
    //Por Enquanto
    //result+="<li>Plano</li><li>Tinto</li><li>Transparências</li><li>Bordado</li><li>Viscose</li><li>Plano</li><li>Tinto</li><li>Transparências</li><li>Bordado</li><li>Viscose</li>";
    result+="</div></div></div>";
    return result;
  }, list:function(a) {
    switch (this.page){
      case "fornecedores":
        var result="",i,status,nome_contato,segmento=[];
        status= a.FORN_STATUS ? "complet":"incomplet";
        result+="<td><a href='#fornecedores/"+a.FEIR_COD+"'>"+a.FORN_DESC+"</a></td>"+"<td><a href='#fornecedores/"+a.FEIR_COD+"'>"+a.FEIR_DESC+"</a></td>"+"<td><a href='#fornecedores/"+a.FEIR_COD+"'>"+a.CREATE_DATE+"</a></td>";
        if(a.CONTACTS.length){
          result+="<td><a href='#fornecedores/"+a.FEIR_COD+"'>";
          for(i=0;i<a.CONTACTS.length;i++){
            if(a.CONTACTS[i].CONT_NOME.length){
              nome_contato=a.CONTACTS[i].CONT_NOME;
            }
            else{
              nome_contato="SEM NOME";
            }
            segmento.push(a.CONTACTS[i].SEGM_DESC);
            result+=""+nome_contato+"<br/>";
          }
          result+="</a></td>";
        }
        else{
          result+="<td><a href='#fornecedores/"+a.FEIR_COD+"'></a></td>";
        }

        if(segmento.length){
          result+="<td><a href='#fornecedores/"+a.FEIR_COD+"'>"+segmento.join("<br/>")+"</a></td>";
        }
        else{
          result+="<td><a href='#fornecedores/"+a.FEIR_COD+"'></td>";
        }

        if(a.FAVORITES.length){
          result+="<td class='tooltip'><button type='button' class='caption-icons-icon justit bstar has'></button><ul class='tooltip-content col-large'>";
          for(i=0;i<a.FAVORITES.length;i++){
            result+="<li><button type='button' class='tooltip-item caption-icons-icon bstar has'>"+a.FAVORITES[i].SEGM_DESC+"</li>";
          }
          result+="</ul></td>";
        }
        else{
          result+="<td><button type='button' class='caption-icons-icon justit bstar nothas'></button></td>";
        }

        if(a.NOTES.length){
          result+="<td class='tooltip tooltip-selectable'><button type='button' class='caption-icons-icon justit bnote'></button><ul class='tooltip-content notepad notepadmess col-large'><li class='tooltip-title'><p class='tooltip-item'>Anotações</p></li>";
          for(i=0;i<a.NOTES.length;i++){
            result+="<li><article><div class='notepad-note blockquote'><p>"+a.NOTES[i].CREATE_DATE+" | "+ a.NOTES[i].USU_NOME+" | "+a.NOTES[i].OBJ_ID+"</p><p>"+a.NOTES[i].SEGM_DESC+" - Assunto:</p><p>"+a.NOTES[i].NOTA_DESC+"</p></div><div class='blockquote'><button type='button' class='tooltip-item caption-icons-icon btrash-big' id='"+a.NOTES[i].NOTA_ID+"' name='"+a.NOTES[i].USU_COD+"'></button></div></article></li>"
          }
          result+="</ul></td>"
        }
        else{
          result+="<td></td>";
        }
        result+="<td><button type='button' class='caption-icons-icon justit bstatus "+status+"'>"+status+"</button></td>";
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
        result+="<td><button type='button' name='"+a.AMOS_ID+"'' class='icon bselection' name='"+a.AMOS_ID+"'></button></td><td><a href='#detail/"+a.AMOS_ID+"'>"+a.FORN_DESC+"</a></td><td><a href='#detail/"+a.AMOS_ID+"'>"+a.AMOS_ID+"</a></td><td><a href='#detail/"+a.AMOS_ID+"'>"+a.CREATE_DATE+"</a></td><td><button type='button' class='caption-icons-icon justit bfisica "+fisica+"' name='"+a.AMOS_ID+"' title='Fisica'></button></td><td>"+a.AMOS_PRECO+"</td><td>"+a.AMOS_COTACAO_KG+"</td><td><button type='button' class='caption-icons-icon justit bfav "+fav+"' name='"+a.AMOS_ID+"' title='Favoritar'></button></td><td><button type='button' class='caption-icons-icon justit bhomologado "+homologado+"' name='"+a.AMOS_ID+"' title='Homologar'></button></td>";
        if(note){
          result+="<td class='tooltip tooltip-selectable'><button type='button' class='caption-icons-icon justit bnote'></button><ul class='tooltip-content notepad notepadmess col-large'><li class='tooltip-title'><p class='tooltip-item'>Anotações</p></li>";
          for(i=0;i<a.NOTES.length;i++){
            result+="<li><article><div class='notepad-note blockquote'><p>"+a.NOTES[i].CREATE_DATE+" | "+ a.NOTES[i].USU_NOME+" | "+a.NOTES[i].OBJ_ID+"</p><p>"+a.NOTES[i].SEGM_DESC+" - Assunto:</p><p>"+a.NOTES[i].NOTA_DESC+"</p></div><div class='blockquote'><button type='button' class='tooltip-item caption-icons-icon btrash-big' id='"+a.NOTES[i].NOTA_ID+"' name='"+a.NOTES[i].USU_COD+"'></button></div></article></li>"
          }
          result+="</ul></td>"
        }
        else{
          result+="<td></td>";
        }
        annex ? result+="<td><button type='button' class='icon bannex'></button></td>" : result+="<td></td>";
        result+="<td><button type='button' class='caption-icons-icon justit bemail "+email+"'></button></td><td><a href='#detail/"+a.AMOS_ID+"'>"+a.TECI_DESC+"</a></td><td><a href='#detail/"+a.AMOS_ID+"'>"+a.BASE_DESC+"</a></td><td><a href='#detail/"+a.AMOS_ID+"'>"+a.GRUP_DESC+"</a></td><td><a href='#detail/"+a.AMOS_ID+"'>"+a.SUBG_DESC+"</a></td>";
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
        result+="<td><button type='button' class='caption-icons-icon justit bstatus "+status+"'>"+status+"</button></td>";
        return result;
        break;
      case 'local':
        var result="";
        result+="<td>"+a.FEIR_DESC+"</td>"+"<td>"+a.REGI_DESC+"</td>"+"<td>"+a.PAIS_DESC+"</td>"+"<td><a href='#local/edit/"+a.FEIR_COD+"' class='icon floatLeft edit-big'></a></td>";
        return result;
        break;
      default:
        console.log("ALGO ERRADO");
    }
  }
});