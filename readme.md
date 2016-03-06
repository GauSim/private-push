
Run:

$ node private-push [registry]


Add to pkd scripts
```
"scripts": {
    ...
    "private-push": "node private-push http://192.168.99.100:32770",
    "postversion": "git push && git push --tags"
}
```
