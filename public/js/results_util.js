const sizes = () => {
    let bk_width = document.getElementsByClassName("background")[0].offsetWidth;
    let bk_height = document.getElementsByClassName("background")[0].offsetHeight;

    let w = window.innerWidth;

    let cal_w = Math.round((w >= 1530) ? (((w - 1530) / 2) + 423) : 419);

    let cal_h = Math.round((bk_height * cal_w) / bk_width);

    document.getElementsByClassName("background")[0].style.width = `${cal_w}px`;
    document.getElementsByClassName("background")[0].style.height = `${cal_h}px`;
    document.getElementsByClassName("purple_background")[0].style.width = `${cal_w}px`;
};

['DOMContentLoaded', 'resize'].forEach(evt => {

    window.addEventListener(evt, () => { sizes() }, false);

});

window.setTimeout(() => {
    document.getElementsByClassName('loader-wrapper')[0].style.display = 'none';
    document.getElementsByClassName('centered')[0].style.display = 'block';
}, 1500);