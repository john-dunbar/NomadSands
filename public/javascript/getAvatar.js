function getUserAvatar() {

    $.ajax({
        url: "/getUserAvatar",
        method: "GET",
        success: (data) => {
            console.log("here's what i got " + data);
            if (data.includes("undefined")) {

                $('#userAvatar').attr('src', 'img/profileAvatar.svg');

            } else {
                console.log("here's what i got " + data);

                $('#userAvatar').attr('src', data);

            }
        }
    });
}
