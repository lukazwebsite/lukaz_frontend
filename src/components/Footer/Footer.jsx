'use client';

import Link from 'next/link';
import { Mail, MessageSquare } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Icon } from '@iconify/react';
import { useDashboard } from '@/context/DashboardContext';
import Subscription from './Subscription';

// Footer redesign: deep green panel, newsletter card, big LUKAZ watermark,
// four link columns, payment chips. The previous footer is kept, commented
// out, at the bottom of this file.

const contactLinks = [
  { label: 'Live Chat Concierge', href: 'https://m.me/Lukazshopbd', icon: <MessageSquare size={16} /> },
  { label: 'WhatsApp: +880 1334945615', href: 'https://wa.me/8801334945615', icon: <FaWhatsapp size={16} /> },
  { label: 'Facebook Official', href: 'https://www.facebook.com/Lukazshopbd', icon: <Icon icon="mingcute:facebook-line" width="16" height="16" /> },
  { label: 'support@lukazshop.com', href: 'mailto:support@lukazshop.com', icon: <Mail size={16} /> },
];

const panels = [
  {
    id: 'order',
    title: 'Order Info',
    items: [
      { label: 'Order Tracking', href: '/order-tracking', id: 'trackOrder' },
      { label: 'Pre Order Policy', href: '/preorder-policy' },
      { label: '7-Day Return Policy', href: '/refund-returned' },
      { label: 'WishList', href: '/dashboard', id: 'wishlist' },
    ],
  },
  {
    id: 'customer',
    title: 'Customer Care',
    items: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'My Account', href: '/dashboard', id: 'account' },
      { label: 'Login & Register', href: '/login' },
      { label: 'Showroom Outlets', href: '/outlets' },
    ],
  },
  {
    id: 'company',
    title: 'Company Info',
    items: [
      { label: 'About Us', href: '/about' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'International Order Policy', href: '/international-policy' },
    ],
  },
];

const paymentMethods = [
  'Cash on Delivery',
  'bKash',
  'Nagad',
  'Rocket',
  'Upay',
  'Visa',
  'Mastercard',
  'Amex',
  'DBBL Nexus',
];

const headingClass =
  'font-label mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#8DE8B8]';
const linkClass = 'text-sm text-white/90 transition hover:text-white hover:underline [overflow-wrap:anywhere]';

// Shown when Website Config -> Copyright has no sentences
const DEFAULT_COPYRIGHT = ['Copyright © 2025 B-Lukaz | All Rights Reserved.'];
const MAX_COPYRIGHT = 9;

// Bottom row. On a phone each sentence has its own row. From the breakpoint
// up, the sentences share one row, one column each: the first sits on the
// left, the last on the right, the ones between in the centre, and a lone
// sentence in the centre. Up to 4 sentences switch at md, more at lg so the
// columns stay wide enough. Full class names, so Tailwind can see them.
const copyrightLayouts = {
  md: {
    grid: ['', '', 'md:grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-4'],
    left: 'md:text-left',
    right: 'md:text-right',
  },
  lg: {
    grid: ['', '', '', '', '', 'lg:grid-cols-5', 'lg:grid-cols-6', 'lg:grid-cols-7', 'lg:grid-cols-8', 'lg:grid-cols-9'],
    left: 'lg:text-left',
    right: 'lg:text-right',
  },
};

