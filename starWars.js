const starWars = (function () {
  
  const starWarsEl = document.getElementById('starWars');  
  const urlPhoto = 'https://api.cognitive.microsoft.com/bing/v7.0/images/search?q=';
  let urlSWAPI = 'https://swapi.co/api/people/?page=1';
  let data = {
    nextPage: '',
    prevPage: '',
    persons: []
  };

  let prevBtnEl = null;
  let nextBtnEl = null;

  _renderNavBnts();
  _addEventsOnNavBtns();
  _renderCardsList();

  function initStarWars() {
    const localStorageData = localStorage.getItem(urlSWAPI);

    if (localStorageData) {
      data = JSON.parse(localStorageData);
      _updateBtns();
      _renderCards();
      _addEventsOnNavBtns();
    } else {
      AJAX.get(urlSWAPI, (d) => {
        _parseData(d);
        _updateBtns();
        _updateLocalStorage();
        _renderCards();
        _addEventsOnNavBtns();
        _addEventsOnNavBtns();

        const personPhotoEls = starWarsEl.querySelectorAll('.card__photo');
        personPhotoEls.forEach((el, index) => {
          const url = urlPhoto + encodeURIComponent(data.persons[index].name);
          setTimeout(() => {
            AJAX.get(url, (d) => {
              data.persons[index].photo = d.value[0].contentUrl;
              el.src = data.persons[index].photo;
              _updateLocalStorage();
            }, { 'Ocp-Apim-Subscription-Key': '9da532b59d8d44e0be2464786a100133' })

          }, 600 * (index + 1))
        });        
      });
    }
  }

  function _parseData(d) {
    data.prevPage = d.previous;
    data.nextPage = d.next;
    data.persons = d.results.map((el) => {
      return {
        name: el.name,
        photo: 'https://placehold.it/250x350',
        gender: el.gender,
        height: el.height,
        birthYear: el.birth_year
      }
    });
  }

  function _renderNavBnts() {
    const navEl = document.createElement('div');
    navEl.classList.add('starWars__nav');
    navEl.innerHTML =
      `<button disabled class="starWars__nav-prev">previous</button>` +
      `<button class="starWars__nav-next">next</button>`;
    starWarsEl.appendChild(navEl);

    prevBtnEl = navEl.querySelector('.starWars__nav-prev');
    nextBtnEl = navEl.querySelector('.starWars__nav-next');
  }

  function _addEventsOnNavBtns() {
    prevBtnEl.addEventListener('click', _prevPageHandler);
    nextBtnEl.addEventListener('click', _nextPageHandler);
  }

  function _removeEventsOnNavBtns() {
    prevBtnEl.removeEventListener('click', _prevPageHandler);
    nextBtnEl.removeEventListener('click', _nextPageHandler);
  }

  function _renderCardsList() {
    const listEl = document.createElement('ul');
    listEl.classList.add('starWars__cardsList');
    starWarsEl.appendChild(listEl);
  }

  function _renderCards() {

    const listEl = starWarsEl.querySelector('.starWars__cardsList');
    listEl.innerHTML = '';

    data.persons.forEach((hero) => {
      const cardElement = document.createElement('li');
      cardElement.classList.add('card');
      cardElement.innerHTML =
        `<div class="card__header">` +
        `<img src="${hero.photo}" alt="avatar" class="card__photo">` +
        `</div>` +
        `<div class="card__footer">` +
        `<p class="card__name">${hero.name}</p>` +
        `<p class="card__gender">gender: ${hero.gender}</p>` +
        `<p class="card__birth-year"> birth year: ${hero.birthYear}</p>` +
        `<p class="card__height"> height: ${hero.height}</p>` +
        `</div>`;
      listEl.appendChild(cardElement);
    })
  }

  function _prevPageHandler() {
    _removeEventsOnNavBtns()
    urlSWAPI = data.prevPage;
    initStarWars();
  }

  function _nextPageHandler() {
    _removeEventsOnNavBtns()
    urlSWAPI = data.nextPage;
    initStarWars();
  }

  function _updateBtns() {
    data.nextPage ? 
      nextBtnEl.removeAttribute('disabled') :
      nextBtnEl.setAttribute('disabled', 'disabled');

    data.prevPage ? 
      prevBtnEl.removeAttribute('disabled') :
      prevBtnEl.setAttribute('disabled', 'disabled')   ;
  }

  function _updateLocalStorage() {
    localStorage.setItem(urlSWAPI, JSON.stringify(data));
  }

  return {
    init: initStarWars
  }

})();