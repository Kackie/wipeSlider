/*//////////////////////////////////////////
Author : Kackie(https://github.com/Kackie)
created: 2019/02/23
//////////////////////////////////////////*/
;$(function(){
    $.fn.wipeSlider = function(options){
		var opts = $.extend({}, $.fn.wipeSlider.defaults, options);
        var	slidesWrap = $('.js_wiper');
            slides = slidesWrap.find('.slides'),
            slide = slides.find('.slide'),
            slideW = slide.outerWidth(true),
            slideH = slide.outerHeight(true),
			length = slide.length - 1,
			backFlag = false;

        slide.eq(0).addClass('active');
        
        //スライド用のクラス切り替え
        var slideNum = 0;
        var wiper = function(){
			slide.removeClass('active');
			slide.eq(slideNum).addClass('active').css({
				'backface-visibility': 'hidden',
				'will-change': 'clip',
                clip: 'rect(0px,'+ slideW +'px,'+ slideH +'px,0)',
                'z-index':'2'
			});
			console.log(backFlag);
            setTimeout(function(){
                slide.filter('.active').css({
					'z-index':'1',
					'backface-visibility': '',
					'will-change': 'unset'
                });
                slide.not('.active').css({
                    clip: 'rect(0,0,' + slideH +'px,0)',
                    'z-index':''
				});
            },opts.transition);
            slidesWrap.find('.pager li button').removeClass('current');
            slidesWrap.find('.pager li button').eq(slideNum).addClass('current');
        };

		//自動再生
		if(opts.auto === true){
			var slideNumSet = function(){
				if(slideNum < length){
					slideNum++;
				} else {
					slideNum = 0;
				}
				wiper();
			};
			var autoWiper = setInterval(slideNumSet, opts.duration);
		}

        //オートタイマーの再設定
        var resetCount,retetTimer;
        timerReset = function(){
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
            transition:'clip ' + opts.transition/1000 + 's',
            opacity:1
        });
        slide.filter(':nth-child(n+2)').css({
            clip: 'rect(0,0,' + slideH +'px,0)',
        });

		//コントローラー作成
		if(opts.controls === true){
			var	controllL = '<button class="prevBtn">prev</button>',
				controllR = '<button class="nextBtn">next</button>'
			var controllerHTML = '<div class="controlls">' + controllL + controllR + '<div>';
			slidesWrap.append(controllerHTML);
			slidesWrap.find('.prevBtn').click(function(){
				if(slideNum === 0){
					slideNum = length;
				}else{
					slideNum--
				}
				backFlag = true;
				timerReset();
				wiper();
			});
			slidesWrap.find('.nextBtn').click(function(){
				if(slideNum === length){
					slideNum = 0;
				}else{
					slideNum++;
				}
				backFlag = false;
				timerReset();
				wiper();
			});
		}
        
		//ページャー作成
		if(opts.pager === true){
			var pagerHTML = '';
			for(var i=0;i<length+1;i++){
				var pagerLength = i+1;
				pagerHTML += '<li><button>' + pagerLength + '</button></li>';
			}
			pagerHTML = '<ul class="pager">' + pagerHTML + '</ul>';
			slidesWrap.append(pagerHTML);
			slidesWrap.find('.pager li button').eq(0).addClass('current');
			//ページャークリックでスライド切り替え
			slidesWrap.find('.pager button').click(function(){
				if(!$(this).hasClass('current')){
					backFlag = ($('.pager button').index(this) < slideNum) ? true : false;
					slideNum = $('.pager button').index(this);
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
	};
	$.fn.wipeSlider.defaults = {
		transition : 500,
		duration : 4000,
		pager : true,
		controls : true,
		backAnim : true
	};
});