setTimeout(animation, 3000);

function animation() {
    const svgPath2 = document.querySelectorAll('.path2');
    const h3 = document.querySelector('h3');

    h3.style.display = 'block';
    const svgText = anime({
        targets: svgPath2,
        loop: true,
        direction: 'alternate',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 400,
        delay: function (el, i) {
            return i * 200;
        }
    });
}