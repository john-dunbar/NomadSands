function getUserOwnedGuilds() {

    $.ajax({
        url: "/getUserGuilds",
        method: "GET",
        success: (data) => {
            if (data.length === 0) {
                let dropDownItem = "<button class=\"dropdown-item\" type=\"button\"> Please create a Discord server </button>";
                $('#userDiscordServers').append(dropDownItem);
            } else {
                for (let i = 0; i < data.length; i++) {
                    let dropDownItem = "<button class=\"dropdown-item\" type=\"button\" id=\"userGuildSelect" + i + "\">" + data[i].name + "</button>";
                    $('#userDiscordServers').append(dropDownItem);
                    let hiddenDiscordID = "<input type=\"text\" id=\"" + data[i].name + "ID\"" + " value=" + data[i].id + " hidden>";
                    let hiddenBotMember = "<input type=\"text\" id=\"" + data[i].name + "BotMember\"" + " value=" + data[i].botIsMember + " hidden>";
                    $('#userDiscordServers').append(hiddenDiscordID);
                    $('#userDiscordServers').append(hiddenBotMember);
                }
            }
        }
    });
}
