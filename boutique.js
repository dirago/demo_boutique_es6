'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function tag(type) {
    return document.createElement(type);
}

var Produit = function Produit(nom, prix) {
    _classCallCheck(this, Produit);

    this.nom = nom;
    this.prixHT = prix;
};

var Achat = function Achat(produit, quantite) {
    _classCallCheck(this, Achat);

    this.produit = produit;
    this.quantite = quantite;
};

var Boutique = function () {
    function Boutique(cheminCatalogue, elementHTMLRef) {
        _classCallCheck(this, Boutique);

        this._achats = [];

        elementHTMLRef.addEventListener('ajouteAchat', function (e) {
            // vérifie si le produit a déjà été selectionné et ajouté au panier
            if (this._achats.length > 0) {
                var match = this._achats.filter(function (el) {
                    return e.detail.produit.nom == el.produit.nom;
                });
                if (match.length > 0) {
                    match[0].quantite += e.detail.quantite;
                } else this._achats.push(e.detail);
            } else this._achats.push(e.detail);
            this.vuePanier.achats = this._achats;
            console.log("ajouteAchat", this._achats);
        }.bind(this));
        // écouteur d'évènement pour le panier => Augmente la quantité
        elementHTMLRef.addEventListener('augmenteQuantite', function (e) {
            if (this._achats.length > 0) {
                var match = this._achats.filter(function (el) {
                    return e.detail.produit.nom == el.produit.nom;
                });
                if (match.length > 0) {
                    match[0].quantite += e.detail.quantite;
                } else this._achats.push(e.detail);
            } else this._achats.push(e.detail);
            this.vuePanier.achats = this._achats;
            console.log("augmenteQuantite", this._achats);
        }.bind(this));
        // écouteur d'évènement pour le panier => Baisse la quantité
        elementHTMLRef.addEventListener('baisseQuantite', function (e) {
            if (this._achats.length > 0) {
                var match = this._achats.filter(function (el) {
                    return e.detail.produit.nom == el.produit.nom;
                });
                if (match.length > 0) {
                    match[0].quantite += e.detail.quantite;
                } else this._achats.push(e.detail);
            } else this._achats.push(e.detail);
            this.vuePanier.achats = this._achats;
            console.log("baisseQuantite", this._achats);
        }.bind(this));

        this.container = elementHTMLRef;
        console.log('constructor', this);
        this.chargeur = new ChargeurDonnees();
        this.chargeur.charge(cheminCatalogue, this.onCatalogueReady.bind(this));
    }

    _createClass(Boutique, [{
        key: 'onCatalogueReady',
        value: function onCatalogueReady(produits) {
            this.produits = produits;

            // » affichage catalogue
            var divCatalogue = tag('div');
            divCatalogue.id = "catalogue";
            this.container.appendChild(divCatalogue);
            this.vueCatalogue = new VueCatalogue(divCatalogue);
            this.vueCatalogue.produits = this.produits;

            // » affichage panier
            var divPanier = tag('div');
            divPanier.id = "panier";
            divPanier.innerText = 'Panier';
            this.container.appendChild(divPanier);
            this.vuePanier = new VuePanier(divPanier);

            //this.vuePanier.achats = [];
        }
    }]);

    return Boutique;
}();

var VueCatalogue = function () {
    _createClass(VueCatalogue, [{
        key: 'produits',
        set: function set(items) {
            console.log('vue catalogue setter produits', items.length);
            this._produits = items;
            this.render();
        }
    }]);

    function VueCatalogue(elementHTMLRef) {
        _classCallCheck(this, VueCatalogue);

        this.container = elementHTMLRef;
        this._produits = [];
    }

    _createClass(VueCatalogue, [{
        key: 'render',
        value: function render() {
            var _this = this;

            console.log('Catalogue.render » ', this._produits);
            // afficher les produits
            var produitRenderers = this._produits.map(function (p) {
                return new VueProduit(p);
            });
            //let produitRenderers = this._produits.map((p)=> this.getVueProduit(p));
            produitRenderers.forEach(function (r) {
                return _this.container.appendChild(r.render());
            });
        }
    }]);

    return VueCatalogue;
}();

