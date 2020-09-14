$(window).on('load', function () {
    console.log("loaded");
    getUser();
    getUserAvatar();
    getMatches();
    $('[data-toggle="tooltip"]').tooltip();
});
