function generatingCharts(vardata){
var infotype = dc.rowChart('#InfoType') ;
var quote = dc.rowChart('#Quote') ;
var dataTab = dc.dataTable('#dataTable');
var likelihood = dc.rowChart ('#Likelihood') ;
var numberDisplayQuote = dc.numberDisplay("#number-display-quote"); 
var numberDisplayInfotype = dc.numberDisplay("#number-display-infotype"); 


var cf = crossfilter(vardata);
var all = cf.groupAll();
var colors = ['#2C5197','#0B0B61'];
    
var likelihoodDimension = cf.dimension(function(d) {return d.likelihood});
var likelihoodGroup = likelihoodDimension.group().reduceCount();

var infotypeDimension = cf.dimension(function(d) {return d.infoType});
var infoTypeGroup = infotypeDimension.group();

var quoteDimension = cf.dimension(function(d) {return d.quote});
var quoteGroup = quoteDimension.group();
//var quoteGoupTab =  quoteDimension.group().reduceSum(function (d) [return d.quote]) 
// display uniques quotes
var quoteGroupU = quoteDimension.groupAll().reduce(
  function (p, v) { //add
    if(p[v.quote]) {
      p[v.quote]++;
    } else {
      p[v.quote] = 1;
    }
    return p;
  },
  function (p, v) { //remove
    p[v.quote]--;
    if(p[v.quote] === 0) {
      delete p[v.quote];
    }
    return p;
  },
  function () { //init
    //initial p 
    return {};
  }
);

// display unique infotype
var infotypeGroupU = infotypeDimension.groupAll().reduce(
  function (p, v) { //add
    if(p[v.infoType]) {
      p[v.infoType]++;
    } else {
      p[v.infoType] = 1;
    }
    return p;
  },
  function (p, v) { //remove
    p[v.infoType]--;
    if(p[v.infoType] === 0) {
      delete p[v.infoType];
    }
    return p;
  },
  function () { //init
    //initial p
    return {};
  }
);   
    

     dataTab
        .size(600)
        .dimension(quoteDimension)
        .group(function (d) {
            return d.quoteGroup;
        })
        .columns([
                    function (d) {
                return d.infoType;
                },
                           
                function (d) {
                return d.quote;
                }
])


likelihood.width(500).height(500)
        .dimension(likelihoodDimension)
        .group(likelihoodGroup)
        
        .elasticX(true)
        .x(d3.scale.linear())
         .gap(5)
             /*.data(function(group) {
                return group.top(10);
            })*/
            .colors('#007CE0')
            //.colorAccessor(function(d, i){return 0;}) 
            .ordering(function(d){ return -d.value; });

// rowCharts
  infotype.width(500).height(500)
            .dimension(infotypeDimension)
            .group(infoTypeGroup)
         .elasticX(true)
            /* .data(function(group) {
                return group.top(50);
            })*/
            .colors('#007CE0')
            
            .ordering(function(d){ return d.value; });
    
  
  quote.width(500)
     .height(500)
            .dimension(quoteDimension)
            .group(quoteGroup)
            .elasticX(true)
            .data(function(group) {
                return group.top(10);
            })
            .colors('#007CE0')
            
            .ordering(function(d){ return d.value; });
    
// Number Display


numberDisplayQuote
   .group(quoteGroupU)
   .valueAccessor(
    function (d) { return Object.keys(d).length; }
  );
   
numberDisplayInfotype
   .group(infotypeGroupU)
   .valueAccessor(
    function (d) { return Object.keys(d).length; }
  );



  dc.renderAll();
     

}

var dataCall = $.ajax({

    type: 'GET',

    url: 'data/data.json',

    dataType: 'json',

});



$.when(dataCall).then(function(dataArgs){

       generatingCharts(dataArgs);

});