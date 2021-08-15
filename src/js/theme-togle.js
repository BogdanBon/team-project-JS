const Theme = {
  LIGHT: 'light-theme',
  DARK: 'dark-theme',
};

const refs = {
  themeSwitchControl: document.querySelector('.theme-switch__toggle'),
  body: document.querySelector('body'),
  modal: document.querySelector('.modal__content'),
  footer: document.querySelector('.footer'),
};

setLocalStorage();
refs.body.classList.add(Theme.LIGHT);
refs.modal.classList.add(Theme.LIGHT);
refs.footer.classList.add(Theme.LIGHT);

refs.themeSwitchControl.addEventListener('change', changeSwitchControl);

function changeSwitchControl() {
  const check = refs.themeSwitchControl.checked;

  if (check) {
    refs.body.classList.replace(Theme.LIGHT, Theme.DARK);
    refs.modal.classList.replace(Theme.LIGHT, Theme.DARK);
    refs.footer.classList.replace(Theme.LIGHT, Theme.DARK);

    localStorage.setItem('theme', 'dark-theme');
  } else {
    refs.body.classList.replace(Theme.DARK, Theme.LIGHT);
    refs.modal.classList.replace(Theme.DARK, Theme.LIGHT);
    refs.footer.classList.replace(Theme.DARK, Theme.LIGHT);
    localStorage.setItem('theme', 'light-theme');
  }
}

function setLocalStorage() {
  const getTheme = localStorage.getItem('theme');

  if (getTheme === 'dark-theme') {
    refs.body.classList.add(Theme.DARK);
    refs.modal.classList.add(Theme.DARK);
    refs.footer.classList.add(Theme.DARK);
    refs.themeSwitchControl.checked = true;
    localStorage.setItem('theme', 'dark-theme');
  } else {
    localStorage.setItem('theme', 'light-theme');
  }
}
