/**
 * Extends Error Object with FetchError, including http-status-code
 * @module FetchError
 */
class FetchError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'FetchError';
    this.message = message;
    this.status = status;
  }
}

/**
 * @function gofor
 * @param {String} url
 * @param {Object} options
 * @param {Function} callback Custom error callback-function
 * @param {Function} spinner Custom spinner function (called with `true` and `false`)
 * @description Wrapper for fetch with default options, error callback, spinner callback
 */
export default function goand(
  url,
  options,
  callback = logError,
  spinner = bool => {
    return bool;
  }
) {
  const settings = Object.assign(
    {
      body: '',
      cache: 'default',
      credentials: 'same-origin',
      headers: '',
      integrity: '',
      isHistoryNavigation: false,
      isReloadNavigation: false,
      keepalive: false,
      method: 'GET',
      mode: 'same-origin',
      redirect: 'follow',
      referrer: 'client',
      referrerPolicy: 'no-referrer-when-downgrade',
      timeout: 9999
    },
    options
  );
  console.log(url, settings);
  /* Clean up settings before fetch() */
  const timeout = settings.timeout;
  settings.timeout = '';
  Object.entries(settings).forEach(([key, value]) => {
    if (!value) {
      delete settings[key];
    }
  });

  /* Set spinner */
  spinner(true);

  /* Handle timeout / AbortController */
  if ('AbortController' in window) {
    const controller = new AbortController();
    const signal = controller.signal;
    settings.signal = signal;
    setTimeout(() => controller.abort(), timeout);
  }

  return fetch(url, settings)
    .then(handleErrors)
    .then(response => setResponse(response))
    .then(result => result)
    .catch(error => {
      if (error.name === 'AbortError') {
        callback({
          name: 'FetchError',
          message: `Timeout after ${timeout} milliseconds.`,
          status: 524
        });
      } else {
        callback(error);
      }
    })
    .finally(() => {
      spinner(false);
    });
}

/**
 * @function handleErrors
 * @param {Object} response Response Object from fetch()
 * @description Throws a new ApiError if response !== ok
 */
function handleErrors(response) {
  if (!response.ok) {
    throw new FetchError(response.statusText, response.status);
  }
  return response;
}

/**
 * @function logError
 * @param {Object} error Error Object
 * @description Logs an error to console, if no custom error-callback is specified
 */
function logError(error) {
  console.dir(error);
}

/**
 * @function setResponse
 * @param {Object} response Response Object from fetch()
 * @description Depending on contentType, returns json, text
 */
function setResponse(response) {
  const contentType = response.headers.get('content-type');
  /*TODO: arrayBuffer, blob, document, json, text 
  var parser = new DOMParser();

        // Parse the text
        var doc = parser.parseFromString(html, "text/html");
  
  */
  const isJSON = contentType.includes('application/json');
  return isJSON ? response.json() : response.text();
}
