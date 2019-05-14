# Goand
Wrapper for fetch. Description in-progress ;-)

## Options object

| Setting             | Possible values (*default)                 |
| :------------------ | ----------------------------: |
| body (1)            | blank
| cache               | *default, no-cache, no-store, reload, force-cache, only-if-cached 
| callback            | function *logError
| credentials         | include, *same-origin, omit
| error               | Callback error-function
| files(2)            | input[type=file].files or array of file-objects
| header(3)           | blank
| integrity(4)         | blank
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
| timeout(5)          | 3000

(1) Data type must match "Content-Type" header  
(2) Files array (FileReader) or input[type=file].files  
(3) { "Content-Type": "application/json" } etc.  
(4) Example: 'sha256-abd'  
(5) Timeout in milliseconds

## Error callback
If an error occurs, it is normally sent to the built-in method: _logError_. By specifying a custom error method, the error is sent to that.

## Spinner callback
A dummy _spinner_-method is triggered before a fetch and when it's completed. By specifying a custom _spinner_-method (must recieve a boolean as it's sinbgle parameter), that functin is run.

## Examples

```js
import goand from './goand.mjs';

(async () => {
  const data = await goand('https://jsonplaceholder.typicode.com/albums/?_limit=10&q=lorem',{ mode: 'cors' });
  console.log(data);
})();

goand('//dawa.aws.dk/adresser/autocomplete?side=1&per_side=10&q=marievej', { mode: 'cors', timeout: 3000 }, myError).then(data => {
  console.log(data);
});

goand('//httpstat.us/500', { mode: 'cors' }, myError).then(data => {
  console.log(data);
});
```