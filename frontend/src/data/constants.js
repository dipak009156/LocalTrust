export const CITIES = [
  'Solapur','Pune','Mumbai','Nashik','Nagpur',
  'Aurangabad','Kolhapur','Sangli','Lucknow','Indore','Patna','Surat'
];

export const SKILLS_LIST = [
  { id: 'plumbing',   icon: '🚰', label: 'Plumbing' },
  { id: 'electrical', icon: '⚡', label: 'Electrical' },
  { id: 'cleaning',   icon: '🧹', label: 'Cleaning' },
  { id: 'carpentry',  icon: '🔨', label: 'Carpentry' },
  { id: 'ac',         icon: '❄️', label: 'AC Repair' },
  { id: 'appliances', icon: '🔧', label: 'Appliances' },
];

export const HEADINGS = {
  USER:   { title: 'Welcome to TrustWork', sub: 'Enter your mobile number to continue' },
  WORKER: { title: 'Join as a Partner',    sub: 'Enter your mobile number to get started' },
  ADMIN:  { title: 'Admin Login',          sub: 'Enter your mobile number' },
};

export const TEST_QUESTIONS = [
  {
    q: 'Water is leaking under the kitchen sink. What do you check first?',
    options: ['Main valve','P-trap and pipe joints','Water meter','Tap washer'],
    answer: 1,
  },
  {
    q: 'Which safety gear is essential before starting electrical work?',
    options: ['Goggles','Apron','Rubber insulated gloves','Hard hat'],
    answer: 2,
  },
  {
    q: "What does 'AC' stand for in cooling systems?",
    options: ['Air Cooler','Air Compressor','Air Conditioning','Auto Circulation'],
    answer: 2,
  },
  {
    q: 'A circuit breaker keeps tripping. Most likely cause?',
    options: ['Too many devices on one circuit','Wrong bulb wattage','Low voltage supply','Faulty meter reading'],
    answer: 0,
  },
  {
    q: 'Which tool cuts PVC pipes cleanly?',
    options: ['Hacksaw','Angle grinder','Pipe cutter','Jigsaw'],
    answer: 2,
  },
  {
    q: 'Before cleaning a home, what should you always do first?',
    options: ['Mop the floor','Ask customer for schedule','Remove loose items and inform customer of plan','Start with bathrooms'],
    answer: 2,
  },
];

export const PROGRESS_MAP = {
  profile: 16, location: 33, skills: 50,
  test: 66, aadhaar: 83, submitted: 100,
};

export const STEP_LABELS = {
  profile:   'Step 1 of 6 — Basic Profile',
  location:  'Step 2 of 6 — Service Area',
  skills:    'Step 3 of 6 — Your Skills',
  test:      'Step 4 of 6 — Skill Test',
  aadhaar:   'Step 5 of 6 — Identity Verification',
  submitted: 'Step 6 of 6 — Done',
};