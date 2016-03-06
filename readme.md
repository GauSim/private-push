i'm just playing around ...

script that will run a "npm version patch" an push to registry

Run:

$ node private-push [registry]

Add to package.json scripts
```
"scripts": {
    ...
    "private-push": "node private-push http://192.168.99.100:32770",
    "postversion": "git push && git push --tags"
}
```

will read publishConfig from package.json if no [registry] is specified
```
"publishConfig": {
    "registry": "http://192.168.99.100:32770"
}
```
