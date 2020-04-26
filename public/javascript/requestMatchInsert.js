//create match code
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


    var formData = new FormData();


    formData.append("gameName", gameName);
    formData.append('maxPlayers', maxPlayers);
    formData.append('matchTitle', matchTitle);
    formData.append('matchDate', matchDate);
    formData.append('matchTime', matchTime);

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
