$(document).ready(function () {

    $("#createMatch").click(function (event) {

        if ($('#dropdownMenu').text() === "Choose Discord Server") {

            $("#selectDiscordServerAlert").collapse('show');

        } else {

            $("#myForm").modal('hide');

            requestMatchInsert();

        }

    });

    $("#mainMenuCreateMatch").click(function (event) {

        formatDateTime();

        getUserOwnedGuilds();

    });

    //this part below took a few hours to figure out
    //should be $(parent element).on(click, dynamically generated child element, event params, function call)

    $("#userDiscordServers").on("click", ".dropdown-item", $(this).event, updateRedirect);

    function updateRedirect(event) {

        if (event.target.id.includes("userGuildSelect")) {

            $("#dropdownMenu").html(event.target.innerText);

            var discordServerName = $('#dropdownMenu').text();

            var targetElementID = "[id='" + discordServerName + "BotMember']";

            var botIsMember = $(targetElementID).val();
            console.log("memeber? " + botIsMember);
            if (!botIsMember) {
                $("#addBot").removeClass('d-none');
            } else {
                $("#addBot").addClass('d-none');
            }

            $("#selectDiscordServerAlert").collapse('hide');

        }

    }

    //addBot, deleteMatch, and joinMatch use .on() because they are loaded those elements were injected into DOM

    $(document).on('click', '#addBot', function () {
        var guildId = $(this).next().val();
        var formData = new FormData();
        formData.append("guildId", guildId);
        $.ajax({
            url: "/joinMatch",
            method: "POST",
            data: {
                "guildId": guildId
            },
            success: function (inviteLink) {
                window.open(inviteLink);

            },
            async: false //to prevent popup blocker caused by window.open
        });
    });

    $(document).on('click', '#deleteMatch', function () {
        console.log("delete button clicked!");
        var matchId = $(this).parent().parent().parent().parent().parent().parent().attr("id");
        $.ajax({
            url: "/deleteMatch",
            method: "POST",
            data: {
                "matchId": matchId
            },
            success: function (matchDeleted) {

                if (matchDeleted) {
                    console.log("success " + matchDeleted);
                    $("#" + matchId).remove();
                }

            },
        });

    });

    $(document).on('click', '#joinMatch', function () {
        //later if it's possible to make an invite link, do all this in the requestMatchInsert flow
        //after clicking, check that user has been added to group before changing label to "leave"
        var guildId = $(this).next().val();
        var formData = new FormData();
        formData.append("guildId", guildId);
        $.ajax({
            url: "/joinMatch",
            method: "POST",
            data: {
                "guildId": guildId
            },
            success: function (inviteLink) {
                window.open(inviteLink);

            },
            async: false //to prevent popup blocker caused by window.open
        });
    });


});
