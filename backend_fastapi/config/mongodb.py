"""MongoDB connection using MongoEngine."""
import os
from mongoengine import connect
from config.settings import get_mongodb_uri, get_db_name


def init_db():
    mongodb_url = get_mongodb_uri()
    db_name = get_db_name()

    if f"/{db_name}" not in mongodb_url and not mongodb_url.endswith("/"):
        mongodb_url += f"/{db_name}"

    if mongodb_url.startswith("mongodb+srv://"):
        if "?" not in mongodb_url:
            mongodb_url += "?retryWrites=true&w=majority"
        elif "retryWrites" not in mongodb_url:
            mongodb_url += "&retryWrites=true&w=majority"

    try:
        connect(host=mongodb_url, db=db_name)
        print(f"✓ Successfully connected to MongoDB database: {db_name}")
        return True
    except Exception as e:
        error_msg = str(e)
        print(f"✗ Error connecting to MongoDB: {error_msg}")
        raise
