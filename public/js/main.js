/*jshint unused: false*/
/*globals window, document, XMLHttpRequest, $*/
var win = window,
    doc = document,
    docEl = document.documentElement;

function arrayify(nodelist) {
    return [].slice.call(nodelist);
}

function hasClass(el, cls) {
    var re = new RegExp(cls, 'gi');
    return el.className.search(re) !== -1;
}

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

var nav = $('nav'),
    menuLink = $('.menu-link');

menuLink.on('click', function(e){
    e.preventDefault();
    nav.toggleClass('D-b');
});

$(document).on('submit', '.pure-form', function(e) {
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