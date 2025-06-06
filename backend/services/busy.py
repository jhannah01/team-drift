
import json
import urllib
import httpx


HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/54.0.2840.98 Safari/537.36"}

def index_get(array, *argv):
    try:
        for index in argv:
            array = array[index]
        return array
    except (IndexError, TypeError):
        return None

async def make_google_search_request(query_string, proxy=False):
    params_url = {
        "tbm": "map",
        "tch": 1,
        "hl": "en",
        "q": urllib.parse.quote_plus(query_string),
        "pb": "!4m12!1m3!1d4005.9771522653964!2d-122.42072974863942!3d37.8077459796541!2m3!1f0!2f0!3f0!3m2!1i1125!2i976"
              "!4f13.1!7i20!10b1!12m6!2m3!5m1!6e2!20e3!10b1!16b1!19m3!2m2!1i392!2i106!20m61!2m2!1i203!2i100!3m2!2i4!5b1"
              "!6m6!1m2!1i86!2i86!1m2!1i408!2i200!7m46!1m3!1e1!2b0!3e3!1m3!1e2!2b1!3e2!1m3!1e2!2b0!3e3!1m3!1e3!2b0!3e3!"
              "1m3!1e4!2b0!3e3!1m3!1e8!2b0!3e3!1m3!1e3!2b1!3e2!1m3!1e9!2b1!3e2!1m3!1e10!2b0!3e3!1m3!1e10!2b1!3e2!1m3!1e"
              "10!2b0!3e4!2b1!4b1!9b0!22m6!1sa9fVWea_MsX8adX8j8AE%3A1!2zMWk6Mix0OjExODg3LGU6MSxwOmE5ZlZXZWFfTXNYOGFkWDh"
              "qOEFFOjE!7e81!12e3!17sa9fVWea_MsX8adX8j8AE%3A564!18e15!24m15!2b1!5m4!2b1!3b1!5b1!6b1!10m1!8e3!17b1!24b1!"
              "25b1!26b1!30m1!2b1!36b1!26m3!2m2!1i80!2i92!30m28!1m6!1m2!1i0!2i0!2m2!1i458!2i976!1m6!1m2!1i1075!2i0!2m2!"
              "1i1125!2i976!1m6!1m2!1i0!2i0!2m2!1i1125!2i20!1m6!1m2!1i0!2i956!2m2!1i1125!2i976!37m1!1e81!42b1!47m0!49m1"
              "!3b1"
    }
    search_url = "http://www.google.com/search?" + "&".join(k + "=" + str(v) for k, v in params_url.items())
    async with httpx.AsyncClient() as client:
        if not proxy:
            resp = await client.get(search_url, headers=HEADERS)
        else:
            resp = await client.get(search_url, proxies=proxy, headers=HEADERS)
        data = resp.text.split('/*""*/')[0]
        jend = data.rfind("}")
        if jend >= 0:
            data = data[:jend + 1]
        jdata = json.loads(data)["d"]
        return json.loads(jdata[4:])

async def get_busyness(formatted_address, proxy=False):
    jdata = await make_google_search_request(formatted_address, proxy=proxy)
    info = index_get(jdata, 0, 1, 0, 14)
    current_popularity = index_get(info, 84, 7, 1)
    return current_popularity
