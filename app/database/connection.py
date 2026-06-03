from dotenv import load_dotenv #dotenv is used to load environment variables from a .env file. 

#This is useful for keeping sensitive information like database credentials out of the codebase.

import os
import psycopg2 #psycopg2 is a PostgreSQL adapter for Python. 
                # It allows Python code to interact with a PostgreSQL database.
""" 
   python -> psycopg2 -> PostgreSQL database
"""
load_dotenv()

def get_connection():
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        port=os.getenv("DB_PORT")
    )

    return conn