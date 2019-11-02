const path = require('../util/path.js');

const bin2String = (array) => {
    return String.fromCharCode.apply(String, array);
}
// function string2Bin(str) {
//     var result = [];
//     for (var i = 0; i < str.length; i++) {
//         result.push(str.charCodeAt(i));
//     }
//     return result;
// }

exports.python_process = (s_code, input_lang, d_code) => {

    return new Promise((resolve, reject) => {
        const spawn = require("child_process").spawn;
        const process = spawn('python', [`${path}\\Python_scripts\\lang_trans1.py`, s_code, input_lang, d_code]);

        process.stdout.on('data', (data) => {
            console.log(data.toString());

            const string_array = data.toString().split(',');
            let data_array = []
            for (let i = 0; i < string_array.length; i++) {
                data_array.push(Number(string_array[i]));
            }
            data_array.pop();
            trans_str = bin2String(data_array);
            // console.log(strToUtf8Bytes(string));
            resolve(trans_str);
        });
        process.stdout.on('end', (err) => {
            reject(err);
        });
    });
}
