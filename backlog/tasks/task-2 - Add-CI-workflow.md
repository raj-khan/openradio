---
id: TASK-2
title: Add CI workflow
status: Done
assignee: []
created_date: '2026-09-17 15:40'
updated_date: '2026-09-17 15:43'
labels:
  - setup
dependencies:
  - TASK-1
priority: high
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
GitHub Actions workflow that runs lint, typecheck, unit tests and build on pushes to main and on pull requests.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Workflow runs on push to main and pull_request
- [x] #2 Uses npm ci with dependency caching
- [x] #3 Fails when any step fails
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
GitHub Actions workflow running lint, format check, typecheck, unit tests and build on Node 22.
<!-- SECTION:FINAL_SUMMARY:END -->
