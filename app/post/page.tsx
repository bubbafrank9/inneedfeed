import { PostNeedForm } from "@/components/PostNeedForm";

export default function PostPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-12">
      <header>
        <h1 className="text-3xl font-semibold text-[#2f4a3a]">Post a need</h1>
        <p className="mt-2 text-[#5c6b61]">
          Charity / steward demo form. Production will require vetted charity accounts — this PIN
          gate is for the pilot UI only. Same demo PIN confirms fulfillments on need detail pages.
        </p>
      </header>
      <PostNeedForm />
    </div>
  );
}
