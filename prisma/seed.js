"use strict";
// prisma/seed.ts
// Génère 100 restaurants, chacun avec 100 plats (menu items)
// Lancer avec : npx prisma db seed
// (ou : npx ts-node prisma/seed.ts)
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// --- Données de base pour générer du contenu varié ---
const RESTO_PREFIXES = [
    'Le Gourmet', 'Sakafo', 'Chez', 'Restaurant', 'La Table de',
    'Snack', 'Hotely', 'Pizzeria', 'Le Petit', 'Grand',
];
const RESTO_NAMES = [
    'Tana', 'Gasy', 'Analakely', 'Ivandry', 'Ankorondrano', 'Tsimbazaza',
    'Itaosy', 'Andraharo', 'Behoririka', 'Ambatomena', 'Mahamasina',
    'Faliarivo', 'Soavimbahoaka', 'Ankadifotsy', 'Antanimena', 'Andohalo',
    'Isoraka', 'Tsaralalana', 'Ambohipo', 'Anosy', 'Ambatobe',
    'Alarobia', 'Andravoahangy', 'Ankatso', '67Ha', 'Antanetibe',
];
const RESTO_TYPES = [
    'Gasy', 'Cuisine Malgache', 'Fast Food', 'Pizza', 'Grill',
    'Snack Bar', 'Cuisine Asiatique', 'Crêperie', 'Burger House', 'Café Resto',
];
// Plats malgaches / régionaux variés
const DISH_NAMES = [
    'Romazava', 'Ravitoto sy Henakisoa', 'Akoho sy Voanio', 'Vary Amin\'anana',
    'Henakisoa Sy Sakamalao', 'Trondro Gasy', 'Lasopy Legioma', 'Mofo Gasy',
    'Sambosa Akoho', 'Sambosa Henakisoa', 'Vary Sy Laoka', 'Tsaramaso Sy Henakisoa',
    'Akoho Sy Sakay', 'Voanjobory Sy Henakisoa', 'Hena Omby Ritra', 'Brèdes Mafana',
    'Soupe Chinoise', 'Nouilles Sautées', 'Riz Cantonais', 'Poulet à l\'Ananas',
    'Pizza Margherita', 'Pizza Quatre Fromages', 'Pizza Pepperoni', 'Calzone',
    'Burger Classique', 'Cheeseburger', 'Burger Poulet', 'Frites Maison',
    'Salade César', 'Salade Composée', 'Sandwich Club', 'Croque-Monsieur',
    'Brochettes de Boeuf', 'Brochettes de Poulet', 'Steak Frites', 'Côtelettes Grillées',
    'Crêpe Sucrée', 'Crêpe Salée', 'Gâteau au Chocolat', 'Mousse au Chocolat',
    'Salade de Fruits', 'Yaourt Glacé', 'Jus de Fruits Frais', 'Ranonapango',
    'Beignets de Crevettes', 'Poisson Grillé', 'Calamars Frits', 'Riz Sauté aux Légumes',
    'Soupe de Poisson', 'Tilapia Grillé', 'Crabe Farci', 'Camarons Sauce Coco',
];
const DISH_CATEGORIES = [
    'Plats Traditionnels', 'Grillades', 'Snacks', 'Pizzas', 'Burgers',
    'Salades', 'Desserts', 'Boissons', 'Fruits de Mer', 'Soupes',
];
const DISH_DESCRIPTIONS = [
    'Plat traditionnel préparé avec des ingrédients frais',
    'Recette familiale transmise de génération en génération',
    'Spécialité de la maison, accompagnée de riz blanc',
    'Préparation maison avec épices locales',
    'Servi chaud avec accompagnement au choix',
    'Une recette authentique malgache',
    'Cuisiné avec des produits locaux de saison',
    'Le plat signature du restaurant',
];
// --- Fonctions utilitaires ---
function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function randomPrice(min = 5000, max = 25000) {
    // arrondi au 500 Ar le plus proche
    return Math.round((Math.random() * (max - min) + min) / 500) * 500;
}
function randomPhone() {
    return `034 ${Math.floor(10 + Math.random() * 89)} ${Math.floor(100 + Math.random() * 899)} ${Math.floor(10 + Math.random() * 89)}`;
}
// Coordonnées approximatives autour d'Antananarivo (pour le champ latitude/longitude si présent)
const ANTANANARIVO_LAT = -18.8792;
const ANTANANARIVO_LNG = 47.5079;
function randomCoord(base, spread = 0.08) {
    return base + (Math.random() - 0.5) * spread;
}
async function main() {
    console.log('Création de 100 restaurants avec 100 plats chacun (ajout, pas de suppression)...');
    for (let i = 1; i <= 100; i++) {
        const prefix = pick(RESTO_PREFIXES);
        const name = pick(RESTO_NAMES);
        const type = pick(RESTO_TYPES);
        const restoName = `${prefix} ${name} #${i}`;
        const restaurant = await prisma.restaurant.create({
            data: {
                name: `${restoName} (${type})`,
                imageUrl: `https://picsum.photos/seed/sakafo-resto-${i}/600/400`,
                address: `Lot ${i}, ${name}, Antananarivo`,
                phone: randomPhone(),
                latitude: randomCoord(ANTANANARIVO_LAT),
                longitude: randomCoord(ANTANANARIVO_LNG),
                isOpen: Math.random() > 0.1, // 90% ouverts
            },
        });
        // Génère 100 plats pour ce restaurant
        const menuItemsData = [];
        for (let j = 1; j <= 100; j++) {
            const dishName = pick(DISH_NAMES);
            menuItemsData.push({
                name: `${dishName} #${j}`,
                description: pick(DISH_DESCRIPTIONS),
                price: randomPrice(),
                imageUrl: `https://picsum.photos/seed/sakafo-plat-${i}-${j}/400/300`,
                category: pick(DISH_CATEGORIES),
                isAvailable: Math.random() > 0.05, // 95% disponibles
                restaurantId: restaurant.id,
            });
        }
        await prisma.menuItem.createMany({
            data: menuItemsData,
        });
        if (i % 10 === 0) {
            console.log(`  ${i}/100 restaurants créés...`);
        }
    }
    console.log('Terminé : 100 restaurants et 10 000 plats créés.');
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
