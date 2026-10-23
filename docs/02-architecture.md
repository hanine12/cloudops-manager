# Architecture

```mermaid
flowchart LR
    A[Browser] --> B[Next.js Frontend]
    B -->|REST API + JWT| C[NestJS Backend]
    C --> D[(PostgreSQL)]
    C -.->|cron job| E[Simulated Metrics]
    E --> D
```