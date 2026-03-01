export const neighborhoods = [
  // ──────────────────────────────────────────────
  // IRVINE — Family-oriented, safe, suburban
  // ──────────────────────────────────────────────
  {
    id: "irvine",
    name: "Irvine",
    coordinates: { lat: 33.6846, lng: -117.8265 },
    biography: "Irvine is a planned, master-designed community in Orange County known for its family-friendly atmosphere and exceptional safety. With highly-rated schools, pristine parks, and a commitment to sustainable urban planning, Irvine offers a secure suburban environment perfect for families. The city's thoughtful infrastructure supports both recreational and professional growth.",
    overallScore: 78,
    categories: [
      {
        label: "Sustainability",
        score: 72,
        factors: [
          {
            name: "Carbon Footprint",
            score: 68,
            confidence: 78,
            sources: [
              { name: "EPA Greenhouse Gas Reporting Program", weight: 0.4, value: 70, type: "measured" },
              { name: "CoolClimate Network Calculator", weight: 0.35, value: 69, type: "measured" },
              { name: "AI Per-Capita Emissions Estimate", weight: 0.25, value: 63, type: "estimated" },
            ],
            frames: {
              neutral: "Carbon Footprint: 68",
              positive: "Better than 62% of Orange County suburbs for per-capita carbon emissions",
              negative: "Falls behind 38% of comparable neighborhoods in carbon footprint reduction",
            },
          },
          {
            name: "Green Transit Score",
            score: 58,
            confidence: 76,
            sources: [
              { name: "OCTA Green Transit Assessment", weight: 0.4, value: 60, type: "measured" },
              { name: "EPA Smart Location Database", weight: 0.35, value: 59, type: "measured" },
              { name: "AI Green Commute Model", weight: 0.25, value: 53, type: "estimated" },
            ],
            frames: {
              neutral: "Green Transit Score: 58",
              positive: "Better than 50% of suburban communities for eco-friendly transit options",
              negative: "Falls behind 50% of comparable neighborhoods in green transportation access",
            },
          },
          {
            name: "Bike Infrastructure",
            score: 74,
            confidence: 82,
            sources: [
              { name: "PeopleForBikes City Ratings", weight: 0.4, value: 76, type: "measured" },
              { name: "City of Irvine Bike Master Plan Data", weight: 0.35, value: 75, type: "measured" },
              { name: "AI Cycling Safety & Access Model", weight: 0.25, value: 69, type: "estimated" },
            ],
            frames: {
              neutral: "Bike Infrastructure: 74",
              positive: "Better than 71% of Southern California suburbs for cycling infrastructure",
              negative: "Falls behind 29% of comparable neighborhoods in bike-friendliness",
            },
          },
          {
            name: "Renewable Energy",
            score: 70,
            confidence: 80,
            sources: [
              { name: "CA Energy Commission Local Data", weight: 0.4, value: 72, type: "measured" },
              { name: "EIA State Electricity Profiles", weight: 0.35, value: 71, type: "measured" },
              { name: "AI Solar Adoption Estimate", weight: 0.25, value: 65, type: "estimated" },
            ],
            frames: {
              neutral: "Renewable Energy: 70",
              positive: "Better than 64% of Orange County communities for renewable energy adoption",
              negative: "Falls behind 36% of comparable neighborhoods in clean energy transition",
            },
          },
          {
            name: "Green Space Coverage",
            score: 88,
            confidence: 90,
            sources: [
              { name: "Trust for Public Land ParkScore", weight: 0.4, value: 90, type: "measured" },
              { name: "USDA Urban Tree Canopy Assessment", weight: 0.35, value: 89, type: "measured" },
              { name: "AI Green Coverage Model", weight: 0.25, value: 83, type: "estimated" },
            ],
            frames: {
              neutral: "Green Space Coverage: 88",
              positive: "Better than 90% of Southern California neighborhoods for green space and tree canopy",
              negative: "Falls behind 10% of comparable neighborhoods in urban green coverage",
            },
          },
        ],
      },
      {
        label: "Livability",
        score: 81,
        factors: [
          {
            name: "Walkability",
            score: 54,
            confidence: 82,
            sources: [
              { name: "Walk Score Index", weight: 0.45, value: 56, type: "measured" },
              { name: "USDOT Pedestrian Infrastructure Survey", weight: 0.3, value: 58, type: "measured" },
              { name: "AI Pedestrian Activity Model", weight: 0.25, value: 46, type: "estimated" },
            ],
            frames: {
              neutral: "Walkability: 54",
              positive: "Better than 41% of Orange County suburbs for walkability",
              negative: "Falls behind 59% of comparable neighborhoods in pedestrian accessibility",
            },
          },
          {
            name: "Transit Access",
            score: 54,
            confidence: 75,
            sources: [
              { name: "OCTA Ridership Data", weight: 0.4, value: 57, type: "measured" },
              { name: "AllTransit Performance Score", weight: 0.35, value: 55, type: "measured" },
              { name: "AI Transit Connectivity Estimate", weight: 0.25, value: 48, type: "estimated" },
            ],
            frames: {
              neutral: "Transit Access: 54",
              positive: "Better than 48% of suburban communities for public transit options",
              negative: "Falls behind 52% of comparable neighborhoods in transit connectivity",
            },
          },
          {
            name: "Parks & Recreation",
            score: 91,
            confidence: 90,
            sources: [
              { name: "Trust for Public Land ParkScore", weight: 0.4, value: 93, type: "measured" },
              { name: "City of Irvine Parks Inventory", weight: 0.35, value: 92, type: "measured" },
              { name: "AI Green Space Coverage Model", weight: 0.25, value: 86, type: "estimated" },
            ],
            frames: {
              neutral: "Parks & Recreation: 91",
              positive: "Better than 94% of Southern California neighborhoods for park access and quality",
              negative: "Falls behind 6% of comparable neighborhoods in recreational amenities",
            },
          },
          {
            name: "Grocery & Essentials Access",
            score: 83,
            confidence: 88,
            sources: [
              { name: "USDA Food Access Research Atlas", weight: 0.4, value: 85, type: "measured" },
              { name: "Yelp Business Density Index", weight: 0.35, value: 84, type: "measured" },
              { name: "AI Essential Services Proximity Model", weight: 0.25, value: 78, type: "estimated" },
            ],
            frames: {
              neutral: "Grocery & Essentials Access: 83",
              positive: "Better than 79% of suburban neighborhoods for everyday shopping convenience",
              negative: "Falls behind 21% of comparable neighborhoods in essential services access",
            },
          },
        ],
      },
      {
        label: "Safety",
        score: 88,
        factors: [
          {
            name: "Violent Crime Rate",
            score: 92,
            confidence: 95,
            sources: [
              { name: "FBI UCR Crime Statistics", weight: 0.45, value: 94, type: "measured" },
              { name: "Irvine PD Annual Crime Report", weight: 0.35, value: 93, type: "measured" },
              { name: "AI Crime Trend Projection", weight: 0.2, value: 87, type: "estimated" },
            ],
            frames: {
              neutral: "Violent Crime Rate: 92",
              positive: "Better than 95% of U.S. cities of similar size for violent crime safety",
              negative: "Falls behind 5% of comparable neighborhoods in violent crime prevention",
            },
          },
          {
            name: "Property Crime Rate",
            score: 84,
            confidence: 93,
            sources: [
              { name: "FBI UCR Property Crime Data", weight: 0.4, value: 86, type: "measured" },
              { name: "Irvine PD Property Crime Reports", weight: 0.35, value: 85, type: "measured" },
              { name: "AI Property Crime Risk Model", weight: 0.25, value: 79, type: "estimated" },
            ],
            frames: {
              neutral: "Property Crime Rate: 84",
              positive: "Better than 82% of Southern California communities for property safety",
              negative: "Falls behind 18% of comparable neighborhoods in property crime prevention",
            },
          },
          {
            name: "Traffic Safety",
            score: 79,
            confidence: 85,
            sources: [
              { name: "NHTSA Fatality Analysis Reporting System", weight: 0.4, value: 81, type: "measured" },
              { name: "CA Office of Traffic Safety Rankings", weight: 0.35, value: 80, type: "measured" },
              { name: "AI Traffic Incident Density Model", weight: 0.25, value: 74, type: "estimated" },
            ],
            frames: {
              neutral: "Traffic Safety: 79",
              positive: "Better than 73% of mid-size California cities for traffic-related safety",
              negative: "Falls behind 27% of comparable neighborhoods in traffic safety outcomes",
            },
          },
          {
            name: "Emergency Response Time",
            score: 86,
            confidence: 88,
            sources: [
              { name: "NFPA Response Time Benchmarks", weight: 0.4, value: 88, type: "measured" },
              { name: "Irvine Fire & Rescue Dispatch Records", weight: 0.35, value: 87, type: "measured" },
              { name: "AI Emergency Coverage Gap Estimate", weight: 0.25, value: 81, type: "estimated" },
            ],
            frames: {
              neutral: "Emergency Response Time: 86",
              positive: "Better than 84% of suburban communities for emergency services response",
              negative: "Falls behind 16% of comparable neighborhoods in emergency response speed",
            },
          },
        ],
      },
      {
        label: "Community",
        score: 75,
        factors: [
          {
            name: "Family Friendliness",
            score: 92,
            confidence: 91,
            sources: [
              { name: "GreatSchools District Rating", weight: 0.4, value: 94, type: "measured" },
              { name: "Census ACS Family Household Data", weight: 0.35, value: 93, type: "measured" },
              { name: "AI Family Suitability Index", weight: 0.25, value: 87, type: "estimated" },
            ],
            frames: {
              neutral: "Family Friendliness: 92",
              positive: "Better than 96% of California communities for raising a family",
              negative: "Falls behind 4% of comparable neighborhoods in family-oriented amenities",
            },
          },
          {
            name: "Cultural Amenities",
            score: 62,
            confidence: 78,
            sources: [
              { name: "NEA Arts & Culture Survey", weight: 0.4, value: 64, type: "measured" },
              { name: "Yelp Cultural Venue Density", weight: 0.35, value: 63, type: "measured" },
              { name: "AI Cultural Vibrancy Estimate", weight: 0.25, value: 57, type: "estimated" },
            ],
            frames: {
              neutral: "Cultural Amenities: 62",
              positive: "Better than 55% of suburban communities for cultural offerings",
              negative: "Falls behind 45% of comparable neighborhoods in cultural richness and access",
            },
          },
          {
            name: "Diversity Index",
            score: 77,
            confidence: 92,
            sources: [
              { name: "Census ACS Diversity & Inclusion Index", weight: 0.45, value: 79, type: "measured" },
              { name: "USA Today Diversity Index", weight: 0.3, value: 78, type: "measured" },
              { name: "AI Demographic Diversity Model", weight: 0.25, value: 72, type: "estimated" },
            ],
            frames: {
              neutral: "Diversity Index: 77",
              positive: "Better than 72% of Orange County neighborhoods for demographic diversity",
              negative: "Falls behind 28% of comparable neighborhoods in community diversity",
            },
          },
          {
            name: "Nightlife & Entertainment",
            score: 45,
            confidence: 74,
            sources: [
              { name: "Yelp Nightlife Venue Index", weight: 0.4, value: 47, type: "measured" },
              { name: "Google Maps Late-Night POI Density", weight: 0.35, value: 46, type: "measured" },
              { name: "AI Entertainment Activity Estimate", weight: 0.25, value: 40, type: "estimated" },
            ],
            frames: {
              neutral: "Nightlife & Entertainment: 45",
              positive: "Better than 34% of suburban neighborhoods for evening entertainment",
              negative: "Falls behind 66% of comparable neighborhoods in nightlife and entertainment options",
            },
          },
        ],
      },
      {
        label: "Growth",
        score: 74,
        factors: [
          {
            name: "Job Market Strength",
            score: 82,
            confidence: 89,
            sources: [
              { name: "BLS Local Area Unemployment Statistics", weight: 0.4, value: 84, type: "measured" },
              { name: "Census LEHD Employment Data", weight: 0.35, value: 83, type: "measured" },
              { name: "AI Job Growth Trajectory Model", weight: 0.25, value: 77, type: "estimated" },
            ],
            frames: {
              neutral: "Job Market Strength: 82",
              positive: "Better than 78% of California metro areas for employment opportunity",
              negative: "Falls behind 22% of comparable neighborhoods in job market vitality",
            },
          },
          {
            name: "Property Value Trend",
            score: 71,
            confidence: 86,
            sources: [
              { name: "Zillow Home Value Index", weight: 0.4, value: 73, type: "measured" },
              { name: "CoreLogic Home Price Index", weight: 0.35, value: 72, type: "measured" },
              { name: "AI Property Appreciation Forecast", weight: 0.25, value: 66, type: "estimated" },
            ],
            frames: {
              neutral: "Property Value Trend: 71",
              positive: "Better than 64% of Southern California markets for property appreciation",
              negative: "Falls behind 36% of comparable neighborhoods in property value growth trajectory",
            },
          },
          {
            name: "New Development Pipeline",
            score: 68,
            confidence: 79,
            sources: [
              { name: "City of Irvine Permit Records", weight: 0.4, value: 70, type: "measured" },
              { name: "CoStar Commercial Development Tracker", weight: 0.35, value: 69, type: "measured" },
              { name: "AI Development Momentum Estimate", weight: 0.25, value: 63, type: "estimated" },
            ],
            frames: {
              neutral: "New Development Pipeline: 68",
              positive: "Better than 61% of Orange County cities for new construction activity",
              negative: "Falls behind 39% of comparable neighborhoods in development momentum",
            },
          },
          {
            name: "Rent Affordability",
            score: 58,
            confidence: 91,
            sources: [
              { name: "Census ACS Median Gross Rent", weight: 0.4, value: 60, type: "measured" },
              { name: "Apartment List Rent Estimates", weight: 0.35, value: 59, type: "measured" },
              { name: "AI Rent Burden Projection Model", weight: 0.25, value: 53, type: "estimated" },
            ],
            frames: {
              neutral: "Rent Affordability: 58",
              positive: "Better than 49% of Orange County neighborhoods for rental affordability",
              negative: "Falls behind 51% of comparable neighborhoods in rental cost accessibility",
            },
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // SANTA MONICA — Excellent livability, high growth, expensive
  // ──────────────────────────────────────────────
  {
    id: "santa-monica",
    name: "Santa Monica",
    coordinates: { lat: 34.0195, lng: -118.4912 },
    biography: "Santa Monica is a vibrant coastal community blending stunning beaches with an innovative tech and entertainment scene. Known for its progressive culture, excellent walkability, and world-class sustainability initiatives, Santa Monica attracts professionals and artists seeking a dynamic lifestyle. The city's commitment to environmental leadership and cultural amenities makes it a unique destination.",
    overallScore: 82,
    categories: [
      {
        label: "Sustainability",
        score: 81,
        factors: [
          {
            name: "Carbon Footprint",
            score: 78,
            confidence: 82,
            sources: [
              { name: "EPA Greenhouse Gas Reporting Program", weight: 0.4, value: 80, type: "measured" },
              { name: "CoolClimate Network Calculator", weight: 0.35, value: 79, type: "measured" },
              { name: "AI Per-Capita Emissions Estimate", weight: 0.25, value: 73, type: "estimated" },
            ],
            frames: {
              neutral: "Carbon Footprint: 78",
              positive: "Better than 74% of coastal California cities for per-capita carbon emissions",
              negative: "Falls behind 26% of comparable neighborhoods in carbon footprint reduction",
            },
          },
          {
            name: "Green Transit Score",
            score: 86,
            confidence: 88,
            sources: [
              { name: "LA Metro Green Transit Assessment", weight: 0.4, value: 88, type: "measured" },
              { name: "EPA Smart Location Database", weight: 0.35, value: 87, type: "measured" },
              { name: "AI Green Commute Model", weight: 0.25, value: 81, type: "estimated" },
            ],
            frames: {
              neutral: "Green Transit Score: 86",
              positive: "Better than 88% of LA Westside communities for eco-friendly transit options",
              negative: "Falls behind 12% of comparable neighborhoods in green transportation access",
            },
          },
          {
            name: "Bike Infrastructure",
            score: 84,
            confidence: 86,
            sources: [
              { name: "PeopleForBikes City Ratings", weight: 0.4, value: 86, type: "measured" },
              { name: "City of Santa Monica Bike Action Plan Data", weight: 0.35, value: 85, type: "measured" },
              { name: "AI Cycling Safety & Access Model", weight: 0.25, value: 79, type: "estimated" },
            ],
            frames: {
              neutral: "Bike Infrastructure: 84",
              positive: "Better than 85% of Southern California cities for cycling infrastructure and safety",
              negative: "Falls behind 15% of comparable neighborhoods in bike-friendliness",
            },
          },
          {
            name: "Renewable Energy",
            score: 79,
            confidence: 84,
            sources: [
              { name: "CA Energy Commission Local Data", weight: 0.4, value: 81, type: "measured" },
              { name: "EIA State Electricity Profiles", weight: 0.35, value: 80, type: "measured" },
              { name: "AI Solar Adoption Estimate", weight: 0.25, value: 74, type: "estimated" },
            ],
            frames: {
              neutral: "Renewable Energy: 79",
              positive: "Better than 76% of coastal California communities for renewable energy adoption",
              negative: "Falls behind 24% of comparable neighborhoods in clean energy transition",
            },
          },
          {
            name: "Green Space Coverage",
            score: 77,
            confidence: 85,
            sources: [
              { name: "Trust for Public Land ParkScore", weight: 0.4, value: 79, type: "measured" },
              { name: "USDA Urban Tree Canopy Assessment", weight: 0.35, value: 78, type: "measured" },
              { name: "AI Green Coverage Model", weight: 0.25, value: 72, type: "estimated" },
            ],
            frames: {
              neutral: "Green Space Coverage: 77",
              positive: "Better than 73% of urban coastal neighborhoods for green space and tree canopy",
              negative: "Falls behind 27% of comparable neighborhoods in urban green coverage",
            },
          },
        ],
      },
      {
        label: "Livability",
        score: 91,
        factors: [
          {
            name: "Walkability",
            score: 88,
            confidence: 93,
            sources: [
              { name: "Walk Score Index", weight: 0.45, value: 90, type: "measured" },
              { name: "USDOT Pedestrian Infrastructure Survey", weight: 0.3, value: 89, type: "measured" },
              { name: "AI Pedestrian Activity Model", weight: 0.25, value: 83, type: "estimated" },
            ],
            frames: {
              neutral: "Walkability: 88",
              positive: "Better than 91% of Los Angeles County neighborhoods for pedestrian friendliness",
              negative: "Falls behind 9% of comparable neighborhoods in walkability infrastructure",
            },
          },
          {
            name: "Transit Access",
            score: 82,
            confidence: 88,
            sources: [
              { name: "LA Metro Ridership & Coverage Data", weight: 0.4, value: 84, type: "measured" },
              { name: "AllTransit Performance Score", weight: 0.35, value: 83, type: "measured" },
              { name: "AI Transit Connectivity Estimate", weight: 0.25, value: 77, type: "estimated" },
            ],
            frames: {
              neutral: "Transit Access: 82",
              positive: "Better than 85% of LA Westside communities for public transit connectivity",
              negative: "Falls behind 15% of comparable neighborhoods in transit service quality",
            },
          },
          {
            name: "Parks & Recreation",
            score: 89,
            confidence: 91,
            sources: [
              { name: "Trust for Public Land ParkScore", weight: 0.4, value: 91, type: "measured" },
              { name: "Santa Monica Recreation & Parks Inventory", weight: 0.35, value: 90, type: "measured" },
              { name: "AI Green Space Coverage Model", weight: 0.25, value: 84, type: "estimated" },
            ],
            frames: {
              neutral: "Parks & Recreation: 89",
              positive: "Better than 92% of coastal California cities for park access and outdoor recreation",
              negative: "Falls behind 8% of comparable neighborhoods in recreational space availability",
            },
          },
          {
            name: "Grocery & Essentials Access",
            score: 90,
            confidence: 92,
            sources: [
              { name: "USDA Food Access Research Atlas", weight: 0.4, value: 92, type: "measured" },
              { name: "Yelp Business Density Index", weight: 0.35, value: 91, type: "measured" },
              { name: "AI Essential Services Proximity Model", weight: 0.25, value: 85, type: "estimated" },
            ],
            frames: {
              neutral: "Grocery & Essentials Access: 90",
              positive: "Better than 93% of Los Angeles neighborhoods for everyday shopping and services",
              negative: "Falls behind 7% of comparable neighborhoods in essential services convenience",
            },
          },
        ],
      },
      {
        label: "Safety",
        score: 68,
        factors: [
          {
            name: "Violent Crime Rate",
            score: 64,
            confidence: 92,
            sources: [
              { name: "FBI UCR Crime Statistics", weight: 0.45, value: 66, type: "measured" },
              { name: "Santa Monica PD CompStat Reports", weight: 0.35, value: 65, type: "measured" },
              { name: "AI Crime Trend Projection", weight: 0.2, value: 58, type: "estimated" },
            ],
            frames: {
              neutral: "Violent Crime Rate: 64",
              positive: "Better than 57% of urban coastal communities for violent crime safety",
              negative: "Falls behind 43% of comparable neighborhoods in violent crime prevention",
            },
          },
          {
            name: "Property Crime Rate",
            score: 58,
            confidence: 90,
            sources: [
              { name: "FBI UCR Property Crime Data", weight: 0.4, value: 60, type: "measured" },
              { name: "Santa Monica PD Property Crime Reports", weight: 0.35, value: 59, type: "measured" },
              { name: "AI Property Crime Risk Model", weight: 0.25, value: 53, type: "estimated" },
            ],
            frames: {
              neutral: "Property Crime Rate: 58",
              positive: "Better than 50% of high-density LA neighborhoods for property safety",
              negative: "Falls behind 50% of comparable neighborhoods in property crime prevention",
            },
          },
          {
            name: "Insurance Cost Index",
            score: 48,
            confidence: 86,
            sources: [
              { name: "NAIC Homeowner Insurance Rate Database", weight: 0.4, value: 50, type: "measured" },
              { name: "CA DOI Rate Filing Data", weight: 0.35, value: 49, type: "measured" },
              { name: "AI Insurance Risk Premium Estimate", weight: 0.25, value: 43, type: "estimated" },
            ],
            frames: {
              neutral: "Insurance Cost Index: 48",
              positive: "Better than 39% of coastal California neighborhoods for insurance affordability",
              negative: "Falls behind 61% of comparable neighborhoods in insurance cost competitiveness",
            },
          },
          {
            name: "Emergency Response Time",
            score: 81,
            confidence: 87,
            sources: [
              { name: "NFPA Response Time Benchmarks", weight: 0.4, value: 83, type: "measured" },
              { name: "Santa Monica Fire Dept Dispatch Records", weight: 0.35, value: 82, type: "measured" },
              { name: "AI Emergency Coverage Gap Estimate", weight: 0.25, value: 76, type: "estimated" },
            ],
            frames: {
              neutral: "Emergency Response Time: 81",
              positive: "Better than 76% of urban neighborhoods for emergency services accessibility",
              negative: "Falls behind 24% of comparable neighborhoods in emergency response speed",
            },
          },
        ],
      },
      {
        label: "Community",
        score: 82,
        factors: [
          {
            name: "Family Friendliness",
            score: 74,
            confidence: 85,
            sources: [
              { name: "GreatSchools District Rating", weight: 0.4, value: 76, type: "measured" },
              { name: "Census ACS Family Household Data", weight: 0.35, value: 75, type: "measured" },
              { name: "AI Family Suitability Index", weight: 0.25, value: 69, type: "estimated" },
            ],
            frames: {
              neutral: "Family Friendliness: 74",
              positive: "Better than 68% of urban LA neighborhoods for family living",
              negative: "Falls behind 32% of comparable neighborhoods in family-oriented resources",
            },
          },
          {
            name: "Cultural Amenities",
            score: 85,
            confidence: 89,
            sources: [
              { name: "NEA Arts & Culture Survey", weight: 0.4, value: 87, type: "measured" },
              { name: "Yelp Cultural Venue Density", weight: 0.35, value: 86, type: "measured" },
              { name: "AI Cultural Vibrancy Estimate", weight: 0.25, value: 80, type: "estimated" },
            ],
            frames: {
              neutral: "Cultural Amenities: 85",
              positive: "Better than 87% of Southern California neighborhoods for arts and culture access",
              negative: "Falls behind 13% of comparable neighborhoods in cultural programming and venues",
            },
          },
          {
            name: "Diversity Index",
            score: 72,
            confidence: 90,
            sources: [
              { name: "Census ACS Diversity & Inclusion Index", weight: 0.45, value: 74, type: "measured" },
              { name: "USA Today Diversity Index", weight: 0.3, value: 73, type: "measured" },
              { name: "AI Demographic Diversity Model", weight: 0.25, value: 67, type: "estimated" },
            ],
            frames: {
              neutral: "Diversity Index: 72",
              positive: "Better than 65% of Westside LA communities for demographic diversity",
              negative: "Falls behind 35% of comparable neighborhoods in community diversity representation",
            },
          },
          {
            name: "Nightlife & Entertainment",
            score: 79,
            confidence: 86,
            sources: [
              { name: "Yelp Nightlife Venue Index", weight: 0.4, value: 81, type: "measured" },
              { name: "Google Maps Late-Night POI Density", weight: 0.35, value: 80, type: "measured" },
              { name: "AI Entertainment Activity Estimate", weight: 0.25, value: 74, type: "estimated" },
            ],
            frames: {
              neutral: "Nightlife & Entertainment: 79",
              positive: "Better than 76% of LA neighborhoods for evening entertainment options",
              negative: "Falls behind 24% of comparable neighborhoods in nightlife variety and accessibility",
            },
          },
        ],
      },
      {
        label: "Growth",
        score: 88,
        factors: [
          {
            name: "Job Market Strength",
            score: 86,
            confidence: 91,
            sources: [
              { name: "BLS Local Area Unemployment Statistics", weight: 0.4, value: 88, type: "measured" },
              { name: "Census LEHD Employment Data", weight: 0.35, value: 87, type: "measured" },
              { name: "AI Job Growth Trajectory Model", weight: 0.25, value: 81, type: "estimated" },
            ],
            frames: {
              neutral: "Job Market Strength: 86",
              positive: "Better than 88% of LA metro sub-markets for employment opportunity and growth",
              negative: "Falls behind 12% of comparable neighborhoods in job market dynamism",
            },
          },
          {
            name: "Property Value Trend",
            score: 88,
            confidence: 93,
            sources: [
              { name: "Zillow Home Value Index", weight: 0.4, value: 90, type: "measured" },
              { name: "CoreLogic Home Price Index", weight: 0.35, value: 89, type: "measured" },
              { name: "AI Property Appreciation Forecast", weight: 0.25, value: 83, type: "estimated" },
            ],
            frames: {
              neutral: "Property Value Trend: 88",
              positive: "Better than 90% of Southern California markets for sustained property appreciation",
              negative: "Falls behind 10% of comparable neighborhoods in long-term property value gains",
            },
          },
          {
            name: "New Development Pipeline",
            score: 84,
            confidence: 85,
            sources: [
              { name: "City of Santa Monica Permit Records", weight: 0.4, value: 86, type: "measured" },
              { name: "CoStar Commercial Development Tracker", weight: 0.35, value: 85, type: "measured" },
              { name: "AI Development Momentum Estimate", weight: 0.25, value: 79, type: "estimated" },
            ],
            frames: {
              neutral: "New Development Pipeline: 84",
              positive: "Better than 83% of Westside LA communities for new development investment",
              negative: "Falls behind 17% of comparable neighborhoods in development pipeline volume",
            },
          },
          {
            name: "Rent Affordability",
            score: 32,
            confidence: 94,
            sources: [
              { name: "Census ACS Median Gross Rent", weight: 0.4, value: 34, type: "measured" },
              { name: "Apartment List Rent Estimates", weight: 0.35, value: 33, type: "measured" },
              { name: "AI Rent Burden Projection Model", weight: 0.25, value: 27, type: "estimated" },
            ],
            frames: {
              neutral: "Rent Affordability: 32",
              positive: "Better than 22% of coastal California neighborhoods for rental affordability",
              negative: "Falls behind 78% of comparable neighborhoods in rental cost accessibility",
            },
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // PASADENA — Culture-rich, diverse, moderate across the board
  // ──────────────────────────────────────────────
  {
    id: "pasadena",
    name: "Pasadena",
    coordinates: { lat: 34.1478, lng: -118.1445 },
    biography: "Pasadena is an elegant city in the San Gabriel Valley featuring a rich cultural heritage, prestigious institutions, and tree-lined neighborhoods. Home to world-renowned attractions like the Huntington Library and California Institute of Technology, Pasadena combines intellectual vitality with refined living. The city's historic architecture and established neighborhoods appeal to culture enthusiasts and families alike.",
    overallScore: 74,
    categories: [
      {
        label: "Sustainability",
        score: 68,
        factors: [
          {
            name: "Carbon Footprint",
            score: 65,
            confidence: 79,
            sources: [
              { name: "EPA Greenhouse Gas Reporting Program", weight: 0.4, value: 67, type: "measured" },
              { name: "CoolClimate Network Calculator", weight: 0.35, value: 66, type: "measured" },
              { name: "AI Per-Capita Emissions Estimate", weight: 0.25, value: 60, type: "estimated" },
            ],
            frames: {
              neutral: "Carbon Footprint: 65",
              positive: "Better than 58% of San Gabriel Valley cities for per-capita carbon emissions",
              negative: "Falls behind 42% of comparable neighborhoods in carbon footprint reduction",
            },
          },
          {
            name: "Green Transit Score",
            score: 72,
            confidence: 83,
            sources: [
              { name: "LA Metro Green Transit Assessment", weight: 0.4, value: 74, type: "measured" },
              { name: "EPA Smart Location Database", weight: 0.35, value: 73, type: "measured" },
              { name: "AI Green Commute Model", weight: 0.25, value: 67, type: "estimated" },
            ],
            frames: {
              neutral: "Green Transit Score: 72",
              positive: "Better than 67% of San Gabriel Valley communities for eco-friendly transit options",
              negative: "Falls behind 33% of comparable neighborhoods in green transportation access",
            },
          },
          {
            name: "Bike Infrastructure",
            score: 64,
            confidence: 78,
            sources: [
              { name: "PeopleForBikes City Ratings", weight: 0.4, value: 66, type: "measured" },
              { name: "City of Pasadena Bicycle Master Plan Data", weight: 0.35, value: 65, type: "measured" },
              { name: "AI Cycling Safety & Access Model", weight: 0.25, value: 59, type: "estimated" },
            ],
            frames: {
              neutral: "Bike Infrastructure: 64",
              positive: "Better than 57% of LA County neighborhoods for cycling infrastructure",
              negative: "Falls behind 43% of comparable neighborhoods in bike-friendliness",
            },
          },
          {
            name: "Renewable Energy",
            score: 66,
            confidence: 80,
            sources: [
              { name: "CA Energy Commission Local Data", weight: 0.4, value: 68, type: "measured" },
              { name: "EIA State Electricity Profiles", weight: 0.35, value: 67, type: "measured" },
              { name: "AI Solar Adoption Estimate", weight: 0.25, value: 61, type: "estimated" },
            ],
            frames: {
              neutral: "Renewable Energy: 66",
              positive: "Better than 59% of LA County communities for renewable energy adoption",
              negative: "Falls behind 41% of comparable neighborhoods in clean energy transition",
            },
          },
          {
            name: "Green Space Coverage",
            score: 74,
            confidence: 85,
            sources: [
              { name: "Trust for Public Land ParkScore", weight: 0.4, value: 76, type: "measured" },
              { name: "USDA Urban Tree Canopy Assessment", weight: 0.35, value: 75, type: "measured" },
              { name: "AI Green Coverage Model", weight: 0.25, value: 69, type: "estimated" },
            ],
            frames: {
              neutral: "Green Space Coverage: 74",
              positive: "Better than 70% of LA County neighborhoods for green space and tree canopy",
              negative: "Falls behind 30% of comparable neighborhoods in urban green coverage",
            },
          },
        ],
      },
      {
        label: "Livability",
        score: 77,
        factors: [
          {
            name: "Walkability",
            score: 72,
            confidence: 86,
            sources: [
              { name: "Walk Score Index", weight: 0.45, value: 74, type: "measured" },
              { name: "USDOT Pedestrian Infrastructure Survey", weight: 0.3, value: 73, type: "measured" },
              { name: "AI Pedestrian Activity Model", weight: 0.25, value: 67, type: "estimated" },
            ],
            frames: {
              neutral: "Walkability: 72",
              positive: "Better than 68% of San Gabriel Valley neighborhoods for pedestrian friendliness",
              negative: "Falls behind 32% of comparable neighborhoods in walkability and pedestrian safety",
            },
          },
          {
            name: "Transit Access",
            score: 74,
            confidence: 84,
            sources: [
              { name: "LA Metro Ridership & Coverage Data", weight: 0.4, value: 76, type: "measured" },
              { name: "AllTransit Performance Score", weight: 0.35, value: 75, type: "measured" },
              { name: "AI Transit Connectivity Estimate", weight: 0.25, value: 69, type: "estimated" },
            ],
            frames: {
              neutral: "Transit Access: 74",
              positive: "Better than 71% of San Gabriel Valley communities for public transit service",
              negative: "Falls behind 29% of comparable neighborhoods in transit coverage and frequency",
            },
          },
          {
            name: "Parks & Recreation",
            score: 78,
            confidence: 87,
            sources: [
              { name: "Trust for Public Land ParkScore", weight: 0.4, value: 80, type: "measured" },
              { name: "Pasadena Parks & Rec Department Inventory", weight: 0.35, value: 79, type: "measured" },
              { name: "AI Green Space Coverage Model", weight: 0.25, value: 73, type: "estimated" },
            ],
            frames: {
              neutral: "Parks & Recreation: 78",
              positive: "Better than 74% of LA-area neighborhoods for park access and green space",
              negative: "Falls behind 26% of comparable neighborhoods in recreational amenities",
            },
          },
          {
            name: "Grocery & Essentials Access",
            score: 80,
            confidence: 89,
            sources: [
              { name: "USDA Food Access Research Atlas", weight: 0.4, value: 82, type: "measured" },
              { name: "Yelp Business Density Index", weight: 0.35, value: 81, type: "measured" },
              { name: "AI Essential Services Proximity Model", weight: 0.25, value: 75, type: "estimated" },
            ],
            frames: {
              neutral: "Grocery & Essentials Access: 80",
              positive: "Better than 76% of San Gabriel Valley neighborhoods for essential services",
              negative: "Falls behind 24% of comparable neighborhoods in everyday shopping convenience",
            },
          },
        ],
      },
      {
        label: "Safety",
        score: 72,
        factors: [
          {
            name: "Violent Crime Rate",
            score: 71,
            confidence: 91,
            sources: [
              { name: "FBI UCR Crime Statistics", weight: 0.45, value: 73, type: "measured" },
              { name: "Pasadena PD Annual Crime Report", weight: 0.35, value: 72, type: "measured" },
              { name: "AI Crime Trend Projection", weight: 0.2, value: 65, type: "estimated" },
            ],
            frames: {
              neutral: "Violent Crime Rate: 71",
              positive: "Better than 66% of mid-size California cities for violent crime safety",
              negative: "Falls behind 34% of comparable neighborhoods in violent crime outcomes",
            },
          },
          {
            name: "Property Crime Rate",
            score: 66,
            confidence: 89,
            sources: [
              { name: "FBI UCR Property Crime Data", weight: 0.4, value: 68, type: "measured" },
              { name: "Pasadena PD Property Crime Reports", weight: 0.35, value: 67, type: "measured" },
              { name: "AI Property Crime Risk Model", weight: 0.25, value: 61, type: "estimated" },
            ],
            frames: {
              neutral: "Property Crime Rate: 66",
              positive: "Better than 59% of LA County neighborhoods for property crime safety",
              negative: "Falls behind 41% of comparable neighborhoods in property crime prevention",
            },
          },
          {
            name: "Traffic Safety",
            score: 69,
            confidence: 83,
            sources: [
              { name: "NHTSA Fatality Analysis Reporting System", weight: 0.4, value: 71, type: "measured" },
              { name: "CA Office of Traffic Safety Rankings", weight: 0.35, value: 70, type: "measured" },
              { name: "AI Traffic Incident Density Model", weight: 0.25, value: 64, type: "estimated" },
            ],
            frames: {
              neutral: "Traffic Safety: 69",
              positive: "Better than 62% of San Gabriel Valley communities for traffic-related safety",
              negative: "Falls behind 38% of comparable neighborhoods in traffic safety performance",
            },
          },
          {
            name: "Emergency Response Time",
            score: 77,
            confidence: 86,
            sources: [
              { name: "NFPA Response Time Benchmarks", weight: 0.4, value: 79, type: "measured" },
              { name: "Pasadena Fire Department Dispatch Records", weight: 0.35, value: 78, type: "measured" },
              { name: "AI Emergency Coverage Gap Estimate", weight: 0.25, value: 72, type: "estimated" },
            ],
            frames: {
              neutral: "Emergency Response Time: 77",
              positive: "Better than 72% of mid-size California cities for emergency response quality",
              negative: "Falls behind 28% of comparable neighborhoods in emergency response speed",
            },
          },
        ],
      },
      {
        label: "Community",
        score: 83,
        factors: [
          {
            name: "Family Friendliness",
            score: 79,
            confidence: 87,
            sources: [
              { name: "GreatSchools District Rating", weight: 0.4, value: 81, type: "measured" },
              { name: "Census ACS Family Household Data", weight: 0.35, value: 80, type: "measured" },
              { name: "AI Family Suitability Index", weight: 0.25, value: 74, type: "estimated" },
            ],
            frames: {
              neutral: "Family Friendliness: 79",
              positive: "Better than 75% of LA County neighborhoods for family-oriented living",
              negative: "Falls behind 25% of comparable neighborhoods in family support infrastructure",
            },
          },
          {
            name: "Cultural Amenities",
            score: 88,
            confidence: 92,
            sources: [
              { name: "NEA Arts & Culture Survey", weight: 0.4, value: 90, type: "measured" },
              { name: "Yelp Cultural Venue Density", weight: 0.35, value: 89, type: "measured" },
              { name: "AI Cultural Vibrancy Estimate", weight: 0.25, value: 83, type: "estimated" },
            ],
            frames: {
              neutral: "Cultural Amenities: 88",
              positive: "Better than 91% of Southern California neighborhoods for museums, galleries, and cultural programming",
              negative: "Falls behind 9% of comparable neighborhoods in cultural richness and venue diversity",
            },
          },
          {
            name: "Diversity Index",
            score: 91,
            confidence: 94,
            sources: [
              { name: "Census ACS Diversity & Inclusion Index", weight: 0.45, value: 93, type: "measured" },
              { name: "USA Today Diversity Index", weight: 0.3, value: 92, type: "measured" },
              { name: "AI Demographic Diversity Model", weight: 0.25, value: 87, type: "estimated" },
            ],
            frames: {
              neutral: "Diversity Index: 91",
              positive: "Better than 94% of LA County neighborhoods for ethnic, cultural, and economic diversity",
              negative: "Falls behind 6% of comparable neighborhoods in community diversity representation",
            },
          },
          {
            name: "Nightlife & Entertainment",
            score: 68,
            confidence: 81,
            sources: [
              { name: "Yelp Nightlife Venue Index", weight: 0.4, value: 70, type: "measured" },
              { name: "Google Maps Late-Night POI Density", weight: 0.35, value: 69, type: "measured" },
              { name: "AI Entertainment Activity Estimate", weight: 0.25, value: 63, type: "estimated" },
            ],
            frames: {
              neutral: "Nightlife & Entertainment: 68",
              positive: "Better than 62% of San Gabriel Valley neighborhoods for evening entertainment",
              negative: "Falls behind 38% of comparable neighborhoods in nightlife options and vibrancy",
            },
          },
        ],
      },
      {
        label: "Growth",
        score: 72,
        factors: [
          {
            name: "Job Market Strength",
            score: 75,
            confidence: 87,
            sources: [
              { name: "BLS Local Area Unemployment Statistics", weight: 0.4, value: 77, type: "measured" },
              { name: "Census LEHD Employment Data", weight: 0.35, value: 76, type: "measured" },
              { name: "AI Job Growth Trajectory Model", weight: 0.25, value: 70, type: "estimated" },
            ],
            frames: {
              neutral: "Job Market Strength: 75",
              positive: "Better than 70% of San Gabriel Valley communities for local employment strength",
              negative: "Falls behind 30% of comparable neighborhoods in job market competitiveness",
            },
          },
          {
            name: "Property Value Trend",
            score: 74,
            confidence: 88,
            sources: [
              { name: "Zillow Home Value Index", weight: 0.4, value: 76, type: "measured" },
              { name: "CoreLogic Home Price Index", weight: 0.35, value: 75, type: "measured" },
              { name: "AI Property Appreciation Forecast", weight: 0.25, value: 69, type: "estimated" },
            ],
            frames: {
              neutral: "Property Value Trend: 74",
              positive: "Better than 69% of LA County sub-markets for steady property appreciation",
              negative: "Falls behind 31% of comparable neighborhoods in property value growth momentum",
            },
          },
          {
            name: "New Development Pipeline",
            score: 70,
            confidence: 80,
            sources: [
              { name: "City of Pasadena Permit Records", weight: 0.4, value: 72, type: "measured" },
              { name: "CoStar Commercial Development Tracker", weight: 0.35, value: 71, type: "measured" },
              { name: "AI Development Momentum Estimate", weight: 0.25, value: 65, type: "estimated" },
            ],
            frames: {
              neutral: "New Development Pipeline: 70",
              positive: "Better than 64% of San Gabriel Valley cities for active construction and investment",
              negative: "Falls behind 36% of comparable neighborhoods in new development activity",
            },
          },
          {
            name: "Rent Affordability",
            score: 55,
            confidence: 90,
            sources: [
              { name: "Census ACS Median Gross Rent", weight: 0.4, value: 57, type: "measured" },
              { name: "Apartment List Rent Estimates", weight: 0.35, value: 56, type: "measured" },
              { name: "AI Rent Burden Projection Model", weight: 0.25, value: 50, type: "estimated" },
            ],
            frames: {
              neutral: "Rent Affordability: 55",
              positive: "Better than 46% of LA County neighborhoods for rental cost manageability",
              negative: "Falls behind 54% of comparable neighborhoods in rental affordability",
            },
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // WEST HOLLYWOOD — Walkable, vibrant nightlife, LGBTQ+ friendly
  // ──────────────────────────────────────────────
  {
    id: "west-hollywood",
    name: "West Hollywood",
    coordinates: { lat: 34.0900, lng: -118.3617 },
    biography: "West Hollywood is a trendsetting urban neighborhood at the heart of Los Angeles culture, celebrated for its vibrant nightlife, cutting-edge fashion, and diverse communities. This compact, walkable area pulses with creativity and cosmopolitan energy, attracting young professionals and artists from around the world. The area's concentration of museums, restaurants, and entertainment venues makes it an urban cultural hub.",
    overallScore: 79,
    categories: [
      {
        label: "Sustainability",
        score: 75,
        factors: [
          {
            name: "Carbon Footprint",
            score: 74,
            confidence: 80,
            sources: [
              { name: "EPA Greenhouse Gas Reporting Program", weight: 0.4, value: 76, type: "measured" },
              { name: "CoolClimate Network Calculator", weight: 0.35, value: 75, type: "measured" },
              { name: "AI Per-Capita Emissions Estimate", weight: 0.25, value: 69, type: "estimated" },
            ],
            frames: {
              neutral: "Carbon Footprint: 74",
              positive: "Better than 69% of dense urban LA neighborhoods for per-capita carbon emissions",
              negative: "Falls behind 31% of comparable neighborhoods in carbon footprint reduction",
            },
          },
          {
            name: "Green Transit Score",
            score: 82,
            confidence: 86,
            sources: [
              { name: "LA Metro Green Transit Assessment", weight: 0.4, value: 84, type: "measured" },
              { name: "EPA Smart Location Database", weight: 0.35, value: 83, type: "measured" },
              { name: "AI Green Commute Model", weight: 0.25, value: 77, type: "estimated" },
            ],
            frames: {
              neutral: "Green Transit Score: 82",
              positive: "Better than 80% of LA urban neighborhoods for eco-friendly transit options",
              negative: "Falls behind 20% of comparable neighborhoods in green transportation access",
            },
          },
          {
            name: "Bike Infrastructure",
            score: 77,
            confidence: 83,
            sources: [
              { name: "PeopleForBikes City Ratings", weight: 0.4, value: 79, type: "measured" },
              { name: "City of West Hollywood Active Transport Data", weight: 0.35, value: 78, type: "measured" },
              { name: "AI Cycling Safety & Access Model", weight: 0.25, value: 72, type: "estimated" },
            ],
            frames: {
              neutral: "Bike Infrastructure: 77",
              positive: "Better than 74% of urban LA neighborhoods for cycling infrastructure",
              negative: "Falls behind 26% of comparable neighborhoods in bike-friendliness",
            },
          },
          {
            name: "Renewable Energy",
            score: 72,
            confidence: 81,
            sources: [
              { name: "CA Energy Commission Local Data", weight: 0.4, value: 74, type: "measured" },
              { name: "EIA State Electricity Profiles", weight: 0.35, value: 73, type: "measured" },
              { name: "AI Solar Adoption Estimate", weight: 0.25, value: 67, type: "estimated" },
            ],
            frames: {
              neutral: "Renewable Energy: 72",
              positive: "Better than 66% of LA metro communities for renewable energy adoption",
              negative: "Falls behind 34% of comparable neighborhoods in clean energy transition",
            },
          },
          {
            name: "Green Space Coverage",
            score: 68,
            confidence: 80,
            sources: [
              { name: "Trust for Public Land ParkScore", weight: 0.4, value: 70, type: "measured" },
              { name: "USDA Urban Tree Canopy Assessment", weight: 0.35, value: 69, type: "measured" },
              { name: "AI Green Coverage Model", weight: 0.25, value: 63, type: "estimated" },
            ],
            frames: {
              neutral: "Green Space Coverage: 68",
              positive: "Better than 61% of dense urban neighborhoods for green space and tree canopy",
              negative: "Falls behind 39% of comparable neighborhoods in urban green coverage",
            },
          },
        ],
      },
      {
        label: "Livability",
        score: 85,
        factors: [
          {
            name: "Walkability",
            score: 92,
            confidence: 95,
            sources: [
              { name: "Walk Score Index", weight: 0.45, value: 94, type: "measured" },
              { name: "USDOT Pedestrian Infrastructure Survey", weight: 0.3, value: 93, type: "measured" },
              { name: "AI Pedestrian Activity Model", weight: 0.25, value: 87, type: "estimated" },
            ],
            frames: {
              neutral: "Walkability: 92",
              positive: "Better than 96% of Los Angeles County neighborhoods for pedestrian infrastructure and access",
              negative: "Falls behind 4% of comparable neighborhoods in walkability",
            },
          },
          {
            name: "Transit Access",
            score: 78,
            confidence: 85,
            sources: [
              { name: "LA Metro Ridership & Coverage Data", weight: 0.4, value: 80, type: "measured" },
              { name: "AllTransit Performance Score", weight: 0.35, value: 79, type: "measured" },
              { name: "AI Transit Connectivity Estimate", weight: 0.25, value: 73, type: "estimated" },
            ],
            frames: {
              neutral: "Transit Access: 78",
              positive: "Better than 75% of LA urban neighborhoods for transit availability",
              negative: "Falls behind 25% of comparable neighborhoods in public transit service quality",
            },
          },
          {
            name: "Parks & Recreation",
            score: 71,
            confidence: 82,
            sources: [
              { name: "Trust for Public Land ParkScore", weight: 0.4, value: 73, type: "measured" },
              { name: "WeHo Parks & Facilities Inventory", weight: 0.35, value: 72, type: "measured" },
              { name: "AI Green Space Coverage Model", weight: 0.25, value: 66, type: "estimated" },
            ],
            frames: {
              neutral: "Parks & Recreation: 71",
              positive: "Better than 65% of high-density urban neighborhoods for park and recreation access",
              negative: "Falls behind 35% of comparable neighborhoods in green space availability",
            },
          },
          {
            name: "Grocery & Essentials Access",
            score: 87,
            confidence: 90,
            sources: [
              { name: "USDA Food Access Research Atlas", weight: 0.4, value: 89, type: "measured" },
              { name: "Yelp Business Density Index", weight: 0.35, value: 88, type: "measured" },
              { name: "AI Essential Services Proximity Model", weight: 0.25, value: 82, type: "estimated" },
            ],
            frames: {
              neutral: "Grocery & Essentials Access: 87",
              positive: "Better than 89% of urban LA neighborhoods for daily shopping and essential services",
              negative: "Falls behind 11% of comparable neighborhoods in everyday convenience access",
            },
          },
        ],
      },
      {
        label: "Safety",
        score: 63,
        factors: [
          {
            name: "Violent Crime Rate",
            score: 59,
            confidence: 90,
            sources: [
              { name: "FBI UCR Crime Statistics", weight: 0.45, value: 61, type: "measured" },
              { name: "LA County Sheriff Crime Data (WeHo Station)", weight: 0.35, value: 60, type: "measured" },
              { name: "AI Crime Trend Projection", weight: 0.2, value: 53, type: "estimated" },
            ],
            frames: {
              neutral: "Violent Crime Rate: 59",
              positive: "Better than 51% of dense urban LA neighborhoods for violent crime safety",
              negative: "Falls behind 49% of comparable neighborhoods in violent crime prevention",
            },
          },
          {
            name: "Property Crime Rate",
            score: 52,
            confidence: 88,
            sources: [
              { name: "FBI UCR Property Crime Data", weight: 0.4, value: 54, type: "measured" },
              { name: "LA County Sheriff Property Crime Reports", weight: 0.35, value: 53, type: "measured" },
              { name: "AI Property Crime Risk Model", weight: 0.25, value: 47, type: "estimated" },
            ],
            frames: {
              neutral: "Property Crime Rate: 52",
              positive: "Better than 43% of entertainment-district neighborhoods for property safety",
              negative: "Falls behind 57% of comparable neighborhoods in property crime rates",
            },
          },
          {
            name: "Traffic Safety",
            score: 61,
            confidence: 82,
            sources: [
              { name: "NHTSA Fatality Analysis Reporting System", weight: 0.4, value: 63, type: "measured" },
              { name: "CA Office of Traffic Safety Rankings", weight: 0.35, value: 62, type: "measured" },
              { name: "AI Traffic Incident Density Model", weight: 0.25, value: 56, type: "estimated" },
            ],
            frames: {
              neutral: "Traffic Safety: 61",
              positive: "Better than 53% of high-density LA neighborhoods for pedestrian and vehicle safety",
              negative: "Falls behind 47% of comparable neighborhoods in traffic safety outcomes",
            },
          },
          {
            name: "Emergency Response Time",
            score: 74,
            confidence: 84,
            sources: [
              { name: "NFPA Response Time Benchmarks", weight: 0.4, value: 76, type: "measured" },
              { name: "LA County Fire Dept Dispatch Records", weight: 0.35, value: 75, type: "measured" },
              { name: "AI Emergency Coverage Gap Estimate", weight: 0.25, value: 69, type: "estimated" },
            ],
            frames: {
              neutral: "Emergency Response Time: 74",
              positive: "Better than 68% of dense urban neighborhoods for emergency response access",
              negative: "Falls behind 32% of comparable neighborhoods in emergency services speed",
            },
          },
        ],
      },
      {
        label: "Community",
        score: 91,
        factors: [
          {
            name: "LGBTQ+ Friendliness",
            score: 98,
            confidence: 96,
            sources: [
              { name: "HRC Municipal Equality Index", weight: 0.4, value: 99, type: "measured" },
              { name: "Census ACS Same-Sex Household Data", weight: 0.35, value: 98, type: "measured" },
              { name: "AI Inclusivity & Representation Model", weight: 0.25, value: 95, type: "estimated" },
            ],
            frames: {
              neutral: "LGBTQ+ Friendliness: 98",
              positive: "Better than 99% of U.S. neighborhoods for LGBTQ+ inclusivity and representation",
              negative: "Falls behind 1% of comparable neighborhoods in LGBTQ+ community support",
            },
          },
          {
            name: "Nightlife & Entertainment",
            score: 95,
            confidence: 94,
            sources: [
              { name: "Yelp Nightlife Venue Index", weight: 0.4, value: 96, type: "measured" },
              { name: "Google Maps Late-Night POI Density", weight: 0.35, value: 96, type: "measured" },
              { name: "AI Entertainment Activity Estimate", weight: 0.25, value: 91, type: "estimated" },
            ],
            frames: {
              neutral: "Nightlife & Entertainment: 95",
              positive: "Better than 97% of U.S. neighborhoods for nightlife density, variety, and quality",
              negative: "Falls behind 3% of comparable neighborhoods in entertainment offerings",
            },
          },
          {
            name: "Cultural Amenities",
            score: 82,
            confidence: 88,
            sources: [
              { name: "NEA Arts & Culture Survey", weight: 0.4, value: 84, type: "measured" },
              { name: "Yelp Cultural Venue Density", weight: 0.35, value: 83, type: "measured" },
              { name: "AI Cultural Vibrancy Estimate", weight: 0.25, value: 77, type: "estimated" },
            ],
            frames: {
              neutral: "Cultural Amenities: 82",
              positive: "Better than 80% of LA neighborhoods for arts, culture, and creative community",
              negative: "Falls behind 20% of comparable neighborhoods in cultural venue access and programming",
            },
          },
          {
            name: "Diversity Index",
            score: 84,
            confidence: 91,
            sources: [
              { name: "Census ACS Diversity & Inclusion Index", weight: 0.45, value: 86, type: "measured" },
              { name: "USA Today Diversity Index", weight: 0.3, value: 85, type: "measured" },
              { name: "AI Demographic Diversity Model", weight: 0.25, value: 79, type: "estimated" },
            ],
            frames: {
              neutral: "Diversity Index: 84",
              positive: "Better than 82% of LA County neighborhoods for demographic and cultural diversity",
              negative: "Falls behind 18% of comparable neighborhoods in community diversity breadth",
            },
          },
        ],
      },
      {
        label: "Growth",
        score: 79,
        factors: [
          {
            name: "Job Market Strength",
            score: 80,
            confidence: 87,
            sources: [
              { name: "BLS Local Area Unemployment Statistics", weight: 0.4, value: 82, type: "measured" },
              { name: "Census LEHD Employment Data", weight: 0.35, value: 81, type: "measured" },
              { name: "AI Job Growth Trajectory Model", weight: 0.25, value: 75, type: "estimated" },
            ],
            frames: {
              neutral: "Job Market Strength: 80",
              positive: "Better than 77% of urban LA neighborhoods for local job availability and growth",
              negative: "Falls behind 23% of comparable neighborhoods in employment market strength",
            },
          },
          {
            name: "Property Value Trend",
            score: 83,
            confidence: 90,
            sources: [
              { name: "Zillow Home Value Index", weight: 0.4, value: 85, type: "measured" },
              { name: "CoreLogic Home Price Index", weight: 0.35, value: 84, type: "measured" },
              { name: "AI Property Appreciation Forecast", weight: 0.25, value: 78, type: "estimated" },
            ],
            frames: {
              neutral: "Property Value Trend: 83",
              positive: "Better than 82% of LA metro neighborhoods for property value appreciation",
              negative: "Falls behind 18% of comparable neighborhoods in property value growth trajectory",
            },
          },
          {
            name: "New Development Pipeline",
            score: 76,
            confidence: 82,
            sources: [
              { name: "City of West Hollywood Permit Records", weight: 0.4, value: 78, type: "measured" },
              { name: "CoStar Commercial Development Tracker", weight: 0.35, value: 77, type: "measured" },
              { name: "AI Development Momentum Estimate", weight: 0.25, value: 71, type: "estimated" },
            ],
            frames: {
              neutral: "New Development Pipeline: 76",
              positive: "Better than 72% of LA urban neighborhoods for active development and investment",
              negative: "Falls behind 28% of comparable neighborhoods in new construction momentum",
            },
          },
          {
            name: "Rent Affordability",
            score: 38,
            confidence: 93,
            sources: [
              { name: "Census ACS Median Gross Rent", weight: 0.4, value: 40, type: "measured" },
              { name: "Apartment List Rent Estimates", weight: 0.35, value: 39, type: "measured" },
              { name: "AI Rent Burden Projection Model", weight: 0.25, value: 33, type: "estimated" },
            ],
            frames: {
              neutral: "Rent Affordability: 38",
              positive: "Better than 28% of Westside LA neighborhoods for rental affordability",
              negative: "Falls behind 72% of comparable neighborhoods in rental cost accessibility",
            },
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // BERKELEY — Progressive, walkable, university culture
  // ──────────────────────────────────────────────
  {
    id: "berkeley",
    name: "Berkeley",
    region: "bay-area",
    coordinates: { lat: 37.8716, lng: -122.2727 },
    biography: "Berkeley is a progressive university city in the East Bay known for its world-class academics, vibrant cultural scene, and strong commitment to sustainability. Home to UC Berkeley, the city blends intellectual energy with diverse neighborhoods, excellent transit connections via BART, and a thriving food and arts community. Its activist heritage and environmental leadership make it a unique Bay Area destination.",
    overallScore: 82,
    categories: [
      {
        label: "Sustainability",
        score: 88,
        factors: [
          {
            name: "Carbon Footprint",
            score: 82,
            confidence: 85,
            sources: [
              { name: "EPA Greenhouse Gas Reporting Program", weight: 0.4, value: 84, type: "measured" },
              { name: "CoolClimate Network Calculator", weight: 0.35, value: 83, type: "measured" },
              { name: "AI Per-Capita Emissions Estimate", weight: 0.25, value: 77, type: "estimated" },
            ],
            frames: {
              neutral: "Carbon Footprint: 82",
              positive: "Better than 80% of Bay Area cities for carbon efficiency",
              negative: "Falls behind 20% of comparable neighborhoods in carbon reduction",
            },
          },
          {
            name: "Green Transit Score",
            score: 91,
            confidence: 92,
            sources: [
              { name: "AC Transit Ridership Data", weight: 0.4, value: 93, type: "measured" },
              { name: "EPA Smart Location Database", weight: 0.35, value: 92, type: "measured" },
              { name: "AI Green Commute Model", weight: 0.25, value: 86, type: "estimated" },
            ],
            frames: {
              neutral: "Green Transit Score: 91",
              positive: "Better than 89% of Bay Area neighborhoods for green transit access",
              negative: "Falls behind 11% of comparable neighborhoods in green transit",
            },
          },
          {
            name: "Bike Infrastructure",
            score: 90,
            confidence: 88,
            sources: [
              { name: "PeopleForBikes City Ratings", weight: 0.4, value: 92, type: "measured" },
              { name: "City of Berkeley Bike Plan Data", weight: 0.35, value: 91, type: "measured" },
              { name: "AI Cycling Safety & Access Model", weight: 0.25, value: 85, type: "estimated" },
            ],
            frames: {
              neutral: "Bike Infrastructure: 90",
              positive: "Better than 88% of Bay Area neighborhoods for cycling infrastructure",
              negative: "Falls behind 12% of comparable neighborhoods in bike access",
            },
          },
          {
            name: "Renewable Energy",
            score: 85,
            confidence: 83,
            sources: [
              { name: "CA Energy Commission Local Data", weight: 0.4, value: 87, type: "measured" },
              { name: "EIA State Electricity Profiles", weight: 0.35, value: 86, type: "measured" },
              { name: "AI Solar Adoption Estimate", weight: 0.25, value: 80, type: "estimated" },
            ],
            frames: {
              neutral: "Renewable Energy: 85",
              positive: "Better than 83% of Bay Area neighborhoods for renewable adoption",
              negative: "Falls behind 17% of comparable neighborhoods in renewable energy",
            },
          },
          {
            name: "Green Space Coverage",
            score: 80,
            confidence: 86,
            sources: [
              { name: "Trust for Public Land ParkScore", weight: 0.4, value: 82, type: "measured" },
              { name: "USDA Urban Tree Canopy Assessment", weight: 0.35, value: 81, type: "measured" },
              { name: "AI Green Coverage Model", weight: 0.25, value: 75, type: "estimated" },
            ],
            frames: {
              neutral: "Green Space Coverage: 80",
              positive: "Better than 78% of Bay Area neighborhoods for green space",
              negative: "Falls behind 22% of comparable neighborhoods in green coverage",
            },
          },
        ],
      },
      {
        label: "Livability",
        score: 85,
        factors: [
          {
            name: "Walkability",
            score: 89,
            confidence: 91,
            sources: [
              { name: "Walk Score Index", weight: 0.45, value: 91, type: "measured" },
              { name: "USDOT Pedestrian Infrastructure Survey", weight: 0.3, value: 90, type: "measured" },
              { name: "AI Pedestrian Activity Model", weight: 0.25, value: 84, type: "estimated" },
            ],
            frames: {
              neutral: "Walkability: 89",
              positive: "Better than 87% of Bay Area neighborhoods for walkability",
              negative: "Falls behind 13% of comparable neighborhoods in pedestrian access",
            },
          },
          {
            name: "Transit Access",
            score: 88,
            confidence: 90,
            sources: [
              { name: "AC Transit & BART Ridership Data", weight: 0.4, value: 90, type: "measured" },
              { name: "AllTransit Performance Score", weight: 0.35, value: 89, type: "measured" },
              { name: "AI Transit Connectivity Estimate", weight: 0.25, value: 83, type: "estimated" },
            ],
            frames: {
              neutral: "Transit Access: 88",
              positive: "Better than 86% of Bay Area neighborhoods for public transit",
              negative: "Falls behind 14% of comparable neighborhoods in transit connectivity",
            },
          },
          {
            name: "Parks & Recreation",
            score: 83,
            confidence: 87,
            sources: [
              { name: "Trust for Public Land ParkScore", weight: 0.4, value: 85, type: "measured" },
              { name: "City of Berkeley Parks Inventory", weight: 0.35, value: 84, type: "measured" },
              { name: "AI Green Space Coverage Model", weight: 0.25, value: 78, type: "estimated" },
            ],
            frames: {
              neutral: "Parks & Recreation: 83",
              positive: "Better than 81% of Bay Area neighborhoods for park access",
              negative: "Falls behind 19% of comparable neighborhoods in recreational amenities",
            },
          },
          {
            name: "Grocery & Essentials Access",
            score: 87,
            confidence: 89,
            sources: [
              { name: "USDA Food Access Research Atlas", weight: 0.4, value: 89, type: "measured" },
              { name: "Yelp Business Density Index", weight: 0.35, value: 88, type: "measured" },
              { name: "AI Essential Services Proximity Model", weight: 0.25, value: 82, type: "estimated" },
            ],
            frames: {
              neutral: "Grocery & Essentials Access: 87",
              positive: "Better than 85% of Bay Area neighborhoods for essential services",
              negative: "Falls behind 15% of comparable neighborhoods in grocery access",
            },
          },
        ],
      },
      {
        label: "Safety",
        score: 68,
        factors: [
          {
            name: "Violent Crime Rate",
            score: 61,
            confidence: 88,
            sources: [
              { name: "FBI UCR Crime Statistics", weight: 0.45, value: 63, type: "measured" },
              { name: "Berkeley PD Annual Crime Report", weight: 0.35, value: 62, type: "measured" },
              { name: "AI Crime Trend Projection", weight: 0.2, value: 55, type: "estimated" },
            ],
            frames: {
              neutral: "Violent Crime Rate: 61",
              positive: "Better than 54% of comparable Bay Area cities for violent crime safety",
              negative: "Falls behind 46% of comparable neighborhoods in violent crime prevention",
            },
          },
          {
            name: "Property Crime Rate",
            score: 58,
            confidence: 86,
            sources: [
              { name: "FBI UCR Property Crime Data", weight: 0.4, value: 60, type: "measured" },
              { name: "Berkeley PD Property Crime Reports", weight: 0.35, value: 59, type: "measured" },
              { name: "AI Property Crime Risk Model", weight: 0.25, value: 53, type: "estimated" },
            ],
            frames: {
              neutral: "Property Crime Rate: 58",
              positive: "Better than 51% of Bay Area neighborhoods for property safety",
              negative: "Falls behind 49% of comparable neighborhoods in property crime prevention",
            },
          },
          {
            name: "Traffic Safety",
            score: 72,
            confidence: 84,
            sources: [
              { name: "NHTSA Fatality Analysis Reporting System", weight: 0.4, value: 74, type: "measured" },
              { name: "CA Office of Traffic Safety Rankings", weight: 0.35, value: 73, type: "measured" },
              { name: "AI Traffic Incident Density Model", weight: 0.25, value: 67, type: "estimated" },
            ],
            frames: {
              neutral: "Traffic Safety: 72",
              positive: "Better than 70% of Bay Area neighborhoods for traffic safety",
              negative: "Falls behind 30% of comparable neighborhoods in traffic incident prevention",
            },
          },
          {
            name: "Emergency Response Time",
            score: 79,
            confidence: 85,
            sources: [
              { name: "NFPA Response Time Benchmarks", weight: 0.4, value: 81, type: "measured" },
              { name: "Berkeley Fire Dept Dispatch Records", weight: 0.35, value: 80, type: "measured" },
              { name: "AI Emergency Coverage Gap Estimate", weight: 0.25, value: 74, type: "estimated" },
            ],
            frames: {
              neutral: "Emergency Response Time: 79",
              positive: "Better than 77% of Bay Area neighborhoods for emergency response",
              negative: "Falls behind 23% of comparable neighborhoods in emergency coverage",
            },
          },
        ],
      },
      {
        label: "Community",
        score: 88,
        factors: [
          {
            name: "Family Friendliness",
            score: 78,
            confidence: 82,
            sources: [
              { name: "GreatSchools District Rating", weight: 0.4, value: 80, type: "measured" },
              { name: "Census ACS Family Household Data", weight: 0.35, value: 79, type: "measured" },
              { name: "AI Family Suitability Index", weight: 0.25, value: 73, type: "estimated" },
            ],
            frames: {
              neutral: "Family Friendliness: 78",
              positive: "Better than 76% of Bay Area neighborhoods for family suitability",
              negative: "Falls behind 24% of comparable neighborhoods in family amenities",
            },
          },
          {
            name: "Cultural Amenities",
            score: 94,
            confidence: 91,
            sources: [
              { name: "NEA Arts & Culture Survey", weight: 0.4, value: 96, type: "measured" },
              { name: "Yelp Cultural Venue Density", weight: 0.35, value: 95, type: "measured" },
              { name: "AI Cultural Vibrancy Estimate", weight: 0.25, value: 89, type: "estimated" },
            ],
            frames: {
              neutral: "Cultural Amenities: 94",
              positive: "Better than 92% of Bay Area neighborhoods for arts and culture",
              negative: "Falls behind 8% of comparable neighborhoods in cultural vibrancy",
            },
          },
          {
            name: "Diversity Index",
            score: 86,
            confidence: 90,
            sources: [
              { name: "Census ACS Diversity & Inclusion Index", weight: 0.45, value: 88, type: "measured" },
              { name: "USA Today Diversity Index", weight: 0.3, value: 87, type: "measured" },
              { name: "AI Demographic Diversity Model", weight: 0.25, value: 81, type: "estimated" },
            ],
            frames: {
              neutral: "Diversity Index: 86",
              positive: "Better than 84% of Bay Area neighborhoods for demographic diversity",
              negative: "Falls behind 16% of comparable neighborhoods in diversity",
            },
          },
          {
            name: "Nightlife & Entertainment",
            score: 82,
            confidence: 85,
            sources: [
              { name: "Yelp Nightlife Venue Index", weight: 0.4, value: 84, type: "measured" },
              { name: "Google Maps Late-Night POI Density", weight: 0.35, value: 83, type: "measured" },
              { name: "AI Entertainment Activity Estimate", weight: 0.25, value: 77, type: "estimated" },
            ],
            frames: {
              neutral: "Nightlife & Entertainment: 82",
              positive: "Better than 80% of Bay Area neighborhoods for nightlife",
              negative: "Falls behind 20% of comparable neighborhoods in entertainment",
            },
          },
        ],
      },
      {
        label: "Growth",
        score: 79,
        factors: [
          {
            name: "Job Market Strength",
            score: 84,
            confidence: 88,
            sources: [
              { name: "BLS Local Area Unemployment Statistics", weight: 0.4, value: 86, type: "measured" },
              { name: "Census LEHD Employment Data", weight: 0.35, value: 85, type: "measured" },
              { name: "AI Job Growth Trajectory Model", weight: 0.25, value: 79, type: "estimated" },
            ],
            frames: {
              neutral: "Job Market Strength: 84",
              positive: "Better than 82% of Bay Area neighborhoods for employment opportunity",
              negative: "Falls behind 18% of comparable neighborhoods in job market vitality",
            },
          },
          {
            name: "Property Value Trend",
            score: 80,
            confidence: 87,
            sources: [
              { name: "Zillow Home Value Index", weight: 0.4, value: 82, type: "measured" },
              { name: "CoreLogic Home Price Index", weight: 0.35, value: 81, type: "measured" },
              { name: "AI Property Appreciation Forecast", weight: 0.25, value: 75, type: "estimated" },
            ],
            frames: {
              neutral: "Property Value Trend: 80",
              positive: "Better than 78% of Bay Area markets for property appreciation",
              negative: "Falls behind 22% of comparable neighborhoods in value growth",
            },
          },
          {
            name: "New Development Pipeline",
            score: 72,
            confidence: 80,
            sources: [
              { name: "City of Berkeley Permit Records", weight: 0.4, value: 74, type: "measured" },
              { name: "CoStar Commercial Development Tracker", weight: 0.35, value: 73, type: "measured" },
              { name: "AI Development Momentum Estimate", weight: 0.25, value: 67, type: "estimated" },
            ],
            frames: {
              neutral: "New Development Pipeline: 72",
              positive: "Better than 70% of Bay Area cities for new construction activity",
              negative: "Falls behind 30% of comparable neighborhoods in development momentum",
            },
          },
          {
            name: "Rent Affordability",
            score: 38,
            confidence: 91,
            sources: [
              { name: "Census ACS Median Gross Rent", weight: 0.4, value: 40, type: "measured" },
              { name: "Apartment List Rent Estimates", weight: 0.35, value: 39, type: "measured" },
              { name: "AI Rent Burden Projection Model", weight: 0.25, value: 33, type: "estimated" },
            ],
            frames: {
              neutral: "Rent Affordability: 38",
              positive: "Better than 31% of Bay Area neighborhoods for rental affordability",
              negative: "Falls behind 69% of comparable neighborhoods in rental cost accessibility",
            },
          },
        ],
      },
    ],
  },
  // ──────────────────────────────────────────────
  // SAN FRANCISCO — Urban, walkable, tech hub, cultural icon
  // ──────────────────────────────────────────────
  {
    id: "san-francisco",
    name: "San Francisco",
    region: "bay-area",
    coordinates: { lat: 37.7749, lng: -122.4194 },
    biography: "San Francisco is an iconic, densely walkable city on a hilly peninsula known for its world-class transit, booming tech economy, and rich cultural tapestry. From the historic cable cars and Victorian architecture to the thriving food scene and progressive politics, SF blends innovation with tradition. Its compact neighborhoods — the Mission, Noe Valley, the Sunset, the Richmond — each have a distinct personality, making the city feel like a collection of small towns within a major metropolis.",
    overallScore: 79,
    categories: [
      {
        label: "Sustainability",
        score: 84,
        factors: [
          {
            name: "Carbon Footprint",
            score: 80,
            confidence: 86,
            sources: [
              { name: "EPA Greenhouse Gas Reporting Program", weight: 0.4, value: 82, type: "measured" },
              { name: "CoolClimate Network Calculator", weight: 0.35, value: 81, type: "measured" },
              { name: "AI Per-Capita Emissions Estimate", weight: 0.25, value: 75, type: "estimated" },
            ],
            frames: {
              neutral: "Carbon Footprint: 80",
              positive: "Better than 78% of major U.S. cities for per-capita carbon emissions",
              negative: "Falls behind 22% of comparable neighborhoods in carbon footprint reduction",
            },
          },
          {
            name: "Green Transit Score",
            score: 92,
            confidence: 93,
            sources: [
              { name: "SFMTA Ridership Data", weight: 0.4, value: 94, type: "measured" },
              { name: "EPA Smart Location Database", weight: 0.35, value: 93, type: "measured" },
              { name: "AI Green Commute Model", weight: 0.25, value: 87, type: "estimated" },
            ],
            frames: {
              neutral: "Green Transit Score: 92",
              positive: "Better than 91% of U.S. cities for eco-friendly transit options",
              negative: "Falls behind 9% of comparable neighborhoods in green transportation access",
            },
          },
          {
            name: "Bike Infrastructure",
            score: 82,
            confidence: 85,
            sources: [
              { name: "PeopleForBikes City Ratings", weight: 0.4, value: 84, type: "measured" },
              { name: "SFMTA Bike Strategy Data", weight: 0.35, value: 83, type: "measured" },
              { name: "AI Cycling Safety & Access Model", weight: 0.25, value: 77, type: "estimated" },
            ],
            frames: {
              neutral: "Bike Infrastructure: 82",
              positive: "Better than 80% of major U.S. cities for cycling infrastructure",
              negative: "Falls behind 20% of comparable neighborhoods in bike-friendliness",
            },
          },
          {
            name: "Renewable Energy",
            score: 83,
            confidence: 84,
            sources: [
              { name: "CA Energy Commission Local Data", weight: 0.4, value: 85, type: "measured" },
              { name: "EIA State Electricity Profiles", weight: 0.35, value: 84, type: "measured" },
              { name: "AI Solar Adoption Estimate", weight: 0.25, value: 78, type: "estimated" },
            ],
            frames: {
              neutral: "Renewable Energy: 83",
              positive: "Better than 81% of major California cities for renewable energy adoption",
              negative: "Falls behind 19% of comparable neighborhoods in clean energy transition",
            },
          },
          {
            name: "Green Space Coverage",
            score: 78,
            confidence: 83,
            sources: [
              { name: "Trust for Public Land ParkScore", weight: 0.4, value: 80, type: "measured" },
              { name: "USDA Urban Tree Canopy Assessment", weight: 0.35, value: 79, type: "measured" },
              { name: "AI Green Coverage Model", weight: 0.25, value: 73, type: "estimated" },
            ],
            frames: {
              neutral: "Green Space Coverage: 78",
              positive: "Better than 75% of dense urban cities for green space and tree canopy",
              negative: "Falls behind 25% of comparable neighborhoods in urban green coverage",
            },
          },
        ],
      },
      {
        label: "Livability",
        score: 87,
        factors: [
          {
            name: "Walkability",
            score: 91,
            confidence: 94,
            sources: [
              { name: "Walk Score Index", weight: 0.45, value: 93, type: "measured" },
              { name: "USDOT Pedestrian Infrastructure Survey", weight: 0.3, value: 92, type: "measured" },
              { name: "AI Pedestrian Activity Model", weight: 0.25, value: 86, type: "estimated" },
            ],
            frames: {
              neutral: "Walkability: 91",
              positive: "Better than 93% of U.S. cities for pedestrian friendliness",
              negative: "Falls behind 7% of comparable neighborhoods in walkability infrastructure",
            },
          },
          {
            name: "Transit Access",
            score: 90,
            confidence: 92,
            sources: [
              { name: "SFMTA & BART Ridership Data", weight: 0.4, value: 92, type: "measured" },
              { name: "AllTransit Performance Score", weight: 0.35, value: 91, type: "measured" },
              { name: "AI Transit Connectivity Estimate", weight: 0.25, value: 85, type: "estimated" },
            ],
            frames: {
              neutral: "Transit Access: 90",
              positive: "Better than 91% of U.S. cities for public transit connectivity",
              negative: "Falls behind 9% of comparable neighborhoods in transit service quality",
            },
          },
          {
            name: "Parks & Recreation",
            score: 85,
            confidence: 88,
            sources: [
              { name: "Trust for Public Land ParkScore", weight: 0.4, value: 87, type: "measured" },
              { name: "SF Rec & Parks Department Inventory", weight: 0.35, value: 86, type: "measured" },
              { name: "AI Green Space Coverage Model", weight: 0.25, value: 80, type: "estimated" },
            ],
            frames: {
              neutral: "Parks & Recreation: 85",
              positive: "Better than 84% of major U.S. cities for park access and outdoor recreation",
              negative: "Falls behind 16% of comparable neighborhoods in recreational space availability",
            },
          },
          {
            name: "Grocery & Essentials Access",
            score: 89,
            confidence: 91,
            sources: [
              { name: "USDA Food Access Research Atlas", weight: 0.4, value: 91, type: "measured" },
              { name: "Yelp Business Density Index", weight: 0.35, value: 90, type: "measured" },
              { name: "AI Essential Services Proximity Model", weight: 0.25, value: 84, type: "estimated" },
            ],
            frames: {
              neutral: "Grocery & Essentials Access: 89",
              positive: "Better than 90% of major U.S. cities for everyday shopping and services",
              negative: "Falls behind 10% of comparable neighborhoods in essential services convenience",
            },
          },
        ],
      },
      {
        label: "Safety",
        score: 58,
        factors: [
          {
            name: "Violent Crime Rate",
            score: 52,
            confidence: 91,
            sources: [
              { name: "FBI UCR Crime Statistics", weight: 0.45, value: 54, type: "measured" },
              { name: "SFPD CompStat Reports", weight: 0.35, value: 53, type: "measured" },
              { name: "AI Crime Trend Projection", weight: 0.2, value: 46, type: "estimated" },
            ],
            frames: {
              neutral: "Violent Crime Rate: 52",
              positive: "Better than 44% of major U.S. cities for violent crime safety",
              negative: "Falls behind 56% of comparable neighborhoods in violent crime prevention",
            },
          },
          {
            name: "Property Crime Rate",
            score: 42,
            confidence: 89,
            sources: [
              { name: "FBI UCR Property Crime Data", weight: 0.4, value: 44, type: "measured" },
              { name: "SFPD Property Crime Reports", weight: 0.35, value: 43, type: "measured" },
              { name: "AI Property Crime Risk Model", weight: 0.25, value: 37, type: "estimated" },
            ],
            frames: {
              neutral: "Property Crime Rate: 42",
              positive: "Better than 33% of major U.S. cities for property safety",
              negative: "Falls behind 67% of comparable neighborhoods in property crime prevention",
            },
          },
          {
            name: "Traffic Safety",
            score: 64,
            confidence: 84,
            sources: [
              { name: "NHTSA Fatality Analysis Reporting System", weight: 0.4, value: 66, type: "measured" },
              { name: "CA Office of Traffic Safety Rankings", weight: 0.35, value: 65, type: "measured" },
              { name: "AI Traffic Incident Density Model", weight: 0.25, value: 59, type: "estimated" },
            ],
            frames: {
              neutral: "Traffic Safety: 64",
              positive: "Better than 57% of dense urban cities for traffic-related safety",
              negative: "Falls behind 43% of comparable neighborhoods in traffic safety outcomes",
            },
          },
          {
            name: "Emergency Response Time",
            score: 76,
            confidence: 86,
            sources: [
              { name: "NFPA Response Time Benchmarks", weight: 0.4, value: 78, type: "measured" },
              { name: "SFFD Dispatch Records", weight: 0.35, value: 77, type: "measured" },
              { name: "AI Emergency Coverage Gap Estimate", weight: 0.25, value: 71, type: "estimated" },
            ],
            frames: {
              neutral: "Emergency Response Time: 76",
              positive: "Better than 73% of major U.S. cities for emergency services response",
              negative: "Falls behind 27% of comparable neighborhoods in emergency response speed",
            },
          },
        ],
      },
      {
        label: "Community",
        score: 86,
        factors: [
          {
            name: "Family Friendliness",
            score: 68,
            confidence: 83,
            sources: [
              { name: "GreatSchools District Rating", weight: 0.4, value: 70, type: "measured" },
              { name: "Census ACS Family Household Data", weight: 0.35, value: 69, type: "measured" },
              { name: "AI Family Suitability Index", weight: 0.25, value: 63, type: "estimated" },
            ],
            frames: {
              neutral: "Family Friendliness: 68",
              positive: "Better than 61% of major U.S. cities for raising a family",
              negative: "Falls behind 39% of comparable neighborhoods in family-oriented amenities",
            },
          },
          {
            name: "Cultural Amenities",
            score: 95,
            confidence: 94,
            sources: [
              { name: "NEA Arts & Culture Survey", weight: 0.4, value: 97, type: "measured" },
              { name: "Yelp Cultural Venue Density", weight: 0.35, value: 96, type: "measured" },
              { name: "AI Cultural Vibrancy Estimate", weight: 0.25, value: 90, type: "estimated" },
            ],
            frames: {
              neutral: "Cultural Amenities: 95",
              positive: "Better than 96% of U.S. cities for arts, culture, and creative communities",
              negative: "Falls behind 4% of comparable neighborhoods in cultural programming and venues",
            },
          },
          {
            name: "Diversity Index",
            score: 90,
            confidence: 93,
            sources: [
              { name: "Census ACS Diversity & Inclusion Index", weight: 0.45, value: 92, type: "measured" },
              { name: "USA Today Diversity Index", weight: 0.3, value: 91, type: "measured" },
              { name: "AI Demographic Diversity Model", weight: 0.25, value: 85, type: "estimated" },
            ],
            frames: {
              neutral: "Diversity Index: 90",
              positive: "Better than 92% of major U.S. cities for demographic and cultural diversity",
              negative: "Falls behind 8% of comparable neighborhoods in community diversity representation",
            },
          },
          {
            name: "Nightlife & Entertainment",
            score: 91,
            confidence: 92,
            sources: [
              { name: "Yelp Nightlife Venue Index", weight: 0.4, value: 93, type: "measured" },
              { name: "Google Maps Late-Night POI Density", weight: 0.35, value: 92, type: "measured" },
              { name: "AI Entertainment Activity Estimate", weight: 0.25, value: 86, type: "estimated" },
            ],
            frames: {
              neutral: "Nightlife & Entertainment: 91",
              positive: "Better than 93% of U.S. cities for nightlife density, variety, and quality",
              negative: "Falls behind 7% of comparable neighborhoods in entertainment offerings",
            },
          },
        ],
      },
      {
        label: "Growth",
        score: 82,
        factors: [
          {
            name: "Job Market Strength",
            score: 88,
            confidence: 91,
            sources: [
              { name: "BLS Local Area Unemployment Statistics", weight: 0.4, value: 90, type: "measured" },
              { name: "Census LEHD Employment Data", weight: 0.35, value: 89, type: "measured" },
              { name: "AI Job Growth Trajectory Model", weight: 0.25, value: 83, type: "estimated" },
            ],
            frames: {
              neutral: "Job Market Strength: 88",
              positive: "Better than 90% of major U.S. cities for employment opportunity and tech sector growth",
              negative: "Falls behind 10% of comparable neighborhoods in job market dynamism",
            },
          },
          {
            name: "Property Value Trend",
            score: 82,
            confidence: 89,
            sources: [
              { name: "Zillow Home Value Index", weight: 0.4, value: 84, type: "measured" },
              { name: "CoreLogic Home Price Index", weight: 0.35, value: 83, type: "measured" },
              { name: "AI Property Appreciation Forecast", weight: 0.25, value: 77, type: "estimated" },
            ],
            frames: {
              neutral: "Property Value Trend: 82",
              positive: "Better than 80% of major U.S. cities for sustained property appreciation",
              negative: "Falls behind 20% of comparable neighborhoods in long-term property value gains",
            },
          },
          {
            name: "New Development Pipeline",
            score: 74,
            confidence: 82,
            sources: [
              { name: "SF Planning Department Permit Records", weight: 0.4, value: 76, type: "measured" },
              { name: "CoStar Commercial Development Tracker", weight: 0.35, value: 75, type: "measured" },
              { name: "AI Development Momentum Estimate", weight: 0.25, value: 69, type: "estimated" },
            ],
            frames: {
              neutral: "New Development Pipeline: 74",
              positive: "Better than 71% of major California cities for new development investment",
              negative: "Falls behind 29% of comparable neighborhoods in development pipeline volume",
            },
          },
          {
            name: "Rent Affordability",
            score: 28,
            confidence: 95,
            sources: [
              { name: "Census ACS Median Gross Rent", weight: 0.4, value: 30, type: "measured" },
              { name: "Apartment List Rent Estimates", weight: 0.35, value: 29, type: "measured" },
              { name: "AI Rent Burden Projection Model", weight: 0.25, value: 23, type: "estimated" },
            ],
            frames: {
              neutral: "Rent Affordability: 28",
              positive: "Better than 18% of major U.S. cities for rental affordability",
              negative: "Falls behind 82% of comparable neighborhoods in rental cost accessibility",
            },
          },
        ],
      },
    ],
  },
];

export function getNeighborhoodById(id) {
  return neighborhoods.find((n) => n.id === id)
    || _getGenerated()[id] || null
}

export function getAllNeighborhoods() {
  return [...neighborhoods, ...Object.values(_getGenerated())]
}

// Inline accessor — avoids top-level import of useStore to keep this file dependency-free.
// useStore is guaranteed loaded before any call to these functions (React has already mounted).
function _getGenerated() {
  try {
    const raw = localStorage.getItem('locus_generated_neighborhoods')
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

