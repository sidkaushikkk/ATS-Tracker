import { useState } from "react";
import "./HomeSections.css";

const faqs = [
  {
    q: "What is ATS?",
    a: "ATS stands for Applicant Tracking System. It is software used by employers to automatically filter and rank resumes before a human ever reads them.",
  },
  {
    q: "Is my resume stored?",
    a: "No. Your resume is processed in memory and is never saved to our servers or shared with any third party.",
  },
  {
    q: "Which file formats are supported?",
    a: "We support PDF, DOCX, and TXT file formats. For best results, upload a PDF.",
  },
  {
    q: "Is the analysis free?",
    a: "Yes, the basic ATS analysis is completely free. Premium features are available for users who want deeper insights.",
  },
  {
    q: "How can I improve my score?",
    a: "Follow the suggestions in your report — add relevant keywords, fix formatting issues, quantify your achievements, and use standard section headings.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  function toggle(i) {
    setOpenIndex(openIndex === i ? null : i);
  }

  return (
    <section className="hs-section hs-section-alt">
      <h2 className="hs-heading">Frequently Asked Questions</h2>

      <div className="faq-list">
        {faqs.map((faq, i) => (
          <div className={`faq-item${openIndex === i ? " open" : ""}`} key={faq.q}>
            <button className="faq-question" onClick={() => toggle(i)}>
              {faq.q}
              <span className="faq-chevron">▼</span>
            </button>
            {openIndex === i && (
              <div className="faq-answer">{faq.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default FAQ;
