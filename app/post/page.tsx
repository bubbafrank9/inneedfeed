import { PageBanner } from "@/components/PageBanner";
import { PostNeedForm } from "@/components/PostNeedForm";

export default function PostPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-12">
      <PageBanner
        src="/chicago/section-towers.jpg"
        eyebrow="Charity / steward · demo"
        title="Post a need"
      >
        <p>
          Production will require vetted charity accounts — this PIN gate is for the pilot UI only.
          Same demo PIN confirms fulfillments on need detail pages.
        </p>
      </PageBanner>
      <PostNeedForm />
    </div>
  );
}
