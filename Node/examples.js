// ============================================================================
//  DATASET: Negozi alimentari, prodotti e allergeni  (v2 - granulare)
// ----------------------------------------------------------------------------
//  Struttura:
//    - Array di negozi
//    - Ogni negozio  -> array di prodotti
//    - Ogni prodotto -> array di allergeni (vocabolario chiuso, vedi sotto)
//
//  MODELLO ALLERGENI GRANULARE
//  Gli allergeni del latte sono SEPARATI, perche' nella realta' lo sono:
//    - "caseina"       = proteina del latte  (allergia alle proteine del latte)
//    - "lattosio"      = zucchero del latte  (intolleranza al lattosio)
//    - "siero di latte"= whey                (presente anche in molti proteici)
//
//  >>> Conseguenza importante per la ricerca <<<
//  Un prodotto "senza lattosio" (es. latte delattosato) PUO' contenere caseina.
//  Quindi "biscotti senza caseina" e "biscotti senza lattosio" danno risultati
//  DIVERSI. Il dataset e' costruito apposta per evidenziarlo.
//
//  Vocabolario completo allergeni usati:
//    glutine, caseina, lattosio, siero di latte, uova, soia, arachidi,
//    frutta a guscio, sesamo, sedano, senape, solfiti, pesce, crostacei,
//    molluschi, lupini
// ============================================================================


