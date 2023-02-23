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

variable "AWS_REGION" {
  type = string
  default = "us-east-1"
}

variable "AWS_SECRET_ACCESS_KEY" {
  type = string
  default = ""
}

variable "DB_PASSWORD" {
  type = string
  default =   "${env("DB_PASSWORD")}"
}

variable "AMI_USER" {
  type = string
  default =  ""
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


  ami_users = [var.AMI_USER]
  instance_type = "t2.micro"
  ssh_username = "ec2-user"
  access_key = var.AWS_ACCESS_KEY
  secret_key = var.AWS_SECRET_ACCESS_KEY
  region = var.AWS_REGION
}

build {
  sources = [
    "source.amazon-ebs.userapp"
  ]

  provisioner "file" {
    source = "webapp.zip"
    destination = "~/"
  }

  provisioner "shell" {
    inline = [
      "cd ~",
      "sudo mkdir -p webapp",
      "sudo chmod 755 webapp",
      "sudo unzip webapp.zip -d ~/webapp"
    ]
  }

  provisioner "shell" {
    script = "./app.sh"
    environment_vars = [
      "DB_PASSWORD=${var.DB_PASSWORD}"
    ]
  }
}