export default function Footer({ copyright }) {
  const { setActiveSection } = useDashboard();

  const sentences = (Array.isArray(copyright) ? copyright : [])
    .filter((text) => typeof text === 'string' && text.trim() !== '')
    .slice(0, MAX_COPYRIGHT);
  const copyrightItems = sentences.length ? sentences : DEFAULT_COPYRIGHT;
  const total = copyrightItems.length;
  const layout = total <= 4 ? copyrightLayouts.md : copyrightLayouts.lg;

  return (
    <footer className="overflow-hidden bg-[#1D5E41] text-white">
      <div className="mx-auto max-w-[1640px] px-3 pt-12 pb-8 sm:px-4 md:px-10">
        {/* Newsletter */}
        <Subscription />

        {/* Link columns over the LUKAZ watermark */}
        <div className="relative">
          <span
            aria-hidden="true"
            className="font-heading pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 translate-y-[6%] md:translate-y-[-10%] select-none whitespace-nowrap font-black uppercase leading-[0.85] tracking-tight text-white/[0.06]"
            style={{ fontSize: 'clamp(60px, 24vw, 460px)' }}
          >
            Lukaz
          </span>

          <div className="relative grid grid-cols-2 gap-x-6 gap-y-10 pt-20 pb-10 md:pt-24 lg:grid-cols-4 lg:gap-x-10">
            <div className="col-span-2 lg:col-span-1">
              <h3 className={headingClass}>Contact Us</h3>
              <ul className="space-y-3">
                {contactLinks.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 ${linkClass}`}
                    >
                      <span className="shrink-0 text-[#8DE8B8]">{item.icon}</span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {panels.map((panel) => (
              <div key={panel.id}>
                <h3 className={headingClass}>{panel.title}</h3>
                <ul className="space-y-3">
                  {panel.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={() => setActiveSection(item?.id)}
                        className={linkClass}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Payment methods */}
        <div className="relative border-t border-white/10 pt-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-label text-xs font-semibold uppercase tracking-[0.15em] text-white">
              Accepted payment methods in Bangladesh
            </h3>
            <p className="font-label text-xs text-[#8DE8B8]">
              Steadfast Express Cash on Delivery · bKash Merchant
            </p>
          </div>

          <ul className="mt-5 flex flex-wrap gap-2.5">
            {paymentMethods.map((method) => (
              <li
                key={method}
                className="font-label rounded-lg border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white"
              >
                {method}
              </li>
            ))}
          </ul>
        </div>

        {/* Copyright */}
        <div className={`relative mt-10 grid gap-2 border-t border-white/10 pt-6 md:gap-x-6 ${layout.grid[total] || ''}`}>
          {copyrightItems.map((text, i) => {
            let align = 'text-center';
            if (total > 1 && i === 0) align = `text-center ${layout.left}`;
            else if (total > 1 && i === total - 1) align = `text-center ${layout.right}`;

            return (
              <p key={i} className={`font-label min-w-0 text-xs text-[#8DE8B8] [overflow-wrap:anywhere] ${align}`}>
                {text}
              </p>
            );
          })}
        </div>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Previous footer, kept for reference.
