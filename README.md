# apps-script-aws-request

[![version](https://img.shields.io/badge/code%20version-0.1.0-blue.svg?style=flat-square)]()
[![Travis](https://img.shields.io/travis/wmakeev/apps-script-aws-request.svg?maxAge=1800&style=flat-square)](https://travis-ci.org/wmakeev/apps-script-aws-request)
[![Coveralls](https://img.shields.io/coveralls/wmakeev/apps-script-aws-request.svg?maxAge=1800&style=flat-square)](https://coveralls.io/github/wmakeev/apps-script-aws-request)
[![bitHound DevDependencies](https://img.shields.io/bithound/devDependencies/github/wmakeev/apps-script-aws-request.svg?maxAge=1800&style=flat-square)](https://www.bithound.io/github/wmakeev/apps-script-aws-request/master/dependencies/npm)

> An interface to authenticate AWS api requests from within google apps scripts.

Originaly forked from [smithy545/aws-apps-scripts](https://github.com/smithy545/aws-apps-scripts)

## Setup

### Use public library

**Script ID:** ```1UmToPBwCgl8rjKHqqkgthduXt36tvv4CF985DEE0WAtx9UXFgA-QJ97n```

1. Create a new project in google scripts.

2. Go `Resources → Libraries`.

3. Copy paste Script ID to `Add a library` field and press `Add`.

4. Select version and specify identifier as `AWS`.

### Create you own library

1. Create a new project in google scripts.

2. Copy paste `dist/aws-request.js` in your project file and save it.

3. Go `File → Manage versions` and press `Save new version`.

4. You can press `Share` and make it public.

5. Copy you library Script ID from `File → Project properties → Script ID`

6. Use new library with you Script ID in other projects [Use public library](#use-public-library).

### Use in same file with other scripts

1. Create a new project in google scripts.

2. Create new file in you project by template

  ```js
  var AWS = (function () {

    // Copy paste `dist/aws-request.js` content here

    return { request: request }
  })()
  ```

## Usage

Example with lambda function invocation

```js
var path = '/2015-03-31/functions/hello/invocations';
var event = {
  name: 'Google'
};

var result = AWS.request({
  accessKey: AWS_ACCESS_KEY,
  secretKey: AWS_SECRET_KEY,
  service: 'lambda',
  region: 'eu-west-1',
  method: 'POST',
  path: path,
  payload: event
});

Logger.log(result.getResponseCode()); // ➝ 200
Logger.log(result.getContentText());  // ➝ { "message": "Hello Google!" }
```

## API

### `AWS.request(params: Object): HTTPResponse`

Where **`params`**:

Field name | Type  | Default value | Description |
-----------|-------|---------------|-------------|
`accessKey` | `string` | `N/A` (required) | AWS access key |
`secretKey` | `string` | `N/A` (required) | AWS secret key |
`service` | `string` | `N/A` (required) | AWS service (e.g. `ec2`, `iam`, `codecommit`) |
`region` | `string` | `us-east-1` | AWS region |
`path` | `string` | `/` | Path to api function (without query) |
`query` | `Object` | `{}` | Query string parameters (e.g. `{ Action: "ListUsers" }`) |
`method` | `string` | `GET` | Http method (e.g. `GET`, `POST`) |
`headers` | `Object` | `{}` | Http request headers `Host`, and `X-Amz-Date` are premade
   for you |

Returns [HTTPResponse](https://developers.google.com/apps-script/reference/url-fetch/http-response)

## License

ISC © Vitaliy V. Makeev
