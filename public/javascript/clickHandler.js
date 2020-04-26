$("#createMatch").click(function (event) {

    requestMatchInsert();

});

$("#mainMenuCreateMatch").click(function (event) {

    formatDateTime();

    getUserOwnedGuilds();

});

$("#userGuildSelect").on("click", updateRedirect);

function updateRedirect() {

    console.log("clicked");

    alert("clicked");

}
