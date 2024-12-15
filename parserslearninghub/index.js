setScreenSize(window.innerWidth, window.innerHeight);
window.addEventListener("load", async function () {
  document.getElementById("loading_animation_div").style.display = "none";
});
window.addEventListener("resize", async function () { setScreenSize(window.innerWidth, window.innerHeight); });

document.getElementById("home_btn").addEventListener("click", function () {
  window.location.href = "../homepage.html";
});

$(document).ready(function () {
  const page = $('#entercode_div');
  $('#joinquiz_btn').click(function () {
    page.show();
    anime({
      targets: page[0],
      clipPath: ['circle(0% at 50% 50%)', 'circle(100% at 50% 50%)'],
      duration: 400,
      easing: 'easeInOutQuad',

    });
  });
});

$(document).ready(function () {
  const page = $('#entercode_div');
  $('#returnjoinquiz_btn').click(function () {
    anime({
      targets: page[0],
      clipPath: ['circle(100% at 50% 50%)', 'circle(0% at 50% 50%)'],
      duration: 400,
      easing: 'easeInOutQuad',
    });
  });
});


function setScreenSize(width, height) {
  document.body.style.width = width + "px";
  document.body.style.height = height + "px";
}

function circleAnimation(page) {
  page.show();
  anime({
    targets: page[0],
    clipPath: ['circle(0% at 50% 50%)', 'circle(100% at 50% 50%)'],
    duration: 400,
    easing: 'easeInOutQuad',

  });
}