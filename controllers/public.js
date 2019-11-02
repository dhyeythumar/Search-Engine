const languageTranslation = require('../models/translation.js');
const newsApi = require('../models/news_api.js');

const User = require('../models/user.js');
const Result = require('../models/search_results.js');

const path = require('../util/path.js');

const items_per_page = 12
let anima_val = 1;
let refresh = 0;

exports.getIndex = (req, res, next) => {
    newsApi.getNews()
        .then((news_feed) => {
            const userAuth = req.session.isLoggedIn;
            if (userAuth === true) {
                User.getlinksnquery(req.session.user.id)
                    .then((data) => {
                        res.render('index', {
                            pageTitle: 'Search Engine',
                            user_auth: userAuth,
                            user: req.session.user,
                            search_queries: data[0],
                            search_domains: data[1],
                            news: news_feed,
                            refresh: anima_val
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
            else {
                res.render('index', {
                    pageTitle: 'Search Engine',
                    user_auth: userAuth,
                    user: req.session.user,
                    search_queries: [],
                    search_domains: [],
                    news: news_feed,
                    refresh: anima_val
                });
            }
            anima_val = 1;
        })
        .catch(err => {
            console.log(err);
        })
};

exports.postTranslation = (req, res, next) => {
    const s_code = req.body.source_lang_code.trim();
    const input_lang = req.body.input_lang;
    const d_code = req.body.dest_lang_code;
    languageTranslation.python_process(s_code, input_lang, d_code)
        .then(dest_lang => {
            res.end(dest_lang);
        })
        .catch(err => {
            console.log(err);
            res.end('Not able to translate');
        })
};


const loadData = (res, page, userAuth, User, search_query, const_search) => {
    console.log('After view updation');
    result.selectBylist((page - 1) * items_per_page, items_per_page)
        .then(([rows, fieldData]) => {
            res.render('results', {
                pageTitle: 'Search Results',
                user_auth: userAuth,
                user: User,
                query: search_query,
                page_results: rows,
                image_result: [],
                prev: 'search='.concat(const_search, '&pg=', page - 1),
                prev_no: page - 1,
                next: 'search='.concat(const_search, '&pg=', page + 1),
                next_no: page + 1
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getResults = (req, res, next) => {
    console.log('Entered getResults');
    const search_query = req.query.search.trim();
    const page = +req.query.pg || 1;
    const userAuth = req.session.isLoggedIn;
    if (userAuth === true) {
        User.insertSquery(req.session.user.id, search_query)
            .then((data) => {
                console.log(data);
            })
            .catch(err => {
                console.log(err);
            });
    }
    if (search_query.toLowerCase().includes('https://') || search_query.toLowerCase().includes('http://')) {
        res.redirect(search_query);
    }
    else {
        result = new Result(search_query);
        if (!search_query.includes(" ")) { // for a single word query
            console.log('Query with single word');
            result.selectByword((page - 1) * items_per_page, items_per_page)
                .then((result) => {
                    res.render('results', {
                        pageTitle: 'Search Results',
                        user_auth: userAuth,
                        user: req.session.user,
                        query: search_query,
                        page_results: result[0],
                        image_result: result[1],
                        prev: 'search='.concat(req.query.search, '&pg=', page - 1),
                        prev_no: page - 1,
                        next: 'search='.concat(req.query.search, '&pg=', page + 1),
                        next_no: page + 1
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        }
        else {
            console.log('Query with multiple words');
            if (page == 1) {
                result.getList()
                    .then(data_list => {
                        return result.insertData(data_list)
                    })
                    .then(result => {
                        // console.log(result);
                        loadData(res, page, userAuth, req.session.user, search_query, req.query.search);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
            if (page > 1) {
                loadData(res, page, userAuth, req.session.user, search_query, req.query.search);
            }
        }
    }
};


exports.getData = (req, res, next) => {

    input_token = req.query.token.trim();
    if (input_token == "--token_here--") {
        res.sendFile(path + '/data/index_list.json')
    }
    else {
        res.status(404).render('404', {
            pageTitle: "Page not found",
            path: '/error'
        });
    }
};
