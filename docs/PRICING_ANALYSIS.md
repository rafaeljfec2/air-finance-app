# Pricing Analysis

Strategic pricing model for the Air Finance SaaS platform.

## Cost drivers

1. **Banking integrations**: Open Finance providers (e.g., Pluggy, Belvo) charge per connected account. Cost scales linearly with connections.
2. **Storage/processing**: Multiple companies generate more data, but DB costs are marginal vs. integration costs.
3. **Support**: More companies and integrations increase support load.

## Proposed plans

### Essential (entry-level)

Target: MEIs, freelancers, small businesses starting to organize finances.

- **Price**: R$ 39.90/month
- 1 company (CNPJ)
- Unlimited manual accounts
- No automatic banking integration (manual OFX/CSV import only)
- Email support

### Pro (primary plan)

Target: businesses seeking automation and productivity.

- **Price**: R$ 89.90/month
- 1 company
- 2 automatic banking connections (Open Finance)
- Automatic reconciliation
- Priority support (WhatsApp/chat)

## Add-ons

| Add-on | Price | Rationale |
| --- | --- | --- |
| Extra company | +R$ 29.90/month | ~65% discount vs. Pro plan; incentivizes consolidation |
| Extra banking connection | +R$ 14.90/month | Covers API cost (~$1-2 USD) plus margin |
| Extra user (partner) | R$ 9.90/month or free | Consider giving 1-2 free on Pro to reduce friction |

## Example scenarios

**Scenario A -- Solo consultant**: 1 company, manual imports. Essential plan = R$ 39.90.

**Scenario B -- Small retailer**: 1 company, 2 bank connections. Pro plan = R$ 89.90.

**Scenario C -- Serial entrepreneur**: 3 companies, 4 connected accounts. Pro + 2 extra companies + 2 extra connections = R$ 179.50.

## Pricing rationale

1. **Anchoring**: R$ 39.90 is accessible entry point; R$ 89.90 aligns with SaaS market norms.
2. **Margin protection**: Per-connection pricing absorbs rising API costs or exchange rate changes.
3. **Scalability**: No hard limits -- power users pay proportionally for what they consume.

For subscription implementation details, see [BUSINESS_DOMAIN.md](./BUSINESS_DOMAIN.md).
