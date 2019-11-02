// Ajax is used to communicate with the node js server.
// This is done in order to work the form without reloading the whole web page.
const Ajax_call = () => {
    // var xhr = new XMLHttpRequest();

    // let dest_lang_code = document.getElementsByName("dest_language_code")[0].value
    // let datap =
    // {
    //     data: [
    //         { 'source_lang_code': document.getElementsByName("source_language_code")[0].value },
    //         { 'input_lang': document.getElementsByName("input_language")[0].value },
    //         { 'dest_lang_code': dest_lang_code }
    //     ]
    // };
    // // console.log(data['source_lang_code']);
    // xhr.open('POST', '/language-translation');
    // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // xhr.onload = () => {
    //     if (xhr.status === 200 && xhr.readyState === 4) {
    //         alert('Name is now ' + xhr.responseText);
    //     }
    //     else if (xhr.status !== 200) {
    //         alert('Request failed.  Returned status of ' + xhr.status);
    //     }
    // };
    // xhr.send(datap);
    const loader = document.getElementsByClassName('loader-wrapper')[0];
    const source_lang_code = document.getElementsByName("source_language_code")[0].value;
    const dest_lang_code = document.getElementsByName("dest_language_code")[0].value;
    const input_lang = document.getElementsByName("input_language")[0].value;
    const modify_ele = document.getElementById('hide_placeholder');
    modify_ele.lang = dest_lang_code;
    let not_trans = 0;
    if (source_lang_code == 'null' && input_lang.length <= 3) {
        not_trans = 1;
    }

    if ((source_lang_code !== dest_lang_code) && dest_lang_code != "null" && not_trans == 0) {
        loader.style.display = 'block';
        $.ajax({
            global: false,
            type: 'POST',
            url: "/language-translation",
            dataType: 'html',
            data: {
                source_lang_code: source_lang_code,
                input_lang: input_lang,
                dest_lang_code: dest_lang_code
            },
            success: function (result) {
                console.log('results:', result);
                loader.style.display = 'none';
                if (result.search("empty response") > -1)
                    modify_ele.innerHTML = input_lang;
                else
                    modify_ele.innerHTML = result;
            },
            error: function (request, status, error) {
                alert("There is an error in Language Translation");
                modify_ele.innerHTML = 'Given request can\'t be send to the server';
                console.log(request, status, error);
            }
        });
    }
    else if (dest_lang_code == "null")
        modify_ele.innerHTML = 'Destination language not selected!!';
    else if (not_trans == 1)
        modify_ele.innerHTML = 'Input language can\'t be detected as it has 3 or less characters in it!!';
    else
        modify_ele.innerHTML = input_lang;
};


// Language translation modal
var modal_1 = document.getElementById('language_modal');
var lang_trans = document.getElementById('language_translation');
lang_trans.onclick = () => {
    modal_1.style.display = "block";
}
var span = document.getElementsByClassName("close")[0];
span.onclick = () => {
    document.getElementsByName("source_language_code")[0].value = "null";
    document.getElementsByName("input_language")[0].value = "";
    document.getElementsByName("dest_language_code")[0].value = "null";
    document.getElementById("hide_placeholder").innerHTML = "Translated text here";
    document.getElementsByClassName('loader-wrapper')[0].style.display = 'none';
    modal_1.style.display = "none";
}


// For language dropdown
var x, i, j, selElmnt, a, b, c;
/*look for any elements with the class "lang_dropdown":*/
x = document.getElementsByClassName("lang_dropdown");
for (i = 0; i < x.length; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    /*for each element, create a new DIV that will act as the selected item:*/
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /*for each element, create a new DIV that will contain the option list:*/
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < selElmnt.length; j++) {
        /*for each option in the original select element,
        create a new DIV that will act as an option item:*/
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function (e) {
            /*when an item is clicked, update the original select box,
            and the selected item:*/
            var y, i, k, s, h;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            h = this.parentNode.previousSibling;
            for (i = 0; i < s.length; i++) {
                if (s.options[i].innerHTML == this.innerHTML) {
                    s.selectedIndex = i;
                    h.innerHTML = this.innerHTML;
                    y = this.parentNode.getElementsByClassName("same-as-selected");
                    for (k = 0; k < y.length; k++) {
                        y[k].removeAttribute("class");
                    }
                    this.setAttribute("class", "same-as-selected");
                    break;
                }
            }
            h.click();
        });
        b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function (e) {
        /*when the select box is clicked, close any other select boxes,
        and open/close the current select box:*/
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });
}
function closeAllSelect(elmnt) {
    /*a function that will close all select boxes in the document,
    except the current select box:*/
    var x, y, i, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    for (i = 0; i < y.length; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select-arrow-active");
        }
    }
    for (i = 0; i < x.length; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
        }
    }
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);