import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import { BookOpen, Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BlogPage() {
  const posts = [
    {
      slug: 'transforming-college-administration-with-cloud-erp',
      title: 'Transforming College Administration with Cloud ERP Architecture',
      summary: 'How modern higher education institutions scale campus operations and administrative productivity with multi-tenant cloud solutions.',
      category: 'Technology',
      authorName: 'Dr. Rajesh Sharma',
      publishedAt: 'July 24, 2026',
      coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
    },
    {
      slug: 'top-5-features-every-smart-campus-needs',
      title: 'Top 5 Essential Features Every Modern Smart Campus Needs',
      summary: 'From QR-based student attendance to real-time financial invoicing and parent alerts, explore the future of university automation.',
      category: 'Productivity',
      authorName: 'Ananya Verma',
      publishedAt: 'July 20, 2026',
      coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEOHead title="Blog & Higher Ed Insights - SmartCampus SaaS" />
      <Navbar variant="marketing" />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">EdTech & SaaS Insights</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-white">SmartCampus Blog</h1>
          <p className="mt-4 text-slate-400 text-base">
            Expert articles, case studies, and practical guides on college automation, digital attendance, and multi-tenant ERP operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <div key={post.slug} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-teal-500/50 transition group flex flex-col justify-between">
              <div>
                <div className="h-56 overflow-hidden relative">
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <span className="absolute top-4 left-4 bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-teal-400" /> {post.authorName}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-teal-400" /> {post.publishedAt}</span>
                  </div>

                  <h2 className="text-xl font-bold text-white group-hover:text-teal-400 transition mb-3">
                    {post.title}
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-bold text-sm">
                  Read Full Article <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
