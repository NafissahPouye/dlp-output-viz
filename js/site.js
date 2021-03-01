var dlpOutputData;
var infotype = dc.rowChart('#InfoType') ;
var quote = dc.rowChart('#Quote') ;
var dataTab = dc.dataTable('#dataTable');
var likelihood = dc.rowChart ('#Likelihood') ;
var numberDisplayQuote = dc.numberDisplay("#number-display-quote"); 
var numberDisplayInfotype = dc.numberDisplay("#number-display-infotype"); 


function generatingCharts(dataID){

  var cf = crossfilter(dlpOutputData[dataID]);
  var all = cf.groupAll();
  var colors = ['#2C5197','#0B0B61'];
  var blueColor = '#007CE0';
      
  var likelihoodDimension = cf.dimension(function(d) {return d.likelihood});
  var likelihoodGroup = likelihoodDimension.group().reduceCount();

  var infotypeDimension = cf.dimension(function(d) {return d.infoType});
  var infoTypeGroup = infotypeDimension.group();

  var quoteDimension = cf.dimension(function(d) {return d.quote});
  var quoteGroup = quoteDimension.group();


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
    .columns(
      [function (d) {
        return d.infoType;
      },
      function (d) {
        return d.quote;
      }
  ]);

  var chartHeight = 350;

  likelihood.width($('#Likelihood').width()).height(chartHeight)
          .dimension(likelihoodDimension)
          .group(likelihoodGroup)
          .elasticX(true)
          .x(d3.scale.linear())
          .gap(5)
          .colors(blueColor)
          .ordering(function(d){ return -d.value; })
          .xAxis().ticks(5);

  // rowCharts
  infotype.width($('#InfoType').width()).height(chartHeight)
              .dimension(infotypeDimension)
              .group(infoTypeGroup)
              .elasticX(true)
              .colors(blueColor)
              .ordering(function(d){ return d.value; })
              .xAxis().ticks(5);
      
    
  quote.width($('#Quote').width())
      .height(chartHeight)
              .dimension(quoteDimension)
              .group(quoteGroup)
              .elasticX(true)
              .data(function(group) {
                  return group.top(10);
              })
              .colors(blueColor)
              .ordering(function(d){ return d.value; })
              .xAxis().ticks(5);
      
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

var searchParams = new URLSearchParams(window.location.search);
let dataUrlParam = searchParams.get('dataUrl');

var dataCall = $.ajax({

    type: 'GET',
    url: dataUrlParam,
    dataType: 'json',

});


$.when(dataCall).then(function(dataArgs){
  dlpOutputData = dataArgs;
  var selectOptions = '';
  for (let i = 0; i < dlpOutputData.length; i++) {
    selectOptions += '<option value="' +i+ '"> Sheet '+i+'</option>';
  }
  $('#select').append(selectOptions);
  generatingCharts(0);
});

$('#select').on('change', function(){
  var val = Number($('#select').val());
  // d3.selectAll("svg").remove();
  generatingCharts(val);
});