var router;
var gaCrumb = '/onthego/';
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
    router.get('undefined', function(req) {
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
        var req = 'app-info/' + findByName[0].name + '.html';
        $('.app-info-body').load(req);
        var title = findByName[0]['display-name'] + ' | GSA On The Go';
        document.title = title;
    });

    router.get('/staff-directory', function(req) {
        $('section').hide();
        $('#staff-directory').show();
        $('.addresses,#feedback').html('');
        $('form input, form select').val('');

        $('#searchSwitch button').click(function() {
            $('#searches > form,#searches > div').toggle();
            $('#searchSwitch button').toggleClass('active');
            var id = $(this).attr('id');
            $('#searches .' + id).show();
            if (id === 'staffDirectory') {
                $('#results').show();
            } else if (id === 'byTopic') {
                $('#results').show();
                $('#keyContacts').show();
            } else {
                $('#results').hide();
            }
            $('.addresses,#feedback').html('');
            $('form input, form select').val('');
        });
        $('#search,#groupSearch').click(function() {
            staffDirectorySearch();
            return false;
        });

        function staffDirectorySearch() {
            $('#load').show();
            $('.addresses,.feedback').fadeOut();
            $('.addresses').html('');
            theQuery = new Query($('#lastName').val(), $('#firstName').val(), $('#state').val(), $('#zip').val(), $('#contactGroup').val());
            console.log(theQuery.request());
            staffDirectoryFeedback(theQuery.feedback());
            staffDirectorySearchAPI(theQuery.request());
            //prevSearches.push(theQuery);
            //showPrevSearches(prevSearches);
            $('html, body').animate({
                scrollTop: $('#results').offset().top
            }, 500);
        };

        function Query(lastName, firstName, state, zip, contactGroup) {

            if (lastName.length > 0) {
                this.lastNameR = '/ln/' + lastName;
                this.lastName = lastName;
            } else {
                this.lastNameR = '', this.lastName = '';
            }

            if (firstName.length > 0) {
                this.firstNameR = '/fn/' + firstName;
                this.firstName = firstName;
            } else {
                this.firstNameR = '', this.firstName = '';
            }

            if (state !== 'none') {
                this.stateR = '/st/' + state;
                this.state = state;
            } else {
                this.stateR = '', this.state = '';
            }

            if (zip.length > 0) {
                this.zipR = '/zip/' + zip;
                this.zip = zip;
            } else {
                this.zipR = '', this.zip = '';
            }

            this.request = function() {
                if (contactGroup === 'none' || contactGroup === null) {
                    return baseURL + this.firstNameR + this.lastNameR + this.stateR + this.zipR;
                } else {
                    return groupURL + '/' + contactGroup;
                }
            };
            this.isGroup = function() {
                if (contactGroup === 'none') {
                    return false;
                } else {
                    return true;
                }
            }
            this.feedback = function() {
                if (contactGroup === 'none' || contactGroup === null) {
                    return this.lastName + ' ' + this.firstName + ' ' + this.state + ' ' + this.zip;
                } else {
                    return contactGroup.split('%20').join(' ');
                }
            };
        };

        function staffDirectorySearchAPI(theRequest) {
            $.getJSON(theRequest, function(json) {

                    if (theQuery.isGroup() === true) {
                        if (json.gsaContactGroup[0] === undefined) {
                            staffDirectoryLoaded(false);
                            return;
                        } else {
                            var data = json.gsaContactGroup[0].gsaAssociate;
                        }
                    } else {
                        var data = json.gsaAssociate;
                    }

                    if (data.length == 0) {
                        staffDirectoryLoaded(false);
                        return;
                    }

                    $.each(data, function(i, p) {
                            var cardID = 'card' + i;
                            $(addressCard).appendTo('.addresses').attr('id', cardID);
                            $('.addresses #' + cardID + ' .name .name').html(p.firstName + ' ' + p.lastName);
                            $('.addresses #' + cardID + ' .name .title').html(p.title);
                            if (p.streetAddress != null) {
                                if (p.roomNumber != null) {
                                    roomNumber = '<br>Room: ' + p.roomNumber
                                } else {
                                    roomNumber = '';
                                }
                                $('.addresses #' + cardID + ' .address .address').html(p.streetAddress + '<br>' + p.city + ', ' + p.state + ', ' + p.zip + roomNumber);
                            }
                            if (p.emailAddress != null) {
                                $('.addresses #' + cardID + ' .address .email a').html(p.emailAddress).attr('href', 'mailto:' + p.emailAddress);
                            }
                            if (p.phoneNumber != null || p.faxNumber != null) {
                                //Prevents duplicate appended telephone numbers in previous searches, for now.
                                $('.addresses #' + cardID + ' div.tel').remove();
                                $(telEntry).insertAfter('.addresses #' + cardID + ' div.address');
                                if (p.phoneNumber != null) {
                                    $('.addresses #' + cardID + ' span.tel strong').html('Tel: ');
                                    $('.addresses #' + cardID + ' span.tel a').html(staffDirectoryFormatNumber(p.phoneNumber)).attr('href', 'tel:1' + p.phoneNumber);
                                }
                                if (p.faxNumber != null) {
                                    $('.addresses #' + cardID + ' span.fax strong').html('Fax: ');
                                    $('.addresses #' + cardID + ' span.fax a').html(staffDirectoryFormatNumber(p.faxNumber)).attr('href', 'tel:1' + p.faxNumber);
                                }
                            }
                        },
                        staffDirectoryLoaded());
                })
                .error(function() {
                    staffDirectoryLoaded(false)
                });
        };

        function staffDirectoryFeedback(feedback) {
            $('.feedback').html('Your Search: "' + feedback + '"');
        };

        //Some numbers are already formatted in the database.
        function staffDirectoryFormatNumber(n) {
            if (n.indexOf('(') > 0 || n.indexOf('-') > 0) {
                return n;
            } else {
                return '(' + n.substring(0, 3) + ') ' + n.substring(3, 6) + '-' + n.substring(6, 10);
            }
        };

        function staffDirectoryLoaded(success) {
            if (success == false) {
                $('.addresses').html('<h4>No Results.</h4>');
            } else {
                $('.addresses h4').remove()
            }
            if ($('.addresses').length <= 1) {
                $('#load').fadeOut();
            } else {
                $('#load').slideUp();
            }
            $('.addresses,.feedback').fadeIn();

            //Reset Group Menu
            $('#contactGroup').val(0);
        };


        var GSARoot = 'http://m.gsa.gov',
            baseURL = GSARoot + '/api/rs/a',
            groupURL = GSARoot + '/api/rs/group',
            addressCard = '<li><div class="top"><a href="#"><img alt="GSA" src="http://www.gsa.gov/graphics/staffoffices/GSAStarMarkweblogopolicy3333.jpg"></a><div class="name"><span class="name"></span><span class="title"></span></div></div><div class="bottom"><div class="address"><span class="address"></span><span class="email"><a href="mailto:"></a></span></div></div></li>',
            telEntry = '<div class="tel"><span class="tel"><strong></strong><a href=""></a></span><span class="fax"><strong></strong><a href="tel+1"></a></span></div>';
    })

    $('body').on('click', '.container.nav-active', function() {
        $('nav,.menu-toggle').removeClass('active');
        $('.container').removeClass('nav-active')
    })

    router.on('hashchange', function(event) {
        if (window.location.hash.indexOf('undefined') === -1) {
            if (typeof ga !== "undefined") {
                ga('send', 'pageview', gaCrumb + window.location.hash, null, document.title);
            } else {
                console.log('send', 'pageview', gaCrumb + window.location.hash, null, document.title)
            }
        }
    });

}

function trackInitialPageView() {
    if (typeof ga !== "undefined") {
        ga('send', 'pageview', gaCrumb + window.location.hash, null, document.title);
    } else {
        console.log('send', 'pageview', gaCrumb + window.location.hash, null, document.title)
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