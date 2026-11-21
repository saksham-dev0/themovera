/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as careers from "../careers.js";
import type * as crm_auth from "../crm/auth.js";
import type * as crm_authNode from "../crm/authNode.js";
import type * as crm_dashboard from "../crm/dashboard.js";
import type * as crm_estimates from "../crm/estimates.js";
import type * as crm_leads from "../crm/leads.js";
import type * as crm_operations from "../crm/operations.js";
import type * as crm_quoteMath from "../crm/quoteMath.js";
import type * as crm_session from "../crm/session.js";
import type * as crons from "../crons.js";
import type * as emails from "../emails.js";
import type * as feedback from "../feedback.js";
import type * as grievances from "../grievances.js";
import type * as http from "../http.js";
import type * as quotes from "../quotes.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  careers: typeof careers;
  "crm/auth": typeof crm_auth;
  "crm/authNode": typeof crm_authNode;
  "crm/dashboard": typeof crm_dashboard;
  "crm/estimates": typeof crm_estimates;
  "crm/leads": typeof crm_leads;
  "crm/operations": typeof crm_operations;
  "crm/quoteMath": typeof crm_quoteMath;
  "crm/session": typeof crm_session;
  crons: typeof crons;
  emails: typeof emails;
  feedback: typeof feedback;
  grievances: typeof grievances;
  http: typeof http;
  quotes: typeof quotes;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
