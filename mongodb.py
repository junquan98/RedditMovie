from pymongo import MongoClient
import os
import json

client = MongoClient("mongodb+srv://cs242:1234@cluster0-qrekj.mongodb.net/test?retryWrites=true&w=majority")
mydb = client["app"]
mycol = mydb["movie_reviewer"]
with open('test.json') as file:
    data = json.load(file)
mycol.insert_one(data)


print(" DONE! Data has been uploaded to MongoDB Atlas.")

