var input = document.getElementById('fileImage')
var imageElement = document.getElementById('image')
var button = document.getElementById('button')

input.addEventListener('input', () => {
    var file = input.files[0]
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function (event) {
        caches.open('v1').then(function(cache) {
            cache.put('image.txt', new Response(event.target.result));
            console.log('Image loaded');
        });
    }
})

button.addEventListener('click', () => {
    return caches.open('v1').then((cache) => {
        return cache.match('image.txt').then((response) => {
            if(!response) return alert('No image in localStorage')
            response.text().then((image) => {
                var imageUrl = URL.createObjectURL(dataURItoBlob(image))
                imageElement.src = imageUrl
            })
        })
    })
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