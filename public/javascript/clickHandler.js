$("#createMatch").click(function (event) {

    requestMatchInsert();

});

$("#mainMenuCreateMatch").click(function (event) {

    formatDateTime();

    getUserOwnedGuilds();

});

//this part below took a few hours to figure out
//should be $(parent element).on(click, dynamically generated child element, event params, function call)

$("#userDiscordServers").on("click", ".dropdown-item", $(this).attr("name"), updateRedirect);

function updateRedirect(name) {

    console.log(name);

}
