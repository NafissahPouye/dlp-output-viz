function generatingComponent(vardata){
var reqs = dc.rowChart('#rd') ;
var use = dc.rowChart('#pp') ;
var dataTab1 = dc.dataTable('#dataTable1');
//  var orgs = dc.rowChart('#org') ;
//var Rstate = dc.pieChart ('#State') ;
var Rstatus = dc.rowChart ('#org') ;
  //var Rtype = dc.pieChart ('#type') ;
 var colors = ['#FAE61E','#03a9f4','#E67800','#C80000','#E6E6FA', '#023858', '#a6bddb','#3690c0'] ;

var cf = crossfilter(vardata);
var all = cf.groupAll();
var colors = ['#2C5197','#0B0B61'];
    
var statusDim = cf.dimension(function(d) {return d.likelihood});
var statusGroup = statusDim.group();
//var RtypeDim = cf.dimension(function(d) { return d.contact});
//var RtypeGroup = RtypeDim.group();
//var statusDim = cf.dimension(function(d) {return d.feedback});
var reqDim = cf.dimension(function(d) {return d.infoType});
var reqGroup = reqDim.group();

var useDim = cf.dimension(function(d) {return d.quote});
var useGroup = useDim.group();

/*var orgDim = cf.dimension(function(d) {return d.organisation});
var orgGroup = orgDim.group();
*/
//dataTab1
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
//pie charts
   
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
    
//Rstatus.ordinalColors(['#C0D7EB','#007CE1']);
    
use.width(400).height(400)
        .dimension(useDim)
        .group(reqGroup)
        .data(function(group) {
                return group.top(4);
            }); 
   // Rtype.ordinalColors(['#C0D7EB','#007CE1', '#E6E7E8']);
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
    

// the option text can be set via the title() function
// by default the option text is '`key`: `value`'
         
  /* orgs.width(500)
     .height(500)
            .dimension(orgDim)
            .group(orgGroup)
            .elasticX(true)
            .data(function(group) {
                return group.top(20);
            })
            .colors('#FF8C00')
            .colorAccessor(function(d, i){return 0;})
            .gap(5);         
                */

  dc.dataCount('count-info')

    .dimension(cf)

    .group(all);

  
  dc.renderAll();
     

}

var dataCall = $.ajax({

    type: 'GET',

    url: 'data/data1.json',

    dataType: 'json',

});

var geomCall = $.ajax({

    type: 'GET',

    url: 'data/cmr.geojson',

    dataType: 'json',

});

$.when(dataCall, geomCall).then(function(dataArgs, geomArgs){

    var geom = geomArgs[0];

    geom.features.forEach(function(e){

        e.properties['NAME'] = String(e.properties['NAME']);

    });

    generatingComponent(dataArgs[0],geom);

});
