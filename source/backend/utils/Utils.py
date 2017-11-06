# @author RM
# @date 2017-08-09
# Singleton class for miscanellous tasks.
#

import logging
import nltk
import re
from pattern3 import vector as pattern_vector


# Class for various, non-essential tasks.
class Utils:
    # Inactive constructor.
    def __init__(self):
        print("Constructing Utils. Shouldn't happen")

    # Construct logging object.
    @staticmethod
    def create_logger():
        # Logger set-up.
        # Source: https://docs.python.org/3/howto/logging-cookbook.html
        # Create global logger.
        Utils.logger = logging.getLogger('topac')
        Utils.logger.setLevel(logging.DEBUG)
        # Create console handler.
        ch = logging.StreamHandler()
        ch.setLevel(logging.DEBUG)
        # Create formatter and add it to handlers.
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s | %(message)s')
        ch.setFormatter(formatter)
        # Add handlers to logger.
        Utils.logger.addHandler(ch)

        # Return logger object.
        return Utils.logger

    @staticmethod
    def dump_reuters_content_as_fasttext_file(self, filepath, stopwords=[]):
        """
        Dumps Reuters document to a file readable by fasttext.
        :param filepath: Path to dumped file.
        :param stopwords: Manual stopwords. Base for stopwords is nltk.stopwords.
        """

        # Open/create file.
        file = open(filepath, 'w')

        # Extend stopwords.
        stopwords.extend(nltk.corpus.stopwords.words('english'))

        # Preprocess and persist documents.
        for file_id in nltk.corpus.reuters.fileids():

            # Fetch document.
            doc = nltk.corpus.reuters.raw(fileids=[file_id]).strip()
            # Make everything lowercase and exclude special signs: All ; & > < = numbers : , . ' "
            doc = re.sub(r"([;]|[(]|[)]|[/]|[\\]|[$]|[&]|[>]|[<]|[=]|[:]|[,]|[.]|[-]|(\d+)|[']|[\"])", "", doc.lower())

            # Tokenize text.
            # Note that removing stopwords from doc["tokenized_text"] is not necessary, since the same token set is
            # provided to gensim and hence removed later on.
            doc = [pattern_vector.stem(word, stemmer=pattern_vector.LEMMA) for word in doc.split()]

            # Remove stopwords from text, add to collection.
            doc = ' '.join(filter(lambda x: x not in stopwords, doc))

            # Add categories to collection.
            doc = ' '.join(["__label__" + x for x in nltk.corpus.reuters.categories(file_id)]) + " " + doc + "\n"

            # Write line to file.
            file.write(doc)

        file.close()
