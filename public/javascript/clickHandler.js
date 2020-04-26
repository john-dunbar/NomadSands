$("#createMatch").click(function (event) {

    requestMatchInsert();

});

$("#mainMenuCreateMatch").click(function (event) {

    formatDateTime();

    getUserOwnedGuilds();

});

$("button").on("click", updateRedirect(event));

function updateRedirect(event) {

    console.log(event.target.id);

    alert("clicked");

}
