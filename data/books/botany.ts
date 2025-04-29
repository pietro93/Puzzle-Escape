import type { Book } from "@/components/murder-mystery/types"

export const botanyBook: Book = {
  title: "Plant Identification Manual",
  sections: [
    {
      id: "poisonous-plants",
      title: "Poisonous Plants",
      pages: [
        {
          title: "Deadly Nightshade (Atropa belladonna)",
          text: "<b>Classification:</b> Highly toxic perennial herb in the Solanaceae family.\n\n<b>Toxicity:</b> Contains atropine and scopolamine. Causes hallucinations, delirium, paralysis, and death. Symptoms include dilated pupils, blurred vision, and seizures.\n\n<b>Habitat:</b> Woodland edges and disturbed areas in Europe, North Africa, and Western Asia.",
        },
        {
          title: "Hemlock (Conium maculatum)",
          text: "<b>Classification:</b> Poisonous biennial herb in the Apiaceae family.\n\n<b>Toxicity:</b> Contains coniine alkaloids causing paralysis and respiratory failure. Symptoms progress from muscle weakness to paralysis and death.\n\n<b>Habitat:</b> Damp areas along streams and ditches in Europe and North Africa.",
        },
        {
          title: "Monkshood (Aconitum)",
          text: "<b>Classification:</b> Poisonous perennial in the Ranunculaceae family.\n\n<b>Toxicity:</b> Contains aconitine, a potent neurotoxin and cardiotoxin. Causes nausea, numbness, cardiac arrhythmias, and respiratory paralysis.\n\n<b>Habitat:</b> Mountain meadows and forests in the Northern Hemisphere.",
        },
        {
          title: "Castor Bean (Ricinus communis)",
          text: "<b>Classification:</b> Flowering plant in the Euphorbiaceae family.\n\n<b>Toxicity:</b> Seeds contain ricin, inhibiting protein synthesis. Causes nausea, vomiting, dehydration, seizures, and organ failure.\n\n<b>Habitat:</b> Native to Mediterranean Basin, East Africa, and India. Naturalized in tropical regions.",
        },
        {
          title: "Oleander (Nerium oleander)",
          text: "<b>Classification:</b> Poisonous evergreen shrub in the Apocynaceae family.\n\n<b>Toxicity:</b> Contains cardiac glycosides affecting heart function. Causes nausea, abdominal pain, dizziness, irregular heartbeat, and seizures.\n\n<b>Habitat:</b> Mediterranean region and Asia, commonly planted as an ornamental.",
        },
        {
          title: "Foxglove (Digitalis purpurea)",
          text: "<b>Classification:</b> Biennial herb in the Plantaginaceae family.\n\n<b>Toxicity:</b> Contains cardiac glycosides like digoxin. Causes nausea, confusion, irregular heartbeat, and visual disturbances.\n\n<b>Habitat:</b> Woodland edges, gardens, and disturbed areas in Europe.",
        },
      ],
    },
    {
      id: "trees",
      title: "Trees",
      pages: [
        {
          title: "African Baobab (Adansonia digitata)",
          text: "<b>Classification:</b> Deciduous tree in the Malvaceae family.\n\n<b>Habitat:</b> Semi-arid regions of sub-Saharan Africa, particularly in savanna ecosystems.",
          imageUrl: "/images/murder-mystery/books/botany/baobab-tree.webp",
          imageStyle: { width: "250px", height: "250px", objectFit: "contain" },
        },
        {
          title: "Japanese Flowering Cherry (Prunus serrulata)",
          text: "<b>Classification:</b> Ornamental flowering tree in the Rosaceae family.\n\n<b>Habitat:</b> Native to Japan, Korea, and China, now cultivated worldwide for its spectacular spring blossoms.",
          imageUrl: "/images/murder-mystery/books/botany/cherry-tree.webp",
          imageStyle: { width: "250px", height: "250px", objectFit: "contain" },
        },
        {
          title: "Sugar Maple (Acer saccharum)",
          text: "<b>Classification:</b> Deciduous tree in the Sapindaceae family.\n\n<b>Habitat:</b> Native to the northeastern United States and southeastern Canada, thriving in cool, moist climates with well-drained soils.",
          imageUrl: "/images/murder-mystery/books/botany/maple-tree.webp",
          imageStyle: { width: "250px", height: "250px", objectFit: "contain" },
        },
        {
          title: "Moreton Bay Fig (Ficus macrophylla)",
          text: "<b>Classification:</b> Evergreen tree in the Moraceae family.\n\n<b>Habitat:</b> Native to eastern Australia, particularly rainforest environments.",
          imageUrl: "/images/murder-mystery/books/botany/moreton-bay-fig-tree.webp",
          imageStyle: { width: "250px", height: "250px", objectFit: "contain" },
        },
        {
          title: "English Oak (Quercus robur)",
          text: "<b>Classification:</b> Deciduous tree in the Fagaceae family.\n\n<b>Habitat:</b> Native to most of Europe, extending to the Caucasus Mountains and North Africa, preferring lowland forests with rich, deep soils.",
          imageUrl: "/images/murder-mystery/books/botany/oak-tree.webp",
          imageStyle: { width: "250px", height: "250px", objectFit: "contain" },
        },
        {
          title: "Canary Island Date Palm (Phoenix canariensis)",
          text: "<b>Classification:</b> Flowering plant in the Arecaceae family.\n\n<b>Habitat:</b> Native to the Canary Islands, now widely cultivated in Mediterranean and subtropical climates worldwide.",
          imageUrl: "/images/murder-mystery/books/botany/palm-tree.webp",
          imageStyle: { width: "250px", height: "250px", objectFit: "contain" },
        },
        {
          title: "Ponderosa Pine (Pinus ponderosa)",
          text: "<b>Classification:</b> Evergreen coniferous tree in the Pinaceae family.\n\n<b>Habitat:</b> Native to mountain regions of western North America, from British Columbia to Mexico, thriving at elevations between 1,800 and 2,600 meters.",
          imageUrl: "/images/murder-mystery/books/botany/pine-tree.webp",
          imageStyle: { width: "250px", height: "250px", objectFit: "contain" },
        },
        {
          title: "Socotra Dragon Tree (Dracaena cinnabari)",
          text: "<b>Classification:</b> Flowering plant in the Asparagaceae family.\n\n<b>Habitat:</b> Endemic to the Socotra archipelago, part of Yemen.",
          imageUrl: "/images/murder-mystery/books/botany/socotra-tree.webp",
          imageStyle: { width: "250px", height: "250px", objectFit: "contain" },
        },
        {
          title: "Weeping Willow (Salix babylonica)",
          text: "<b>Classification:</b> Deciduous tree in the Salicaceae family.\n\n<b>Habitat:</b> Native to dry areas of northern China, now widely cultivated near water bodies throughout temperate regions worldwide.",
          imageUrl: "/images/murder-mystery/books/botany/willow-tree.webp",
          imageStyle: { width: "250px", height: "250px", objectFit: "contain" },
        },
        {
          title: "Yew (Taxus baccata)",
          text: "<b>Classification:</b> Coniferous trees and shrubs in the Taxaceae family.\n\n<b>Habitat:</b> Temperate regions of Europe, Asia, North Africa, and North America.",
          imageUrl: "/images/murder-mystery/books/botany/yew-tree.webp",
          imageStyle: { width: "250px", height: "250px", objectFit: "contain" },
        },
      ],
    },
    {
      id: "mushrooms",
      title: "Mushrooms",
      pages: [
        {
          title: "Death Cap (Amanita phalloides)",
          text: "<b>Classification:</b> Deadly poisonous mushroom in the Amanitaceae family.\n\n<b>Toxicity:</b> Contains amatoxins causing liver and kidney failure. Symptoms appear 6-24 hours after ingestion, including severe pain followed by organ failure.\n\n<b>Habitat:</b> Woodlands with oak and broadleaf trees in Europe, Asia, and North America.",
        },
        {
          title: "Destroying Angel (Amanita bisporigera)",
          text: "<b>Classification:</b> Deadly poisonous mushroom in the Amanitaceae family.\n\n<b>Toxicity:</b> Contains amatoxins causing liver and kidney failure. Mortality rate exceeds 50% even with treatment.\n\n<b>Habitat:</b> Hardwood and mixed forests in eastern North America, forming relationships with oak trees.",
        },
        {
          title: "Chanterelle (Cantharellus cibarius)",
          text: "<b>Classification:</b> Edible mushroom in the Cantharellaceae family.\n\n<b>Habitat:</b> Coniferous and deciduous forests throughout Europe, North America, and Asia, forming relationships with trees.",
        },
        {
          title: "Fly Agaric (Amanita muscaria)",
          text: "<b>Classification:</b> Psychoactive mushroom in the Amanitaceae family.\n\n<b>Toxicity:</b> Contains ibotenic acid and muscimol, causing hallucinations, confusion, and gastrointestinal upset.\n\n<b>Habitat:</b> Forms relationships with pine, spruce, and birch trees in temperate regions worldwide.",
        },
        {
          title: "Morel (Morchella)",
          text: "<b>Classification:</b> Edible mushroom in the Morchellaceae family.\n\n<b>Habitat:</b> Appears in spring, particularly after forest fires or in disturbed ground. Found in deciduous forests across North America, Europe, and Asia.",
        },
        {
          title: "Psilocybe Mushrooms (Psilocybe)",
          text: "<b>Classification:</b> Psychedelic mushrooms in the Hymenogastraceae family.\n\n<b>Effects:</b> Contain psilocybin and psilocin, causing altered perceptions, visual hallucinations, and euphoria.\n\n<b>Habitat:</b> Various species grow in different habitats worldwide, including grasslands, forests, and dung.",
        },
      ],
    },
  ],
}
