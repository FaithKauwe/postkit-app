# PostKit Implementation Plan (Done by Monday Night)

This plan is optimized for speed, clarity, and learning.  
Primary goal: finish required acceptance criteria by Monday night.  
Secondary goal: understand every major piece of code and annotate heavily.

---
## Acceptance Criteria

Your implementation is complete when a user can:

- [ ] See a list of their posts with title, status, tags, reading time, and date
- [ ] Filter the list by status or tag
- [ ] Sort the list by date or title
- [ ] Search posts and get accurate results
- [ ] Create a new post and see it appear in the list
- [ ] Edit an existing post and see the changes saved
- [ ] See validation feedback when required fields are missing
- [ ] See a slug, excerpt, reading time, and formatted date in the post preview
- [ ] Close and reopen the browser and find their posts still there
## Ground Rules

- [ ] Build **Option B** first (stacked layout): controls -> list -> editor -> preview
- [ ] Keep implementations simple and explicit over clever abstractions
- [ ] Use class packages where reliable; use documented workaround when package is broken
- [ ] Add explanatory comments while implementing (especially data flow and package integration)
- [ ] Only attempt Option A (two-column layout) after all required criteria are complete

---

## Deadline Timeline

## Tomorrow (4-5 hours) — Core Flow (Detailed)

### 0) Setup and reset context (15 min)
- [✅] Pull latest state (if using a shared git project) and start dev server
- [✅] Open `requirements.md`, `planning.md`, and relevant package docs
- [✅] Confirm smoke page still works (`?smoke=1`) so package behavior is known

### 1) Create Option B page structure (45-60 min)

**Goal:** basic, readable UI sections in one column.

- [✅] leave skeleton structure in App.tsx for now so I can better visualize data flow.  I'll move it out during Phase 2
- [✅] Add Tailwind
- [✅] In `App`, render top-level sections in this order:
  - [✅] Page title / short intro
  - [✅] Controls section (placeholder search/filter/sort controls)
  - [✅] Post list section
  - [✅] Post editor section
  - [✅] Post preview section
- [✅] Add semantic headings for each section (`h2`) so the screen is easy to scan
- [✅] Keep styling minimal (spacing only, no polish yet)
- [✅] Verify app renders without runtime/type errors

**Definition of done:** static section layout exists and is rendering in browser with no errors.

### 2) Render posts list from local state (45-60 min)

**Goal:** posts come from React state, not hardcoded JSX.


- [✅] Extract and modularize files from App.tsx
- [✅] Create initial `posts` state with 2-3 sample posts matching shared `Post` type
- [✅] Render list by mapping state to rows/cards
- [✅] Show required post fields now:
  - [✅] title
  - [✅] status
  - [✅] tags
  - [✅] date (created or updated)
  - [✅] reading-time placeholder or package-based value if quick to wire
- [✅] Add `selectedPostId` state and click-to-select behavior
- [✅] Highlight selected post visually (simple border/background)
- [✅] Install Zustand. Zustand manages state shared across components and is a replacement for prop drilling or react redux. uses a "store" system: a single file that any component can import directly. the store holds state (the data that is being acted on) and actions (the functions to update the the state data)
- [✅] Set up Zustand store file

**Definition of done:** selecting a post updates selection state and list is state-driven.

### 3) Add create/edit form basics (60-75 min)

**Goal:** one form supports new post creation and editing existing post fields.

- [✅] Add form state for editable fields:
  - [✅] title
  - [✅] body
  - [✅] author
  - [✅] tags input
  - [✅] category
  - [✅] status
  - [✅] status
  - [✅] status
  - [✅] status
- [✅] On selecting a post, populate form with that post's values
- [✅] Add "New Post" action to reset form and switch to create mode
- [✅] Keep form controlled , every form field's value comes from formData, not the DOM
- [✅] Add simple labels/placeholders for clarity

**Definition of done:** user can switch between editing an existing post and drafting a new post.

### 4) Save/update posts in state (60-75 min)

**Goal:** submit form updates app data immediately.

- [✅] Add submit handler with two paths:
  - [✅] create mode -> append new post
  - [✅] edit mode -> update existing post by id
- [✅] Ensure timestamps are set/updated (`createdAt`, `updatedAt`)
- [✅] Ensure id generation is deterministic/simple (timestamp + random suffix is fine)
- [ ] After save:
  - [✅] list updates immediately
  - [✅] saved post becomes selected
  - [✅] preview reflects latest data
