import { listNeeds } from "@/lib/marketplace/store";
import { SiteNavClient } from "./SiteNavClient";

export async function SiteNav() {
  const needs = await listNeeds();
  const openCount = needs.filter((n) => n.status === "open").length;
  const claimedCount = needs.filter((n) => n.status === "claimed" || n.status === "fulfilled").length;

  return <SiteNavClient openCount={openCount} claimedCount={claimedCount} />;
}
