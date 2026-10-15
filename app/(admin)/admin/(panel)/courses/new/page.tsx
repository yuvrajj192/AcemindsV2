import { db, schema } from "@/lib/db";
import { CourseForm } from "../CourseForm";

export default async function NewCoursePage() {
  const categories = await db.query.categories.findMany();
  return <CourseForm initial={null} categories={categories.map((c) => ({ id: c.id, label: c.label }))} />;
}
