// User modal
var modal_2 = document.getElementById('auth_modal');
var user_login = document.getElementById('user_login');
user_login.onclick = () => {
    modal_2.style.display = "block";
};
var span = document.getElementsByClassName("close")[1];
span.onclick = () => {
    modal_2.style.display = "none";
};

const toggle_form_action = () => {
    const hide = document.getElementById('toggle_hide');
    const form = document.getElementsByClassName('user-form')[0];
    if (!hide.classList.contains('_toggle_hide') || hide.classList.contains('_toggle_show')) {
        hide.classList.remove('_toggle_show');
        hide.classList.add('_toggle_hide');
        document.getElementsByName('submit')[0].innerHTML = 'Sign In';
        document.getElementById('toggle_span_ele').innerHTML = 'Sign Up';
        setTimeout(() => {
            hide.style.display = 'none';
        }, 1000);
        form.action = '/user-sign_in';
    }
    else {
        hide.style.display = 'block';
        document.getElementsByName('submit')[0].innerHTML = 'Sign Up';
        document.getElementById('toggle_span_ele').innerHTML = 'Sign In';
        hide.classList.remove('_toggle_hide');
        hide.classList.add('_toggle_show');
        form.action = '/user-sign_up';
    }

}