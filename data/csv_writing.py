import csv
import pprint
from datetime import datetime
from bs4 import BeautifulSoup
import requests

import subprocess
import sys
subprocess.call([sys.executable, "-r", "pip3", "install", 'requirements.txt'])


load_url = "https://www.jma.go.jp/jp/amedas_h/today-61326.html?areaCode=000&groupCode=44"
html = requests.get(load_url)
soup = BeautifulSoup(html.content, "html.parser")
actuallyMaxTemp = soup.find_all(class_="td_arrange middle")[0].text
actuallyMinTemp = soup.find_all(class_="td_arrange top")[1].text

today = datetime.today().strftime("%Y/%-m/%-d")
with open('/Users/odatesshuu/program/react-starter-master/data/kyoto.csv', 'a', newline='') as f:
    writer = csv.writer(f)
    writer.writerow([today, actuallyMaxTemp, actuallyMinTemp])
