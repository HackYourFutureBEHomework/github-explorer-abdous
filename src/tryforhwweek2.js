'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status < 400) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach((key) => {
      const value = options[key];
      if (key === 'html') {
        elem.innerHTML = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function main(url) {
    //new line added
    return new Promise((resolve, reject) => {
      //new line added
      fetchJSON(url, (error, data) => {
        const root = document.getElementById('root');
        //new line added
        root.open('Get', url, (error, data));
        root.onload = () => {
          //new line added
          if (err) {
            //new line added
            reject(createAndAppend('div', root, { html: error.message, class: 'alert-error' }));
            //new line added
          } else {

            let header = document.createElement('header');
            header.setAttribute("class", "header");
            root.appendChild(header);
            let p = document.createElement('p');
            let text = document.createTextNode("HYF Repositories");
            p.appendChild(text);
            header.appendChild(p);
            let select = document.createElement('select');
            select.setAttribute('class', "repo-selector");
            header.appendChild(select);

            data.forEach(repo => {
              //new line added
              resolve(createAndAppend('option', select, { html: repo.name }));
              //new line added
            });
            let container = document.createElement('div');
            container.setAttribute('id', 'container');
            root.appendChild(container);
            let left = document.createElement('div');
            left.setAttribute('class', 'left-div');
            container.appendChild(left);
            let right = document.createElement('div');
            right.setAttribute('class', 'right-div');
            container.appendChild(right);

            select.addEventListener('change', (event) => {
              let repo = data.find(r => r.name === select.value);
              left.innerHTML = '';
              right.innerHTML = '';
              Repo(left, repo);
              Contributors(right, repo);
            });

            let repo = data[0];
            Repo(left, repo);
            Contributors(right, repo);


          }
        }

      });
    }

  function Repo(parent, repo) {
        let labels = ['name', 'description', 'forks', 'url'];
        labels.forEach(label => {
          let p = createAndAppend('p', parent);
          createAndAppend('label', p, { html: label });
          createAndAppend('span', p, { html: repo[label] });
        });
      }

  function Contributors(parent, repo) {
        let url = repo.contributors_url;
        fetchJSON(url, (err, contributors) => {
          if (err) {
            createAndAppend('div', parent, { html: err.message, class: 'alert-error' });
          } else {

            contributors.forEach(contributor => {

              let contributorDiv = createAndAppend('div', parent);
              createAndAppend('img', contributorDiv, { src: contributor.avatar_url })
            });

          }
        });



      }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

    window.onload = () => main(HYF_REPOS_URL);


  }