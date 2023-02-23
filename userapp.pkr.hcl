packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

locals {
  timestamp = regex_replace(timestamp(), "[- TZ:]", "")
}

variable "AWS_ACCESS_KEY" {
  type = string
  default = ""
}

variable "AWS_SECRET_ACCESS_KEY" {
  type = string
  default = ""
}

source "amazon-ebs" "userapp" {
  ami_name = "userapp-app-${local.timestamp}"

  source_ami_filter {
    filters = {
      name                = "amzn2-ami-hvm-2.*.1-x86_64-gp2"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["amazon"]
  }
  # source_ami = "ami-013a129d325529d4d"


  instance_type = "t2.micro"
  region = "us-west-2"
  ssh_username = "ec2-user"
  access_key = var.AWS_ACCESS_KEY
  secret_key = var.AWS_SECRET_ACCESS_KEY
}

build {
  sources = [
    "source.amazon-ebs.userapp"
  ]

  provisioner "file" {
    source = "./userapp.zip"
    destination = "/home/ec2-user/userapp.zip"
  }

  provisioner "file" {
    source = "./userapp.zip"
    destination = "/home/ec2-user/userapp.zip"
  }

  provisioner "shell" {
    script = "./app.sh"
    environment_vars = [
      // "DB_PASSWORD = {{user `DB_PASSWORD`}}"
    ]
  }
}