/* Manifest for the online reader.
   Each entry: id (hash route), num (sidebar label), title, file (chapter PDF),
   available (false until the neutral-cover Course Edition PDF is posted),
   sections (shown in the placeholder state until the PDF arrives).
   The split script (scripts/split-chapters.py) regenerates the pdf/ files;
   flip `available` to true per chapter as the course releases them. */

window.BOOK = {
  fullPdf: { file: "../pdf/physical-ai-safety.pdf", available: false },
  chapters: [
    {
      id: "front", num: "—", title: "Front Matter",
      subtitle: "Preface · Notation",
      file: "../pdf/physical-ai-safety-front-matter.pdf", available: false,
      sections: ["Preface", "Acknowledgments", "Notation"]
    },
    {
      id: "ch1", num: "1", title: "Mathematical Foundations",
      subtitle: "10 exercises",
      file: "../pdf/physical-ai-safety-ch1.pdf", available: false,
      html: "../html/ch1.html",
      sections: [
        "Physical AI and Its Safety Challenges",
        "Deep Learning Essentials",
        "Sequential Decision-Making",
        "Uncertainty Quantification and Calibration",
        "Summary · Exercises"
      ]
    },
    {
      id: "ch2", num: "2", title: "Robustness",
      subtitle: "11 exercises",
      file: "../pdf/physical-ai-safety-ch2.pdf", available: false,
      html: "../html/ch2.html",
      sections: [
        "A Taxonomy of Robustness",
        "Adversarial Attacks",
        "Enhancement of Robustness",
        "Robustness in Physical Sensing",
        "Summary · Exercises"
      ]
    },
    {
      id: "ch3", num: "3", title: "Generalization",
      subtitle: "8 exercises",
      file: "../pdf/physical-ai-safety-ch3.pdf", available: false,
      html: "../html/ch3.html",
      sections: [
        "Formulation of the Generalization Problem",
        "Measuring Task Shift with Optimal Transport",
        "Continual Learning: Adapters and Symmetries",
        "Generalization through Causality",
        "Learning to Adapt: Meta-Learning and Prompts",
        "Sim-to-Real Transfer",
        "Task Identification and Robustness to Task Uncertainty",
        "Summary · Exercises"
      ]
    },
    {
      id: "ch4", num: "4", title: "Constraint Safety",
      subtitle: "10 exercises",
      file: "../pdf/physical-ai-safety-ch4.pdf", available: false,
      html: "../html/ch4.html",
      sections: [
        "Formulation of Constraint Safety",
        "Primal–Dual and Trust-Region Methods",
        "Constrained Learning as Inference",
        "Constrained Learning from Offline Data",
        "Robustness and Adaptability of Constraint Safety",
        "Runtime Safety: Control-Theoretic Approaches",
        "Summary · Exercises"
      ]
    },
    {
      id: "ch5", num: "5", title: "Foundation Model Safety",
      subtitle: "9 exercises",
      file: "../pdf/physical-ai-safety-ch5.pdf", available: false,
      html: "../html/ch5.html",
      sections: [
        "Foundation Models as Physical Controllers",
        "Vision-Language-Action Architectures and Failure Modes",
        "Anatomy of Generative World Models",
        "World Models as Test Environments",
        "Alignment and Preference Optimization for Action Policies",
        "Runtime Guardrails and Deference",
        "Evaluation, Red Teaming, and Evidence",
        "Summary · Exercises"
      ]
    },
    {
      id: "ch6", num: "6", title: "Rare-Event Certification",
      subtitle: "11 exercises",
      file: "../pdf/physical-ai-safety-ch6.pdf", available: false,
      html: "../html/ch6.html",
      sections: [
        "The Certification Problem",
        "Failure Discovery",
        "Monte Carlo Methods and Importance Sampling",
        "Learning-Based Estimation in High Dimension",
        "The Certification Verdict",
        "From Certificates to Deployment",
        "Summary · Exercises"
      ]
    },
    {
      id: "ch7", num: "7", title: "Regulation, Standards, and Human Oversight",
      subtitle: "9 exercises",
      file: "../pdf/physical-ai-safety-ch7.pdf", available: false,
      html: "../html/ch7.html",
      sections: [
        "The Standards Landscape",
        "Hazard Analysis for Learning-Enabled Systems",
        "Functional Safety of AI Systems",
        "Safety Cases as the Integrating Artifact",
        "Human Oversight Engineering",
        "Shared Autonomy and Physical Human–Robot Interaction",
        "Privacy of Embodied Sensing",
        "Regulating Physical AI · Liability · Insurability",
        "The Deployment Dossier",
        "Outlook: Open Problems in Physical AI Safety",
        "Summary · Exercises"
      ]
    },
    {
      id: "back", num: "A", title: "Solutions & Back Matter",
      subtitle: "Answers · Bibliography · Glossary",
      file: "../pdf/physical-ai-safety-back-matter.pdf", available: false,
      sections: ["Answers to the Exercises", "Bibliography", "Glossary", "Index"]
    }
  ]
};
