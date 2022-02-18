export default async function fetchPixabay(name, page, limit) {
  const APIKEY = '25718667-d0b548046b545cf0dd46ad07c';
  const response = await fetch(`https://pixabay.com/api/?key=${APIKEY}&q=${name}&image_type=photo&safesearch=true&per_page=${limit}&page=${page}`);
  if (!response.ok) {
    throw new Error(response.status);
  } else {
    const picture = await response.json();
    return picture;
  }
};
