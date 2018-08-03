'use strict';



  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      
      xhr.onload = () => {
        if ( xhr.status === 200) {
          resolve(xhr.responseText);
        } else
        
         {
          reject(xhr.responseText);
        }
      }
      xhr.onerror = () => reject('404 Network failed');
      xhr.send();
    });
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
    
      fetchJSON(url).then(JSON.parse).then(data => {
      
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
            
            createAndAppend('option', select, { html: repo.name });
  
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


        });
      
      }
       
      let  dictionary = {
          forks_count: 'Forks :',
          name:'Name :',
          description:'Description :',
          updated_at:'Update :',
          url: 'URL:'
         };

      function translate(labelName){
            let DictLabel = dictionary[labelName];
            return DictLabel;
                  }

    function Repo(parent, repo) {
      
      let labelNames = ['name'  ,'description'  ,'forks_count'  ,'updated_at'  ,'url'  ];
      labelNames.forEach(labelName => {
        let p = createAndAppend('p', parent);
        let trans= translate(labelName);
          

        createAndAppend('label', p, { html: trans, class: 'Translatedlabel'});
        createAndAppend('span', p, { html: repo[labelName] });
      });
    };
        
    function Contributors(parent, repo) {
      let url = repo.contributors_url;
        fetchJSON(url).then(JSON.parse).then(contributors=> {

           contributors.forEach(contributor => {

             let contributorDiv = createAndAppend('div', parent);
             createAndAppend('img', contributorDiv, { src: contributor.avatar_url })
           });

         
       }).catch(err => document.getElementById('root').innerHTML = err);
      


    }

    const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
    
    window.onload = () => main(HYF_REPOS_URL);
  