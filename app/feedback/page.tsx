import { FeedbackForm } from "@/components/FeedbackForm";
import { PageHeader } from "@/components/PageHeader";

export default function FeedbackPage() {
  return (
    <>
      <PageHeader
        title="Give Feedback"
        description="Five quick questions about how easy it was to find the job you were looking for. It takes about two minutes."
      />
      <FeedbackForm />
    </>
  );
}
