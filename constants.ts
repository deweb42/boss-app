import { FrameworkPhase, BrandingAsset } from './types';

export const BRANDING_MODULES_META = [
  {
    id: 'visual',
    title: 'Visual Identity',
    description: 'Couleurs, Typographie et éléments graphiques.',
    iconName: 'Palette'
  },
  {
    id: 'voice',
    title: 'Brand Voice',
    description: 'Ton, Archétype et Règles d\'écriture.',
    iconName: 'Mic2'
  },
  {
    id: 'assets',
    title: 'Asset Library',
    description: 'Liens vers Drive, Figma, Logos.',
    iconName: 'FolderOpen'
  }
];

export const FRAMEWORK_DATA: FrameworkPhase[] = [
  {
    id: 'identity',
    title: 'Identité',
    subtitle: 'Module 0',
    unlockCode: import.meta.env.VITE_CODE_IDENTITY || 'OPEN',
    goal: 'Initialiser le "Cerveau Marketing" du projet.',
    strategies: [
      'Définir la Mission (Le "Pourquoi")',
      'Choisir la structure technique (Domaines)',
      'Valider les accès initiaux',
    ],
    subModules: [],
    optimizationTips: [],
    focus: 'Clarté & Vision',
    objectives: 'Créer la carte d\'identité unique du business pour aligner toutes les futures actions.',
    usefulInfo: 'Ceci est la racine. Si l\'identité est floue, le marketing sera inefficace. Prenez le temps de remplir ces fondations.',
    iconName: 'Fingerprint',
    type: 'setup'
  },
  {
    id: 'offre',
    title: 'Offre & Écosystème',
    subtitle: 'Module 1',
    unlockCode: import.meta.env.VITE_CODE_OFFRE || 'START',
    goal: 'Construire un écosystème d\'offres irrésistible et benchmarker le marché.',
    strategies: [
      'Valider l\'Avatar',
      'Structurer l\'Offre',
      'Espionner la concurrence',
      'Définir le Lead Magnet'
    ],
    subModules: [
      {
        id: 'avatar-deep-dive',
        title: '1. Avatars (Deep Dive)',
        description: 'On ne vend pas à "tout le monde". On cible au laser.',
        goal: 'Créer les profils psychologiques exacts de vos clients.',
        focus: 'Empathie Radicale',
        objectives: 'Avoir 3 fiches personnages complètes pour guider tout le copywriting futur.',
        tasks: [
          {
            id: 'avatar-core',
            title: 'Avatar Principal (80% du CA)',
            importance: 'mandatory',
            description: 'Imaginez votre client idéal. Celui avec qui c\'est un plaisir de travailler et qui paye cher.',
            specificInputs: [
              { id: 'name', label: 'Nom & Âge', type: 'text', placeholder: 'Ex: Jean, 32 ans' },
              { id: 'job', label: 'Profession', type: 'text', placeholder: 'Ex: Cadre Commercial' },
              { id: 'pain', label: 'Douleur N°1 (Nuit blanche)', type: 'textarea', placeholder: 'Qu\'est-ce qui l\'empêche de dormir ?' },
              { id: 'desire', label: 'Désir N°1 (Magique)', type: 'textarea', placeholder: 'Si vous aviez une baguette magique, que voudrait-il ?' },
              { id: 'objection', label: 'Objection Principale', type: 'text', placeholder: 'Pourquoi il n\'a pas déjà acheté ?' }
            ],
            mediaType: 'text',
            mediaContent: 'Soyez précis. "Homme 30 ans" est nul. "Jean, 32 ans, cadre fatigué qui veut quitter la rat race mais a peur pour sa sécurité financière" est excellent.'
          },
          {
            id: 'avatar-secondary',
            title: 'Avatar Secondaire',
            importance: 'recommended',
            description: 'Un profil différent qui achète aussi, mais pour des raisons différentes.',
            specificInputs: [
              { id: 'name', label: 'Nom', type: 'text', placeholder: 'Ex: Sophie' },
              { id: 'diff', label: 'Différence majeure', type: 'textarea', placeholder: 'Pourquoi est-elle différente de l\'avatar 1 ?' }
            ],
            mediaType: 'text'
          },
          {
            id: 'avatar-anti',
            title: 'Anti-Avatar (Qui refuser)',
            importance: 'optional',
            description: 'Qui ne voulez-vous SURTOUT PAS attirer ? (Clients à problèmes, pas de budget...)',
            placeholder: 'Profil à bannir :',
            mediaType: 'text'
          }
        ]
      },
      {
        id: 'offer-ecosystem',
        title: '2. Architecture de l\'Offre',
        description: 'Ne vendez pas un produit, vendez un écosystème complet.',
        goal: 'Maximiser la LTV (Lifetime Value) par client.',
        focus: 'Maximisation du Panier Moyen',
        objectives: 'Définir les 4 piliers de monétisation.',
        tasks: [
          {
            id: 'core-offer',
            title: 'The Core Offer (Offre Principale)',
            importance: 'mandatory',
            description: 'Votre produit phare. Celui qui résout le problème principal.',
            specificInputs: [
              { id: 'name', label: 'Nom de l\'offre', type: 'text', placeholder: 'Ex: Transformation 90 Jours' },
              { id: 'price', label: 'Prix de vente', type: 'number', placeholder: '1000' },
              { id: 'promise', label: 'Promesse (One Big Promise)', type: 'textarea', placeholder: 'Ex: Perdez 10kg en 90 jours ou on vous rembourse.' },
              { id: 'deliverable', label: 'Livrable Concret', type: 'textarea', placeholder: 'Ex: 12 appels, Accès plateforme, Plan alimentaire...' }
            ],
            mediaType: 'text',
            mediaContent: 'L\'offre principale doit être "No-Brainer". La valeur perçue doit être 10x supérieure au prix.'
          },
          {
            id: 'upsell-offer',
            title: 'The Upsell (Accélérateur)',
            importance: 'recommended',
            description: 'Que pouvez-vous vendre immédiatement après l\'achat pour aider le client à aller plus vite ?',
            specificInputs: [
              { id: 'name', label: 'Nom de l\'Upsell', type: 'text', placeholder: 'Ex: VIP Day' },
              { id: 'price', label: 'Prix', type: 'number', placeholder: '500' }
            ],
            mediaType: 'text'
          },
          {
            id: 'downsell-offer',
            title: 'The Downsell (Filet de sécurité)',
            importance: 'recommended',
            description: 'S\'ils disent NON à l\'offre principale (trop cher), que leur proposez-vous ?',
            placeholder: 'Nom :\nPrix (Plus bas) :\nCe qu\'on enlève par rapport à l\'offre Core :',
            mediaType: 'text'
          },
          {
            id: 'continuity-offer',
            title: 'Continuity (Abonnement)',
            importance: 'optional',
            description: 'Comment générer du revenu récurrent mensuel (MRR) ?',
            placeholder: 'Nom :\nPrix / mois :\nValeur récurrente (Communauté, Logiciel, Coaching groupe) :',
            mediaType: 'text'
          }
        ]
      },
      {
        id: 'competitor-recon',
        title: '3. Espionnage Concurrentiel',
        description: 'Comprendre le marché pour mieux le dominer.',
        goal: 'Savoir exactement contre qui on se bat et comment se différencier.',
        focus: 'Analyse Froide',
        objectives: 'Mapper les 3 niveaux de concurrence.',
        tasks: [
          {
            id: 'comp-top-tier',
            title: 'Top Tier (Le "God Mode")',
            importance: 'mandatory',
            description: 'Le leader incontesté du marché (celui qui fait des millions).',
            specificInputs: [
              { id: 'name', label: 'Nom du concurrent', type: 'text', placeholder: '' },
              { id: 'url', label: 'Site Web / Funnel', type: 'text', placeholder: 'https://...' },
              { id: 'strength', label: 'Leur Super-Pouvoir', type: 'textarea', placeholder: 'Pourquoi sont-ils n°1 ?' },
              { id: 'weakness', label: 'Leur Faiblesse', type: 'textarea', placeholder: 'Que font-ils mal ?' }
            ],
            mediaType: 'text',
            mediaContent: 'Analysez leur funnel. Achetez leur produit si nécessaire. C\'est votre benchmark de qualité.'
          },
          {
            id: 'comp-mid-tier',
            title: 'Mid Tier (Le Challenger)',
            importance: 'mandatory',
            description: 'Celui qui est juste au-dessus de vous. Accessible mais inspirant.',
            placeholder: 'Nom :\nSite Web :\nAngle marketing utilisé :',
            mediaType: 'text'
          },
          {
            id: 'comp-peer-tier',
            title: 'Peer Tier (Le Niveau Actuel)',
            importance: 'mandatory',
            description: 'Vos concurrents directs actuels.',
            placeholder: 'Nom :\nSite Web :\nPourquoi vous êtes meilleur :',
            mediaType: 'text'
          },
          {
            id: 'comp-extra',
            title: 'Concurrents Bonus',
            importance: 'optional',
            description: 'Ajoutez ici 1 ou 2 autres concurrents pertinents.',
            placeholder: 'Concurrent Extra 1 :\nConcurrent Extra 2 :',
            mediaType: 'text'
          }
        ]
      },
      {
        id: 'lead-magnet-def',
        title: '4. Lead Magnet (L\'Aimant)',
        description: 'L\'entrée de votre tunnel. De la valeur gratuite contre un contact.',
        goal: 'Transformer un inconnu en prospect qualifié.',
        focus: 'Valeur Perçue Immédiate',
        objectives: 'Définir un Lead Magnet qui résout un problème spécifique rapidement.',
        tasks: [
          // 3 Mandatories (Core)
          {
            id: 'lm-core-1',
            title: 'LM #1 : Le Concept Principal',
            importance: 'mandatory',
            description: 'Votre idée principale pour attirer des leads qualifiés.',
            specificInputs: [
              { id: 'title', label: 'Titre Accrocheur', type: 'text', placeholder: 'Ex: 7 Étapes pour...' },
              { id: 'format', label: 'Format', type: 'select', options: ['PDF/Ebook', 'Vidéo Training', 'Template/Outil', 'Webinar'], placeholder: 'Choisir...' },
              { id: 'promise', label: 'Promesse', type: 'text', placeholder: 'Résultat en X temps' }
            ],
            mediaType: 'text'
          },
          {
            id: 'lm-core-delivery',
            title: 'LM #1 : Livraison',
            importance: 'mandatory',
            description: 'Comment le prospect reçoit-il ce cadeau ?',
            placeholder: 'Ex: Email automatique + Lien Notion',
            mediaType: 'text'
          },
          {
            id: 'lm-core-cta',
            title: 'LM #1 : Le "Next Step"',
            importance: 'mandatory',
            description: 'Une fois qu\'ils ont consommé le gratuit, que doivent-ils faire ?',
            placeholder: 'Ex: Réserver un appel, Acheter l\'offre à 27€...',
            mediaType: 'text'
          },

          // 2 Recommended (Expansion)
          {
            id: 'lm-rec-2',
            title: 'LM #2 : Variation (Angle différent)',
            importance: 'recommended',
            description: 'Une alternative pour ceux qui n\'ont pas cliqué sur le premier.',
            placeholder: 'Titre :\nFormat :',
            mediaType: 'text'
          },
          {
            id: 'lm-rec-quiz',
            title: 'LM #3 : Format Quiz',
            importance: 'recommended',
            description: 'Les quiz convertissent souvent mieux. Pouvez-vous en créer un ?',
            placeholder: 'Idée de Quiz :',
            mediaType: 'text'
          },

          // 5 Optionals (Bonus)
          { id: 'lm-opt-4', title: 'LM Bonus : Checklist', importance: 'optional', description: 'Idée rapide.', placeholder: '...' },
          { id: 'lm-opt-5', title: 'LM Bonus : Swipe File', importance: 'optional', description: 'Idée rapide.', placeholder: '...' },
          { id: 'lm-opt-6', title: 'LM Bonus : Étude de Cas', importance: 'optional', description: 'Idée rapide.', placeholder: '...' },
          { id: 'lm-opt-7', title: 'LM Bonus : Mini-Cours', importance: 'optional', description: 'Idée rapide.', placeholder: '...' },
          { id: 'lm-opt-8', title: 'LM Bonus : Tool/Calc', importance: 'optional', description: 'Idée rapide.', placeholder: '...' },
        ]
      },
      {
        id: 'biz-model-map',
        title: '5. Business Model & Journey',
        description: 'Visualiser le chemin de l\'argent.',
        goal: 'Avoir une clarté totale sur le parcours client.',
        focus: 'Fluidité',
        objectives: 'Tracer la ligne droite entre "Inconnu" et "Ambassadeur".',
        tasks: [
          {
            id: 'customer-journey',
            title: 'Le Parcours Client (Map)',
            importance: 'mandatory',
            description: 'Décrivez les étapes chronologiques.',
            placeholder: '1. Voit une pub (Source)\n2. Clique et donne son email (Lead Magnet)\n3. Reçoit une offre (Core)\n4. ...',
            mediaType: 'text',
            mediaContent: 'Plus le parcours est simple, plus il est scalable.'
          }
        ]
      },
      {
        id: 'offer-science-tool',
        title: '6. Offer Science (Optimisation)',
        description: 'Utilisation des outils avancés pour valider mathématiquement l\'offre.',
        goal: 'Ne pas deviner, savoir.',
        focus: 'Data-Driven',
        objectives: 'Connecter et configurer Offer Science.',
        tasks: [
          {
            id: 'os-setup',
            title: 'Configuration Offer Science',
            importance: 'optional',
            description: 'Si vous avez accès à l\'outil Offer Science, configurez votre offre dessus pour obtenir un score de viabilité.',
            placeholder: 'Score obtenu :\nLien du rapport :',
            mediaType: 'text',
            mediaContent: 'Cet outil permet de stress-tester votre pricing et vos garanties avant le lancement.'
          }
        ]
      }
    ],
    optimizationTips: [
      'Offrir plus (en quantité, en qualité)',
      'Ajouter du Trust (Preuve sociale, autorité)',
      'Être plus clair sur la promesse (Simplifier)',
      'Offrir mieux, changer l’angle d\'attaque'
    ],
    focus: 'Désir profond du client',
    objectives: 'Résoudre le problème N°1 immédiat avec une valeur perçue maximale.',
    usefulInfo: 'Le problème numéro un est considéré comme le problème le plus facile à résoudre, et qui apporte le plus de valeur pour nos clients potentiels.',
    iconName: 'Target',
    type: 'execution'
  },
  {
    id: 'contenu',
    title: 'Acquisition',
    subtitle: 'Module 2',
    unlockCode: import.meta.env.VITE_CODE_CONTENU || 'SCALE',
    goal: 'Produire les 15-30 premières créatives de test.',
    strategies: [
      'Produire les scripts',
      'Lancer le tournage/création',
      'Monter les vidéos (ou déléguer)',
      'Lancer les campagnes Publicitaires'
    ],
    subModules: [
      {
        id: 'creative-strategy',
        title: 'Stratégie Créative',
        description: 'Planification des angles d\'attaque.',
        goal: 'Structurer les messages publicitaires avant la production.',
        focus: 'Créativité & Hooks',
        objectives: 'Avoir 3 à 5 angles d\'attaque prêts à être scriptés.',
        tasks: [
          {
            id: 'select-angles',
            title: 'Sélectionner 3 Angles',
            importance: 'mandatory',
            description: 'Exemple : Angle Logique, Angle Émotionnel, Angle Preuve Sociale.',
            placeholder: '1. Us vs Them\n2. Founder Story\n3. Problem/Solution',
            mediaType: 'text',
            mediaContent: 'Utilisez les Personas définis dans le Module 1. Quel angle parle au Persona "Marcus" ? (Probablement l\'angle ROI/Gain de temps).'
          },
          {
            id: 'hooks-brainstorm',
            title: 'Brainstorming Hooks (10)',
            importance: 'mandatory',
            description: 'Les 3 premières secondes. Écrivez 10 variations.',
            placeholder: '1. Arrêtez de faire ça...\n2. Voici comment j\'ai...',
            mediaType: 'text',
            mediaContent: 'Le Hook est responsable de 80% de la performance de la vidéo.'
          }
        ]
      }
    ],
    optimizationTips: [
      'Changer les Hooks, le Core, le CTA',
      'Créer une nouvelle creative similaire au Winner',
      'Changer le format (Vidéo, Carrousel, Photo)',
      'Changer le Type (UGC, Problème-Solution, Founder VSL, Social Proof, Us vs Them)'
    ],
    focus: 'Capturer l’attention, activer l’intérêt et trouver l’avatar client (ICP)',
    objectives: 'Les faire cliquer sur le CTA (Call to Action).',
    usefulInfo: 'Le contenu que j’explique sous forme de créative seront des éléments qui seront utilisés pour faire la promotion et la communication de l’offre. Une créative peut prendre la forme d’une photo d’un carrousel ou d’une vidéo sous différents formats avec différents types de Concept.',
    iconName: 'Megaphone',
    type: 'execution'
  },
  {
    id: 'frontend',
    title: 'Conversion',
    subtitle: 'Module 3',
    unlockCode: import.meta.env.VITE_CODE_FRONTEND || 'FUNNEL',
    goal: 'Créer la première version du SaaS / Funnel.',
    strategies: [
      'Créer la première version du SaaS/Page',
      'Configurer le tracking de base',
      'Connecter le processeur de paiement',
    ],
    subModules: [],
    optimizationTips: [
      'Changer le contenu (offre, texte, headlines)',
      'Changer l’ordre des pages ou des sections',
      'Ajuster le pixel ou le tracking système',
      'Ajouter ou enlever des nouvelles pages (VSL, Upsell)'
    ],
    focus: 'Obtenir des résultats précis et mesurables.',
    objectives: 'Simplifier ou complexifier le funnel en fonction des résultats data.',
    usefulInfo: 'C\'est le moteur de conversion. Il doit être fluide. La moindre friction coûte de l\'argent. Testez tout sur mobile en priorité.',
    iconName: 'Layout',
    type: 'execution'
  },
  {
    id: 'backend',
    title: 'Rétention',
    subtitle: 'Module 4',
    unlockCode: import.meta.env.VITE_CODE_BACKEND || 'LIFETIME',
    goal: 'Avoir une première version du Business Model qui marche.',
    strategies: [
      'Configurer les emails de bienvenue',
      'Mettre en place le CRM',
      'Définir le processus de vente (Sales)',
    ],
    subModules: [],
    optimizationTips: [
      'Changer les KPI ou l’élément de tracking principal',
      'Améliorer la vitesse de prise de contact (Speed to lead)',
      'Améliorer ou Changer les automations (ordre, contenu)',
      'Changer le produit ou l’offre suivante (Backend)'
    ],
    focus: 'Avoir un Customer Journey Claire (Prob 1 -> Prob 2 -> Prob 3).',
    objectives: 'Avoir un système de tracking au point et effectuer des prises de décision en fonction des data.',
    usefulInfo: 'Le backend est là où la marge se crée. Un client acquis doit être monétisé sur le long terme via des solutions aux problèmes suivants.',
    iconName: 'Repeat',
    type: 'execution'
  },
];

export const DEFAULT_BRANDING: BrandingAsset[] = [
  { id: '1', name: 'Couleur Principale', value: '#000000', type: 'color' },
  { id: '3', name: 'Police Principale', value: 'Inter', type: 'text' },
];

export const DEFAULT_CLIENT_DATA: any = {
  clientName: 'Nouveau Projet',
  clientDomain: '',
  identity: {
    version: 'V1',
    mission: '',
    targetAudienceSummary: '',
    selectedDomainPrefix: 'go'
  },
  objectives: {
    smartGoal: '',
    deadline: '',
    currentSituation: '',
    motivation: ''
  },
  brandVoice: {
    tone: '',
    archetype: '',
    vocabulary: '',
    forbidden: ''
  },
  unlockedPhases: ['identity'],
  activePhaseId: 'identity',
  completedItems: [],
  userInputs: {},
  branding: DEFAULT_BRANDING
};