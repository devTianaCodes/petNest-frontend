import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Category, PetListing } from "../../types/pets";

const listingSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  name: z.string().min(2, "Name is required"),
  description: z.string().min(30, "Description should be more detailed"),
  ageLabel: z.string().min(2, "Age is required"),
  ageValue: z.coerce.number().int().min(0).max(99).nullable().optional(),
  ageUnit: z.enum(["WEEKS", "MONTHS", "YEARS"]).nullable().optional(),
  sex: z.enum(["MALE", "FEMALE", "UNKNOWN"]),
  size: z.enum(["SMALL", "MEDIUM", "LARGE", "UNKNOWN"]),
  breedPrimary: z.string().optional(),
  breedSecondary: z.string().optional(),
  isMixedBreed: z.boolean().optional(),
  energyLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).nullable().optional(),
  houseTrained: z.boolean().optional(),
  spayedNeutered: z.boolean().optional(),
  vaccinated: z.boolean().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  rescueStory: z.string().optional(),
  healthNotes: z.string().optional(),
  goodWithKids: z.boolean().optional(),
  goodWithDogs: z.boolean().optional(),
  goodWithCats: z.boolean().optional()
});

export type ListingFormValues = z.infer<typeof listingSchema>;

export function ListingForm({
  categories,
  initialValues,
  onSubmit,
  isSaving
}: {
  categories: Category[];
  initialValues?: Partial<PetListing>;
  onSubmit: (values: ListingFormValues) => Promise<void>;
  isSaving: boolean;
}) {
  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      categoryId: initialValues?.category?.id ?? "",
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
      ageLabel: initialValues?.ageLabel ?? "",
      ageValue: initialValues?.ageValue ?? null,
      ageUnit: initialValues?.ageUnit ?? null,
      sex: initialValues?.sex ?? "UNKNOWN",
      size: initialValues?.size ?? "UNKNOWN",
      breedPrimary: initialValues?.breedPrimary ?? "",
      breedSecondary: initialValues?.breedSecondary ?? "",
      isMixedBreed: initialValues?.isMixedBreed ?? false,
      energyLevel: initialValues?.energyLevel ?? null,
      houseTrained: initialValues?.houseTrained ?? false,
      spayedNeutered: initialValues?.spayedNeutered ?? false,
      vaccinated: initialValues?.vaccinated ?? false,
      city: initialValues?.city ?? "",
      state: initialValues?.state ?? "",
      contactEmail: initialValues?.contactEmail ?? "",
      contactPhone: initialValues?.contactPhone ?? "",
      rescueStory: initialValues?.rescueStory ?? "",
      healthNotes: initialValues?.healthNotes ?? "",
      goodWithKids: initialValues?.goodWithKids ?? false,
      goodWithDogs: initialValues?.goodWithDogs ?? false,
      goodWithCats: initialValues?.goodWithCats ?? false
    }
  });

  return (
    <form
      className="grid gap-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5 md:grid-cols-2"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <label className="space-y-2">
        <span className="text-sm font-medium">Category</span>
        <select className="w-full rounded-2xl border border-stone-200 px-4 py-3" {...form.register("categoryId")}>
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <FieldError message={form.formState.errors.categoryId?.message} />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium">Pet name</span>
        <input className="w-full rounded-2xl border border-stone-200 px-4 py-3" {...form.register("name")} />
        <FieldError message={form.formState.errors.name?.message} />
      </label>

      <label className="space-y-2 md:col-span-2">
        <span className="text-sm font-medium">Description</span>
        <textarea className="min-h-32 w-full rounded-2xl border border-stone-200 px-4 py-3" {...form.register("description")} />
        <FieldError message={form.formState.errors.description?.message} />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium">Age</span>
        <input className="w-full rounded-2xl border border-stone-200 px-4 py-3" {...form.register("ageLabel")} />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium">Age number</span>
        <input
          type="number"
          className="w-full rounded-2xl border border-stone-200 px-4 py-3"
          {...form.register("ageValue", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
        />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium">Age unit</span>
        <select
          className="w-full rounded-2xl border border-stone-200 px-4 py-3"
          {...form.register("ageUnit", { setValueAs: (value) => (value === "" ? null : value) })}
        >
          <option value="">Unknown</option>
          <option value="WEEKS">Weeks</option>
          <option value="MONTHS">Months</option>
          <option value="YEARS">Years</option>
        </select>
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium">Primary breed</span>
        <input className="w-full rounded-2xl border border-stone-200 px-4 py-3" {...form.register("breedPrimary")} />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium">Secondary breed</span>
        <input className="w-full rounded-2xl border border-stone-200 px-4 py-3" {...form.register("breedSecondary")} />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium">Energy level</span>
        <select
          className="w-full rounded-2xl border border-stone-200 px-4 py-3"
          {...form.register("energyLevel", { setValueAs: (value) => (value === "" ? null : value) })}
        >
          <option value="">Unknown</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium">Sex</span>
        <select className="w-full rounded-2xl border border-stone-200 px-4 py-3" {...form.register("sex")}>
          <option value="UNKNOWN">Unknown</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium">Size</span>
        <select className="w-full rounded-2xl border border-stone-200 px-4 py-3" {...form.register("size")}>
          <option value="UNKNOWN">Unknown</option>
          <option value="SMALL">Small</option>
          <option value="MEDIUM">Medium</option>
          <option value="LARGE">Large</option>
        </select>
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium">City</span>
        <input className="w-full rounded-2xl border border-stone-200 px-4 py-3" {...form.register("city")} />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium">State</span>
        <input className="w-full rounded-2xl border border-stone-200 px-4 py-3" {...form.register("state")} />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium">Contact email</span>
        <input className="w-full rounded-2xl border border-stone-200 px-4 py-3" {...form.register("contactEmail")} />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium">Contact phone</span>
        <input className="w-full rounded-2xl border border-stone-200 px-4 py-3" {...form.register("contactPhone")} />
      </label>

      <label className="space-y-2 md:col-span-2">
        <span className="text-sm font-medium">Rescue story</span>
        <textarea className="min-h-28 w-full rounded-2xl border border-stone-200 px-4 py-3" {...form.register("rescueStory")} />
      </label>

      <label className="space-y-2 md:col-span-2">
        <span className="text-sm font-medium">Health notes</span>
        <textarea className="min-h-28 w-full rounded-2xl border border-stone-200 px-4 py-3" {...form.register("healthNotes")} />
      </label>

      <div className="grid gap-3 rounded-3xl bg-sand/35 p-5 md:col-span-2 md:grid-cols-3">
        <label className="flex items-center gap-3 text-sm font-medium text-stone-800">
          <input type="checkbox" {...form.register("isMixedBreed")} />
          Mixed breed
        </label>
        <label className="flex items-center gap-3 text-sm font-medium text-stone-800">
          <input type="checkbox" {...form.register("houseTrained")} />
          House trained
        </label>
        <label className="flex items-center gap-3 text-sm font-medium text-stone-800">
          <input type="checkbox" {...form.register("spayedNeutered")} />
          Spayed / neutered
        </label>
        <label className="flex items-center gap-3 text-sm font-medium text-stone-800">
          <input type="checkbox" {...form.register("vaccinated")} />
          Vaccinated
        </label>
        <label className="flex items-center gap-3 text-sm font-medium text-stone-800">
          <input type="checkbox" {...form.register("goodWithKids")} />
          Good with kids
        </label>
        <label className="flex items-center gap-3 text-sm font-medium text-stone-800">
          <input type="checkbox" {...form.register("goodWithDogs")} />
          Good with dogs
        </label>
        <label className="flex items-center gap-3 text-sm font-medium text-stone-800">
          <input type="checkbox" {...form.register("goodWithCats")} />
          Good with cats
        </label>
      </div>

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-full bg-fern px-6 py-3 text-sm font-medium text-white disabled:opacity-70"
        >
          {isSaving ? "Saving..." : "Save listing"}
        </button>
      </div>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-rose-700">{message}</p>;
}
