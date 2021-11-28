window.onscroll = function() {scrollFunction()};

let navName = document.querySelectorAll(".nav__name")

function scrollFunction() {
  if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 20) {
    document.getElementById("navbar").style.background = "rgba(255,255,255,1)";
    document.querySelector(".boton-search").style.color = "#000";
    document.querySelector(".fa-user").style.color = "#000";

    for (let i = 0; i < navName.length; i++){
        navName[i].style.color = "#000"
    }

  } else {
    document.getElementById("navbar").style.background = "rgba(255,255,255,0)";
    document.querySelector(".boton-search").style.color = "#fff";
    document.querySelector(".fa-user").style.color = "#fff";
    document.querySelector(".btn-search").style.color = "#fff";

    for (let i = 0; i < navName.length; i++){
        navName[i].style.color = "#fff"
    }
  }
}