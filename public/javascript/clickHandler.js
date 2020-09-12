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

            $("#selectDiscordServerAlert").collapse('hide');

        }

    }

    //deleteMatch and joinMatch use .on() because they are loaded those elements were injected into DOM

    $(document).on('click', '#deleteMatch', function () {
        console.log("delete button clicked!");
        var matchId = $(this).parent().parent().parent().parent().parent().parent().attr("id");
        console.log(matchId);
        $.ajax({
            url: "/deleteMatch",
            method: "POST",
            data: {
                "matchId": matchId
            }, // request is the value of search input
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
        //window.open("https://www.w3schools.com"); 
        //after clicking, check that user has been added to group before changing label to "leave"
        console.log("join button clicked!");
        var guildId = $(this).next().val();
        console.log("guildId = " + guildId);
        var formData = new FormData();
        formData.append("guildId", guildId);
        $.ajax({
            url: "/joinMatch",
            method: "POST",
            data: {
                "guildId": guildId
            }, // request is the value of search input
            success: function (inviteLink) {
                console.log("invite link is: " + inviteLink);
                window.open(inviteLink);

            },
            async: false //to prevent popup blocker caused by window.open
        });
        console.log("back from index.js");
    });


});
