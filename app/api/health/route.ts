import { NextResponse } from 'next/server';
import type { HealthCheckResponse } from '@/lib/health-check';

/**
 * Health Check Endpoint
 *
 * GET /api/health
 *
 * Returns the health status of the application including:
 * - Overall status (ok/error)
 * - Timestamp of the check
 * - Individual system checks (Convex, environment)
 *
 * This endpoint is designed to be fast (<500ms) and is used by
 * the cron job monitoring system to verify application health.
 *
 * @returns JSON response with health status
 *
 * Success Response (200):
 * {
 *   "status": "ok",
 *   "timestamp": "2024-11-03T12:00:00.000Z",
 *   "checks": {
 *     "convex": true,
 *     "environment": true
 *   }
 * }
 *
 * Error Response (503):
 * {
 *   "status": "error",
 *   "timestamp": "2024-11-03T12:00:00.000Z",
 *   "checks": {
 *     "convex": false,
 *     "environment": true
 *   },
 *   "error": "Convex URL not configured"
 * }
 */
export async function GET() {
  try {
    const timestamp = new Date().toISOString();

    // Check 1: Verify Convex connection is configured
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    const convexHealthy = !!convexUrl && convexUrl.length > 0;

    // Check 2: Verify environment is properly configured
    const nodeEnv = process.env.NODE_ENV;
    const environmentHealthy = !!nodeEnv;

    // Determine overall health status
    const allHealthy = convexHealthy && environmentHealthy;

    const response: HealthCheckResponse = {
      status: allHealthy ? 'ok' : 'error',
      timestamp,
      checks: {
        convex: convexHealthy,
        environment: environmentHealthy,
      },
    };

    // Add error message if any check failed
    if (!allHealthy) {
      const errors: string[] = [];
      if (!convexHealthy) errors.push('Convex URL not configured');
      if (!environmentHealthy) errors.push('Environment not configured');
      response.error = errors.join(', ');
    }

    // Return appropriate HTTP status code
    const statusCode = allHealthy ? 200 : 503;

    return NextResponse.json(response, { status: statusCode });
  } catch (error) {
    // Handle unexpected errors gracefully
    console.error('[HEALTH] Unexpected error:', error);

    const errorResponse: HealthCheckResponse = {
      status: 'error',
      timestamp: new Date().toISOString(),
      checks: {
        convex: false,
        environment: false,
      },
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };

    return NextResponse.json(errorResponse, { status: 503 });
  }
}
