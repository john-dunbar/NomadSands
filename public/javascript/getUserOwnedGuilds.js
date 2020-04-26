function getUserOwnedGuilds() {
    $.ajax({
        url: "/getUserGuilds",
        method: "GET",
        success: function (data) {
            console.log(data);
        }
    });
}
