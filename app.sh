#!/bin/bash

sleep 30

sudo yum upgrade -y
sudo yum update -y

#install node version 16
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs

#Permission for ec2 user
chmod 755 /home/ec2-user

#Install pm2
sudo npm install pm2@latest -g

#
cd ~/webapp

sudo mkdir -p ~/logs
#Start app using pm2
sudo pm2 startup systemd --service-name webapp
sudo pm2 start ecosystem.config.cjs
sudo pm2 save
sudo pm2 list

# install cloud watch
sudo yum install amazon-cloudwatch-agent -y
#Starting the cloud watch agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/home/ec2-user/webapp/cloud-watch-config.json -s
sudo systemctl start amazon-cloudwatch-agent.service
