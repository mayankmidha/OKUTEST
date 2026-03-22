export interface AssessmentOption {
  label: string;
  value: number;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
}

export interface AssessmentScoreRange {
  min: number;
  max: number;
  result: string;
  description: string;
}

export interface AssessmentDefinition {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  questions: AssessmentQuestion[];
  options: AssessmentOption[];
  scoring: AssessmentScoreRange[];
}

export const ASSESSMENTS: AssessmentDefinition[] = [
  {
    id: "phq9",
    slug: "depression",
    title: "Depression Assessment (PHQ-9)",
    description: "A clinically validated tool to monitor mood and well-being.",
    category: "Mood",
    questions: [
      { id: "1", text: "Little interest or pleasure in doing things?" },
      { id: "2", text: "Feeling down, depressed, or hopeless?" },
      { id: "3", text: "Trouble falling or staying asleep, or sleeping too much?" },
      { id: "4", text: "Feeling tired or having little energy?" },
      { id: "5", text: "Poor appetite or overeating?" },
      { id: "6", text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down?" },
      { id: "7", text: "Trouble concentrating on things, such as reading the newspaper or watching television?" },
      { id: "8", text: "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual?" },
      { id: "9", text: "Thoughts that you would be better off dead or of hurting yourself in some way?" }
    ],
    options: [
      { label: "Not at all", value: 0 },
      { label: "Several days", value: 1 },
      { label: "More than half the days", value: 2 },
      { label: "Nearly every day", value: 3 }
    ],
    scoring: [
      { min: 0, max: 4, result: "Minimal depression", description: "Your score indicates minimal symptoms of depression." },
      { min: 5, max: 9, result: "Mild depression", description: "Your score indicates mild symptoms of depression." },
      { min: 10, max: 14, result: "Moderate depression", description: "Your score indicates moderate symptoms of depression." },
      { min: 15, max: 19, result: "Moderately severe depression", description: "Your score indicates moderately severe symptoms of depression." },
      { min: 20, max: 27, result: "Severe depression", description: "Your score indicates severe symptoms of depression." }
    ]
  },
  {
    id: "gad7",
    slug: "anxiety",
    title: "Anxiety Assessment (GAD-7)",
    description: "Check for symptoms of Generalized Anxiety Disorder.",
    category: "Anxiety",
    questions: [
      { id: "1", text: "Feeling nervous, anxious or on edge?" },
      { id: "2", text: "Not being able to stop or control worrying?" },
      { id: "3", text: "Worrying too much about different things?" },
      { id: "4", text: "Trouble relaxing?" },
      { id: "5", text: "Being so restless that it is hard to sit still?" },
      { id: "6", text: "Becoming easily annoyed or irritable?" },
      { id: "7", text: "Feeling afraid as if something awful might happen?" }
    ],
    options: [
      { label: "Not at all", value: 0 },
      { label: "Several days", value: 1 },
      { label: "More than half the days", value: 2 },
      { label: "Nearly every day", value: 3 }
    ],
    scoring: [
      { min: 0, max: 4, result: "Minimal anxiety", description: "Your score indicates minimal symptoms of anxiety." },
      { min: 5, max: 9, result: "Mild anxiety", description: "Your score indicates mild symptoms of anxiety." },
      { min: 10, max: 14, result: "Moderate anxiety", description: "Your score indicates moderate symptoms of anxiety." },
      { min: 15, max: 21, result: "Severe anxiety", description: "Your score indicates severe symptoms of anxiety." }
    ]
  },
  {
    id: "asrs",
    slug: "adhd",
    title: "ADHD Self-Report Scale (ASRS)",
    description: "Screen for symptoms of ADHD in adults.",
    category: "Neurodivergence",
    questions: [
      { id: "1", text: "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?" },
      { id: "2", text: "How often do you have difficulty getting things in order when you have to do a task that requires organization?" },
      { id: "3", text: "How often do you have problems remembering appointments or obligations?" },
      { id: "4", text: "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?" },
      { id: "5", text: "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?" },
      { id: "6", text: "How often do you feel overly active and compelled to do things, as if you were driven by a motor?" }
    ],
    options: [
      { label: "Never", value: 0 },
      { label: "Rarely", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Often", value: 3 },
      { label: "Very Often", value: 4 }
    ],
    scoring: [
      { min: 0, max: 13, result: "Unlikely ADHD", description: "Your symptoms do not strongly correlate with ADHD." },
      { min: 14, max: 24, result: "Possible ADHD", description: "Your symptoms suggest you may have ADHD. Professional evaluation is recommended." }
    ]
  },
  {
    id: "oci-r",
    slug: "ocd",
    title: "OCD Assessment (OCI-R)",
    description: "Screening for Obsessive-Compulsive Disorder symptoms.",
    category: "OCD",
    questions: [
      { id: "1", text: "I check things more often than necessary." },
      { id: "2", text: "I wash my hands more often and longer than necessary." },
      { id: "3", text: "I am upset by unpleasant thoughts that come into my mind against my will." },
      { id: "4", text: "I feel that I must repeat certain numbers or words." },
      { id: "5", text: "I need to have things in a certain order." },
      { id: "6", text: "I collect things I don't need." }
    ],
    options: [
      { label: "Not at all", value: 0 },
      { label: "A little", value: 1 },
      { label: "Moderately", value: 2 },
      { label: "A lot", value: 3 },
      { label: "Extremely", value: 4 }
    ],
    scoring: [
      { min: 0, max: 10, result: "Low probability of OCD", description: "Your score is below the typical clinical threshold." },
      { min: 11, max: 24, result: "High probability of OCD", description: "Your score suggests significant OCD symptoms." }
    ]
  },
  {
    id: "pcl5",
    slug: "trauma",
    title: "Trauma Screening (PCL-5)",
    description: "A standard 20-item questionnaire used to screen for symptoms of PTSD.",
    category: "Trauma",
    questions: [
      { id: "1", text: "Repeated, disturbing, and unwanted memories of the stressful experience?" },
      { id: "2", text: "Repeated, disturbing dreams of the stressful experience?" },
      { id: "3", text: "Suddenly feeling or acting as if the stressful experience were actually happening again?" },
      { id: "4", text: "Feeling very upset when something reminded you of the stressful experience?" },
      { id: "5", text: "Having strong physical reactions when something reminded you of the stressful experience (heart pounding, trouble breathing, sweating)?" },
      { id: "6", text: "Avoiding memories, thoughts, or feelings related to the stressful experience?" }
    ],
    options: [
      { label: "Not at all", value: 0 },
      { label: "A little bit", value: 1 },
      { label: "Moderately", value: 2 },
      { label: "Quite a bit", value: 3 },
      { label: "Extremely", value: 4 }
    ],
    scoring: [
      { min: 0, max: 10, result: "Low probability of PTSD", description: "Your symptoms do not currently suggest a high likelihood of PTSD." },
      { min: 11, max: 24, result: "Possible PTSD", description: "Your score suggests some symptoms of trauma. A clinical interview is recommended." }
    ]
  },
  {
    id: "iq-cognitive",
    slug: "cognitive-profile",
    title: "Intelligence & Cognitive Profile",
    description: "An advanced evaluation of reasoning, pattern recognition, and cognitive processing.",
    category: "IQ & Cognitive",
    questions: [
      { id: "1", text: "Which number comes next in the series: 2, 4, 8, 16, ...?" },
      { id: "2", text: "Choose the word that is most opposite to 'Equanimity'." },
      { id: "3", text: "If all Zags are Zogs, and some Zogs are Zugs, are all Zags necessarily Zugs?" },
      { id: "4", text: "Identify the pattern: A1, B2, C3, ... what is the 5th item?" },
      { id: "5", text: "How often do you find yourself mentally rotating objects to understand their structure?" },
      { id: "6", text: "A cube has 6 faces. If you paint all faces and cut it into 27 small cubes, how many have 0 faces painted?" }
    ],
    options: [
      { label: "Option A / Low Frequency", value: 5 },
      { label: "Option B / Medium Frequency", value: 10 },
      { label: "Option C / High Frequency", value: 15 },
      { label: "Option D / Exceptional", value: 20 }
    ],
    scoring: [
      { min: 0, max: 40, result: "Standard Processing", description: "Your cognitive profile is within the standard clinical range." },
      { min: 41, max: 80, result: "High Cognitive Velocity", description: "Your profile indicates rapid pattern recognition and abstract reasoning." },
      { min: 81, max: 120, result: "Exceptional Cognitive Profile", description: "Your results suggest superior capabilities in fluid intelligence and complex logic." }
    ]
  }
];

export const CATEGORY_MATCHES: Record<string, string[]> = {
  'Mood': ['Depression', 'Mood Disorders', 'Bipolar'],
  'Anxiety': ['Anxiety', 'Panic Attacks', 'Phobias'],
  'Neurodivergence': ['ADHD', 'Autism', 'Executive Function'],
  'OCD': ['OCD', 'Intrusive Thoughts', 'Compulsions'],
  'Trauma': ['PTSD', 'Trauma', 'Childhood Trauma', 'EMDR']
};