- [ ] Add basic "Cancel edit" behavior (optional if time remains)

**Definition of done:** create and edit both work end-to-end in memory.

### 5) Basic local persistence (45-60 min, if time)

**Goal:** posts survive page reload (R8 baseline).

- [✅] Create `src/lib/storage.ts` wrapper with app-facing functions:
  - [✅] `loadPosts()`
  - [✅] `savePosts(posts)`
- [✅] Start with known working path (shim/workaround) to avoid blocking on broken package publish
- [✅] Load persisted posts on app init
- [✅] Save posts whenever posts state changes (effect)
- [✅] Verify manually:
  - [✅] add/edit post
  - [✅] refresh browser
  - [✅] data remains through browser refresh and across server quit and restart

**Definition of done:** no data loss across reloads for baseline flow.


## Friday (2 hours) — Validation + Persistence Hardening

- [✅] Finish persistence if incomplete
- [✅] Integrate validation package for title/body/status checks
- [✅] Show inline validation feedback
- [✅] Prevent save when invalid
- [✅] Add comments explaining validation flow and error state decisions

Exit criteria:
- [✅] Required-field feedback is visible
- [✅] Invalid post cannot be saved
- [✅] Reload still restores data

---

## Sunday (4 hours) — Filter, Sort, Search

- [✅] Implement search input and query state
- [✅] Implement status filter + tag filter state
- [✅] Implement sort mode state (date/title + direction)
- [✅] Build one derived list pipeline:
  - [✅] search
  - [✅] filter
  - [✅] sort
- [✅] Render filtered list (do not mutate original posts)
- [ ] Verify combinations (search+filter, filter+sort, all three)
- [ ] Add comments on pipeline ordering and reasoning

Exit criteria:
- [ ] R2, R3, R4 functional with combinable controls

---

## Monday (4-5 hours) — Preview Metadata + Final Pass

- [ ] Build preview panel from selected post/form draft
- [ ] Show:
  - [ ] unique slug
  - [ ] excerpt
  - [ ] reading time
  - [ ] formatted date
  - [ ] readable status label/color
- [ ] Final acceptance-criteria walkthrough checklist
- [ ] Bug fixes and small UX cleanup
- [ ] Optional only if complete: start Option A layout conversion

Exit criteria:
- [ ] Required acceptance criteria complete by Monday night
- [ ] App demo path works without manual fixes

---

## Optional Extra Credit (Only After Core Is Done)

- [ ] UI component library integration in list/editor/preview
- [ ] Storage import/export (R9 recommended)
- [ ] Option A two-column layout

---

## Risks and Mitigations

- [ ] **Risk:** storage package publish issues  
      **Mitigation:** continue with wrapper/shim; do not block feature progress.
- [ ] **Risk:** time drift from UI polish  
      **Mitigation:** freeze styling until Monday after core criteria pass.
- [ ] **Risk:** unclear behavior from third-party class packages  
      **Mitigation:** rely on smoke tests + document workaround quickly.

---

## Definition of "Done" (Project Level)

- [ ] Acceptance criteria R1-R8 satisfied
- [ ] App runs and persists data across refresh
- [ ] Search/filter/sort all work together
- [ ] Create/edit + validation flow is reliable
- [ ] Preview metadata (slug/excerpt/reading/date/status) visible
- [ ] Code is commented enough that future-you can explain every major flow


## Boundaries Section
 Identify my:

 State Boundaries:
 Library Boundaries:
  the point where your app calls a PostKit package.
  - In Preview.tsx: formatDate (from postkit-date-status-display) is used in the rendering of the preview: `By {post.author} · {formatDate(post.createdAt)} · {post.status}`
  - In Editor.tsx getPostValidationErrors and ValidationIssue (from postkit-validation-library)
  when issues is set `const issues = getPostValidationErrors(candidate)`
  in function `function mapValidationIssuesToFields`
  - In PostList.tsx: readingTime, formatTime (from postkit-reading-time) and formatDate (from postkit-date-status-display). In the rendered post `<p className="text-xs text-gray-500 mt-1">{formatTime(readingTime(post.body))} to read</p>`, `<p className="text-xs text-gray-500 mt-1">created at {formatDate(post.createdAt)}</p>`, 

 View Boundaries: 

