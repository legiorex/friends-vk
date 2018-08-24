// const xhrURL = 'https://legiorex.github.io/friend.json';
const xhrURL = 'https://legiorex.github.io/friends.json';
const xhr = new XMLHttpRequest();

xhr.open('GET', xhrURL);
// xhr.responseType = 'json';
xhr.send();
// функция обратного вызова
// xhr.onload = function() {
//     friends = JSON.parse(xhr.responseText);
//     console.log(friends);
//     main(friends);
// };
//

 // Через промис
     new Promise((resolve) => {
        xhr.onload = function() {
            friends = JSON.parse(xhr.responseText);
        };
        xhr.addEventListener('load', function () {
            resolve(friends);
        });
    })

    .then(friends => {
         // console.log(friends);
    const template = document.querySelector('#user-template').textContent;
    // console.log(template); работает

    const render = Handlebars.compile(template);
         console.log(render);

    const html = render(friends);

    console.log(html);
    const result = document.querySelector('.friends__vk');
    result.innerHTML = html;

     });

function main(friends) {
    const template = document.querySelector('#user-template').textContent;

    const render = Handlebars.compile(template);

    const html = render(friends.items);
    console.log(friends.items);
    console.log(html);
    const result = document.querySelector('.friends__vk');
    result.innerHTML = html;

}



