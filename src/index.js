import './css/styles.css';
import debounce from 'lodash.debounce';
import fetchPixabay from './fetchPixabayserver';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector("#search-form");
const submit = document.querySelector('[type="submit"]');
const btnLoadMore = document.querySelector(".load-more");
const gallery = document.querySelector(".gallery");

btnLoadMore.classList.add("is-hidden");

let simpl = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

let name = '';
let page = 1;
let limit = 40;
let disabled = false;

async function doStuff(name, page) {
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
      }, 500);

    } else {
      setTimeout(() => {
        btnLoadMore.classList.remove("is-hidden");
      }, 500);
    };

    setTimeout(() => {
      gallery.insertAdjacentHTML("beforeend", renderPosts(hits));

      simpl.refresh();

      setTimeout(() => {
        const photoCards = document.querySelectorAll(".photo-card");

        if (hits.length > 1) {
          photoCards.forEach(photoCard => {
            photoCard.classList.remove("is-hidden");
          });
        } else if (hits.length === 1) {
          const lastElementArray = photoCards[photoCards.length - 1];

          lastElementArray.classList.remove("is-hidden");
        };
      }, 200);
    }, 300);


  } catch (error) {
    console.log(error.message);
  };
};

form.addEventListener("submit", onSearch);

function onSearch(e) {
  e.preventDefault();

  if (disabled) {
    return;
  };
  disabled = true;

  submit.setAttribute("disabled", "disabled");

  setTimeout(() => {
    submit.removeAttribute("disabled");
    disabled = false;
  }, 1000);

  btnLoadMore.classList.add("is-hidden");

  const { elements } = e.currentTarget;
  const { searchQuery } = elements;

  if (!searchQuery.value) {
    Notify.warning("line is empty");

    setTimeout(() => {
      gallery.innerHTML = '';
    }, 300);

    return
  };

  name = searchQuery.value;
  page = 1;

  setTimeout(() => {
    doStuff(name, page);
  }, 300);

  searchQuery.value = '';
};


btnLoadMore.addEventListener('click', debounce(onLoadMore, 300));

function onLoadMore() {
  btnLoadMore.classList.add("is-hidden");
  
  page += 1;

  doStuff(name, page);
};


function renderPosts(hits) {
  return hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
    return `
      <div class="photo-card is-hidden gallery__item" >
        <a class="gallery__item" href="${largeImageURL}">
          <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
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
};

gallery.addEventListener('click', evt => {
  evt.preventDefault();

  if (!evt.target.classList.contains('gallery__image')) {
    return;
  };
});
