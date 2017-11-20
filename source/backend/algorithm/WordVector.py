# @author RM
# @date 2017-11-08
# Representation of word vector for auxiliary purposes.

import re


class WordVector:
    """
    Representation of word vector for auxiliary purposes.
    """

    # Buffer for storing last line, if it's interrupted by chunking.
    interrupted_last_line_buffer = None
    # Store number of dimensions for current dataset.
    num_dimensions = -1

    def __init__(self):
        print("Generating new word vector.")

    @staticmethod
    def extract_number_of_dimensions(file_chunk):
        """
        Tries to extract the number of dimensions from a file chunk.
        Note: File chunk has to contain "{NUM_RECORDS} {NUM_DIMENSIONS}" in first line.
        :param file_chunk:
        :return: Number of dimensions as specified in file.
        """

        # Reset status attributes.
        WordVector.interrupted_last_line_buffer = None

        # Read first line to get number of dimensions.
        for line in file_chunk:
            # Cast number of dimensions to int.
            WordVector.num_dimensions = int(re.sub(r"([\\n]|[']|[ ])", "", str(line).split(' ')[1]))
            break

        return WordVector.num_dimensions

    @staticmethod
    def extract_word_vectors_from_file_chunk(file_chunk, chunk_number, dataset_id):
        """
        Extracts word vectors from specified file chunk.
        :param file_chunk:
        :param chunk_number:
        :param dataset_id:
        :return: Extracted word vector as list of tupels - pattern: (word, vector, dataset ID).
        """

        # Count lines in chunk.
        count = 0
        # Tuples of word vectors to insert into DB.
        tuples_to_insert = []



        # Parse word vector file.
        for line in file_chunk:
            # Ignore first line in first chunk.
            if chunk_number == 1 and count > 0 or chunk_number > 1:
                merged_line = line

                # If line is interrupted (and therefore presumedly the last line in chunk): Store interrupted last line.
                if not line.endswith(b'\n'):
                    WordVector.interrupted_last_line_buffer = line

                else:
                    # If first line: Join last line from last chunk and first line from this chunk.
                    if count == 0 and WordVector.interrupted_last_line_buffer is not None:
                        merged_line = WordVector.interrupted_last_line_buffer + line
                        # Reset buffer/flag for interrupted last line.
                        WordVector.interrupted_last_line_buffer = None

                    # Add line to collection of items to insert in DB. Remove trailing \n.
                    line_parts = str(merged_line).replace(' \\n', '').split(' ')

                    # Line has to contain num_dimensions elements (word + coordinates). Otherwise invalid.
                    if len(line_parts) == WordVector.num_dimensions + 1:
                        tuples_to_insert.append((
                            # Append word.
                            line_parts[0].replace('b\'', ''),
                            # Cast coordinate vector to float. Remove remaining special characters.
                            # todo Replace .replace with regex.
                            [float(x.replace('\'', '').replace('"', '')) for x in line_parts[1:]], dataset_id))

                        # Next:
                        #   - Create class for word vectors, move transformation code there.
                        #   - Insert word vectors into DB.
                        #   - Integrate DB with initial parameter histograms.
                        #   - Construct dashboard layout.
                    else:
                        print("corrupt: ")
                        print(merged_line)

            count += 1

        return tuples_to_insert

    @staticmethod
    def determine_wordembedding_accuracy(db_connector, model_name):
        """
        Determines WE accuracy with a simple test procedure consisting of analogies and (dis-similarities).
        :param db_connector:
        :param model_name:
        :return:
        """

        return None