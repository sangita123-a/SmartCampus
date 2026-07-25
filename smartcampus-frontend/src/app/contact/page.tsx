'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import { saasApi } from '@/services/saasApi';
import { Mail, Phone, Building2, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    type: 'DEMO',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saasApi.submitContact(formData);
      setSubmitted(true);
    } catch (err) {
      alert('Contact submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEOHead title="Contact SaaS Sales & Support - SmartCampus" />
      <Navbar variant="marketing" />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Get In Touch</span>
            <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-white">
              Let’s Talk About Your College SaaS Setup
            </h1>
            <p className="mt-4 text-slate-400 text-base leading-relaxed">
              Have questions about multi-tenant tenant provisioning, custom pricing, Razorpay/Stripe integrations, or migrating existing ERP databases? Our SaaS engineering team is here to assist.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                <Mail className="w-6 h-6 text-teal-400 shrink-0" />
                <div>
                  <h4 className="text-xs text-slate-500 uppercase font-bold">Email Inquiry</h4>
                  <p className="text-sm font-semibold text-white">saas-support@smartcampus.io</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                <Phone className="w-6 h-6 text-teal-400 shrink-0" />
                <div>
                  <h4 className="text-xs text-slate-500 uppercase font-bold">Direct Phone</h4>
                  <p className="text-sm font-semibold text-white">+1 (800) 555-CAMPUS</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                <Building2 className="w-6 h-6 text-teal-400 shrink-0" />
                <div>
                  <h4 className="text-xs text-slate-500 uppercase font-bold">Headquarters</h4>
                  <p className="text-sm font-semibold text-white">Tech Park Boulevard, Suite 400, CA</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-teal-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Thank you for reaching out. A SmartCampus SaaS specialist will contact you within 2 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Request a Demo or Sales Inquiry</h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Prof. David Miller"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Work Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="david@college.edu"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">College Name</label>
                    <input
                      type="text"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Oxford College"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Inquiry Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="DEMO">Request Live Platform Demo</option>
                    <option value="SALES">Enterprise Plan & Custom Pricing</option>
                    <option value="SUPPORT">Technical & API Support</option>
                    <option value="GENERAL">General Information</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Tell us about your student capacity and ERP needs..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> {loading ? 'Sending...' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
