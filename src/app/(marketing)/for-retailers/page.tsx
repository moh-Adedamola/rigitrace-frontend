import {
  BusinessCasePage,
  type BusinessCasePageContent,
} from "@/components/marketing/BusinessCasePage";

const CONTENT: BusinessCasePageContent = {
  eyebrow: "For retailers",
  heading: "Give customers a reason to trust where they're buying from.",
  intro:
    "A customer checking a product on RigiTrace has no way to tell your store apart from one selling the same item without the same guarantees. There's no visible signal for where's safe to buy from.",
  solutionHeading: "A verified place in the record",
  solutionBody:
    "Get verified on RigiTrace and your store appears in the \"Available at\" list on every product page you carry — right where a customer is already deciding whether to trust what they're about to buy.",
  whatYouGet: [
    {
      title: "A verified badge",
      body: "Tied to your registered store — physical, online, social commerce, or marketplace.",
    },
    {
      title: "Placement on product pages",
      body: "You appear in the \"Available at\" list on every product you link, seen by every customer who verifies it.",
    },
    {
      title: "A record customers can check",
      body: "Proof that you're a real, registered seller — not just a claim on a storefront.",
    },
    {
      title: "A dashboard we're building with you",
      body: "A list of your linked products and store profile page are on the roadmap, shaped by founding pilot retailers.",
    },
  ],
  howItWorks: [
    {
      title: "Apply to join the pilot",
      body: "Tell us about your store and roughly how many products you carry.",
    },
    {
      title: "Our team verifies your store",
      body: "There's no self-serve signup yet — a person checks every store before it goes live.",
    },
    {
      title: "We link the products you carry",
      body: "Manual during the pilot, so every listing is checked before it's public.",
    },
    {
      title: "You appear immediately",
      body: "Once linked, your store shows up on that product's verification page right away.",
    },
  ],
  faq: [
    {
      question: "Is this free?",
      answer: "Yes, for the pilot. There's no cost to join or to be listed while we're in pilot.",
    },
    {
      question: "Do I need to do anything technical?",
      answer: "No. During the pilot, our team handles setup and linking with you directly.",
    },
    {
      question: "Do I have to list everything I sell?",
      answer: "No — you're linked only to the products you choose to carry on RigiTrace.",
    },
    {
      question: "What happens after the pilot?",
      answer: "Pricing is set with input from founding pilot partners before it applies to anyone.",
    },
  ],
  ctaHref: "/join-pilot?type=retailer",
  ctaLabel: "Join the pilot",
  ctaSupportingText:
    "There's no self-serve signup — tell us about your store, or email rigitrace@gmail.com directly.",
};

export default function ForRetailersPage() {
  return <BusinessCasePage content={CONTENT} />;
}
