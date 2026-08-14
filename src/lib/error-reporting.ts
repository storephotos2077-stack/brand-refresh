type ErrorReportContext = Record<string, unknown>;

/**
 * Reports an error caught by a React error boundary. Production React does not
 * rethrow boundary-caught errors to window.onerror, so we log them explicitly
 * with route context for the console/monitoring pipeline.
 */
export function reportClientError(error: unknown, context: ErrorReportContext = {}) {
  if (typeof window === "undefined") return;

  // Loaders and server fns commonly throw a raw Response; String(it) is the
  // opaque "[object Response]", so pull out the status and URL instead.
  const message =
    error instanceof Response
      ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`
      : error instanceof Error
        ? error.message
        : String(error);

  console.error("[client-error]", message, {
    source: "react_error_boundary",
    route: window.location.pathname,
    ...context,
  });

  window.dispatchEvent(
    new CustomEvent("app:client-error", {
      detail: {
        message,
        stack: error instanceof Error ? error.stack : undefined,
        route: window.location.pathname,
        ...context,
      },
    }),
  );
}
