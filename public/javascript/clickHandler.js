$("#createMatch").click(function (event) {

    requestMatchInsert();

});

$("#mainMenuCreateMatch").click(function (event) {

    formatDateTime();

    getUserOwnedGuilds();

});

$("button").on("click", $(this).event, updateRedirect);

function updateRedirect(event) {

    console.log(event.target.id);
    if (event.target.id.includes("userGuildSelect")) {

        console.log(event.target.value);

    }

}
