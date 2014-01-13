# color-cluster

Give it CSS files, it spits out JSON with clusters of colors.

```
$ color-cluster main.css other.css
```

You'll probably want to use it like this:

```
$ tree-watch . "**/*.scss" | color-cluster | json-stream-inspect
```

Or as a module. More docs soon, and a consumer tool.