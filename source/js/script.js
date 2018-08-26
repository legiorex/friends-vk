function isMatching(full, chunk) {
    return full.toUpperCase().indexOf(chunk.toUpperCase()) > -1;
}
function getCookies() {
    return document.cookie.split('; ').reduce((prev, current) => {
        const [name, value] = current.split('=');
        prev[name] = value;
        return prev;
    }, {});
}
const rightList = document.querySelector('.friends__list');
let r = '';
console.log(r);

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

    const filterVk = document.querySelector('.left-search__vk');

    const template = document.querySelector('#user-template').textContent;

    const render = Handlebars.compile(template);
    const result = document.querySelector('.friends__vk');

    // Функция записи списка друзей на страницу
    function buldList(list){
        const html = render(list);
        result.innerHTML = html;
        addButton(result);
    }

    buldList(friends); // Певоначальный вывод списка на страницу

    filterVk.addEventListener('keyup', function(){
        console.log(friends.items);

        result.innerHTML = null;

        const newVk = {}; // Создаю новый объект для шаблона

        // Фильтрую старый объект в новый
        newVk.items = friends.items.filter(function(value) {
            value = value.first_name + value.last_name;

                if(value && (!filterVk.value)
                    || isMatching(value, filterVk.value)) {
                    return true
                }
        });
    buldList(newVk);
    })

});

const filterAdd = document.querySelector('.right-search__my');

filterAdd.addEventListener('keyup', function(e){
    // let listFriendRight = rightList;
    const cookies = getCookies();
    for (let key in cookies) {
        if (cookies.hasOwnProperty(key) && (!filterAdd.value)
            || isMatching(key, filterAdd.value)
            || isMatching(cookies[key], filterAdd.value))) {



            let trCookie = document.createElement('tr'); // создаем строку для кук

            trCookie.innerHTML = `<td>${key}</td><td>${cookies[key]}</td><td><button>Удалить</button></td>`;
            listTable.appendChild(trCookie); // добаляем новую строку в таблицу

            // Кнопка удалить
            trCookie.querySelector('button').addEventListener('click', () => { // навешиваю обработчик событий на click

                trCookie.remove(); // удаляю записанные куки из таблицы

                document.cookie = `${key} = ${cookies[key]} =; expires=Thu, 01 Jan 1970 00:00:01 GMT`;


            });
        }
    }
});

     // Создаю кнопки добавить и удалить
function addButton(result) {
    for (let item of result.children) {
        const addButton = item.querySelector('.add-button');
        const closeButton = item.querySelector('.close-button');
        // Кнопка добавить
        addButton.addEventListener('click', (e) => {
            rightList.appendChild(item);
            item.querySelector('.add-button').classList.add('hiden-button');
            item.querySelector('.close-button').classList.remove('hiden-button');

            // Запись в куки
            let findText = e.target.parentNode.querySelector('.friend__name').innerText.trim();
            let [first_name, last_name] = findText.split(' ');
            document.cookie = `${first_name} = ${last_name}`;

            // Удаляю друзей из json
            let result = [];
            // let findText = e.target.parentNode.querySelector('.friend__name').innerText.trim();
            console.log(findText);
            for (friend of friends.items){
                if (`${friend.first_name} ${friend.last_name}` !== findText){
                    result.push(friend);
                }
            }
            friends.items = result;
        });
        // Кнопка удалить
        closeButton.addEventListener('click', (e) => {
            result.appendChild(item);
            item.querySelector('.add-button').classList.remove('hiden-button');
            item.querySelector('.close-button').classList.add('hiden-button');

            // добавляю друзей в json

            let [first_name, last_name] = findText.split(' ');
            let findPhoto = e.target.parentNode.querySelector('.friend__photo').getAttribute('src');
            let items = {};
            items.first_name = first_name;
            items.last_name = last_name;
            items.photo = findPhoto;
            friends.items.push(items);

            console.log(items);


        });
    }
}

