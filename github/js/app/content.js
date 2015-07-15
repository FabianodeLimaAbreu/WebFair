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
      this.tbody=$(".table tbody");
      this.tcontainer=$(".floatThead");
      this.bedit=$(".bedit");
    }
    this.create = this[a];
    "images" === a ? this.itens && this.bedit.removeClass("unable") && this.clean(): this.itens && this.bedit.addClass("unable") && this.reset();
    this.tbody.empty();
    this.table.empty();
  }, images:function(a) {
    $("body").attr("class","").addClass("images");
    a.appendTo(this.table);
    this.itens = this.table.find(".thumbnail");
  }, list:function(a) {
    $("body").attr("class","").addClass("list");
    a.appendTo(this.tbody);
    this.itens = this.tbody.find('tr');
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
    result+="<a href='#detail/"+a.AMOS_ID+"'><div class='thumbnail'><button type='button' name='#"+a.AMOS_ID+"' class='icon'></button>"; //bselection
    result+="<div class='caption'><div class='caption-upside'><ul class='caption-icons'><li><button type='button' class='caption-icons-icon justit bstatus "+status+"'></button></li><li><button type='button' class='caption-icons-icon justit bemail "+email+"'></button></li>";
    result+="<li><button type='button' class='caption-icons-icon justit bhomologado "+homologado+"'></button></li>"
    if(note){
      //result+="<li><button type='button' class='caption-icons-icon justit bnote'></button></li>";
      result+="<li class='tooltip tooltip-selectable'><button type='button' class='caption-icons-icon justit bnote'></button><ul class='tooltip-content notepad notepadmess rightless'><li class='tooltip-title'><p class='tooltip-item'>Anotações</p></li>";
      for(i=0;i<a.NOTES.length;i++){
        result+="<li><article><div class='notepad-note blockquote'><p>"+a.NOTES[i].CREATE_DATE+/*a.NOTES[i].CREATE_DATE*/" | "+ a.NOTES[i].USU_NOME+" | "+a.NOTES[i].OBJ_ID+"</p><p>"+a.NOTES[i].SEGM_DESC+" - Assunto:</p><p>"+a.NOTES[i].NOTA_DESC+"</p></div><div class='blockquote'><button type='button' class='tooltip-item caption-icons-icon btrash-big' id='"+a.NOTES[i].NOTA_ID+"' name='"+a.NOTES[i].USU_COD+"'></button></div></article></li>"
      }
      result+="</ul></li>"
    }
    result+="<li><button type='button' class='caption-icons-icon justit bfisica "+fisica+"'></button></li><li><button type='button' class='caption-icons-icon justit bfav "+fav+"'></button></li></ul>";
    result+="<div class='caption-desc'><p><span>Código da Amostra: </span><span>"+a.AMOS_ID+"</span></p><p><span>Fornecedor: </span><span>"+a.FORN_DESC+"</span></p><p><span>Data: </span><span>"+a.CREATE_DATE+"</span></p>";
    if(annex){
      result+="<button type='button' class='icon bannex'></button>";
    }
    result+="</div></div><div class='caption-downside'><ul>";
    //Por Enquanto
    result+="<li>Plano</li><li>Tinto</li><li>Transparências</li><li>Bordado</li><li>Viscose</li><li>Plano</li><li>Tinto</li><li>Transparências</li><li>Bordado</li><li>Viscose</li>";
    result+="</ul></div></div></div></a>";
    return result;
  }, list:function(a) {
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
    result+="<td><button type='button' name='"+a.AMOS_ID+"'' class='icon bselection' name='"+a.AMOS_ID+"''></button></td><td>"+a.FORN_DESC+"</td><td>"+a.AMOS_ID+"</td><td>"+a.CREATE_DATE+"</td><td><button type='button' class='caption-icons-icon justit bfisica "+fisica+"'></button></td><td>"+a.AMOS_PRECO+"</td><td>"+a.AMOS_COTACAO_KG+"</td><td><button type='button' class='caption-icons-icon justit bfav "+fav+"'></button></td><td><button type='button' class='caption-icons-icon justit bhomologado "+homologado+"'></button></td>";
    if(note){
      result+="<td class='tooltip tooltip-selectable'><button type='button' class='caption-icons-icon justit bnote'></button><ul class='tooltip-content notepad notepadmess col-large'><li class='tooltip-title'><p class='tooltip-item'>Anotações</p></li>";
      for(i=0;i<a.NOTES.length;i++){
        result+="<li><article><div class='notepad-note blockquote'><p>"+"12/15/2015"+/*a.NOTES[i].CREATE_DATE*/" | "+ a.NOTES[i].USU_NOME+" | "+a.NOTES[i].OBJ_ID+"</p><p>"+a.NOTES[i].SEGM_DESC+" - Assunto:</p><p>"+a.NOTES[i].NOTA_DESC+"</p></div><div class='blockquote'><button type='button' class='tooltip-item caption-icons-icon btrash-big' id='"+a.NOTES[i].NOTA_ID+"' name='"+a.NOTES[i].USU_COD+"'></button></div></article></li>"
      }
      result+="</ul></td>"
    }
    else{
      result+="<td></td>";
    }
    annex ? result+="<td><button type='button' class='icon bannex'></button></td>" : result+="<td></td>";
    result+="<td><button type='button' class='caption-icons-icon justit bemail "+email+"'></button></td><td>"+a.TECI_DESC+"</td><td>"+a.BASE_DESC+"</td><td>"+a.GRUP_DESC+"</td><td>"+a.SUBG_DESC+"</td>";
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
    result+="<td><button type='button' class='caption-icons-icon justit bstatus "+status+"'></button></td>";
    return result;
    //return "<td class='tcode'><a href='#detail/"+detail+"' >"+ a.MATNR +"</a></td>";
    //return "<td><a href='#detail/"+detail+"' >"+ a.MAKTX +"</td><td class='tcode'><a href='#detail/"+detail+"' >"+ a.MATNR +"</a></td>";
  }
});