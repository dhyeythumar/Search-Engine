// This api is provided by the https://newsapi.org website.
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('--API key here--');
// To query /v2/everything
// You must include at least one q, source, or domain
exports.getNews = () => {

    return new Promise((resolve, reject) => {
        newsapi.v2.everything({
            q: 'technology',
            from: '2019-12-01',
            to: '2019-01-01',
            language: 'en',
            sortBy: 'relevancy',
        })
            .then(response => {
                news_feed_data = []
                if (response['status'] === 'ok') {
                    console.log('Total news articles: ', response['articles'].length);
                    for (let i = 0; i < 20; i++) {
                        news_feed_data.push({
                            title: response['articles'][i].title,
                            urlToImage: response['articles'][i]['urlToImage'],
                            desc: response['articles'][i]['description'],
                            url: response['articles'][i]['url']
                        });
                    }
                }
                resolve(news_feed_data);
            })
            .catch(err => {
                console.log('News api error', err);
                reject(err);
            });
    });
}
