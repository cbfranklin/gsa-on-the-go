var router;
var gaCrumb = '/onthego/';
var gaDimensions = {};

function app() {

    $('body').on('click', '.container.nav-active', function(event) {
        $('nav,.menu-toggle').removeClass('active');
        $('.container').removeClass('nav-active')
        event.stopPropagation()
        event.preventDefault()
    })


    platformSpecific();

    var rendered_html = Mustache.to_html($('#templates .app-list').html(), {
        apps: apps
    });
    $('#app-list').html(rendered_html);

    /*Mousetrap.bind('enter', function(e) {
        staffDirectorySearch();
        e.preventDefault();
    });*/

    router = new Grapnel();
    router.get('', function(req) {
        $('nav,.menu-toggle').removeClass('active');
        $('.container').removeClass('nav-active')
        var title = 'GSA On The Go';
        document.title = title;
        $('section').hide();
        if ($('#swipe-list-apps').is(':empty')) {
            var list_sites = apps.filter(function(obj) {
                return obj['type'] === 'site';
            })
            var list_apps = apps.filter(function(obj) {
                return obj['type'] === 'app';
            })
            var list_google = apps.filter(function(obj) {
                return obj['type'] === 'google';
            })
            var swipeTemplate = $('#templates .swipe-list').html()

            var rendered_list_apps = Mustache.to_html(swipeTemplate, {
                apps: list_apps
            });
            var rendered_list_sites = Mustache.to_html(swipeTemplate, {
                apps: list_sites
            });
            var rendered_list_google = Mustache.to_html(swipeTemplate, {
                apps: list_google
            });
            $('#swipe-list-sites').html(rendered_list_sites);
            $('#swipe-list-apps').html(rendered_list_apps);
            $('#swipe-list-google').html(rendered_list_google);
            $('#swipe-list-sites,#swipe-list-apps,#swipe-list-google').owlCarousel({
                itemsMobile: [479, 3],
                itemsTablet: [767, 4],
                itemsDesktopSmall: false,
                itemsDesktop: [1023, 7],
                pagination: true
            });
        }
        $('#app-list-page').show();
    });
    /*router.get('/apps', function(req) {
        router.navigate('');
    })
    router.get('*undefined', function(req) {
        router.navigate('');
    })*/
    router.get('/help', function(req) {
        $('section').hide();
        $('#help-page').show();
        var title = 'Help Lines & Support | GSA On The Go';
        document.title = title;
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
        var title = 'Feedback | GSA On The Go';
        document.title = title;
    })
    router.get('/thankyou', function(req) {
        $('section').hide();
        $('#thankyou').show();
        var title = 'Thank You | GSA On The Go';
        document.title = title;
    })
    router.get('/mobile-vpn', function(req) {
        $('section').hide();
        $('#mobile-vpn').show();
        var title = 'Mobile VPN | GSA On The Go';
        document.title = title;
    })
    router.get('/apps/:name', function(req) {
        $('section').hide();
        $('#app-info-page').show();
        var appName = req.params.name;
        var findByName = $.grep(apps, function(e) {
            return e.name == appName;
        });
        var appData = findByName[0];
        if (appData.type === 'site') {
            var rendered_html = Mustache.to_html($('#templates .site-info').html(), {
                app: appData
            });
        } else {
            var rendered_html = Mustache.to_html($('#templates .app-info').html(), {
                app: appData
            });
        }

        $('#app-info-page').html(rendered_html);
        var req = 'data/app-info/' + findByName[0].name + '.html';
        $('.app-info-body').load(req);
        var title = findByName[0]['display-name'] + ' | GSA On The Go';
        document.title = title;
    });

    router.get('/staff-directory', function(req) {
        $('section').hide();
        $('#staff-directory').show();
        $('#staffDir-results-container').hide();
        $('#staffDir-search-container').show();
        $('#staffDir-load').hide();

        var title = 'Staff Directory | GSA On The Go';
        document.title = title;



        $('body').on('click', '#staffDir-search', staffDirectorySearch);


        $('body').on('click', '#staffDir-search-again', function() {
            window.scrollTo(0, 0);
            $('#staffDir-results-container').html('').hide();
            $('#staffDir-search-container input, #staffDir-search-container select').val('');
            $('#staffDir-search-container').show();
        });


    })

    

    router.on('navigate', function(event) {
        console.log('navigate')
        window.scrollTo(0, 0);
        if (window.location.hash.indexOf('undefined') === -1) {
            trackPageView();
        }
    });

}

