// Treat missing `published` as true so older docs still show.

export const LATEST_GALLERIES = `
*[
  _type == "gallery" &&
  coalesce(published, true) == true
]
| order(dateTime(_createdAt) desc)[0...3]{
  title,
  "slug": slug.current
}
`;

export const LATEST_COLLECTIONS = `
*[
  _type == "collection" &&
  coalesce(published, true) == true
]
| order(dateTime(_createdAt) desc)[0...3]{
  title,
  "slug": slug.current
}
`;
