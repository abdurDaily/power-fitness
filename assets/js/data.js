/*
 * Power Fitness Gym — site content.
 * Edit this file to update plans, trainers, the class schedule, reviews, blog posts and media.
 *
 * Anything marked  SAMPLE  is placeholder content written for the demo.
 * Replace it with real information from the gym before the site goes live.
 */

const SITE = {
    name: 'Power Fitness Gym',
    whatsapp: '8801846379461',                 // number used for WhatsApp messages (no + or spaces)
    phones: [
        { label: 'Front desk', tel: '+8801846379461', display: '+880 1846-379461' },
        { label: 'Manager — Md. Luban Nahid Sayem', tel: '+8801810012935', display: '+880 1810-012935' }
    ],
    email: 'info@powerfitnessgym.com',          // SAMPLE — replace with the gym's real email
    address: '41 No. Dewanjee Pukur Lane, beside Didar Market, Opposite side of Roomghata Gate, Sirajuddowllah Road, Chittagong, Bangladesh',
    building: 'Mannan Bhaban (Ground Floor)',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Dewanjee+Pukur+Lane+Sirajuddowllah+Road+Chittagong',
    social: { facebook: '#', instagram: '#', youtube: '#' },   // SAMPLE — add real profile links
    /*
     * Optional: a form backend (e.g. Formspree, Google Apps Script, your own API).
     * When set, every form POSTs JSON here. When empty, forms open WhatsApp with the details filled in.
     */
    formEndpoint: ''
};

// SAMPLE prices (BDT) — confirm real rates with the gym
const PLANS = [
    {
        id: 'basic', name: 'Basic', tagline: 'Everything you need to start.',
        price: { monthly: 1500, quarterly: 4000, yearly: 15000 },
        features: ['Full gym floor access', 'Locker facility', 'Coach floor support', 'Free fitness assessment']
    },
    {
        id: 'standard', name: 'Standard', tagline: 'Our most popular way to train.', featured: true,
        price: { monthly: 2500, quarterly: 6500, yearly: 24000 },
        features: ['Everything in Basic', 'Personalised workout plan', 'Diet & nutrition guidance', 'All group classes', 'Monthly progress check-in']
    },
    {
        id: 'premium', name: 'Premium', tagline: 'Maximum results, maximum support.',
        price: { monthly: 4000, quarterly: 10500, yearly: 38000 },
        features: ['Everything in Standard', '8 personal training sessions / month', 'Online classes access', 'Priority coach support', 'Body composition tracking']
    }
];

const PERIODS = {
    monthly: { label: 'Monthly', suffix: '/ month' },
    quarterly: { label: 'Quarterly', suffix: '/ 3 months' },
    yearly: { label: 'Yearly', suffix: '/ year' }
};

const TRAINERS = [
    {
        name: 'Md. Luban Nahid Sayem',
        role: 'Manager & Coordinator',
        photo: 'assets/images/4.jpg', photoPosition: '46% 50%', photoZoom: 2.4,   // crops his portrait out of the gym poster
        specialties: ['Membership guidance', 'Member coordination', 'Gym operations'],
        experience: '',
        bio: 'Your first point of contact at Power Fitness — Sayem helps every new member choose the right plan, coach and schedule.'
    },
    // SAMPLE trainers — replace names, photos, qualifications and experience with the real team
    {
        name: 'Head Coach (sample)', role: 'Strength & Bodybuilding',
        photo: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80', photoPosition: '60% 30%',
        specialties: ['Muscle building', 'Powerlifting', 'Competition prep'],
        experience: '8+ years',
        bio: 'Builds progressive strength programs for beginners and competitive lifters alike.'
    },
    {
        name: 'Conditioning Coach (sample)', role: 'CrossFit & Weight Loss',
        photo: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&w=800&q=80', photoPosition: '55% 35%',
        specialties: ['CrossFit', 'Fat loss', 'HIIT'],
        experience: '5+ years',
        bio: 'High-energy sessions that build stamina and burn fat — scaled for every fitness level.'
    },
    {
        name: 'Yoga Coach (sample)', role: 'Yoga & Mobility',
        photo: 'https://images.unsplash.com/photo-1531715210939-d957bc76aee7?auto=format&fit=crop&w=800&q=80', photoPosition: '50% 30%',
        specialties: ['Yoga', 'Mobility', 'Recovery'],
        experience: '6+ years',
        bio: 'Improves flexibility, posture and recovery so you can train harder, for longer.'
    }
];

