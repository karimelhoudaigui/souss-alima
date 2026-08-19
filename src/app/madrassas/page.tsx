import { MadrassasBrowser } from "@/components/madrassas-browser";
import { getAllMadrassas } from "@/content/store";

export default async function MadrassasPage() {
  const madrassas = await getAllMadrassas();

  return (
    <div className="container-page overflow-hidden py-8 md:py-12">
      <MadrassasBrowser madrassas={madrassas} />
    </div>
  );
}
