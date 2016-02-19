# DTLine
HTML5 canvas based timeline, built using Moment JS and Fabric JS

This is a usable, but preliminary version.  v 0.10

Features: 
   One global variable handles multiple canvases.
   Relies on Moment for date and time formatting.
   Can Draw an axis, with various available scaling options.
   Can Draw timecells, with your choice of color.
   Can set scaling, unit parameters, and label spacing.
   Click on canvas creates a scrolling callback (regen) event.
   Has callbacks for mouseover.
   
Drawbacks:
   Coupling options with html controls requires clear and redraw, although fast.
   TODO: handling fabric selections and changes.
   
Here is an [example] (https://jsfiddle.net/compmeist/p5ntd6zj/).
