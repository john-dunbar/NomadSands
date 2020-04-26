$("#createMatch").click(function (event) {

    requestMatchInsert();

});

$("#mainMenuCreateMatch").click(function (event) {

    formatDateTime();

    getUserOwnedGuilds();

});

$("button").on("click", updateRedirect);

function updateRedirect() {

    console.log("clicked");

    alert("clicked");

}
