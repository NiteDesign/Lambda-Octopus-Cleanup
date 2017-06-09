# Lambda-Octopus-Cleanup
Lambda function to remove terminated EC2 instances from an Octopus server  

Requires (2) Lambda environment variables  
**apikey:**  An API Key provided by your Octopus server which has permissions to View and Delete machines.  This key should be encrypted using KMS.  
**octopusServer:**  The endpoint to access your Octopus server, ie:  _octopus.local.domain_  
