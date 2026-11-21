import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// CRM sessions: queries can't read the clock, so expired tokens are removed here.
crons.interval("purge expired CRM sessions", { minutes: 30 }, internal.crm.auth.purgeExpiredSessions, {});

export default crons;
