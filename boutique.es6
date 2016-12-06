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
                this._achats.push(e.detail);
                this.vuePanier.achats = this._achats;
                console.log("ajouteAchat", this._achats);
            }.bind(this)
        );

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
        this.container.appendChild(divPanier);
        divPanier.innerText = 'Panier';
        this.vuePanier= new VuePanier( divPanier );

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
        productPrice.innerText = prix;
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
        this._achats = values;
        this.render();
    }

    constructor( elementHTMLRef ){
        this.container = elementHTMLRef;
        this._achats = [];
        this.render();
    }

    render(){
        // afficher ds le container de VuePanier la liste des achats
        this.container.innerHTML = '';
        let achatRenderers = this._achats.map( function(achat){
           let vueAchat = tag('div');
           vueAchat.innerText = achat.produit.nom + ' / '
               + achat.quantite * achat.produit.prixHT;
           return vueAchat;
        });
        achatRenderers.forEach( (renderer) => this.container.appendChild(renderer) );
    }
}

var boutique1 = new Boutique( 'produits.json', document.getElementById('boutique') );

//var boutique2 = new Boutique( 'produits.json', document.getElementById('boutique2') );
