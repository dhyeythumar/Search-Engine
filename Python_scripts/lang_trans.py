''' This is language translation script '''
from textblob import TextBlob
import sys


source_lang_code = str(sys.argv[1])
input_string = str(sys.argv[2])
dest_lang_code = str(sys.argv[3])

input_blob = TextBlob(input_string)

if source_lang_code == "null":
    try:
        source_lang_code = input_blob.detect_language()
        # print("Detected language:  ", source_lang_code)
    except Exception as e:  # What if the input_string language is not detected
        print("Error_1", e)

try:
    translated_string = input_blob.translate(
        from_lang=source_lang_code, to=dest_lang_code)
    # print(translated_string) give character in unicode format.
    # translated_string => is a <class 'textblob.blob.TextBlob'> type of object
    # str(translated_string) => is a <class 'str'> type of object
    # str(translated_string).encode('utf8) => is a <class 'bytes'> type of object

    translated_string = str(translated_string)
    result = []
    for char in translated_string:
        result.append(str(ord(char)))
    seperator = ', '
    trans_string = seperator.join(result)
    print(trans_string, end='\n')

except Exception as e:  # What if the dest_lang code is null
    print("Error_2", e)
