import { auth } from '@/auth';
import { ASSESSMENTS } from '@/lib/assessments';
import PublicAssessmentsClient from './PublicAssessmentsClient';

export default async function PublicAssessmentsPage() {
  const session = await auth();
  
  return (
    <PublicAssessmentsClient 
      isLoggedIn={!!session?.user} 
      assessments={ASSESSMENTS} 
    />
  );
}
