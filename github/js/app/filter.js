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
window.Filter = Spine.Controller.sub({
elements:{
	//".refine":"listEl"
}, events:{
    //"click .search-refine a":"select"
},callerEvents:function(){
    var context=this;
    $(".refine a").unbind("click").bind("click",function(a){context.select(a);});
    $(".sub-refine a").unbind("click").bind("click",function(a){context.add(a);});
    $(".filter-confirm").unbind("click").bind("click",function(a){context.confirm(a);});
},add:function(a){
    if("object" === typeof a) {
      a.preventDefault(), a = $(a.target);
    }else {
      return!1
    }
    var b, c, d;
    b = $(".refine").find(".sel").attr("href").split("#")[1];
    c = a.attr("data");
    d = $(".refine").find("a").index($(".refine").find(".sel"));
    a.hasClass("sel") ? (b = this.list.filter(function(a) {
      return a.id === d && a.ft === c.toLowerCase();
    }), this.list = this.list.diff(b), a.removeClass("sel")) : (this.list.push({id:d, bt:b, ft:c.toLowerCase()}), a.addClass("sel"));
},select:function(a){
    var context=this;
    if("object" === typeof a) {
      a.preventDefault(), a = $(a.target);
    }else {
      return!1;
    }
    $(".sub-refine").addClass('hide').hide().find("ul").empty();;
    if(!a.hasClass("unsel") || a.hasClass("off")) {
      a.removeClass('sel').addClass('unsel');
      //this.close();
      return!1;
    }
    $(".refine").find("a").removeClass('sel').addClass('unsel');
    a.addClass('sel').removeClass('unsel');
    var b = a.attr("href").split("#")[1];
    (a = this.getfilter(b)) && this.setfilters(a.sort(), b);
    $(".sub-refine").removeClass('hide').show();
    $(".sub-refine a").unbind("click").bind("click",function(a){context.add(a);});
},setfilters:function(a,b){
    var c, d, e = [], f;
    d = this;
    a.forEach(function(a) {
        c = d.list.length ? d.list.filter(function(c) {
            return c.bt === b && (c.ft === a || c.ft.toUpperCase() === a.toUpperCase());
        }) : !1;
        c = parseInt(c) || c.length ? "sel" : " ";
        e.push('<li><a href="#" data="' + a + '" class="'+c+'">' + a.capitalize() + "</a></li>");
    });
    $(".sub-refine ul").html(e.join(""));
},getfilter:function(a){
	var b, c,d=[];
    if("COMPOSITIONS" !== a) {
    	for(var d = [], e = 0;e < this.data.length;e++) {
    		if(this.data[e][a] !== ""){
    			b=this.data[e][a];
	      		d.push(b);
    		}
    	}
    }else {
    	for(var d = [], e = 0;e < this.data.length;e++) {
    		if(this.data[e][a].length){
    			for(var j=0;j< this.data[e][a].length;j++){
	      			b=this.data[e][a][j].COMP_DESC.replace(/\s/g, '')
	      			d.push(b);
	      		}
    		}
    	}
    }
    return d.unique();
},checklist:function(a){
    this.callerEvents();
    this.data = a;
    console.dir(a);
    var b, c;
    a = $(".refine .unsel");
    b = this;
    a.each(function() {
      $(this).removeClass("off");
      c = $(this).attr("href").split("#")[1];
      c = b.getfilter(c);
      c.length || $(this).addClass("off");
    });
},reload:function(a,b){
    var i,b,d=[];
    b = b || this.data;
      if("COMPOSITIONS" !== a.bt) {
        return b.filter(function(b) {
          return b[a.bt] && -1 !== b[a.bt].toLowerCase().indexOf(a.ft);
        });
      }
      if(!a.pc) {
        c=b;
        c=c.filter(function(b){
            if(b["COMPOSITIONS"].length){
              for(var i=0;i<b["COMPOSITIONS"].length;i++){
                if((b["COMPOSITIONS"][i].COMP_DESC.replace(/\s/g, '').indexOf(a.ft.toUpperCase()))+1){
                  return 1;
                }
              }
            }
          return 0;
        });
        if(c.length){
          if(d.length){
            d.concat(c);
          }
          else{
            d = c;
          }
        }
        //console.dir(d);
        return d;
      }
  },confirm:function(a,cookie){
    var b, c, d, e = this, f, g;
    this.list = this.list.sortBy("id");
    //$(".filter_list li span").text(0).addClass('hide');
    c = this.list.map(function(a, b) {
      //$(".filter_list a[href='#"+a.bt+"']").parent().find("span").removeClass('hide').html(parseInt($(".filter_list a[href='#"+a.bt+"']").parent().find("span").html())+1);
        return a.id;
    });
    c = c.unique();
    if(c.length){
      for(b = 0;b < c.length;b++) {
        a = this.list.filter(function(a) {  
          return a.id === c[b];
        });
        a.length && (f = []) && a.forEach(function(a) {

          f = d = f.concat(e.reload(a, g));
          //console.log(a.bt +" "+ a.ft +" "+ d.length);
        }), g = d;
        if(!g.length){
          return $(".overview-container").remove(),this.close(),this.content.reset(),this.Componentfilter(g.unique(), 0, !0),!1;
          //return this.resetOptFilter(),this.setdata(g.unique()), this.close(), !1; 
        }
      }
      if(g){
        if(cookie){
          return g.unique();
        }
        //console.log(g.length);
        $(".overview-container").remove();
        this.content.reset();
        this.Componentfilter(g.unique(), 0, !0);
        this.close();
        //console.dir(g.unique());
        /*this.resetOptFilter();
        this.setdata(g.unique());
        this.close();*/
      }
    }
    else{ 
      if(cookie){
        return this.data;
      }
      $(".overview-container").remove();
      this.content.reset();
      this.Componentfilter(this.data, 0, !0);
      this.close();
      //this.bclear.eq(0).trigger('click');
    }
},close:function(){
  $(".refine a").removeClass('sel').addClass('unsel');
  $(".not-autoshow").removeClass('sel');
  $(".sub-refine").addClass('hide').hide().find("ul").empty();;
},
init:function() {
  this.list = [];
	this.data = null;
}});