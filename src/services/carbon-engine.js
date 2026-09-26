import { EMISSION_FACTORS } from '../data/emission-factors.js';
import { DEMO_SCENARIOS } from '../data/demo-scenarios.js';

export function estimateFromItems(items, category) {
  let total = 0;
  // Fallback simple estimation if no exact matches
  items.forEach(item => {
    const match = EMISSION_FACTORS.find(ef => ef.name.toLowerCase().includes(item.toLowerCase()));
    if (match) {
      total += match.co2eKg;
    } else {
      total += category === 'meal' ? 1.0 : 0.5; // default fallbacks
    }
  });
  return total;
}

export function estimateFromSliders(state) {
  // state: { diet: 0-100, transport: 0-100, ac: 2-10, foodDelivery: 0-30 }
  
  // Diet: Veg = 15kg/mo, Non-veg = 45kg/mo
  const dietEmissions = 15 + ((state.diet / 100) * 30);
  
  // Transport: Metro = 8kg/mo, Car = 120kg/mo
  const transportEmissions = 8 + ((state.transport / 100) * 112);
  
  // AC: 2hrs = 20kg/mo, 10hrs = 100kg/mo (10kg per hour approx)
  const acEmissions = state.ac * 10;
  
  // Food Delivery: 0 = 0, 30 times = 60kg/mo (2kg per delivery)
  const deliveryEmissions = state.foodDelivery * 2;
  
  return parseFloat((dietEmissions + transportEmissions + acEmissions + deliveryEmissions).toFixed(1));
}

export function getGrade(co2eKg, category) {
  const thresholds = {
    meal: { A: 1, B: 2, C: 4, D: 6 },
    grocery: { A: 2, B: 4, C: 8, D: 15 },
    transport: { A: 1, B: 3, C: 6, D: 10 },
    energy: { A: 10, B: 30, C: 80, D: 150 },
    default: { A: 5, B: 15, C: 30, D: 60 }
  };
  
  const t = thresholds[category] || thresholds.default;
  if (co2eKg <= t.A) return 'A';
  if (co2eKg <= t.B) return 'B';
  if (co2eKg <= t.C) return 'C';
  if (co2eKg <= t.D) return 'D';
  return 'E';
}

export function getTreeEquivalence(annualCo2eKg) {
  // A mature tree absorbs ~21kg CO2 per year
  const trees = annualCo2eKg / 21;
  return `${trees.toFixed(1)} trees needed to offset annually`;
}

export function getRupeeEquivalent(co2eKg) {
  // Social cost of carbon roughly estimated for Indian context (~₹15 per kg CO2e)
  const cost = Math.round(co2eKg * 15);
  return `Environmental cost: ~₹${cost}`;
}

export function getCategoryAverage(scanType) {
  // Normalize scanType to EMISSION_FACTORS category keys
  const categoryKey = (scanType === 'electricity_bill' || scanType === 'utility_bill')
    ? 'energy'
    : (scanType === 'receipt')
      ? 'shopping'
      : (scanType || 'meal');

  const matchingFactors = EMISSION_FACTORS.filter(f => f.category === categoryKey);
  if (matchingFactors.length === 0) {
    const allSum = EMISSION_FACTORS.reduce((sum, f) => sum + f.co2eKg, 0);
    return parseFloat((allSum / EMISSION_FACTORS.length).toFixed(2));
  }
  const sum = matchingFactors.reduce((acc, f) => acc + f.co2eKg, 0);
  return parseFloat((sum / matchingFactors.length).toFixed(2));
}

