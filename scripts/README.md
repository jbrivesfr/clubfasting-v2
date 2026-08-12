# Scripts

This directory contains utility scripts for the clubfasting-v2 project.

## Health Check Script

The `health-check.ts` script pings the `/api/health-check` endpoint which in turn checks the core URLs of the application and logs the results to the Supabase database.

### Running Manually

```bash
npm run health-check
```
*(By default, this targets `https://app.clubfasting.com/api/health-check`. You can override this by setting the `HEALTH_CHECK_URL` environment variable).*

### Scheduling (Cron oneliner)

For automated daily health checks on a Linux server, you can use the following cron oneliner:

```bash
0 9 * * * cd /path/to/clubfasting-v2 && HEALTH_CHECK_URL=https://app.clubfasting.com/api/health-check npx tsx scripts/health-check.ts >> /var/log/fasting-health.log 2>&1
```

### Cloud Scheduler Alternative (Production)

For production, it is recommended to use Google Cloud Scheduler to trigger the health check endpoint directly, rather than running a cron script on a server.

You can set this up using the `gcloud` CLI skeleton below:

```bash
gcloud scheduler jobs create http daily-health-check \
  --schedule="0 9 * * *" \
  --uri="https://app.clubfasting.com/api/health-check" \
  --http-method=GET \
  --time-zone="Europe/Paris"
```
