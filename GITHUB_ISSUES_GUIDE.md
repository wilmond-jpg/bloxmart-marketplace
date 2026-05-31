# GitHub Issues Guide for AI Development Agents

> Feed this file at the start of every chat session. It defines the mandatory GitHub Issues discipline for this project.

---

## 1. Core Rules

1. **Every task is an issue.** No work happens without a corresponding GitHub Issue.
2. **Issues drive commits.** Every commit message references its issue (`#N`).
3. **Issues close with a summary.** Never close silently — post a final comment with what was done, what was tested, and the merged PR.
4. **Milestones stay current.** Before closing an issue, verify the milestone progress reflects reality.

---

## 2. Label Taxonomy

Use exactly these labels. Do not invent new ones.

| Label | Purpose |
|---|---|
| `bug` | Something is broken |
| `feature` | New capability |
| `enhancement` | Improvement to existing feature |
| `refactor` | Code restructuring, no behavior change |
| `docs` | Documentation only |
| `chore` | Maintenance, deps, config |
| `auth` | Supabase auth, sessions, OAuth |
| `ui` | Frontend components, styling |
| `database` | Schema, migrations, RLS, Supabase tables |
| `profile` | User profiles, avatars |
| `admin` | Admin dashboard, moderation |
| `marketplace` | Browse, search, items, buying |
| `blocked` | Waiting on external dependency or decision |
| `good first issue` | Small scope, suitable for onboarding |

**Rules:**
- Every issue must have at least one category label (`bug`, `feature`, `enhancement`, `refactor`, `docs`, `chore`).
- Add domain labels (`auth`, `ui`, `database`, etc.) when relevant.
- Only use `blocked` when genuinely stuck.

---

## 3. Issue Templates

### Bug

```
Title: [Bug] Short description of the broken behavior

**Steps to reproduce:**
1.
2.
3.

**Expected behavior:**

**Actual behavior:**

**Environment (routes/components affected):**
```

### Feature / Enhancement

```
Title: [Feature] Short description

**What:**
Brief description of the feature.

**Routes/components affected:**
- `src/routes/...`
- `src/components/...`

**Acceptance criteria:**
- [ ] Criterion 1
- [ ] Criterion 2
```

### Chore / Refactor

```
Title: [Chore] Short description

**What:**
What is being done and why.

**Files affected:**
- `file/path.ts`
```

---

## 4. Issue Lifecycle

### When starting new work

```bash
gh issue create \
  --title "[Feature] Add profile avatar upload" \
  --body "$(cat <<'EOF'
**What:** ...
**Routes/components affected:** ...
**Acceptance criteria:**
- [ ] ...
EOF
)" \
  --label "feature,profile,ui" \
  --milestone "Phase 2 - Profiles & Navbar"
```

### When beginning work on an existing issue

1. Assign yourself:
   ```bash
   gh issue edit <ISSUE_NUMBER> --add-assignee "@me"
   ```
2. If a branch doesn't exist, create one:
   ```bash
   git checkout -b feature/<short-slug>
   ```
3. Post a comment: `"Starting work on this."`

### When making progress

- Push commits with references: `git commit -m "Add avatar upload UI (#42)"`
- If scope changes or blockers emerge, update the issue body and labels.

### When work is complete and PR is merged

1. Post a closing comment on the issue:
   ```
   **Done.** Implemented avatar upload via Supabase Storage. Tested: upload, fallback, navbar update.
   Merged in: <PR_URL>
   ```
2. Close the issue:
   ```bash
   gh issue close <ISSUE_NUMBER> --reason completed
   ```
3. If the issue closes a milestone's last open issue, verify the milestone is complete:
   ```bash
   gh issue list --milestone "<Milestone Name>" --state open
   ```
   If empty, close the milestone:
   ```bash
   gh milestone edit "<Milestone Name>" --state closed
   ```

---

## 5. Milestones

### Active milestones (keep updated)

| Milestone | Description | Status |
|---|---|---|
| Phase 1 — Supabase Auth & Roles | Real auth, AuthContext refactor, login/signup, Google OAuth, RBAC schema | Completed |
| Phase 2 — Profiles & Navbar | `/profile` page, avatar upload, navbar dropdown update | In progress |
| Phase 3 — Public Profiles | Replace `/user/$username` mock data with real DB queries | Planned |
| Phase 4 — Marketplace | Real item listings, search, filters (replace mock data) | Planned |
| Phase 5 — Admin Dashboard | Admin/moderation pages with real data | Planned |

### Milestone rules

- When all issues in a milestone are closed, close the milestone.
- When you discover work that belongs to a later phase, create the issue but link it to the correct milestone.
- If a milestone has 0 open issues but is not "done," re-evaluate whether hidden work remains.

---

## 6. PR Conventions

- **Branch naming:** `feature/<slug>`, `fix/<slug>`, `chore/<slug>`
- **PR title:** Match the issue title or be slightly more specific.
- **PR body:** Always include `Closes #<ISSUE_NUMBER>` so GitHub auto-links.
- **Before merging:** Confirm all acceptance criteria in the issue are checked off.

---

## 7. Session Startup Checklist

At the start of every chat session, the AI agent MUST:

1. Check open issues assigned to the project:
   ```bash
   gh issue list --state open --limit 20
   ```
2. Check current milestone progress:
   ```bash
   gh milestone list
   ```
3. Identify the highest-priority open issue and state:
   > "Current focus: `#N — Title` (Milestone: X). N open issues remaining in this milestone."

4. Before producing any code, confirm with the user whether to work on that issue or start something new (and create a new issue if new).

---

## 8. Quick Reference

| Action | Command |
|---|---|
| List open issues | `gh issue list --state open` |
| List milestone issues | `gh issue list --milestone "Phase 2 - Profiles & Navbar"` |
| Create issue | `gh issue create --title "..." --body "..." --label "..." --milestone "..."` |
| Assign self | `gh issue edit N --add-assignee "@me"` |
| Close issue | `gh issue close N --reason completed` |
| List milestones | `gh milestone list` |
