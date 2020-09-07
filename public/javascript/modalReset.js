//reset input fields on close of modal
$('.modal').on('hidden.bs.modal', function () {
    $('#formInputs')[0].reset();
    //prevent same discord servers from being appended to the server list each time the modal opens.
    $('#userDiscordServers').children().remove();
});
