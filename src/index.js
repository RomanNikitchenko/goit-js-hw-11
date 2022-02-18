import './css/styles.css';
import fetchPixabay from './fetchPixabayserver';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const form = document.querySelector("#search-form");
const btnLoadMore = document.querySelector(".load-more");
const gallery = document.querySelector(".gallery");

btnLoadMore.classList.add("is-hidden");

let name = '';
let page = 1;
let limit = 5;

const doStuff = async (name, page) => {
  try {
    const picture = await fetchPixabay(name, page, limit);
    const { total, totalHits, hits } = picture;

    if (!hits.length) {
      Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      btnLoadMore.classList.add("is-hidden");
      setTimeout(() => {
        gallery.innerHTML = '';
      }, 300);
      return;
    } else if (hits.length < limit && page === 1) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
      btnLoadMore.classList.add("is-hidden");
      setTimeout(() => {
        gallery.innerHTML = '';
      }, 300);
    } else if (hits.length < limit) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      btnLoadMore.classList.add("is-hidden");
    } else if (page === 1) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
      gallery.innerHTML = '';
      setTimeout(() => {
        btnLoadMore.classList.remove("is-hidden");
      }, 300);
    };
    setTimeout(() => {
      renderPosts(hits);
    }, 300);
  } catch (error) {
    console.log(error.message);
  };
};

form.addEventListener("submit", onSearch);

function onSearch(e) {
  e.preventDefault();

  const { elements } = e.currentTarget;
  const { searchQuery } = elements;

  if (!searchQuery.value) {
    Notify.warning("line is empty");
    btnLoadMore.classList.add("is-hidden");
    setTimeout(() => {
      gallery.innerHTML = '';
    }, 250);
    return
  };

  name = searchQuery.value;
  page = 1;
  doStuff(name, page);

  searchQuery.value = '';
};


btnLoadMore.addEventListener('click', onLoadMore);

function onLoadMore() {
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
