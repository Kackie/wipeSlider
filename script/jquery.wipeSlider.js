;$(function(){
    $.fn.wipeSlider = function(){
        var	slidesWrap = $('.js_wiper');
            slides = slidesWrap.find('.slides'),
            slide = slides.find('.slide'),
            slideW = slide.outerWidth(true),
            slideH = slide.outerHeight(true),
            length = slide.length - 1,
            transition = 500, //アニメーション時間
            duration = 2000; //スライド表示時間
        slide.eq(0).addClass('active');
        
        //スライド用のクラス切り替え
        var slideNum = 0;
        var wiper = function(){
            slide.removeClass('active');
            slide.eq(slideNum).addClass('active').css({
                clip: 'rect(0px,'+ slideW +'px,'+ slideH +'px,0)',
                'z-index':'2'
            });
            setTimeout(function(){
                slide.filter('.active').css({
                    'z-index':'1'
                });
                slide.not('.active').css({
                    clip: 'rect(0,0,' + slideH +'px,0)',
                    'z-index':''
                });
            },transition);
            slidesWrap.find('.pager li button').removeClass('current');
            slidesWrap.find('.pager li button').eq(slideNum).addClass('current');
        };

        //自動再生
        var slideNumSet = function(){
            if(slideNum < length){
                slideNum++;
            } else {
                slideNum = 0;
            }
            wiper();
        };
        var autoWiper = setInterval(slideNumSet, duration);

        //オートタイマーの再設定
        var resetCount,retetTimer;
        timerReset = function(){
            clearInterval(autoWiper);
            resetCount = 0;
            clearInterval(retetTimer);
            retetTimer = setInterval(function(){
                if(resetCount < 4){
                    resetCount++;
                } else {
                    clearInterval(retetTimer);
                    autoWiper = setInterval(slideNumSet, duration);
                }
            }, 1000);
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
            transition:'clip ' + transition/1000 + 's',
            opacity:1
        });
        slide.filter(':nth-child(n+2)').css({
            clip: 'rect(0,0,' + slideH +'px,0)',
        });

        //コントローラー作成
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
            timerReset();
            wiper();
        });
        slidesWrap.find('.nextBtn').click(function(){
            if(slideNum === length){
                slideNum = 0;
            }else{
                slideNum++;
            }
            timerReset();
            wiper();
            console.log(length,slideNum);
        });
        
        //ページャー作成
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
            slideNum = $('.pager button').index(this);
            timerReset();
            wiper();
        });
        
        //別タブが開かれたときにオート再生を止め、戻ったときに再開する
        $(window).bind("focus",function(){
			clearInterval(autoWiper);
			autoWiper = setInterval(slideNumSet, duration);
		}).bind("blur",function(){
			clearInterval(autoWiper);
        });
    }
});