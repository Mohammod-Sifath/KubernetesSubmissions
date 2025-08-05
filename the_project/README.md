
kubectl apply -f backend/manifests

kubectl apply -f frontend/manifests

then use port forward to connect:
kubectl port-forward svc/todo-service 3000:3000 -n project
kubectl port-forward -n project svc/todo-backend-service 30002:3002

You can now visit:

Frontend: http://localhost:3000

Backend API: http://localhost:30002


n.b. the app has the standerdized nodeport setup, but not accesable via k3d.becasue k3d runs on Docker on the machine.