// SAMPLE timetable — Bangladesh week starts on Saturday
const SCHEDULE = {
    Saturday: [
        { time: '06:30', end: '07:30', name: 'Morning Strength', coach: 'Head Coach', level: 'All levels' },
        { time: '17:00', end: '18:00', name: 'CrossFit', coach: 'Conditioning Coach', level: 'Intermediate' },
        { time: '19:00', end: '20:00', name: 'Muscle Building', coach: 'Head Coach', level: 'All levels' }
    ],
    Sunday: [
        { time: '07:00', end: '08:00', name: 'Yoga & Mobility', coach: 'Yoga Coach', level: 'Beginner' },
        { time: '18:00', end: '19:00', name: 'Fat Burn HIIT', coach: 'Conditioning Coach', level: 'All levels' }
    ],
    Monday: [
        { time: '06:30', end: '07:30', name: 'Morning Strength', coach: 'Head Coach', level: 'All levels' },
        { time: '17:00', end: '18:00', name: 'Cardio Blast', coach: 'Conditioning Coach', level: 'Beginner' },
        { time: '20:00', end: '21:00', name: 'Online Live Class', coach: 'Conditioning Coach', level: 'All levels' }
    ],
    Tuesday: [
        { time: '07:00', end: '08:00', name: 'Yoga & Mobility', coach: 'Yoga Coach', level: 'Beginner' },
        { time: '18:00', end: '19:00', name: 'CrossFit', coach: 'Conditioning Coach', level: 'Intermediate' },
        { time: '19:00', end: '20:00', name: 'Muscle Building', coach: 'Head Coach', level: 'All levels' }
    ],
    Wednesday: [
        { time: '06:30', end: '07:30', name: 'Morning Strength', coach: 'Head Coach', level: 'All levels' },
        { time: '18:00', end: '19:00', name: 'Fat Burn HIIT', coach: 'Conditioning Coach', level: 'All levels' }
    ],
    Thursday: [
        { time: '07:00', end: '08:00', name: 'Yoga & Mobility', coach: 'Yoga Coach', level: 'Beginner' },
        { time: '17:00', end: '18:00', name: 'Cardio Blast', coach: 'Conditioning Coach', level: 'Beginner' },
        { time: '20:00', end: '21:00', name: 'Online Live Class', coach: 'Conditioning Coach', level: 'All levels' }
    ],
    Friday: [
        { time: '16:00', end: '17:30', name: 'Open Gym & Technique Clinic', coach: 'Head Coach', level: 'All levels' }
    ]
};

// SAMPLE reviews — replace with real member reviews (with their permission)
const TESTIMONIALS = [
    { name: 'Member name', since: 'Member since 2024', rating: 5, quote: 'The coaches actually watch your form and push you the right way. I have never been this consistent with training.' },
    { name: 'Member name', since: 'Member since 2023', rating: 5, quote: 'Clean equipment, friendly people and real guidance on food. I lost weight without feeling lost.' },
    { name: 'Member name', since: 'Member since 2025', rating: 5, quote: 'I started as a complete beginner. The team built me a simple plan and checked in every month.' },
    { name: 'Member name', since: 'Online member', rating: 5, quote: 'The online classes fit around my office hours. Same energy as being in the gym.' }
];

/*
 * Before/after transformations. Only add photos shared WITH THE MEMBER'S WRITTEN CONSENT.
 * Example: { name: 'Member name', result: '−12 kg in 16 weeks', before: 'assets/images/t1-before.jpg', after: 'assets/images/t1-after.jpg' }
 */
const TRANSFORMATIONS = [];

// Real members training at Power Fitness
const MEMBER_SPOTLIGHT = [
    { photo: 'assets/images/2.jpg', caption: 'Back day at Power Fitness' },
    { photo: 'assets/images/3.jpg', caption: 'Consistency pays off' }
];

