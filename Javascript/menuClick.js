var clicked = false;

window.onload = function () {
    
    document.getElementById('dropbtn').onclick = function () {
        
        //If the menu button has already been clicked, hide the menu. Otherwise display it.
    
        if(clicked){
            document.getElementById("dropdown-content").style.display = "none";
            document.getElementById("dropbtn").style.boxShadow = "0 1px 0px rgba(255,255,255,0.1) inset, 0 0px 1px rgba(0,0,0,0.7)";
            clicked=false;
        }else{
            document.getElementById("dropdown-content").style.display = "block";
            document.getElementById("dropbtn").style.boxShadow = "0 0 0 transparent inset";
            clicked=true;
        }
    }
    
    //hide menu on outside click if it is displayed
    document.addEventListener("click",checkElement)
    
}

function checkElement(e){
    
    //keep menu up unless there is a click outdside of the menu items
    
    if(document.getElementById("dropbtn")!=e.target && document.getElementById("dropdown-item-1")!=e.target 
        && document.getElementById("dropdown-item-2")!=e.target && document.getElementById("dropdown-item-3")!=e.target){
        if(clicked){
            document.getElementById("dropdown-content").style.display = "none";
            document.getElementById("dropbtn").style.boxShadow = "0 1px 0px rgba(255,255,255,0.1) inset, 0 0px 1px rgba(0,0,0,0.7)";
            clicked=false;
        }
    }
    
}