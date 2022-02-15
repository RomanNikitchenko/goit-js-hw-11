import './css/styles.css';

const form = document.querySelector("#search-form");

form.addEventListener("submit", onSearch);

async function fetchPixabay() {
  const response = await fetch(`https://pixabay.com/api/?key=25718667-d0b548046b545cf0dd46ad07c&q=dog&image_type=photo&safesearch=true&per_page=5&page=1`);
  if (!response.ok) {
    throw new Error(response.status);
  } else {
    const picture = await response.json();
    return picture;
  }
};

async function onSearch(e) {
  e.preventDefault();
  const { elements } = e.currentTarget;
  const { searchQuery } = elements;
  console.log(searchQuery.value);

  try {
    const picture = await fetchPixabay();
    const { total, totalHits, hits } = picture;
    console.log(hits);
  } catch {
    console.log("ошибка");
  }
};
