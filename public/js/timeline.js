/*globals window, document, arrayify, hasClass, getMargin, inViewport*/
(function (window, document) {

    var didScroll = false;
    var timelineblocks = arrayify(document.querySelectorAll('.timeline-block'));

    function showTimeline() {
        didScroll = true;
    }

    timelineblocks.forEach(function (node) {
        if(!inViewport(node)) {
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
            var cushion = getMargin(node);

            if (inViewport(node, cushion) && hasClass(node.querySelectorAll('.timeline-marker')[0], 'is-hidden')) {

                var hideEls = arrayify(node.querySelectorAll('.timeline-marker, .timeline-content'));
                hideEls.forEach(function (el) {
                    el.className = el.className.replace(/\bis-hidden\b/gi, '');
                    el.className += ' bounce-in';
                });
            }
        });
        }
    }, 100);

    window.onscroll = showTimeline;

    showTimeline();

}(window, document));
