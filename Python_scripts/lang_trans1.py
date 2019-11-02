# -*- coding: utf-8 -*-
"""
Translator module that uses the Google Translate API.

Adapted from Terry Yin's google-translate-python.
Language detection added by Steven Loria.
"""
# I(Dhyey thumar) have done some modifications in this file.

# import codecs
# import re
import ctypes
import json
import sys

from textblob.compat import PY2, request, urlencode
# from textblob.exceptions import TranslatorError, NotTranslated

source_lang_code = str(sys.argv[1])
input_string = str(sys.argv[2])
dest_lang_code = str(sys.argv[3])


class Translator(object):

    """A language translator and detector.

    Usage:
    ::
        >>> from textblob.translate import Translator
        >>> t = Translator()
        >>> t.translate('hello', from_lang='en', to_lang='fr')
        u'bonjour'
        >>> t.detect("hola")
        u'es'
    """

    url = "http://translate.google.com/translate_a/t?client=webapp&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=at&ie=UTF-8&oe=UTF-8&otf=2&ssel=0&tsel=0&kc=1"

    headers = {
        'Accept': '*/*',
        'Connection': 'keep-alive',
        'User-Agent': (
            'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36')
    }

    def translate(self, source, from_lang='auto', to_lang='en', host=None, type_=None):
        """Translate the source text from one language to another."""
        if PY2:
            source = source.encode('utf-8')
        data = {"q": source}
        url = u'{url}&sl={from_lang}&tl={to_lang}&hl={to_lang}&tk={tk}'.format(
            url=self.url,
            from_lang=from_lang,
            to_lang=to_lang,
            tk=_calculate_tk(source),
        )
        response = self._request(url, host=host, type_=type_, data=data)
        result = json.loads(response)
        if isinstance(result, list):
            try:
                result = result[0]  # ignore detected language
            except IndexError:
                pass
        # self._validate_translation(source, result)
        return result

    def detect(self, source, host=None, type_=None):
        """Detect the source text's language."""
        if PY2:
            source = source.encode('utf-8')
        # if len(source) < 3:
        #     return 1
            # raise TranslatorError('Must provide a string with at least 3 characters.')
        data = {"q": source}
        url = u'{url}&sl=auto&tk={tk}'.format(
            url=self.url, tk=_calculate_tk(source))
        response = self._request(url, host=host, type_=type_, data=data)
        result, language = json.loads(response)
        return language

    # def _validate_translation(self, source, result):
    #     """Validate API returned expected schema, and that the translated text
    #     is different than the original string.
    #     """
    #     if not result:
    #         raise NotTranslated('Translation API returned and empty response.')
    #     if PY2:
    #         result = result.encode('utf-8')
    #     if result.strip() == source.strip():
    #         raise NotTranslated('Translation API returned the input string unchanged.')

    def _request(self, url, host=None, type_=None, data=None):
        encoded_data = urlencode(data).encode('utf-8')
        req = request.Request(url=url, headers=self.headers, data=encoded_data)
        if host or type_:
            req.set_proxy(host=host, type=type_)
        resp = request.urlopen(req)
        content = resp.read()
        return content.decode('utf-8')


# def _unescape(text):
#     """Unescape unicode character codes within a string.
#     """
#     pattern = r'\\{1,2}u[0-9a-fA-F]{4}'
#     decode = lambda x: codecs.getdecoder('unicode_escape')(x.group())[0]
#     return re.sub(pattern, decode, text)


def _calculate_tk(source):
    """Reverse engineered cross-site request protection."""
    # Source: https://github.com/soimort/translate-shell/issues/94#issuecomment-165433715
    # Source: http://www.liuxiatool.com/t.php

    tkk = [406398, 561666268 + 1526272306]
    b = tkk[0]

    if PY2:
        d = map(ord, source)
    else:
        d = source.encode('utf-8')

    def RL(a, b):
        for c in range(0, len(b) - 2, 3):
            d = b[c + 2]
            d = ord(d) - 87 if d >= 'a' else int(d)
            xa = ctypes.c_uint32(a).value
            d = xa >> d if b[c + 1] == '+' else xa << d
            a = a + d & 4294967295 if b[c] == '+' else a ^ d
        return ctypes.c_int32(a).value

    a = b

    for di in d:
        a = RL(a + di, "+-a^+6")

    a = RL(a, "+-3^+b+-f")
    a ^= tkk[1]
    a = a if a >= 0 else ((a & 2147483647) + 2147483648)
    a %= pow(10, 6)

    tk = '{0:d}.{1:d}'.format(a, a ^ b)
    return tk


translator_instance = Translator()
if source_lang_code == "null":
    source_lang_code = translator_instance.detect(input_string)

translated_string = translator_instance.translate(input_string, source_lang_code, dest_lang_code)

if translated_string:
    translated_string = str(translated_string)
    result = []
    for char in translated_string:
        result.append(str(ord(char)))
    seperator = ','
    trans_string = seperator.join(result)
    print(trans_string, end='\n')
else:
    print('empty response')
