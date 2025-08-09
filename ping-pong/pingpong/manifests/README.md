Start Both Apps:

kubectl apply -f manifests

option 1:
Using kubectl port-forward:
kubectl port-forward deployment/pingpong-deployment 3001:3001
then:http://localhost:3001/pingpong

for live logs(increment in every 5 sec):
kubectl logs -f deployment/log-output-deployment

Option 2: Using NodePort (if supported in your k3d cluster)
NodePort exposure is defined in each Service YAML file:

pingpong service: nodePort: 30001
log-output service: nodePort: 30002

You can try accessing in browser:
http://localhost:30001/pingpong
http://localhost:30002
