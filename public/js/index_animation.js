// Animation with typed js
const init_typed = () => {
    const typed = new Typed('.heading_data', {
        strings: ["Inspired by the data", "available on the internet.", "Solve your queries here."],
        // startDelay: 14000,
        loop: false,
        backSpeed: 0,
        typeSpeed: 70,
        showCursor: true,
        cursorChar: '|',
        autoInsertCss: true,
    });
}

// animation for starting heading.
let refresh = document.getElementsByName('refresh')[0].value;
console.log(refresh);
if (refresh == 0) {
    window.setTimeout(() => {
        document.getElementsByClassName('page_start_anima')[0].style.display = 'none';
        init_typed();
    }, 13877);
}
else {
    document.getElementsByClassName('page_start_anima')[0].style.display = 'none';
    init_typed();
}

const snackbar = () => {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

// Animation with partical js
// window.onload = function () {
//     var particles = Particles.init({
//         selector: '.background_bubbles',
//         color: ['#DA0463', '#404B69', '#DBEDF3'],
//         connectParticles: false,
//         maxParticles: 500,
//         speed: 0.4,
//         sizeVariations: 3,

//     });
// };
        // responsive: [
        //     {
        //         breakpoint: 768,
        //         options: {
        //             maxParticles: 200,
        //             color: '#48F2E3',
        //             connectParticles: false
        //         }
        //     },
        //     {
        //         breakpoint: 425,
        //         options: {
        //             maxParticles: 100,
        //             connectParticles: true
        //         }
        //     },
        //     {
        //         breakpoint: 320,
        //         options: {
        //             maxParticles: 0

        //             // disables particles.js
        //         }
        //     }
        // ]