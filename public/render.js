let libros = []

//Render del Chat
function render(data){
    const html = data.map((elem, index) => {
        return(
            `<div>
                <strong style="color: blue"> ${elem.author}: </strong>
                <span style="color: brown"> [${elem.datetime}] </span>
                <em style="color: green"> ${elem.text} </em>
            </div>`
        )
        }).join(' ')
        document.getElementById('messages').innerHTML=html
}

//Render de list
//Me traigo los productos con fetch
function fetchProducts() {
    fetch('/api/productos')
    .then( response => response.json())
    .then(data => {
        libros=data
        renderList(libros)
    })
}

function renderList(data) {
    $("#list").html("")
    data.forEach(function(libro){
        $("#list").prepend(
            `
                <tr>
                    <td>${libro.title}</td>
                    <td>${libro.price}</td>
                    <td><img src="${libro.thumbnail}" class="img-thumbnail" width="100px" alt="No image"></td>
            `
        )
    })

}

fetchProducts()