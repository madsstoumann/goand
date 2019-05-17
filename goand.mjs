/**
 * Goand
 * @module /goand.mjs
 * @version 0.9.0
 * @author Mads Stoumann
 * @description Wrapper for fetch with timeout, custom error-, parser- and spinner-callbacks.
 */

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
 * @function goand
 * @param {String} url
 * @param {Object} options
 * @description Wrapper for fetch with default options and custom callbacks
 */
export default function goand(url, options) {
  const settings = Object.assign(
    {
      body: '',
      cache: 'default',
      credentials: 'same-origin',
      error: logError,
      headers: '',
      integrity: '',
      isHistoryNavigation: false,
      isReloadNavigation: false,
      keepalive: false,
      method: 'GET',
      mode: 'same-origin',
      parser: setResponse,
      redirect: 'follow',
      referrer: 'client',
      referrerPolicy: 'no-referrer-when-downgrade',
      spinner: bool => bool,
      timeout: 9999
    },
    options
  );

  /* Clean up settings before fetch() */
  const errorhandler = settings.error;
  delete settings.error;

  const parser = settings.parser;
  delete settings.parser;

  const spinner = settings.spinner;
  delete settings.spinner;

  const timeout = settings.timeout;
  delete settings.timeout;

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
    .then(response => parser(response))
    .then(result => result)
    .catch(error => {
      if (error.name === 'AbortError') {
        errorhandler({
          name: 'FetchError',
          message: `Timeout after ${timeout} milliseconds.`,
          status: 524
        });
      } else {
        errorhandler(error);
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
 * @description Depending on contentType, returns json or text
 */
function setResponse(response) {
  const contentType = response.headers.get('content-type');
  return contentType.includes('application/json')
    ? response.json()
    : response.text();
}
