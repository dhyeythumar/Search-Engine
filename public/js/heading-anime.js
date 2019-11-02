const svgPath1 = document.querySelectorAll('.path1');

let svgPath1_1 = []; //reverse list

for (var i = 0; i < svgPath1.length; i++) {
    svgPath1_1[svgPath1.length - 1 - i] = svgPath1[i];
}

function animation(setPath, a, b) {
    anime({
        targets: setPath,
        loop: false,
        direction: 'alternate',
        strokeDashoffset: [a, b],
        easing: 'easeInOutSine',
        duration: 1000,
        delay: function(el, i) {
            return i * 800;
        }
    });
}

animation(svgPath1, anime.setDashoffset, 0);
setTimeout(function() {
    animation(svgPath1_1, 0, anime.setDashoffset);
}, 9900);
