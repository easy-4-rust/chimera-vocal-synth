# WP-01 / WP-02 任务证据账本

本账本仅验收仓库治理与资产盘点，不验收全部音频行为、浏览器交互或发布能力。完成文档任务表示文件已交付并经检查，不表示文档中的未来 merge、发布、回退操作已经执行。

| 任务 | 本轮结果 | 证据与范围 |
|---|---|---|
| T001 | VERIFIED | `evidence/repository-snapshot.json` 中 fork=true，parent/source 均为 jamesondh/chimera-vocal-synth |
| T002 | VERIFIED | 同一快照记录 public、默认 main、读写权限；既有分支 protected=false、rulesets=[]，风险 CHI-003，不改设置 |
| T003 | VERIFIED | Git merge-base 为冻结产品基线 5ab44de；保留计划 HEAD 6fcb803 与观察到的上游 d361a82 |
| T004 | VERIFIED | 已在本地 clone 配置 origin/upstream，并实际读取 remote -v；与隔离 worktree 共用 Git 配置 |
| T005 | VERIFIED | integration/phase-1 从已有计划 HEAD 建立；该 HEAD 继承冻结产品基线，保留 9 个 OpenSpec 文件。远端提交后再核实分支 SHA |
| T006 | VERIFIED（文档） | 根目录 UPSTREAM_SYNC.md：fetch、差分、独立同步分支、merge、测试、PR，不自动更新共享分支 |
| T007 | VERIFIED（文档） | UPSTREAM_SYNC.md 定义 main/integration/feature/fix/sync 职责及 PR 规则；没有擅自启用保护设置 |
| T008 | VERIFIED | upstream-commits.tsv 登记 19 个上游新提交；local-commits.tsv 登记 9 个既有本地计划提交；本轮新增提交由 Git 历史与本报告目录追踪 |
| T009 | VERIFIED（文档） | UPSTREAM_SYNC.md 记录冲突处置、干净同步工作区 abort、共享历史 revert 和重验要求；未实际制造冲突或执行回退 |
| T010 | VERIFIED | tracked-assets.tsv：固定基线 244 个 Git blob，逐文件 SHA-256，不用 CRLF 工作树字节代替源码对象 |
| T011 | VERIFIED | rust-inventory.json 与 cargo-metadata.json：3 个 workspace 成员，targets/examples/tests/build scripts 盘点 |
| T012 | VERIFIED | web-inventory.json：脚本、直接依赖、锁文件、构建输入；冻结安装通过；dependency-licenses.json 登记全部 82 个 Bun 锁定包 |
| T013 | STATIC_REVIEW（完成核对） | 根目录 MIT 原版权与声明保留；新增 NOTICE 不替代原 LICENSE |
| T014 | STATIC_REVIEW（完成核对） | CMUDICT-LICENSE.txt 已核对，词典 gzip 单独登记；保留源码/二进制分发所需声明 |
| T015 | VERIFIED + STATIC_REVIEW | 6 个字体文件均入账，AVHershey 两份文档副本与 public 副本 blob 相同；Archivo OFL 与 AVHershey 双许可声明已核对 |
| T016 | VERIFIED + STATIC_REVIEW | asset-verification.json：9 个合成音频 fixture、6 个字体、1 个词典压缩文件；生成来源引用 Golden README；CSD/shows 不下载、不分发 |
| T017 | VERIFIED（限定范围） | 7 类忽略路径实际测试通过；两项大于 1 MB 的继承测试资产保留；文件名级敏感资产扫描无候选，不宣称完成全面秘密扫描 |
| T018 | VERIFIED（文档） | THIRD_PARTY_NOTICES.md 与 dependency-licenses.json 已建立，保留原许可；82 个 Web 包、23 个外部 Rust 包的许可声明已记录，非法律或安全认证 |
| T019 | VERIFIED | UPSTREAM_BASELINE.md、inventory-summary.json、tracked-assets.tsv 与 artifact-checksums.sha256 记录来源、分母、每项处置与校验值 |

## 尚未完成

T020～T085 保持未勾选。基线测试中获得的局部通过证据可用于后续验收，但不能自动完成逐 API/模式、跨平台、E2E、覆盖率、性能和发布任务。

产品接收不能因本账本 19 项完成而关闭：仍有上游低采样率修复待复现/集成，见 `risk-register.md`。
