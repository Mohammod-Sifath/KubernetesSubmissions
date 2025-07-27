kubectl apply -f backend/manifests
kubectl apply -f frontend/manifests

then, go to http://localhost:30000

If localhost:30000 doesn't work, make sure the cluster allows NodePort 30000.
You can change the port in the frontend/todo-service.yaml file if needed.
