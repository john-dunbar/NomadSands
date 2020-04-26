function getUserOwnedGuilds() {
    console.log("getting guilds browser");
    $.ajax({
        url: "/getUserGuilds",
        method: "GET",
        success: function (data) {
            console.log("getting guilds success!")
            console.log(data);
        }
    });
}
