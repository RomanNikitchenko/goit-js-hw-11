import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export default new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
