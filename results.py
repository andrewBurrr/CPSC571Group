import pandas as pd
import re

''' Go emotion tags are as follows
    example_very_unclear,admiration,amusement,anger,annoyance,approval,caring,
    confusion,curiosity,desire,disappointment,disapproval,disgust,embarrassment,
    excitement,fear,gratitude,grief,joy,love,nervousness,optimism,pride,realization,
    relief,remorse,sadness,surprise,neutral
'''
import pandas as pd
import re

def get_results():
    # Read the CSV files into DataFrames
    df1 = pd.read_csv('goemotions_1.csv')
    df2 = pd.read_csv('goemotions_2.csv')
    df3 = pd.read_csv('goemotions_3.csv')

    # Concatenate the DataFrames
    df = pd.concat([df1, df2, df3])

    # Assuming 'text' is the column with the text containing tags
    # Extract the tags from the text
    # Extract the tags from the text and filter out tags that are not in uppercase
    df['tags'] = df['text'].apply(lambda x: [tag for tag in re.findall(r'\[(.*?)\]', x) if tag.isupper()])

    # Explode the lists into separate rows
    df = df.explode('tags')

    # Get the counts of unique tags
    tag_counts = df['tags'].value_counts()

    # Convert the Series to a DataFrame
    tag_counts_df = tag_counts.reset_index()
    tag_counts_df.columns = ['Tag', 'Count']

    # Save the DataFrame to a CSV file
    tag_counts_df.to_csv('results.csv', index=False)

get_results()