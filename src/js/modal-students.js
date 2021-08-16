const modalStudents = document.querySelector("#modal");
const modalOverlay = document.querySelector("#modal-overlay");
const closeBtn = document.querySelector("#close-button");
const openBtn = document.querySelector("#open-button");

openBtn.addEventListener("click", onOpenBtnClick);

closeBtn.addEventListener("click", onCloseBtnClick);

function onOpenBtnClick() {
    modalStudents.classList.toggle("is-hidden");
    document.body.style.overflow = "hidden";
    modalOverlay.classList.toggle("is-hidden");
}

function onCloseBtnClick(){
    modalStudents.classList.toggle("is-hidden");
    document.body.style.overflow = "visible";
    modalOverlay.classList.toggle("is-hidden");
}

