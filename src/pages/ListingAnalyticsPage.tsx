import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getListingAnalytics } from "../api/analytics";
import { QueryStateNotice } from "../components/QueryStateNotice";
import { getAnalyticsCards, getTopListingSummary } from "../features/analytics/listingAnalyticsMeta";

export function ListingAnalyticsPage() {
  const analyticsQuery = useQuery({
    queryKey: ["listing-analytics"],
    queryFn: getListingAnalytics
  });

  const analytics = analyticsQuery.data;

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-black/5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-fern">Analytics</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">Listing performance</h1>
        <p className="mt-4 text-stone-700">Track how your adoption posts are moving through review, saves, and requests.</p>
      </section>

      {analyticsQuery.isError ? (
        <QueryStateNotice
          title="Analytics could not load"
          message={(analyticsQuery.error as Error).message || "Your listing stats are unavailable right now."}
          tone="error"
        />
      ) : analyticsQuery.isLoading ? (
        <QueryStateNotice title="Loading analytics" message="Summarizing your listing performance." />
      ) : !analytics ? (
        <QueryStateNotice title="Analytics unavailable" message="No analytics payload was returned for this account." tone="error" />
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {getAnalyticsCards(analytics.stats).map((card) => (
              <article key={card.label} className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
                <p className="text-sm font-medium text-stone-500">{card.label}</p>
                <p className="mt-3 text-4xl font-semibold tracking-tight text-ink">{card.value}</p>
                <p className="mt-2 text-sm text-stone-700">{card.caption}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.8fr_1fr]">
            <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-ink">Top performing listings</h2>
                  <p className="mt-2 text-sm leading-6 text-stone-700">Most engagement across adoption requests and saved favorites.</p>
                </div>
                <Link to="/dashboard/listings" className="rounded-full border border-ink/10 px-4 py-2 text-sm font-medium text-ink">
                  Open my listings
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                {analytics.topListings.length ? (
                  analytics.topListings.map((listing) => {
                    const summary = getTopListingSummary(listing);

                    return (
                      <article
                        key={listing.id}
                        className="flex flex-col gap-3 rounded-[24px] border border-black/5 bg-canvas/70 p-5 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <h3 className="text-lg font-semibold text-ink">{listing.name}</h3>
                          <p className="mt-2 text-sm text-stone-700">{summary.engagementLabel}</p>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="rounded-full bg-fern/10 px-3 py-1 font-medium text-fern">{summary.statusLabel}</span>
                          <Link to={`/pets/${listing.id}`} className="rounded-full bg-fern px-5 py-2 font-medium text-white">
                            View listing
                          </Link>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <QueryStateNotice
                    title="No listing activity yet"
                    message="Publish a few listings first. Request and save activity will appear here once adopters engage."
                  />
                )}
              </div>
            </div>

            <aside className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
              <h2 className="text-2xl font-semibold text-ink">At a glance</h2>
              <dl className="mt-6 space-y-4 text-sm text-stone-700">
                <div className="rounded-[24px] bg-canvas/70 p-4">
                  <dt className="font-medium text-ink">Adopted placements</dt>
                  <dd className="mt-1">{analytics.stats.adoptedListings} listings marked as adopted.</dd>
                </div>
                <div className="rounded-[24px] bg-canvas/70 p-4">
                  <dt className="font-medium text-ink">Needs attention</dt>
                  <dd className="mt-1">
                    {analytics.stats.rejectedListings} rejected and {analytics.stats.draftListings} draft listings can still be improved.
                  </dd>
                </div>
                <div className="rounded-[24px] bg-canvas/70 p-4">
                  <dt className="font-medium text-ink">Approval momentum</dt>
                  <dd className="mt-1">
                    {analytics.stats.approvedRequestsReceived} adoption requests already reached approval.
                  </dd>
                </div>
              </dl>
            </aside>
          </section>
        </>
      )}
    </div>
  );
}
