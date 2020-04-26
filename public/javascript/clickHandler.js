$("#createMatch").click(function (event) {

    requestMatchInsert();

});

$("#mainMenuCreateMatch").click(function (event) {

    formatDateTime();

    getUserOwnedGuilds();

});

function updateRedirect() {

    console.log("clicked");

    alert("clicked");

}

$("#userGuildSelect").on("click", updateRedirect);
