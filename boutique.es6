function tag(type){
    return document.createElement(type);
}


class Produit{
    constructor(nom, prix){
        this.nom = nom;
        this.prixHT = prix;
    }


}

class Achat{
    constructor(produit, quantite){
        this.produit = produit;
        this.quantite = quantite;
    }
}


class Boutique{
    constructor(cheminCatalogue, elementHTMLRef){

        this._achats = [];

        elementHTMLRef.addEventListener(
            'ajouteAchat',
            function (e){
                // vérifie si le produit a déjà été selectionné et ajouté au panier
                if (this._achats.length > 0) {
                    let match = this._achats.filter( (el) => {
                        return e.detail.produit.nom == el.produit.nom;
                    } );
                    if (match.length > 0) {
                        match[0].quantite += e.detail.quantite;
                    } else
                        this._achats.push(e.detail);
                } else
                    this._achats.push(e.detail);
                this.vuePanier.achats = this._achats;
                console.log("ajouteAchat", this._achats);
            }.bind(this)
        );
        // écouteur d'évènement pour le panier => Augmente la quantité
        elementHTMLRef.addEventListener(
            'augmenteQuantite',
            function (e){
                if (this._achats.length > 0) {
                    let match = this._achats.filter( (el) => {
                        return e.detail.produit.nom == el.produit.nom;
                    } );
                    if (match.length > 0) {
                        match[0].quantite += e.detail.quantite;
                    } else
                        this._achats.push(e.detail);
                } else
                    this._achats.push(e.detail);
                this.vuePanier.achats = this._achats;
                console.log("augmenteQuantite", this._achats);
            }.bind(this)
        )
        // écouteur d'évènement pour le panier => Baisse la quantité
        elementHTMLRef.addEventListener(
            'baisseQuantite',
            function (e){
                if (this._achats.length > 0) {
                    let match = this._achats.filter( (el) => {
                        return e.detail.produit.nom == el.produit.nom;
                    } );
                    if (match.length > 0) {
                        match[0].quantite += e.detail.quantite;
                    } else
                        this._achats.push(e.detail);
                } else
                    this._achats.push(e.detail);
                this.vuePanier.achats = this._achats;
                console.log("baisseQuantite", this._achats);

            }.bind(this)
        )

        this.container = elementHTMLRef;
        console.log('constructor', this);
        this.chargeur = new ChargeurDonnees();
        this.chargeur.charge( cheminCatalogue, this.onCatalogueReady.bind(this));
    }

    onCatalogueReady( produits ){
        this.produits = produits;

        // » affichage catalogue
        let divCatalogue = tag('div');
        divCatalogue.id = "catalogue";
        this.container.appendChild(divCatalogue);
        this.vueCatalogue = new VueCatalogue( divCatalogue );
        this.vueCatalogue.produits = this.produits;

        // » affichage panier
        let divPanier= tag('div');
        divPanier.id = "panier";
        divPanier.innerText = 'Panier';
        this.container.appendChild(divPanier);
        this.vuePanier = new VuePanier( divPanier );

        //this.vuePanier.achats = [];
    }
}

class VueCatalogue{
    set produits( items ){
        console.log('vue catalogue setter produits', items.length);
        this._produits = items;
        this.render();
    }

    constructor( elementHTMLRef ){
        this.container = elementHTMLRef;
        this._produits = [];
    }

    render(){
        console.log('Catalogue.render » ', this._produits);
        // afficher les produits
        let produitRenderers = this._produits.map((p)=> new VueProduit(p));
        //let produitRenderers = this._produits.map((p)=> this.getVueProduit(p));
        produitRenderers.forEach((r)=> this.container.appendChild(r.render()));
    }
}

class VueProduit{
    constructor( produit ){
        this.produit = produit;
        this.render();
    }
    render(){
        this.productBox = tag('div');
        this.productBox.classList.add('product-box')

        this.addTitle(this.produit.nom);
        this.addPrix(this.produit.prixHT);
        this.addChpQuantite();
        this.addBtAjoute();

        return this.productBox;
    }

    addBtAjoute() {
        let btAdd = tag('button');
        btAdd.addEventListener('click', this.onBtAddClick.bind(this));
        btAdd.innerText = '+';
        this.productBox.appendChild(btAdd);
    }

    addChpQuantite() {
        this.chpQuantite = tag('input');
        this.chpQuantite.type = 'number';
        this.chpQuantite.value = 1;
        this.productBox.appendChild(this.chpQuantite);
    }

    addTitle(nom) {
        let productTitle = tag('h2');
        productTitle.innerText = nom;
        this.productBox.appendChild(productTitle);
    }

    addPrix(prix) {
        let productPrice = tag('p');
        productPrice.innerText = prix + ' €';
        this.productBox.appendChild(productPrice);
    }

    onBtAddClick(ev){
        let eventAjouteProduit =
            new CustomEvent('ajouteAchat',
                {
                    bubbles:true,
                    detail:new Achat(this.produit, parseInt(this.chpQuantite.value) )
                });
        this.productBox.dispatchEvent(eventAjouteProduit);
    }
}

class ChargeurDonnees{
    constructor(){
        console.log('constructor', this);
        this.produits = [];
    }

