$("#createMatch").click(function (event) {

    requestMatchInsert();

});

$("#mainMenuCreateMatch").click(function (event) {

    formatDateTime();

    getUserOwnedGuilds();

});

$("#userGuildSelect").click(function (event) {

    requestMatchInsert();

});
