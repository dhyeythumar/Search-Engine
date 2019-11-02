const db = require('../util/database.js');
const natural = require('natural');
const lemmatize = require('wink-lemmatizer');
// const SummarizerManager = require("node-summarizer").SummarizerManager;

const stop_words = ['she', 'off', 'there', 'more', "weren't", 'them', 'or', 'him', "aren't", "wasn't", 'into', 'don', "haven't", 'to', 'than', 'm', 'any', 'after', 'down', 'itself', 'weren', 'are', 's', 're', "mightn't", "won't", 'each', "don't", 'having', 'mightn', 'this', 'against', 'y', 'with', 'isn', 'on', 'just', 'yourself', 'does', 'you', "you'd", 'o', 'wouldn', "she's", 'shouldn', 'ourselves', 'mustn', 'they', 'be', 't', 'her', 'but', "mustn't", 'we', 'theirs', 'did', 'in', 'aren', "you've", "wouldn't", 'had', 'once', 'why', 'its', 'when', 'haven', 'not', 'have', 'where', 'me', 'being', 'doing', 'that', 'do', 'needn', 'over', 'for', 'is', "hasn't", 'whom', "didn't", 'those', 'further', 'too', 'll', 'up', "that'll", 'under', 'no', 'should', 'so', 'most', 'our', 'ma', 'from', 've', 'what', 'while', 'yours', 'which', 'out', "needn't", 'before', 'hadn', 'at', 'he', "you're", "you'll", 'wasn', 'about', 'only', 'will', 'shan', 'same', 'the', 'myself', 'himself', 'until', 'below', 'very', "couldn't", 'few', 'has', 'was', 'am', 'i', 'themselves', 'won', 'couldn', 'now', 'if', 'because', 'then', 'can', 'hers', 'a', 'herself', 'these', 'd', "should've", "doesn't", 'ours', 'and', 'during', 'my', 'all', 'it', 'by', 'doesn', 'hasn', 'were', 'between', 'above', 'how', 'as', 'here', "hadn't", 'again', "shan't", 'been', 'didn', 'of', 'some', 'own', 'other', "shouldn't", 'such', "it's", 'an', 'nor', "isn't", 'who', 'their', 'through', 'both', 'yourselves', 'your', 'ain', 'his', 'stack', 'overflow', 'web', 'tutorials', 'lesson', 'tip', 'learn', 'reference', 'demo', 'name', 'company', 'w3schools', 'w3resource', 'online', 'this']

let image_list = [];

// Fetch the images according to the query
const selectImages = (query, skip) => {
    return new Promise((resolve, reject) => {
        db.execute('SELECT image_url, image_keyword \
        FROM image_list \
        WHERE image_keyword LIKE ? LIMIT 10', ['%' + query + '%'])
            .then(([rows, fieldData]) => {
                image_list = [...rows];
                // console.log(image_list);
                resolve(image_list);
            })
            .catch(err => {
                reject(err);
            });
    });
}

module.exports = class Result {
    constructor(query) {
        this.query = query;
    }

    selectByword(skip, total_items) {

        return new Promise((resolve, reject) => {
            db.execute('SELECT link, title, description, priority \
            FROM web_pages \
            WHERE web_page_id IN ( SELECT web_page_id \
                FROM index_br_web \
                WHERE index_id IN ( SELECT index_id \
                    FROM index_list \
                    WHERE page_index = ?)) \
                    LIMIT ? OFFSET ?', [this.query, total_items, skip])
                .then(([rows, fieldData]) => {
                    selectImages(this.query, 5)
                        .then(images => {
                            resolve([rows, images]);
                        })
                        .catch(err => {
                            reject(err);
                        });
                })
                .catch(err => {
                    reject(err);
                });
        })
    }

    // Text Processing.
    getList() {
        // Text summarization. 
        // const Summarizer = new SummarizerManager(this.query, 1);
        // Summarizer.getSummaryByRank()
        //     .then((summary_object) => {
        //         console.log(summary_object.summary);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })
        return new Promise((resolve, reject) => {
            let query_list = []
            query_list.push(this.query);

            // tokenizing the query.
            let word_tokens = []
            const tokenizer = new natural.WordTokenizer();
            word_tokens = tokenizer.tokenize(this.query);

            // Removal of stopwords.
            let filtered_words = []
            for (let w of word_tokens) {
                if (!stop_words.includes(w))
                    filtered_words.push(w)
            }

            // Lemmatizing the filtered_words.
            let word1 = '', word2 = '', word3 = '';
            for (let w of filtered_words) {
                if (w.length >= 4) {
                    word1 = lemmatize.noun(w);
                    word2 = lemmatize.verb(word1);
                    word3 = lemmatize.adjective(word2);
                    query_list.push(word3.toLowerCase());
                }
            }
            resolve(query_list);
        });
    }

    // Updating the view.
    insertData(data_list) {
        console.log(data_list);
        return new Promise((resolve, reject) => {
            let page_id_list = [];
            new Promise((resolve, reject) => {
                for (let i = 0; i < data_list.length; i++) {
                    db.execute('SELECT web_page_id \
                FROM index_br_web \
                WHERE index_id IN ( SELECT index_id \
                    FROM index_list \
                    WHERE page_index LIKE ?)', ['%' + data_list[i] + '%'])
                        .then(([rows, fieldData]) => {
                            for (let j = 0; j < rows.length; j++) {
                                if (!page_id_list.includes(rows[j].web_page_id))
                                    page_id_list.push(rows[j].web_page_id);
                            }
                            if (i == data_list.length - 1)
                                resolve(page_id_list);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            })
                .then(list => {
                    console.log('Total results', list.length);
                    return db.execute('CREATE OR REPLACE VIEW results_view AS \
                    SELECT link, title, description \
                        FROM web_pages \
                        WHERE web_page_id IN (' + list + ')');
                })
                .then((result) => {
                    console.log('View updated');
                    resolve(result);
                })
                .catch(err => {
                    console.log(err);
                });
        });
    }

    selectBylist(skip, total_items) {
        return db.execute('SELECT link, title, description \
            FROM results_view \
            LIMIT ? OFFSET ?', [total_items, skip]);
    }
};
// SELECT * FROM Products WHERE SOUNDEX(ProductName) LIKE (SELECT SOUNDEX('Konbo'));
// return db.execute('mysql_insert_id()');

// getList() {
    //     return new Promise((resolve, reject) => {
    //         const spawn = require("child_process").spawn;
    //         const process = spawn('python', [`${path}\\Python_scripts\\js_tagging.py`, this.query]);

    //         process.stdout.on('data', (data) => {
    //             let string_array = data.toString().replace('[', '').replace(']\r\n', '').split(',');
    //             let data_array = [];
    //             for (let i = 0; i < string_array.length; i++) {
    //                 data_array.push(string_array[i].replace("'", "").replace("'", "").toString());
    //             }
    //             console.log(data_array);
    //             resolve(data_array);
    //         });
    //         process.stdout.on('end', (err) => {
    //             reject(err);
    //         });
    //     });
    // }