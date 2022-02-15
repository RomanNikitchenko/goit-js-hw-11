import './css/styles.css';

async function fetchCountries() {
  const response = await fetch(`https://pixabay.com/api/?key=25718667-d0b548046b545cf0dd46ad07c&q=dog&image_type=photo&per_page=5&page=1`);
  if (!response.ok) {
    throw new Error(response.status);
  } else {
    const picture = await response.json();
    return picture;
  }
};

async function onSearch() {
  try {
    const picture = await fetchCountries();
    const { total, totalHits, hits } = picture;
    console.log(hits);
  } catch {
    console.log("ошибка");
  }
};

onSearch();
