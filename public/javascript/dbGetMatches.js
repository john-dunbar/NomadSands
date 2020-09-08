//load the matches from database
function getMatches() {
    $.ajax({
        url: "/allMatches",
        method: "GET",
        success: function (data) {

            var userName = data[0];
            var matches = data[1];

            for (var key in matches) {
                var obj = matches[key];
                pageAppendMatchInfo(userName, obj);
            }
        }
    });
}

function pageAppendMatchInfo(user, matchRecord) {
    console.log("record found. id is " + matchRecord._id);

    var joinButton = "";

    if (matchRecord.matchOrganizer == user) {
        joinButton = "<button type=\"button\" class=\"btn btn-danger btn-sm\" id=\"deleteMatch\">Delete</button>"
    } else {
        joinButton = "<button type=\"button\" class=\"btn btn-primary btn-sm\" id=\"joinMatch\">Join</button>";
    }

    let profileImgURL = "";

    if (!matchRecord.organizerAvatar) {
        profileImgURL = "img/profileAvatar.svg";
    } else {
        profileImgURL = "https://cdn.discordapp.com/avatars/" + matchRecord.organizerUserId + "/" + matchRecord.organizerAvatar + ".png";
    }

    if (matchRecord.gameName) {
        var matchCard =
            "<div class=\"col-12 col-md-3\">" +
            "<div class=\"card pt-3 mt-3\">" +

            "<img src=\"" + matchRecord.matchThumbnail + "\" class=\"card-img-top\" alt=\"uploads/altImg.png\" style=\"width:104px;height:142px; margin:auto;\">" +

            "<div class=\"card-body\">" +
            "<div class=\"container\">" +

            "<div class=\"row justify-content-left\">" +
            "<div class=\"col\">" +

            "<h5 class=\"card-title\">" +
            matchRecord.matchTitle + "</h5>" +

            "</div>" +
            "</div>" +

            "<div class=\"row justify-content-left\">" +
            "<div class=\"col\">" +

            "<p class=\"card-text\">" + matchRecord.gameName + "</p>" +

            "</div>" +
            "</div>" +

            "<div class=\"row justify-content-left\">" +
            "<div class=\"col\">" +

            "<p class=\"card-text\">Creator: " +

            "</div>" +
            "<div class=\"col\">" +

            "<img class=userImg src=\"" + profileImgURL + "\"" + " style=\"margin-left:10px; margin-right:5px; width:32px; height:32px;\">" +
            matchRecord.matchOrganizer + "</p>" +

            "</div>" +
            "</div>" +

            "<div class=\"row justify-content-left\">" +
            "<div class=\"col\">" +

            "<p class=\"card-text\">" + matchRecord.playerCount + "/" + matchRecord.maxPlayers + " players</p>" +

            "</div>" +
            "</div>" +

            "<div class=\"row justify-content-left\">" +
            "<div class=\"col\">" +

            "<p class=\"card-text\">" + matchRecord.matchDate + "</p>" +

            "</div>" +
            "</div>" +

            "<div class=\"row justify-content-left\">" +
            "<div class=\"col\">" +

            "<p class=\"card-text\">" + matchRecord.matchTime + "</p>" +

            "</div>" +
            "</div>" +

            "<div class=\"row justify-content-left\">" +
            "<div class=\"col\">" +

            //activate this when logged in user is same as creator
            //"<button type=\"button\" class=\"btn btn-danger btn-sm\" id=\"deleteMatch\">Delete</button>" +

            "</div>" +
            "<div class=\"col\">" +

            joinButton +

            "<input type=\"text\" id= guildId value=" + matchRecord.discordServer + " hidden>" +

            "</div>" +
            "</div>" +

            "</div>" +
            "</div>" +
            "</div>" +
            "</div>";
    }

    $('#insertMatchesHere').append(matchCard);
}

//auto complete database retreival

$(function () {
    //modal game search autocomplete

    var pic = document.getElementById("matchThumbnail");

    $("#gameName").autocomplete({
        source: function (request, response) {
            console.log("in ajax");
            $.ajax({
                url: "/autocomplete",
                method: "GET",
                data: request, // request is the value of search input
                success: function (data) {
                    // Map response values to fiedl label and value
                    console.log(data[0].box_art_url);
                    response($.map(data, function (el) {
                        return {
                            label: el.name,
                            value: el,

                        };
                    }));
                }
            });
        },

        // The minimum number of characters a user must type before a search is performed.
        minLength: 3,

        // set an onFocus event to show the result on input field when result is focused
        focus: function (event, ui) {
            this.value = ui.item.label;
            // Prevent other event from not being executed
            event.preventDefault();
        },
        select: function (event, ui) {
            // Prevent value from being put in the input:
            this.value = ui.item.label;
            // Set the id to the next input hidden field
            $(this).next("input").val(ui.item.value);
            // Prevent other event from not being execute            
            event.preventDefault();

            pic.src = ui.item.value.box_art_url.replace('-{width}x{height}', '');
        }
    });

});