export function getFallbackResult(scanType) {
  // Compute category average programmatically directly from EMISSION_FACTORS table
  const categoryAvg = getCategoryAverage(scanType);

  const categoryMetadata = {
    meal: {
      title: 'Standard Composite Meal',
      items: ['Vegetarian / Non-Vegetarian Food Portions'],
      story: `Estimated programmatically from the average of ${EMISSION_FACTORS.filter(f => f.category === 'meal').length} meal emission factors in the database.`,
      recommendation: 'Incorporate seasonal local vegetables and unpolished grains to further reduce meal footprint by ~15%.',
      savings: '₹20 - ₹40'
    },
    grocery: {
      title: 'Standard Grocery Basket',
      items: ['Pantry Staples & Produce Basket'],
      story: `Estimated programmatically from the average of ${EMISSION_FACTORS.filter(f => f.category === 'grocery').length} grocery factors in the database.`,
      recommendation: 'Favor loose seasonal produce over plastic-wrapped imported goods to minimize transport and packaging footprint.',
      savings: '₹50 - ₹100'
    },
    receipt: {
      title: 'Retail Store Receipt',
      items: ['Consumer Retail Items'],
      story: `Estimated programmatically from the average of ${EMISSION_FACTORS.filter(f => f.category === 'shopping').length} consumer goods factors in the database.`,
      recommendation: 'Opt for refill packs and concentrated formulas where available.',
      savings: '₹30 - ₹60'
    },
    electricity_bill: {
      title: 'Residential Electricity Bill',
      items: ['Domestic Power Usage'],
      story: 'Estimated programmatically from domestic energy factors in the database (~0.82 kg CO2e per kWh tier).',
      recommendation: 'Raise AC thermostat setting by 2°C (e.g. 24°C to 26°C) to cut monthly refrigeration load by up to 12%.',
      savings: '₹250 - ₹450'
    },
    utility_bill: {
      title: 'Domestic Utility Bill',
      items: ['Municipal Utility Services'],
      story: 'Estimated programmatically from utility energy and water factors in the database.',
      recommendation: 'Install low-flow aerators on kitchen and bathroom taps to reduce heated water volume.',
      savings: '₹80 - ₹150'
    },
    default: {
      title: 'General Consumer Item',
      items: ['Standard Consumer Footprint'],
      story: `Derived from the programmatic mean across all ${EMISSION_FACTORS.length} emission factors in the database.`,
      recommendation: 'Prioritize durable goods with modular repairability over single-cycle alternatives.',
      savings: '₹50'
    }
  };

  const config = categoryMetadata[scanType] || categoryMetadata.default;
  const grade = getGrade(categoryAvg, scanType || 'default');
  const annualKg = categoryAvg * 365;

  return {
    isOfflineEstimate: true,
    notice: 'Offline estimate — lower confidence, based on programmatic category averages',
    inputType: scanType || 'default',
    title: config.title,
    detectedItems: config.items,
    estimatedCarbonKg: categoryAvg,
    carbonGrade: grade,
    confidence: 0.35, // Honestly reflect offline heuristic confidence, not 90%+
    recommendation: config.recommendation,
    carbonStory: config.story,
    futureImpact: `If repeated daily, this lifestyle component represents approximately ${(categoryAvg * 30).toFixed(1)} kg CO₂e monthly.`,
    treeEquivalence: getTreeEquivalence(annualKg),
    rupeeEquivalent: `Environmental cost: ~₹${Math.round(categoryAvg * 15)} (estimated savings: ${config.savings})`
  };
}