var VueProduit = function () {
    function VueProduit(produit) {
        _classCallCheck(this, VueProduit);

        this.produit = produit;
        this.render();
    }

    _createClass(VueProduit, [{
        key: 'render',
        value: function render() {
            this.productBox = tag('div');
            this.productBox.classList.add('product-box');

            this.addTitle(this.produit.nom);
            this.addPrix(this.produit.prixHT);
            this.addChpQuantite();
            this.addBtAjoute();

            return this.productBox;
        }
    }, {
        key: 'addBtAjoute',
        value: function addBtAjoute() {
            var btAdd = tag('button');
            btAdd.addEventListener('click', this.onBtAddClick.bind(this));
            btAdd.innerText = '+';
            this.productBox.appendChild(btAdd);
        }
    }, {
        key: 'addChpQuantite',
        value: function addChpQuantite() {
            this.chpQuantite = tag('input');
            this.chpQuantite.type = 'number';
            this.chpQuantite.value = 1;
            this.productBox.appendChild(this.chpQuantite);
        }
    }, {
        key: 'addTitle',
        value: function addTitle(nom) {
            var productTitle = tag('h2');
            productTitle.innerText = nom;
            this.productBox.appendChild(productTitle);
        }
    }, {
        key: 'addPrix',
        value: function addPrix(prix) {
            var productPrice = tag('p');
            productPrice.innerText = prix + ' €';
            this.productBox.appendChild(productPrice);
        }
    }, {
        key: 'onBtAddClick',
        value: function onBtAddClick(ev) {
            var eventAjouteProduit = new CustomEvent('ajouteAchat', {
                bubbles: true,
                detail: new Achat(this.produit, parseInt(this.chpQuantite.value))
            });
            this.productBox.dispatchEvent(eventAjouteProduit);
        }
    }]);

    return VueProduit;
}();

var ChargeurDonnees = function () {
    function ChargeurDonnees() {
        _classCallCheck(this, ChargeurDonnees);

        console.log('constructor', this);
        this.produits = [];
    }

    _createClass(ChargeurDonnees, [{
        key: 'charge',
        value: function charge(cheminCatalogue, onLoadCallback) {
            // fonction a appeller une fois chargement terminé
            this.onLoadCallback = onLoadCallback;

            // démarrage du chargement
            var req = new XMLHttpRequest();
            req.onload = this.onDataReady.bind(this);
            req.open('GET', cheminCatalogue, true);
            req.send();
        }

        /**
         * fonction du chargeur de gestion des données chargées
         * @param event
         */

    }, {
        key: 'onDataReady',
        value: function onDataReady(event) {
            var data = event.target.responseText;

            this.produits = JSON.parse(data)['produits'].map(function (p) {
                return new Produit(p.nom, p.prixHT);
            });

            /*let produitsObj = JSON.parse(data)['produits'];
            this.produits = [];
            for(let i = 0; i < produitsObj; i++){
                let p = new Produit(produitsObj[i].nom,produitsObj[i].prixHT );
                this.produits.push(p);
            }*/
            this.onLoadCallback(this.produits);
        }
    }]);

    return ChargeurDonnees;
}();

