/*globals $, L*/
(function ($, L) {

    var maps = $('[data-map]');

    L.mapbox.accessToken = 'pk.eyJ1IjoiYWtzaGF5cCIsImEiOiJ0ZGhBcVJVIn0.Dky1r5eel-SHJAq8UoLnuw';

    if(maps) {

        maps.each(function () {
            var mapNode = $(this);

            var map = L.mapbox.map(mapNode.attr('id'), mapNode.data('map'), {
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

}($, L));
