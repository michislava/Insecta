variable "region" {
  default = "us-east-1"
}

variable "vpc_cidr" {
  default = "10.0.0.0/16"
}

variable "subnet_cidr" {
  default = "10.0.1.0/24"
}

variable "availability_zone" {
  default = "us-east-1a"
}


variable "master_username" {
  description = "The master username for the Aurora PostgreSQL database"
  type        = string
  sensitive   = true
}

variable "master_password" {
  description = "The master password for the Aurora PostgreSQL database"
  type        = string
  sensitive   = true
}