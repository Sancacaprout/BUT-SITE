import { getAllRevisionCards } from "@/content/weeks";
import { ReviewClient } from "@/components/learning/review-client";

export default function ReviewPage() {
  return <ReviewClient cards={getAllRevisionCards()} />;
}
