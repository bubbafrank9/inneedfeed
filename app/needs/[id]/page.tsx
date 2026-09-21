import Link from "next/link";
import { notFound } from "next/navigation";
import { ClaimForm } from "@/components/ClaimForm";
import { FulfillActions } from "@/components/FulfillActions";
import { getNeed } from "@/lib/marketplace/store";

export const dynamic = "force-dynamic";

export default async function NeedDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ claimed?: string; fulfilled?: string; confirmed?: string }>;
}) {
  const { id } = await params;
  const flash = await searchParams;
  const need = await getNeed(id);
  if (!need) notFound();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <Link href="/calendar" className="text-sm font-medium text-[#8a6b3d] hover:underline">
        ← Back to calendar
      </Link>

      {flash.claimed ? (
        <p className="rounded-xl bg-[#e7f2ea] px-4 py-3 text-sm text-[#2f4a3a]">
          Claim locked. Deliver in the window, then mark fulfilled so the charity can confirm.
        </p>
      ) : null}
      {flash.fulfilled ? (
        <p className="rounded-xl bg-[#e8eef8] px-4 py-3 text-sm text-[#3a4a6a]">
          Marked fulfilled. Waiting on charity confirm — plaques and the scoreboard wait for that
          step.
        </p>
      ) : null}
      {flash.confirmed ? (
        <p className="rounded-xl bg-[#2f4a3a] px-4 py-3 text-sm text-[#fffaf2]">
          Confirmed. This meal now counts for recognition and the Chicago scoreboard.
        </p>
      ) : null}

      <header className="rounded-3xl border border-[#e7dcc8] bg-white p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[#8a6b3d]">
          {need.date} · {need.neighborhood} · {need.mealType}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[#2f4a3a]">{need.title}</h1>
        <p className="mt-2 text-[#5c6b61]">{need.charityName}</p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <dt className="font-medium text-[#2f4a3a]">Headcount</dt>
            <dd className="text-[#5c6b61]">{need.headcount} people</dd>
          </div>
          <div>
            <dt className="font-medium text-[#2f4a3a]">Delivery window</dt>
            <dd className="text-[#5c6b61]">{need.deliveryWindow}</dd>
          </div>
          <div>
            <dt className="font-medium text-[#2f4a3a]">Diet rules</dt>
            <dd className="text-[#5c6b61]">{need.dietRules}</dd>
          </div>
          <div>
            <dt className="font-medium text-[#2f4a3a]">Allergens</dt>
            <dd className="text-[#5c6b61]">{need.allergens}</dd>
          </div>
        </dl>
        {need.notes ? (
          <p className="mt-4 text-sm text-[#5c6b61]">
            <span className="font-medium text-[#2f4a3a]">Notes: </span>
            {need.notes}
          </p>
        ) : null}
        <p className="mt-4 inline-flex rounded-full bg-[#f0e6d6] px-3 py-1 text-xs font-medium capitalize text-[#7a5c2e]">
          Status: {need.status}
        </p>
      </header>

      {need.status === "open" ? <ClaimForm needId={need.id} /> : null}

      {need.status !== "open" && need.claimedBy ? (
        <section className="rounded-2xl border border-[#e7dcc8] bg-[#fffaf2] p-6 text-sm text-[#3d5346]">
          <h2 className="text-lg font-semibold text-[#2f4a3a]">Claim details</h2>
          <ul className="mt-3 space-y-1">
            <li>
              <span className="font-medium">Restaurant:</span> {need.claimedBy.restaurantName}
            </li>
            <li>
              <span className="font-medium">Contact:</span> {need.claimedBy.contactName}
            </li>
            {need.claimedBy.contactPhone ? (
              <li>
                <span className="font-medium">Phone:</span> {need.claimedBy.contactPhone}
              </li>
            ) : null}
            <li>
              <span className="font-medium">Claimed at:</span> {need.claimedBy.claimedAt}
            </li>
            {need.fulfilledAt ? (
              <li>
                <span className="font-medium">Fulfilled at:</span> {need.fulfilledAt}
              </li>
            ) : null}
            {need.confirmedAt ? (
              <li>
                <span className="font-medium">Confirmed at:</span> {need.confirmedAt}
              </li>
            ) : null}
          </ul>
        </section>
      ) : null}

      {need.status === "claimed" ? <FulfillActions needId={need.id} mode="fulfill" /> : null}

      {need.status === "fulfilled" ? <FulfillActions needId={need.id} mode="confirm" /> : null}

      {need.status === "confirmed" ? (
        <section className="rounded-2xl border border-[#2f4a3a]/20 bg-[#e7f2ea] p-6 text-sm text-[#2f4a3a]">
          <h2 className="text-lg font-semibold">Recognition note</h2>
          <p className="mt-2 leading-6 text-[#3d5346]">
            This meal is charity-confirmed. It counts toward {need.claimedBy?.restaurantName ?? "the restaurant"}
            ’s plaque tier (Neighbor / Table Steward / City Champion — thresholds TBD) and toward the
            public{" "}
            <Link href="/scoreboard" className="font-medium underline underline-offset-2">
              Chicago scoreboard
            </Link>
            . See{" "}
            <Link href="/recognition" className="font-medium underline underline-offset-2">
              Plaques
            </Link>{" "}
            for the live leaderboard.
          </p>
        </section>
      ) : null}

      {need.status === "cancelled" ? (
        <p className="rounded-xl border border-[#e7dcc8] bg-white px-4 py-3 text-sm text-[#5c6b61]">
          This need was cancelled and is no longer available.
        </p>
      ) : null}
    </div>
  );
}
