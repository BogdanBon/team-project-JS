function ifWatched() {
  if (!localStorage.getItem('watched')) {
    localStorage.setItem('watched', JSON.stringify([]));
  }
}

ifWatched();

function ifQueue() {
  if (!localStorage.getItem('queue')) {
    localStorage.setItem('queue', JSON.stringify([]));
  }
}

ifQueue();
