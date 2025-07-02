
-- Create a search function for recipes
CREATE OR REPLACE FUNCTION public.search_recipes(
  search_query text DEFAULT '',
  category_filter text DEFAULT NULL,
  difficulty_filter text DEFAULT NULL,
  limit_count integer DEFAULT 50,
  offset_count integer DEFAULT 0
)
RETURNS TABLE(
  id integer,
  title character varying,
  slug character varying,
  description text,
  excerpt character varying,
  difficulty character varying,
  prep_time_in_min integer,
  cook_time_in_min integer,
  servings integer,
  featured boolean,
  trending boolean,
  editors_pick boolean,
  created_at timestamp without time zone,
  updated_at timestamp without time zone,
  published_at timestamp without time zone,
  ingredients jsonb,
  instructions jsonb,
  nutrition_calories integer,
  nutrition_protein_in_g integer,
  nutrition_carbs_in_g integer,
  nutrition_fat_in_g integer,
  categories jsonb,
  image_url text,
  author jsonb
) 
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.title,
    r.slug,
    r.description,
    r.excerpt,
    r.difficulty,
    r.prep_time_in_min,
    r.cook_time_in_min,
    r.servings,
    r.featured,
    r.trending,
    r.editors_pick,
    r.created_at,
    r.updated_at,
    r.published_at,
    r.ingredients,
    r.instructions,
    r.nutrition_calories,
    r.nutrition_protein_in_g,
    r.nutrition_carbs_in_g,
    r.nutrition_fat_in_g,
    COALESCE(
      json_agg(
        DISTINCT jsonb_build_object(
          'id', c.id,
          'name', c.name,
          'slug', c.slug
        )
      ) FILTER (WHERE c.id IS NOT NULL),
      '[]'::json
    )::jsonb as categories,
    COALESCE(f.url, '') as image_url,
    COALESCE(
      jsonb_build_object(
        'id', a.id,
        'name', a.name,
        'email', a.email,
        'avatar_url', af.url
      ),
      '{}'::jsonb
    ) as author
  FROM receipes r
  LEFT JOIN receipes_categories_lnk rcl ON r.id = rcl.receipe_id
  LEFT JOIN categories c ON rcl.category_id = c.id AND c.published_at IS NOT NULL
  LEFT JOIN files_related_mph frm ON r.id = frm.related_id 
    AND frm.related_type = 'api::receipe.receipe' 
    AND frm.field = 'image'
  LEFT JOIN files f ON frm.file_id = f.id
  LEFT JOIN receipes_author_lnk ral ON r.id = ral.receipe_id
  LEFT JOIN authors a ON ral.author_id = a.id
  LEFT JOIN files_related_mph afrm ON a.id = afrm.related_id 
    AND afrm.related_type = 'api::author.author' 
    AND afrm.field = 'avatar'
  LEFT JOIN files af ON afrm.file_id = af.id
  WHERE 
    r.published_at IS NOT NULL
    AND (
      search_query = '' OR
      r.title ILIKE '%' || search_query || '%' OR
      r.description ILIKE '%' || search_query || '%' OR
      r.excerpt ILIKE '%' || search_query || '%'
    )
    AND (category_filter IS NULL OR c.slug = category_filter)
    AND (difficulty_filter IS NULL OR r.difficulty = difficulty_filter)
  GROUP BY r.id, f.url, a.id, a.name, a.email, af.url
  ORDER BY r.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$function$;
