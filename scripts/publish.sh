SERVICE_NAME=$1

echo \> "docker login $REGISTRY_ADDRESS -u $REGISTRY_LOGIN -p $REGISTRY_PASSWORD"
docker login $REGISTRY_ADDRESS -u $REGISTRY_LOGIN -p $REGISTRY_PASSWORD

echo \> "docker push $REGISTRY_LOGIN/$SERVICE_NAME:$CI_PIPELINE_ID"
docker push $REGISTRY_LOGIN/$SERVICE_NAME:$CI_PIPELINE_ID