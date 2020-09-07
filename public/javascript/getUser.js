function getUser() {

    $.ajax({
        url: "/getUser",
        method: "GET",
        success: function (data) {

            if (data.length === 0) {

                $('#userName').text("Menu");

            } else {

                $('#userName').text(data);

            }
        }
    });
}
