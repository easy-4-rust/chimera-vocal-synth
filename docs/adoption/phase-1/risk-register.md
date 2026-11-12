# 接收风险与发布阻塞项

| ID | 优先级 | 事实/证据等级 | 处置及边界 |
|---|---|---|---|
| CHI-001 | 已修复：限定已测默认路径 | [WP-03](wp03/README.md)：Native 6 个 RED → 12/12 GREEN；WASM 5 个 RED → 5/5 GREEN；Chrome 强制 16/24/48 kHz 回归通过 | 选择性回填上游 186b75a1，三个默认入口统一倍率；不支持性外推到非法/任意采样率、显式低层配置、实体蓝牙设备或正常采样率约 30 秒后中断现象 |
| CHI-002 | P1 | 上游比冻结基线多 19 个提交，已执行 Git 差分 | 全部保持 NOT_MERGED；仅 186b75a1 的采样率修复选择性回填并独立验证。TSP 评测、新 MusicXML 工具、UI 修改不能算作本 Fork 已具备能力 |
| CHI-003 | P1 | GitHub 既有分支未保护，可见 rulesets 为空，VERIFIED | 分支政策先落文档；开启保护/必需检查需要单独授权，不把文档当已强制执行 |
| CHI-004 | P1 | 基线没有 `.github/workflows/`，VERIFIED | WP-07 建立 CI；本轮没有新增或修改远程工作流 |
| CHI-005 | P1 | 上游禁止随产品分发 CSD/受限 shows；随附许可为 STATIC_REVIEW | 保留独立数据边界和 notices；Duet 接收需权利明确的自有测试样例 |
| CHI-006 | P1 | Native/WASM/浏览器兼容性只能按实际平台报告 | Windows 证据不得外推到 macOS ARM64/Linux；构建成功不等于 E2E 或听感验收 |
| CHI-007 | P1 | 原生工作区启动接口返回 unavailable/indeterminate；Python 结构化入口拒绝解释器，实际命令未启动 | 已改用父项目内独立 Git worktree 与现有 Python 命令包装器，不安装新工具，不覆盖原 main；记录为执行工具问题而非产品缺陷 |

## 本轮已闭合的接收兼容问题

| ID | 状态 | 证据 |
|---|---|---|
| CHI-008 | VERIFIED：已修复检出兼容 | Windows CRLF 导致辅音校准字符串比较失败；CLI 输出与原始 Git blob 相同。新增 `.gitattributes` 固定生成 JSON 为 LF，原用例与完整测试链通过，未修改数值 |
| CHI-009 | VERIFIED：已修复测试路径兼容 | 两处 URL.pathname 产生 `/E:/...`，触发 5 个 Bun 加载错误并静默跳过跨目标用例。先建 RED 断言，再用 fileURLToPath 修复；最终跨目标逐采样用例执行通过 |
| CHI-010 | OPEN：继承已知风险 | `no_area_jumps_as_a_protruded_lower_lip_tucks` 被上游标记 ignored/known-not-fixed；本轮保留，不能视为通过 |

完整前后结果见 [verification.md](verification.md)。

本轮不通过改声音算法、降低 golden 容差、重新校准、删除失败测试或扩大豁免来使状态变绿。后续发现的实际失败追加到验证记录，并保留原日志。