const GALLERY = [
    { src: 'assets/images/1.jpg', alt: 'Power Fitness members and coaches together at the gym', category: 'Community', wide: true },
    { src: 'assets/images/2.jpg', alt: 'Member training at Power Fitness', category: 'Workouts' },
    { src: 'assets/images/3.jpg', alt: 'Member showing his progress in the gym mirror', category: 'Workouts' },
    { src: 'assets/images/5.jpg', alt: 'Member resting between sets on the cable machine', category: 'Facilities' },
    { src: 'assets/images/4.jpg', alt: 'Power Fitness Gym poster — Transform your body, transform your life', category: 'Community' },
    { src: 'assets/images/6.jpg', alt: 'The Power Fitness Gym training floor with benches, plates and dumbbell racks', category: 'Facilities' },
    { src: 'assets/images/8.jpg', alt: 'Finisher at the Chattogram International Marathon 2026', category: 'Achievements' },
    { src: 'assets/images/7.jpg', alt: '10.55 km finisher medal — Chattogram International Marathon 2026', category: 'Achievements' },
    { src: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80', alt: 'Training floor', category: 'Facilities' },
    { src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80', alt: 'Cardio and strength machines', category: 'Equipment' },
    { src: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1200&q=80', alt: 'Dumbbell rack', category: 'Equipment' },
    { src: 'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?auto=format&fit=crop&w=1200&q=80', alt: 'Coach spotting a bench press', category: 'Workouts' },
    { src: 'https://images.unsplash.com/photo-1580261450046-d0a30080dc9b?auto=format&fit=crop&w=1200&q=80', alt: 'Squat rack', category: 'Equipment' },
    { src: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=1200&q=80', alt: 'Cardio zone', category: 'Facilities' }
];

// Free stock clips from Mixkit (mixkit.co). Replace with the gym's own videos when available.
const VIDEOS = [
    { title: 'Pull-up power', tag: 'Workout', src: 'https://assets.mixkit.co/videos/23450/23450-720.mp4' },
    { title: 'Weighted push-ups', tag: 'Workout', src: 'https://assets.mixkit.co/videos/24309/24309-720.mp4' },
    { title: 'Tyre flips — CrossFit', tag: 'CrossFit', src: 'https://assets.mixkit.co/videos/23623/23623-720.mp4' },
    { title: 'Barbell curls', tag: 'Strength', src: 'https://assets.mixkit.co/videos/21272/21272-720.mp4' },
    { title: 'Incline dumbbell press', tag: 'Strength', src: 'https://assets.mixkit.co/videos/36692/36692-720.mp4' },
    { title: 'Warm-up routine', tag: 'Tips', src: 'https://assets.mixkit.co/videos/23906/23906-720.mp4' }
];

const POSTS = [
    {
        id: 'first-month', category: 'Workout guide', date: '2026-10-20', read: '4 min',
        title: '5 rules for your first month in the gym',
        image: 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=1000&q=80',
        excerpt: 'Starting is the hardest part. These five simple rules will keep you safe, consistent and motivated.',
        body: [
            ['h', 'Start lighter than you think'],
            ['p', 'Your muscles adapt quickly, but tendons and joints need more time. Pick weights you can lift for 10–12 clean reps and leave two reps "in the tank".'],
            ['h', 'Learn the big five movements'],
            ['p', 'Squat, hinge (deadlift), push, pull and carry. Ask a coach to check your form on each — good technique now saves months of setbacks later.'],
            ['h', 'Three days a week is plenty'],
            ['p', 'Consistency beats intensity. Three full-body sessions a week, with a rest day in between, is a proven starting point.'],
            ['h', 'Track something'],
            ['p', 'Write down your weights and reps. Seeing numbers climb is the best motivation there is.'],
            ['h', 'Sleep and eat like it matters'],
            ['p', 'Seven or more hours of sleep and enough protein at every meal do as much for your progress as the workouts themselves.']
        ]
    },
    {
        id: 'pre-post-food', category: 'Nutrition', date: '2026-10-12', read: '5 min',
        title: 'What to eat before and after a workout',
        image: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=1000&q=80',
        excerpt: 'Simple, local food choices that fuel your training and speed up recovery — no expensive supplements needed.',
        body: [
            ['h', 'Before training (1–2 hours)'],
            ['p', 'Choose easy-to-digest carbs with a little protein: a banana with yoghurt, ruti with egg, or chira with doi. Avoid heavy, oily food right before you train.'],
            ['h', 'After training (within 2 hours)'],
            ['p', 'Combine protein and carbs: rice with fish or chicken, dal with ruti, or eggs with bread. Protein repairs muscle; carbs refill energy.'],
            ['h', 'Hydration'],
            ['p', 'Drink water through the day, not just at the gym. In hot, humid weather add a pinch of salt or a glass of daab (coconut water) after long sessions.'],
            ['h', 'Keep it simple'],
            ['p', 'Hitting your daily protein and calorie targets matters far more than perfect timing. Use our calorie calculator to find your numbers.']
        ]
    },
    {
        id: 'full-body-plan', category: 'Training plan', date: '2026-10-02', read: '6 min',
        title: "A beginner's 3-day full-body plan",
        image: 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?auto=format&fit=crop&w=1000&q=80',
        excerpt: 'A complete, balanced routine you can start this week. Train Saturday, Monday and Wednesday.',
        body: [
            ['h', 'Day A'],
            ['p', 'Goblet squat 3×10 · Dumbbell bench press 3×10 · Seated cable row 3×12 · Plank 3×30 sec.'],
            ['h', 'Day B'],
            ['p', 'Romanian deadlift 3×10 · Shoulder press 3×10 · Lat pulldown 3×12 · Farmer carry 3×30 m.'],
            ['h', 'Day C'],
            ['p', 'Leg press 3×12 · Push-ups 3×max · Dumbbell row 3×10 · Dead bug 3×10 each side.'],
            ['h', 'How to progress'],
            ['p', 'When you can complete every set with good form, add a small amount of weight next session. Rest 60–90 seconds between sets. Ask any Power Fitness coach to show you the movements.']
        ]
    }
];
