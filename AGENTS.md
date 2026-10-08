<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application architecture
- Use TanStack file routes with route-specific metadata and shared funnel modules; this preserves typed navigation without a second router.
- Keep the demo state and anonymized session events in validated browser storage, hydrated after mount; this avoids SSR mismatch and requires no backend.
- Model transitions and eligibility in pure functions, separate from page UI; this makes business rules directly testable.
- Offer prices are nullable configuration values; never invent a monetary total when any selected price is unknown.