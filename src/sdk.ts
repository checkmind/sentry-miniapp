import {
  getCurrentHub,
  initAndBind,
  Integrations as CoreIntegrations
} from "@sentry/core";

import { MiniappOptions } from "./backend";
import { MiniappClient, ReportDialogOptions } from "./client";
import { wrap as internalWrap } from "./helpers";
import {
  Breadcrumbs,
  GlobalHandlers,
  LinkedErrors,
  System,
  TryCatch,
  UserAgent
} from "./integrations/index";

export const defaultIntegrations = [
  new CoreIntegrations.InboundFilters(),
  new CoreIntegrations.FunctionToString(),
  new TryCatch(),
  new Breadcrumbs(),
  new GlobalHandlers(),
  new LinkedErrors(),
  new UserAgent(),
  new System()
];

/**
 * The Sentry Browser SDK Client.
 *
 * To use this SDK, call the {@link init} function as early as possible when
 * loading the web page. To set context information or send manual events, use
 * the provided methods.
 *
 * @example
 *
 * ```
 *
 * import { init } from '@sentry/browser';
 *
 * init({
 *   dsn: '__DSN__',
 *   // ...
 * });
 * ```
 *
 * @example
 * ```
 *
 * import { configureScope } from '@sentry/browser';
 * configureScope((scope: Scope) => {
 *   scope.setExtra({ battery: 0.7 });
 *   scope.setTag({ user_mode: 'admin' });
 *   scope.setUser({ id: '4711' });
 * });
 * ```
 *
 * @example
 * ```
 *
 * import { addBreadcrumb } from '@sentry/browser';
 * addBreadcrumb({
 *   message: 'My Breadcrumb',
 *   // ...
 * });
 * ```
 *
 * @example
 *
 * ```
 *
 * import * as Sentry from '@sentry/browser';
 * Sentry.captureMessage('Hello, world!');
 * Sentry.captureException(new Error('Good bye'));
 * Sentry.captureEvent({
 *   message: 'Manual',
 *   stacktrace: [
 *     // ...
 *   ],
 * });
 * ```
 *
 * @see {@link MiniappOptions} for documentation on configuration options.
 */
export function init(options: MiniappOptions = {}): void {
  // 如果将 options.defaultIntegrations 设置为 false，则不会添加默认集成，否则将在内部将其设置为建议的默认集成。
  // tslint:disable-next-line: strict-comparisons
  if (options.defaultIntegrations === undefined) {
    options.defaultIntegrations = defaultIntegrations;
  }
  initAndBind(MiniappClient, options);
}

/**
 * Present the user with a report dialog.
 *
 * @param options Everything is optional, we try to fetch all info need from the global scope.
 */
export function showReportDialog(options: ReportDialogOptions = {}): void {
  if (!options.eventId) {
    options.eventId = getCurrentHub().lastEventId();
  }
  const client = getCurrentHub().getClient<MiniappClient>();
  if (client) {
    client.showReportDialog(options);
  }
}

/**
 * This is the getter for lastEventId.
 *
 * @returns The last event id of a captured event.
 */
export function lastEventId(): string | undefined {
  return getCurrentHub().lastEventId();
}

/**
 * This function is here to be API compatible with the loader.
 * @hidden
 */
export function forceLoad(): void {
  // Noop
}

/**
 * This function is here to be API compatible with the loader.
 * @hidden
 */
export function onLoad(callback: () => void): void {
  callback();
}

/**
 * A promise that resolves when all current events have been sent.
 * If you provide a timeout and the queue takes longer to drain the promise returns false.
 *
 * @param timeout Maximum time in ms the client should wait.
 */
export function flush(timeout?: number): Promise<boolean> {
  const client = getCurrentHub().getClient<MiniappClient>();
  if (client) {
    return client.flush(timeout);
  }
  return Promise.reject(false);
}

/**
 * A promise that resolves when all current events have been sent.
 * If you provide a timeout and the queue takes longer to drain the promise returns false.
 *
 * @param timeout Maximum time in ms the client should wait.
 */
export function close(timeout?: number): Promise<boolean> {
  const client = getCurrentHub().getClient<MiniappClient>();
  if (client) {
    return client.close(timeout);
  }
  return Promise.reject(false);
}

/**
 * Wrap code within a try/catch block so the SDK is able to capture errors.
 *
 * @param fn A function to wrap.
 *
 * @returns The result of wrapped function call.
 */
export function wrap(fn: Function): any {
  // tslint:disable-next-line: no-unsafe-any
  return internalWrap(fn)();
}
