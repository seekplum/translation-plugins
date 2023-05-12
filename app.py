# -*- coding: utf-8 -*-
import os
import re

import requests
from flask import Flask, jsonify, request

app = Flask(__name__)

API_URL = "https://api.openai.com/v1/chat/completions"
API_KEY = os.getenv("API_KEY", "")


def detect_language(text):
    regex = r"[\u4e00-\u9fa5]"
    return "zh" if re.search(regex, text) else "other"


@app.route("/process_text", methods=["POST"])
def process_text():
    origin = request.headers.get("Origin")
    # if origin != "chrome-extension://fbfieflfejnjkdhdoonbkdhhejhkelie":

    if "chrome-extension" not in origin:
        return "Unauthorized", 401

    data = request.get_json()
    selected_text = data["text"]

    language = detect_language(selected_text)
    if len(selected_text) > 700:
        prompt = '请用中文对 "' + selected_text + '" 进行总结，使用以下模板： ### 总结\n###要点\n-{emoji}要点,最多列出 7 个要点'

    else:
        prompt = f'请翻译成中文： "{selected_text}"' if language == "other" else f'请用中文说下这是什么意思： "{selected_text}"'

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}",
    }
    body = {
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 500,
        "temperature": 0.7,
        "n": 1,
        "model": "gpt-3.5-turbo",
    }
    response = requests.post(API_URL, headers=headers, json=body)
    return jsonify(response.json())


if __name__ == "__main__":
    app.run(debug=True)
