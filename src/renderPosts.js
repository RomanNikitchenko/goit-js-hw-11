import imageCardTemplate from './templates/picture-card.hbs';

export default function renderPosts(hits) {
  return hits.map(hit => imageCardTemplate(hit)).join("");
};
