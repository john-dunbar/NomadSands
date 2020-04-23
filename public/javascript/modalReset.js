//reset input fields on close of modal
$('.modal').on('hidden.bs.modal', function () {
    $('#formInputs')[0].reset();
});
