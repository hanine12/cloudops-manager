# User Needs

## Roles
| Role | Who they are | What they can do |
|---|---|---|
| Admin | Platform owner | Everything, including managing users |
| DevOps | Technical engineer | Manage projects, servers, applications, alert rules |
| Viewer | Manager or observer | View dashboard and monitoring only |

## Permissions matrix
| Action | Admin | DevOps | Viewer |
|---|---|---|---|
| Manage users | Yes | No | No |
| CRUD projects / servers / apps | Yes | Yes | No |
| Configure alert rules | Yes | Yes | No |
| Resolve alerts | Yes | Yes | No |
| View dashboard and monitoring | Yes | Yes | Yes |

## Main user stories
- As an Admin, I can create and manage user accounts and roles.
- As a DevOps, I can register a server and its applications.
- As a DevOps, I can set a CPU threshold that triggers an alert.
- As a Viewer, I can see the dashboard with server status and alerts.