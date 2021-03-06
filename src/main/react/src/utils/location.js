import {browserHistory} from 'react-router';

/**
 * Updates query params with new params.
 *
 * @param params New params object.
 */
export function updateQueryParams(params) {
  const location = Object.assign({}, browserHistory.getCurrentLocation());
  Object.assign(location.query, params);
  browserHistory.push(location);
}

/**
 * Removes a query param.
 * @param key Param to remove.
 */
export function removeQueryParam(key) {
  const location = Object.assign({}, browserHistory.getCurrentLocation());
  delete location.query[key];
  browserHistory.push(location);
}

/**
 * Returns query params object.
 *
 * @returns Query params object
 */
export function getQueryParams() {
  return browserHistory.getCurrentLocation().query;
}
