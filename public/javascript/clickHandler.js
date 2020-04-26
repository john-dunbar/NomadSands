$("#createMatch").click(function (event) {

    requestMatchInsert();

});

$("#mainMenuCreateMatch").click(function (event) {

    formatDateTime();

    getUserOwnedGuilds();

});

//this part below took a few hours to figure out
//should be $(parent element).on(click, dynamically generated child element, event params, function call)

$("#userDiscordServers").on("click", ".dropdown-item", $(this).event, updateRedirect);

function updateRedirect(event) {

    console.log("clicked");
    console.log(event.target.id);
    if (event.target.id.includes("userGuildSelect")) {

        console.log(event.target.name);

    }

}
