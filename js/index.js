$(document).ready(function () {

    function pickRandomSentence(text) {
      return text[Math.floor(Math.random()*text.length)];
    }

    $( document ).ready(function() {
        var text = Array("These healthy muffins are the perfect treat for when you are feeling something sweet. \
          It is so much better to bake muffins yourself as you can choose exactly what you put in them, \
          meaning you can stay away from refined sugars and preservatives! These are perfect for bringing \
          to a brunch or just sharing with your friends.","Paul Revere and The New Style had been released \
          as singles. Both did well; they built on the success \
          of Hold It Now, Hit It. By early February 1987, \
          the LP had gone platinum. DJ Run had been proven correct. This seemed incredibly fast; \
          we were barely out of high school. Being small-time celebrities in our little NYC nightclub world\
           had been fun; getting a chance to make records was incredible.","Tyler, The Creator is making \
           a limited edition release of ice cream. The flavor is called Snowflake,\
            and will consist of cool peppermint, warm spearmint, a dash of sea salt, crunchy white chocolate\
             flakes, and white chocolate melted within the scoops. Tyler said: \
             For as long as I can remember, mint ice cream seemed to always come with every chocolate chip but white. \
             I finally got the two away from their clingy friends and set up a play date for my mouth.","Around \
             1981 they had begun producing home-made movies on Super-8 cine film, \
             and were creating the films’ soundtracks themselves. By 1984, aged thirteen, Mike was already \
             visiting a local recording studio and making rough demos. Mike and Marcus were by now producing \
             more structured songs with any instruments they could lay their hands on, as well as completely \
             abstract tape collages of found sounds from radio and TV.","Unrewarding day-jobs funded the \
             purchase of audio gear and a variety of exotic acoustic musical instruments, and with the \
             acquisition of samplers the band began producing do-it-yourself garage demos on their own \
             label Music70 which they distributed mainly amongst friends. Soon the band was producing \
             cassette EP's and even entire albums of demo material, some of which have since gone on to \
             become legendary collectors' items.","His tracks blend fractured breakbeats with mysterious, \
             pitch-shifted voices and loads of vinyl crackle, rainfall, and submerged video game sound effects, \
             creating gloomy, dystopian soundscapes evoking lonely nights spent wandering around an empty, \
             desolate city. Not only was it one of the most widely praised albums of the year, but its influence \
             endured throughout the following decade, with countless producers emulating its vocal manipulations\
              and dramatic, rain-soaked atmospherics.");
        var tracklist = JSON.parse(localStorage.getItem("tracklist")) || 'defaultValue';
        if (tracklist !== "defaultValue" ) createTracklist(tracklist);
        //console.log( tracklist );
        //setInterval( function() { saveState(); }, 3000 );
        $('#anchorText').text(pickRandomSentence(text));
        saveState();
        setInterval(saveState, 3000);
    });
    $(document).on('click', '.recipe-table__add-row-btn', function (e) {
        var $el = $(e.currentTarget);
        var $tableBody = $('#recipeTableBody');
        var htmlString = $('#rowTemplate').html();
        $tableBody.append(htmlString);
        return false;
    });

    $(document).on('click', '.recipe-table__del-row-btn', function (e) {
        var $el = $(e.currentTarget);
        var $row = $el.closest('tr');
        if (($('#recipeTableBody').children().length) >= 2) {
            $row.remove();
        }
        saveState();
        return false;
    });

    var TrackList = new Array();

    $(document).on('click', '.recipe-table__export-file-btn', function (e) {
      saveState(e);
      exportTracklist();
    });

    $(document).on('click', '.recipe-table__clear-btn', function (e) {
      localStorage.setItem("tracklist", '""');
      location.reload();
    });

    function saveState() {
      //var $el = $(e.currentTarget);
      var $tableBody = $('#recipeTableBody');
      var i=0;
      $('#recipeTableBody tr').each(function() {
          var $artist = "";
          var $song = "";
          var $album = "";
          var $label = "";
          var $year = "";
          $(this).closest('tr').find("input").each(function() {
              if (this.value !== ""){
                  if ($(this).attr('id') == "artist") {
                      $artist = this.value;
                  }
                  else if ($(this).attr('id') == "song") {
                      $song = this.value;
                  }
                  else if ($(this).attr('id') == "album") {
                      $album = this.value;
                  }
                  if ($(this).attr('id') == "label") {
                      $label = this.value;
                  }
                  if ($(this).attr('id') == "year") {
                      $year = this.value;
                  }
              }
          });

          TrackList[i]={
              "artist" : $artist, 
              "song" :$song, 
              "album" :$album, 
              "label" : $label, 
              "year" : $year
          }

          i++;

      });
      localStorage.setItem("tracklist", JSON.stringify(TrackList));
      //console.log(TrackList);
    }

    function exportTracklist() {
      var $line = "";
      var $text = "";

      TrackList.forEach(function(track) {
        if (track.song || track.album || track.artist || track.label || track.year ) {
          $line = track.artist;
          if (track.song || track.album || track.artist) {
            if (track.song && !track.artist && !track.album) $line += track.song;
            else if (!track.song && track.artist && !track.album) {}
            else if (!track.song && !track.artist && track.album) $line += track.album;
            else {
              if (track.song && track.artist && !track.album) $line = $line + " - " + track.song;
              else if (track.song && !track.artist && track.album) $line += track.song + " - " + track.album;
              else if (!track.song && track.artist && track.album) $line = $line + " - " + track.artist;
              else { 
                if (track.artist && !track.song) $line += track.song;
                else $line = $line + " - " + track.song
                if (track.album && !track.song) $line += track.album;
                else $line = $line + " - " + track.album;
              }
            }
          }
          if (track.label || track.year) {
            $line += " (";
            if (track.label && !track.year) $line += track.label;
            else if (!track.label && track.year) $line += track.year;
            else {
              if (track.label) $line += track.label;
              if (track.year) $line = $line + ", " + track.year;
            }
            $line += ")";
          }
          $line = $line.trim();
          $line += "\n";
          $text += $line;
        }
      });
      $text = $text.replace(/\n$/, "");
      console.log($text);
      copyTextToClipboard($text);
    }

    function createTracklist(tracklist) {

        var find = ["artist\" value=\"", "song\" value=\"","album\" value=\"", "label\" value=\"","year\" value=\""];
        var isTracklistEmpty = true;
        
        tracklist.forEach(function(track) {

            if (track.song || track.album || track.artist || track.label || track.year ) {
                isTracklistEmpty = false;

                var $tableBody = $('#recipeTableBody');
                var replace = ["artist\" value=\"" + track.artist, "song\" value=\"" + track.song, "album\" value=\"" + track.album, "label\" value=\"" + track.label, "year\" value=\"" + track.year];
                var htmlString = $('#rowTemplate').html().replaceArray(find, replace);

                $tableBody.append(htmlString);
            }
        });
        if (!isTracklistEmpty) $("#recipeTableBody tr:first-child").remove();
    }

    Sortable.create(
        $('#recipeTableBody')[0],
        {
            animation: 150,
            scroll: true,
            handle: '.drag-handler',
            onEnd: function () {
                console.log('More see in https://github.com/RubaXa/Sortable');
            }
        }
    );

    String.prototype.replaceArray = function(find, replace) {
      var replaceString = this;
      for (var i = 0; i < find.length; i++) {
        replaceString = replaceString.replace(find[i], replace[i]);
      }
      return replaceString;
    };


    function copyTextToClipboard(text) {
        var textArea = document.createElement("textarea");

        // Place in top-left corner of screen regardless of scroll position.
        textArea.style.position = 'fixed';
        textArea.style.top = 0;
        textArea.style.left = 0;

        // Ensure it has a small width and height. Setting to 1px / 1em
        // doesn't work as this gives a negative w/h on some browsers.
        textArea.style.width = '2em';
        textArea.style.height = '2em';

        // We don't need padding, reducing the size if it does flash render.
        textArea.style.padding = 0;

        // Clean up any borders.
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';

        // Avoid flash of white box if rendered for any reason.
        textArea.style.background = 'transparent';

        textArea.value = text;

        document.body.appendChild(textArea);

        textArea.select();

        try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
        } catch (err) {
        console.log('Oops, unable to copy');
        }

        document.body.removeChild(textArea);
    }

});