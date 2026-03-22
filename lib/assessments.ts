export interface AssessmentQuestion {
  id: string;
  text: string;
}

export interface AssessmentScoring {
  min: number;
  max: number;
  result: string;
  description: string;
}

export interface Assessment {
  id: string;
  slug: string;
  title: string;
  category: 'ADHD' | 'Anxiety & Depression' | 'Trauma' | 'Executive Function' | 'General';
  description: string;
  longDescription: string;
  timeEstimate: string;
  questionCount: number;
  questions: AssessmentQuestion[];
  options: { label: string; value: number }[];
  scoring: AssessmentScoring[];
}

export const ASSESSMENTS: Assessment[] = [
  {
    id: 'asrs-v1.1',
    slug: 'adhd-asrs',
    title: "Adult ADHD Self-Report Scale (ASRS-v1.1)",
    category: 'ADHD',
    description: "The WHO-validated 18-question screener for adult ADHD symptoms.",
    longDescription: "Developed in conjunction with the World Health Organization, the ASRS is a validated tool to help identify the symptoms of ADHD in adults. This screening is the first step in a professional diagnostic journey.",
    timeEstimate: "5 mins",
    questionCount: 6, // Focus on the Part-A screening version for high conversion
    questions: [
      { id: '1', text: "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?" },
      { id: '2', text: "How often do you have difficulty getting things in order when you have to do a task that requires organization?" },
      { id: '3', text: "How often do you have problems remembering appointments or obligations?" },
      { id: '4', text: "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?" },
      { id: '5', text: "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?" },
      { id: '6', text: "How often do you feel overly active and compelled to do things, as if you were driven by a motor?" }
    ],
    options: [
      { label: "Never", value: 0 },
      { label: "Rarely", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Often", value: 3 },
      { label: "Very Often", value: 4 }
    ],
    scoring: [
      { min: 0, max: 10, result: "Low Probability", description: "Your responses suggest a low probability of adult ADHD." },
      { min: 11, max: 24, result: "Strong Indication", description: "Your responses indicate a high probability of adult ADHD. A clinical diagnostic interview is highly recommended." }
    ]
  },
  {
    id: 'phq-9',
    slug: 'depression-phq9',
    title: "PHQ-9 (Patient Health Questionnaire)",
    category: 'Anxiety & Depression',
    description: "The clinical standard for measuring depression severity.",
    longDescription: "The PHQ-9 is a multipurpose instrument for screening, diagnosing, monitoring and measuring the severity of depression.",
    timeEstimate: "3 mins",
    questionCount: 9,
    questions: [
      { id: '1', text: "Little interest or pleasure in doing things" },
      { id: '2', text: "Feeling down, depressed, or hopeless" },
      { id: '3', text: "Trouble falling or staying asleep, or sleeping too much" },
      { id: '4', text: "Feeling tired or having little energy" },
      { id: '5', text: "Poor appetite or overeating" },
      { id: '6', text: "Feeling bad about yourself — or that you are a failure" },
      { id: '7', text: "Trouble concentrating on things, such as reading the newspaper" },
      { id: '8', text: "Moving or speaking so slowly that other people could have noticed?" },
      { id: '9', text: "Thoughts that you would be better off dead or of hurting yourself?" }
    ],
    options: [
      { label: "Not at all", value: 0 },
      { label: "Several days", value: 1 },
      { label: "More than half the days", value: 2 },
      { label: "Nearly every day", value: 3 }
    ],
    scoring: [
      { min: 0, max: 4, result: "Minimal Depression", description: "Your score suggests minimal to no depressive symptoms." },
      { min: 5, max: 9, result: "Mild Depression", description: "Your score suggests mild depressive symptoms." },
      { min: 10, max: 14, result: "Moderate Depression", description: "Your score suggests moderate depressive symptoms. Speaking with a therapist could be beneficial." },
      { min: 15, max: 27, result: "Severe Depression", description: "Your score suggests severe depressive symptoms. Please reach out for professional support immediately." }
    ]
  },
  {
    id: 'gad-7',
    slug: 'anxiety-gad7',
    title: "GAD-7 (General Anxiety Disorder)",
    category: 'Anxiety & Depression',
    description: "Validated 7-item scale for generalized anxiety symptoms.",
    longDescription: "The GAD-7 is a sensitive self-report scale to identify probable cases of Generalized Anxiety Disorder and assess symptom severity.",
    timeEstimate: "3 mins",
    questionCount: 7,
    questions: [
      { id: '1', text: "Feeling nervous, anxious or on edge" },
      { id: '2', text: "Not being able to stop or control worrying" },
      { id: '3', text: "Worrying too much about different things" },
      { id: '4', text: "Trouble relaxing" },
      { id: '5', text: "Being so restless that it is hard to sit still" },
      { id: '6', text: "Becoming easily annoyed or irritable" },
      { id: '7', text: "Feeling afraid as if something awful might happen" }
    ],
    options: [
      { label: "Not at all", value: 0 },
      { label: "Several days", value: 1 },
      { label: "More than half the days", value: 2 },
      { label: "Nearly every day", value: 3 }
    ],
    scoring: [
      { min: 0, max: 4, result: "Minimal Anxiety", description: "Your score suggests minimal anxiety levels." },
      { min: 5, max: 9, result: "Mild Anxiety", description: "Your score suggests mild anxiety levels." },
      { min: 10, max: 14, result: "Moderate Anxiety", description: "Your score suggests moderate anxiety levels." },
      { min: 15, max: 21, result: "Severe Anxiety", description: "Your score suggests severe anxiety levels." }
    ]
  },
  {
    id: 'pcl-5',
    slug: 'trauma-pcl5',
    title: "PCL-5 (PTSD Checklist)",
    category: 'Trauma',
    description: "The gold standard for assessing PTSD symptoms.",
    longDescription: "Used by the VA and trauma clinicians, the PCL-5 monitors PTSD symptoms aligned with the DSM-5 criteria.",
    timeEstimate: "8 mins",
    questionCount: 20,
    questions: [
      { id: '1', text: "Repeated, disturbing, and unwanted memories of the stressful experience?" },
      { id: '2', text: "Repeated, disturbing dreams of the stressful experience?" },
      { id: '3', text: "Suddenly feeling or acting as if the stressful experience were actually happening again?" },
      { id: '4', text: "Feeling very upset when something reminded you of the stressful experience?" },
      { id: '5', text: "Having strong physical reactions when something reminded you of the stressful experience?" },
      { id: '6', text: "Avoiding memories, thoughts, or feelings related to the stressful experience?" },
      { id: '7', text: "Avoiding external reminders of the stressful experience (people, places, conversations)?" },
      { id: '8', text: "Trouble remembering important parts of the stressful experience?" },
      { id: '9', text: "Having strong negative beliefs about yourself, other people, or the world?" },
      { id: '10', text: "Blaming yourself or someone else for the stressful experience or what happened after it?" },
      { id: '11', text: "Having strong negative feelings such as fear, horror, anger, guilt, or shame?" },
      { id: '12', text: "Loss of interest in activities that you used to enjoy?" },
      { id: '13', text: "Feeling distant or cut off from other people?" },
      { id: '14', text: "Trouble experiencing positive feelings (e.g., happiness, love)?" },
      { id: '15', text: "Irritable behavior, angry outbursts, or acting aggressively?" },
      { id: '16', text: "Taking too many risks or doing things that could cause you harm?" },
      { id: '17', text: "Being 'super alert' or watchful or on guard?" },
      { id: '18', text: "Feeling jumpy or easily startled?" },
      { id: '19', text: "Having difficulty concentrating?" },
      { id: '20', text: "Trouble falling or staying asleep?" }
    ],
    options: [
      { label: "Not at all", value: 0 },
      { label: "A little bit", value: 1 },
      { label: "Moderately", value: 2 },
      { label: "Quite a bit", value: 3 },
      { label: "Extremely", value: 4 }
    ],
    scoring: [
      { min: 0, max: 32, result: "Sub-Clinical Symptoms", description: "Your symptoms do not currently meet the clinical threshold for PTSD." },
      { min: 33, max: 80, result: "PTSD Likely", description: "Your score suggests that you may be experiencing symptoms of PTSD. A trauma-informed diagnostic session is recommended." }
    ]
  },
  {
    id: 'dass-21',
    slug: 'wellness-dass21',
    title: "DASS-21 (Depression, Anxiety, Stress)",
    category: 'General',
    description: "Simultaneous measurement of three key psychological states.",
    longDescription: "The DASS-21 is designed to measure the negative emotional states of depression, anxiety and stress. It provides a comprehensive emotional profile.",
    timeEstimate: "6 mins",
    questionCount: 21,
    questions: [
      { id: '1', text: "I found it hard to wind down" },
      { id: '2', text: "I was aware of dryness of my mouth" },
      { id: '3', text: "I couldn't seem to experience any positive feeling at all" },
      { id: '4', text: "I experienced breathing difficulty" },
      { id: '5', text: "I found it difficult to work up the initiative to do things" },
      { id: '6', text: "I tended to over-react to situations" },
      { id: '7', text: "I experienced trembling" },
      { id: '8', text: "I felt that I was using a lot of nervous energy" },
      { id: '9', text: "I was worried about situations in which I might panic and make a fool of myself" },
      { id: '10', text: "I felt that I had nothing to look forward to" },
      { id: '11', text: "I found myself getting agitated" },
      { id: '12', text: "I found it difficult to relax" },
      { id: '13', text: "I felt down-hearted and blue" },
      { id: '14', text: "I was intolerant of anything that kept me from getting on with what I was doing" },
      { id: '15', text: "I felt I was close to panic" },
      { id: '16', text: "I was unable to become enthusiastic about anything" },
      { id: '17', text: "I felt I wasn't worth much as a person" },
      { id: '18', text: "I felt that I was rather touchy" },
      { id: '19', text: "I was aware of the action of my heart in the absence of physical exertion" },
      { id: '20', text: "I felt scared without any good reason" },
      { id: '21', text: "I felt that life was meaningless" }
    ],
    options: [
      { label: "Never", value: 0 },
      { label: "Sometimes", value: 1 },
      { label: "Often", value: 2 },
      { label: "Almost Always", value: 3 }
    ],
    scoring: [
      { min: 0, max: 20, result: "Normal Range", description: "Your emotional states appear to be within the normal range." },
      { min: 21, max: 40, result: "Moderate Stress", description: "You are experiencing moderate levels of emotional distress." },
      { min: 41, max: 63, result: "High Distress", description: "Your scores indicate significant emotional distress across multiple categories." }
    ]
  },
  {
    id: 'conners-3-sr',
    slug: 'adhd-conners',
    title: "Conners 3 Self-Report (Screening)",
    category: 'ADHD',
    description: "The clinical gold standard for in-depth ADHD assessment.",
    longDescription: "The Conners 3 is a dependable tool for assessing ADHD and common comorbid problems. This screening version targets the core DSM-5 symptoms.",
    timeEstimate: "10 mins",
    questionCount: 15,
    questions: [
      { id: '1', text: "I have trouble keeping my mind on my work or tasks." },
      { id: '2', text: "I am easily distracted by things around me." },
      { id: '3', text: "I make careless mistakes." },
      { id: '4', text: "I have trouble finishing things I start." },
      { id: '5', text: "I have trouble organizing my tasks and activities." },
      { id: '6', text: "I avoid tasks that require a lot of mental effort." },
      { id: '7', text: "I lose things that I need for my work or activities." },
      { id: '8', text: "I am forgetful in my daily activities." },
      { id: '9', text: "I fidget with my hands or feet or squirm in my seat." },
      { id: '10', text: "I leave my seat when I am expected to stay seated." },
      { id: '11', text: "I feel restless or 'on the go'." },
      { id: '12', text: "I talk too much." },
      { id: '13', text: "I blurt out answers before the questions have been finished." },
      { id: '14', text: "I have trouble waiting my turn." },
      { id: '15', text: "I interrupt others when they are talking." }
    ],
    options: [
      { label: "Not at all", value: 0 },
      { label: "Just a little", value: 1 },
      { label: "Pretty much", value: 2 },
      { label: "Very much", value: 3 }
    ],
    scoring: [
      { min: 0, max: 15, result: "Low Clinical Significance", description: "Your scores are within the expected range for the general population." },
      { min: 16, max: 30, result: "Moderate Elevation", description: "Your scores suggest some difficulties with attention or hyperactivity." },
      { min: 31, max: 45, result: "High Clinical Significance", description: "Your scores are significantly elevated. A full ADHD diagnostic battery is recommended." }
    ]
  },
  {
    id: 'vanderbilt-sr',
    slug: 'adhd-vanderbilt',
    title: "Vanderbilt Assessment Scale",
    category: 'ADHD',
    description: "Comprehensive screening for ADHD and common comorbid conditions.",
    longDescription: "Originally designed for pediatrics, this adult self-report version helps identify ADHD subtypes plus comorbid anxiety or conduct issues.",
    timeEstimate: "8 mins",
    questionCount: 12,
    questions: [
      { id: '1', text: "Fails to give attentive to details or makes careless mistakes" },
      { id: '2', text: "Has difficulty sustaining attention to tasks or activities" },
      { id: '3', text: "Does not seem to listen when spoken to directly" },
      { id: '4', text: "Does not follow through on instructions and fails to finish work" },
      { id: '5', text: "Has difficulty organizing tasks and activities" },
      { id: '6', text: "Avoids, dislikes, or is reluctant to engage in tasks that require sustained mental effort" },
      { id: '7', text: "Loses things necessary for tasks or activities" },
      { id: '8', text: "Is easily distracted by extraneous stimuli" },
      { id: '9', text: "Is forgetful in daily activities" },
      { id: '10', text: "Fidgets with hands or feet or squirms in seat" },
      { id: '11', text: "Leaves seat in situations in which remaining seated is expected" },
      { id: '12', text: "Is 'on the go' or often acts as if 'driven by a motor'" }
    ],
    options: [
      { label: "Never", value: 0 },
      { label: "Occasionally", value: 1 },
      { label: "Often", value: 2 },
      { label: "Very Often", value: 3 }
    ],
    scoring: [
      { min: 0, max: 12, result: "Normal", description: "No significant ADHD indicators found." },
      { min: 13, max: 36, result: "High Indicator", description: "Significant indicators for ADHD subtypes identified." }
    ]
  },
  {
    id: 'bai',
    slug: 'anxiety-bai',
    title: "Beck Anxiety Inventory (BAI)",
    category: 'Anxiety & Depression',
    description: "A 21-item scale focused on physical and cognitive anxiety symptoms.",
    longDescription: "The BAI is a widely used 21-item self-report inventory used for measuring the severity of anxiety.",
    timeEstimate: "5 mins",
    questionCount: 21,
    questions: [
      { id: '1', text: "Numbness or tingling" },
      { id: '2', text: "Feeling hot" },
      { id: '3', text: "Wobbliness in legs" },
      { id: '4', text: "Unable to relax" },
      { id: '5', text: "Fear of worst happening" },
      { id: '6', text: "Dizzy or lightheaded" },
      { id: '7', text: "Heart pounding / racing" },
      { id: '8', text: "Unsteady" },
      { id: '9', text: "Terrified or afraid" },
      { id: '10', text: "Nervous" },
      { id: '11', text: "Feeling of choking" },
      { id: '12', text: "Hands trembling" },
      { id: '13', text: "Shaky / unsteady" },
      { id: '14', text: "Fear of losing control" },
      { id: '15', text: "Difficulty in breathing" },
      { id: '16', text: "Fear of dying" },
      { id: '17', text: "Scared" },
      { id: '18', text: "Indigestion" },
      { id: '19', text: "Faint / lightheaded" },
      { id: '20', text: "Face flushed" },
      { id: '21', text: "Hot/cold sweats" }
    ],
    options: [
      { label: "Not at all", value: 0 },
      { label: "Mildly (It did not bother me much)", value: 1 },
      { label: "Moderately (It was very unpleasant, but I could bear it)", value: 2 },
      { label: "Severely (I could barely stand it)", value: 3 }
    ],
    scoring: [
      { min: 0, max: 7, result: "Minimal Anxiety", description: "Levels are within a healthy, normal range." },
      { min: 8, max: 15, result: "Mild Anxiety", description: "Some physiological indicators of anxiety are present." },
      { min: 16, max: 25, result: "Moderate Anxiety", description: "Significant anxiety levels that may interfere with daily life." },
      { min: 26, max: 63, result: "Severe Anxiety", description: "Critical anxiety levels. Professional clinical intervention is advised." }
    ]
  },
  {
    id: 'mhi-5',
    slug: 'wellness-mhi5',
    title: "Mental Health Inventory (MHI-5)",
    category: 'General',
    description: "Rapid 5-question general psychological wellbeing screener.",
    longDescription: "A concise screening tool used globally to assess general mental health status and psychological distress.",
    timeEstimate: "2 mins",
    questionCount: 5,
    questions: [
      { id: '1', text: "How much of the time have you been a very nervous person?" },
      { id: '2', text: "How much of the time have you felt so down in the dumps that nothing could cheer you up?" },
      { id: '3', text: "How much of the time have you felt calm and peaceful?" },
      { id: '4', text: "How much of the time have you felt downhearted and blue?" },
      { id: '5', text: "How much of the time have you been a happy person?" }
    ],
    options: [
      { label: "None of the time", value: 1 },
      { label: "A little of the time", value: 2 },
      { label: "Some of the time", value: 3 },
      { label: "Most of the time", value: 4 },
      { label: "All of the time", value: 5 }
    ],
    scoring: [
      { min: 0, max: 15, result: "Significant Distress", description: "You are experiencing a high level of psychological distress." },
      { min: 16, max: 25, result: "Optimal Wellbeing", description: "Your general mental health score is within the healthy range." }
    ]
  },
  {
    id: 'brief-2-sr',
    slug: 'executive-brief2',
    title: "BRIEF-2 (Executive Function)",
    category: 'Executive Function',
    description: "Assessment for deficits in working memory, inhibition, and flexibility.",
    longDescription: "The BRIEF-2 targets the cognitive processes that allow us to plan, focus attention, and manage multiple tasks.",
    timeEstimate: "7 mins",
    questionCount: 10,
    questions: [
      { id: '1', text: "I have trouble sitting still." },
      { id: '2', text: "I act without thinking." },
      { id: '3', text: "I have trouble adjusting to new situations." },
      { id: '4', text: "I get upset easily." },
      { id: '5', text: "I have trouble getting started on tasks." },
      { id: '6', text: "I lose my place when I'm doing something." },
      { id: '7', text: "I have trouble planning ahead." },
      { id: '8', text: "I leave my room or workspace messy." },
      { id: '9', text: "I don't check my work for mistakes." },
      { id: '10', text: "I forget what I am doing in the middle of a task." }
    ],
    options: [
      { label: "Never", value: 0 },
      { label: "Sometimes", value: 1 },
      { label: "Often", value: 2 }
    ],
    scoring: [
      { min: 0, max: 7, result: "Effective Regulation", description: "Your executive functions are operating efficiently." },
      { min: 8, max: 14, result: "Mild Executive Dysfunction", description: "You may experience occasional issues with planning or focus." },
      { min: 15, max: 30, result: "Significant Executive Dysfunction", description: "Significant challenges in cognitive regulation identified." }
    ]
  }
];

export const CATEGORY_MATCHES: Record<string, string[]> = {
  'ADHD': ['Psychiatry', 'ADHD', 'Medication Management', 'Neurodivergence'],
  'Anxiety & Depression': ['Depression', 'Anxiety', 'OCD', 'Psychodynamic'],
  'Trauma': ['Trauma-Informed', 'PTSD', 'EMDR', 'Somatic'],
  'Executive Function': ['Neurodivergence', 'ADHD', 'Clinical Psychology'],
  'General': ['Individual Therapy', 'Wellness', 'Relational Therapy'],
};


