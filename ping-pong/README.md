1.go to both folders and command

```kubectl apply -f manifests```

2.then use port forward to test"

```kubectl port-forward service/pingpong-svc 3001:3001 -n exercises```
