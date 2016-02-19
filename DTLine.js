/* 
     dtLine.js: 
       HTML5 canvas rendered  
         horizontal timeline Graph
      requires: moment.js for datetimes, 
      fabric.js for canvas render

      Note:  all moment values 
            should be passed utc, 
            using  moment.utc()
*/

/* 
   Sample usage:
     <canvas id= ...

    function MyRegenCallback(cvName) {
      MyClearAndAddTimeCells();
    }
    DTLine_Init(mycanvasId,MyRegenCallback); 
    DTLine_SetOption(mycanvasId,'unitsPerGraph',36);
    DTLine_ClearAndInitAxis(mycanvasId)
    var fabricAttrs = {fill:'lightblue', opacity: 0.7,rx:2,ry:2};
    DTLine_DrawTimeCell(mycanvasId,
       myStartMoment,
       myEndMoment,
       fabricAttrs);




*/

var dtLineOptions = new Object();

function DTLine_Init(cvName,regenCallback,mouseOverCallback,mouseOutCallback) 
{ // cvName = id of <canvas> element
  dtLineOptions[cvName] = 
      { fabricCanvas : new fabric.Canvas(cvName),
        unitsPerGraph : 36, //   36 units (hours)
        pixelsPerGraph : 600,
        GraphPxOffset : 0,
        ticksPerUnit: 1,
        labelsPerUnit: 4,
        units:'hours',
        unitsFormat:'hh:mm A', // 02:30 PM
        unitsMsMultiplier:(60 * 60 * 1000), // an hour in milliseconds
        labelsPerSuperunit: 24,
        superunits:'days',
        superunitsFormat:'dddd, MMMM Do YYYY', 
        superunitsMsMultiplier:(24 * 60 * 60 * 1000), // a day
        startMoment : moment.utc(),
        ticky0 : 30,
        ticky1 : 40,
        unitsLabelY : 50,
        superunitsLabelY: 65,
        timeCelly0 : 0,
        timeCellHeight : 25
      };
  var o = dtLineOptions[cvName];
  // closure to handle mousedown event for pseudo-scrolling  
  function mdFunc(opts) {
    if (opts.e.clientX > (o.fabricCanvas.getWidth()/2))
        o.startMoment.add((o.labelsPerUnit),o.units);
      else
        o.startMoment.add((o.labelsPerUnit*-1),o.units);
      if (regenCallback) regenCallback(cvName);
  };
  o.fabricCanvas.off();  // turn off all other events (for now ... TODO)
  o.fabricCanvas.on('mouse:down', function(opts) {
    mdFunc(opts); 
    //alert('here');
  });
  if (mouseOverCallback)
    o.fabricCanvas.on('mouse:over', function(e) {
    if (mouseOverCallback) mouseOverCallback(e); 
    //alert('here');
  });
  if (mouseOutCallback)
    o.fabricCanvas.on('mouse:out', function(e) {
    if (mouseOutCallback) mouseOutCallback(e); 
    //alert('here');
  });

  // other event callbacks - TODO
    
  return 0;
}

function DTLine_SetOption(cvName,optName,optVal)
{ var iReturn = 1; // default error return
  if (typeof optName != 'string') return iReturn;
  var o = dtLineOptions[cvName];
  if (o) {
  iReturn = 0; // no error
  switch (optName) {
    //  may want to do some other validation 
    case 'fabricCanvas': if (typeof optVal == 'object')
      o.fabricCanvas = optVal;
    break;
    case 'unitsPerGraph'://alert(JSON.stringify(o));
      if (typeof optVal == 'number')
      o.unitsPerGraph = optVal;
    break;
    case 'pixelsPerGraph': if (typeof optVal == 'number')
      o.pixelsPerGraph = optVal;
    break;
    case 'GraphPxOffset': if (typeof optVal == 'number')
      o.GraphPxOffset = optVal;
    break;
    case 'ticksPerUnit': if (typeof optVal == 'number')
      o.ticksPerUnit = optVal;
    break;
    case 'labelsPerUnit': if (typeof optVal == 'number')
      o.labelsPerUnit = optVal;
    break;
    case 'units': if (typeof optVal == 'string')
      o.units = optVal;
    break;
    case 'unitsFormat': if (typeof optVal == 'string')
      o.unitsFormat = optVal;
    break;
    case 'unitsMsMultiplier': if (typeof optVal == 'number')
      o.unitsMsMultiplier = optVal;
    break;
    case 'labelsPerSuperunit': if (typeof optVal == 'number')
      o.labelsPerSuperunit = optVal;
    break;

    case 'superunits': if (typeof optVal == 'string')
      o.superunits = optVal;
    break;
    case 'superunitsFormat': if (typeof optVal == 'string')
      o.superunitsFormat = optVal;
    break;
    case 'superunitsMsMultiplier': if (typeof optVal == 'number')
      o.superunitsMsMultiplier = optVal;
    break;
    case 'startMoment': if (moment.isMoment(optVal))
        o.startMoment = optVal;
    break;
    case 'ticky0': if (typeof optVal == 'number')
      o.ticky0 = optVal;
    break;
    case 'ticky1': if (typeof optVal == 'number')
      o.ticky1 = optVal;
    break;
    case 'unitsLabelY': if (typeof optVal == 'number')
      o.unitsLabelY = optVal;
    break;
    case 'superunitsLabelY': if (typeof optVal == 'number')
      o.superunitsLabelY = optVal;
    break;
    case 'timeCelly0': if (typeof optVal == 'number')
      o.timeCelly0 = optVal;
    break;
    case 'timeCellHeight': if (typeof optVal == 'number')
      o.timeCellHeight = optVal;
    break;

    default:
      iReturn = 1;
  }}
  return iReturn;
}

