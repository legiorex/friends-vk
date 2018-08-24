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
         // console.log(friends.items[0]);
    const template = document.querySelector('#user-template').textContent;
    // console.log(template); работает

    const render = Handlebars.compile(template);
    const html = render(friends);
    const result = document.querySelector('.friends__vk');
    result.innerHTML = html;

     })
// function addFriend() {
//     console.log('test');
//     const addButton = document.querySelector('.add-button');
//     addButton.addEventListener('click', () => {
//         console.log('test');
//     });
// }
     .then(button => {
        const a = document.querySelector('.friends__vk');
         for (let item of a.children){
             console.log(item.className);

             // const addButton = getElementsByClassName(item.className).querySelector('.add-button');
             // addButton.addEventListener('click', () => {
             //     console.log('test');
             // })

         }
});



     // for (let item of friends.items){
     //
     //        console.log(item);
     //    }

    // });

// function test(where) {
//          const a = where;
//     for (let item of a.childNodes){
//         console.log(item);
//         const addButton = document.querySelector('.add-button');
//         addButton.addEventListener('click', () => {
//             console.log('test');
//         });
//
//     }
// }
//
// test(document.querySelector('.friends__vk'));
