//GLOBAL VARIABLES
const url = "http://localhost:3000/api/products"
let jsonData = null
let productInLocalStorage = JSON.parse(localStorage.getItem("produits"))
let arrayCapanes = []
let pricesArray = []

lancerPanier()

document.getElementById("order").addEventListener("click", () => {
	validateForm()
})

document
	.querySelector(".cart__order__form")
	.addEventListener("submit", (eventForm) => {
		eventForm.preventDefault()
		if (validateForm()) {
			formatDataToSend()
		}
	})

// FUNCTIONS
// make jsonData var GLOBAL
async function lancerPanier() {
	jsonData = await retrievePrice()
	// check if cart is empty
	verifyLocalStorage()
}

//Récupération de tout le canapées dans l'API
async function retrievePrice() {
	const requete = await fetch(url)
	if (!requete.ok) {
		alert("Un problème est survenu avec la base de données")
	} else {
		data = await requete.json()
		return data
	}
}

//checks localStorage for data. If empty, it shows "empty cart" message and stops the app
function verifyLocalStorage() {
	if (productInLocalStorage === null || productInLocalStorage.length === 0) {
		document.querySelector(
			"#cartAndFormContainer"
		).innerHTML = `<h1 class="text-center">Votre panier est vide</h1>`
	} else {
		populateHTML()
	}
}

// populate HTLM with data
function populateHTML() {
	jsonData.forEach((canape) => {
		productInLocalStorage.forEach((canapeInLocal, i) => {
			if (canapeInLocal.id === canape._id) {
				// creates a new element for element found
				let newEl = document.createElement("article")
				newEl.innerHTML = `<article class="cart__item" data-id="${canape._id}" data-color="${canapeInLocal.color}">
							<div class="cart__item__img">
								<img src=${canape.imageUrl} alt="Photographie du canapé ${canape.name}">
							</div>
							<div class="cart__item__content">
								<div class="cart__item__content__description">
								<h2></h2>
								<p>${canapeInLocal.color}</p>
								<p id="price">${canape.price} €</p>
								</div>
								<div class="cart__item__content__settings">
								<div class="cart__item__content__settings__quantity">
									<p>Qté: </p>
									<input type="number" data-index="${i}" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${canapeInLocal.quantity}>
								</div>
								<div class="cart__item__content__settings__delete">
									<p class="deleteItem">Supprimer</p>
								</div>
								</div>
							</div>
							</article>`
				//appends it to the HTML
				document.getElementById("cart__items").appendChild(newEl)
				// adds the canape quantity to the array
				arrayCapanes.push(canapeInLocal.quantity)
				// add prices to prices array
				pricesArray.push({
					id: canape._id,
					quantity: canapeInLocal.quantity,
					price: canape.price * canapeInLocal.quantity,
				})
				// calculates number of canapes and populates HTML
				calulateNoDeCanapes()

				calulateTotalPrice()
			}
		})
	})

	// EVENT LISTENERS -> waits until HTML IS DONE PRINTING
	//list of items with this class .itemQuantity
	document.querySelectorAll(".itemQuantity").forEach((btn) => {
		btn.addEventListener("change", (elem) => {
			changeNoDeCapanes(elem)
		})
	})
	//list of items with this class .deleteItem
	// runs deleteCanap when clicked
	deleteProductInCart()
}

// calculates the number of canapes and puts it in the HTML
function calulateNoDeCanapes() {
	if (arrayCapanes.length === 1) {
		document.querySelector("#totalQuantity").innerHTML = arrayCapanes[0]
	} else {
		arrayCapanes.reduce((start, no) => {
			document.querySelector("#totalQuantity").innerHTML = start + no
		})
	}
}

// calculates total price and puts it in the HTML
function calulateTotalPrice() {
	if (pricesArray.length === 1) {
		document.querySelector("#totalPrice").innerText = pricesArray[0].price
	} else {
		pricesArray.reduce((price, priceNo) => {
			document.querySelector("#totalPrice").innerText =
				price.price + priceNo.price
		})
	}
}

// changes number of canapes stored in var and localstorage
function changeNoDeCapanes(elem) {
	let elemIndx = Number(elem.target.getAttribute("data-index"))
	let elemValue = Number(elem.target.value)
	productInLocalStorage[elemIndx].quantity = elemValue
	// save in localStorage
	localStorage.setItem("produits", JSON.stringify(productInLocalStorage))
	// change prices Array
	pricesArray.forEach((sofaObj) => {
		productInLocalStorage.forEach((localSofa) => {
			if (sofaObj.id === localSofa.id) {
				let initialPrice = sofaObj.price / sofaObj.quantity
				sofaObj.quantity = localSofa.quantity
				sofaObj.price = localSofa.quantity * initialPrice
			}
		})
	})
	calulateTotalPrice()
	//change number of canapes
	arrayCapanes = []
	pricesArray.forEach((priceCanap) => {
		arrayCapanes.push(priceCanap.quantity)
	})
	calulateNoDeCanapes()
}

