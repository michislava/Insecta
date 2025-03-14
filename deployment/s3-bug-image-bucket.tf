provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "bug_images_bucket" {
  bucket = "insecta-bug-images-bucket"

  tags = {
    Name        = "Insecta Images Bucket"
    Environment = "Production"
  }
}

resource "aws_s3_bucket_ownership_controls" "bug_images_ownership_controls" {
  bucket = aws_s3_bucket.bug_images_bucket.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_versioning" "bug_images_versioning" {
  bucket = aws_s3_bucket.bug_images_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "bug_images_encryption" {
  bucket = aws_s3_bucket.bug_images_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Block public access to the bucket
resource "aws_s3_bucket_public_access_block" "bug_images_public_access_block" {
  bucket = aws_s3_bucket.bug_images_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}