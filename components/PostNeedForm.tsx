"use client";

import { useActionState } from "react";
import { createNeedAction, type ActionState } from "@/app/actions/needs";

const initial: ActionState = {};

export function PostNeedForm() {
  const [state, formAction, pending] = useActionState(createNeedAction, initial);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-[#e7dcc8] bg-white p-6">
      <h2 className="text-lg font-semibold text-[#2f4a3a]">Post a meal need</h2>
      <p className="text-sm text-[#5c6b61]">
        Demo mode for the Chicago pilot. Use the demo PIN from the README. Add{" "}
        <span className="font-medium">(demo)</span> to charity names that are not yet vetted.
      </p>
      {state.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>
      ) : null}
      <Field name="demoPin" label="Demo PIN" required />
      <Field name="title" label="Need title" required />
      <Field name="charityName" label="Charity / site name" required />
      <Field name="neighborhood" label="Neighborhood" required />
      <Field name="date" label="Date" type="date" required />
      <label className="block text-sm text-[#3d5346]">
        <span className="mb-1 block font-medium">Meal type</span>
        <select
          name="mealType"
          className="w-full rounded-xl border border-[#e7dcc8] bg-[#fffaf2] px-3 py-2"
          defaultValue="dinner"
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
      </label>
      <Field name="headcount" label="Headcount" type="number" required />
      <Field name="dietRules" label="Diet rules" required />
      <Field name="allergens" label="Allergens (required — write “none known” if needed)" required />
      <Field name="deliveryWindow" label="Delivery window" required />
      <Field name="notes" label="Notes (optional)" />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#2f4a3a] px-5 py-2.5 text-sm font-medium text-[#fffaf2] disabled:opacity-60"
      >
        {pending ? "Publishing…" : "Publish need"}
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
        min={type === "number" ? 1 : undefined}
        className="w-full rounded-xl border border-[#e7dcc8] bg-[#fffaf2] px-3 py-2 outline-none focus:border-[#c4a574]"
      />
    </label>
  );
}
