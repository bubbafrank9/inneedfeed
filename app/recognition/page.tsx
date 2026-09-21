export default function RecognitionPage() {
  const tiers = [
    {
      name: "Neighbor",
      line: "We fed neighbors this month.",
      physical: "Window cling or counter standee",
      note: "First fulfilled claim — quiet thank-you, no stage.",
    },
    {
      name: "Table Steward",
      line: "Table Steward — Bread & Table",
      physical: "Wall plaque with partner mark",
      note: "Habit tier — earned pride, not purchased glow.",
    },
    {
      name: "City Champion",
      line: "City Champion — Chicago tables",
      physical: "Trophy + ceremony moment",
      note: "Annual / top-tier recognition (thresholds TBD with Bubba).",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-12">
      <header>
        <h1 className="text-3xl font-semibold text-[#2f4a3a]">Plaques & recognition</h1>
        <p className="mt-2 max-w-2xl text-[#5c6b61]">
          Story Vaccine in physical form: a mark customers can see. Recognition issues only after
          charity confirms fulfillment — this page is a copy stub for the Chicago pilot.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {tiers.map((tier) => (
          <article
            key={tier.name}
            className="flex flex-col rounded-2xl border border-[#e7dcc8] bg-white p-6"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-[#8a6b3d]">Tier</p>
            <h2 className="mt-1 text-xl font-semibold text-[#2f4a3a]">{tier.name}</h2>
            <p className="mt-4 text-lg italic text-[#3d5346]">“{tier.line}”</p>
            <p className="mt-4 text-sm text-[#5c6b61]">
              <span className="font-medium text-[#2f4a3a]">Physical: </span>
              {tier.physical}
            </p>
            <p className="mt-2 text-sm text-[#5c6b61]">{tier.note}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
