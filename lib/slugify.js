// slugify.js
export function slugify(title) {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove non-alphanumeric characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with a single hyphen
  }
  