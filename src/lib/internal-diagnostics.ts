import { notFound } from "next/navigation";

export function assertInternalDiagnosticsAccess(token?: string | null) {
  if (process.env.INTERNAL_DIAGNOSTICS_ENABLED !== "true") {
    notFound();
  }

  const expectedToken = process.env.INTERNAL_DIAGNOSTICS_TOKEN;

  if (!expectedToken || token !== expectedToken) {
    notFound();
  }
}
