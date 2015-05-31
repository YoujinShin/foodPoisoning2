var width = $(window).width(),
    height = $(window).height()*0.82,
    padding = 3, // separation between nodes
    maxRadius = 12;

var text_cuisine = ["American", "British", "Chinese",
          "Continental/ European", "Indian", "Italian",
          "Sandwich bar", "Seafood", "Other"];

var text_foodtype = [
          "","","","","","","","","",
          "Red meat", "Poultry meat", "Finfish", "Crustacean and shellfish", 
          "Eggs and egg dishes","Raw egg shell used in uncooked",
          "Milk and dairy products","Rice","Vegetables and fruit",
          "Desserts, cakes and confectionary","Condiments and snacks",
          "Mixed foods","Other foods"];

// var text_foodtype = ["Red meat", "Poultry meat", "Finfish", "Crustacean and shellfish"];


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

var x = d3.scale.linear()
  .domain([0,8])
  .range([120, width - 120]);

var x2 = d3.scale.linear()
  .domain([0,6])
  .range([120, width - 120]);

var y2 = d3.scale.linear()
  .domain([0,1])
  // .range([170, height-170]);
  .range([height*0.28, height*0.65]);


// Make Visualization
function makeViz(error, foodType, foodFactor) {

  num = foodType.length;

  nodes = d3.range(num).map(function(j) {

    var x_value = x( getX( foodType[j].Cuisine ) );
    // var x_value = x2( getX2( foodType[j] ) );
    var c = getColor( foodType[j].Cuisine );
    var v = foodType[j].Value * 1.2;

    return {
      cuisine: foodType[j].Cuisine,
      type: foodType[j].Type,
      value: foodType[j].Value,
      radius: v,
      color: c,
      cx: x_value,
      cy: height*0.55
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
        tooltip.text(d.cuisine +" with "+d.type);
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

  // Guide
  makeGuide_cuisine();
  makeGuide_foodtype();
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

function getX2(type) {

  if(type == 'Red meat') { return 0; }
  else if(type == 'Poultry meat') { return 1; }
  else if(type == 'Finfish') { return 2; }
  else if(type == 'Crustacean and shellfish') { return 3; }
  else if(type == 'Eggs and egg dishes') { return 4; }
  else if(type == 'Raw egg shell used in uncooked') { return 5; }

  else if(type == 'Milk and dairy products') { return 0; }
  else if(type == 'Rice') { return 1; }
  else if(type == 'Vegetables and fruit') { return 2; }
  else if(type == 'Desserts, cakes and confectionary') { return 3; }
  else if(type == 'Condiments and snacks') { return 4; }
  else if(type == 'Mixed foods') { return 5; }
  else if(type == 'Other foods') { return 6; }
}

function getY2(type) {

  if(type == 'Red meat') { return 0; }
  else if(type == 'Poultry meat') { return 0; }
  else if(type == 'Finfish') { return 0; }
  else if(type == 'Crustacean and shellfish') { return 0; }
  else if(type == 'Eggs and egg dishes') { return 0; }
  else if(type == 'Raw egg shell used in uncooked') { return 0; }

  else if(type == 'Milk and dairy products') { return 1; }
  else if(type == 'Rice') { return 1; }
  else if(type == 'Vegetables and fruit') { return 1; }
  else if(type == 'Desserts, cakes and confectionary') { return 1; }
  else if(type == 'Condiments and snacks') { return 1; }
  else if(type == 'Mixed foods') { return 1; }
  else if(type == 'Other foods') { return 1; }
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

function makeGuide_cuisine() {

  guide_cuisine = svg.selectAll("text")
      .data(text_cuisine)
    .enter().append("text")
      .attr("class", "guide_cuisine")
      .text(function(d) { return d; })
      .attr("text-anchor", "middle")
      .attr("x", function(d) { return  x( getX(d) ); })
      .attr("y", function(d) { return height*0.2; });

  line_cuisine = svg.selectAll("line")
      .data(text_cuisine)
    .enter().append("line")
      .attr("class", "line")
      .attr("stroke", "rgba(255,255,255,0.32)")
      .style("stroke-dasharray", ("1, 3")) 
      .attr("x1", function(d) { return  x( getX(d) ); })
      .attr("y1", function(d) { return height*0.23; })
      .attr("x2", function(d) { return  x( getX(d) ); })
      .attr("y2", function(d) { return height*0.5; });
}

function makeGuide_foodtype() {

  guide_foodtype = svg.selectAll("text")
      .data(text_foodtype)
    .enter().append("text")
      .attr("class", "guide_foodtype")
      .text(function(d, i) { 
        // console.log(i);
        return d; 
      })
      .attr("text-anchor", "middle")
      .attr("x", function(d) { return x2(getX2(d)); })
      .attr("y", function(d) { return y2(getY2(d)) - 35; });

  // line_foodtype = svg.selectAll("line")
  //     .data(text_cuisine)
  //   .enter().append("line")
  //     .attr("class", "line")
  //     .attr("stroke", "rgba(255,255,255,0.35)")
  //     .style("stroke-dasharray", ("1, 3")) 
  //     .attr("x1", function(d) { return  x( getX(d) ); })
  //     .attr("y1", function(d) { return height*0.23; })
  //     .attr("x2", function(d) { return  x( getX(d) ); })
  //     .attr("y2", function(d) { return height*0.5; });
}


