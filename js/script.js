const sectionItems=document.getElementById("items")

fetch('http://localhost:3000/api/products')
    .then(response => response.json())
    .then(data =>{
        //console.table(data[0])
        

data.forEach(element => {
console.log(element)  
sectionItems.innerHTML+=`<a href="./product.html?id=${element._id}">
            <article>
            <img src="${element.imageUrl}" alt="${element.altTxt}">
            <h3 class="productName">${element.name}</h3>
            <p class="productDescription">${element.description}</p>
          </article>
        </a>`
});
} );