const popupScreenTg = document.querySelector(".popup-screen-tg");
    const popupBoxTg = document.querySelector(".popup-box-tg");
    const closeBtnTg = document.querySelector(".close-btn-tg");
	const openBtnTg = document.querySelector(".bonus-tg");

    openBtnTg.addEventListener("click", () => {
      popupScreenTg.classList.add("active"); 
    });

    closeBtnTg.addEventListener("click", () => {
      popupScreenTg.classList.remove("active");
    });
	
function myFunction() {
  var copyText = document.getElementById("myInput");
  copyText.select();
  copyText.setSelectionRange(0, 99999);

  document.execCommand("copy");

  alert("Данный код был успешно скопирован! " + copyText.value);
}