    charge(cheminCatalogue, onLoadCallback){
        // fonction a appeller une fois chargement terminé
        this.onLoadCallback = onLoadCallback;

        // démarrage du chargement
        let req = new XMLHttpRequest();
        req.onload = this.onDataReady.bind(this);
        req.open('GET', cheminCatalogue, true);
        req.send();
    }

    /**
     * fonction du chargeur de gestion des données chargées
     * @param event
     */
    onDataReady(event){
        let data = event.target.responseText;

        this.produits = JSON.parse(data)['produits']
            .map( p => new Produit(p.nom, p.prixHT) );

        /*let produitsObj = JSON.parse(data)['produits'];
        this.produits = [];
        for(let i = 0; i < produitsObj; i++){
            let p = new Produit(produitsObj[i].nom,produitsObj[i].prixHT );
            this.produits.push(p);
        }*/
        this.onLoadCallback(this.produits);
    }
}


class VuePanier{

    set achats( values ){
        this._totalHT = 0;
        this._achats = values;
        // ajoute prix et quantités au total HT puis TTC
        this._achats.map( achat => {
            this.addToTotal( achat.produit.prixHT, achat.quantite )
        })
        this.render();
    }

    constructor( elementHTMLRef ){
        this.container = elementHTMLRef;
        this._achats = [];
        this._totalHT = 0;
        this._totalTTC = 0;
        this.render();
    }

    render(){
        // afficher ds le container de VuePanier la liste des achats
        this.container.innerHTML = 'Panier';
        this.addTable(this.container)

        let totalHT = tag('p');
        totalHT.innerText = 'Total HT : ' + this._totalHT.toFixed(2) + '€';
        this.container.appendChild(totalHT);
        let totalTTC = tag('p');
        totalTTC.innerText = 'Total TTC : ' + this._totalTTC.toFixed(2) + '€';
        this.container.appendChild(totalTTC);
    }

    /**
     * création du tableau de produits sélectionnés
     * @param container
     */
    addTable(container){
        let tableau = tag('table');
        tableau.innerHTML = "<tr><td>Produit</td><td>Quantité</td><td>Prix HT</td></tr>";
        container.appendChild(tableau);
        // filter pour "supprimer" un article du panier où la quantité est passée à 0
        let achatRenderers = this._achats.filter( function(achat) {
            return achat.quantite > 0;
        }).map( achat => { // création des rows pour chaque article
            let vueAchat = tag('tr');
            let productDiv = tag('td');
            let quantiteDiv = tag('td');
            let prixDiv = tag('td');
            productDiv.innerText = achat.produit.nom;
            quantiteDiv.innerText = achat.quantite;
            prixDiv.innerText = achat.quantite * achat.produit.prixHT  + "€";
            vueAchat.appendChild(productDiv);
            vueAchat.appendChild(quantiteDiv);
            vueAchat.appendChild(prixDiv);
            this.addBtnMoins(quantiteDiv, achat.produit.nom, achat.produit.prixHT, achat.quantite);
            this.addBtnPlus(quantiteDiv, achat.produit.nom, achat.produit.prixHT, achat.quantite);
            return vueAchat;
        });
        achatRenderers.forEach( (renderer) => tableau.appendChild(renderer) );
    }

    /**
     * création du bouton baissant la quantité d'un produit déjà sélectionné
     * @param container
     * @param product
     * @param prixHT
     * @param quantite
     */
    addBtnMoins(container, product, prixHT, quantite){
        let btSuppr = tag('button');
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
    addBtnPlus(container, product, prixHT, quantite){
        let btAdd = tag('button');
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
    addToTotal( prixHT, quantite ){
        this._totalHT += prixHT * quantite;
        this.convertToTTC( this._totalHT, 0.2 );
    }
    /**
     * conversion du total HT en total TTC pour un double affichage
     * @param totalHT
     * @param tauxTVA
     */
    convertToTTC( totalHT, tauxTVA ){
        this._totalTTC = totalHT + (totalHT * tauxTVA);
        console.log('total TTC', this._totalTTC.toFixed(2) + '€');
    }

    /**
     * création de l'écouteur d'évènement pour baisser la quantité d'un article dans le panier
     * @param ev
     */
    baisseQuantite(ev){
        let eventBaisseQuantite =
            new CustomEvent('baisseQuantite',
                {
                    bubbles:true,
                    detail: new Achat(new Produit(ev.currentTarget.dataset.product, parseInt(ev.currentTarget.dataset.prixHT)), -1)
                });
        this.container.dispatchEvent(eventBaisseQuantite);
    }
    /**
     * création de l'écouteur d'évènement pour augmenter la quantité d'un article dans le panier
     * @param ev
     */
    augmenteQuantite(ev){
        let eventAugmenteQuantite =
            new CustomEvent('augmenteQuantite',
                {
                    bubbles:true,
                    detail: new Achat(new Produit(ev.currentTarget.dataset.product, parseInt(ev.currentTarget.dataset.prixHT)), 1)
                });
        this.container.dispatchEvent(eventAugmenteQuantite);
    }
}

var boutique1 = new Boutique( 'produits.json', document.getElementById('boutique') );

//var boutique2 = new Boutique( 'produits.json', document.getElementById('boutique2') );
