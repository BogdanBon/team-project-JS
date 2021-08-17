export default function getRefs() {
    return {
        upTop: document.querySelector('.top-arrow'),
         };
}
const refs = getRefs();

document.addEventListener('DOMContentLoaded', () => {
  window.onscroll = function () {
    if (window.pageYOffset > 600) {
      refs.upTop.classList.add('up-top');
    } else {
      refs.upTop.classList.remove('up-top');
    }
  };
  refs.upTop.addEventListener('click', function () {
    window.scrollBy({
      top: -document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  });
});