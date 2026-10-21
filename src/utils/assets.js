// Resolves files placed in src/assets/** (e.g. "profile/photo.jpg").
// Returns null when the file does not exist, so UI can hide the related button/image
// instead of linking to something broken.
const files = import.meta.glob("/src/assets/**/*", {
  eager: true,
  query: "?url",
  import: "default",
});

export const isValidUrl = (value) =>
  typeof value === "string" && /^https?:\/\/\S+$/i.test(value.trim());

export const getAsset = (name) => {
  if (!name) return null;
  if (isValidUrl(name)) return name; // full URLs are allowed everywhere
  return files[`/src/assets/${name}`] ?? null;
};

// Public-folder files (placeholders, tool icons, 3D card).
export const publicUrl = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

// Values written as "[Like this]" are treated as unfilled placeholders.
export const isPlaceholder = (value) =>
  typeof value === "string" && /^\[.*\]$/.test(value.trim());
