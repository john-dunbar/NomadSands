//create match code
function botAuth() {

    var discordServerName = $('#dropdownMenu').text();

    var targetElementID = "[id='" + discordServerName + "ID']";
    var discordServerID = $(targetElementID).val();

    $.ajax({
        url: "/discordBotAuth",
        method: "GET",
        data: discordServerID, // request is the value of search input
        success: function (data) {
            // Map response values to fiedl label and value
            console.log(data[0]);
            requestMatchInsert();

        }
    });
}

function requestMatchInsert() {

    var gameName = $('#gameName').val();
    if (gameName == '') {
        gameName = $('#gameName').attr('placeholder');
    }

    var maxPlayers = $('#maxPlayers').val();
    if (maxPlayers == '') {
        maxPlayers = $('#maxPlayers').attr('placeholder');
    }

    var matchTitle = $('#matchTitle').val();
    if (matchTitle == '') {
        matchTitle = $('#matchTitle').attr('placeholder');
    }

    var matchDate = $('#matchDate').val();
    if (matchDate == '') {
        matchDate = $('#matchDate').attr('placeholder');
    }

    var matchTime = $('#matchTime').val();
    if (matchTime == '') {
        matchTime = $('#matchTime').attr('placeholder');
    }

    var discordServerName = $('#dropdownMenu').text();

    //have to use jquery attribute slector due to white space in
    //dynamically created id's
    var targetElementID = "[id='" + discordServerName + "ID']";
    var discordServerID = $(targetElementID).val();

    console.log("attempted to jquery: " + targetElementID);
    console.log("server id: " + discordServerID);

    var formData = new FormData();


    formData.append("gameName", gameName);
    formData.append('maxPlayers', maxPlayers);
    formData.append('matchTitle', matchTitle);
    formData.append('matchDate', matchDate);
    formData.append('matchTime', matchTime);
    formData.append('discordServerID', discordServerID);

    var matchThumbnail = "";

    if ($('#matchThumbnail').attr('src').includes('http')) {

        matchThumbnail = $('#matchThumbnail').attr('src');
        formData.append("matchThumbnail", matchThumbnail);

        $.ajax({
            url: "/newMatch",
            method: "POST",
            data: formData,
            processData: false, // Important!
            contentType: false,
            cache: false,
            success: function (data) {
                console.log(data.ops[0]);
                pageAppendMatchInfo(data.ops[0]);
                window.location.href = "/discordBotAuth";
            }
        });


    } else {
        matchThumbnail = $('#customFile')[0].files[0];
        console.log($('#customFile')[0].files[0]);
        formData.append("matchThumbnail", matchThumbnail);

        $.ajax({
            url: "/newMatchWithThumbnail",
            method: "POST",
            data: formData,
            processData: false, // Important!
            contentType: false,
            cache: false,
            success: function (data) {
                insertMatchInfo(data.ops[0]);

            }
        });

    }
}
