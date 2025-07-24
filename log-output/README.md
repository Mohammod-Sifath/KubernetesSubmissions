# Kubernetes Exercise 1.7 - Log-output App with Ingress

This exercise deploys the `log-output` Node.js app to Kubernetes, exposes it via a ClusterIP Service, and sets up an Ingress resource using the Traefik ingress controller to route external traffic.

The app runs on port 3000 inside the pod and logs a UUID every 5 seconds. It also provides a `/status` endpoint returning JSON with the app's ID and start time.

## Deployment

Apply the Kubernetes manifests for deployment, service, and ingress:

```bash
kubectl apply -f manifests/deployment.yaml
kubectl apply -f manifests/service.yaml
kubectl apply -f manifests/ingress.yaml
## Exercise 1.7 - Log-output app with Ingress

This exercise adds an Ingress resource to expose the `log-output` app running inside the Kubernetes cluster.

### Resources created:

- **Pod:** Running the Node.js log-output app (listening on port 3000)
- **Service:** `log-output-svc` (ClusterIP) exposing port 3000 inside the cluster
- **Ingress:** `log-output-ingress` exposing the service on port 80 (via Traefik ingress controller)

### How to test locally:

1. Forward the ingress controller port 80 to your localhost:

kubectl port-forward --namespace kube-system svc/traefik 8080:80

2.Access the log-output app status endpoint:

http://localhost:8080/status
