# SDD ledger — plan: openspec/changes/adopt-chimera-vocal-synth/tasks.md

## WP-03 当前批次

起点：`1de1c0b87224f872123c57d58ff5a7ef2e701403`，已有隔离 worktree，分支 `integration/phase-1`；工作区干净。复用既有 OpenSpec，不初始化新体系，不创建或合并其他分支。

目标：复现 CHI-001 低采样率 NaN/饱和问题，审查上游 `186b75a1a8cf22017f68cd8acac8015d29cbf437`，以最小选择性回填修复三个默认入口，运行 Native/WASM 和已有 golden 回归，更新证据并提交。

Pre-flight：Engine、HumanVoice::with_defaults、WASM JSON model 镜像共享采样率/节点数合同。只修复其中一条会留下不一致；显式 HumanVoice::new 的 oversample 参数仍由调用者负责。Decimator 已支持任意整数 factor，不要求只取 1/2/4。

Ruling：遵循用户已批准的“先复现再评审引入该修复”，仅回填上游采样率策略，不批量合并 19 个上游提交，不修改 FDTD 方程、音色、golden 或依赖。默认正常采样率必须保持兼容；未测试/非法采样率不扩张为支持承诺。

Ruling：本批次先完成 CHI-001 及 WP-03 中有当前证据的测试任务；不能以此宣布 T020–T032 全部验收。GitGuard/CodeGuard 未在当前 PATH 发现，使用显式 Git 分支/状态/diff 和现有测试门禁，不声称运行了这些工具，不安装工具。

## 步骤

- [x] 构建可编译的真实 Native RED 回归：6 pass / 6 fail；NaN 样本 109/210/730，24 kHz RMS 饱和。
- [x] WASM RED：0 pass / 5 fail；主线程镜像旧节点数为 8/8，与安全频率参考 12/12 不一致。
- [x] 三个默认入口按上游策略回填；Native 12/12、WASM 5/5 GREEN，继承 golden 不变。
- [x] 完整测试 Cargo 119/0/2 ignored、Bun 36/0；typecheck、build、定向 Chrome 与原 E2E 均通过；单次 benchmark 只作观测，T031 不勾选。
- 提交前门禁：golden/锁文件无变化、规格与证据一致、只包含本批次允许路径。执行结果保存在 evidence/precommit-checks.json；交付 SHA 与远端状态以 Git 记录为准。

Ruling：未安装 Playwright bundled Chromium，不自动安装；使用本机 Chrome 及执行用 preload 运行不变的上游 E2E。此证据不泛化为其他浏览器认证。

Ruling：第一次包装器在打印 Vite 成功符号时出现 GBK 编码异常，子进程结果已保存；仅修复包装器输出，补完剩余验证，不改产品或测试断言。

审查：对三个生产文件逐行对照上游补丁；共享函数无引擎数学公式修改，ABI和生成资产不变。非法采样率校验、显式构造安全、实体设备和长时播放未解决，作为后续边界明确保留。没有独立审查者，未声称人工/子代理批准。
