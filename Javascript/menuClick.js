var clicked = false;

window.onload = function () {
    document.getElementById('dropbtn').onclick = function () {
        if(clicked){
            document.getElementById("dropdown-content").style.display = "none";
            clicked=false;
        }else{
            document.getElementById("dropdown-content").style.display = "block";
            clicked=true;
        }
        
    }
};