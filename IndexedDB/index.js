var input = document.getElementById('fileImage')
var imageElement = document.getElementById('image')
var button = document.getElementById('button')

input.addEventListener('input', () => {
    var file = input.files[0]
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function (event) {
        addImageToDB(event.target.result)
    }
})

button.addEventListener('click', () => {
    getFromDB()
})

function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var arrayBuffer = new ArrayBuffer(byteString.length);
    var _ia = new Uint8Array(arrayBuffer);
    for (var i = 0; i < byteString.length; i++) _ia[i] = byteString.charCodeAt(i);
    var dataView = new DataView(arrayBuffer);
    var blob = new Blob([dataView], { type: mimeString });
    return blob;
}

function addImageToDB(imageURI) {
    let openRequest = indexedDB.open("images", 2);

    openRequest.onupgradeneeded = function() {
        console.log("Инициация images storage");
        // срабатывает, если на клиенте нет базы данных
        // только в первый раз после indexedDB.open с уникальным именем object store
        // и при обновлении версии базы данных
        // ...выполнить инициализацию...

        let db = openRequest.result;
        if (!db.objectStoreNames.contains('images')) {
            db.createObjectStore('images', {keyPath: 'id'});
            // createObjectStore можно вызывать только тут, в onupgradeneeded
        }
    };

    openRequest.onsuccess = function() {
        // продолжить работу с базой данных, используя объект db
        let db = openRequest.result;

        let transaction = db.transaction("images", "readwrite");

        // получить хранилище объектов для работы с ним
        let images = transaction.objectStore("images");

        const imageURIObj = {
            id: 'Image',
            image: imageURI
        }
        let request = images.put(imageURIObj);

        request.onsuccess = function() {
            console.log("Фотография добавлена в хранилище");
        };

        request.onerror = function() {
            console.log("Ошибка", request.error);
            alert(request.error)
        };

        db.onversionchange = function() {
            // перехват ошибки при изменении версии базы данных и нескольких открытых вкладках
            db.close();
            alert("База данных устарела, пожалуйста, перезагрузите страницу.")
        };
    };

    openRequest.onerror = function() {
        // произошла ошибка
        console.error("Error", openRequest.error);
        alert(openRequest.error)
    };
}

function getFromDB(){
    let openRequest = indexedDB.open("images", 2);

    openRequest.onupgradeneeded = function() {
        console.log("Инициация images storage");
        // срабатывает, если на клиенте нет базы данных
        // только в первый раз после indexedDB.open с уникальным именем object store
        // и при обновлении версии базы данных
        // ...выполнить инициализацию...

        let db = openRequest.result;
        if (!db.objectStoreNames.contains('images')) {
            db.createObjectStore('images', {keyPath: 'id'});
            // createObjectStore можно вызывать только тут, в onupgradeneeded
        }
    };

    openRequest.onsuccess = function() {
        // продолжить работу с базой данных, используя объект db
        let db = openRequest.result;

        db.onversionchange = function() {
            // перехват ошибки при изменении версии базы данных и нескольких открытых вкладках
            db.close();
            alert("База данных устарела, пожалуйста, перезагрузите страницу.")
        };

        let transaction = db.transaction("images", "readonly");

        // получить хранилище объектов для работы с ним

        let images = transaction.objectStore("images");

        let request = images.get('Image')

        request.onsuccess = function(res) {
            var imageObj = res.target.result
            if(!imageObj) return alert('Фотография не найдена')
            var imageUrl = URL.createObjectURL(dataURItoBlob(imageObj.image))
            imageElement.src = imageUrl
        };

        request.onerror = function() {
            console.log("Ошибка", request.error);
            alert(request.error)
        };
        
    };

    openRequest.onerror = function() {
        // произошла ошибка
        console.error("Error", openRequest.error);
        alert(openRequest.error)
    };
}