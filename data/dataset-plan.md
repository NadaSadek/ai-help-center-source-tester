# ExampleOps Help Center Dataset Plan

## Product

ExampleOps is a fictional B2B SaaS product for teams that manage customer workflows, reports, integrations and workspace access.

The dataset exists to test retrieval behavior, source matching and failure analysis.

## Retrieval goal

Given a user question, the system should retrieve the correct help-center source docs before any answer is generated.

This project does not generate answers. It tests whether retrieval finds the right sources.

## Help-center categories

- billing
- account
- workspace
- plans
- exports
- integrations
- security
- notifications
- accessibility
- troubleshooting

## Retrieval traps

These are the ambiguity patterns the dataset should test.

| Trap ID  | Trap                                         | Example user wording                                 | Why retrieval may fail                                                                      |
| -------- | -------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| trap-001 | Payment vs access confusion                  | I paid but my team is still locked out               | Retrieval may match invoice/payment docs and miss workspace access or entitlement sync docs |
| trap-002 | Cancellation vs billing-period access        | I cancelled, why can I still use the product?        | Retrieval may match cancellation only and miss end-of-period access rules                   |
| trap-003 | Refund vs cancellation                       | I cancelled my plan, do I get my money back?         | Retrieval may confuse plan cancellation with refund policy                                  |
| trap-004 | Generic plan docs vs specific limit docs     | Why can’t I add more projects?                       | Retrieval may return upgrade docs instead of plan limits                                    |
| trap-005 | Export wording mismatch                      | Can I download only the rows I filtered?             | Retrieval may miss that “download” means export and “filtered rows” means filtered results  |
| trap-006 | Admin and billing permissions                | Our old admin left and we cannot manage billing      | Retrieval needs both workspace role/admin docs and billing permission docs                  |
| trap-007 | Integration retries                          | Our webhook keeps failing after retries              | Retrieval may return generic integrations docs instead of webhook retry docs                |
| trap-008 | SSO vs account login                         | SSO is enabled but some users still cannot log in    | Retrieval may return password reset docs instead of SSO setup or user provisioning docs     |
| trap-009 | Notification volume vs notification settings | We are getting too many email alerts                 | Retrieval may confuse notification frequency with email notification setup                  |
| trap-010 | Browser/cache troubleshooting                | The dashboard still shows old data after I refreshed | Retrieval may need cache refresh and status/troubleshooting docs                            |

## Initial doc map

### Billing

- billing/cancel-plan.md
- billing/refund-policy.md
- billing/billing-period-access.md
- billing/failed-payment.md
- billing/download-invoices.md
- billing/billing-permissions.md

### Account [To be added]

- account/reset-password.md
- account/change-email.md
- account/delete-account.md

### Workspace

- workspace/invite-team-members.md
- workspace/change-admin-role.md
- workspace/workspace-access.md
- workspace/entitlement-sync.md

### Plans

- plans/plan-limits.md
- plans/upgrade-plan.md
- plans/downgrade-plan.md

### Exports

- exports/export-dashboard-data.md
- exports/export-filtered-results.md
- exports/export-permissions.md

### Integrations [To be added]

- integrations/slack-integration.md
- integrations/api-rate-limits.md
- integrations/webhook-retries.md

### Security [To be added]

- security/sso-setup.md
- security/two-factor-authentication.md
- security/audit-log.md

### Notifications [To be added]

- notifications/email-notifications.md
- notifications/notification-frequency.md

### Accessibility [To be added]

- accessibility/keyboard-shortcuts.md
- accessibility/screen-reader-support.md

### Troubleshooting [To be added]

- troubleshooting/cache-refresh.md
- troubleshooting/browser-compatibility.md
- troubleshooting/status-page.md

## Query types to include

- exact keyword query
- semantic paraphrase query
- ambiguous query
- multi-intent query
- technical-term query
- user-language query