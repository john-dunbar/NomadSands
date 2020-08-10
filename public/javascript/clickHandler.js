$( document ).ready(function() {

    $("#createMatch").click(function (event) {

        if ($('#dropdownMenu').text() === "Choose Discord Server") {
    
            $("#selectDiscordServerAlert").collapse('show');
    
        } else {
    
            $("#myForm").modal('hide');
    
            requestMatchInsert();
    
        }
    
    });
    
    $("#mainMenuCreateMatch").click(function (event) {
    
        formatDateTime();
    
        getUserOwnedGuilds();
    
    });
    
    //this part below took a few hours to figure out
    //should be $(parent element).on(click, dynamically generated child element, event params, function call)
    
    $("#userDiscordServers").on("click", ".dropdown-item", $(this).event, updateRedirect);
    
    function updateRedirect(event) {
    
        if (event.target.id.includes("userGuildSelect")) {
    
            $("#dropdownMenu").html(event.target.innerText);
    
            $("#selectDiscordServerAlert").collapse('hide');
    
        }
    
    }
    
    $("#deleteMatch").click(function (event) {
        console.log("delete button clicked!");
    
    });
    
    $("#joinMatch").click(function (event) {
        //later if it's possible to make an invite link, do all this in the requestMatchInsert flow
        //window.open("https://www.w3schools.com"); 
        //after clicking, check that user has been added to group before changing label to "leave"
        console.log("join button clicked!");
        var guildId = $('#guildId').val();
        console.log("guildId = "+guildId);
        var formData = new FormData();
        formData.append("guildId", guildId);
        $.ajax({
            url: "/joinMatch",
            method: "GET",
            data: formData, // request is the value of search input
            success: function (data) {
                // Map response values to fiedl label and value
                console.log(data);
    
            }
        });
        console.log("back from index.js");
    });


});
