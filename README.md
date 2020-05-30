<h6></h6>
<p align="center">
    <img alt="Eyers" src="./assets/logo.svg" width="110" />
</p>
<h1 align="center">
  Search Engine
</h1>

<h4 align="center">
  Made with Node JS and Python
</h4>

<h5 align="center">
    Quick Search
  <span> · </span>
  Search Suggestion
  <span> · </span>
  News Feed
  <span> · </span>
  Language Translation
  <span> · </span>
  Popular websites in one go
  <span> · </span>
  Popular Questions
  <span> · </span>
  Frequently Searched Domains
</h5>


## What’s In This Document
- [Introduction](#introduction)
- [Prerequisites Tools](#prerequisites-tools)
- [Setup Instructions](#setup-instructions)
- [Getting Started](#getting-started)
- [Implementation](#implementation)
- [Failure and Scope of Improvement](#failure-and-scope-of-improvement)
- [Future Development](#future-development)
- [License](#license)


## Introduction

I was eager to learn how the search engine works, so it is an attempt to create one. This project is powered by the data available on the internet. And this data is exponentially increasing day by day. It uses web crawling to get this data from each web page and stores them into a MySQL database. This data is then displayed based on the user's queries. See the front-end image [**here**](./images.md).


## Prerequisites Tools

- **News API :**
To run this project you would require News API and you can get this [**over here**](https://newsapi.org). Replace your API key with `--API key here--` in this [**file**](./models/news_api.js).

- **MySQL Database :**
You would also require a database on which the queries can be executed. Refer the database schema used in this project for [**here**](./database_schema.md).

- **Web Crawler :**
You would also require a crawler to crawl the internet and scrape the data from webpages and store them in MySQL database. I have created web-crawler/web-spider to accomplish this task but its not been included in this repo if you want my scraper then contact me [**here**](https://dhyeythumar.github.io/my_portfolio/about.html#contact-form).
Or else you can also use [**Scrapy**](https://scrapy.org/).


## Setup Instructions

Clone the repository
```bash
$ git clone https://github.com/Dhyeythumar/Search-Engine.git
$ cd Search_Engine
```
**1. Install and Update Node JS Dependency**
```bash
$ npm install
```
```bash
$ npm update
```

**2. Install Python Dependency**
```bash
$ cd Python_scripts
$ pip install -r requirements.txt
```


## Getting Started

You can run this project by just executing this command:
```bash
$ npm start
```
Website is now running at `http://localhost:3000`. Open the `Search_Engine` directory in the code editor of your choice and edit `./server.js`. Save your changes, and the content of the browser will update without any re-execution!


## Implementation

This project requires an extensive amount of data to work or to find relatively correct results for each query.

**1. Let's start with, Inner workings of the query-result process :**
For now, let's assume that the database is populated. So first of all, we have to remove stopwords from the query entered by the user and then this cleaned query is Lemmatized using WordNetLemmatizer from NLTK. A list is created out of these lemmatized words similar to n-grams. And this list is used to query the database for a wider range of search results.

**2. Now lets come back to the web crawler and its implementations :**
To get the data from internet a scraper bot or a web crawler is needed. A web crawler crawls the web to get the data from each web page and stores in the MySQL database. The data from the index-list table is used to implement search-suggestions in the search box (typeahead by twitter is used).

**3. Other feature's implementation :**
Language translation is implemented by using Textblob (a python library) by spawning a python process from node js.
The news section is populated by fetching the data from a news API.


## Failure and Scope of Improvement
I have identified some of the failures in my project for which improvements can be done but without those changes also project is working just fine.

**1. Modification of web-scraper :**
The scraper which I created is just fetching the page title, description, and keywords which are defined in the HTML head tag. But here's a catch each page doesn't need to have unique header content so when I scraped webpages I do get the same content for different URLs which makes no sense to store them into the database as they just hold duplicate data. So here data redundancy occured.
- **Improvement to this problem** is I should have been scraped the unique content stored in between the body tags (The content which the user can read because a user can't read header content).

**2. Monotonous data :**
This occurs in the database due to my scraping pattern. I have implemented depth-first scraping i.e when I start with a particular URL I go on scraping those new URLs which are belonging to the same base URL, and keep a record of foreign URLs. After completing a particular website (which can have millions of pages) I start with the foreign URL and the process repeats. So by doing this, I have to wait until the whole website is scraped.
- **Improvement to this problem** can be the implementation of the breadth-first scraping i.e not checking the similarity of the domains.

**3. Slow access to the database :**
When the query is entered there is some sort of delay in processing it because it is lemmatized by a python code that is been spawned from node js. And it's also due to complex join query execution for each search term.
- **Improvement to this problem** can be the improvement of the database schema and using the javascript libraries to implement lemmatization.

**4. Data preprocessing :**
I have not implemented the data preprocessing on the raw data which I got from the internet scraped by the bot.


## Future Development
I will implement all of the above-stated improvements to this project so stay tuned to this repo.


## License
Licensed under the [GNU General Public License v3.0](./LICENSE).
