function navigation() {

    $("nav li,.nav-secondary > div").hover(
        function() {
        	if(window.innerWidth > 991){
        		var nav = $(this).attr('data-nav');
	            $('.nav-secondary [data-nav=' + nav + ']').show().siblings().hide;
	            //$('.hero').addClass('blurred');
	            $('nav [data-nav=' + nav + ']').addClass('active')
        	}
        },
        function() {
        	if(window.innerWidth > 991){
        		var nav = $(this).attr('data-nav');
            	$('.nav-secondary [data-nav=' + nav + ']').hide();
            	$('.hero').removeClass('blurred');
            	$('nav [data-nav=' + nav + ']').removeClass('active')	
        	}
    });

    $("nav li").on('click',function(){
    	var nav = $(this).attr('data-nav');
        $(this).addClass('active').siblings().removeClass('active');
    	$('.nav-secondary [data-nav=' + nav + ']').show().siblings().hide();
    	$('.nav-secondary').addClass('active');
    	$('nav').addClass('drawer-open');
    });

    $('.hero').on('click',function(){
    	$('.nav-secondary').removeClass('active');
    	$('nav').removeClass('drawer-open');
        $('.nav-primary li').removeClass('active');
    });

    $('.menu-toggle').on('click',function(){
        $(this).toggleClass('active');
        $('nav').toggleClass('active');
        $('.nav-primary li').removeClass('active');
        $('.container').toggleClass('nav-active')
    });

    $('.btn-navigation,nav li').on('click',function(){
        var nav = $(this).attr('data-nav');
        router.navigate(nav);
        $('nav').removeClass('active');
        $('.menu-toggle').removeClass('active');
        $('.container').removeClass('nav-active')
    })
};