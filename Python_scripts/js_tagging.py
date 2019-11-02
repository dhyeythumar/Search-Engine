# Stopwords removal and lemmatizing them.
# import nltk
import sys
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

query = str(sys.argv[1])

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
    'online'
]
return_words = []
stop_words = set(stopwords.words('english'))

word_tokens = word_tokenize(query)

filtered_sentence = []

for w in word_tokens:
    if w not in stop_words:
        filtered_sentence.append(w)

# Lemmatizing the words.
lemma_word = []
wordnet_lemmatizer = WordNetLemmatizer()
for w in filtered_sentence:
    word1 = wordnet_lemmatizer.lemmatize(w, pos="n")
    word2 = wordnet_lemmatizer.lemmatize(word1, pos="v")
    word3 = wordnet_lemmatizer.lemmatize(word2, pos=("a"))
    lemma_word.append(word3)

# Removing unwanted lemmatized words.
lemma_word = set(lemma_word)
for word in lemma_word.copy():
    if ((len(word) <= 3) | (word.lower() in stop_keywords)):
        lemma_word.remove(word)
lemma_word = list(lemma_word)

lemma_word.insert(0, query)
for lem_w in lemma_word:
    return_words.append(lem_w.strip())
print(lemma_word)
