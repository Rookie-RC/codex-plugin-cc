/**
 * Sandbox-mode policy for this fork.
 *
 * This fork defaults Codex sessions to `danger-full-access` because HPC hosts
 * such as JULES cannot use Codex's Linux bubblewrap sandbox. The mode is
 * resolved in one place so the app-server process default, `thread/start`, and
 * `thread/resume` cannot drift apart.
 *
 * This module intentionally has no imports so it can be used from the app-server
 * client, the broker, and the companion CLI without a cycle.
 */

/** Environment override for the rescue/task sandbox mode. */
export const SANDBOX_MODE_ENV = "CODEX_COMPANION_SANDBOX";

/** Default sandbox mode for this fork (rescue tasks and the app-server process default). */
export const DEFAULT_SANDBOX_MODE = "danger-full-access";

const SUPPORTED_SANDBOX_MODES = new Set(["read-only", "workspace-write", "danger-full-access"]);

/**
 * Normalize a sandbox mode value.
 *
 * @param {unknown} value
 * @returns {string | null} the canonical mode, or null when no value was given
 */
export function normalizeSandboxMode(value) {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");
  if (!normalized) {
    return null;
  }
  if (!SUPPORTED_SANDBOX_MODES.has(normalized)) {
    throw new Error(
      `Unsupported sandbox mode "${value}". Set ${SANDBOX_MODE_ENV} to one of: read-only, workspace-write, danger-full-access.`
    );
  }
  return normalized;
}

/**
 * Resolve the sandbox mode this fork runs Codex with.
 *
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {string}
 */
export function resolveSandboxMode(env = process.env) {
  return normalizeSandboxMode(env?.[SANDBOX_MODE_ENV]) ?? DEFAULT_SANDBOX_MODE;
}

/**
 * `codex` config override args that set the process-level default sandbox mode.
 *
 * Codex probes bubblewrap once when the process-level default needs a platform
 * sandbox, so pinning this on the app-server process is what keeps the probe
 * from running on hosts where bubblewrap is unusable.
 *
 * @param {string} mode
 * @returns {string[]}
 */
export function sandboxModeConfigArgs(mode) {
  return ["-c", `sandbox_mode=${JSON.stringify(mode)}`];
}
