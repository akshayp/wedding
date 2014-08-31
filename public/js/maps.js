/*globals document, arrayify, L*/
(function (document) {

    var maps = arrayify(document.querySelectorAll('[data-map]'));

    L.mapbox.accessToken = 'pk.eyJ1IjoiYWtzaGF5cCIsImEiOiJ0ZGhBcVJVIn0.Dky1r5eel-SHJAq8UoLnuw';

    if(maps) {
        maps.forEach(function (mapNode) {
            var map = L.mapbox.map(mapNode.id, mapNode.getAttribute('data-map'), {
                zoomControl: false
            })
            .setView([mapNode.getAttribute('data-lat') || 37.5566, mapNode.getAttribute('data-long') || -122.3005],mapNode.getAttribute('data-zoom') || 11);

            map.scrollWheelZoom.disable();

            map.featureLayer.on('ready', function() {
                this.eachLayer(function(marker) { 
                    marker.openPopup();
                });
            });
        });
    }

}(document));
