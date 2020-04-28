import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
import pickle
import json
import sys
import math
import ast


def analyze(title, l):
    l = l['data']
    data = []
    metadata = []
    for o in l:
        data += [o['review']]
        metadata += [{'url': o['url'], 'up':o['up'], 'review':o['review']}]
    _min_df = 10
    _max_df = 10000
    _stop_words = ['student']
    vocabulary_ = {}
    with open("vocab.txt", "r") as f:
        t = f.read()[:-1]
        vocabulary_ = eval(t)
    vectorizer = CountVectorizer(
        vocabulary=vocabulary_, min_df=_min_df, max_df=_max_df, stop_words=_stop_words)
    X = vectorizer.transform(data)
    test_data = X.toarray()

    if len(test_data) == 0:
        return "NOTHING"
    lr = pickle.load(open('model.sav', 'rb'))
    predicted = lr.predict_proba(test_data)

    output = {}
    count = 0
    num_good = 0
    for i in range(len(predicted)):
        if(predicted[i][1] > 0.6):
            output[str(i)] = {'review': data[i], 'feedback': 'Good',
                              'up': predicted[i][1], 'url': metadata[i]['url']}
            num_good += 1
            count += 1
        elif(predicted[i][1] < 0.3):
            output[str(i)] = {'review': data[i], 'feedback': 'Bad', 'up': (
                0.95-predicted[i][1]), 'url': metadata[i]['url']}
            count += 1

    sortOutput = []
    indexs = sorted(output, key=lambda k: output[k]['up'], reverse=True)[:6]
    for key in indexs:
        #   dic = {}
        #   dictTem = output[key]
        #   dic[key] = dictTem
        sortOutput.append(output[key])
    output = {}
    output["title"] = title[:-6]
    output["score"] = math.floor((float(num_good)/float(count))*100)
    output["valid_reviews_count"] = str(count)
    output["reviews"] = sortOutput
    return json.dumps(output)
