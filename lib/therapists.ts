export const therapists = [
  {
    id: 'dr-suraj-singh',
    name: 'Dr. Suraj Singh',
    title: 'Consultant Psychiatrist',
    specialties: ['Psychiatry', 'Medication Management', 'Clinical Assessment'],
    experience: '15+ years',
    rating: 4.9,
    image: '/uploads/2025/07/Dr.-Suraj-Singh-psychiatrist-e1751875182592-1022x1024.jpg',
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    consultationFee: 1500,
    languages: ['English', 'Hindi']
  },
  {
    id: 'tanisha-singh',
    name: 'Tanisha Singh',
    title: 'Clinical Psychologist (A.) & Psychodynamic Psychotherapist',
    specialties: ['Clinical Psychology', 'Psychodynamic Therapy', 'Trauma-Informed Care'],
    experience: '12+ years',
    rating: 4.8,
    image: '/uploads/2025/07/Tanisha_-821x1024.jpg',
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    },
    consultationFee: 1200,
    languages: ['English', 'Hindi']
  },
  {
    id: 'rananjay-singh',
    name: 'Rananjay Singh',
    title: 'Queer affirmative therapist and family therapist',
    specialties: ['Queer-Affirmative Therapy', 'Family Therapy', 'Relationship Counseling'],
    experience: '8+ years',
    rating: 4.9,
    image: '/uploads/2025/07/Rananjay--579x1024.jpg',
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    consultationFee: 1000,
    languages: ['English', 'Hindi']
  },
  {
    id: 'amna-ansari',
    name: 'Amna Ansari',
    title: 'Clinical psychologist (A.)',
    specialties: ['Clinical Psychology', 'Cognitive Behavioral Therapy', 'Anxiety Treatment'],
    experience: '6+ years',
    rating: 4.7,
    image: '/uploads/2025/07/Amna-670x1024.jpg',
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    consultationFee: 800,
    languages: ['English', 'Urdu']
  },
  {
    id: 'mohit-dudeja',
    name: 'Mohit Dudeja',
    title: 'Queer affirmative therapist',
    specialties: ['Queer-Affirmative Therapy', 'Gender Identity', 'LGBTQ+ Support'],
    experience: '5+ years',
    rating: 4.8,
    image: '/uploads/2025/07/Mohit-911x1024.jpg',
    availability: {
      monday: false,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    },
    consultationFee: 800,
    languages: ['English', 'Hindi']
  },
  {
    id: 'gursheel-kaur',
    name: 'Gursheel Kaur',
    title: 'Psychodynamic Psychotherapist',
    specialties: ['Psychodynamic Therapy', 'Depth Psychology', 'Trauma Work'],
    experience: '10+ years',
    rating: 4.9,
    image: '/uploads/2025/07/gursheel_pfp-1024x980.jpg',
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    consultationFee: 1000,
    languages: ['English', 'Punjabi', 'Hindi']
  }
]

export const getTherapistById = (id: string) => {
  return therapists.find(t => t.id === id)
}

export const getAvailableTherapists = () => {
  return therapists.filter(t => {
    const today = new Date().getDay()
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const todayName = dayNames[today]
    return t.availability[todayName as keyof typeof t.availability]
  })
}