const negozi = [
    {
        id: 1,
        nome: "Alimentari Bio Verde",
        indirizzo: "Via Toledo 145",
        citta: "Napoli",
        cap: "80132",
        telefono: "081 555 0101",
        orari: "Lun-Sab 8:00-20:00",
        valutazione: 4.6,
        prodotti: [
            { id: 101, nome: "Biscotti integrali bio", categoria: "Biscotti", prezzo: 3.40, allergeni: ["glutine"] },
            { id: 102, nome: "Biscotti vegani al cacao", categoria: "Biscotti", prezzo: 3.80, allergeni: ["glutine", "soia"] },
            { id: 103, nome: "Pane", categoria: "Panetteria", prezzo: 2.90, allergeni: [] },
            { id: 104, nome: "Pasta di mais", categoria: "Pasta", prezzo: 2.50, allergeni: [] },
            { id: 105, nome: "Latte di mandorla", categoria: "Bevande", prezzo: 1.80, allergeni: ["frutta a guscio"] },
            { id: 106, nome: "Pesto vegano", categoria: "Salse", prezzo: 4.20, allergeni: [] },
            { id: 107, nome: "Hummus di ceci", categoria: "Gastronomia", prezzo: 3.80, allergeni: ["sesamo"] },
            { id: 108, nome: "Gelato al cocco", categoria: "Surgelati", prezzo: 5.50, allergeni: [] },
            { id: 109, nome: "Tofu bio", categoria: "Gastronomia", prezzo: 2.90, allergeni: ["soia"] },
            { id: 110, nome: "Crackers di riso", categoria: "Panetteria", prezzo: 2.10, allergeni: [] },
        ],
    },
    {
        id: 2,
        nome: "Supermercato Conad",
        indirizzo: "Corso Italia 22",
        citta: "Roma",
        cap: "00198",
        telefono: "06 555 0202",
        orari: "Lun-Dom 7:30-21:30",
        valutazione: 4.1,
        prodotti: [
            { id: 201, nome: "Biscotti al burro", categoria: "Biscotti", prezzo: 1.90, allergeni: ["glutine", "caseina", "lattosio", "uova"] },
            { id: 202, nome: "Biscotti frollini", categoria: "Biscotti", prezzo: 1.70, allergeni: ["glutine", "caseina", "lattosio"] },
            { id: 203, nome: "Pane in cassetta", categoria: "Panetteria", prezzo: 1.60, allergeni: ["glutine", "soia"] },
            { id: 204, nome: "Pasta di semola", categoria: "Pasta", prezzo: 0.99, allergeni: ["glutine"] },
            { id: 205, nome: "Latte intero", categoria: "Bevande", prezzo: 1.20, allergeni: ["caseina", "lattosio"] },
            { id: 206, nome: "Yogurt alla fragola", categoria: "Latticini", prezzo: 0.80, allergeni: ["caseina", "lattosio"] },
            { id: 207, nome: "Pesto alla genovese", categoria: "Salse", prezzo: 2.40, allergeni: ["caseina", "frutta a guscio"] },
            { id: 208, nome: "Tonno in scatola", categoria: "Conserve", prezzo: 2.30, allergeni: ["pesce"] },
            { id: 209, nome: "Maionese", categoria: "Salse", prezzo: 1.70, allergeni: ["uova", "senape"] },
            { id: 210, nome: "Cioccolato al latte", categoria: "Dolci", prezzo: 1.50, allergeni: ["caseina", "lattosio", "soia"] },
        ],
    },
    {
        id: 3,
        nome: "Panificio Artigianale Il Forno",
        indirizzo: "Via Garibaldi 8",
        citta: "Milano",
        cap: "20121",
        telefono: "02 555 0303",
        orari: "Lun-Sab 6:30-19:30",
        valutazione: 4.8,
        prodotti: [
            { id: 301, nome: "Biscotti di pasta frolla", categoria: "Biscotti", prezzo: 4.00, allergeni: ["glutine", "caseina", "lattosio", "uova"] },
            { id: 302, nome: "Cantucci alle mandorle", categoria: "Biscotti", prezzo: 4.50, allergeni: ["glutine", "uova", "frutta a guscio"] },
            { id: 303, nome: "Pane casereccio", categoria: "Panetteria", prezzo: 3.50, allergeni: ["glutine"] },
            { id: 304, nome: "Focaccia", categoria: "Panetteria", prezzo: 4.00, allergeni: ["glutine"] },
            { id: 305, nome: "Grissini al sesamo", categoria: "Panetteria", prezzo: 1.80, allergeni: ["glutine", "sesamo"] },
            { id: 306, nome: "Cornetto", categoria: "Dolci", prezzo: 1.30, allergeni: ["glutine", "caseina", "lattosio", "uova"] },
            { id: 307, nome: "Pizza margherita", categoria: "Gastronomia", prezzo: 6.00, allergeni: ["glutine", "caseina", "lattosio"] },
            { id: 308, nome: "Taralli", categoria: "Panetteria", prezzo: 2.20, allergeni: ["glutine"] },
        ],
    },
    {
        id: 4,
        nome: "Pasticceria Dolce Vita",
        indirizzo: "Via dei Servi 60",
        citta: "Firenze",
        cap: "50122",
        telefono: "055 555 0404",
        orari: "Mar-Dom 7:00-20:00",
        valutazione: 4.7,
        prodotti: [
            { id: 401, nome: "Biscotti al cioccolato", categoria: "Biscotti", prezzo: 3.20, allergeni: ["glutine", "caseina", "lattosio", "uova", "soia"] },
            { id: 402, nome: "Biscotti alle nocciole", categoria: "Biscotti", prezzo: 3.60, allergeni: ["glutine", "caseina", "lattosio", "frutta a guscio"] },
            { id: 403, nome: "Amaretti", categoria: "Biscotti", prezzo: 4.10, allergeni: ["uova", "frutta a guscio"] },
            { id: 404, nome: "Meringhe", categoria: "Dolci", prezzo: 2.80, allergeni: ["uova"] },
            { id: 405, nome: "Tiramisu", categoria: "Dolci", prezzo: 5.20, allergeni: ["glutine", "caseina", "lattosio", "uova"] },
            { id: 406, nome: "Crostata di frutta", categoria: "Dolci", prezzo: 6.50, allergeni: ["glutine", "caseina", "lattosio", "uova", "solfiti"] },
            { id: 407, nome: "Cannoli", categoria: "Dolci", prezzo: 2.50, allergeni: ["glutine", "caseina", "lattosio", "uova"] },
            { id: 408, nome: "Macarons", categoria: "Dolci", prezzo: 1.80, allergeni: ["caseina", "lattosio", "uova", "frutta a guscio"] },
        ],
    },
    {
        id: 5,
        nome: "Market Etnico Globo",
        indirizzo: "Via dell'Indipendenza 47",
        citta: "Bologna",
        cap: "40121",
        telefono: "051 555 0505",
        orari: "Lun-Sab 9:30-20:30",
        valutazione: 4.2,
        prodotti: [
            { id: 501, nome: "Biscotti al cocco", categoria: "Biscotti", prezzo: 2.90, allergeni: ["glutine", "uova"] },
            { id: 502, nome: "Biscotti di riso", categoria: "Biscotti", prezzo: 3.10, allergeni: [] },
            { id: 503, nome: "Salsa di soia", categoria: "Salse", prezzo: 3.30, allergeni: ["soia", "glutine"] },
            { id: 504, nome: "Tofu", categoria: "Gastronomia", prezzo: 2.40, allergeni: ["soia"] },
            { id: 505, nome: "Latte di soia", categoria: "Bevande", prezzo: 2.10, allergeni: ["soia"] },
            { id: 506, nome: "Burro di arachidi", categoria: "Conserve", prezzo: 4.10, allergeni: ["arachidi"] },
            { id: 507, nome: "Noodles di riso", categoria: "Pasta", prezzo: 2.70, allergeni: [] },
            { id: 508, nome: "Gamberi surgelati", categoria: "Surgelati", prezzo: 7.50, allergeni: ["crostacei"] },
            { id: 509, nome: "Curry in pasta", categoria: "Salse", prezzo: 3.90, allergeni: ["sedano", "senape"] },
            { id: 510, nome: "Anacardi tostati", categoria: "Snack", prezzo: 5.20, allergeni: ["frutta a guscio"] },
        ],
    },
    {
        id: 6,
        nome: "Gastronomia Da Mario",
        indirizzo: "Piazza Castello 3",
        citta: "Torino",
        cap: "10122",
        telefono: "011 555 0606",
        orari: "Mar-Dom 9:00-21:00",
        valutazione: 4.4,
        prodotti: [
            { id: 601, nome: "Biscotti salati al formaggio", categoria: "Biscotti", prezzo: 3.50, allergeni: ["glutine", "caseina", "lattosio"] },
            { id: 602, nome: "Pesto al basilico", categoria: "Salse", prezzo: 3.60, allergeni: ["frutta a guscio"] },
            { id: 603, nome: "Lasagne", categoria: "Gastronomia", prezzo: 8.50, allergeni: ["glutine", "caseina", "lattosio", "uova", "sedano"] },
            { id: 604, nome: "Insalata di mare", categoria: "Gastronomia", prezzo: 9.90, allergeni: ["crostacei", "molluschi", "solfiti"] },
            { id: 605, nome: "Vitello tonnato", categoria: "Gastronomia", prezzo: 11.00, allergeni: ["pesce", "uova", "senape"] },
            { id: 606, nome: "Parmigiana di melanzane", categoria: "Gastronomia", prezzo: 7.20, allergeni: ["caseina", "lattosio", "uova"] },
            { id: 607, nome: "Pane", categoria: "Panetteria", prezzo: 2.20, allergeni: ["glutine"] },
            { id: 608, nome: "Gelato alla vaniglia", categoria: "Dolci", prezzo: 4.80, allergeni: ["caseina", "lattosio", "uova"] },
        ],
    },
    {
        id: 7,
        nome: "Supermercato Esselunga",
        indirizzo: "Viale del Lavoro 18",
        citta: "Verona",
        cap: "37135",
        telefono: "045 555 0707",
        orari: "Lun-Dom 8:00-21:00",
        valutazione: 4.3,
        prodotti: [
            // Trabocchetti voluti: "senza glutine" e "senza lattosio" NON sono "senza caseina"
            { id: 701, nome: "Biscotti per la colazione", categoria: "Biscotti", prezzo: 1.80, allergeni: ["glutine", "caseina", "lattosio"] },
            { id: 702, nome: "Biscotti senza glutine", categoria: "Biscotti", prezzo: 3.90, allergeni: ["caseina", "lattosio", "uova"] },
            { id: 703, nome: "Biscotti senza lattosio", categoria: "Biscotti", prezzo: 3.70, allergeni: ["glutine", "caseina", "uova"] },
            { id: 704, nome: "Pane integrale", categoria: "Panetteria", prezzo: 1.90, allergeni: ["glutine", "soia"] },
            { id: 705, nome: "Pasta integrale", categoria: "Pasta", prezzo: 1.10, allergeni: ["glutine"] },
            { id: 706, nome: "Latte delattosato", categoria: "Bevande", prezzo: 1.40, allergeni: ["caseina"] }, // niente lattosio, ma la caseina resta!
            { id: 707, nome: "Wurstel di pollo", categoria: "Salumi", prezzo: 2.60, allergeni: ["senape"] },
            { id: 708, nome: "Cereali al cioccolato", categoria: "Colazione", prezzo: 2.90, allergeni: ["glutine", "caseina", "lattosio", "soia"] },
            { id: 709, nome: "Succo d'arancia", categoria: "Bevande", prezzo: 1.30, allergeni: [] },
            { id: 710, nome: "Patatine", categoria: "Snack", prezzo: 1.20, allergeni: ["solfiti"] },
        ],
    },
    {
        id: 8,
        nome: "Erboristeria & Salute Natura",
        indirizzo: "Via Roma 210",
        citta: "Palermo",
        cap: "90133",
        telefono: "091 555 0808",
        orari: "Lun-Sab 9:00-19:00",
        valutazione: 4.5,
        prodotti: [
            { id: 801, nome: "Biscotti senza glutine e senza lattosio", categoria: "Biscotti", prezzo: 4.50, allergeni: [] },
            { id: 802, nome: "Biscotti proteici", categoria: "Biscotti", prezzo: 3.80, allergeni: ["soia", "caseina", "siero di latte"] }, // proteici != senza latte!
            { id: 803, nome: "Barrette ai cereali", categoria: "Snack", prezzo: 2.40, allergeni: ["glutine", "frutta a guscio"] },
            { id: 804, nome: "Latte di avena", categoria: "Bevande", prezzo: 2.30, allergeni: ["glutine"] },
            { id: 805, nome: "Bevanda di riso", categoria: "Bevande", prezzo: 2.20, allergeni: [] },
            { id: 806, nome: "Crackers integrali", categoria: "Panetteria", prezzo: 2.60, allergeni: ["glutine", "sesamo"] },
            { id: 807, nome: "Frutta secca mista", categoria: "Snack", prezzo: 6.10, allergeni: ["frutta a guscio", "solfiti"] },
            { id: 808, nome: "Miele biologico", categoria: "Dispensa", prezzo: 7.40, allergeni: [] },
        ],
    },
    {
        id: 9,
        nome: "Salumeria & Formaggi La Bottega",
        indirizzo: "Strada della Repubblica 5",
        citta: "Parma",
        cap: "43121",
        telefono: "0521 555 0909",
        orari: "Lun-Sab 8:30-19:30",
        valutazione: 4.9,
        prodotti: [
            { id: 901, nome: "Biscotti rustici al formaggio", categoria: "Biscotti", prezzo: 4.20, allergeni: ["glutine", "caseina", "lattosio"] },
            { id: 902, nome: "Parmigiano Reggiano", categoria: "Formaggi", prezzo: 12.50, allergeni: ["caseina", "lattosio"] },
            { id: 903, nome: "Mozzarella", categoria: "Formaggi", prezzo: 3.20, allergeni: ["caseina", "lattosio"] },
            { id: 904, nome: "Prosciutto crudo", categoria: "Salumi", prezzo: 9.80, allergeni: [] },
            { id: 905, nome: "Salame", categoria: "Salumi", prezzo: 6.40, allergeni: ["lattosio"] }, // additivo lattiero "nascosto"
            { id: 906, nome: "Mortadella con pistacchio", categoria: "Salumi", prezzo: 5.90, allergeni: ["frutta a guscio"] },
            { id: 907, nome: "Pane", categoria: "Panetteria", prezzo: 2.30, allergeni: ["glutine"] },
            { id: 908, nome: "Olive ascolane", categoria: "Gastronomia", prezzo: 7.60, allergeni: ["glutine", "caseina", "lattosio", "uova"] },
        ],
    },
];


