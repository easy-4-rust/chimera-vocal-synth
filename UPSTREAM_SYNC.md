# 上游同步与分支维护

## WP-03 选择性回填

`186b75a1a8cf22017f68cd8acac8015d29cbf437` 的默认人声采样倍率策略已在接收分支选择性回填，保留上游来源及独立 RED/GREEN。此举不增加上游 ancestry，不代表完整 merge 或 cherry-pick；19 个待审提交仍未批量合入。详细处置见 [WP-03](docs/adoption/phase-1/wp03/README.md)。后文“全部 REVIEW_PENDING”是初始 WP-01 快照，当前该条的采样率修复为 SELECTIVELY_BACKPORTED_VERIFIED，其余内容仍待审。


## 分支职责

`upstream/main` 是原作者源码事实源；`origin/main` 是 Easy-4-Rust 的稳定分支，不能同时把它定义为永不含本地修改的上游镜像。当前阶段它保持未修改，接收完成后的合并另行审批。

`integration/phase-1` 承载接收工作；`openspec/adopt-chimera-vocal-synth` 保留已提交计划。后续 `feature/*`、`fix/*`、`sync/upstream-*` 均从当时已核验的接收分支起点创建。不得覆盖别人的工作树、重置共享分支、强推或改写已经推送的历史。

当前仓库读取结果：既有分支 `protected=false`，可见 rulesets 为空。本文件是维护规约，不代表 GitHub 已经强制执行这些门禁。本轮没有修改保护规则、权限、Secrets 或 Actions 工作流。

## 同步步骤

以下是维护操作规程，不表示本轮已执行 merge 或 push 上游更新。

1. 检查 `git status --porcelain`、`git remote -v`、`git worktree list`，确认没有在途修改和错误 Remote；只向 `origin` 推送。
2. `git fetch origin`、`git fetch upstream`，记录两侧完整 SHA 与 `git merge-base`。
3. 在独立 worktree 建立 `sync/upstream-<short-sha>`，起点为已验证的接收分支 HEAD。
4. 使用 `git log --reverse <old-upstream>..<new-upstream>` 和 `git diff --name-status <old-upstream> <new-upstream>` 审查 DSP、API、ABI、音素规则、UI、依赖、许可、golden 和生成数据。
5. 在同步分支执行 merge，保留上游提交 ancestry；不在共享接收分支试验冲突解决。
6. 逐项记录冲突的路径、选用行为、来源、理由和测试。禁止用整文件 `ours`/`theirs` 批量掩盖冲突，禁止未经分析重新生成 golden。
7. 执行受影响测试及完整 `bun run test`、`bun run typecheck`；涉及 Web/WASM 时增加 build、preview、E2E。记录实际 OS/架构和退出码。
8. 以 PR 展示提交范围、风险和证据；完成评审与明确合并批准后，才进入接收分支。发布批准独立于合并成功。

## 回退与恢复

未提交的 merge 冲突只在专用干净同步 worktree 中使用 `git merge --abort`；先确认没有用户新增修改。已经推送的错误同步，通过新的 revert 提交恢复，merge revert 必须核实主父提交后才执行。禁止通过 `reset --hard` 或 force-push 回滚共享历史。任何回退都重新执行相关测试，并记录被回退 SHA 与恢复 SHA。

## 本轮同步账本

冻结基线为 `5ab44de236b0eb384ec4d81ec216e0d0928a9f7a`，观察到上游 `d361a82ce1b18d0ac19001aab19169ff2c1eb9e8`。19 个新增提交全部为 **REVIEW_PENDING / NOT_MERGED**。其中低采样率修复 `186b75a1a8cf22017f68cd8acac8015d29cbf437` 优先级最高，见 [风险登记](docs/adoption/phase-1/risk-register.md)。
