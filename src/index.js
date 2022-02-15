import './css/styles.css';

async function fetchCountries() {
  const response = await fetch(`https://pixabay.com/api/?key=25718667-d0b548046b545cf0dd46ad07c&q=dog&image_type=photo&per_page=42&page=2`);
  if (!response.ok) {
    throw new Error(response.status);
  } else {
    const countries = await response.json();
    return countries;
  }
};

async function onSearch() {
    try {
        const countries = await fetchCountries();
        console.log(countries);
    } catch {
        console.log("ошибка");
    }
};

onSearch();
