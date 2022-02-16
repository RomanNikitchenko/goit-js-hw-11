import './css/styles.css';
import fetchPixabay from './fetchPixabayserver';

const form = document.querySelector("#search-form");
const btnLoadMore = document.querySelector(".load-more");
const gallery = document.querySelector(".gallery");

let name = '';
let page = 1;

const doStuff = async (name, page) => {
  try {
    const picture = await fetchPixabay(name, page);
    const { total, totalHits, hits } = picture;
    renderPosts(hits);
  } catch (error) {
    console.log(error.message);
  }
};

form.addEventListener("submit", onSearch);

async function onSearch(e) {
  e.preventDefault();

  const { elements } = e.currentTarget;
  const { searchQuery } = elements;

  if (!searchQuery.value) {
    return
  };

  gallery.innerHTML = '';

  name = searchQuery.value;

  page = 1;

  doStuff(name, page);

  searchQuery.value = '';
};


btnLoadMore.addEventListener('click', onLoadMore);

async function onLoadMore() {
  page += 1;

  doStuff(name, page);
};


function renderPosts(hits) {
  const markup = hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
    return `
      <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b> ${likes}
          </p>
          <p class="info-item">
            <b>Views</b> ${views}
          </p>
          <p class="info-item">
            <b>Comments</b> ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b> ${downloads}
          </p>
        </div>
      </div>
    `;
  }).join("");

  gallery.insertAdjacentHTML("beforeend", markup);
};
