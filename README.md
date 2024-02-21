# Web Extension for Online Sentiment Detection
## Andrew Burton, Kyle West, Aneel Parmar
### Computer Science 571 - Winter 2024
#### Design and implementation of Database Systems

 This repository contains a web extension designed to score Reddit users emotions in posts and comments in order to inform users about toxic online behaviour.

## Prerequisites
Before you begin, ensure you have the following tools installed on your system:
- [Python](https://python.org/downloads)@3.10.12
- [Node.js](https://nodejs.org/)@20.11.1

## Get Started
Follow these steps to clone and run this project
1. **Clone the Repository**
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
3. **Run the Django Application**
   Be sure to run the following command in the same directory as the manage.py file (backend/).
   ```shell
   python manage.py runserver
   ```
4. **Install npm Dependencies**
    From the frontend directory, you will need to run the following command:
    ```shell
    npm install
    ```
5. **Run the Web Extension**
    ```shell
    npm run build
    ```

## Updates to Models (Backend)
When any of the models.py files are updated:
1. Clean-up:
    Delete the `*/uprojects/backend/db.sqlite3` file
2. Re-make all migrations:
    Navigate to `*/uprojects/backend/`
    If you have not made migrations before execute:
    ```bash
    python manage.py makemigrations users
    python manage.py makemigrations projects
    python manage.py migrate users
    python manage.py migrate projects
    ```
    If you have made migrations for both users and projects before execute:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```
3. Run
    If you need the forntend running, follow the instructions for building and running the docker containers.
    If you only need the backend running, execute:
    ```bash
    python manage.py runserver
    ```

## How to inspect Serializer relationships (Backend)
1.  Make migrations as above. 
2.  Open the Django shell
    ```bash
    python manage.py shell
    ```
3. Using the custom serializer inspection function:
    ```python
    # Check all serializers
    from api.checkSerial import * # Prints out info for all serializers. 
                                  # Produces list of problem Serializers
    ```
    To check individual Serializers:
    ```python
    # Check all serializers
    from api.checkSerial import func_test 
    func_test(ExampleSerializer)
    ```
