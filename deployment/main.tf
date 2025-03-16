# Create a VPC
resource "aws_vpc" "insecta_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "insecta-vpc"
  }
}

# Create two public subnets in different AZs
resource "aws_subnet" "insecta_public_subnet_1" {
  vpc_id            = aws_vpc.insecta_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  tags = {
    Name = "insecta-public-subnet-1"
  }
}

resource "aws_subnet" "insecta_public_subnet_2" {
  vpc_id            = aws_vpc.insecta_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1b"
  tags = {
    Name = "insecta-public-subnet-2"
  }
}
# Create an Internet Gateway
resource "aws_internet_gateway" "insecta_igw" {
  vpc_id = aws_vpc.insecta_vpc.id
  tags = {
    Name = "insecta-igw"
  }
}

# Create a route table for the public subnet
resource "aws_route_table" "insecta_public_rt" {
  vpc_id = aws_vpc.insecta_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.insecta_igw.id
  }
  tags = {
    Name = "insecta-public-rt"
  }
}


# Associate the public subnets with the public route table
resource "aws_route_table_association" "insecta_public_rta_1" {
  subnet_id      = aws_subnet.insecta_public_subnet_1.id
  route_table_id = aws_route_table.insecta_public_rt.id
}

resource "aws_route_table_association" "insecta_public_rta_2" {
  subnet_id      = aws_subnet.insecta_public_subnet_2.id
  route_table_id = aws_route_table.insecta_public_rt.id
}

# Create a security group for the EC2 instance
resource "aws_security_group" "insecta_ec2_sg" {
  vpc_id = aws_vpc.insecta_vpc.id
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Name = "insecta-ec2-sg"
  }
}

# Create an EC2 instance
resource "aws_instance" "insecta_ec2" {
  ami                    = "ami-0c02fb55956c7d316" # Amazon Linux 2 AMI
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.insecta_public_subnet_1.id
  vpc_security_group_ids = [aws_security_group.insecta_ec2_sg.id] # Use vpc_security_group_ids instead of security_groups
  key_name               = "insecta-key-pair"
  tags = {
    Name = "insecta-ec2"
  }
}
# Create an Aurora database
resource "aws_rds_cluster" "insecta_aurora" {
  cluster_identifier = "insecta-aurora-cluster"
  engine             = "aurora-postgresql"
  engine_version     = "14.6"
  database_name      = "insecta_db"
  master_username    = var.master_username
  master_password    = var.master_password
  skip_final_snapshot = true
  vpc_security_group_ids = [aws_security_group.insecta_ec2_sg.id]
  db_subnet_group_name = aws_db_subnet_group.insecta_db_subnet_group.name
}

resource "aws_db_subnet_group" "insecta_db_subnet_group" {
  name       = "insecta-db-subnet-group"
  subnet_ids = [aws_subnet.insecta_public_subnet_1.id, aws_subnet.insecta_public_subnet_2.id]
  tags = {
    Name = "insecta-db-subnet-group"
  }
}

# Create an ECR repository for frontend and backend images
resource "aws_ecr_repository" "insecta_frontend_repo" {
  name = "insecta-frontend"
}

resource "aws_ecr_repository" "insecta_backend_repo" {
  name = "insecta-backend"
}

output "ec2_public_ip" {
  value = aws_instance.insecta_ec2.public_ip
}

output "aurora_endpoint" {
  value = aws_rds_cluster.insecta_aurora.endpoint
}

output "frontend_ecr_repo_url" {
  value = aws_ecr_repository.insecta_frontend_repo.repository_url
}

output "backend_ecr_repo_url" {
  value = aws_ecr_repository.insecta_backend_repo.repository_url
}