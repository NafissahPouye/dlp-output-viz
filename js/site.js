function generatingComponent(vardata){
var reqs = dc.rowChart('#rd') ;
var use = dc.rowChart('#pp') ;
var dataTab1 = dc.dataTable('#dataTable1');
var Rstatus = dc.rowChart ('#org') ;
 
var colors = ['#FAE61E','#03a9f4','#E67800','#C80000','#E6E6FA', '#023858', '#a6bddb','#3690c0'] ;

var cf = crossfilter(vardata);
var all = cf.groupAll();
var colors = ['#2C5197','#0B0B61'];
    
var statusDim = cf.dimension(function(d) {return d.likelihood});
var statusGroup = statusDim.group();

var reqDim = cf.dimension(function(d) {return d.infoType});
var reqGroup = reqDim.group();

var useDim = cf.dimension(function(d) {return d.quote});
var useGroup = useDim.group();


     dataTab1
        .size(600)
        .dimension(statusDim)
        .group(function (d) {
            return d.statusGroup;
        })
        .columns([
                    function (d) {
                return d.infoType;
                },
                    function (d) {
                return d.likelihood;
                },
                 
                             
                function (d) {
                return d.quote;
                }
])

   
Rstatus.width(400).height(400)
        .dimension(statusDim)
        .group(statusGroup)
        .elasticX(true)
             .data(function(group) {
                return group.top(25);
            })
            .colors('#3690c0')
            .colorAccessor(function(d, i){return 0;})
            .gap(5);
    

    
use.width(400).height(400)
        .dimension(useDim)
        .group(reqGroup)
        .data(function(group) {
                return group.top(4);
            }); 
   
// rowCharts
  reqs.width(500).height(500)
            .dimension(reqDim)
            .group(reqGroup)
             .elasticX(true)
             .data(function(group) {
                return group.top(25);
            })
            .colors('#3690c0')
            .colorAccessor(function(d, i){return 0;})
            .gap(5);
    
  use.width(500)
     .height(500)
            .dimension(reqDim)
            .group(useGroup)
            .elasticX(true)
            .data(function(group) {
                return group.top(3);
            })
            .colors('#3690c0')
            .colorAccessor(function(d, i){return 0;});
    



  dc.dataCount('count-info')

    .dimension(cf)

    .group(all);

  
  dc.renderAll();
     

}

var dataCall = $.ajax({

    type: 'GET',

    url: 'data/data.json',

    dataType: 'json',

});



$.when(dataCall).then(function(dataArgs){

       generatingComponent(dataArgs);

});