import { v4 as uuid } from 'uuid'
import type { ResumeData } from './types'

export function createDefaultResume(): ResumeData {
  return {
    contact: {
      name: 'Bullet Mamu',
      title: 'Product Marketing Manager',
      location: 'Toronto, Ontario',
      email: 'bullet.mamu@email.com',
      phone: '+1 (555) 123-4567',
      linkedin: 'in/bullet-mamu',
      website: '',
    },
    format: {
      template: 'classic',
      fontFamily: '"Merriweather", serif',
      fontSize: 9.5,
      lineHeight: 1.5,
      margin: 0.6,
      pageSize: 'letter',
      accentColor: '#1e293b',
      atsMode: false,
    },
    sections: [
      {
        id: uuid(),
        kind: 'summary',
        title: 'Summary',
        visible: true,
        content:
          'Results-driven marketing professional with 5+ years of experience launching products and driving growth across B2B and B2C channels. Skilled at translating customer insight into positioning that moves revenue.',
      },
      {
        id: uuid(),
        kind: 'experience',
        title: 'Experience',
        visible: true,
        items: [
          {
            id: uuid(),
            role: 'Senior Marketing Associate',
            company: 'Northwind Co.',
            location: 'Toronto, ON',
            startDate: 'Jan 2023',
            endDate: 'Present',
            current: true,
            bullets:
              'Led go-to-market strategy for 3 product launches, contributing to a 22% increase in qualified leads.\nPartnered with sales and design teams to build campaign assets used across email, web, and paid channels.\nOwned reporting on campaign performance, presenting insights to leadership on a monthly cadence.',
          },
          {
            id: uuid(),
            role: 'Marketing Coordinator',
            company: 'Bluebird Studio',
            location: 'Toronto, ON',
            startDate: 'Jun 2020',
            endDate: 'Dec 2022',
            current: false,
            bullets:
              'Managed social content calendar, growing combined follower base by 40% year over year.\nCoordinated logistics for 6 in-person and virtual events with 200+ attendees each.',
          },
        ],
      },
      {
        id: uuid(),
        kind: 'education',
        title: 'Education',
        visible: true,
        items: [
          {
            id: uuid(),
            degree: 'Bachelor of Arts with Honours – Information Technology',
            school: 'York University',
            location: 'Toronto, ON',
            startDate: '2022',
            endDate: '2026',
            details:
              'Relevant Courses: Database Management (SQL), IT Risk Management, Data Analysis, Systems Analysis & Design',
          },
        ],
      },
      {
        id: uuid(),
        kind: 'skills',
        title: 'Skills',
        visible: true,
        categories: [
          {
            id: uuid(),
            name: 'Core Skills',
            skills: 'Campaign Strategy\nMarketing Analytics\nA/B Testing\nStakeholder Management',
          },
          {
            id: uuid(),
            name: 'Tools',
            skills: 'SQL\nFigma\nHubSpot',
          },
        ],
      },
      {
        id: uuid(),
        kind: 'custom',
        title: 'Projects',
        visible: true,
        items: [
          {
            id: uuid(),
            heading: 'Personal Portfolio Website',
            subheading: 'React, TypeScript, Tailwind CSS',
            date: '2025',
            bullets:
              'Built and deployed a responsive portfolio site showcasing selected projects.\nImplemented dark mode and accessibility improvements based on user feedback.',
          },
        ],
      },
      {
        id: uuid(),
        kind: 'custom',
        title: 'Certifications',
        visible: true,
        items: [
          {
            id: uuid(),
            heading: 'Google Data Analytics Certificate',
            subheading: 'Google / Coursera',
            date: '2024',
            bullets: '',
          },
        ],
      },
      {
        id: uuid(),
        kind: 'custom',
        title: 'Volunteer Work',
        visible: true,
        items: [
          {
            id: uuid(),
            heading: 'Volunteer Coordinator',
            subheading: 'Toronto Community Food Bank',
            date: '2022 – Present',
            bullets:
              'Organized weekly food distribution events serving 200+ families.\nRecruited and trained a team of 15 volunteers.',
          },
        ],
      },
      {
        id: uuid(),
        kind: 'custom',
        title: 'Awards',
        visible: true,
        items: [
          {
            id: uuid(),
            heading: "Dean's Honour List",
            subheading: 'York University',
            date: '2023, 2024',
            bullets: '',
          },
        ],
      },
    ],
  }
}
