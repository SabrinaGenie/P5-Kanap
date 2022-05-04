const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const productId = urlParams.get("id")
let cardproduct = []
//console.log(urlParams.get("id"))

fetch(`http://localhost:3000/api/products/${productId}`)
    .then(response => response.json())
    .then(data =>{
        //console.log(data.colors)
        document.querySelector(".item__img").innerHTML=`<img src="${data.imageUrl}" alt="${data.altTxt}">`   
        document.querySelector("#title").innerHTML=data.name
        document.querySelector("#price").innerHTML=data.price
        document.querySelector("#description").innerHTML=data.description
        data.colors.forEach(element => {
            document.querySelector("#colors").innerHTML+=`<option value='${element}'>${element}</option>` 
        });
        
        //On écoute les changements des nombres de canapés
                document.querySelector("#quantity").addEventListener("change",function(){
                    addItems(data)
                })

        addEventListener('DOMcontentLoaded', function(){
            document.querySelector('select[name="color-select"]').onchange=changeEventHandler;}, false);

            function changeEventHandler(event) {
                if(!event.target.value) alert('--SVP, choisissez une couleur --');
                else alert('Vous avez choisi un canapé' + event.target.value)
            }
        }
        )

        //écouter les clics sur le bouton "ajouter au panier"
document.querySelector('#addToCart').addEventListener("click",function(){
        console.log("panier")
        location="./cart.html"
        })

        //Fonction d'ajout au panier/localStorage
const addToCart = document.getElementById('addToCart');

addToCart.addEventListener('click', () => {
  const color = document.getElementById('colors').value;
  const quantity = document.getElementById('quantity').value;

  const optionCart = {
    id: productId,
    color: color,
    quantity: Number(quantity)
  };
  let productInLocalStorage = JSON.parse(localStorage.getItem('produits'));
  if (color === '' || quantity === '0' || quantity < 0) {
    alert('Veuillez remplir les champs');
  } else if (productInLocalStorage === null) {
    productInLocalStorage = [];
    productInLocalStorage.push(optionCart);
    localStorage.setItem('produits', JSON.stringify(productInLocalStorage));
    let message = ""
      quantity === '1'
        ? quantity + ' produit a été ajouté dans votre panier.'
        : quantity + ' produits ont été ajoutés dans votre panier';
    alert(message);
  } else if (productInLocalStorage !== null) {
    let add = true;
    for (let i of productInLocalStorage) {
      if (optionCart.id === i.id && optionCart.color === i.color) {
        add = false;
        i.quantity = i.quantity += optionCart.quantity;
        alert('Votre panier a été mis à jour.');
        localStorage.setItem('produits', JSON.stringify(productInLocalStorage));
      }
    }

    if (add) {
      const message =
        quantity === '1'
          ? quantity + ' produit a été ajouté dans votre panier.'
          : quantity + ' produits ont été ajoutés dans votre panier';
      alert(message);
      productInLocalStorage.push(optionCart);
      localStorage.setItem('produits', JSON.stringify(productInLocalStorage));
    }
  }
});

//Création d'un objet avec l'Id, la quantité et la couleur des produits ajoutés au
function addItems(data) {
    let canapéId = data._id
    let quantitéCanapé = document.getElementById("quantity").value
    let couleurCanapé = document.getElementById("colors").value
    let selectionCanapé = {
        quantitéCanapé,
        couleurCanapé,
        canapéId
    }
        console.log(selectionCanapé)
}