// ---------------------------------------------------------------------------
// 'use client';
// 
// import { useState } from 'react';
// import {  MessageCircle, Plus, Minus, Facebook } from 'lucide-react';
// import { FaWhatsapp,  } from 'react-icons/fa';
// import Container from '../shared/Container';
// import Link from 'next/link';
// import { useDashboard } from '@/context/DashboardContext';
// import { Icon } from '@iconify/react';
// import Subscription from './Subscription';
// import Image from 'next/image';
// 
// export default function Footer() {
//   const [openPanel, setOpenPanel] = useState(null);
//   const { activeSection, setActiveSection } = useDashboard()
//   const togglePanel = (panelId) => {
//     setOpenPanel(prev => (prev === panelId ? null : panelId));
//   };
// 
// 
//   const panels = [
//     {
//       id: "order",
//       title: "Order Info",
//       items: [
//         { label: "Order Tracking", href: "/order-tracking", id: "trackOrder", },
//         { label: "Pre Order", href: "/dashboard", id: "preOrder" },
//         { label: "Return Policy", href: "/refund-returned" },
//         { label: "WishList", href: "/dashboard", id: "wishlist" },
//         // { label: "Gift Vouchers", href: "/gift-voucher" },
// 
//       ],
//     },
//     {
//       id: "customer",
//       title: "Customer Care",
//       items: [
//         { label: "Contact Us", href: "/contact" },
//         { label: "My Account", href: "/dashboard", id: "account", },
//         { label: "Login", href: "/login" },
//         { label: "Sign Up", href: "/signup" },
//         { label: "Outlets", href: "/outlets" },
// 
//       ],
//     },
//     {
//       id: "company",
//       title: "Company Info",
//       items: [
//         { label: "About Us", href: "/about" },
//         { label: "Privacy Policy", href: "/privacy-policy" },
//         { label: "Term & Conditions", href: "/terms" },
//         { label: "Pre Order Policy", href: "/preorder-policy" },
//         { label: "International Order Policy", href: "/international-policy" },
// 
// 
//       ],
//     },
//   ];
// 
//   return (
//     <footer className="overflow-hidden">
//       <div className="bg-[#3A9E75] pt-12 pb-6">
//         <Container className="text-white mx-auto max-w-[1640px] ">
//           {/* Newsletter */}
//           <Subscription />
// 
//           <div className="mx-auto ">
//             <div className='grid gap-5  w-full justify-between grid-cols-1 sm:grid-cols-4'>
//               <div className="flex flex-col gap-6 text-md text-white mt-2 mb-8">
//                 <div className="flex items-center gap-2">
//                   <a
//                     href="https://m.me/Lukazshopp"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-2"
//                   >
//                     <MessageCircle size={18} />
//                     <span>Chat</span>
//                   </a>
//                 </div>
//                 {/* <div className="flex items-center gap-2">
//                   <MessageCircle size={18} />
//                   <span>Chat</span>
//                 </div> */}
//                 <div className="flex items-center gap-2">
//                   <a
//                     href="https://wa.me/8801752058475"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-2 "
//                   >
//                     <FaWhatsapp size={18} />
//                     <span>WhatsApp</span>
//                   </a>
//                 </div>
// 
// 
//                 <a
//                   href="https://www.facebook.com/Lukazshopp"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-2 cursor-pointer "
//                 >
//                   <Icon icon="mingcute:facebook-line" width="20" height="20" />
//                   <span>Facebook</span>
//                 </a>
// 
//                 <Link
//                   href="/contact"
//                   className="flex items-center gap-2">
//                   <Icon icon="material-symbols:mail-outline" width="20" height="20" />
//                   {/* <Mail size={16} /> */}
//                   <span>Contact Us</span>
//                 </Link>
// 
// 
//               </div>
//               {/* Panel Sections */}
//               {panels.map(panel => (
//                 <div key={panel.id}>
//                   {/* Desktop View */}
//                   <div className="hidden sm:block">
//                     <h3 className="text-2xl font-bold mb-3">{panel.title}</h3>
//                     <ul className="space-y-2 text-md text-gray-200">
//                       {panel.items.map((item, i) => (
//                         <li key={i}>
//                           <Link
//                             onClick={() => setActiveSection(item?.id)}
//                             href={item.href} className="text-gray-200 hover:text-gray-300">
//                             {item.label}
//                           </Link>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
// 
//                   {/* Mobile Accordion View */}
//                   <div className="sm:hidden ">
//                     <button
//                       onClick={() => togglePanel(panel.id)}
//                       className="w-full flex justify-between items-center text-left font-bold text-xl "
//                     >
//                       {panel.title}
//                       {openPanel === panel.id ? <Minus size={18} /> : <Plus size={18} />}
//                     </button>
// 
//                     <div
//                       className={`transition-all duration-500 ease-in-out overflow-hidden ${openPanel === panel.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
//                         }`}
//                     >
//                       <ul className="mt-2 space-y-2 text-md text-gray-200 pl-1">
//                         {panel.items.map((item, idx) => (
//                           <li key={idx}> <Link
//                             onClick={() => setActiveSection(item?.id)}
//                             href={item.href} className="text-gray-200 hover:text-gray-300">
//                             {item.label}
//                           </Link></li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
// 
// 
// 
//           <div className="hidden md:flex w-full mt-8 bg-white   items-center">
//             <Image
//               src="/images/payments/sll_all_s.webp"
//               alt="Available Payment Methods"
//               width={1640}
//               height={250}
//               className="w-full h-auto"
//             />
//           </div>
// 
//           <div className="flex md:hidden w-full mt-8 bg-white   items-center">
// 
//             <Image
//               src="/images/payments/sll_all_m.webp"
//               alt="Available Payment Methods"
//               width={1640}
//               height={250}
//               className="w-full h-auto"
// 
//             />
//           </div>
// 
// 
// 
// 
// 
// 
//         </Container>
//       </div>
//       <Container className="py-3 text-center bg-white">
//         <p>Copyright © 2025 B-Lukaz | All Rights Reserved.</p>
//       </Container>
//     </footer>
//   );
// }
