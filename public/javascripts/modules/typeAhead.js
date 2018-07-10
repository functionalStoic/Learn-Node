import axios from 'axios';
import { sanitize } from 'dompurify';

const createSearchResult = ({ slug, name, description }) =>
  `
  <a href="/stores/${slug}" class="search__result">
    <strong>${name}</strong><br />
    <div>${description}</div>
  </a>
`;

const searchResultsHTML = stores => stores.map(createSearchResult).join('');

function typeAhead(search) {
  if (!search) return;

  const searchInput = search.querySelector('input[name="search"]');
  const searchResults = search.querySelector('.search__results');

  searchInput.on('input', function() {
    // if there is no value, quit it!
    if (!this.value) return (searchResults.style.display = 'none');

    // show the search results
    searchResults.style.display = 'block';

    axios
      .get(`/api/search?q=${this.value}`)
      .then(
        res =>
          res.data.length
            ? (searchResults.innerHTML = sanitize(searchResultsHTML(res.data)))
            : (searchResults.innerHTML = sanitize(`
                <div className="search__result">
                  No Results for ${this.value} were found!
                </div>
              `))
      )
      // eslint-disable-next-line
      .catch(err => console.error(err));
  });

  searchInput.on('keyup', ({ keyCode }) => {
    // if they aren't pressing up, down or enter
    if (![38, 40, 13].includes(keyCode)) return;

    const activeClass = 'search__result--active';
    const current = search.querySelector(`.${activeClass}`);
    const items = search.querySelectorAll('.search__result');
    let next;
    if (keyCode === 40 && current) {
      next = current.nextElementSibling || items[0];
    } else if (keyCode === 40) {
      next = items[0];
    } else if (keyCode === 38 && current) {
      next = current.previousElementSibling || items[items.length - 1];
    } else if (keyCode === 38) {
      next = items[items.length - 1];
    } else if (keyCode === 13 && current.href) {
      return (window.location = current.href);
    }

    if (current) current.classList.remove(activeClass);

    next.classList.add(activeClass);
  });
}

export default typeAhead;
