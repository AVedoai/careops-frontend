import Link from "next/link";
import { ArrowRight, CheckCircle, Zap, Users, Calendar, MessageSquare, BarChart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-center">
          <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CareOps
          </span>
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Login
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-4 lg:px-6 py-24">
        <div className="container mx-auto text-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Unified Operations Platform
              <br />
              <span className="text-gray-900">for Service Businesses</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
              Streamline customer management, automate bookings, and grow your service-based business
              with intelligent automation and real-time communication.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 h-12 px-8"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors border border-gray-300 bg-white hover:bg-gray-50 h-12 px-8"
              >
                View Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 lg:px-6 py-24 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
              Everything you need to run your business
            </h2>
            <p className="text-gray-600 md:text-lg max-w-2xl mx-auto">
              From customer contact to service delivery, CareOps handles it all with intelligent automation.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
              <MessageSquare className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Messaging</h3>
              <p className="text-gray-600">
                Unified inbox with SMS & email automation. Never miss a customer message again.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
              <Calendar className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Online Booking</h3>
              <p className="text-gray-600">
                Beautiful booking pages with automatic confirmations and calendar sync.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
              <Users className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Contact Management</h3>
              <p className="text-gray-600">
                Organize customer information with smart contact forms and lead tracking.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100">
              <Zap className="h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Automation</h3>
              <p className="text-gray-600">
                Smart workflows that handle follow-ups, reminders, and notifications automatically.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-red-50 to-red-100">
              <BarChart className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600">
                Track performance, customer satisfaction, and business growth metrics.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100">
              <CheckCircle className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Team Management</h3>
              <p className="text-gray-600">
                Role-based access, staff scheduling, and collaborative workspace tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 lg:px-6 py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">
              Ready to streamline your operations?
            </h2>
            <p className="mx-auto max-w-[600px] text-blue-100 md:text-lg">
              Join hundreds of service businesses already using CareOps to grow their operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors bg-white text-blue-600 hover:bg-gray-100 h-12 px-8"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 lg:px-6 py-12 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              CareOps
            </span>
          </div>
          <p className="text-gray-400">
            Unified operations platform for service-based businesses
          </p>
          <div className="mt-6 text-sm text-gray-500">
            © 2026 CareOps. Streamlining operations, one business at a time.
          </div>
        </div>
      </footer>
    </div>
  );
}
