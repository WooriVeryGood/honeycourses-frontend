export type AmplifyDependentResourcesAttributes = {
  "analytics": {
    "honeycoursesfrontend": {
      "Id": "string",
      "Region": "string",
      "appName": "string"
    }
  },
  "api": {
    "honeyApi": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    }
  },
  "auth": {
    "honeycoursesfrontend": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "function": {
    "honeyCoursesApi": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  }
}