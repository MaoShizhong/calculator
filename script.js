const buttons = document.querySelectorAll(".basic");
const layout = document.querySelector("#slider");
const equation = document.querySelector("#equation");

layout.addEventListener("click", function() {
    const extraButtons = document.querySelectorAll(".extra");
    extraButtons.forEach(extraButton => extraButton.classList.toggle("hidden"));

    buttons.forEach(button => {
        button.classList.toggle("basic");
        button.classList.toggle("extended");
    });

    toggleSlider();
});

function toggleSlider() {
    layout.classList.toggle("on");
    if (layout.classList.contains("on")) {
        layout.firstChild.src = "./images/ext-on.png";
    }
    else {
        layout.firstChild.src = "./images/ext-off.png";
    }
}