var VuePanier = function () {
    _createClass(VuePanier, [{
        key: 'achats',
        set: function set(values) {
            var _this2 = this;

            this._totalHT = 0;
            this._achats = values;
            // ajoute prix et quantités au total HT puis TTC
            this._achats.map(function (achat) {
                _this2.addToTotal(achat.produit.prixHT, achat.quantite);
            });
            this.render();
        }
    }]);

    function VuePanier(elementHTMLRef) {
        _classCallCheck(this, VuePanier);

        this.container = elementHTMLRef;
        this._achats = [];
        this._totalHT = 0;
        this._totalTTC = 0;
        this.render();
    }

    _createClass(VuePanier, [{
        key: 'render',
        value: function render() {
            // afficher ds le container de VuePanier la liste des achats
            this.container.innerHTML = 'Panier';
            this.addTable(this.container);

            var totalHT = tag('p');
            totalHT.innerText = 'Total HT : ' + this._totalHT.toFixed(2) + '€';
            this.container.appendChild(totalHT);
            var totalTTC = tag('p');
            totalTTC.innerText = 'Total TTC : ' + this._totalTTC.toFixed(2) + '€';
            this.container.appendChild(totalTTC);
        }

        /**
         * création du tableau de produits sélectionnés
         * @param container
         */

    }, {
        key: 'addTable',
        value: function addTable(container) {
            var _this3 = this;

            var tableau = tag('table');
            tableau.innerHTML = "<tr><td>Produit</td><td>Quantité</td><td>Prix HT</td></tr>";
            container.appendChild(tableau);
            // filter pour "supprimer" un article du panier où la quantité est passée à 0
            var achatRenderers = this._achats.filter(function (achat) {
                return achat.quantite > 0;
            }).map(function (achat) {
                // création des rows pour chaque article
                var vueAchat = tag('tr');
                var productDiv = tag('td');
                var quantiteDiv = tag('td');
                var prixDiv = tag('td');
                productDiv.innerText = achat.produit.nom;
                quantiteDiv.innerText = achat.quantite;
                prixDiv.innerText = achat.quantite * achat.produit.prixHT + "€";
                vueAchat.appendChild(productDiv);
                vueAchat.appendChild(quantiteDiv);
                vueAchat.appendChild(prixDiv);
                _this3.addBtnMoins(quantiteDiv, achat.produit.nom, achat.produit.prixHT, achat.quantite);
                _this3.addBtnPlus(quantiteDiv, achat.produit.nom, achat.produit.prixHT, achat.quantite);
                return vueAchat;
            });
            achatRenderers.forEach(function (renderer) {
                return tableau.appendChild(renderer);
            });
        }

        /**
         * création du bouton baissant la quantité d'un produit déjà sélectionné
         * @param container
         * @param product
         * @param prixHT
         * @param quantite
         */

    }, {
        key: 'addBtnMoins',
        value: function addBtnMoins(container, product, prixHT, quantite) {
            var btSuppr = tag('button');
            btSuppr.dataset.product = product;
            btSuppr.dataset.prixHT = prixHT;
            btSuppr.addEventListener('click', this.baisseQuantite.bind(this));
            btSuppr.innerText = '-';
            container.appendChild(btSuppr);
        }

        /**
         * création du bouton augmentant la quantité d'un produit déjà sélectionné
         * @param container
         * @param product
         * @param prixHT
         * @param quantite
         */

    }, {
        key: 'addBtnPlus',
        value: function addBtnPlus(container, product, prixHT, quantite) {
            var btAdd = tag('button');
            btAdd.dataset.product = product;
            btAdd.dataset.prixHT = prixHT;
            btAdd.addEventListener('click', this.augmenteQuantite.bind(this));
            btAdd.innerText = '+';
            container.appendChild(btAdd);
        }
        /**
         * ajoute chaque nouvel achat au total HT
         * @param article    String
         * @param prix       Int
         * @param quantite   Int
         */

    }, {
        key: 'addToTotal',
        value: function addToTotal(prixHT, quantite) {
            this._totalHT += prixHT * quantite;
            this.convertToTTC(this._totalHT, 0.2);
        }
        /**
         * conversion du total HT en total TTC pour un double affichage
         * @param totalHT
         * @param tauxTVA
         */

    }, {
        key: 'convertToTTC',
        value: function convertToTTC(totalHT, tauxTVA) {
            this._totalTTC = totalHT + totalHT * tauxTVA;
            console.log('total TTC', this._totalTTC.toFixed(2) + '€');
        }

        /**
         * création de l'écouteur d'évènement pour baisser la quantité d'un article dans le panier
         * @param ev
         */

    }, {
        key: 'baisseQuantite',
        value: function baisseQuantite(ev) {
            var eventBaisseQuantite = new CustomEvent('baisseQuantite', {
                bubbles: true,
                detail: new Achat(new Produit(ev.currentTarget.dataset.product, parseInt(ev.currentTarget.dataset.prixHT)), -1)
            });
            this.container.dispatchEvent(eventBaisseQuantite);
        }
        /**
         * création de l'écouteur d'évènement pour augmenter la quantité d'un article dans le panier
         * @param ev
         */

    }, {
        key: 'augmenteQuantite',
        value: function augmenteQuantite(ev) {
            var eventAugmenteQuantite = new CustomEvent('augmenteQuantite', {
                bubbles: true,
                detail: new Achat(new Produit(ev.currentTarget.dataset.product, parseInt(ev.currentTarget.dataset.prixHT)), 1)
            });
            this.container.dispatchEvent(eventAugmenteQuantite);
        }
    }]);

    return VuePanier;
}();

var boutique1 = new Boutique('produits.json', document.getElementById('boutique'));

//var boutique2 = new Boutique( 'produits.json', document.getElementById('boutique2') );
