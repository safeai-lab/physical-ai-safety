/* Manifest for the online reader.
   Each entry: id (hash route), num (sidebar label), title, file (chapter PDF),
   available (false until the neutral-cover Course Edition PDF is posted),
   sections (shown in the placeholder state until the PDF arrives).
   *_zh fields are the simplified-Chinese strings used when the reader's
   language toggle is set to 中文 (see read/reader.js and scripts/zh_glossary.md).
   The split script (scripts/split-chapters.py) regenerates the pdf/ files;
   flip `available` to true per chapter as the course releases them. */

window.BOOK = {
  fullPdf: { file: "../pdf/physical-ai-safety.pdf", available: false },
  chapters: [
    {
      id: "front", num: "—", title: "Front Matter", title_zh: "前言部分",
      subtitle: "Preface · Notation", subtitle_zh: "前言 · 符号表",
      file: "../pdf/physical-ai-safety-front-matter.pdf", available: false,
      sections: ["Preface", "Acknowledgments", "Notation"],
      sections_zh: ["前言", "致谢", "符号表"]
    },
    {
      id: "ch1", num: "1", title: "Mathematical Foundations", title_zh: "数学基础",
      subtitle: "10 exercises", subtitle_zh: "10 道习题",
      file: "../pdf/physical-ai-safety-ch1.pdf", available: false,
      html: "../html/ch1.html",
      sections: [
        "Physical AI and Its Safety Challenges",
        "Deep Learning Essentials",
        "Sequential Decision-Making",
        "Uncertainty Quantification and Calibration",
        "Summary · Exercises"
      ],
      sections_zh: [
        "物理AI及其安全挑战",
        "深度学习基础",
        "序贯决策",
        "不确定性量化与校准",
        "小结 · 习题"
      ]
    },
    {
      id: "ch2", num: "2", title: "Robustness", title_zh: "鲁棒性",
      subtitle: "11 exercises", subtitle_zh: "11 道习题",
      file: "../pdf/physical-ai-safety-ch2.pdf", available: false,
      html: "../html/ch2.html",
      sections: [
        "A Taxonomy of Robustness",
        "Adversarial Attacks",
        "Enhancement of Robustness",
        "Robustness in Physical Sensing",
        "Summary · Exercises"
      ],
      sections_zh: [
        "鲁棒性的分类体系",
        "对抗攻击",
        "鲁棒性增强",
        "物理传感中的鲁棒性",
        "小结 · 习题"
      ]
    },
    {
      id: "ch3", num: "3", title: "Generalization", title_zh: "泛化",
      subtitle: "8 exercises", subtitle_zh: "8 道习题",
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
      ],
      sections_zh: [
        "泛化问题的形式化",
        "用最优传输度量任务偏移",
        "持续学习：适配器与对称性",
        "通过因果性实现泛化",
        "学会适应：元学习与提示",
        "仿真到现实迁移",
        "任务识别与任务不确定性下的鲁棒性",
        "小结 · 习题"
      ]
    },
    {
      id: "ch4", num: "4", title: "Constraint Safety", title_zh: "约束安全",
      subtitle: "10 exercises", subtitle_zh: "10 道习题",
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
      ],
      sections_zh: [
        "约束安全的形式化",
        "原始–对偶与信赖域方法",
        "作为推断的约束学习",
        "基于离线数据的约束学习",
        "约束安全的鲁棒性与适应性",
        "运行时安全：控制理论方法",
        "小结 · 习题"
      ]
    },
    {
      id: "ch5", num: "5", title: "Foundation Model Safety", title_zh: "基础模型安全",
      subtitle: "9 exercises", subtitle_zh: "9 道习题",
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
      ],
      sections_zh: [
        "作为物理控制器的基础模型",
        "视觉-语言-动作架构及其失效模式",
        "生成式世界模型剖析",
        "作为测试环境的世界模型",
        "动作策略的对齐与偏好优化",
        "运行时护栏与让权",
        "评估、红队测试与证据",
        "小结 · 习题"
      ]
    },
    {
      id: "ch6", num: "6", title: "Rare-Event Certification", title_zh: "罕见事件认证",
      subtitle: "11 exercises", subtitle_zh: "11 道习题",
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
      ],
      sections_zh: [
        "认证问题",
        "失效发现",
        "蒙特卡洛方法与重要性采样",
        "高维空间中基于学习的估计",
        "认证判定",
        "从证书到部署",
        "小结 · 习题"
      ]
    },
    {
      id: "ch7", num: "7", title: "Regulation, Standards, and Human Oversight",
      title_zh: "法规、标准与人类监督",
      subtitle: "9 exercises", subtitle_zh: "9 道习题",
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
      ],
      sections_zh: [
        "标准全景",
        "面向学习使能系统的危害分析",
        "AI系统的功能安全",
        "作为整合性工件的安全论证",
        "人类监督工程",
        "共享自主与物理人机交互",
        "具身感知的隐私",
        "物理AI的监管 · 责任 · 可保性",
        "部署档案",
        "展望：物理AI安全的开放问题",
        "小结 · 习题"
      ]
    },
    {
      id: "back", num: "A", title: "Solutions & Back Matter", title_zh: "习题解答与附录",
      subtitle: "Answers · Bibliography · Glossary", subtitle_zh: "习题答案 · 参考文献 · 术语表",
      file: "../pdf/physical-ai-safety-back-matter.pdf", available: false,
      sections: ["Answers to the Exercises", "Bibliography", "Glossary", "Index"],
      sections_zh: ["习题答案", "参考文献", "术语表", "索引"]
    }
  ]
};