export function generateLocalFutures(state) {
  // Diet: 0-100 (Veg to NonVeg)
  // Transport: 0-100 (Metro to Car)
  // AC: 0-12 hrs
  // Delivery: 0-30 times
  
  const diet = state.diet ?? 50;
  const transport = state.transport ?? 50;
  const ac = state.ac ?? 4;
  const foodDelivery = state.foodDelivery ?? 5;

  const isHighImpact = (diet > 70) || (transport > 70) || (ac > 7) || (foodDelivery > 15);
  const isLowImpact = (diet < 30) && (transport < 30) && (ac < 4) && (foodDelivery < 5);

  // Dynamic Letter from 2050 builder
  let letterIntro = "Dear Past Self, looking back from 2050, your choices shaped our daily lives. ";
  
  let letterDiet = "";
  if (diet < 30) {
    letterDiet = "Because you embraced a plant-forward diet, our city's agriculture is centered around lush community gardens and clean air. ";
  } else if (diet > 70) {
    letterDiet = "The high demand for meat resources ultimately forced massive land-clearing for feedlots outside the city. ";
  } else {
    letterDiet = "Your balanced food choices kept resources steady, though food distribution systems remained under constant demand. ";
  }

  let letterTransport = "";
  if (transport < 30) {
    letterTransport = "Opting for clean transport left us with wide pedestrian zones, clean skies, and rapid electric light rails. ";
  } else if (transport > 70) {
    letterTransport = "The persistent use of private conventional vehicles filled our skyline with a constant gray exhaust haze. ";
  } else {
    letterTransport = "The blend of personal cars and public transit kept gridlock manageable, but fossil fuel reliance continued. ";
  }

  let letterEnergy = "";
  if (ac > 7 || foodDelivery > 15) {
    letterEnergy = "Heavy air conditioning and constant shipping deliveries overloaded our grids and created mountains of packaging waste. ";
  } else if (ac < 4 && foodDelivery < 5) {
    letterEnergy = "Your low-energy cooling and local shopping habits kept municipal grids clear and plastic waste nearly non-existent. ";
  } else {
    letterEnergy = "Moderate home cooling and regular drone shipping created a steady, average demand on our public services. ";
  }

  let letterConclusion = "Every decision you made had a direct impact. Thank you for your efforts.";
  if (isHighImpact) {
    letterConclusion = "I only wish we had transitioned to sustainable practices much sooner.";
  }

  const letter = `${letterIntro}${letterDiet}${letterTransport}${letterEnergy}${letterConclusion}`;

  // Dynamic City Impact Scale builder
  let cityImpactIntro = "";
  if (isLowImpact) {
    cityImpactIntro = "If everyone lived like you, the city would become a global champion of ecological restoration. ";
  } else if (isHighImpact) {
    cityImpactIntro = "If everyone lived like you, the city would face extreme gridlock and severe resource shortages. ";
  } else {
    cityImpactIntro = "If everyone lived like you, the city would maintain a stable but high-stress ecological balance. ";
  }

  let cityImpactDiet = "";
  if (diet < 30) {
    cityImpactDiet = "Neighborhood green roofs would replace asphalt, lowering urban heat. ";
  } else if (diet > 70) {
    cityImpactDiet = "Massive food processing factories would dominate industrial zones. ";
  } else {
    cityImpactDiet = "Urban markets would remain active but rely heavily on external farming imports. ";
  }

  let cityImpactTransport = "";
  if (transport < 30) {
    cityImpactTransport = "Roadways would shrink in favor of parks, and pedestrian transit zones would flourish. ";
  } else if (transport > 70) {
    cityImpactTransport = "Two extra highway loops would be needed to handle the traffic, raising local temperatures. ";
  } else {
    cityImpactTransport = "Public transit systems would function well but struggle to offset remaining car emissions. ";
  }

  let cityImpactEnergy = "";
  if (ac > 7 || foodDelivery > 15) {
    cityImpactEnergy = "The power grids would require constant support from coal backups, and thousands of drones would congest low altitude skies.";
  } else if (ac < 4 && foodDelivery < 5) {
    cityImpactEnergy = "Local energy demands would drop by 45%, allowing the city to run purely on renewable solar and wind.";
  } else {
    cityImpactEnergy = "Standard energy infrastructure would continue to operate near peak capacity without reserves.";
  }

  const cityImpact = `${cityImpactIntro}${cityImpactDiet}${cityImpactTransport}${cityImpactEnergy}`;

  // Visual city style base
  let envBase = "";
  if (isLowImpact) {
    envBase = "A bright futuristic eco-utopia Indian city, clear blue skies, vertical gardens, sparkling rivers, sunbeams filtering through trees";
  } else if (isHighImpact) {
    envBase = "A dark, smoggy, polluted dystopian Indian city, thick grey clouds, smog-choked air, heavy industrial atmosphere";
  } else {
    envBase = "A modern transitioning Indian city, moderate sunny sky, some green parks mixed with standard urban infrastructure";
  }

  // Diet details
  let dietDetails = "";
  if (diet < 15) {
    dietDetails = "flourishing rooftop organic farms, lush vertical vegetable gardens, and bustling plant-based community markets";
  } else if (diet < 40) {
    dietDetails = "widespread urban green roofs with small community greenhouses and fresh food stalls";
  } else if (diet < 70) {
    dietDetails = "a blend of local produce markets, organic food shops, and typical urban street food hubs";
  } else if (diet < 85) {
    dietDetails = "busy urban food stalls serving heavily meat-centric dishes, with steam rising from local restaurants";
  } else {
    dietDetails = "industrial food processing complexes, massive packaging factories with smoke plumes, and large-scale feedlots on the city outskirts";
  }

  // Transport details
  let transportDetails = "";
  if (transport < 15) {
    transportDetails = "wide pedestrian boulevards filled with electric bicycles and solar-powered scooters, zero cars, and a sleek hyperloop terminal";
  } else if (transport < 40) {
    transportDetails = "elevated electric metro lines running above clean streets, wide bicycle lanes, and quiet electric commuter buses";
  } else if (transport < 70) {
    transportDetails = "urban avenues with a mix of hybrid vehicles, yellow electric auto-rickshaws, and busy sidewalks";
  } else if (transport < 85) {
    transportDetails = "highways cluttered with conventional fossil-fuel cars, some traffic congestion, and moderate exhaust haze";
  } else {
    transportDetails = "a massive multi-lane highway completely gridlocked with gas-guzzling SUVs and trucks emitting thick black exhaust fumes";
  }

  // AC details
  let acDetails = "";
  if (ac < 2) {
    acDetails = "smart biophilic buildings using passive natural wind ventilation ducts and fully covered in solar roof panels";
  } else if (ac < 5) {
    acDetails = "modern apartments equipped with smart window shading systems, green roofs, and localized solar arrays";
  } else if (ac < 8) {
    acDetails = "residential buildings with typical exterior window-mounted air conditioners and a few solar panels";
  } else {
    acDetails = "skyscrapers covered in giant industrial air conditioning cooling towers blasting hot air, visible thermal heat ripples in the atmosphere";
  }

  // Delivery details
  let deliveryDetails = "";
  if (foodDelivery < 3) {
    deliveryDetails = "residents cooking at home on solar-powered kitchens and walking to local neighborhood cafes";
  } else if (foodDelivery < 10) {
    deliveryDetails = "electric delivery bicycles gliding down streets to drop off packages in reusable containers";
  } else if (foodDelivery < 20) {
    deliveryDetails = "frequent delivery drones flying back and forth between building balconies and designated landing pads";
  } else {
    deliveryDetails = "a sky crowded and cluttered with thousands of commercial food delivery drones, and building walls covered in drone docking pods and plastic packaging waste";
  }

  // Combine into a single highly detailed prompt
  const imagePrompt = `${envBase}. Details: diet lifestyle showing ${dietDetails}, transport showing ${transportDetails}, buildings showing ${acDetails}, food logistics showing ${deliveryDetails}. Cinematic lighting, highly detailed, photorealistic, 8k resolution, architectural masterwork.`;

  const monthlyCo2 = estimateFromSliders(state);
  const trees = (monthlyCo2 * 12) / 21;

  return {
    futureLetter: letter,
    cityImpact: cityImpact,
    treeStat: `${trees.toFixed(1)} mature trees needed per year to absorb this lifestyle.`,
    imagePrompt: imagePrompt
  };
}
