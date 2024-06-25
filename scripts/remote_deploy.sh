
# -------------------------------------- Sending docker-compose.yml --------------------------------------------------

echo "[INFO] Sending docker-compose.yml to $DEPLOY_HOST_ADDRESS:~..."
echo "\> sshpass -p \$DEPLOY_HOST_USER_PASSWORD\ "
echo "   scp -o StrictHostKeyChecking=no docker-compose.yml $DEPLOY_HOST_ADDRESS:~"

if sshpass -p $DEPLOY_HOST_USER_PASSWORD\
   scp -o StrictHostKeyChecking=no docker-compose.yml $DEPLOY_HOST_ADDRESS:~;
then
	echo "[INFO] docker-compose.yml has been sent."
else
	echo "[ERROR] Couldnt send docker-compose.yml."
	exit 1
fi


# ------------------------------------------------------------------------------------------------------------------

# --------------------------------- Connecting to remote server ----------------------------------------------------

echo "[INFO] Connecting to $DEPLOY_HOST_ADDRESS..."
echo "\> sshpass -p \$DEPLOY_HOST_USER_PASSWORD\ "
echo "   ssh -o StrictHostKeyChecking=no $DEPLOY_HOST_ADDRESS bash -s < scripts/deploy.sh"


if sshpass -p $DEPLOY_HOST_USER_PASSWORD\
   ssh -o StrictHostKeyChecking=no $DEPLOY_HOST_ADDRESS bash -s < ./scripts/deploy.sh;
then
	echo "[INFO] Connection to $DEPLOY_HOST_ADDRES was closed."
	echo OK
else
	echo "[ERROR] Couldnt connect to $DEPLOY_HOST_ADDRESS"
	exit 2
fi
