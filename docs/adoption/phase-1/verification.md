# 本轮验证报告

## 环境与可复现对象

冻结产品源码：`5ab44de236b0eb384ec4d81ec216e0d0928a9f7a`；工作起点（含 9 个计划提交）：`6fcb80350a0e0386135a75f40ccd66da370945e5`。

本轮测试对象是在该起点上应用 `.gitattributes` 与两处测试文件路径修复的 `integration/phase-1` 工作树。最终提交是本文件所属提交；不在文档中循环嵌入自身提交 SHA。准确工具版本见 [environment.json](evidence/environment.json)，运行命令和 UTC 起止时间见 [runtime-commands-final.json](evidence/runtime-commands-final.json)。提交的日志文本仅将用户目录和 checkout 路径替换为占位符，并清理输出行尾空白；测试结果、错误内容、断言和退出码保留。artifact-checksums.sha256 校验规范化后的 Git blob 字节，而不是会受本机换行转换影响的工作树字节。

## 命令与结果

| 命令/阶段 | 退出码 | 实际结果 |
|---|---:|---|
| `openspec validate adopt-chimera-vocal-synth --strict --no-interactive` | 0 | change 合法；这是规格格式校验，不是实现验收 |
| `bun install --frozen-lockfile` | 0 | 当前平台安装 38 个包；未修改 bun.lock |
| `cargo metadata --no-deps --format-version=1 --locked` | 0 | 3 个 workspace 成员的目标清单可读取 |
| `cargo metadata --locked --format-version=1` | 0 | 锁定 26 个包记录的许可/依赖元数据可读取 |
| 初始 `bun run test` | 101 | Cargo 105 通过、1 失败、2 忽略；Bun 子阶段尚未执行 |
| 辅音换行定向回归 | 0 | 原失败用例 1 通过 |
| 固定 LF 后 `bun run test` | 1 | Cargo 107 通过、0 失败、2 忽略；Bun 13 pass / 1 skip / 5 fail，另报告 5 个加载错误 |
| 新增 Windows 路径回归，修复前 | 1 | 产物存在，但原 `.pathname` 路径不被文件系统识别，0 pass / 1 fail |
| 同一 Windows 路径回归，修复后 | 0 | 1 pass / 0 fail |
| 最终 `bun run test` | 0 | WASM release 构建；29 个 Cargo 结果组汇总 107 passed / 0 failed / 2 ignored；Bun 31 pass / 0 fail |
| 最终 `bun run typecheck` | 0 | `tsc --noEmit` 通过 |

统计为各结果组实际通过/失败/忽略数求和，零用例 doc-test 组不冒充新增通过用例。Bun 汇总来自其自身输出。前后对比保留了最初失败，不以最后一次成功覆盖历史。

## 修复一：校准表 CRLF 检出差异

原始失败：`calibrate_consonants_reproduces_the_committed_table`。

| 对象 | 字节 | CRLF 数量 |
|---|---:|---:|
| Git 原始辅音表 | 1907 | 0 |
| CLI 临时输出 | 1907 | 0 |
| Windows 初次检出副本 | 2094 | 187 |

生成输出与 Git blob **逐字节相同**；JSON 解析结果相同。修复仅为 `*.generated.json text eol=lf`，并在检查本地没有其他内容变化后将 4 份生成表恢复为相同 Git blob 的 LF 表示。没有运行 CHIMERA_BLESS，也没有将生成结果覆盖进 Git 源表。

证据：[diagnosis](evidence/consonant-calibration-diagnosis.json)、[normalized checkout](evidence/eol-checkout-normalization.json)、[targeted regression](evidence/targeted-regression.txt)。

## 修复二：测试 URL 到系统路径

原路径 `new URL(..., import.meta.url).pathname` 在 Windows 返回 `/E:/...`。实际 WASM 文件存在，但 5 个测试文件加载失败，另一个逐采样一致性用例被 `skipIf(!existsSync(...))` 跳过。

先增加“构建产物必须存在”的断言并确认 RED，再把 `tests/harness.ts` 与 `tests/wasm-engine.test.ts` 的两个入口改为 Node 标准 `fileURLToPath`。不修改采样比较容差；最终逐采样一致性用例确实执行并通过。新增断言保证构建产物缺失时整套测试不能因跳过而被误报为成功。

证据：[RED](evidence/windows-path-regression-red.txt)、[GREEN](evidence/windows-path-regression-green.txt)、[final log](evidence/bun-run-test-final.txt)。转换语义依据 Node 官方 URL API 的 `fileURLToPath` 文档，不自行删除盘符前斜杠或拼接路径。

## 未执行、忽略与警告

Cargo 的两个继承 ignored 用例：

- `no_area_jumps_as_a_protruded_lower_lip_tucks`：上游注释明确为已知未修复几何问题，本轮未执行 ignored，不算通过。
- `calibrate_vowels_reproduces_the_committed_table`：耗时且上游已说明非逐字节一致的校准测试，本轮未执行，不算通过。

两处继承 `unused_mut` 警告来自 `golden_planning.rs` 和 `voice_source.rs`。本轮没有移除测试、降低断言、扩大容差或批量 lint 改写。

未执行：Playwright E2E、真实浏览器音频设备试听、Linux/macOS/ARM64 测试、LLVM 覆盖率、性能 benchmark、外部 CSD 真人录音评测、发布流水线。Bun 中模拟/装载 AudioWorklet 的测试不等同于真实浏览器 E2E。

低采样率风险 CHI-001 仅有上游源码与运行报告，本轮没有复现和修复；最终默认测试链通过不能将其消除。详见 [风险登记](risk-register.md)。
