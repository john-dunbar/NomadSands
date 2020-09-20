$(document).ready(() => {

    $("#searchForm").on('submit', (event) => {
        event.preventDefault();
        $("#insertMatchesHere").empty();

        $.ajax({
            url: "/findMatches",
            method: "GET",
            data: {
                "searchParm": $("#searchInput").val()
            },
            success: (data) => {
                let userName = data[0];
                let matches = data[1];
                for (var key in matches) {
                    let obj = matches[key];
                    pageAppendMatchInfo(userName, obj);
                }
                $("#searchInput").val("");
            },
        });

    });

    $("#createMatch").click((event) => {
        if ($('#dropdownMenu').text() === "Choose Discord Server") {
            $("#selectDiscordServerAlert").collapse('show');
        } else {
            $("#myForm").modal('hide');
            requestMatchInsert();
        }
    });

    $("#mainMenuCreateMatch").click((event) => {
        formatDateTime();
        getUserOwnedGuilds();
    });

    //this part below took a few hours to figure out
    //should be $(parent element).on(click, dynamically generated child element, event params, function call)

    $("#userDiscordServers").on("click", ".dropdown-item", $(this).event, updateRedirect);

    function updateRedirect(event) {

        if (event.target.id.includes("userGuildSelect")) {
            $("#dropdownMenu").html(event.target.innerText);
            let discordServerName = $('#dropdownMenu').text();
            let targetElementID = "[id='" + discordServerName.replace("'", "\\'") + "BotMember']";
            let botIsMember = $(targetElementID).val();
            if (botIsMember == "false") {
                $("#addBot").removeClass('d-none');
            } else {
                $("#addBot").addClass('d-none');
            }
            $("#selectDiscordServerAlert").collapse('hide');

        }

    }

    //addBot, deleteMatch, and joinMatch use .on() because they are loaded those elements were injected into DOM

    $(document).on('click', '#addBot', () => {
        let discordServerName = $('#dropdownMenu').text();

        /*have to use jquery attribute slector due to white space in
        dynamically created id's*/

        let targetElementID = "[id='" + discordServerName.replace("'", "\\'") + "ID']";
        let discordServerID = $(targetElementID).val();
        window.location.href = "/discordBotAuth?guildID=" + discordServerID;
    });

    $(document).on('click', '#deleteMatch', () => {
        console.log("deleting match");
        var matchId = $(this).parent().parent().parent().parent().parent().parent().attr("id");
        console.log("deleting " + matchId);
        $.ajax({
            url: "/deleteMatch",
            method: "POST",
            data: {
                "matchId": matchId
            },
            success: (matchDeleted) => {
                if (matchDeleted) {
                    $("#" + matchId).remove();
                }
            },
        });

    });

    $(document).on('click', '#joinMatch', () => {

        console.log("joining match");

        /*later if it's possible to make an invite link, do all this in the requestMatchInsert flow
        after clicking, check that user has been added to group before changing label to "leave"*/

        let guildId = $(this).next().val();
        let formData = new FormData();
        formData.append("guildId", guildId);
        $.ajax({
            url: "/joinMatch",
            method: "POST",
            data: {
                "guildId": guildId
            },
            success: (inviteLink) => {
                window.open(inviteLink);
            },
            async: false //to prevent popup blocker caused by window.open
        });
    });


});
