import { getAdminPostCategories } from "@/lib/admin-queries";
import { PostForm } from "../PostForm";

export default async function NewPostPage() {
  const categories = await getAdminPostCategories();
  return <PostForm initial={null} categories={categories} />;
}
