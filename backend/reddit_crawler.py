import requests
import urllib
from config import REDDIT_CRED
import json
from model import analyze

# using the username and password from config.py to get the access token from reddit
client_auth = requests.auth.HTTPBasicAuth(
    REDDIT_CRED['ID'], REDDIT_CRED['SECRET'])
post_data = {"grant_type": "client_credentials",
             "username": REDDIT_CRED['USER'], "password": REDDIT_CRED["PASSWORD"]}
headers = headers = {"User-Agent": "MovieReviewer/0.1 by michaeljavy"}


def tagDownload(tag):
    tag = tag+" review"
    tag = urllib.quote(tag.encode("utf-8"))
    reviews = {'data': []}
    response = requests.post("https://www.reddit.com/api/v1/access_token",# accquire the user token
                             auth=client_auth, data=post_data, headers=headers)
    response = response.json()
    access_token = response['access_token']
    token_type = response['token_type']
    new_headers = {"Authorization": str(
        token_type+" "+access_token), "User-Agent": "MovieReviewer/0.1 by michaeljavy"}
    response = requests.get("https://oauth.reddit.com/r/all/search?q=" + # call the search api from reddit and sort the results by relevance, only fetch the first 10 posts
                            tag+"&sort=relevance&limit=10", headers=new_headers)
    if response.status_code == 200:
        redditData = response.json()
        redditData = redditData["data"]["children"]
        # loop all of the posts and scrape all of the comments with depth 1.
        for post in redditData:
            post_id = post["data"]["id"]
            response = requests.get(
                "https://oauth.reddit.com/r/all/comments/"+post_id+"?depth=1", headers=new_headers)
            if response.status_code == 200:
                d = response.json()[1]["data"]["children"][:-1]
                for comment in d:
                    reviews['data'] += [{"up": comment["data"]["ups"], "review":comment["data"] # store the number of ups and comment url for further use cases.
                                         ["body"], "url":"https://www.reddit.com"+comment["data"]["permalink"]}]
    else:
        return None
    return analyze(tag, reviews)


if __name__ == "__main__":
    print(tagDownload("Fast%20%26%20Furious%20Presents%3A%20Hobbs%20%26%20Shaw"))
