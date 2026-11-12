# WP-03 第一批：低设备采样率稳定性与继承测试验收

## 决策与范围

在 `integration/phase-1` 上延续唯一 OpenSpec `adopt-chimera-vocal-synth`。起点为 `1de1c0b87224f872123c57d58ff5a7ef2e701403`；原始产品盘点基线仍为 `5ab44de236b0eb384ec4d81ec216e0d0928a9f7a`，不重算或覆盖上一批资产账本。

本批次选择性回填上游修复 `186b75a1a8cf22017f68cd8acac8015d29cbf437` 的三处生产路径。不是 merge，也不是完整 cherry-pick；不把其他上游提交算作已接收。原补丁保存在 [upstream-fix.patch](evidence/upstream-fix.patch)。生产策略与上游一致，注释译成中文；本地增加独立 Native/WASM/浏览器回归。

**结论：CHI-001 在本轮明确测试的默认构造与浏览器场景中已修复。WP-03 整体及发布验收仍未完成。**

## 根因与最小修复

旧默认规则为输出采样率不超过 60 kHz 时固定 2 倍。声道部分管段设有最小分段数，低内部模拟频率使声波每步传播距离相对段长过大，出现失稳。当前基线实际出现 NaN；24 kHz 则表现为有限但饱和的输出。因此不能只用“buffer 非空”或“全为有限数值”验收。

采用上游的 `oversample_for(fs) = max(1, floor(60000/fs)+1)`。它是本模型的已测工程策略，不是任意声道拓扑的稳定性数学证明。

| 输出 Hz | 旧默认倍率 | 新默认倍率 | 内部 Hz |
|---:|---:|---:|---:|
| 8000 | 2 | 8 | 64000 |
| 16000 | 2 | 4 | 64000 |
| 22050 | 2 | 3 | 66150 |
| 24000 | 2 | 3 | 72000 |
| 32000 | 2 | 2 | 64000 |
| 44100 | 2 | 2 | 88200 |
| 48000 | 2 | 2 | 96000 |
| 60000 | 2 | 2 | 120000 |
| 88200 | 1 | 1 | 88200 |
| 96000 | 1 | 1 | 96000 |

同步入口：`Engine::make_voice`、`HumanVoice::with_defaults`、`chimera-wasm/src/api.rs` 的主线程 `model`。如果只改音频引擎，主线程镜像会继续使用旧节点布局；本轮用 10 个采样率 × 3 个 body preset 对齐节点数。

未改动 FDTD 方程、声源常量、音色、CreatureVoice 采样策略、ABI 布局、锁文件、golden 和校准表。低层 `HumanVoice::new` 的显式倍率仍由调用者负责。0、负数、NaN、无穷大及极端/未测采样率的输入校验没有在本批次实现，不能宣传无条件支持任意采样率。

## RED → GREEN

在生产修改之前实际运行了可编译的 Native 与 freshly-built WASM 回归：

| 场景 | 修改前 | 修改后 |
|---|---|---|
| 8 kHz 默认男声 | 第 109 个样本非有限 | 全样本有限；RMS 0.112377650 |
| 16 kHz 默认男声 | 第 210 个样本非有限 | 全样本有限；RMS 0.111998191 |
| 22.05 kHz 默认男声 | 第 730 个样本非有限 | 全样本有限；RMS 0.111881058 |
| 24 kHz 默认男声 | RMS 0.467507590 | RMS 0.111585100 |
| 48 kHz 参考 | RMS 0.111675906 | 同值 |
| Native 回归总计 | 6 pass / 6 fail | 12 pass / 0 fail |
| 新 WASM 回归总计 | 0 pass / 5 fail | 5 pass / 0 fail |

每个 held-voice 用例渲染两秒，检查所有 PCM 有限，再以第二秒 RMS 对比 48 kHz 参考，保留上游 0.5x～2x 验收范围。不是用归一化、丢弃 NaN 或静音兜底掩盖缺陷。倍率边界另覆盖 30000/30001、60000/60001 Hz。

