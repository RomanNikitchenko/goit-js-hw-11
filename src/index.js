import './css/styles.css';
import debounce from 'lodash.debounce';
import fetchPixabay from './fetchPixabayserver';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import simpleLightbox from './simpleLightbox';
import renderPosts from './renderPosts';

Loading.circle('Loading...', {
backgroundColor: 'rgba(0,0,0,0.8)',
});

setTimeout(() => {
  Loading.remove();
}, 500);

const form = document.querySelector("#search-form");
const submit = document.querySelector('[type="submit"]');
const btnLoadMore = document.querySelector(".load-more");
const gallery = document.querySelector(".gallery");

btnLoadMore.classList.add("is-hidden");

let name = '';
let page = 1;
let limit = 40;
let disabled = false;

async function doStuff(name, page) {
  try {

    Loading.circle('Loading...', {
      backgroundColor: 'rgba(0,0,0,0.8)',
    });

    const picture = await fetchPixabay(name, page, limit);
    const { totalHits, hits } = picture;

    if (!hits.length) {
      Loading.remove();
      Notify.failure("Sorry, there are no images matching your search query. Please try again.");

      btnLoadMore.classList.add("is-hidden");

      setTimeout(() => {
        gallery.innerHTML = '';
      }, 300);

      return;

    } else if (hits.length < limit && page === 1) {
      Loading.remove();
      Notify.success(`Hooray! We found ${totalHits} images.`);

      btnLoadMore.classList.add("is-hidden");

      setTimeout(() => {
        gallery.innerHTML = '';
      }, 300);

    } else if (hits.length < limit) {
      Loading.remove();
      Notify.info("We're sorry, but you've reached the end of search results.");

      btnLoadMore.classList.add("is-hidden");

    } else if (page === 1) {
      Loading.remove();
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

      simpleLightbox.refresh();

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

    Loading.remove();

  } catch (error) {
    console.log(error.message);
  };
};


form.addEventListener("submit", onSearch);

function onSearch(e) {
  e.preventDefault();

  Loading.circle('Loading...', {
    backgroundColor: 'rgba(0,0,0,0.8)',
  });

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
    Loading.remove(1000);
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


gallery.addEventListener('click', evt => {
  evt.preventDefault();

  if (!evt.target.classList.contains('gallery__image')) {
    return;
  };
});
