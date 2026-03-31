export const faqItems = [
  {
    id: "faq-1",
    question: "Are these images loaded from a live API?",
    answer: "No. This version uses embedded mock content only, so browsing stays fast and deterministic.",
    displayOrder: 1
  },
  {
    id: "faq-2",
    question: "Do I need to create an account?",
    answer: "No login or logout is required. All gallery features are available to anonymous visitors.",
    displayOrder: 2
  },
  {
    id: "faq-3",
    question: "Will my favorites stay after refresh?",
    answer: "Yes. Favorites are saved in your browser on this device and restored on revisit.",
    displayOrder: 3
  },
  {
    id: "faq-4",
    question: "Can I download full-size images?",
    answer: "Yes. Open an image in the modal and use the download action to save it.",
    displayOrder: 4
  }
].sort((a, b) => a.displayOrder - b.displayOrder);
