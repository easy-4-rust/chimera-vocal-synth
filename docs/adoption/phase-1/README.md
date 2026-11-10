# CHIMERA Phase 1 接收记录：WP-01 / WP-02

**状态：仓库治理与资产盘点已完成；完整产品接收仍在进行，尚未达到发布条件。**

本轮延续 `openspec/changes/adopt-chimera-vocal-synth/`，完整保留 Engine、WASM/AudioWorklet、CLI、React UI，不改造声音算法，不合并 main，不发布。证据时间以各 JSON 中的 UTC 时间为准；本轮主要运行发生于 2026-11-10 UTC（北京时间 11 月 11 日）。

## 完成项

T001～T019 共 19 项已依据 [任务证据账本](task-evidence.md) 完成。T020～T085 保持待执行，不能因本轮基础测试通过就自动勾选。

| 交付 | 结果 |
|---|---|
| Fork 关系 | GitHub fork=true，parent/source 为 jamesondh/chimera-vocal-synth |
| 隔离接收分支 | integration/phase-1，继承既有计划 HEAD 6fcb80350a0e0386135a75f40ccd66da370945e5 |
| 冻结产品基线 | 5ab44de236b0eb384ec4d81ec216e0d0928a9f7a |
| 上游差异 | 观察到 d361a82ce1b18d0ac19001aab19169ff2c1eb9e8；新增 19 个提交未合入 |
| 文件分母 | 244 个原始 Git 文件，9,727,245 字节，逐条 blob SHA 与 SHA-256 |
| Cargo | 3 个 workspace 成员；26 个锁定 package 记录，其中 23 个外部包 |
| Bun | 82 个锁定包；Windows 安装 38 个，另 44 个仅查精确版本元数据 |
| 许可 | 字体、词典、生成 fixture、第三方依赖单独登记，不混用根目录 MIT |
| 分支保护 | 既有分支未保护、可见 rulesets 为空；只记录风险，未改权限 |

## 实际验证

详见 [验证报告](verification.md)。环境为 Windows 11 / AMD64、Rust/Cargo 1.99.0、Bun 1.4.3、OpenSpec 1.14.0。

- OpenSpec 严格校验通过。
- `bun install --frozen-lockfile` 通过，依赖与锁文件未改动。
- 最终 `bun run test` 退出 0：WASM release 构建成功；Cargo 107 passed / 0 failed / 2 ignored；Bun 31 pass / 0 fail。
- Windows Native/WASM 逐采样一致性用例实际执行通过，没有因错误路径跳过。
- `bun run typecheck` 退出 0。

**两项 inherited ignored 不计为通过**：下唇收拢时截面积跳变的已知问题，以及耗时的元音重新校准用例。继承测试中另有两处 `unused_mut` 警告，未作无关清理。

## 本轮最小兼容修复

1. `.gitattributes` 将生成 JSON 检出为 LF。失败时辅音校准表被 Windows 转成 CRLF，生成输出本身与 Git 原始 blob 完全一致；没有重新校准或变更数值。
2. 两处 Bun 测试路径改用 `fileURLToPath`，并增加产物存在性断言，防止无效 `/E:/...` 路径把 Native/WASM 验证静默跳过。没有修改浏览器产品运行时。

原始失败、定位证据、针对性回归和最终全量测试日志都已保留。`crates/`、`src/`、既有 golden/校准 Git blob 和锁文件相对计划 HEAD 无差异。

## 证据导航

| 内容 | 文件 |
|---|---|
| 来源、冻结基线 | [UPSTREAM_BASELINE.md](../../../UPSTREAM_BASELINE.md) |
| 同步、分支、回退规程 | [UPSTREAM_SYNC.md](../../../UPSTREAM_SYNC.md) |
| 本地改动边界 | [LOCAL_EXTENSIONS.md](../../../LOCAL_EXTENSIONS.md) |
| 第三方声明 | [THIRD_PARTY_NOTICES.md](../../../THIRD_PARTY_NOTICES.md) |
| 源码/资产分类 | [asset-audit.md](asset-audit.md)、[tracked-assets.tsv](tracked-assets.tsv) |
| Cargo/Web 清单 | [rust-inventory.json](rust-inventory.json)、[web-inventory.json](web-inventory.json) |
| 依赖许可元数据 | [dependency-licenses.json](dependency-licenses.json)、[dependency-summary.json](dependency-summary.json) |
| 字体副本、忽略规则 | [asset-verification.json](asset-verification.json) |
| 上游待审提交 | [upstream-commits.tsv](upstream-commits.tsv) |
| 验证结果与原始日志 | [verification.md](verification.md)、[evidence/](evidence/) |
| 文件校验 | [artifact-checksums.sha256](artifact-checksums.sha256) |
| 剩余风险 | [risk-register.md](risk-register.md) |

## 下一阶段

进入 WP-03 时优先复现低采样率 NaN 风险，再评审上游修复 `186b75a1a8cf22017f68cd8acac8015d29cbf437`。本轮没有引入这项声音引擎修复，也没有把新的上游 UI、TSP 评测或 MusicXML 能力算入已接收范围。

Playwright 真浏览器 E2E、实际设备试听、macOS/Linux、覆盖率与性能基准仍待执行。未运行 CSD 真人数据评测，未下载受限数据，未创建/修改远端工作流，未归档 OpenSpec。
