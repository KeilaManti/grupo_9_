let card1 = document.getElementById("card1")
let card2 = document.getElementById("card2")

function openCard1() {
    card1.classList.add("active")
    card2.classList.remove("active")
}
function openCard2() {
    card1.classList.remove("active")
    card2.classList.add("active")
}