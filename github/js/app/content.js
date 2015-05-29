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
    "click .bclose":"close"    
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
    ".viewport":"table",
    ".table-content .tbody":"tbody",
    ".table-container":"tcontainer"
  },

  /**
  * `OK Set thed loading state`
  * @memberOf Content#
  * @param {Boolean} a. If true show mask, else hide mask.
  */
  changeview:function(a) {
    this.create = this[a];
    "images" === a ? this.itens && this.clean() : this.itens && this.reset();
    this.tbody.empty();
    this.table.empty();
  }, images:function(a) {
    this.tcontainer.hide();
    this.table.show();
    a.appendTo(this.table);
    this.itens = this.el.find(".thumbnail");
  }, list:function(a) {
    this.tcontainer.show();
    this.tbody.show();
    this.table.hide();
    // this.tbody.show();
    a.appendTo(this.tbody);
    this.itens = this.tbody.find('tr');
  }, clean:function() {
    this.itens.remove();
    this.itens = $([]);
  }, reset:function() {
    this.table.hide();
    // this.tbody.hide();
    // this.bread.fadeOut();
    this.page = 0;
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
    var detail;
    this.el.addClass('col col-sm-1 col-sm-2 col-md-1 col-md-2 col-md-3 col-lg-1 col-lg-2');
    // PAI
    var $hash = window.location.hash.split("/")[0].replace('#','');
    if($hash=='artigos-pai'){
      detail=a.STORE+"/"+a.TYPE_MAT+"/"+a.MATNR;
      return"<a href='#detail/"+detail+"'><li class='thumbnail'><div class='caption'><h2>"+ a.MATNR +"</h2><h3>"+ a.MAKTX +"</h3></div></li></a>";
    }
    // FILHO
    else{
      var aData   = a.DATA_CHEGADA;
      // Breadcrumb, nome do pai
      var bread = $('.bread-colec').find("a").text();
      bread = bread.split("- ")[2];
      detail=bread+"/"+a.MATNR;
      return"<a href='#detail/"+detail+"'><li class='thumbnail big'><div class='caption'><h2>"+ a.MATNR +"</h2><h3>"+ a.MAKTX +"</h3><ul><li class='half'>PE: "+parseInt(a.PE)+"</li>|<li class='half right'>ATC: "+parseInt(a.ATC)+"</li><li>Data: "+convertDate(aData)+"</li></ul></p><span>Preço: R$ "+numDecimal(a.PRECO.toString().replace(".",",")+"  |  $ ")+numDecimal(a.PRECO_DOLAR.toString().replace(".",","))+"</span></div></li></a>";
    }
  }, list:function(a) {
    var detail;
    detail=a.STORE+"/"+a.TYPE_MAT+"/"+a.MATNR;
    // PAI
    var $hash = window.location.hash.split("/")[0].replace('#','');
    if($hash=='artigos-pai'){
      $('table').find('.tchildren').addClass('hide');
      $('table').find('.tpai').removeClass('hide');
      return "<td><a href='#detail/"+detail+"' >"+ a.MAKTX +"</td><td class='tcode'><a href='#detail/"+detail+"' >"+ a.MATNR +"</a></td>";
    }

    // FILHO
    else{
      var aData   = a.DATA_CHEGADA;
      var bread = $('.bread-colec').find("a").text();
      var preco = a.PRECO.toString().replace(".",",");
      bread = bread.split("- ")[2];
      detail=bread+"/"+a.MATNR;      
      
      $('table').find('.tpai').addClass('hide');
      $('table').find('.tchildren').removeClass('hide');
      return"<td><a href='#detail/"+detail+"' >"+ a.MAKTX +"</a></td><td><a href='#detail/"+detail+"' >"+ a.MATNR +"</a></td><td><a href='#detail/"+detail+"' >"+a.PE+"</a></td><td><a href='#detail/"+detail+"' >"+a.ATC+"</a></td><td><a href='#detail/"+detail+"' >R$ "+numDecimal(preco)+"  |  $ "+numDecimal(a.PRECO_DOLAR.toString().replace(".",","))+"</a></td><td class='tcode'><a href='#detail/"+detail+"' >"+convertDate(aData)+"</a></td>";
    }
  }
});