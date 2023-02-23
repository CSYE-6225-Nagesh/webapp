#!/bin/bash

sleep 30

sudo yum update -y

#install node version 16
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs

#Permission for ec2 user
chmod 755 /home/ec2-user

#Install pm2
sudo npm install pm2@latest -g

#install mysql mariadb
sudo yum install mariadb mariadb-server -y

sudo systemctl start mariadb

sudo mysqladmin -u root password "nagesh1610"

mysqladmin -u root --password=nagesh1610 --host=localhost --port=3306 create csye_database

sudo systemctl enable mariadb

# install unzip
sudo yum install unzip -y

#Get inside the application
cd ~/ && unzip webapp.zip
cd ~/webapp && npm ci

sudo mkdir -p ~/logs
#Start app using pm2
sudo pm2 startup systemd --service-name webapp
sudo pm2 start ecosystem.config.cjs
sudo pm2 save
sudo pm2 list