function DTLine_GetOption(cvName,optName) {
  var v = null; var o = dtLineOptions[cvName];
  if (o && (typeof optName == 'string'))  v = o[optName]; 
  return v;
}





function DTLine_AddToStartMoment(cvName,numUnits) {
  var iReturn = 1;
  if (typeof numUnits == 'number') {
    var o = dtLineOptions[cvName];
    if (o) { o.startMoment.add(numUnits,o.units);
      iReturn = 0;
    }
  }
  return iReturn;
}  

  function DTLine_ClearCanvas(cvName) {  var o = dtLineOptions[cvName]; 
    if (o) {
    var c = o.fabricCanvas;
    if (c != null) c.clear();
    return 0;
    } //end,if (o)
    else {return 1;}
  }


  function DTLine_DrawAxis(cvName) { var o = dtLineOptions[cvName]; 
    if (o) {
    var c = o.fabricCanvas;
    if (c != null) { 
      // get canvas size in pixels
      // var wth = c.getWidth();
      var u = o.units;
      var umm = o.unitsMsMultiplier;
      var pixPerUnit = o.pixelsPerGraph / o.unitsPerGraph;
      var pixOnCV = 0;
      var y0 = o.ticky0;
      var y1 = o.ticky1;
      var y2 = o.unitsLabelY;
      var y3 = o.superunitsLabelY;

      var aPath; var aText; var theText;
       var aMoment = moment.utc(o.startMoment);
      var singleUnit = moment.normalizeUnits(o.units);
      aMoment.startOf(singleUnit); // now, this is time0
      // traverse the timeline by units
      var im; var iu;
      for ( im=0, iu=0;
           iu<=o.unitsPerGraph;
           im+=umm,iu++,aMoment.add(1,o.units))
      { xOnCV = iu * pixPerUnit + o.GraphPxOffset;
        if ((iu % o.ticksPerUnit) == 0)  // draw tick
        { if ((iu % o.labelsPerUnit) == 0) 
            y1b = y1 + Math.abs(y1-y0)/2; // longer for label locations
          else
            y1b = y1;  
          aPath = new fabric.Line(
             [xOnCV,y0,xOnCV,y1b],
             {stroke:'black',selectable:false});
           c.add(aPath);
        }
        if ((iu % o.labelsPerUnit) == 0) // draw label
        { theText = aMoment.format(o.unitsFormat);
          aText = new fabric.Text(theText,
             { fontFamily:'helvetica',fontSize:10,
                angle:0,
                left:(xOnCV),
                top:y2,
                selectable:false,
                originX:'center'
              }
            );
           c.add(aText);
        }
        if ((iu % o.labelsPerSuperunit) == 0) // draw label
        { theText = aMoment.format(o.superunitsFormat);
          aText = new fabric.Text(theText
             ,{ fontFamily:'helvetica',fontSize:10,
                angle:0,
                left:xOnCV,
                top:y3,
                selectable:false,
                originX:'center'
              }
            );
           c.add(aText);
        }
         
      } // end, for
     }
    return 0;
    } //end,if (o)
    else {return 1;}
    
  }

  function DTLine_ClearAndInitAxis(cvName) {
    DTLine_ClearCanvas(cvName);
    DTLine_DrawAxis(cvName);
    return 0;
  }
   

  function DTLine_DrawTimeCell(cvName,startMoment,endMoment,fabricAttrs) 
  {   // fabric Attrs should be an object, such as {fill:'blue'}
    var o = dtLineOptions[cvName]; 
    if (o) {
    var c = o.fabricCanvas;
    if (c != null) { 
      var u = o.units;
      var umm = o.unitsMsMultiplier;
      var pixPerUnit = o.pixelsPerGraph / o.unitsPerGraph;
      var pixOnCV = 0;
      var y0 = o.ticky0;
      var y1 = o.ticky1;
      var y2 = o.unitsLabelY;
      var y3 = o.superunitsLabelY;

      var aPath; var aText; var theText;
       var aMoment = moment.utc(o.startMoment);
      var singleUnit = moment.normalizeUnits(o.units);
      aMoment.startOf(singleUnit); // now, this is time0
  
      var obj1 = {};
      obj1["height"] = o.timeCellHeight;
      obj1["top"] = o.timeCelly0;
      obj1["selectable"] = false; // if true, bind to callbacks TODO
      var attrname;
      if (typeof fabricAttrs == 'object')
        for (attrname in fabricAttrs) // append the extra attributes, such as 'fill'
          { obj1[attrname] = fabricAttrs[attrname]; }
      else if (typeof fabricAttrs == 'string') 
         { obj1["fill"] = fabricAttrs; /* assume this string is fillColor */
         }
      // ok, now add the start and end fabric parameters to rectangle
      var sU = startMoment.diff(aMoment,u,true);    // from time0
      var wU = endMoment.diff(startMoment,u,true);  // the duration
      obj1["width"] = Math.round(Math.abs(wU * pixPerUnit));  
      obj1["left"] = Math.round(sU * pixPerUnit)  + o.GraphPxOffset;
      // draw the timecell
      aRect= new fabric.Rect(obj1);
      c.add(aRect);
     }
    return 0;
    } //end,if (o)
    else {return 1;}
    
  }

