make sure you have `exercises` namespace

1. secret should be available at first:

```kubectl apply -f pingpong-pg/manifests/secret.yaml```

2. Go to both folders and command(log-output in root and ping-pong/pingpong)

```kubectl apply -f manifests -n exercises```

3. then check pods:```kubectl get pods -n exercises```

   Both will be `0/1` running.

4. then apply the Database:

```kubectl apply-f pingpong-pg/manifests```

  All 3 will be `1/1` running.
