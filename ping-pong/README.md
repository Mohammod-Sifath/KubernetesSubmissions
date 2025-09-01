make sure you have `exercises` namespace

W will chekc the readiness and livenss probe by  giving wrong password credential.

1. apply wrong secret at first:

```kubectl apply -f pingpong-pg/manifests/secret.yaml```

2. Go to both folders and command(log-output in root and ping-pong/pingpong)

```kubectl apply -f manifests -n exercises```

3. then check pods:```kubectl get pods -n exercises -w```

   Both will be `0/1` running.

4. then check both pods: ```kubectl describe pod "pod-name" -n exercises```
   you will find readiness and liveness fails in both after sometimes. 

5. Then edit and change the secret.yaml to CORRECT password and apply the secret again. 
 
6. then apply the Database:

```kubectl apply-f pingpong-pg/manifests```

7. Restart both apps so that they reload the new correct secret.yaml:

````kubectl rollout restart deployment log-output-deployment -n exercises

kubectl rollout restart deployment pingpong-deployment -n exercises```

All new 3 pods will be `1/1` running.
