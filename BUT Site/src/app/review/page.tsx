import { week1 } from "@/content/week-1";
import { ReviewClient } from "@/components/learning/review-client";

export default function ReviewPage() {
  return <ReviewClient cards={week1.revisionCards} />;
}
