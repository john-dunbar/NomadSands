function getUserOwnedGuilds() {
    console.log("getting guilds browser");
    $.ajax({
        url: "/getUserGuilds",
        method: "GET",
        success: function (data) {
            console.log("getting guilds success!")
            if (data.length === 0) {
                let dropDownItem = "<button class=\"dropdown-item\" type=\"button\"> Please create a Discord server </button>";
                $('#userDiscordServers').append(dropDownItem);
            } else {
                for (let i = 0; i < data.length; i++) {
                    let dropDownItem = "<button class=\"dropdown-item\" type=\"button\" id=\"userGuildSelect" + i + "\">" + data[i].name + "</button>";
                    $('#userDiscordServers').append(dropDownItem);
                    let hiddenDiscordID = "<input type=\"text\" id=" + data[i].name + " value=" + data[i].id + " hidden>";
                    $('#userDiscordServers').append(hiddenDiscordID);
                }
            }
        }
    });
}
