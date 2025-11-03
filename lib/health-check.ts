/**
 * Health Check Monitoring System
 *
 * Provides utilities for monitoring application health and sending alerts
 * when issues are detected. Includes retry logic and Slack integration.
 */

/**
 * Structure for /api/health endpoint responses
 */
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  checks: {
    convex: boolean;
    environment: boolean;
  };
  error?: string;
}

/**
 * Result of checking a single endpoint
 */
export interface HealthCheckResult {
  url: string;
  success: boolean;
  status?: number;
  error?: string;
  attempts: number;
  responseTime?: number;
}

/**
 * Slack message payload structure for health alerts
 */
export interface SlackHealthAlert {
  text: string;
  blocks: Array<{
    type: string;
    text?: {
      type: string;
      text: string;
      emoji?: boolean;
    };
    fields?: Array<{
      type: string;
      text: string;
    }>;
    elements?: Array<{
      type: string;
      text: string;
    }>;
  }>;
}

/**
 * Execute a health check with retry logic
 *
 * @param url - The URL to check
 * @param retries - Number of retry attempts (default: 1)
 * @param delayMs - Delay between retries in milliseconds (default: 5000)
 * @returns Promise<HealthCheckResult> - The result of the health check
 *
 * @example
 * ```typescript
 * const result = await executeHealthCheck('https://example.com');
 * if (result.success) {
 *   console.log('Health check passed');
 * } else {
 *   console.error('Health check failed:', result.error);
 * }
 * ```
 */
export async function executeHealthCheck(
  url: string,
  retries: number = 1,
  delayMs: number = 5000
): Promise<HealthCheckResult> {
  let lastError: string = '';
  let lastStatus: number | undefined;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const startTime = Date.now();

    try {
      console.log(`[HEALTH_CHECK] Attempt ${attempt + 1}/${retries + 1} for ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Gist-GEO-Health-Check/1.0',
        },
        // Timeout after 10 seconds
        signal: AbortSignal.timeout(10000),
      });

      const responseTime = Date.now() - startTime;
      lastStatus = response.status;

      if (response.ok) {
        console.log(`[HEALTH_CHECK] ✅ Success for ${url} (${response.status}) in ${responseTime}ms`);
        return {
          url,
          success: true,
          status: response.status,
          attempts: attempt + 1,
          responseTime,
        };
      }

      lastError = `HTTP ${response.status}: ${response.statusText}`;
      console.log(`[HEALTH_CHECK] ❌ Failed for ${url}: ${lastError}`);

    } catch (error) {
      const responseTime = Date.now() - startTime;
      lastError = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[HEALTH_CHECK] ❌ Error for ${url}:`, lastError);

      // If this is not the last attempt, wait before retrying
      if (attempt < retries) {
        console.log(`[HEALTH_CHECK] Waiting ${delayMs}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  // All attempts failed
  return {
    url,
    success: false,
    status: lastStatus,
    error: lastError,
    attempts: retries + 1,
  };
}

/**
 * Format a health check alert for Slack using Block Kit
 *
 * @param results - Array of failed health check results
 * @param baseUrl - Base URL of the application being monitored
 * @returns SlackHealthAlert - Formatted Slack message payload
 *
 * @example
 * ```typescript
 * const failedChecks = [
 *   { url: 'https://example.com', success: false, error: 'Timeout', attempts: 2 }
 * ];
 * const alert = formatHealthAlert(failedChecks, 'https://example.com');
 * await fetch(webhookUrl, { method: 'POST', body: JSON.stringify(alert) });
 * ```
 */
export function formatHealthAlert(
  results: HealthCheckResult[],
  baseUrl: string
): SlackHealthAlert {
  const failedChecks = results.filter(r => !r.success);
  const timestamp = new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Los_Angeles',
  });

  // Build fields for each failed check
  const fields = failedChecks.flatMap(result => [
    {
      type: 'mrkdwn',
      text: `*🔗 URL:*\n${result.url}`,
    },
    {
      type: 'mrkdwn',
      text: `*📊 Status:*\n${result.status || 'N/A'}`,
    },
    {
      type: 'mrkdwn',
      text: `*🔄 Attempts:*\n${result.attempts}`,
    },
    {
      type: 'mrkdwn',
      text: `*❌ Error:*\n${result.error || 'Unknown error'}`,
    },
  ]);

  return {
    text: '🚨 Gist GEO Health Check Failed',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🚨 Health Check Alert',
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${failedChecks.length}* health check${failedChecks.length > 1 ? 's' : ''} failed for *${baseUrl}*`,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        fields,
      },
      {
        type: 'divider',
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `⏰ ${timestamp} PST`,
          },
        ],
      },
    ],
  };
}

/**
 * Send a health check alert to Slack
 *
 * @param results - Array of health check results (only failed checks will be alerted)
 * @param baseUrl - Base URL of the application being monitored
 * @param webhookUrl - Slack webhook URL (optional, uses SLACK_WEBHOOK_URL env var if not provided)
 * @returns Promise<boolean> - True if alert was sent successfully, false otherwise
 *
 * @example
 * ```typescript
 * const results = await Promise.all([
 *   executeHealthCheck('https://example.com'),
 *   executeHealthCheck('https://example.com/api/health'),
 * ]);
 *
 * const hasFailures = results.some(r => !r.success);
 * if (hasFailures) {
 *   await sendSlackAlert(results, 'https://example.com');
 * }
 * ```
 */
export async function sendSlackAlert(
  results: HealthCheckResult[],
  baseUrl: string,
  webhookUrl?: string
): Promise<boolean> {
  const webhook = webhookUrl || process.env.SLACK_WEBHOOK_URL;

  if (!webhook) {
    console.log('[HEALTH_CHECK] Slack webhook URL not configured - skipping alert');
    return false;
  }

  const failedChecks = results.filter(r => !r.success);

  if (failedChecks.length === 0) {
    console.log('[HEALTH_CHECK] No failed checks - skipping alert');
    return true;
  }

  console.log(`[HEALTH_CHECK] Sending alert for ${failedChecks.length} failed check(s)`);

  const message = formatHealthAlert(results, baseUrl);

  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error(
        '[HEALTH_CHECK] Slack webhook failed:',
        response.status,
        response.statusText
      );
      const errorText = await response.text();
      console.error('[HEALTH_CHECK] Error details:', errorText);
      return false;
    }

    console.log('[HEALTH_CHECK] ✅ Slack alert sent successfully');
    return true;
  } catch (error) {
    console.error('[HEALTH_CHECK] Error sending Slack alert:', error);
    return false;
  }
}
