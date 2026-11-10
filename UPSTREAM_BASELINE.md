# CHIMERA 上游与接收基线

本文件记录 Easy-4-Rust 的源码来源，不代表运行时验收或发布批准。

| 项目 | 已核验值 |
|---|---|
| Fork | `easy-4-rust/chimera-vocal-synth` |
| GitHub `fork` | `true` |
| GitHub `parent.full_name` / `source.full_name` | `jamesondh/chimera-vocal-synth` |
| 上游 Remote | `upstream` → `https://github.com/jamesondh/chimera-vocal-synth.git` |
| 自有 Remote | `origin` → `https://github.com/easy-4-rust/chimera-vocal-synth.git` |
| 冻结产品基线 | `5ab44de236b0eb384ec4d81ec216e0d0928a9f7a` |
| 已有 OpenSpec 计划 HEAD | `6fcb80350a0e0386135a75f40ccd66da370945e5` |
| 本轮接收分支 | `integration/phase-1` |
| 本轮观察到的上游 HEAD | `d361a82ce1b18d0ac19001aab19169ff2c1eb9e8` |
| 共同祖先 | `5ab44de236b0eb384ec4d81ec216e0d0928a9f7a` |
| 接收分支起点相对上游 | 本地独有 9 个计划提交；上游独有 19 个提交 |

## 冻结规则

产品基线没有随着本轮 `fetch upstream` 移动。上游 19 个新增提交仅登记，未 merge、cherry-pick 或修改其文件。

`integration/phase-1` 从已有计划 HEAD 创建，而不是丢弃计划文件重新从上游基线开始。这个起点是冻结基线的后代，新增内容仅为先前提交的 9 个 OpenSpec 文档；产品源码仍对应冻结基线。

实际读取时间使用证据文件内的 UTC 时间，不以本文件名或对话日期推断。

## 证据

- [仓库快照](docs/adoption/phase-1/evidence/repository-snapshot.json)：Parent、Source、权限、默认分支、保护状态、Remote、共同祖先。
- [上游待评审提交](docs/adoption/phase-1/upstream-commits.tsv)。
- [已有本地计划提交](docs/adoption/phase-1/local-commits.tsv)。
- [固定基线文件清单](docs/adoption/phase-1/tracked-assets.tsv)。
- [接收执行记录](docs/adoption/phase-1/README.md)。

本轮使用 Windows 台式机上的隔离 Git worktree，不在原 checkout 的 `main` 上开发。完整接收范围为 Native Engine、WASM/AudioWorklet、CLI、React UI 以及原有工具、测试、fixtures 和文档。
