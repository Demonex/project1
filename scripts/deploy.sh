echo "\> docker login $REGISTRY_ADDRESS -u $REGISTRY_LOGIN -p $REGISTRY_PASSWORD"
docker login $REGISTRY_ADDRESS -u $REGISTRY_LOGIN -p $REGISTRY_PASSWORD

echo "\> env CI_PIPELINE_ID=$CI_PIPELINE_ID docker-compose up --with-registry-auth  "
env CI_PIPELINE_ID=$CI_PIPELINE_ID \
docker-compose up --with-registry-auth 
