import urllib.request
import json

req = urllib.request.Request("https://api.github.com/repos/cienicera/p5.js-mint/issues/34", headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as resp:
    print(resp.read().decode())

req2 = urllib.request.Request("https://api.github.com/repos/cienicera/p5.js-mint/pulls?state=all", headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req2) as resp:
    print(resp.read().decode())
