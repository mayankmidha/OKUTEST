import Link from 'next/link'
import { ArrowRight, Users, Calendar, Brain, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 pb-8 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 sm:pb-12 md:pb-16 lg:pb-20 xl:pb-24">
            <main className="mt-10 mx-auto max-w-7xl sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-20">
              <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Transform Your Mental Health Journey
                </h1>
                <p className="mt-6 max-w-lg mx-auto text-xl text-blue-100">
                  Professional therapy at your fingertips. Connect with licensed therapists, 
                  complete assessments, and track your progress all in one secure platform.
                </p>
              </div>

              <div className="mt-10 sm:mt-12">
                <div className="sm:flex sm:justify-center sm:gap-4">
                  <div className="rounded-md shadow">
                    <Link
                      href="/auth/signup"
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-blue-600 hover:bg-blue-50 md:py-4 md:text-lg md:px-10 transition duration-150 ease-in-out"
                    >
                      Get Started as Client
                      <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3 sm:mt-4 rounded-md shadow">
                    <Link
                      href="/auth/practitioner-signup"
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-purple-600 hover:bg-purple-50 md:py-4 md:text-lg md:px-10 transition duration-150 ease-in-out"
                    >
                      Join as Therapist
                      <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90" />
          <div className="absolute inset-0">
            <div className="h-full w-full bg-blue-900 opacity-10" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
              Why Choose OKU Therapy?
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for mental wellness
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Professional care, evidence-based assessments, and secure platform all in one place.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-3">
              {/* For Clients */}
              <div className="relative">
                <div className="absolute -inset-px flex items-center">
                  <Users className="h-8 w-8 text-blue-600" aria-hidden="true" />
                </div>
                <div className="relative pl-9">
                  <h3 className="text-lg font-medium text-gray-900">For Clients</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Book appointments, complete assessments, and track your mental health progress with licensed therapists.
                  </p>
                </div>
              </div>

              {/* For Practitioners */}
              <div className="relative">
                <div className="absolute -inset-px flex items-center">
                  <Calendar className="h-8 w-8 text-blue-600" aria-hidden="true" />
                </div>
                <div className="relative pl-9">
                  <h3 className="text-lg font-medium text-gray-900">For Practitioners</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Manage your practice, schedule sessions, and help clients through our secure platform.
                  </p>
                </div>
              </div>

              {/* Assessments */}
              <div className="relative">
                <div className="absolute -inset-px flex items-center">
                  <Brain className="h-8 w-8 text-blue-600" aria-hidden="true" />
                </div>
                <div className="relative pl-9">
                  <h3 className="text-lg font-medium text-gray-900">Assessments</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Evidence-based screening tools including PHQ-9, GAD-7, DASS-21, and more.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
              Trusted & Secure
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-600" aria-hidden="true" />
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">HIPAA Compliant</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Your health information is protected with enterprise-grade security.
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">100%</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Licensed Professionals</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Only verified, licensed mental health professionals on our platform.
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">24/7</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Always Available</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Access care whenever you need it, wherever you are.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-2xl mx-auto text-center py-12 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to start your mental health journey?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-blue-100">
            Join thousands of clients and therapists already using OKU Therapy.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="rounded-md shadow">
              <Link
                href="/auth/signup"
                className="w-full flex items-center justify-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-blue-600 hover:bg-blue-50 md:py-4 md:text-lg md:px-10 transition duration-150 ease-in-out"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Platform
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/auth/signup" className="text-base text-gray-500 hover:text-gray-900">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="text-base text-gray-500 hover:text-gray-900">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Services
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/client/assessments" className="text-base text-gray-500 hover:text-gray-900">
                    Assessments
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="text-base text-gray-500 hover:text-gray-900">
                    Book Session
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Company
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="/about-us" className="text-base text-gray-500 hover:text-gray-900">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Legal
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; 2024 OKU Therapy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
