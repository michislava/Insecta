
module "cluster" {
  source  = "terraform-aws-modules/rds-aurora/aws"

  name           = "insecta-db"
  engine         = "aurora-postgresql"
  engine_version = "14.6"
  instance_class = "db.t4g.medium"
  instances = {
    one = {} # primary inastance
  }

  master_username = var.master_username
  master_password = var.master_password

  vpc_id               = aws_vpc.main.id
  db_subnet_group_name = aws_db_subnet_group.aurora_subnet_group.name
  publicly_accessible  = true  # Enable public accessibility

  security_group_rules = {
    ex1_ingress = {
      cidr_blocks = ["0.0.0.0/0"]  # Allow access from anywhere (for testing; restrict in production)
    }
  }

  storage_encrypted   = true
  apply_immediately   = true
  monitoring_interval = 10

  enabled_cloudwatch_logs_exports = ["postgresql"]

  tags = {
    Environment = "dev"
    Terraform   = "true"
  }
}

# Output the Aurora endpoint
output "aurora_endpoint" {
  value = module.cluster.cluster_endpoint
}