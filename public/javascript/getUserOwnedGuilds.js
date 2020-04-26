function getUserOwnedGuilds() {
    console.log("getting guilds browser");
    $.ajax({
        url: "/getUserGuilds",
        method: "GET",
        success: function (data) {
            console.log("getting guilds success!")
            if (data.length === 0) {
                let dropDownItem = "<button class=\"dropdown-item\" type=\"button\">" + Please create a Discord server + "</button>";
                $('#userDiscordServers').append(dropDownItem);
            }
        }
    });
}
