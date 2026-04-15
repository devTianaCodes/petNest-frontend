import type { Category } from "../types/pets";
import { apiRequest } from "./client";

export function getCategories() {
  return apiRequest<{ categories: Category[] }>("/categories");
}
