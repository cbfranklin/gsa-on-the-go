var router;
function intro(){
    $('#intro').show().slick({
      dots: false,
      arrows: false,
      infinite: false
    });
    $('body').css({'overflow-y':'hidden',"height":"100%","position":"relative"});
    $('#intro-close').on('click',function(e){
        $('#intro').addClass('animated fadeOutUpBig')
        $('body').css({'overflow-y':'auto',"height":"auto"});
        router.navigate('/apps');
        e.preventDefault();
    })
}
function app(){
    intro();
    console.log('app')
    /*$('.star-pin').on('click',function(){
        if($(this).parents('.list-group-item').attr('data-pinned') === 'false'){
            $(this).parents('.list-group-item').attr('data-pinned',true)
        }
        else{
            $(this).parents('.list-group-item').attr('data-pinned',false)
        }
        sortAppList();
    });*/

    platformSpecific();

    router = new Grapnel();
    router.get('',function(req){
        intro();
    })
    router.get('/apps', function(req){
        $('section').hide();
        $('#app-list-page').show();
        var rendered_html = Mustache.to_html($('#templates .app-list').html(),{
           apps:apps
        });
        $('#app-list').html(rendered_html);
    });

    router.get('/apps/:name', function(req){
        $('section').hide();
        $('#app-info-page').show();
        var appName = req.params.name;
        console.log(appName)
        var findByName = $.grep(apps, function(e){ return e.name == appName; });
        console.log(findByName[0])
        var rendered_html = Mustache.to_html($('#templates .app-info').html(),{
           app:findByName[0]
        });
        $('#app-info-page').html(rendered_html);
    });
}

function sortAppList(){
    var $list = $('#apps-list'),
    $listli = $list.children('a');

    $listli.sort(function(a,b){
        var an = a.getAttribute('data-pinned'),
            bn = b.getAttribute('data-pinned');

            console.log(an,bn)

        if(an > bn) {
            return -1;
        }
        if(an < bn) {
            return 1;
        }
        return 0;
    });

    $listli.detach().appendTo($list);
}

/*$('body').on('swipe','xxx',function(event){
    var dir = event.direction;
});*/

var isMobile = {
    Android: function() {
        return /Android/i.test(navigator.userAgent);
    },
    BlackBerry: function() {
        return /BlackBerry/i.test(navigator.userAgent);
    },
    iOS: function() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    },
    Windows: function() {
        return /IEMobile/i.test(navigator.userAgent);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
    }
};

function platformSpecific(){
    if(isMobile.Android()){
        for(i in apps){
            apps[i]['link-download'] = apps[i]['link-download']['android'];
        }
    }
    else if(isMobile.iOS()){
        for(i in apps){
            if(apps[i]['link-download'])
            apps[i]['link-download'] = apps[i]['link-download']['ios'];
        }
    }
    else{
        for(i in apps){
            apps[i]['link-download'] = null;
         }
    }
}

