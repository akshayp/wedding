/*jshint unused: false*/
/*globals window, document*/
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

function toggleClass(element, className) {
    var classes = element.className.split(/\s+/),
        length = classes.length,
        i = 0;

    for (; i < length; i++) {
        if (classes[i] === className) {
            classes.splice(i, 1);
            break;
        }
    }

    if (length === classes.length) {
        classes.push(className);
    }

    element.className = classes.join(' ');
}

var nav = doc.querySelectorAll('nav')[0],
    menuLink = doc.querySelectorAll('.menu-link')[0];

menuLink.onclick = function (e) {
    e.preventDefault();
    toggleClass(nav, 'show');
};