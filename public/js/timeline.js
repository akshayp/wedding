/*globals window, document*/
(function (window, document) {

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

    var didScroll = false;    

    var timelineblocks = arrayify(document.querySelectorAll('.timeline-block')),
        winHeight = window.innerHeight;


    timelineblocks.forEach(function (node) {
        if (offset(node) > scrollTop() + winHeight * 0.75) {
            var hideEls = arrayify(node.querySelectorAll('.timeline-marker, .timeline-content'));
            hideEls.forEach(function (el) {
                el.className += ' is-hidden';
            });
        }
    });


    setInterval(function() {
        if(didScroll) {
            didScroll = false;
            timelineblocks.forEach(function (node) {
            if (offset(node) <= scrollTop() + winHeight * 0.75 && hasClass(node.querySelectorAll('.timeline-marker')[0], 'is-hidden')) {

                var hideEls = arrayify(node.querySelectorAll('.timeline-marker, .timeline-content'));
                hideEls.forEach(function (el) {
                    el.className = el.className.replace(/\bis-hidden\b/gi, '');
                    el.className += ' bounce-in';
                });
            }
        });
        }
    }, 200);


    window.onscroll = function showTimeline() {
        didScroll = true;
    };

}(window, document));
