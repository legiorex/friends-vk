function isMatching(full, chunk) {
    return full.toUpperCase().indexOf(chunk.toUpperCase()) > -1;
}

let storage = localStorage;
let saveFriends = {};
saveFriends.items = [];
function newObj(e) {
    let user = e.target.parentNode.querySelector('.friend__name');
    let userValue = user.textContent;
    let userId = user.dataset.userId;
    let [first_name, last_name] = userValue.split(' ');
    let findPhoto = e.target.parentNode.querySelector('.friend__photo').getAttribute('src');

    let items = {};
    items.first_name = first_name;
    items.last_name = last_name;
    items.photo_100 = findPhoto;
    items.id = userId;
    saveFriends.items.push(items);
    return saveFriends;
}

const filterVk = document.querySelector('.left-search__vk');
const filterAdd = document.querySelector('.right-search__my');

const template = document.querySelector('#user-template').textContent;
const render = Handlebars.compile(template);
const result = document.querySelector('.friends__vk');
const rightList = document.querySelector('.friends__list');
VK.init({
    apiId: 6673843
});
function auth() {
    return new Promise((resolve, reject) => {
        VK.Auth.login(data =>{
            if(data.session) {
                resolve();
            }else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 2)
    });
}
function callAPI(method, params){
    params.v = '5.76'
    return new Promise((resolve, reject) => {
        VK.api(method, params, (data) =>{
            if(data.error) {
                reject(data.error);
            }else {
                resolve(data.response);
            }
        });
    })
}

auth()
    .then(() => {
        return callAPI('friends.get', {count: 20, fields: 'photo_100'});
    })
    .then(friends =>{

        // Функция записи списка друзей на страницу
        function buldList(list){
            const html = render(list);
            result.innerHTML = html;
            buttons(result, friends);
        }

        filterVk.addEventListener('keyup', function(){
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
        });

        filterAdd.addEventListener('keyup', function(){

            rightList.innerHTML = null;

            const friendsLocal = JSON.parse(storage.data || {});

            const friensRight = {};
            friensRight.items = friendsLocal.items.filter(function (value) {
                value = value.first_name + value.last_name;

                if(value && (!filterAdd.value)
                    || isMatching(value, filterAdd.value)) {
                    return true
                }
            });


            const html = render(friensRight);
            rightList.innerHTML = html;
        });


        if(storage.data === undefined){

            buldList(friends); // Певоначальный вывод списка на страницу
        } else {

            let delStorage = JSON.parse(storage.data || {});
            friends.items = friends.items.filter(item => {
                for (let key of delStorage.items){
                    console.log(key.id);
                    if (item.id == key.id){
                        return false;
                    }

                }
                return true;
            });
            buldList(friends);
            console.log(friends);
        }

    });
     // Создаю кнопки добавить и удалить
function buttons(result, friends) {
    for (let item of result.children) {
        const addButton = item.querySelector('.add-button');
        const closeButton = item.querySelector('.close-button');

        addButton.addEventListener('click', (e) => {
            rightList.appendChild(item);
            item.querySelector('.add-button').classList.add('hiden-button');
            item.querySelector('.close-button').classList.remove('hiden-button');

            // Запись в локал сторадж
            storage.data = JSON.stringify(newObj(e));

            // Удаляю друзей из json
            let user = e.target.parentNode.querySelector('.friend__name');
            let userValue = user.textContent;
            let result = [];
            for (friend of friends.items){
                if (`${friend.first_name} ${friend.last_name}` !== userValue){
                    result.push(friend);
                }
            }
            friends.items = result;
        });

        // Кнопка удалить
        closeButton.addEventListener('click', (e) => {
            let user = e.target.parentNode.querySelector('.friend__name');
            result.appendChild(item);
            item.querySelector('.add-button').classList.remove('hiden-button');
            item.querySelector('.close-button').classList.add('hiden-button');

            // Удаляю из стородж
            let delStorage = JSON.parse(storage.data || {});
            let temp = {};
            temp.items = [];
            for (let key of delStorage.items){
                if(key.id !== user.dataset.userId){
                    temp.items.push(key);
                }
                storage.data = JSON.stringify(temp);
            }
            // добавляю друзей в json
            let userValue = user.textContent;
            let [first_name, last_name] = userValue.split(' ');
            let findPhoto = e.target.parentNode.querySelector('.friend__photo').getAttribute('src');
            let items = {};
            items.first_name = first_name;
            items.last_name = last_name;
            items.photo_100 = findPhoto;
            friends.items.push(items);
        });
    }
}

window.onload = function(friends) {
    console.log(storage.data);

    let html = render(JSON.parse(storage.data || {}));
    rightList.innerHTML = html;


    for (let item of rightList.children){
        item.querySelector('.add-button').classList.add('hiden-button');
        item.querySelector('.close-button').classList.remove('hiden-button');
        const closeButton = item.querySelector('.close-button');

        closeButton.addEventListener('click', (e) => {
            // console.log('test');
            //
            let user = e.target.parentNode.querySelector('.friend__name');
            // console.log(user);

            // Удаляю из стородж
                let delStorage = JSON.parse(storage.data || {});

                let temp = {};
                temp.items = [];
                for (let key of delStorage.items) {
                    if (key.id !== user.dataset.userId) {
                        temp.items.push(key);
                    }
                    storage.data = JSON.stringify(temp);
                }

            rightList.removeChild(e.target.parentNode);

            let userValue = user.textContent;
            let [first_name, last_name] = userValue.split(' ');
            let findPhoto = e.target.parentNode.querySelector('.friend__photo').getAttribute('src');
            let items = {};
            items.first_name = first_name;
            items.last_name = last_name;
            items.photo_100 = findPhoto;
            friends.items.push(items);
    })
    }

};