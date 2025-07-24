# Exercise 1.6 – NodePort Service for Todo App

This directory contains Kubernetes manifests for deploying the `todo-app` and exposing it using a **NodePort** service.

## How to deploy

Make sure your k3d cluster is set up with ports forwarded for agent node 0 (as required for NodePort):

´´´bash
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2´´´

Then, apply the deployment and service:

kubectl apply -f manifests
