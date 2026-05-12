Question 1 — Prediction vs reality

My answer:

I predicted the files that would need to change were PostList.tsx and Preview.tsx — the two places that display dates. I also correctly predicted that the Post type in types.ts would need a new publishedAt attribute.

What I underestimated was Editor.tsx. I hadn't thought carefully about where publishedAt actually gets *set*, only about where it gets *displayed*. The real logic — detecting whether this save is the first transition to published, and stamping the timestamp at that moment — lives in buildCandidatePost inside Editor.tsx. The store's updatePost action didn't need changes because it already merges Partial<Post>, but the save path in the editor needed new branching logic.

I also didn't predict the type casting issue. When the postkit-search-library processes the post list and returns results, TypeScript forgets about publishedAt because the library's Post type doesn't include it. This didn't show up in Preview.tsx because Preview gets its post directly from the store, which TypeScript correctly types as my app's Post. It only surfaced in PostList.tsx when I tried to access post.publishedAt inside the .map() after the library functions had processed the list. That required importing my Post type and casting visiblePosts as Post[] — something I hadn't predicted at all.

So: I got the display files right, missed the save logic in Editor.tsx, and didn't anticipate that the library's narrower type would cause a TypeScript error only in the component that runs posts through the filter/search/sort pipeline before rendering.

---

Question 2 — What absorbed the change cleanly

Name the specific place in your code that handled the change with minimal friction. What made it easy?


My answer:

Preview.tsx absorbed the change with almost no friction. Adding the publishedAt display was a single conditional line — if the post is published, show publishedAt (falling back to updatedAt for legacy posts), otherwise show updatedAt as before. Nothing broke, no existing tests failed, and it worked on the first try.

What made it easy was that Preview was already structured around reading one post from the store and formatting its fields for display. It wasn't doing any filtering, sorting, or pipeline processing — so there was no type narrowing happening that could cause TypeScript to lose track of publishedAt. The component just reads a Post, and my Post type now includes publishedAt, so it was immediately available.

---

Question 3 — What required more rework

Name the specific place that was harder than expected. What decision made it hard?

My answer:

The conditional logic in buildCandidatePost in Editor.tsx was harder than expected. Most of the work in this feature wasn't in the display at all — it was in understanding when publishedAt should be set vs. preserved vs. left off entirely. That reasoning (first publish stamps now, re-saves while published carry the original, draft/review saves don't set it) took the most time to work through, even though the resulting code was only a few if/else branches. The decision that made it hard was realizing the save path needed to look at both the incoming status from the form *and* the previous status from the stored post simultaneously — two moving parts — before it could decide what to do with publishedAt.

---

Question 4 — Test results

How many tests broke on first run? What did the number tell you about your test coverage?

Zero tests broke on the first run. That sounds like clean architecture, but it was mostly a coverage gap. The existing tests had nothing asserting publish dates at all — so when publishedAt was added as an optional field, every existing Post literal and makePost call still type-checked and passed without change. The tests couldn't break on something they weren't testing. The real signal came from having to write two new tests to actually verify the new behavior: one confirming publishedAt gets stamped on first publish and preserved on re-save, and one confirming the preview shows "Published" vs "Updated" correctly. Until those tests existed, the feature had no test coverage at all — zero failures didn't mean zero risk.

---

Question 5 — A test that caught something

This question has a specific answer or it does not. If a test caught a real bug, describe it exactly. If none did, say that honestly — and describe what test you wish you had written.

---

My answer:

No test caught a bug during this change, for the reason described in Q4 — the existing suite had no coverage of publish dates, so nothing could fail. The two new tests we added after implementation all passed on the first run.

The test I wish I had written *before* implementing was the re-save preservation check: given a post that is already published and has a publishedAt, saving it again should leave publishedAt unchanged while updatedAt moves forward. That test would have been the most useful to write first because the trickiest part of the implementation was exactly that case — making sure the save path checked the *previous* stored status before deciding whether to stamp a new timestamp. If the first draft of buildCandidatePost had naively stamped now on every save where status was published, that test would have caught it immediately instead of requiring a manual browser check to discover.

---

Question 6 — If you built it again

My answer:

I would not define the Post type in two separate files. In my app, types.ts holds the real Post type, but src/shims/postkit-storage-lib.ts has its own copy of the same type written out by hand. That meant adding publishedAt required updating both files separately — and if I had forgotten the shim, the storage layer would have silently been working with a stale type. If I built it again I would have the shim import Post directly from types.ts so there is one source of truth, and any future field additions only need to happen in one place.
