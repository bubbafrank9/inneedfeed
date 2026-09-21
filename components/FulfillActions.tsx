"use client";

import { useActionState } from "react";
import {
  confirmFulfilledAction,
  markFulfilledAction,
  type ActionState,
} from "@/app/actions/needs";

const initial: ActionState = {};

export function FulfillActions({
  needId,
  mode,
}: {
  needId: string;
  mode: "fulfill" | "confirm";
}) {
  if (mode === "fulfill") {
    return <MarkFulfilledForm needId={needId} />;
  }
  return <ConfirmFulfilledForm needId={needId} />;
}

function MarkFulfilledForm({ needId }: { needId: string }) {
  const action = markFulfilledAction.bind(null, needId);
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="mt-4 space-y-4 rounded-2xl border border-[#e7dcc8] bg-white p-6">
      <h2 className="text-lg font-semibold text-[#2f4a3a]">Mark fulfilled</h2>
      <p className="text-sm text-[#5c6b61]">
        Restaurant step: trays delivered in the window. Charity still must confirm before this
        counts on the scoreboard or for plaques.
      </p>
      {state.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#2f4a3a] px-5 py-2.5 text-sm font-medium text-[#fffaf2] disabled:opacity-60"
      >
        {pending ? "Saving…" : "We delivered — mark fulfilled"}
      </button>
    </form>
  );
}

function ConfirmFulfilledForm({ needId }: { needId: string }) {
  const action = confirmFulfilledAction.bind(null, needId);
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="mt-4 space-y-4 rounded-2xl border border-[#e7dcc8] bg-white p-6">
      <h2 className="text-lg font-semibold text-[#2f4a3a]">Charity confirm</h2>
      <p className="text-sm text-[#5c6b61]">
        Confirm the meal arrived usable and on time. MVP uses the same demo PIN as posting a need.
        Only confirmed meals count for recognition.
      </p>
      {state.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{state.error}</p>
      ) : null}
      <label className="block text-sm text-[#3d5346]">
        <span className="mb-1 block font-medium">Demo PIN</span>
        <input
          name="demoPin"
          type="text"
          required
          className="w-full rounded-xl border border-[#e7dcc8] bg-[#fffaf2] px-3 py-2 outline-none focus:border-[#c4a574]"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#2f4a3a] px-5 py-2.5 text-sm font-medium text-[#fffaf2] disabled:opacity-60"
      >
        {pending ? "Confirming…" : "Confirm fulfillment"}
      </button>
    </form>
  );
}
