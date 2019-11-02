var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.responseText);
        // console.log(data)
        auto_complete(data);
    }
};
xhttp.open("GET", "http://localhost:3000/data/index_list.json?token=qsdfgbnmkiuhgcxswerghjkl", true);
xhttp.send();


const auto_complete = (data) => {

    var index_key = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        // `states` is an array of state names defined in "The Basics"
        local: data
    });

    $('#datasets .typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    },
        {
            name: 'page_index',
            source: index_key
        });
}


// var substringMatcher = (strs) => {
//     return function findMatches(q, cb) {
//         var matches, substringRegex;

//         // an array that will be populated with substring matches
//         matches = [];

//         // regex used to determine if a string contains the substring `q`
//         substrRegex = new RegExp(q, 'i');

//         // iterate through the pool of strings and for any string that
//         // contains the substring `q`, add it to the `matches` array
//         $.each(strs, function (i, str) {
//             if (substrRegex.test(str)) {
//                 matches.push(str);
//             }
//         });

//         cb(matches);
//     };
// };
// $('#datasets .typeahead').typeahead({
//     hint: true,
//     highlight: true,
//     minLength: 1
// },
//     {
//         name: 'states',
//         source: substringMatcher(data)
//     });