function staffDirectorySearch() {
    $('#staffDir-search-container').hide();
    $('#staffDir-load').show();
    window.scrollTo(0, 0);
    var GSARoot = 'http://m.gsa.gov';

    var staffDirBaseURL = GSARoot + '/api/rs/a',
        apiReq = staffDirBaseURL,
        reqSummary = '',
        staffDirFirstName = $('#staffDir-firstName').val(),
        staffDirLastName = $('#staffDir-lastName').val(),
        staffDirState = $('#staffDir-state').val(),
        staffDirZip = $('#staffDir-zip').val();

    if (staffDirFirstName !== '') {
        apiReq += '/fn/' + staffDirFirstName;
        reqSummary += ' ' + staffDirFirstName;
    }
    if (staffDirLastName !== '') {
        apiReq += '/ln/' + staffDirLastName;
        reqSummary += ' ' + staffDirLastName;
    }
    if (staffDirState !== '') {
        apiReq += '/st/' + staffDirState;
        reqSummary += ' ' + staffDirState;
    }
    if (staffDirZip !== '') {
        apiReq += '/zip/' + staffDirZip;
        reqSummary += ' ' + staffDirZip;
    }


    $.ajax({
        url: apiReq,
        dataType: "json",
        success: function(data) {
            var results = data.gsaAssociate;
            if (results.length > 0) {
                results = results.sort(function(a, b) {
                    var sortNameA = a.lastName + ' ' + a.firstName;
                    var sortNameB = b.lastName + ' ' + b.firstName;
                    return sortNameA.localeCompare(sortNameB);
                });
                if(results.length === 1) var singular = true;
                var staffdir_html = Mustache.to_html($('#templates .staff-directory').html(), {
                    results: results,
                    length: results.length,
                    summary: reqSummary,
                    singular: singular
                });
                $('#staffDir-results-container').html(staffdir_html);
            } else {
                $('#staffDir-results-container').html('<div class="alert alert-warning" role="alert"> <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> <span class="sr-only">Error:</span> No Results Found. </div><button id="staffDir-search-again" class="btn btn-primary btn-large btn-block">Search Again</button>');
            }
            $('#staffDir-load').hide();
            $('#staffDir-results-container').show();
            window.scrollTo(0, 0);
        },
        error: function(data) {
            $('#staffDir-results-container').html('<div class="alert alert-warning" role="alert"> <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> <span class="sr-only">Error:</span> No Results Found. </div><button id="staffDir-search-again" class="btn btn-primary btn-large btn-block">Search Again</button>');
            $('#staffDir-load').hide();
            $('#staffDir-results-container').show();
            window.scrollTo(0, 0);
        }

    })
}

function trackPageView() {
    var hash = window.location.hash;
    if (hash === '#/' || hash === '#') hash = '';
    if (typeof ga !== "undefined") {
        ga('send', 'pageview', gaCrumb + hash, null, document.title);
    } else {
        console.log('send', 'pageview', gaCrumb + hash, null, document.title)
    }
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
                apps[i]['platform'] = 'android';
            }
        }
    }
    if (isMobile.iOS()) {
        for (i in apps) {
            if (apps[i]['link-download']) {
                apps[i]['link-download-platform'] = apps[i]['link-download']['apple'];
                apps[i]['platform'] = 'apple';
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
