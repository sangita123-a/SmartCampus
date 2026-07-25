import { PrismaClient, Role, SubscriptionStatus, BillingCycle, CouponType, ContactType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export interface RegisterCollegeInput {
  collegeName: string;
  collegeCode: string;
  collegeEmail: string;
  phone?: string;
  address?: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  planName: string; // Starter, Professional, Business, Enterprise
  billingCycle: 'MONTHLY' | 'YEARLY';
  trialDays?: number; // 7, 14, 30
  couponCode?: string;
  paymentProvider?: string; // razorpay, stripe, cash
}

export class SaasService {
  // Default Plans Data
  public static async getPlans() {
    let plans = await prisma.saasPlan.findMany({
      where: { isActive: true },
      orderBy: { monthlyPrice: 'asc' }
    });

    if (plans.length === 0) {
      // Seed default SaaS plans if database has none
      await prisma.saasPlan.createMany({
        data: [
          {
            name: 'Starter',
            code: 'starter',
            description: 'Ideal for small institutes & growing colleges starting digital management.',
            monthlyPrice: 199.00,
            yearlyPrice: 1990.00,
            userLimit: 250,
            storageLimit: 10,
            isPopular: false,
            features: [
              'Up to 250 Students & Staff',
              'Basic Attendance & Timetable',
              'Student & Faculty Management',
              'Fee Receipts & Financial Records',
              'Email Notifications',
              'Standard Support'
            ]
          },
          {
            name: 'Professional',
            code: 'pro',
            description: 'Full ERP suite built for established colleges with advanced exams & library.',
            monthlyPrice: 499.00,
            yearlyPrice: 4990.00,
            userLimit: 1000,
            storageLimit: 50,
            isPopular: true,
            features: [
              'Up to 1,000 Active Users',
              'QR Code & Biometric Attendance',
              'Examination & Result Processing',
              'Digital Library Catalog',
              'Parent Portal & SMS Gateway',
              'Priority 24/7 Support'
            ]
          },
          {
            name: 'Business',
            code: 'business',
            description: 'Designed for large educational institutes with multiple campuses.',
            monthlyPrice: 999.00,
            yearlyPrice: 9990.00,
            userLimit: 5000,
            storageLimit: 250,
            isPopular: false,
            features: [
              'Up to 5,000 Active Users',
              'Multi-Department Workflow',
              'Custom Fee Structures & Invoicing',
              'Audit Logs & Backup Manager',
              'Advanced Analytics & Clarity Ready',
              'Dedicated Account Manager'
            ]
          },
          {
            name: 'Enterprise',
            code: 'enterprise',
            description: 'Tailored infrastructure, unlimited capacity, dedicated servers & custom integrations.',
            monthlyPrice: 1999.00,
            yearlyPrice: 19990.00,
            userLimit: 50000,
            storageLimit: 1000,
            isPopular: false,
            features: [
              'Unlimited Users & Campuses',
              'Custom SLA & 99.9% Uptime Guarantee',
              'Dedicated Database & SLA',
              'Custom API Adapters & Payment Connectors',
              'On-Premise / Isolated Cloud Deploy',
              'VIP Support & Training'
            ]
          }
        ]
      });

      plans = await prisma.saasPlan.findMany({
        where: { isActive: true },
        orderBy: { monthlyPrice: 'asc' }
      });
    }

    return plans;
  }

  // Validate and calculate Coupon discount
  public static async validateCoupon(code: string, amount: number) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon || !coupon.isActive) {
      throw new Error('Invalid or inactive coupon code');
    }

    if (coupon.expiryDate && new Date() > coupon.expiryDate) {
      throw new Error('Coupon code has expired');
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      throw new Error('Coupon usage limit reached');
    }

    let discount = 0;
    if (coupon.discountType === CouponType.PERCENTAGE) {
      discount = (amount * Number(coupon.discountValue)) / 100;
    } else {
      discount = Number(coupon.discountValue);
    }

    const finalAmount = Math.max(0, amount - discount);

    return {
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: Number(coupon.discountValue),
      discountAmount: discount,
      finalAmount
    };
  }

  // Tenant Provisioning: College Registration & Admin Account Setup
  public static async registerAndProvisionTenant(input: RegisterCollegeInput) {
    const existingCollege = await prisma.college.findFirst({
      where: {
        OR: [
          { email: input.collegeEmail },
          { code: input.collegeCode.toUpperCase() }
        ]
      }
    });

    if (existingCollege) {
      throw new Error('College with this email or code already exists');
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: input.adminEmail }
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const tenantCode = input.collegeCode.toUpperCase();
    const hashedPassword = await bcrypt.hash(input.adminPassword, 10);
    const trialDays = input.trialDays || 14;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + (input.billingCycle === 'YEARLY' ? 365 : 30));
    
    const trialEndsAt = new Date();
    trialEndsAt.setDate(startDate.getDate() + trialDays);

    // Get selected plan or fallback
    const plan = await prisma.saasPlan.findFirst({
      where: { name: { equals: input.planName, mode: 'insensitive' } }
    });

    let baseAmount = plan ? (input.billingCycle === 'YEARLY' ? Number(plan.yearlyPrice) : Number(plan.monthlyPrice)) : 199;
    let discount = 0;

    if (input.couponCode) {
      try {
        const couponRes = await this.validateCoupon(input.couponCode, baseAmount);
        discount = couponRes.discountAmount;
      } catch (err) {
        // Continue without coupon if invalid
      }
    }

    const tax = baseAmount * 0.18; // 18% tax
    const totalAmount = baseAmount + tax - discount;

    // Atomic transaction for provisioning tenant
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create College
      const college = await tx.college.create({
        data: {
          name: input.collegeName,
          code: tenantCode,
          email: input.collegeEmail,
          phone: input.phone,
          address: input.address,
          status: 'ACTIVE',
          subscriptionPlan: (input.planName.toUpperCase() as any) || 'BASIC',
          subscriptionStart: startDate,
          subscriptionEnd: endDate
        }
      });

      // 2. Create College Admin
      const adminUser = await tx.user.create({
        data: {
          name: input.adminName,
          email: input.adminEmail,
          password: hashedPassword,
          role: Role.COLLEGE_ADMIN,
          collegeId: college.id,
          isActive: true,
          isVerified: true
        }
      });

      // 3. Initialize Default Departments
      const defaultDepts = [
        { name: 'Computer Science & Engineering', code: `${tenantCode}-CSE` },
        { name: 'Information Technology', code: `${tenantCode}-IT` },
        { name: 'Electronics & Communication', code: `${tenantCode}-ECE` },
        { name: 'Business Administration', code: `${tenantCode}-MBA` }
      ];

      for (const dept of defaultDepts) {
        await tx.department.create({
          data: {
            collegeId: college.id,
            name: dept.name,
            code: dept.code
          }
        });
      }

      // 4. Create Subscription
      const subscription = await tx.subscription.create({
        data: {
          collegeId: college.id,
          planId: plan?.id,
          planName: input.planName,
          billingCycle: input.billingCycle as BillingCycle,
          status: SubscriptionStatus.TRIALING,
          amount: baseAmount,
          currency: 'USD',
          startDate,
          endDate,
          trialEndsAt
        }
      });

      // 5. Generate Initial Invoice
      const invoiceNumber = `INV-${tenantCode}-${Date.now().toString().slice(-6)}`;
      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          collegeId: college.id,
          subscriptionId: subscription.id,
          amount: baseAmount,
          tax,
          discount,
          total: totalAmount,
          currency: 'USD',
          status: 'PENDING',
          paymentMethod: input.paymentProvider || 'cash',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      });

      // 6. Log Provisioning
      await tx.tenantProvisioningLog.create({
        data: {
          collegeId: college.id,
          tenantCode,
          status: 'SUCCESS',
          details: {
            adminEmail: adminUser.email,
            plan: input.planName,
            departments: defaultDepts.length
          }
        }
      });

      return { college, adminUser, subscription, invoice };
    });

    return result;
  }

  // Blog Management
  public static async getBlogPosts(category?: string, search?: string) {
    let posts = await prisma.blogPost.findMany({
      where: {
        isPublished: true,
        ...(category ? { category: { equals: category, mode: 'insensitive' } } : {}),
        ...(search ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { summary: { contains: search, mode: 'insensitive' } }
          ]
        } : {})
      },
      orderBy: { publishedAt: 'desc' }
    });

    if (posts.length === 0) {
      // Seed default blog posts if database is empty
      await prisma.blogPost.createMany({
        data: [
          {
            slug: 'transforming-college-administration-with-cloud-erp',
            title: 'Transforming College Administration with Cloud ERP Architecture',
            summary: 'How modern higher education institutions scale campus operations and administrative productivity.',
            content: 'Higher education is evolving rapidly. Cloud-native multi-tenant college ERP platforms allow institutions to manage admissions, digital attendance, semester examinations, and fee collections in real-time. SmartCampus provides robust automation tools for modern universities.',
            category: 'Technology',
            tags: ['EdTech', 'SaaS', 'CloudERP'],
            authorName: 'Dr. Rajesh Sharma',
            authorRole: 'Higher Ed Consultant',
            coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
          },
          {
            slug: 'top-5-features-every-smart-campus-needs',
            title: 'Top 5 Essential Features Every Modern Smart Campus Needs',
            summary: 'From QR-based student attendance to real-time financial invoicing and parent alerts.',
            content: 'Integrating academic workflows into a single interface simplifies campus management. Learn how automatic timetable generation, multi-tier user role permissions, and integrated payment gateways revolutionize university workflows.',
            category: 'Productivity',
            tags: ['Features', 'SmartCampus', 'Automation'],
            authorName: 'Ananya Verma',
            authorRole: 'Head of Product',
            coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'
          }
        ]
      });

      posts = await prisma.blogPost.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: 'desc' }
      });
    }

    return posts;
  }

  public static async getBlogPostBySlug(slug: string) {
    const post = await prisma.blogPost.findUnique({
      where: { slug }
    });
    if (!post) {
      throw new Error('Blog post not found');
    }
    return post;
  }

  // Contact & Lead Forms
  public static async submitContact(data: { name: string; email: string; phone?: string; college?: string; type?: string; message: string }) {
    return await prisma.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        college: data.college,
        type: (data.type?.toUpperCase() as ContactType) || ContactType.GENERAL,
        message: data.message
      }
    });
  }
}
