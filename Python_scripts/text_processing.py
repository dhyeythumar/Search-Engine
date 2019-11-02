# Stopwords removal and lemmatizing them.
# import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

stop_keywords = [
    'i',
    'stack',
    'overflow',
    'web',
    'tutorials',
    'lesson',
    'tip',
    'learn',
    'reference',
    'demo',
    'name',
    'company',
    'w3schools',
    'w3resource',
    'online',
    'this',
]


def text_process(data):

    return_words = []

    for d in data:
        stop_words = set(stopwords.words('english'))

        word_tokens = word_tokenize(d)

        filtered_sentence = []

        for w in word_tokens:
            if w not in stop_words:
                filtered_sentence.append(w)
        # print(filtered_sentence)

        # Lemmatizing the words.
        lemma_word = []
        wordnet_lemmatizer = WordNetLemmatizer()
        for w in filtered_sentence:
            word1 = wordnet_lemmatizer.lemmatize(w, pos="n")
            word2 = wordnet_lemmatizer.lemmatize(word1, pos="v")
            word3 = wordnet_lemmatizer.lemmatize(word2, pos=("a"))
            lemma_word.append(word3.lower())

        # print(lemma_word)
        # Removing unwanted lemmatized words.
        lemma_word = set(lemma_word)
        for word in lemma_word.copy():
            if ((len(word) <= 3) | (word in stop_keywords)):
                lemma_word.remove(word)
        # lemma_word = list(lemma_word)

        lemma_word = list(lemma_word)
    return return_words
