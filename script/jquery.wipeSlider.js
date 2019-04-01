/*//////////////////////////////////////////
Author : Kackie(https://github.com/Kackie)
created: 2019/02/23
//////////////////////////////////////////*/
;(function($){
    $.fn.wipeSlider = function(options){
		$.fn.wipeSlider.defaults = {
			transition : 500,
			auto : false,
			duration : 4000,
			pager : true,
			controls : true,
			direction : 'horizontal',
			easing : 'linear',
			slideLength : 0,
			slideNum : 0,
			backFlag : false
		};
		var opts = $.extend({}, $.fn.wipeSlider.defaults, options);
		

		this.each(function(index){

			var	slidesWrap = $(this),
				slides = (slidesWrap.children('.slides').length) ? 
					slidesWrap.children('.slides')
					:slidesWrap,
				slide = slides.children('.slide'),
				slideW = slide.outerWidth(true),
				slideH = slide.outerHeight(true);

			opts.slideLength = slide.length - 1,
			opts.slideNum = 0,	
			opts.backFlag = false;
				
			slide.filter(':first-child').addClass('active');

			//スライド用のクラス切り替え
			var wiper = function(){
				slide.removeClass('active');
				slide.filter(':nth-child('+ (opts.slideNum+1) +')').addClass('active').css({
					'backface-visibility': 'hidden',
					'will-change': 'clip',
					'z-index':'2'
				});
				if(opts.direction === 'horizontal'){
					if(opts.backFlag === true){
						toRight();
					}else{
						toLeft();
					}
				}
				else if(opts.direction === 'vertical') {
					if(opts.backFlag === true){
						toTop();
					}else{
						toBottom();
					}
				}else if(opts.direction === 'four'){
					if(opts.backFlag === true){
						switch((opts.slideNum+1)%4){
							case 3:
								toLeft();
								break;
							case 0:
								toTop();
								break;
							case 1:
								toRight();
								break;
							case 2:
								toBottom();
								break;
						}
					}else{
						switch((opts.slideNum+1)%4){
							case 0:
								toRight();
								break;
							case 1:
								toBottom();
								break;
							case 2:
								toLeft();
								break;
							case 3:
								toTop();
								break;
						}
					}
				}else if(opts.direction === 'custom'){
					if(opts.backFlag === true){
						backNum = (opts.slideNum === opts.slideLength) ? 0 : opts.slideNum+1;
						switch(slide.filter(':nth-child('+ (backNum+1) +')').data('dir')){
							case 'toLeft':
								toRight();
								break;
							case 'toRight':
								toLeft();
								break;
							case 'toTop':
								toBottom();
								break;
							case 'toBottom':
								toTop();
								break;
						}
					}else{
						switch(slide.filter(':nth-child('+ (opts.slideNum+1) +')').data('dir')){
							case 'toLeft':
								toLeft();
								break;
							case 'toRight':
								toRight();
								break;
							case 'toTop':
								toTop();
								break;
							case 'toBottom':
								toBottom();
								break;
						}
					}
				}else{
					setTimeout(
						function(){
							animCallback()
						},
						opts.transition
					)
				}
				//console.log(opts.backFlag);
				slidesWrap.find('.pager li button').removeClass('current');
				slidesWrap.find('.pager li').filter(':nth-child('+ (opts.slideNum+1) +')').find('button').addClass('current');
				if (typeof options.slideBefore === 'function') {
					var	slideNum = opts.slideNum,
							slideLength = opts.slideLength;
					options.slideBefore(slideNum,slideLength);
				}
				if (typeof options.slideAfter === 'function') {
					var	slideNum = opts.slideNum,
							slideLength = opts.slideLength;
					setTimeout(
						function(){
							options.slideAfter(slideNum,slideLength);
						}
						,options.transition
					);
				}
			};

			//自動再生
			if(opts.auto === true){
				var slideNumSet = function(){
					opts.backFlag = false;
					if(opts.slideNum < opts.slideLength){
						opts.slideNum++;
					} else {
						opts.slideNum = 0;
					}
					wiper();
				};
				var autoWiper = setInterval(slideNumSet, opts.duration);
			}

			//オートタイマーの再設定
			var resetCount,retetTimer;
			var timerReset = function(){
				if(opts.auto === true){
					clearInterval(autoWiper);
					resetCount = 0;
					clearInterval(retetTimer);
					retetTimer = setInterval(function(){
						if(resetCount < 4){
							resetCount++;
						} else {
							clearInterval(retetTimer);
							autoWiper = setInterval(slideNumSet, opts.duration);
						}
					}, 1000);
				}
			};
			//スライドのアニメーション作成
			slidesWrap.css({
				width:slideW
			});
			slides.css({
				width:slideW,
				height:slideH
			});
			slide.css({
				width:slideW,
				height:slideH,
				opacity:1
			});
			slide.filter(':first-child').css({
				'z-index':2
			});
			slide.filter(':nth-child(2)').css({
				'z-index':1
			});
			
			var toRight = function(){
				slide.filter(':nth-child('+ (opts.slideNum+1) +')').css({
					clip:'rect(0,0,'+slideH+'px,0)'
				}).animate(
					{zIndex: slideW},
					{
						duration:opts.transition,
						easing:opts.easing,
						complete: function(){
							animCallback();
						},
						step: function(now, fx){
							$(this).css({
								clip:'rect(0,'+now+'px,'+slideH+'px,0)'
							});
						}
					}
				);
			};
		
			var toLeft = function(){
				slide.filter(':nth-child('+ (opts.slideNum+1) +')').css({
					clip:'rect(0, '+slideW+'px, '+slideH+'px, '+slideW+'px)'
				}).animate(
					{zIndex: slideW},
					{
						duration:opts.transition,
						easing:opts.easing,
						complete: function(){
							animCallback();
						},
						step: function(now, fx){
							$(this).css({
								clip:'rect(0, '+slideW+'px, '+slideH+'px, '+(slideW-now)+'px)'
							});
						}
					}
				);
			};
		
			var toBottom = function(){
				slide.filter(':nth-child('+ (opts.slideNum+1) +')').css({
					clip:'rect(0, '+slideW+'px,0,0)'
				}).animate(
					{zIndex: slideH},
					{
						duration:opts.transition,
						easing:opts.easing,
						complete: function(){
							animCallback();
						},
						step: function(now, fx){
							$(this).css({
								clip:'rect(0, '+slideW+'px,'+ now +'px,0)'
							});
						}
					}
				);
			};
		
			var toTop = function(){
				slide.filter(':nth-child('+ (opts.slideNum+1) +')').css({
					clip:'rect('+slideH+'px, '+slideW+'px,'+slideH+'px,0)'
				}).animate(
					{zIndex: slideH},
					{
						duration:opts.transition,
						easing:opts.easing,
						complete: function(){
							animCallback();
						},
						step: function(now, fx){
							$(this).css({
								clip:'rect('+(slideH-now)+'px, '+slideW+'px,'+slideH+'px,0)'
							});
						}
					}
				);
			};

			var animCallback = function(){
				slide.filter('.active').css({
					'z-index':'1'
				});
				slide.filter(':not(.active)').css({
					'z-index':'',
					'backface-visibility': '',
					'will-change': 'unset'
				});
			};

			//コントローラー作成
			if(opts.controls === true){
				var	controllL = '<button class="prevBtn">prev</button>',
					controllR = '<button class="nextBtn">next</button>'
				var controllerHTML = '<div class="controlls">' + controllL + controllR + '<div>';
				slidesWrap.append(controllerHTML);
				slidesWrap.find('.prevBtn').click(function(){
					if(opts.slideNum === 0){
						opts.slideNum = opts.slideLength;
					}else{
						opts.slideNum--
					}
					opts.backFlag = true;
					timerReset();
					wiper();
				});
				slidesWrap.find('.nextBtn').click(function(){
					if(opts.slideNum === opts.slideLength){
						opts.slideNum = 0;
					}else{
						opts.slideNum++;
					}
					opts.backFlag = false;
					timerReset();
					wiper();
				});
			}
			
			//ページャー作成
			if(opts.pager === true){
				var pagerHTML = '';
				for(var i=0;i<opts.slideLength+1;i++){
					var pagerLength = i+1;
					pagerHTML += '<li><button>' + pagerLength + '</button></li>';
				}
				pagerHTML = '<ul class="pager">' + pagerHTML + '</ul>';
				slidesWrap.append(pagerHTML);
				slidesWrap.find('.pager li:first-child button').addClass('current');
				//ページャークリックでスライド切り替え
				slidesWrap.find('.pager button').click(function(){
					console.log(slidesWrap.index());
					if(!$(this).hasClass('current')){
						opts.backFlag = ($(this).parent().index() < opts.slideNum) ? true : false;
						opts.slideNum = $(this).parent().index();
						timerReset();
						wiper();
					}
				});
			}
			
			//別タブが開かれたときにオート再生を止め、戻ったときに再開する
			$(window).bind("focus",function(){
				clearInterval(autoWiper);
				autoWiper = setInterval(slideNumSet, opts.duration);
			}).bind("blur",function(){
				clearInterval(autoWiper);
			});

		});

	};
}(jQuery));