# Web Extension for Online Sentiment Detection
## Andrew Burton, Kyle West, and Aneel Parmar
### Computer Science 571 - Winter 2024
#### Design and Implementation of Database Systems

---
## Overview
This application is designed to score Reddit users emotions in posts and comments in order to inform users about toxic online behaviour and provide insights into their own online behaviour. The application is designed to be a web extension that can be installed on a users browser and will provide a score for various commenters.
It utilizes a BERT-based model trained on the GoEmotions dataset for multilabel sequence classification to analyze the emotional content of users' recent comments. The model is trained to predict the presence of 28 emotion categories in text, and is fine-tuned on the GoEmotions dataset, which contains 58k Reddit comments labeled with these emotions.
The model is then used to score the emotional content of a user's comments, and provide a score for each of the 28 emotion categories. The scores are then aggregated to provide an overall score for the user.
This repository contains a web extension designed to score Reddit users emotions in posts and comments in order to inform users about toxic online behaviour.
> _"Understanding emotion expressed in language has a wide range of applications, from building empathetic chatbots to detecting harmful online behavior. Advancement in this area can be improved using large-scale datasets with a fine-grained typology, adaptable to multiple downstream tasks."_ 
> 
> &mdash; [GoEmotions: A Dataset of Fine-Grained Emotions](https://arxiv.org/abs/2005.00547)


## Features
- **Emotion Scoring**: Users can request emotional scores for a specific Reddit user's 10 most recent comments.
- **Emotional Thresholding**: Scores are compared against a threshold, and an emoji representing the predicted emotion(s) is displayed.
- **Confidence Visualization**: Alongside the emoji, users can view a graphical representation of the confidence of the model's predictions for each confidence label.

## Technologies
- **Frontend**: JavaScript, Node.js
- **Backend**: Django, Python, SQLite
- **Training**: Juptyer Notebook, PyTorch, GoEmotions Dataset
- **Model**: `bert-base-cased`, `albert-base-v2`, `distilbert-base-uncased`, `roberta-base` from HuggingFace Transformers

## Prerequisites
Before you begin, ensure you have the following tools installed on your system:
- [Python](https://python.org/downloads)@3.10.12
- [Node.js](https://nodejs.org/)@20.11.1

## Get Started
Follow these steps to clone and run this project
1. **Clone the Repository** You will also need to set up a reddit API key, include the following in a `.env` file located in the `*/backend/core` directory:
    ```env
    REDDIT_CLIENT_ID=<Your ClientID>
    REDDIT_CLIENT_SECRET=<Your Client Secret>
    REDDIT_USER_AGENT=<Your User Agent>
    MODEL=<the name of the model you want to use>
    ```
   Note: The model should be located in the `*/backend/core/sentiment/` directory.
2. **Create a Virtual Environment for Python** This will help encapsulate any dependencies, and ensure that the projects requirements are as slim as possible
    ```shell
   # Create a virtual environment
   python -m venv venv
   
   # Activate the virtual environment (Windows)
   # venv\Scripts\activate
   
   # Activate the virtual environment (MacOS/Linux)
   source venv/bin/activate
    ```
   Now if this is a fresh install or if any dependencies have changed through this projects VCS you will need to update the backend python dependencies.
    ```shell
    pip install -r requirements.txt
    ```
3. **Train the Model**
    Run the Jupyter Notebook `GoEmotionTesting.ipynb` in the `*/backend/training/` to train a model. Once the model is trained, move the model directory into the `core/sentiment/` directory. Note that different base models can be used by updating the model index in the notebook.
4. **Run the Django Application**
   Be sure to run the following command in the same directory as the manage.py file (backend/).
   ```shell
   python manage.py runserver
   ```
5. **Install npm Dependencies**
    From the `web extension` directory, you will need to run the following command:
    ```shell
    npm install
    ```
6. **Run the Web Extension**
    To build the web extension alongside its dependencies, run the following command from the `web extension` directory:
    ```shell
    npm run build
    ```

## Updates to Models (Backend)
When updating a model, the following steps should be taken:
1. Clean-up:
    Delete the `*/backend/core/db.sqlite3` file
2. Re-make all migrations:
    Navigate to `*/backend/core/` and run the following commands:
    ```bash
    python manage.py makemigrations sentiment
    python manage.py migrate sentiment
    ```
3. Run the server:
    ```bash
    python manage.py runserver
    ```

## Updates to Web Extension (Frontend)
When updating the web extension, the following steps should be taken:
1. Run the following command from the `web extension` directory:
    ```shell
    npm run build
    ```
## How to load the extensison
Once you have everything setup by this point now it's time to load the extension.
# For Firefox (We need to change some permissions in the manifest so currently this doesn't work)
1. **Open your browser and navigate to:**
    `about:debugging#/runtime/this-firefox`
2. **Under Temporary Extensions Click Load Temporary Add-on**
    select the `~/web extension/manifest.json` file for this project and load it.
3. **Navigate to Reddit.com and enable to extension in the extension toolbar**

4. **Congratulations you're now running the extension**


# For Chrome
1. **Open your browser and navigate to:**
    `chrome://extensions`

2. **Enable Developer Mode by toggling the switch next to Developer Mode**

3. **Click the load unpacked button**
    Select the `~/web extension/manifest.json` file for this project and load it.

3. **Navigate to Reddit.com and enable to extension in the extension toolbar**

4. **Congratulations you're now running the extension**