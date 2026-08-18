import { PageHeader } from "@/components/ui";
import { ContributionForm } from "@/components/contribution-form";

export default function ContributePage() {
  return (
    <div>
      <PageHeader
        kicker="Contribution"
        title="Contribuer avec une source"
        description="Vous connaissez une madrassa, disposez d'une reference ou constatez une erreur : envoyez une contribution courte et verifiable."
        narrow
      />
      <section className="container-text pb-14">
        <ContributionForm />
      </section>
    </div>
  );
}
