import { ScholarsBrowser } from "@/components/scholars-browser";
import { getAllScholars } from "@/content/store";

export default async function ScholarsPage() {
  const scholars = await getAllScholars();

  return <ScholarsBrowser scholars={scholars} />;
}
