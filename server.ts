import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Simple in-memory or fallback data of products so we don't import from tsX if there's type issues during bundle
const CATALOG_INFO = [
  { id: 'fw_1', name: "Le Collier d'Aura Baroque", price: 145, category: 'freshwater', description: "Une création asymétrique moderne alliant le lustre sauvage des véritables perles d'eau douce baroques et une chaîne en plaqué or." },
  { id: 'fw_2', name: "Bracelet Impérial de Nacre", price: 85, category: 'freshwater', description: "Composé d'un rang parfait de perles d'eau douce parfaitement rondes AAA." },
  { id: 'fw_3', name: "Boucles d'Oreilles Rosée Céleste", price: 75, category: 'freshwater', description: "Fins anneaux dorés à l'or fin avec perles d'eau douce." },
  { id: 'sw_1', name: "Le Sautoir Nuée de Tahiti", price: 390, category: 'saltwater', description: "Collier somptueux de véritables perles de Tahiti aux reflets anthracite et paon." },
  { id: 'sw_2', name: "Puces d'Oreilles Akoya d'Orient", price: 180, category: 'saltwater', description: "Perles Akoya japonaises, éclat miroir et or blanc 18 carats." },
  { id: 'sw_3', name: "Bague Reine des Mers du Sud", price: 290, category: 'saltwater', description: "Perle dorée naturelle des Mers du Sud de 10mm sur monture brossée." },
  { id: 'gs_1', name: "Bracelet Éclat Lunaire Divine", price: 85, category: 'gemstone', description: "Alliance céleste de pierre de soleil, nacre et hématite dorée." },
  { id: 'gs_2', name: "Ras-de-Cou Lapis Impérial", price: 120, category: 'gemstone', description: "Lapis-lazuli naturel bleu cobalt profond et fermoir bouée doré." },
  { id: 'gs_3', name: "Le Cabas Bento de Jade Sauvage", price: 245, category: 'gemstone', description: "Sac de soirée structuré entièrement tissé main de 1500 perles de jade vert." },
  { id: 'cr_1', name: "Coffret d'Initiation l'Atelier", price: 110, category: 'crafting', description: "Tout le matériel et fils précieux pour composer vos premiers bijoux." },
  { id: 'cr_2', name: "Lot de Fermoirs Bouée 18k", price: 45, category: 'crafting', description: "Jeu de 5 fermoirs bouée stylisés plaqués or fin 18 carats." }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for AI chat agent
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Format invalide. Liste de messages requis." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({
          reply: "Bonjour ! L'intelligence artificielle d'Aurum Beads est prêre, mais la clé d'activation API n'est pas encore configurée. Vous pouvez l'ajouter via l'onglet Settings > Secrets de l'éditeur AI Studio pour discuter avec moi !",
          action: null
        });
      }

      // Initialize Gemini Client Lazily (avoids crash on startup if missing)
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Prepare system instructions for professional luxury shopping assistant
      const systemInstruction = `Tu es l'assistant de prestige virtuel "Aurum-Concierge" de l'Atelier Aurum Beads à Paris Vendôme. 
Tu es élégant, courtois, chaleureux et tu doutes ou hallucines jamais sur les tarifs ou produits. Tu t'exprimes avec un ton haut de gamme et attentionné (humain, proche du client).

Voici les seuls produits réels de notre maison (ne propose ou n'invente AUCUN autre produit) :
${CATALOG_INFO.map(p => `- ID: "${p.id}", Nom: "${p.name}", Prix: ${p.price} €, Catégorie: "${p.category}", Description: "${p.description}"`).join("\n")}

Directives importantes de dialogue (sans hallucination) :
1. Réponds toujours avec précision sur ces produits, leurs spécificités et leurs tarifs.
2. Propose d'ajouter des bijoux ou accessoires au panier du client s'il montre un d'intérêt pour l'un d'eux.
3. Si le client souhaite ajouter un article au panier, ajoute impérativement ce tag exact à la toute fin de ton message : [ACTION:{"type":"ADD_TO_CART","productId":"ID_DU_PRODUIT"}]. Remplace "ID_DU_PRODUIT" par l'ID réel de ton choix.
4. Si le client veut voir son panier ou est prêt à passer au paiement, ajoute ce tag exact : [ACTION:{"type":"OPEN_CART"}]
5. S'il souhaite modifier ses données utilisateur ou créer son profil, ajoute : [ACTION:{"type":"OPEN_PROFILE"}]
6. Parle exclusivement en Français sauf si le client t'interpelle dans une autre langue. Garde des réponses concises, captivantes et élégantes.
7. Si le client formule ou exprime un avis positif, un compliment, ou dit qu'il veut donner ou écrire un témoignage (un "bon témoignage") sur le site, félicite-le chaleureusement et formule son témoignage en ajoutant impérativement ce tag exact à la toute fin de ton message : [ACTION:{"type":"ADD_TESTIMONIAL","authorName":"NOM_DU_CLIENT","comment":"MESSAGE_DU_TEMOIGNAGE","rating":5}]. Remplace "NOM_DU_CLIENT" par son vrai nom (ou invente poliment s'il n'en donne pas, ex: "Silas A.", "Hélène D.") et "MESSAGE_DU_TEMOIGNAGE" par le contenu de son compliment poli rédigé avec raffinement.`;

      // Format messages into Google GenAI format
      // Group contiguous messages from same role if duplicate, and convert 'assistant' -> 'model'
      const formattedContents = [];
      for (const msg of messages) {
        const role = msg.role === "assistant" || msg.role === "model" ? "model" : "user";
        formattedContents.push({
          role: role,
          parts: [{ text: msg.content }]
        });
      }

      // Run generation
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text || "Je suis à votre entière disposition pour concevoir le bijou de vos rêves.";
      
      // Look for the [ACTION:...] tag in reply
      let action = null;
      let cleanedText = replyText;
      const actionRegex = /\[ACTION:(.*?)\]/;
      const match = replyText.match(actionRegex);
      
      if (match) {
        try {
          action = JSON.parse(match[1]);
          // Clean the tag out of the text reply to make it clean for the user
          cleanedText = replyText.replace(actionRegex, "").trim();
        } catch (err) {
          console.error("Action parse err", err);
        }
      }

      return res.json({
        reply: cleanedText,
        action: action
      });

    } catch (error: any) {
      console.error("Gemini route error:", error);
      return res.status(500).json({ 
        error: "Une erreur est survenue lors du traitement.", 
        details: error.message 
      });
    }
  });

  // API endpoint to generate high-end product review
  app.post("/api/reviews/generate", async (req, res) => {
    try {
      const { rating, productName, productDescription } = req.body;
      const parsedRating = Number(rating) || 5;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Fallback reviews when key is not configured
        const fallbacks: Record<number, string[]> = {
          5: [
            `Une création divine ! Le lustre de cette pièce est tout simplement époustouflant, digne de la place Vendôme.`,
            `Absolument conquis par la qualité de confection de l'Atelier. Ce bijou rehausse n'importe quelle tenue de soirée.`,
            `Un chef-d'œuvre d'art brut et de douceur. La finesse du tissage et la sélection des perles sont parfaites.`
          ],
          4: [
            `Magnifique réalisation artisanale. Le fermoir et les perles sont superbes, j'aurais aimé une chaîne légèrement plus longue.`,
            `Très belle création, le raffinement est au rendez-vous. Livraison soignée et certificat d'authenticité inclus.`,
            `Un bijou très élégant et équilibré. L'éclat des perles est magnifique sous la lumière naturelle.`
          ],
          3: [
            `Le bijou est joli mais les nuances de couleurs diffèrent légèrement de la photographie de présentation.`,
            `Création correcte. L'artisanat se fait ressentir mais le temps de confection était un peu long.`,
            `Bon produit globalement, l'éclat est discret. Conforme aux attentes de base.`
          ],
          2: [
            `Déçu par la taille des perles, plus petites que ce à quoi je m'attendais pour cette gamme de prix.`,
            `Le fermoir me semble un peu fragile pour un usage quotidien. L'esthétique reste convenable.`
          ],
          1: [
            `Le produit ne correspond pas à mes attentes. Service de livraison à améliorer.`,
            `Problème d'ajustement du fermoir dès l'ouverture. Déçu de cette expérience.`
          ]
        };

        const list = fallbacks[parsedRating] || fallbacks[5];
        const selected = list[Math.floor(Math.random() * list.length)];
        return res.json({ review: selected, aiSuggested: true });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const prompt = `Tu es un client d'élite raffiné de l'Atelier Aurum Beads. Rédige un témoignage d'impression spontané et très soigné en français pour la création ${productName} (${productDescription}). 
La note attribuée est de ${parsedRating} étoiles sur 5. Formule un commentaire d'excellence qui correspond précisément à cette note (très élogieux pour 4-5 étoiles, constructif pour 3, déçu pour 1-2). 
Sois court et authentique (maximum 2 phrases, environ 30 mots). Ne mets aucun guillemet autour de ta réponse.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: { temperature: 0.8 }
      });

      return res.json({
        review: (response.text || "").trim().replace(/^"+|"+$/g, ''),
        aiSuggested: true
      });

    } catch (error: any) {
      console.error("AI Review Generation Err:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  // API endpoint to generate artisan reply response
  app.post("/api/reviews/reply", async (req, res) => {
    try {
      const { reviewComment, rating, productName, artisanName } = req.body;
      const parsedRating = Number(rating) || 5;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Fallback replies based on rating
        let reply = `Je vous remercie infiniment pour votre confiance et vos précieux retours. Chaque perle de l'Atelier est tissée avec dévotion.`;
        if (parsedRating >= 4) {
          reply = `C'est un immense honneur de savoir que ma création phare "${productName}" vous procure une telle satisfaction. Merci de faire résonner l'artisanat français d'exception.`;
        } else if (parsedRating === 3) {
          reply = `Je prends note de vos retours avec beaucoup d'attention. L'innovation et l'écoute de nos clients guident chacune de nos pièces d'art.`;
        } else {
          reply = `Je suis navré que cette création n'ait pas pleinement comblé vos attentes. Notre conciergerie privée va vous contacter immédiatement pour trouver une solution sur-mesure.`;
        }
        return res.json({ reply });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const prompt = `Tu es l'artisan d'art réputé "${artisanName}" de la maison de haute joaillerie Aurum Beads. 
Rédige une réponse d'atelier officielle, extrêmement élégante, humble et poétique en français pour répondre à l'avis d'un client.
Avis du client: "${reviewComment}" (Note: ${parsedRating}/5 étoiles) pour ta création "${productName}".
Ton de prestige, courtois, haut de gamme et sincère. Réponds en maximum une ou deux phrases (environ 30 mots).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: { temperature: 0.6 }
      });

      return res.json({
        reply: (response.text || "").trim().replace(/^"+|"+$/g, '')
      });

    } catch (error: any) {
      console.error("Artisan Reply Err:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  // Serve static files in production or hook Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
