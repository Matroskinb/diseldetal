eSlides = document.getElementsByClassName('slide');
slidesWrap = document.getElementsByClassName('slides_wrap')[0];
var slideW =eSlides[0].offsetWidth + parseInt(getComputedStyle(eSlides[0]).marginRight);
wrapW = eSlides.length*slideW;
coordinate = 0;
document.getElementsByClassName('slides_wrap')[0].style.width = wrapW +'px';
coordinate =-Math.floor(eSlides.length/2)*slideW + slideW;
document.getElementsByClassName('slides_wrap')[0].style.transform = 'translate3d( '+coordinate+'px,0,0)';
document.getElementsByClassName('slides_wrap')[0].style.webkitTransform = 'translate3d( '+coordinate+'px,0,0)';
document.getElementsByClassName('slides_wrap')[0].style.transition = "transform 400ms ease";
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

function doEps(){
	if (document.body.offsetWidth <= 720){
	eps = 2;
	}
	else{
		eps = 3;
	}
}
cart ={
	item: [],
	name:[],
	col: [],
	cost: [],
	i:0
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

$.ajax({
	type:'POST',
	url:'../Catalog/Category.php',
	success: function(response){
		var json=$.parseJSON(response);
		var i=0;
		for (i; i<json[0].length;i++){
			console.log(json[0][i])
			$('.catalog .first-row ul').append('<li><input type="radio" name="first-row" id="category'+i+'"><label for="category'+i+'">'+json[0][i]+'</label></li>');
		}
	}
})

$(document).ready(function(){
	doEps();//задать количество карт в слайдере
	document.getElementById('cart').onclick = function(){
		if (cart.item.length == 0){
			alert('Ваша корзина пуста')
		}
		else{
			for (i=0;i< cart.item.length;i++){
					$('table.cart_items').append('<tr><td class="art">'+cart.item[i]+'</td><td class="name">'+cart.name[i]+'</td><td class="col">Кол-во:<input type="text" value="'+cart.col[i]+'" data-art="'+cart.item[i]+'" disabled></td><td class="cost" data-art="'+cart.item[i]+'">'+Math.floor(cart.cost[i]*cart.col[i])+' р.</td><td><input type="checkbox" id="'+cart.item[i]+'"><label class="confirmed" for="'+cart.item[i]+'"></label></td><td><button class="delete" data-art="'+cart.item[i]+'"></button></td>');
				}
			document.getElementById('cart_modal').style.display = "block";
		};
	}
	$(document).on('click','table .delete',function(){
		var element = $(this).getAttribute('data-art');
		$(this).parent().parent().remove();
		for (i=0;i<cart.name.length;i++){
			if (cart.item[i] == $(this)[0].getAttribute('data-art')){
				cart.item.splice(i,1);
				cart.name.splice(i,1);
				cart.count.splice(i,1);
				cart.col.splice(i,1);
				fullCost();
			}
		}
	})
	$(document).on('click','table td label.confirmed',function(){
		if ($('table label.editing').length == 0){
			$(this).addClass('editing');
			$(this).removeClass('confirmed');
			for (i=0;i<=$('table .col input').length-1;i++){
				if ($('table .col input')[i].getAttribute('data-art') == this.getAttribute('for')){
					$('table .col input')[i].removeAttribute('disabled');
				};
			};
		}
		else{
			alert("уже есть редактируемое поле");
		}
	});
	$(document).on('click','table td label.editing',function(){
		$(this).removeClass('editing');
		$(this).addClass('confirmed');
		for (i=0;i<$('table .col input').length;i++){
			if ($('table .col input')[i].getAttribute('data-art') == this.getAttribute('for')){
				$('table .col input')[i].setAttribute('disabled','');
				cart.col[i] = $('table .col input')[i].value;
				console.log($('table .cost')[i]);
				$('table .cost')[i].innerText = Math.floor(cart.col[i]*cart.cost[i]) + 'р.';
			}
		}
	})

	$('.back-catalog').click(function(){
		document.getElementById('cart_modal').style.display = "none";
	})

	$('.do-offer').click(function(){
		if ($('label.editing').length==0){
			document.getElementById('cart_modal').style.display = "none";
			document.getElementById('do_offer_modal').style.display = "block";
		}
	})

	$('.modal .back').click(function(){
		document.getElementById('cart_modal').style.display = "block";
		document.getElementById('do_offer_modal').style.display = "none";
	})
	$(document).on('click','.add_cart',function(){
		addCart(this.getAttribute('data-art'),this.getAttribute('data-name'),this.getAttribute('data-cost'),this.nextElementSibling.value);
	});

	$(document).on('click','.catalog label',function(){
		var word = $(this).text();
		$.ajax({
			type:'POST',
			url:'../Catalog/Category.php',
			data: {categoryName: word},
			success: function(response){
				var json=$.parseJSON(response);
				console.log(json[0].length)
				if (json[0].length != 0){
					console.log('enter')
					$('.catalog .second-row li').remove();
					for (i=0; i<json[0].length;i++){
						console.log(json[0][i])
						$('.catalog .second-row ul').append('<li><input type="radio" name="second-row" id="pod-category'+i+'"><label for="pod-category'+i+'">'+json[0][i]+'</label></li>');
					}
				}
				else{
					$('.catalog .catalog_wrap li').remove();
				}
				if (document.getElementsByClassName('nav')[0].style.opacity == 0){
					document.getElementsByClassName('nav')[0].style.opacity = "1";
					document.getElementsByClassName('nav')[0].style.marginTop = "0px";
					document.getElementsByClassName('catalog_wrap')[0].style.marginTop = "5px";
				}
				for (i=0;i< json[1].length;i++){
					$('.catalog_wrap ul').append('<li class="clear"><div class="art">'+json[1][i][1]+'</div><div class="name">'+json[1][i][3]+'</div><button class="add_cart right" data-art="'+json[1][i][1]+'"data-name="'+json[1][i][3]+'" data-cost="'+json[1][i][4]+'">В корзину</button><input type="text" class="right" value="1"><div class="col right">Кол-во</div><div class="cost right">'+json[1][i][4]+' Р.</div></li>');
				}
			}

		})
	})
})

function addCart(item,name,cost,col){
	i=cart.i
	cart.item[i] = item;
	cart.name[i] = name;
	cart.cost[i] = cost;
	cart.col[i] = col;
	cart.i=i+1;
	fullCost();
}

function left(){
	coordinate = coordinate + slideW*eps;
	if (coordinate >= slideW*eps){
		move = false;
		coordinate = coordinate - slideW*eps;
	};
	runslide();
}

function right(){
	coordinate = coordinate - slideW*eps;
	if (Math.abs(coordinate) > (wrapW-slideW)){
		move = false;
		coordinate = coordinate + slideW*eps;
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

function fullCost(){
	var sum = 0
	for (i=0;i<cart.name.length;i++){
	sum = sum + cart.col[i]*cart.cost[i];
	}
	$('.modal .result .cost')[0].innerText = Math.floor(sum) + ' руб';
}