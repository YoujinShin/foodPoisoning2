var width = $(window).width(),
    height = 570,
    padding = 3, // separation between nodes
    maxRadius = 12;

var tooltip = d3.select("body")
  .append("div")
  .attr("id", "tooltip");

var svg = d3.select("#viz").append("svg")
    .attr("width", width)
    .attr("height", height);

// Load Data
queue()
    .defer(d3.csv, 'foodType.csv')
    .defer(d3.csv, 'foodFactor.csv')
    .await(makeViz);

// Make Visualization
function makeViz(error, foodType, foodFactor) {

  var x = d3.scale.linear()
    .domain([0,8])
    .range([100, width - 180]);

  num = foodType.length;

  nodes = d3.range(num).map(function(j) {
    // var i = codeArray[j];
    // // var i = getCuisine( foodType[j] );

    var i = getX( foodType[j].Cuisine );
    var c = getColor( foodType[j].Cuisine );
    var v = foodType[j].Value * 1.4;

    return {
      cuisine: foodType[j].Cuisine,
      type: foodType[j].Type,
      value: foodType[j].Value,
      radius: v,
      color: c,
      cx: x(i),
      cy: height / 2
    };
  });

  force = d3.layout.force()
      .nodes(nodes)
      .size([width, height])
      .gravity(0)
      .charge(0)
      .on("tick", tick)
      .start();

  circle = svg.selectAll("circle")
      .data(nodes)
    .enter().append("circle")
      .attr("r", function(d) { return d.radius; })
      .style("fill", function(d) { return d.color; })
      .on("mouseover", function(d) {
        // console.log(d);
        tooltip.text(d.cuisine);
        tooltip.style("visibility", "visible");
      })
      .on("mousemove", function() {

        tooltip.style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 12) + "px");
      })
      .on("mouseout", function() {

        tooltip.style("visibility", "hidden");
      })
      .call(force.drag);
}

function tick(e) {
  circle
      .each(gravity(.2 * e.alpha)) //0.2
      .each(collide(.3))//0.5
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}

// Move nodes toward cluster focus.
function gravity(alpha) {
  return function(d) {
    d.y += (d.cy - d.y) * alpha;
    d.x += (d.cx - d.x) * alpha;
  };
}

// Resolve collisions between nodes.
function collide(alpha) {

  var quadtree = d3.geom.quadtree(nodes);
  return function(d) {
    var r = d.radius + maxRadius + padding,
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}

// 
function getX(cuisine) {

  if(cuisine == 'American') { return 0; }
  else if(cuisine == 'British') { return 1; }
  else if(cuisine == 'Chinese') { return 2; }
  else if(cuisine == 'Continental/ European') { return 3; }
  else if(cuisine == 'Indian') { return 4; }
  else if(cuisine == 'Italian') { return 5; }
  else if(cuisine == 'Sandwich bar') { return 6; }
  else if(cuisine == 'Seafood') { return 7; }
  else if(cuisine == 'Other') { return 8; }
}

function getColor(cuisine) {
  
  if(cuisine == 'American') { return '#72f4ac'; }
  else if(cuisine == 'British') { return '#76f024'; }
  else if(cuisine == 'Chinese') { return '#2b52a0'; }
  else if(cuisine == 'Continental/ European') { return '#4ac0f3'; }
  else if(cuisine == 'Indian') { return '#fcf733'; }
  else if(cuisine == 'Italian') { return '#f28330'; }
  else if(cuisine == 'Sandwich bar') { return '#ed462f'; }
  else if(cuisine == 'Seafood') { return '#60e4fc'; }
  else if(cuisine == 'Other') { return '#f8b732'; }
}



