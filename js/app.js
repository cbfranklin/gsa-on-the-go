var router;
var gaCrumb = '/onthego-test/';
var gaDimensions = {};

function app() {


    platformSpecific();

    var rendered_html = Mustache.to_html($('#templates .app-list').html(), {
        apps: apps
    });
    $('#app-list').html(rendered_html);
    $('body').on('click', '.btn-app-name', function(e) {
        console.log('btn-app-name')
        $(this).parent().toggleClass('open')
        e.preventDefault()
    });

    router = new Grapnel();
    router.get('', function(req) {
        $('section').hide();
        if ($('#swipe-list').is(':empty')) {
            var list_sites = apps.filter(function(obj) {
                return obj['is-site'] == true;
            })
            var list_apps = apps.filter(function(obj) {
                return !obj['is-site'];
            })
            var rendered_list_1 = Mustache.to_html($('#templates .swipe-list').html(), {
                apps: list_apps
            });
            var rendered_list_2 = Mustache.to_html($('#templates .swipe-list').html(), {
                apps: list_sites
            });
            $('#swipe-list').html(rendered_list_1);
            $('#swipe-list-2').html(rendered_list_2);
            $('#swipe-list,#swipe-list-2').owlCarousel({
                itemsMobile: [479, 3],
                itemsTablet: [767, 4],
                itemsDesktopSmall: false,
                itemsDesktop: [1023, 7],
                pagination: true
            });
        }
        $('#app-list-page').show();
    });
    router.get('/', function(req) {
        router.navigate('');
    })
    router.get('/apps', function(req) {
        router.navigate('');
    })
    router.get('undefined', function(req) {
        router.navigate('');
    })
    router.get('/help', function(req) {
        $('section').hide();
        $('#help-page').show();
    })
    router.get('/feedback', function(req) {
        $('section').hide();
        $('#feedback').show();
        $(".google-form").on("submit", function() {
            router.navigate('/thankyou');
            setTimeout(function() {
                $('.google-form textarea').val('');
            }, 1000)
        });
    })
    router.get('/thankyou', function(req) {
        $('section').hide();
        $('#thankyou').show();
    })
    router.get('/apps/:name', function(req) {
        $('section').hide();
        $('#app-info-page').show();
        var appName = req.params.name;
        var findByName = $.grep(apps, function(e) {
            return e.name == appName;
        });
        var rendered_html = Mustache.to_html($('#templates .app-info').html(), {
            app: findByName[0]
        });
        $('#app-info-page').html(rendered_html);
        var req = 'app-info/' + findByName[0].name + '.html';
        $('.app-info-body').load(req);
    });
    $('body').on('click', 'a', function(e) {
        var url = $(this).attr('href');
        if (url.indexOf('http') > -1) {
            ga('send', 'event', 'outbound', 'click', url, {
                'hitCallback': function() {
                    document.location = url;
                }
            });
            e.preventDefault();
        }
    })

    router.on('navigate', function(event) {
        if (window.location.hash.indexOf('#/') > -1) {
            if (gaCrumb.indexOf('#') > -1) {
                gaCrumb = gaCrumb.split('#')[0];
            }
            ga('send', 'pageview', gaCrumb + '/' + window.location.hash);
        }
    });
}

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

function platformSpecific() {
    if (isMobile.Android()) {
        for (i in apps) {
            if (apps[i]['link-download']) {
                apps[i]['link-download-platform'] = apps[i]['link-download']['android'];
            }
        }
    }
    if (isMobile.iOS()) {
        for (i in apps) {
            if (apps[i]['link-download']) {
                apps[i]['link-download-platform'] = apps[i]['link-download']['ios'];
            }
        }
    }

    if (isMobile.any()) {
        for (i in apps) {
            if (typeof apps[i].link === 'object') {
                apps[i]['link'] = apps[i]['link']['mobile']
            }
        }
    } else {
        for (i in apps) {
            if (typeof apps[i].link === 'object') {
                apps[i]['link'] = apps[i]['link']['desktop']
            }
        }
    }
}
