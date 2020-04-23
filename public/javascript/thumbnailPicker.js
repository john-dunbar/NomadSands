//handle custom image selection
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#matchThumbnail')
                .attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

$(function () {
    $('#customFile').on('change', function () {
        readURL(input);
    });
});


var input = document.getElementById('customFile');
var infoArea = document.getElementById('customFileLabel');

input.addEventListener('change', showFileName);

function showFileName(event) {
    var input = event.srcElement;
    var fileName = input.files[0].name;
    infoArea.textContent = 'File name: ' + fileName;
}
