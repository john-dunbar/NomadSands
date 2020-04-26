$("#createMatch").click(function (event) {

    requestMatchInsert();

});

$("#mainMenuCreateMatch").click(function (event) {

    formatDateTime();

    getUserOwnedGuilds();

});

$("button").on("click", $(this).event, updateRedirect);

function updateRedirect(event) {

    if (event.target.id === "userGuildSelect") {

        console.log(event.target.id);

    }

}
