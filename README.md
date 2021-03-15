# social-security-tool-functions

### Develop & Deploy
#### Requirements
- Node and npm: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
- Azure Functions Core Tools: https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=macos%2Ccsharp%2Cbash 

#### Develop locally 
In order to run&debug the functions locally, run `func start` and follow the instructions on the terminal.

```
 Now listening on: http://0.0.0.0:7071
 Application started. Press Ctrl+C to shut down.

 Http Functions:

         SocialSecurity: [GET,POST] http://localhost:7071/api/SocialSecurity
```

Now you can make requests (GET and POST) to http://localhost:7071/api/SocialSecurity.

#### Deploy to Azure

Assuming you have access to the current resource group you can re-deploy the code running `func azure functionapp publish social-security-tool-function`. 

You will be prompted with a new token, but the invoke URL will stay the same. Eg `https://social-security-tool-function.azurewebsites.net/api/SocialSecurity?code=<TOKEN>`.

If you need to create a new resource group for the functions, follow the official docs https://docs.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-node?tabs=azure-cli%2Cbrowser#create-supporting-azure-resources-for-your-function 

### Usage
#### Input

```json
{
  "residency": [
    {
      "country": "Netherlands"
    }
  ],
  "workplaces": [
    {
      "location": "Netherlands",
      "union": "EU",
      "employment": "Employee",
      "hours": "10"
    },
    {
      "location": "Belgium",
      "union": "EU",
      "employment": "Self-employed",
      "hours": "30"
    }
  ]
}
```

#### Output
```json
{
  "type": "country",
  "country": "Netherlands",
  "case": "CASE 3"
}
```
