# Security Specification: Starship Command

This document defines the security specifications, data invariants, and adversarial mock scenarios for the "Starship Command" Firestore structure.

## 1. Data Invariants

1. **User Ownership Match**: A user's profile, system calibrations, and telemetry streams can only be accessed or modified by authenticated requests with a matching UID.
2. **Profile Lock**: The UID within a profile is immutable. A commander cannot overwrite their stats using another user's identity.
3. **Data Type and String Bounds**: String inputs, including habit titles and logs, must be small configurations (<200 char). Stardust cycles, timestamps, and fuel are strictly bounded to prevent wallet attack exploits.

## 2. The "Dirty Dozen" Threat Assessment

| Scenario ID | Attack Strategy | Target Route | Expected Output | Actual Rule Guard |
|---|---|---|---|---|
| DD-001 | Overwrite stats with spoofed profile data | `/users/{userId}` | `PERMISSION_DENIED` | `isOwner(userId)` |
| DD-002 | Inject positive XP beyond maximum boundaries | `/users/{userId}` | `PERMISSION_DENIED` | `data.xp <= 1000000` |
| DD-003 | Attempt to change UID key during updates | `/users/{userId}` | `PERMISSION_DENIED` | `incoming().uid == existing().uid` |
| DD-004 | Set infinite fuel core resources | `/users/{userId}` | `PERMISSION_DENIED` | `data.fuel <= 100` |
| DD-005 | Inject massive character payloads for document IDs | `/users/user1/missions/{id}` | `PERMISSION_DENIED` | `isValidId(missionId)` |
| DD-006 | Forge complete habit status state blocks on other profiles | `/users/attacker/missions/ms1` | `PERMISSION_DENIED` | `incoming().uid == userId` |
| DD-007 | Inject illegal HTML or scripts in console logs | `/users/user1/events/ev1` | `PERMISSION_DENIED` | `data.text.size() <= 200` |
| DD-008 | Attempt to delete entire history by sweeping list indexes | `/users/user1/missions` | `PERMISSION_DENIED` | Global deny rules |
| DD-009 | Access tracking data without active credential token | `/users/user1` | `PERMISSION_DENIED` | `isSignedIn()` |
| DD-010 | Modify completed stardate reference formats | `/users/user1/missions/ms1` | `PERMISSION_DENIED` | `stardate.size() <= 20` |
| DD-011 | Overwrite administrative keys on local scope | `/users/user1` | `PERMISSION_DENIED` | Strict properties matching |
| DD-012 | Issue anonymous writes without authentication tokens | `/users/user1/events/ev1` | `PERMISSION_DENIED` | `request.auth != null` |

## 3. Test Coverage

- Rules are secured via verification of explicit owner targets.
- Fallback system defaults are embedded in local storage states to preserve functionality when the live DB is unprovisioned.

---
*Created by the Starship Command Security Architect.*
