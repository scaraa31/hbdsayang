/* PAGE SLIDE SYSTEM */

const buttons = document.querySelectorAll(".btn");

buttons.forEach(button => {

button.addEventListener("click", () => {

const nextPageId = button.getAttribute("data-next");

if(!nextPageId) return;

const currentPage = button.closest(".page");
const nextPage = document.getElementById(nextPageId);

currentPage.classList.remove("active");
nextPage.classList.add("active");

});

});



/* MINI GAME : FIND THE HIDDEN HEARTS */

let found = 0;
const hearts = document.querySelectorAll(".hidden-heart");
const score = document.getElementById("found");

hearts.forEach(heart => {

heart.addEventListener("click", () => {

if(heart.classList.contains("found")) return;

heart.classList.add("found");

found++;

score.textContent = found;

});

});



/* GIFT BOX */

const gift = document.getElementById("giftBox");
const giftMessage = document.getElementById("giftMessage");

if(gift){

gift.addEventListener("click", () => {

gift.style.transform = "scale(1.2) rotate(10deg)";
giftMessage.classList.remove("hidden");

});

}