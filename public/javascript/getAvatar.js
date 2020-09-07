function getUserAvatar() {

    $.ajax({
        url: "/getUserAvatar",
        method: "GET",
        success: function (data) {

            if (data.length === 0) {

                $('#userAvatar').attr('src', 'img/profileAvatar.svg');

            } else {

                $('#userAvatar').attr('src', data);

            }
        }
    });
}
