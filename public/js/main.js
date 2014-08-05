/*jshint unused: false*/
/*globals window, document*/
function scrollTop() {
    return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
}

function offset(el) {
    var box = el.getBoundingClientRect();

    return box.top + window.pageYOffset;
}

function arrayify(nodelist) {
    return [].slice.call(nodelist);
}

function hasClass(el, cls) {
    var re = new RegExp(cls, 'gi');
    return el.className.search(re) !== -1;
}