证据：[native-red](evidence/native-red.txt)、[wasm-red](evidence/wasm-red.txt)、[native-green](evidence/native-green.txt)、[full-test](evidence/full-test.txt)。

## 完整测试与任务映射

`bun run test`：Cargo **119 passed / 0 failed / 2 ignored**，Bun **36 pass / 0 fail**；WASM 重新构建，Windows Native/WASM 继承场景逐采样一致性实际执行通过。`bun run typecheck` 与生产 `bun run build` 均通过。精确命令、退出码与 UTC 时间见 [green-commands.json](evidence/green-commands.json)。

本轮据此新增完成三项（均限于实际测试环境）：

- **T027**：继承 Native golden 全量执行，无失败、无 re-bless；fixture 来源沿用 `crates/chimera/tests/golden/README.md`，不把已由 Rust 更新的快照误称为永远独立的 TypeScript oracle。
- **T028**：`the_beat_player_does_not_allocate`、`warm_creature_voice_does_not_allocate`、`the_audio_thread_abi_does_not_allocate` 实际通过。后者覆盖 48 kHz 规划后调度、遥测、节奏与动物音频路径；不外推为所有方法、所有采样率都零分配。
- **T029**：带固定绝对样本事件的完整会话，以 1、77、128、4096、48000 块大小比较通过，含 body switch、schedule、release。不是不同命令时点或跨平台无条件确定性保证。

详见 [test-summary.json](evidence/test-summary.json)。T020–T026、T030–T032 仍待进一步验收，其他 WP 不因这些通过结果而自动完成。

两个 inherited ignored 继续保留：下唇几何跳变（上游 known-not-fixed）与慢速元音重新校准。两处继承 unused_mut 警告未作无关清理；没有弱化测试或扩大豁免。

## 真实浏览器验证

新增 `tools/e2e-device-sample-rates.ts` 使用生产 preview，在页面启动前强制 AudioContext 为 48、16、24 kHz。使用本机已有 Chrome **157.0.8103.38**，没有安装 Playwright bundled Chromium。每个 rate 等待启动后采集 24 次遥测，确认实际采样率、有限且非静音 RMS、语音时钟前进、无 console/page 错误，并对比平均 RMS。三组均通过。

证据：[browser-low-rates.txt](evidence/browser-low-rates.txt)、[browser-device-rate-report.json](evidence/browser-device-rate-report.json)。这是 headless 真实 WebAudio/AudioWorklet 路径，不是实体蓝牙耳机试听。每组观测约六秒，不足以认证长时稳定性，也不声称解决上游 #33 中未定位的“正常采样率约 30 秒后中断”。

继承 `tools/e2e.ts` 的最终结果单独写入 `browser-verification.md`，不得由定向浏览器回归替代全部应用验收。

## 性能与环境边界

相同 Windows 机器、上游 `bench` 方法，48 kHz、显式 oversample：修复前 2x/1x 为 15.1%/7.4%，修复后 16.4%/7.8% 单核实时比例（单次测量）。它测量的是未改变的显式构造路径，不是低采样率的新倍率成本。没有重复测量或隔离系统负载，不能据此认定性能提升或退化；T031 保持未勾选。

本轮未执行 macOS/Linux/ARM64、物理音频设备测试、长时间压力测试、覆盖率、依赖安全全面审计、CSD 真人语音评测。无 main 合并、发布或远程工作流修改。

## 执行异常与复核

第一轮命令包装器在打印 Vite 的 Unicode 符号时触发 Windows GBK 编码错误；测试和 build 的子进程退出码已先写入 JSON。该工具异常不是产品失败；后续改成安全输出，再执行剩余 benchmark/typecheck/浏览器验证，保留原记录。

代码审查为本轮逐文件 diff 与上游 patch 对照，未声称获得独立人工/子代理批准。新产物校验见 `artifact-checksums.sha256`；上一批 manifest 绑定其原提交，不随当前代码改动覆盖。
