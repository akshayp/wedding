/*jshint unused: false*/
/*globals window, document, XMLHttpRequest*/
var win = window,
    doc = document,
    docEl = document.documentElement;

function ajax(url, data, success, failure) {
    var http = new XMLHttpRequest();

    http.addEventListener('load', success, false);
    http.addEventListener('error', failure, false);
    http.addEventListener('abort', failure, false);

    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    http.setRequestHeader('X-Csrf-Token', win.csrfToken);

    http.send(data);
}

function formify(form) {
    if (!form || form.nodeName !== 'FORM') {
        return;
    }

    var i, j, data = {};

    for (i = form.elements.length - 1; i >= 0; i = i - 1) {
        if (form.elements[i].name === '') {
            continue;
        }
        switch (form.elements[i].nodeName) {
            case 'INPUT':
                switch (form.elements[i].type) {
                    case 'text':
                    case 'email':
                    case 'hidden':
                    case 'password':
                    case 'button':
                    case 'reset':
                    case 'submit':
                        data[form.elements[i].name] = form.elements[i].value;
                        break;
                    case 'checkbox':
                    case 'radio':
                        if (form.elements[i].checked) {
                            data[form.elements[i].name] = form.elements[i].value;
                        }
                        break;
                }
                break;
            case 'TEXTAREA':
                data[form.elements[i].name] = form.elements[i].value;
                break;
            case 'BUTTON':
                switch (form.elements[i].type) {
                    case 'reset':
                    case 'submit':
                    case 'button':
                        data[form.elements[i].name] = form.elements[i].value;
                        break;
                }
                break;
        }
    }

    return JSON.stringify(data);
}

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
    menuLink = doc.querySelectorAll('.menu-link')[0],
    form = doc.querySelectorAll('.pure-form')[0];

menuLink.addEventListener('click', function(e) {
    e.preventDefault();
    toggleClass(nav, 'D-b');
});

if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var formData = formify(this);

        ajax(form.action, formData, function(err, data) {
            console.log(err);
            console.log(data);
        });
    });
}