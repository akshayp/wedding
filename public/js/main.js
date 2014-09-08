/*globals window, document, $, L*/

(function (win, doc, Leaflet) {
    var docEl = doc.documentElement;

    function viewportW() {
        var a = docEl.clientWidth,
            b = win.innerWidth;

        return a < b ? b : a;
    }

    function viewportH() {
        var a = docEl.clientHeight,
            b = win.innerHeight;

        return a < b ? b : a;
    }

    function calibrate(coords, cushion) {
        var o = {};
        cushion = +cushion || 0;
        o.width = (o.right = coords.right + cushion) - (o.left = coords.left - cushion);
        o.height = (o.bottom = coords.bottom + cushion) - (o.top = coords.top - cushion);
        return o;
    }

    function inViewport(el, cushion) {
        var r = calibrate(el.getBoundingClientRect(), cushion);
        return !!r && r.bottom >= 0 && r.right >= 0 && r.top <= viewportH() && r.left <= viewportW();
    }

    function getMargin(el) {
        return win.getComputedStyle(el).getPropertyValue('margin-top');
    }

    function initMaps() {
        var maps = $('[data-map]');

        Leaflet.mapbox.accessToken = 'pk.eyJ1IjoiYWtzaGF5cCIsImEiOiJ0ZGhBcVJVIn0.Dky1r5eel-SHJAq8UoLnuw';

        if(maps) {

            maps.each(function () {
                var mapNode = $(this);

                var map = Leaflet.mapbox.map(mapNode.attr('id'), mapNode.data('map'), {
                    zoomControl: false
                })
                .setView([mapNode.data('lat') || 37.5566, mapNode.data('long') || -122.3005], mapNode.data('zoom') || 11);

                map.scrollWheelZoom.disable();
                map.dragging.disable();
                map.touchZoom.disable();
                if (map.tap) {
                    map.tap.disable();
                }

                map.featureLayer.on('ready', function() {
                    this.eachLayer(function(marker) { 
                        marker.openPopup();
                    });
                });
            });
        }
    }

    function initNav() {
        var nav = $('nav'),
            menuLink = $('.menu-link');

        menuLink.on('click', function(e){
            e.preventDefault();
            nav.toggleClass('D-b');
        });
    }

    function initForms() {
        $(doc).on('submit', '.pure-form', function(e) {
            e.preventDefault();

            var form = $(this),
                data = form.serializeArray();

            data = data.reduce(function (input, item) {
                input[item.name] = item.value;
                return input;
            }, {});

            $.ajax({
                type: 'POST',
                url: form.attr('action'),
                contentType: 'application/json',
                data: JSON.stringify(data),
                headers: {
                    'X-Csrf-Token': win.csrfToken
                },
                success: function(data) {
                    $('#main').html(data);
                }
            });
        });

        $('#rsvpyes').on('change', function() {
            if ($(this).val() === 'true' ) {
                $('.pure-control-group.hide').removeClass('hide');
            }
        });
    }

    function initTimeline() {
        var didScroll = false,
            timelineblocks = $('.timeline-block');

        function showTimeline() {
            didScroll = true;
        }

        timelineblocks.each(function () {
            if(!inViewport(this)) {
                $(this).children('div').addClass('is-hidden');
            }
        });

        setInterval(function() {
            if (didScroll) {

                didScroll = false;

                timelineblocks.each(function () {
                    var cushion = getMargin(this),
                        node = $(this),
                        hasClass = node.children('div.timeline-marker').hasClass('is-hidden');

                    if (inViewport(this, cushion) && hasClass) {
                        node.children('div').removeClass('is-hidden').addClass('bounce-in');
                    }
                });
            }
        }, 100);

        $(win).on('scroll', showTimeline);
        showTimeline();
    }

    initMaps();
    initNav();
    initForms();
    initTimeline();

}(window, document, L));