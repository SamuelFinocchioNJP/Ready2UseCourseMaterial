// Veicoli
export type Veicolo = {
    id: number;
    targa: string;
    modello: string;
    idProprietario: number;
};

export const veicoli: Veicolo[] = [
    { id: 1, targa: "AB123CD", modello: "Fiat Panda", idProprietario: 1 },
    { id: 2, targa: "EF456GH", modello: "Volkswagen Golf", idProprietario: 2 },
    { id: 3, targa: "IJ789KL", modello: "Ford Fiesta", idProprietario: 3 },
    { id: 4, targa: "MN012OP", modello: "Toyota Yaris", idProprietario: 4 },
    { id: 5, targa: "QR345ST", modello: "Renault Clio", idProprietario: 5 },
    { id: 6, targa: "UV678WX", modello: "Peugeot 208", idProprietario: 1 },
    { id: 7, targa: "YZ901AB", modello: "Audi A3", idProprietario: 6 },
    { id: 8, targa: "CD234EF", modello: "BMW Serie 1", idProprietario: 7 },
    { id: 9, targa: "GH567IJ", modello: "Mercedes Classe A", idProprietario: 8 },
    { id: 10, targa: "KL890MN", modello: "Opel Corsa", idProprietario: 2 },
];

// Automobilisti
export type Automobilista = {
    id: number;
    cf: string;
    nome: string;
    eta: number;
    veicoli?: Veicolo[];
};

export const automobilisti: Automobilista[] = [
    { id: 1, cf: "RSSMRA85A01H501Z", nome: "Mario Rossi", eta: 39 },
    { id: 2, cf: "BNCLCU90B12F205X", nome: "Luca Bianchi", eta: 34 },
    { id: 3, cf: "VRDGPP78C23L219Y", nome: "Giuseppe Verdi", eta: 46 },
    { id: 4, cf: "NRILSN95D44D612K", nome: "Alessia Neri", eta: 29 },
    { id: 5, cf: "FRNGLI88E55G273Q", nome: "Giulia Ferrari", eta: 36 },
    { id: 6, cf: "MRNPLA82F66A944T", nome: "Paolo Marino", eta: 42 },
    { id: 7, cf: "CNTFBA99G77C351P", nome: "Fabio Conti", eta: 25 },
    { id: 8, cf: "RMNELI91H88E715M", nome: "Elisa Romano", eta: 33 },
];

export type AutomobilistaConVeicoli = Automobilista & {
    veicoli: Veicolo[];
};

// Soluzione ottimizzata con Map: O(A + V)
export function assegnaVeicoliConMap(
    automobilisti: Automobilista[],
    veicoli: Veicolo[]
): AutomobilistaConVeicoli[] {
    const automobilistiConVeicoli: AutomobilistaConVeicoli[] = automobilisti.map((automobilista) => ({
        ...automobilista,
        veicoli: [],
    }));

    const idToAutomobilista = new Map<Automobilista["id"], AutomobilistaConVeicoli>();
    for (const automobilista of automobilistiConVeicoli) {
        idToAutomobilista.set(automobilista.id, automobilista);
    }

    for (const veicolo of veicoli) {
        const proprietario = idToAutomobilista.get(veicolo.idProprietario);

        if (!proprietario) {
            throw new Error(`Proprietario con id ${veicolo.idProprietario} non trovato`);
        }

        proprietario.veicoli.push(veicolo);
    }

    return automobilistiConVeicoli;
}

// Soluzione naive con cicli annidati: O(A * V)
export function assegnaVeicoliNaive(
    automobilisti: Automobilista[],
    veicoli: Veicolo[]
): AutomobilistaConVeicoli[] {
    const automobilistiConVeicoli: AutomobilistaConVeicoli[] = automobilisti.map((automobilista) => ({
        ...automobilista,
        veicoli: [],
    }));

    for (const veicolo of veicoli) {
        let proprietarioTrovato = false;

        for (const automobilista of automobilistiConVeicoli) {
            if (automobilista.id === veicolo.idProprietario) {
                automobilista.veicoli.push(veicolo);
                proprietarioTrovato = true;
                break;
            }
        }

        if (!proprietarioTrovato) {
            throw new Error(`Proprietario con id ${veicolo.idProprietario} non trovato`);
        }
    }

    return automobilistiConVeicoli;
}

export const automobilistiConVeicoliMap = assegnaVeicoliConMap(automobilisti, veicoli);
export const automobilistiConVeicoliNaive = assegnaVeicoliNaive(automobilisti, veicoli);
