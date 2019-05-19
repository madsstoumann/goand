/**
 * Goand
 * @module /goand.mjs
 * @version 0.9.2
 * @author Mads Stoumann
 * @description Wrapper for fetch with timeout, custom error-, parser- and spinner-callbacks.
 */

/**
 * Extends Error Object with FetchError, including http-status-code and full response
 * @module FetchError
 */
class FetchError extends Error {
  constructor(message, response) {
    super(message);
    this.name = 'FetchError';
    this.message = message;
    this.response = response;
    this.status = response.status;
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
      errorHandler: err => console.error(err),
      errorList: [],
      parser: setResponse,
      spinner: bool => bool,
      timeout: 9999
    },
    options
  );

  /* Clean up settings before fetch() */
  const errorHandler = settings.errorHandler;
  delete settings.errorHandler;

  const errorList = settings.errorList;
  delete settings.errorList;

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
    .then(response => handleErrors(response, errorList))
    .then(response => parser(response))
    .then(result => result)
    .catch(error => {
      if (error.name === 'AbortError') {
        errorHandler({
          name: 'FetchError',
          message: `Timeout after ${timeout} milliseconds.`,
          response: '',
          status: 524
        });
      } else {
        errorHandler(error);
      }
    })
    .finally(() => {
      spinner(false);
    });
}

/**
 * @function handleErrors
 * @param {Object} response Response Object from fetch()
 * @param {Array} [errorList] Optional array of status-codes, that will trigger an error
 * @description Throws a new ApiError if response !== ok
 */
function handleErrors(response, errorList = []) {
  if (!response.ok || errorList.includes(response.status)) {
    throw new FetchError(response.statusText, response);
  }
  return response;
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
