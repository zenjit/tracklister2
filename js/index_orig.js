$(document).ready(function () {
    $( document ).ready(function() {
        var tracklist = JSON.parse(localStorage.getItem("tracklist")) || 'defaultValue';
        if (tracklist !== "defaultValue") createTracklist(tracklist);
        console.log( tracklist );
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
        return false;
    });

    $(document).on('click', '.recipe-table__export-file-btn', function (e) {
        var $el = $(e.currentTarget);
        var $tableBody = $('#recipeTableBody');
        var $text = "";
        var i=0;
        var TableData = new Array();
        $('#recipeTableBody tr').each(function() {
            var $artist = "";
            var $song = "";
            var $album = "";
            var $label = "";
            var $year = "";
            var $line = "";
            $(this).closest('tr').find("input").each(function() {
                if (this.value == ""){
                    console.log("nothing here: " + ($(this).attr('id')));
                } else {
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

            TableData[i]={
                "artist" : $artist, 
                "song" :$song, 
                "album" :$album, 
                "label" : $label, 
                "year" : $year
            }

            i++;

            $line = $artist + " - " + $song + " - " + $album + " (" + $label + ", " + $year + ")\n";
            $text += $line;
        });

        localStorage.setItem("tracklist", JSON.stringify(TableData));

        console.log(TableData);

        console.log($text);
        copyTextToClipboard($text);
    });

    function createTracklist(tracklist) {

        var find = ["artist\" value=\"", "song\" value=\"","album\" value=\"", "label\" value=\"","year\" value=\""];
        
        tracklist.forEach(function(track) {

            var $tableBody = $('#recipeTableBody');
            var replace = ["artist\" value=\"" + track.artist, "song\" value=\"" + track.song, "album\" value=\"" + track.album, "label\" value=\"" + track.label, "year\" value=\"" + track.year];
            var htmlString = $('#rowTemplate').html().replaceArray(find, replace);

            $tableBody.append(htmlString);

        });

        $("#recipeTableBody tr:first-child").remove();
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