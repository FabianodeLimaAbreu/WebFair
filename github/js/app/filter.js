/**
*@fileOverview Filter's component
* @module Filter
*
*/

/**
* Filter's class and actions
* @exports Filter
* @constructor
*/
window.Filter = Spine.Controller.sub({
elements:{
}, events:{
},
  /**
  *Caller bind events' methods
  * @memberOf Filter#
  * @name callerEvents
  */
  callerEvents:function(){
    var context=this;
    $(".refine a").unbind("click").bind("click",function(a){context.select(a);});
    $(".sub-refine a").unbind("click").bind("click",function(a){context.add(a);});
    $(".filter-confirm").unbind("click").bind("click",function(a){context.confirm(a);});
},
  /**
  * When add an subfilter's list opt, this method is called.
  * @param {event} a - click event itself
  * @memberOf Filter#
  * @name add
  */
  add:function(a){
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
},
  /**
  * When select (unable and disable) a filter's opt to show subfilter's list.
  * @param {event} a - click event itself
  * @memberOf Filter#
  * @name select
  */
  select:function(a){
    var context=this;
    if("object" === typeof a) {
      a.preventDefault(), a = $(a.target);
    }else {
      return!1;
    }
    $(".sub-refine").addClass('hide').hide().find("ul").empty();;
    if(!a.hasClass("unsel") || a.hasClass("off")) {
      a.removeClass('sel').addClass('unsel');
      return!1;
    }
    $(".refine").find("a").removeClass('sel').addClass('unsel');
    a.addClass('sel').removeClass('unsel');
    var b = a.attr("href").split("#")[1];
    (a = this.getfilter(b)) && this.setfilters(a.sort(), b);
    $(".sub-refine").removeClass('hide').show();
    $(".sub-refine a").unbind("click").bind("click",function(a){context.add(a);});
},
  /**
  * Create all subfilter's options items in html.
  * @param {Array} a - All opt to be write by html
  * @param {String} b - Subfilter's name
  * @memberOf Filter#
  * @name setfilters
  */
  setfilters:function(a,b){
    var c, d, e = [], f;
    d = this;
    a.forEach(function(a) {
        c = d.list.length ? d.list.filter(function(c) {
            return c.bt === b && (c.ft === a || c.ft.toUpperCase() === a.toUpperCase());
        }) : !1;
        c = parseInt(c) || c.length ? "sel" : " ";
        f = (-1 !== a.indexOf('oz')) ? a : a.capitalize();
        e.push('<li><a href="#" data="' + a + '" class="'+c+'">' + f + "</a></li>");
    });
    $(".sub-refine ul").html(e.join(""));
},
  /**
  * This method both verify if filter's opt is off or not and when click in some filter's opt verify all subfilter's list.
  * @param {event} a - click event itself
  * @return Array
  * @memberOf Filter#
  * @name getfilter
  */
  getfilter:function(a){
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
},
  /**
  * This method is called when filter is opened, with it, call getfilter and add class off or not according to result of getfilter's return
  * @param {event} a - click event itself
  * @memberOf Filter#
  * @name getfilter
  */
  checklist:function(a){
    this.callerEvents();
    this.data = a;
    var b, c;
    a = $(".refine .unsel");
    b = this;
    a.each(function() {
      $(this).removeClass("off");
      c = $(this).attr("href").split("#")[1];
      c = b.getfilter(c);
      c.length || $(this).addClass("off");
    });
},
  /**
  * When confirm's method is called,it method call this method to run all select filter's opt and concat to return.
  * @param {Object} a - Each select filter's opt and subfilter.
  * @param {Array} b - Array OBjects list
  * @memberOf Filter#
  * @name reload
  */
  reload:function(a,b){
    debugger;
    var i,b,d=[];
    b = b || this.data;
      if("COMPOSITIONS" !== a.bt) {
        return b.filter(function(b) {
          return b[a.bt] && b[a.bt].toLowerCase() === a.ft;
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
        return d;
      }
  },
   /**
  * This method is called when click ate confirm's button, and it's responsible to increment counter of select's item.
  * @param {Array} a - Each item's list
  * @param {Boolean} b - If is being with cookie or not
  * @memberOf Filter#
  * @name confirm
  */
  confirm:function(arr,cookie){
    debugger;
    var b, c, d, e = this, f, g;
    this.list = this.list.sortBy("id");
    $(".refine li span").text(0).addClass('hide');
    c = this.list.map(function(a, b) {
      $(".refine a[href='#"+a.bt+"']").parent().find("span").removeClass('hide').html(parseInt($(".refine a[href='#"+a.bt+"']").parent().find("span").html())+1);
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
        }), g = d;
        if(!g.length){
          return $(".overview-container").remove(),this.close(),this.content.reset(),this.Componentfilter(g.unique(), 0, !0),!1;
        }
      }
      if(g){
        if(cookie){
          return g.unique();
        }

        $(".overview-container").remove();
        this.content.reset();
        this.Componentfilter(g.unique(), 0, !0);
        this.close();
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
    }
},
 /**
  * Close filter
  * @memberOf Filter#
  * @name close
  */
close:function(){
  $(".refine a").removeClass('sel').addClass('unsel');
  $(".not-autoshow").removeClass('sel');
  $(".sub-refine").addClass('hide').hide().find("ul").empty();
},
  /**
  * Reset filter
  * @memberOf Filter#
  * @name reset
  */
reset:function(){
  this.list = [];
  this.data = null;
},
/**
* Init filter
* @memberOf Filter#
* @name init
*/
init:function() {
  this.list = [];
	this.data = null;
}});