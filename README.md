# Goand
Wrapper for fetch. Description in-progress ;-)

## Options object

| Setting             | Possible values (*default)                 |
| :------------------ | ----------------------------: |
| body (1)            | blank
| cache               | *default, no-cache, no-store, reload, force-cache, only-if-cached 
| callback            | function *logError
| credentials         | include, *same-origin, omit
| error               | Custom error-function
| header(2)           | blank
| integrity(3)        | blank
| isHistoryNavigation | false
| isReloadNavigation  | false
| keepalive           | false
| method              | *GET, POST, PUT, DELETE
| mode                | no-cors, cors, *same-origin
| parser              | Custom parser-function (response)
| redirect            | manual, *follow, error
| referrer            | no-referrer, *client
| referrerPolicy      | *no-referrer-when-downgrade, no-referrer, origin", origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
| spinner             | Custom spinner-function (boolean)
| timeout(4)          | *9999

(1) Data type must match "Content-Type" header  
(2) { "Content-Type": "application/json" } etc.  
(3) Example: 'sha256-abd'  
(4) Timeout in milliseconds

## Error callback
If an error occurs, it is normally sent to the built-in method `logError`.  
You can specify a custom `error`-method in the `options`-object.

## Parser callback
By default, a `response` is parsed through the `setResponse`-method, that will return `json` or `text`.  
You can specify a custom `parser`-method in the `options`-object.

## Spinner callback
A dummy _spinner_-method is triggered _before_ a fetch and when it's completed.  
You can specify a custom `spinner`-method in the `options`-object (must recieve a boolean as it's single parameter).

## Examples
_See `index.html` for more_

```js
import goand from './goand.mjs';

(async () => {
  const data = await goand('https://jsonplaceholder.typicode.com/albums/?_limit=10&q=lorem', {
    error: myError,
    mode: 'cors',
    spinner: mySpinner
  });
  console.log(data);
})();

goand('//dawa.aws.dk/adresser/autocomplete?side=1&per_side=10&q=marievej', {
  error: myError,
  mode: 'cors',
  timeout: 3000
}).then(data => {
  console.log(data);
});

goand('//httpstat.us/500', {
  error: myError,
  mode: 'cors'
}).then(data => {
  console.log(data);
});

goand('logifront.svg', {
  parser: myParser
}).then(data => {
  console.log(data);
});
```