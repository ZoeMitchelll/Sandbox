import requests
from bs4 import BeautifulSoup


scrappedPage = requests.get("https://theisraelofgod.com/text-lessons/")
soup = BeautifulSoup(scrappedPage.content, 'html.parser')
pageContent = open('iog-pdf-lessons.txt','w',encoding="utf-8") # we include the encoding to avoid UnicodeEncodeError
for a in soup.find_all('a', href=True):
    if 'pdf' in a['href'] and 'information-booker' not in a['href']:
        pageContent.write(a.text+":"+a['href']+"\n")
pageContent.close
