"use client";

import { useActionState } from "react";
import { claimNeedAction, type ActionState } from "@/app/actions/needs";

const initial: ActionState = {};

export function ClaimForm({ needId }: { needId: string }) {
  const action = claimNeedAction.bind(null, needId);
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="mt-6 space-y-4 rounded-2xl border border-[#e7dcc8] bg-white p-6">
      <h2 className="text-lg font-semibold text-[#2f4a3a]">Claim this need</h2>
      <p className="text-sm text-[#5c6b61]">
        Two-step honesty: check the boxes, then submit. One restaurant per need.
      </p>
      {state.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>
      ) : null}
      <Field name="restaurantName" label="Restaurant name" required />
      <Field name="contactName" label="Contact name" required />
      <Field name="contactPhone" label="Phone" />
      <Field name="contactEmail" label="Email" type="email" />
      <label className="flex items-start gap-2 text-sm text-[#3d5346]">
        <input type="checkbox" name="confirmDiet" className="mt-1" required />
        We can meet the diet rules listed above.
      </label>
      <label className="flex items-start gap-2 text-sm text-[#3d5346]">
        <input type="checkbox" name="confirmAllergens" className="mt-1" required />
        We can meet the allergen constraints and will label trays.
      </label>
      <label className="flex items-start gap-2 text-sm text-[#3d5346]">
        <input type="checkbox" name="confirmWindow" className="mt-1" required />
        We can hit the delivery window.
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#2f4a3a] px-5 py-2.5 text-sm font-medium text-[#fffaf2] disabled:opacity-60"
      >
        {pending ? "Claiming…" : "Confirm claim"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm text-[#3d5346]">
      <span className="mb-1 block font-medium">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-[#e7dcc8] bg-[#fffaf2] px-3 py-2 outline-none focus:border-[#c4a574]"
      />
    </label>
  );
}
