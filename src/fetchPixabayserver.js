export default async function fetchPixabay(name, page) {
  const response = await fetch(`https://pixabay.com/api/?key=25718667-d0b548046b545cf0dd46ad07c&q=${name}&image_type=photo&safesearch=true&per_page=40&page=${page}`);
  if (!response.ok) {
    throw new Error(response.status);
  } else {
    const picture = await response.json();
    return picture;
  }
};
