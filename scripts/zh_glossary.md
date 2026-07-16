# 中文翻译术语表与文体规范 (Physical AI Safety)

Single source of truth for the Chinese HTML edition. Every translation agent MUST follow this file.

## 文体规范 (Style rules)

1. 简体中文，学术教材语体。正文使用全角标点（，。：；？！“”），数学式、代码、URL、HTML 属性内保持原样。
2. 关键术语在每章**首次出现**时用 中文（English）标注，如 鲁棒性（robustness）；之后仅用中文。
3. 缩写词（MDP、CMDP、VLA、OOD、PPO、TRPO、CBF、DAgger、softmax、logits、dropout、transformer、token）保留英文，不音译。
4. 引用标注保持英文原样：如 (Eykholt et al. 2018) 不译。参考文献条目一律不译。
5. 交叉引用格式：Chapter 2 → 第2章；Section 3.4 → 第3.4节；Figure 1.1 → 图1.1；Table 2.3 → 表2.3；Equation (4.2) → 式(4.2)；Exercise 3.1 → 习题3.1；Appendix → 附录。图题 “Figure 1.1: …” → “图1.1：…”。
6. 结构词：Learning objectives → 学习目标；Summary → 小结；Exercises → 习题；Theorem → 定理；Lemma → 引理；Definition → 定义；Proposition → 命题；Corollary → 推论；Proof → 证明；Example → 例；Remark → 注；Assumption → 假设；Algorithm → 算法。
7. 数字、单位、变量名、数学符号一律不改。人名不译（Ding Zhao 保持原文）。
8. 书名：Physical AI Safety → 《物理AI安全》（Physical AI Safety），仅首次出现加英文括注。

## 核心术语 (Core terminology)

| English | 中文 |
|---|---|
| physical AI | 物理AI |
| trustworthy AI | 可信AI |
| safety | 安全（性） |
| robustness | 鲁棒性 |
| adversarial attack / example / perturbation | 对抗攻击 / 对抗样本 / 对抗扰动 |
| data poisoning | 数据投毒 |
| backdoor | 后门 |
| certified defense | 认证防御 |
| generalization | 泛化 |
| distribution shift | 分布偏移 |
| domain adaptation / randomization | 域自适应 / 域随机化 |
| out-of-distribution (OOD) | 分布外（OOD） |
| optimal transport | 最优传输 |
| continual learning | 持续学习 |
| meta-learning | 元学习 |
| sim-to-real transfer | 仿真到现实迁移（sim-to-real） |
| causality / causal graph | 因果性 / 因果图 |
| reinforcement learning (RL) | 强化学习 |
| Markov Decision Process (MDP) | 马尔可夫决策过程（MDP） |
| policy / value function | 策略 / 价值函数 |
| reward / return / cost | 奖励 / 回报 / 代价 |
| constraint safety | 约束安全 |
| constrained MDP (CMDP) | 约束马尔可夫决策过程（CMDP） |
| primal–dual method | 原始–对偶方法 |
| trust region | 信赖域 |
| offline RL | 离线强化学习 |
| control barrier function (CBF) | 控制屏障函数（CBF） |
| reachability | 可达性 |
| runtime assurance / runtime safety | 运行时保障 / 运行时安全 |
| imitation learning | 模仿学习 |
| behavior cloning | 行为克隆 |
| sequential decision-making | 序贯决策 |
| partially observable | 部分可观测 |
| belief state | 信念状态 |
| Bayesian filter | 贝叶斯滤波器 |
| uncertainty quantification | 不确定性量化 |
| aleatoric / epistemic uncertainty | 偶然不确定性 / 认知不确定性 |
| calibration | 校准 |
| temperature scaling | 温度缩放 |
| deep ensemble | 深度集成 |
| conformal prediction | 共形预测 |
| foundation model | 基础模型 |
| world model | 世界模型 |
| vision–language–action (VLA) model | 视觉-语言-动作（VLA）模型 |
| large language model (LLM) | 大语言模型（LLM） |
| alignment | 对齐 |
| preference optimization | 偏好优化 |
| hallucination | 幻觉 |
| guardrail | 护栏 |
| deference | 让权 |
| red teaming | 红队测试 |
| evaluation / benchmark | 评估 / 基准 |
| rare event | 罕见事件 |
| certification | 认证 |
| certificate | 证书 |
| verdict | 判定 |
| failure discovery / failure mode | 失效发现 / 失效模式 |
| Monte Carlo method | 蒙特卡洛方法 |
| importance sampling | 重要性采样 |
| variance reduction | 方差缩减 |
| safety case | 安全论证 |
| hazard analysis | 危害分析 |
| functional safety | 功能安全 |
| standard (ISO/IEC …) | 标准（编号不译） |
| human oversight | 人类监督 |
| shared autonomy | 共享自主 |
| human–robot interaction | 人机交互 |
| deployment dossier | 部署档案 |
| liability / insurability | 责任 / 可保性 |
| perception–decision–action loop | 感知–决策–行动回路 |
| autonomous vehicle | 自动驾驶汽车 |
| gradient descent / backpropagation | 梯度下降 / 反向传播 |
| loss function / cross-entropy | 损失函数 / 交叉熵 |
| neural network | 神经网络 |
| convolutional neural network (CNN) | 卷积神经网络（CNN） |
| supervised learning | 监督学习 |
| overfitting | 过拟合 |
| regularization | 正则化 |
| actor–critic | actor–critic（保留英文） |
| policy gradient | 策略梯度 |
| model-based / model-free | 基于模型 / 无模型 |
