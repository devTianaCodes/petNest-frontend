# Frontend review — 2026-09-07

The review preserved React 18, client-side rendering, React Router route-level lazy loading, React Query server state, React Hook Form/Zod forms, Tailwind styling, and the Vite/Vercel deployment boundary. The installed versions inspected were React 18.3.1, React Query 5.99.0, React Router 6.30.3, Vite 4.5.14, and TypeScript 5.9.3. The React plugin configuration does not enable the React Compiler. No dependencies or lockfiles were changed.

## Findings addressed

| Priority | Evidence and impact | Correction |
| --- | --- | --- |
| P1 | `AuthContext.tsx`: startup refresh success could overwrite a later login/logout; Strict Mode could rotate the same refresh cookie twice. | `createAuthSession` coalesces refreshes and ignores superseded responses, with deterministic deferred-promise tests. |
| P1 | `AuthContext.tsx`, `FavoriteButton.tsx`, `PetDetailsPage.tsx`: private queries survived account changes, and owner-specific detail/favorite results shared keys across users. | Clear the QueryClient on identity changes and scope mixed public/private query keys by user ID. Logout clears local identity before the network request completes. |
| P1 | `EditListingPage.tsx` → `getPet` → backend `pets.routes.ts`: the server never authenticated listing-detail requests, so owners received 404 for drafts and omitted contacts on published listings. | Backend optional authentication now reaches the existing owner checks. The editor uses the matching user-specific query key and explains when editing is forbidden. |
| P2 | `ImageUploader.tsx`: removing one file revoked the URLs of retained previews; duplicate filenames also produced duplicate keys. | Effects own each preview batch and its cleanup, keys use unique preview URLs, and pending uploads lock selection/removal. |
| P2 | `ImageUploader.tsx`, `imageSelection.ts`: oversized/unsupported files were sent before meaningful feedback, and the file input overflowed the mobile layout. | Validate count/type/5 MB size locally, label the control and announce errors, constrain its width, and confirm deletion of stored photos. Accepted formats are JPEG, PNG, GIF, and WebP, matching the backend. |
| P2 | `browseParams.ts`: trimming each keystroke made multi-word searches and locations impossible to type; fractional page URLs could produce page zero. | Preserve in-progress spaces and normalize invalid page numbers. Remove a memoization whose object dependency changed every render. Backend search now includes rescue stories, as the existing placeholder promises. |

## Verification

Baseline: 62 tests passed; root production build and critical-asset verification passed. Final: 70 tests pass, strict TypeScript compilation and the root production build pass. There is no lint command or separate lint configuration in the inspected app manifest.

Browser checks used the real frontend with a temporary local API fixture. The fixture blocked live Prisma operations. Checks covered anonymous browsing, typing `New York` character by character, fixture login and owner draft editing, selecting two same-name photos and removing one while retaining a working preview, and keyboard traversal to the upload button. Screens were inspected at 390px and 1440px widths. The uploader's measured mobile document width fell from 417px to 390px after the width correction; the browse page also measured 390px without overflow. No fixture images were submitted to storage.

The refresh regression test measures two concurrent calls sharing one transport request. No end-user latency or live-database performance benchmark was performed. Existing lazy routes and asset optimizations remain in place; no general speedup is claimed.

## Remaining work

- P2: `src/api/client.ts` refreshes neither automatically on access-token expiry nor on a protected 401. Define one shared refresh/retry path with bounded retries, cancellation, and an expired-session UI before addressing this; retry only requests rejected before side effects.
- P2: `VerifyEmailPage.tsx` performs a one-use verification mutation in an effect. Strict Mode/reloads can repeat it, and registration has no production email-delivery integration in the backend. Coordinate verification idempotency and delivery before treating signup as production-ready.
- P2: `PetDetailsPage.tsx` lightbox lacks dialog semantics, focus trapping/restoration, and Escape handling. This surface was inspected in code but not changed in this pass.
- P2: Listing form validation does not yet mirror every backend maximum length, and optional unknown booleans become false in form defaults. Preserve unknown values deliberately before changing that data-entry contract.
- Browser checks used fixtures, not live MySQL/Cloudinary or deployed third-party-cookie policies. There is no automated DOM/end-to-end test runner in this repository. Node helper tests do not replace browser coverage of cache transitions and effects.
- Pre-existing browser console warnings remain for React Router's v7 future flag and React 18's unrecognized `fetchPriority` prop in `PetCard`. No dependency/React migration was attempted to resolve them.

The root `ai-scripts/validate-template` check fails because `ModuleRules.md` is absent. This is pre-existing coordination tooling, separate from the passing application build/test gates.
