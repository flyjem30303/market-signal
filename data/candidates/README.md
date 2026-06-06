# Candidate Artifact Intake Folder

This folder is the default PM intake location for A1 sanitized candidate artifacts.

Expected future path:

```text
data/candidates/tw-equity-staging-candidate.json
```

Do not commit a filled candidate artifact here unless CEO separately approves committing sanitized candidate data.

Current status: no candidate artifact is provided.

Safety: this folder does not authorize market-data fetch, market-data ingestion, Supabase connection, SQL, Supabase write, staging row creation, production `daily_prices` mutation, public source promotion, row coverage points, or `scoreSource=real`.
