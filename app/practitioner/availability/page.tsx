import { redirect } from 'next/navigation'

export default function AvailabilityRedirect() {
  redirect('/practitioner/schedule')
}
