$('.cuisine').click(function() {

	// console.log('cuisine clicked');

	$('.cuisine').css('border-color', 'rgba(72,194,244,1)');
	$('.foodtype').css('border-color', 'rgba(255,255,255,0.5)');
	$('.factor').css('border-color', 'rgba(255,255,255,0.5)');

	// text
	$('.guide_cuisine').css('visibility', 'visible');
	$('.line').css('visibility', 'visible');
	$('.guide_foodtype').css('visibility', 'hidden');

	svg.selectAll("circle").each(function(e) {

		 e.cx = x( getX(e.cuisine) );
		 e.cy = height*0.55;
	});

	force.resume();
});

$('.foodtype').click(function() {

	// console.log('foodType clicked');

	$('.cuisine').css('border-color', 'rgba(255,255,255,0.5)');
	$('.foodtype').css('border-color', 'rgba(72,194,244,1)');
	$('.factor').css('border-color', 'rgba(255,255,255,0.5)');

	// text
	$('.guide_cuisine').css('visibility', 'hidden');
	$('.line').css('visibility', 'hidden');
	$('.guide_foodtype').css('visibility', 'visible');

	svg.selectAll("circle").each(function(e) {

		e.cx = x2( getX2(e.type) );
		e.cy = y2( getY2(e.type) );
	});

	force.resume();
});

// $('.factor').click(function() {

// 	$('.cuisine').css('border-color', 'rgba(255,255,255,0.5)');
// 	$('.foodtype').css('border-color', 'rgba(255,255,255,0.5)');
// 	$('.factor').css('border-color', 'rgba(72,194,244,1)');
// });

