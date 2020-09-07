$(window).on('load', function () {
    getUser();
});

function getUser() {

    $.ajax({
        url: "/getUser",
        method: "GET",
        success: function (data) {

            if (data.length === 0) {

                $('#userName').text("User Name");

            } else {

                $('#userName').text(data);

            }
        }
    });
}
