import './css/styles.css';
import fetchPixabay from './fetchPixabayserver';

const form = document.querySelector("#search-form");
const btnLoadMore = document.querySelector(".load-more");


let name = '';
let page = 2;


form.addEventListener("submit", onSearch);

async function onSearch(e) {
  e.preventDefault();

  const { elements } = e.currentTarget;
  const { searchQuery } = elements;
  name = searchQuery.value

  try {
    const picture = await fetchPixabay(name, page);
    const { total, totalHits, hits } = picture;
    console.log(hits);
  } catch {
    console.log("ошибка");
  }
};


btnLoadMore.addEventListener('click', onLoadMore);

async function onLoadMore() {
  const pictureMore = await fetchPixabay(name, page);
  const { total, totalHits, hits } = pictureMore;
  console.log(hits);
};
