import { db } from "@/lib/db";
import { TopperForm } from "../TopperForm";

export default async function NewTopperPage() {
  const categories = await db.query.categories.findMany();
  return <TopperForm initial={null} categories={categories.map((c) => ({ id: c.id, label: c.label }))} />;
}
