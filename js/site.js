function generatingCharts(vardata){
var infotype = dc.rowChart('#InfoType') ;
var quote = dc.rowChart('#Quote') ;
var dataTab = dc.dataTable('#dataTable');
var likelihood = dc.rowChart ('#Likelihood') ;
var numberDisplayQuote = dc.numberDisplay("#number-display-quote"); 
var numberDisplayInfotype = dc.numberDisplay("#number-display-infotype"); 
var colors = ['#FAE61E','#03a9f4','#E67800','#C80000','#E6E6FA', '#023858', '#a6bddb','#3690c0'] ;

var cf = crossfilter(vardata);
var all = cf.groupAll();
var colors = ['#2C5197','#0B0B61'];
    
var likelihoodDimension = cf.dimension(function(d) {return d.likelihood});
var likelihoodGroup = likelihoodDimension.group();

var infotypeDimension = cf.dimension(function(d) {return d.infoType});
var infoTypeGroup = infotypeDimension.group();

var quoteDimension = cf.dimension(function(d) {return d.quote});
var quoteGroup = quoteDimension.group();

var quoteDimensionUnique = quoteDimension.group().reduceCount();

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
             .data(function(group) {
                return group.top(20);
            })
            .colors('#3690c0')
            .colorAccessor(function(d, i){return 0;})
            .gap(5);
    

    

// rowCharts
  infotype.width(500).height(500)
            .dimension(infotypeDimension)
            .group(infoTypeGroup)
             .elasticX(true)
             .data(function(group) {
                return group.top(50);
            })
            .colors('#3690c0')
            .colorAccessor(function(d, i){return 0;})
            .gap(5);
    
  quote.width(500)
     .height(500)
            .dimension(quoteDimension)
            .group(quoteGroup)
            .elasticX(true)
            .data(function(group) {
                return group.top(5);
            })
            .colors('#3690c0')
            .colorAccessor(function(d, i){return 0;});
    
// Number Display
   
numberDisplayQuote
   .group(quoteDimensionUnique);
    
numberDisplayInfotype
   .group(infoTypeGroup);

 dc.dataCount('number-display-infotype')

    .dimension(quoteDimensionUnique)

    .group(quoteGroup);

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