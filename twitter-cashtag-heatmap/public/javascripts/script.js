$(function() {
    var socket = io.connect(window.location.hostname);
    socket.on('data', function(data) {
        var total = data.total;
        for (var key in data.symbols) {
            var val = data.symbols[key] / total;
            if (isNaN(val)) {
                val = 0;
            }
            
            $('li[data-symbol="' + key + '"]').each(function() {
                $(this).css('background-color', 'rgb(' + Math.round(val * 255) +',0,0)');
            });
        }
        $('#last-update').text(new Date().toTimeString());
    });

    $('a').click(function(){
        $('html, body, main').animate({
            scrollTop: $( $.attr(this, 'href') ).offset().top
        }, 400, "swing");
        $("#load-overlay").delay(500).fadeToggle(900, "swing");
        $("#back-top").toggle("800");
        return false;
    });  

    function loadLocationData(array){
        var data = [];
        for (var i in array){
            console.log(array[i][0], array[i][1]);
            data.push(new google.maps.LatLng(array[i][0], array[i][1]));
        }

        return data;
    }

    

    function initialize() {

      var heatmapData = loadLocationData([[37.782, -122.447], 
        [37.782, -122.445], 
        [37.782, -122.443], 
        [37.782, -122.441], 
        [37.782, -122.439],
        [37.785, -122.447], 
        [37.785, -122.443], 
        [37.785, -122.441], 
        [37.785, -122.437]
        ]);

      var mapOptions = {
        center: { lat: 37.782, lng: -122.447},
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(document.getElementById('map-canvas'),
          mapOptions);

      var heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData
      });
      heatmap.setMap(map);
    }
    google.maps.event.addDomListener(window, 'load', initialize);
})
