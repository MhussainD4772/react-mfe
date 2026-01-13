# Alpha MFE — Phase 1

## Goal

Build a **language-agnostic Micro Frontend** that can be embedded into different host apps (React, Next.js, FastAPI, Angular).

---

## Key Decisions

- Micro Frontend is packaged as a **Web Component**
- Internal implementation uses **React + Vite**
- External interface is **browser-native**
- Host controls rendering, auth, and behavior

---

## Public Interface

### Custom Element

```html
<user-activity-mfe></user-activity-mfe>
Entry Point Design main.tsx does not render React It only registers the Web
Component No global #root, no SPA behavior Web Component Wrapper
user-activity-mfe.tsx defines the Custom Element React is mounted inside the
element Emits lifecycle event: mfe:ready Communication Model (Phase 1) Host →
MFE Attributes (simple identifiers) authContext (property) authContext: - userId
- roles Owned by host Read-only for MFE Dynamic updates supported MFE → Host
Generic event: mfe:action Intent-based (host decides behavior) Authentication
Strategy Authentication is owned by the host Host passes auth info to MFE MFE
does not handle login or tokens Phase 1 Scope Included Web Component wrapper
Host ↔ MFE contract Dynamic auth propagation Standalone execution Excluded API
calls BFF Database Routing Business logic Phase 1 Status Standalone MFE runs
correctly
<user-activity-mfe>
  renders on insertion, No global React root, mfe:ready event fires Ready for
  dynamic inputs (next step)</user-activity-mfe
>
```
