import urllib.request
import json
import os

repo = "cienicera/p5.js-mint"
req = urllib.request.Request(f"https://api.github.com/repos/{repo}/git/trees/main?recursive=1", headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read())
for item in data.get("tree", []):
    print(item["path"])
    if item["type"] == "blob":
        blob_req = urllib.request.Request(f"https://api.github.com/repos/{repo}/git/blobs/{item['sha']}", headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(blob_req) as blob_resp:
            import base64
            blob_data = json.loads(blob_resp.read())
            content = base64.b64decode(blob_data["content"]).decode()
            print(f"=== {item['path']} ===")
            print(content)
            print()
