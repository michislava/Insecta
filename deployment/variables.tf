# variables.tf

variable "master_username" {
  description = "The master username for the Aurora PostgreSQL database"
  type        = string
  sensitive   = true  # Marks the variable as sensitive (Terraform v0.14+)
}

variable "master_password" {
  description = "The master password for the Aurora PostgreSQL database"
  type        = string
  sensitive   = true  # Marks the variable as sensitive (Terraform v0.14+)
}