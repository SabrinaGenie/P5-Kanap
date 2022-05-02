let productInLocalStorage = JSON.parse(localStorage.getItem('produits'));
let article = document.getElementById('cart__items');
let priceProduct = [];
let data;
let quantitéCanapé=null 

//Récupération de l'id et du prix du produit de l'API
const url = 'http://localhost:3000/api/products';
async function retrievePrice() {
  const requete = await fetch(url, {
    method: 'GET'
  });
  if (!requete.ok) {
    alert('Un problème est survenu.');
  } else {
    data = await requete.json();
  }
}
//Si le local storage est vide :
if (productInLocalStorage === null || productInLocalStorage.length === 0) {
  const titre = document.querySelector('.cartAndFormContainer');
  const title = titre.childNodes;
  title[1].textContent = `Votre panier est vide`;
}
//Affichage des produits du local storage dans le panier
async function displayPrice() {
  await retrievePrice();
  if (productInLocalStorage !== null) {
    data.forEach((element) => {
      for (i = 0; i < productInLocalStorage.length; i++) {
        if (productInLocalStorage[i].id === element._id) {
          const price = {
            price: element.price,
            image: element.imageUrl,
            name: element.name
          };
          let priceCartProduct =
            element.price * productInLocalStorage[i].quantity;
            quantitéCanapé = productInLocalStorage[i].quantity
            priceProduct.push(priceCartProduct);
          let e = document.createElement('article');
          e.innerHTML = `<article class="cart__item" data-id="${productInLocalStorage[i].id}" data-color="${productInLocalStorage[i].color}">
    <div class="cart__item__img">
      <img src=${price.image} alt="Photographie du canapé ${price.name}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${price.name}</h2>
        <p>${productInLocalStorage[i].color}</p>
        <p id="price">${price.price}</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : ${productInLocalStorage[i].quantity}</p>
          <input type="number" id="itemQuantity" name="itemQuantity" min="1" max="100" value=${productInLocalStorage[i].quantity}>
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`;
          article.appendChild(e);
        }
      }
    });
    deleteProductInCart();
    changeQuantityCart();
  }
}

//Suppression des articles depuis la page panier
function deleteProductInCart() {
  const btnDelete = document.querySelectorAll('.deleteItem');

  btnDelete.forEach((btn) => {
    btn.addEventListener('click', () => {
      const article = btn.closest('article');
      const articleID = article.dataset.id;
      const articleColor = article.dataset.color;
      for (let i = 0; i < productInLocalStorage.length; i++) {
        if (
          articleID === productInLocalStorage[i].id &&
          articleColor === productInLocalStorage[i].color
        ) {
          productInLocalStorage.splice(i, 1);
          localStorage.setItem(
            'produits',
            JSON.stringify(productInLocalStorage)
          );
          article.remove();
          totalPriceCart();
          quantityInLocalStorage();
        }
      }
    });
  });
}
displayPrice();

//Calcul de la quantité totale des articles
const sum = (accumulator, currentValue) => accumulator + currentValue;
let totalQuantityCalculation = [];
function calculateQuantity() {
  {    for (let m = 0; m < productInLocalStorage.length; m++) {
      let quantiteProduitPanier = productInLocalStorage[m].quantity;

//Quantités mises dans le tableau
      totalQuantityCalculation.push(quantiteProduitPanier);
    }
  }
}
calculateQuantity();
const quantityTotal = totalQuantityCalculation.reduce(sum, 0);
document.getElementById('totalQuantity').textContent = quantityTotal;

//Calcul de la somme totale des produits
let sumTotalCalcul = [];
let sumTotalQuantity;
function calculateSum() {
  priceProduct.forEach((e) => {
    sumTotalCalcul.push(e);
  });

  sumTotalQuantity = sumTotalCalcul.reduce(sum, 0);
  document.getElementById('totalPrice').textContent = sumTotalQuantity;
}

//Changer la quantité d'un produit depuis la page panier avec l'input
function changeQuantityCart( ) {
console.log(quantitéCanapé)
calculateSum()
}
inputQuantity.forEach((e) => {
    e.addEventListener('change', () => {
      const valueInput = Number(e.value);
      const article = e.closest('article');
      const articleID = article.dataset.id;
      const articleColor = article.dataset.color;
      const quantityFinal =
        article.lastElementChild.lastElementChild.firstElementChild.firstChild
          .nextElementSibling;
      quantityFinal.innerHTML = `Qté : ${valueInput}`;
      for (let i = 0; i < productInLocalStorage.length; i++) {
        if (
          articleID === productInLocalStorage[i].id &&
          articleColor === productInLocalStorage[i].color
        ) {
          productInLocalStorage[i].quantity = valueInput;
          localStorage.setItem(
            'produits',
            JSON.stringify(productInLocalStorage)
          );
          if (
            productInLocalStorage[i].quantity === 0 ||
            productInLocalStorage[i].quantity < 0
          ) {
            productInLocalStorage.splice(i, 1);
            localStorage.setItem(
              'produits',
              JSON.stringify(productInLocalStorage)
            );
            article.remove();
          }
        }
      }
      quantityInLocalStorage();
      totalPriceCart();
    });
  });
}

//Afficher le prix total de façon dynamique


//Changement de la quantité finale dynamiquement


//Formulaire


//Recuperer les data client et les data de la commande