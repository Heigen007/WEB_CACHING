var input = document.getElementById('fileImage')
var button = document.getElementById('button')
var imageElement = document.getElementById('image')

input.addEventListener('input', () => {
    var file = input.files[0]
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function (event) {
        localStorage.setItem('image', event.target.result)
        console.log('Image loaded');
    }
})

button.addEventListener('click', () => {
    var image = localStorage.getItem('image')
    if(!image) return alert('No image in localStorage')
    var imageUrl = URL.createObjectURL(dataURItoBlob(image))
    imageElement.src = imageUrl
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