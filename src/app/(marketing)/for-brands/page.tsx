import {
  BusinessCasePage,
  type BusinessCasePageContent,
} from "@/components/marketing/BusinessCasePage";

const CONTENT: BusinessCasePageContent = {
  eyebrow: "For brands",
  heading: "Your customers already want to check. Give them something real to check against.",
  intro:
    "Right now, a shopper who wants to know if your product is genuine has no way to check — not in the shop, not online. That gap gets filled by guesswork, and sometimes by products wearing your name that you didn't make.",
  solutionHeading: "A public record your customers can search",
  solutionBody:
    "RigiTrace gives your brand a record every customer can look up in seconds: what you've registered, what evidence supports it, and a trust score with the reasons behind it — never just a number.",
  whatYouGet: [
    {
      title: "A verifiable identity",
      body: "A registered brand record and a public page for every product you publish.",
    },
    {
      title: "A trust score built on evidence",
      body: "Not a subscription tier — customers see the same score whether you're on the pilot or paying nothing at all.",
    },
    {
      title: "Visibility into reports",
      body: "See what's been flagged against your products so you can respond, instead of finding out secondhand.",
    },
    {
      title: "A dashboard we're building with you",
      body: "Product management and deeper trust insights are on the roadmap, shaped by what founding pilot brands actually need.",
    },
  ],
  howItWorks: [
    {
      title: "Apply to join the pilot",
      body: "Tell us about your brand and roughly how many products you'd want to register.",
    },
    {
      title: "Our team sets it up with you",
      body: "There's no self-serve signup yet — a person checks every brand and product before it goes live.",
    },
    {
      title: "You supply the evidence",
      body: "Certificates, batch records, photos — whatever supports your product's authenticity.",
    },
    {
      title: "Customers can verify immediately",
      body: "Once published, your product is searchable and verifiable on RigiTrace right away.",
    },
  ],
  faq: [
    {
      question: "Is this free?",
      answer: "Yes, for the pilot. There's no cost to join or to publish your products while we're in pilot.",
    },
    {
      question: "Do I need to do anything technical?",
      answer: "No. During the pilot, our team handles setup with you directly.",
    },
    {
      question: "Do I have to publish my whole catalogue?",
      answer: "No — you publish only the products you choose to register.",
    },
    {
      question: "What happens after the pilot?",
      answer: "Pricing is set with input from founding pilot partners before it applies to anyone.",
    },
  ],
  ctaHref: "/join-pilot?type=brand",
  ctaLabel: "Join the pilot",
  ctaSupportingText:
    "Applications are reviewed by hand — tell us about your brand and we'll take it from there.",
};

export default function ForBrandsPage() {
  return <BusinessCasePage content={CONTENT} />;
}