const isBoscottoSenzaCaseina = (prodotto) => prodotto.categoria === "Biscotti" && !prodotto.allergeni.includes("caseina");
const negozioConBiscottiSenzaCaseina = (negozio) => negozio.prodotti.some(isBoscottoSenzaCaseina); // filter.length > 0
const result = negozi.filter(negozioConBiscottiSenzaCaseina);

// console.log(JSON.stringify(result.map(n => n.id), null, 2));
// Elenco di negozi
// Per ogni negozio abbiamo un elenco di prodotti alimentari
// Ogni prodotto ha una lista di allergeni

// devo comprare un prodotto e devo trovare il negozio che vende quel prodotto senza un particolare allergene

// Necessito di un dataset
// UN array di negozi con dentro un insieme di campi sensati per il negozio
// Ogni negozio avra un array di prodotti
// Ogni prodotto avra un array di allergeni


// Trovare tutti i negozi che vendono almeno un prodotto senza glutine con costo inferiore o uguale a euro "Prezzo"
function trovaNegoziEconomiciConProdottiSenzaGlutineConCostoMinore(negozi, prezzo) {
    const negozioHasProductWithoutGlutenPricedLessThen = (negozio) => negozio.prodotti.some(
        (prodotto) => !prodotto.allergeni.includes("glutine") && prodotto.prezzo <= prezzo
    );

    return negozi.filter(
        (negozio) => negozioHasProductWithoutGlutenPricedLessThen(negozio)
    );
}

console.log(trovaNegoziEconomiciConProdottiSenzaGlutineConCostoMinore(negozi, 1).map(n => n.nome));


// Data una lista della spesa, trovare un negozio che contiene tutti i prodotti che voglio comprare in modo tale
// da non dover navigare in piu negozi


// Step 2:
// Trovare di quetsi negozi quello che conviene di piu ovver quello la cui somma dei prezzo dei prodotti scelti è minore

// Step 3: In caso di non esistenza di un negozio con questi vincoli suggerire un insieme di negozi che vende questi prodotti
