import { NextRequest, NextResponse } from 'next/server';
import { executeHealthCheck, sendSlackAlert } from '@/lib/health-check';
import type { HealthCheckResult } from '@/lib/health-check';

/**
 * Health Check Cron Job Handler
 *
 * GET /api/cron/health-check
 *
 * This endpoint is triggered by Vercel Cron every 5 minutes to monitor
 * application health. It performs the following:
 *
 * 1. Verifies authorization via CRON_SECRET header
 * 2. Executes health checks on critical endpoints (with retry logic)
 * 3. Sends Slack alerts if health checks fail after retry
 * 4. Logs all results for debugging
 *
 * Security:
 * - Requires Authorization: Bearer <CRON_SECRET> header
 * - Returns 401 Unauthorized if secret is missing or incorrect
 *
 * Health Checks:
 * - Homepage: Verifies main landing page is accessible
 * - /api/health: Verifies API health endpoint returns valid data
 *
 * Alert Logic:
 * - Each check attempts up to 2 times (initial + 1 retry)
 * - Alert is sent only if check fails after all retry attempts
 * - Alert includes detailed error information and timestamps
 *
 * @returns JSON response with check results
 */
export async function GET(request: NextRequest) {
  console.log('[CRON] Health check started');

  // Step 1: Verify authorization
  const authHeader = request.headers.get('authorization');
  const expectedSecret = process.env.CRON_SECRET;

  // Fail closed: if CRON_SECRET is not configured, reject all requests
  if (!expectedSecret) {
    console.error('[CRON] CRON_SECRET not configured - rejecting request');
    return NextResponse.json(
      { error: 'Cron secret not configured' },
      { status: 401 }
    );
  }

  // Verify authorization header format and value
  const expectedAuth = `Bearer ${expectedSecret}`;
  if (!authHeader || authHeader !== expectedAuth) {
    console.error('[CRON] Unauthorized request - invalid or missing authorization header');
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  console.log('[CRON] Authorization verified');

  // Step 2: Determine base URL for health checks
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = request.headers.get('host') || 'localhost:3000';
  const baseUrl = `${protocol}://${host}`;

  console.log(`[CRON] Checking health for: ${baseUrl}`);

  // Step 3: Execute health checks with retry logic
  const startTime = Date.now();

  const results: HealthCheckResult[] = await Promise.all([
    // Check 1: Homepage
    executeHealthCheck(`${baseUrl}/`, 1, 5000),

    // Check 2: Health API endpoint
    executeHealthCheck(`${baseUrl}/api/health`, 1, 5000),
  ]);

  const duration = Date.now() - startTime;

  // Step 4: Analyze results
  const allPassed = results.every(r => r.success);
  const failedChecks = results.filter(r => !r.success);

  console.log(`[CRON] Health checks completed in ${duration}ms`);
  console.log(`[CRON] Results: ${results.length - failedChecks.length}/${results.length} passed`);

  // Step 5: Send Slack alert if any checks failed
  if (!allPassed) {
    console.log(`[CRON] ⚠️ ${failedChecks.length} check(s) failed - sending alert`);

    try {
      const alertSent = await sendSlackAlert(results, baseUrl);
      if (alertSent) {
        console.log('[CRON] ✅ Alert sent successfully');
      } else {
        console.error('[CRON] ❌ Failed to send alert');
      }
    } catch (error) {
      console.error('[CRON] Error sending alert:', error);
    }
  } else {
    console.log('[CRON] ✅ All health checks passed - no alert needed');
  }

  // Step 6: Return results for logging
  return NextResponse.json({
    success: allPassed,
    timestamp: new Date().toISOString(),
    duration,
    results: results.map(r => ({
      url: r.url,
      success: r.success,
      status: r.status,
      attempts: r.attempts,
      responseTime: r.responseTime,
      error: r.error,
    })),
    alertSent: !allPassed,
  });
}