// deletes one sofa from the list
//Suppression des articles depuis la page panier
function deleteProductInCart() {
	const btnDelete = document.querySelectorAll(".deleteItem")

	btnDelete.forEach((btn) => {
		btn.addEventListener("click", () => {
			const article = btn.closest("article")
			const articleID = article.dataset.id
			const articleColor = article.dataset.color
			// removes article from localStorage
			for (let i = 0; i < productInLocalStorage.length; i++) {
				if (
					articleID === productInLocalStorage[i].id &&
					articleColor === productInLocalStorage[i].color
				) {
					productInLocalStorage.splice(i, 1)
					localStorage.setItem(
						"produits",
						JSON.stringify(productInLocalStorage)
					)
					article.remove()
				}
			}
			// reecalculate stuff ( reloads the page )
			location.reload()
		})
	})
}

// form validation
function validateForm() {
	let error = false
	// FIRST NAME empty
	if (document.getElementById("firstName").value === "") {
		document.getElementById("firstNameErrorMsg").innerText =
			"Nous avons besoin de votre prénom"
		document.getElementById("firstName").focus()
		error = true
		// no numbers
	} else if (/[^A-Za-z ]+/.test(document.getElementById("firstName").value)) {
		document.getElementById("firstNameErrorMsg").innerText =
			"Aucun numéro autorisé"
		document.getElementById("firstName").focus()
		error = true
	} else {
		error = false
		document.getElementById("firstNameErrorMsg").innerText = ""
	}
	// LAST NAME empty
	if (document.getElementById("lastName").value === "") {
		document.getElementById("lastNameErrorMsg").innerText =
			"Nous avons besoin de votre prénom"
		document.getElementById("lastName").focus()
		error = true
		// no numbers
	} else if (/[^A-Za-z ]+/.test(document.getElementById("lastName").value)) {
		document.getElementById("lastNameErrorMsg").innerText =
			"Aucun numéro autorisé"
		document.getElementById("lastName").focus()
		error = true
	} else {
		error = false
		document.getElementById("lastNameErrorMsg").innerText = ""
	}
	// ADDRESS empty
	if (document.getElementById("address").value === "") {
		document.getElementById("addressErrorMsg").innerText =
			"Nous avons besoin d'une adresse"
		document.getElementById("address").focus()
		error = true
	} else {
		error = false
		document.getElementById("addressErrorMsg").innerText = ""
	}
	// VILLAGE empty
	if (document.getElementById("city").value === "") {
		document.getElementById("cityErrorMsg").innerText =
			"C'est quoi votre village ?"
		document.getElementById("address").focus()
		error = true
	} else {
		error = false
		document.getElementById("cityErrorMsg").innerText = ""
	}
	// EMAIL empty
	if (document.getElementById("email").value === "") {
		document.getElementById("emailErrorMsg").innerText =
			"nous avons besoin d'une adresse e-mail valide"
		document.getElementById("address").focus()
		error = true
	} else {
		error = false
		document.getElementById("emailErrorMsg").innerText = ""
		return true
	}
}

/*
Pour les routes POST, l’objet contact envoyé au serveur doit contenir les champs firstName,
lastName, address, city et email. Le tableau des produits envoyé au back-end doit être un
array de strings product-ID. Les types de ces champs et leur présence doivent être validés
avant l’envoi des données au serveur.
*/
// gather data
function formatDataToSend() {
	const contact = {
		firstName: document.getElementById("firstName").value,
		lastName: document.getElementById("lastName").value,
		address: document.getElementById("address").value,
		city: document.getElementById("city").value,
		email: document.getElementById("email").value,
	}

	let products = []
	for (let i = 0; i < productInLocalStorage.length; i++) {
		products.push(productInLocalStorage[i].id)
	}
	console.log(products)

	const InfoDonnée = {
		contact,
		products,
	}
	// retourner les données de variable Formulaire et d"InfoDonnée

	const FormDonnée = {
		method: "POST",
		body: JSON.stringify(InfoDonnée),
		headers: {
			"Content-type": "application/json",
		},
	}
	fetch("http://localhost:3000/api/products/order", FormDonnée)
		.then((response) => response.json())
		.then((data) => {
			// localStorage.setItem("orderId", data.orderId)
			document.location.href = "confirmation.html?id=" + data.orderId
		})
}
