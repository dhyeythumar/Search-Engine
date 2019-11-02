// For news card redering
const view_news = () => {

    let news_count = 1;
    while (1) {
        let news_test = document.getElementById(`news_${news_count}`);
        if (news_test !== null) {
            let style = getComputedStyle(news_test, "");
            // console.log(style.display);
            if (style.display === 'none')
                break;
            else
                news_count++;
        }
        else
            break;
    }
    // console.log(news_count);
    for (let i = news_count; i <= (news_count + 2); i++) {
        let news = document.getElementById(`news_${i}`);
        // console.log(news);
        if (news !== null)
            // load end banner;
            news.style.display = 'block';
        else
            break;
    }
};
view_news();



// For popular question card redering
const view_question = () => {

    let question_count = 1;
    while (1) {
        let question_test = document.getElementById(`question_${question_count}`);
        if (question_test !== null) {
            let style = getComputedStyle(question_test, "");
            // console.log(style.display);
            if (style.display === 'none')
                break;
            else
                question_count++;
        }
        else
            break;
    }
    // console.log(news_count);
    for (let i = question_count; i <= (question_count + 3); i++) {
        let question = document.getElementById(`question_${i}`);
        if (question !== null)
            // load end banner
            question.style.display = 'block';
        else
            break;
    }
};
view_question();

// Fetches the data into the search bar from history dropdown list 
const click_history_list = () => {
    let data = document.getElementById('history_list').getElementsByTagName('span');

    for (let i = 0; i < data.length; i++) {
        data[i].onclick = () => {
            document.getElementById('toggle-1').checked = false;
            document.getElementById('search').value = data[i].innerHTML;
        }
    }
};
click_history_list();