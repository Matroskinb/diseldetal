eSlides = document.getElementsByClassName('slide');
slidesWrap = document.getElementsByClassName('slides_wrap')[0];
var slideW =eSlides[0].offsetWidth + parseInt(getComputedStyle(eSlides[0]).marginRight);
wrapW = eSlides.length*slideW;
coordinate = 0;
document.getElementsByClassName('slides_wrap')[0].style.width = wrapW +'px';
coordinate =-Math.floor(eSlides.length/2)*slideW + slideW;
document.getElementsByClassName('slides_wrap')[0].style.transform = 'translate3d( '+coordinate+'px,0,0)';
document.getElementsByClassName('slides_wrap')[0].style.webkitTransform = 'translate3d( '+coordinate+'px,0,0)';
document.getElementsByClassName('slides_wrap')[0].style.transition = "transform 300ms ease";
document.getElementsByClassName('slides_wrap')[0].style.transition = "-webkit-transform 300ms ease";
document.getElementById('slider').onclick = function(event){
	event = event || window.event;
	target = event.target || event.srcElement;
	move = true;
	if (event.target.hasAttribute('dataDirection') == true){
		var direction = event.target.getAttribute('dataDirection');
		if (direction == 'left'){
			left();
		};
		if (direction == 'right'){
			right();
		};
	};
};

function left(){
	coordinate = coordinate + slideW*3;
	if (coordinate >= slideW*3){
		move = false;
		coordinate = coordinate - slideW*3;
	};
	runslide();
}

function right(){
	coordinate = coordinate - slideW*3;
	if (Math.abs(coordinate) > (wrapW-slideW)){
		move = false;
		coordinate = coordinate + slideW*3;
	};
	runslide();
}

function runslide(){
	if (move = true){
		slidesWrap.style.webkitTransform ='translate3d( '+coordinate+'px,0,0)';
		slidesWrap.style.transform = 'translate3d(' + coordinate + 'px,0,' + coordinate + 'px)';
	}
	else{
		console.log('need animation of error');
	};
}

document.onkeydown = function(event){
	event = event || window.event;
	if (event.keyCode == 37){
		left();
	};

	if (event.keyCode == 39){
		right();
	}
}

$('.catalog label').click(function(){
	var word = $(this).text();
	$.ajax({
		type:'POST',
		url:'catalog_category.php',
		data: 'categoryName: word',
		success: function(){
			
		}
	})
})