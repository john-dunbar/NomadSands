function getUserOwnedGuilds() {
    console.log("getting guilds browser");
    $.ajax({
        url: "/getUserGuilds",
        method: "GET",
        success: function (data) {
            console.log("getting guilds success!")
            console.log(data[0]);
            if (data.length === 0) {
                let dropDownItem = "<button class=\"dropdown-item\" type=\"button\"> Please create a Discord server </button>";
                $('#userDiscordServers').append(dropDownItem);
            } else {
                console.log(data[0]);
                for (let i = 0; i < data.length; i++) {
                    let dropDownItem = "<button class=\"dropdown-item\" type=\"button\">" + data.name + "</button>";
                    $('#userDiscordServers').append(dropDownItem);
                }
            }
        }
    });
}
