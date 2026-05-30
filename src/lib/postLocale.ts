export interface MultilingualPost {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  titleDe?: string | null;
  slugDe?: string | null;
  excerptDe?: string | null;
  contentDe?: string | null;
  titleAr?: string | null;
  slugAr?: string | null;
  excerptAr?: string | null;
  contentAr?: string | null;
}

export interface LocalizedPostFields {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
}

export function localizePost(post: MultilingualPost, locale: string): LocalizedPostFields {
  if (locale === 'de') {
    return {
      title:   post.titleDe   || post.title,
      slug:    post.slugDe    || post.slug,
      excerpt: post.excerptDe ?? post.excerpt ?? null,
      content: post.contentDe || post.content,
    };
  }
  if (locale === 'ar') {
    return {
      title:   post.titleAr   || post.title,
      slug:    post.slugAr    || post.slug,
      excerpt: post.excerptAr ?? post.excerpt ?? null,
      content: post.contentAr || post.content,
    };
  }
  return {
    title:   post.title,
    slug:    post.slug,
    excerpt: post.excerpt ?? null,
    content: post.content,
  };
}

/** Build the Prisma OR condition so any locale's slug can find the post. */
export function slugLookup(slug: string) {
  return [
    { slug },
    { slugDe: slug },
    { slugAr: slug },
  ];
}
