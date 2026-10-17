/** A generated recipe function, which carries its variant map. */
type RecipeWithVariants = { variantMap: Record<string, readonly unknown[]> };

/**
 * The values one variant of a Panda recipe accepts, read from the generated recipe, so a primitive's prop type can
 * never drift from the recipe. Use it as `VariantOf<typeof list, 'gap'>`.
 */
export type VariantOf<
  Recipe extends RecipeWithVariants,
  Key extends keyof Recipe['variantMap'],
> = Recipe['variantMap'][Key][number];
