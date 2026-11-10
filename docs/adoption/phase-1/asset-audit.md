# WP-02：源码、依赖与资产接收审计

## 口径

唯一盘点对象是 Git 提交 `5ab44de236b0eb384ec4d81ec216e0d0928a9f7a`。`tracked-assets.tsv` 逐条记录 Git mode、blob SHA、大小、原始 Git blob 的 SHA-256、分类与处置。哈希读取 Git 对象，不读取可能被 Windows CRLF 转换的工作树文本。

该基线共 **244 个文件，9,727,245 字节**。此前 9 个 OpenSpec 文件和本轮新报告不属于原始产品分母。

| 分类 | 文件数 |
|---|---:|
| 根配置与文档 | 13 |
| Rust 源码、测试、工具 | 83 |
| 生成校准数据 | 4 |
| Golden fixtures 与说明 | 21 |
| 文档、设计参考 | 29 |
| 词典与许可 | 2 |
| public/fonts 字体与许可 | 6 |
| 浏览器源码与资源 | 61 |
| 浏览器测试 | 10 |
| tools 工具与生成器 | 15 |

分类互斥，总计 244。文件扩展名另行统计，不与上述分层相加。16 个二进制/媒体候选由 9 个 `.f32`、6 个字体文件和 1 个词典 gzip 构成；基线没有受 Git 跟踪的 WAV、MP3、PNG、JPG 或 SVG 文件。

## Workspace 与依赖

保留 `chimera`、`chimera-wasm`、`chimera-cli` 三个成员。`Cargo.lock` 包含 26 个 package 记录，其中 3 个为 workspace 包；其余为锁定的外部 Rust 包，不等于 26 个直接依赖。具体 manifest、targets、examples、tests 见 `rust-inventory.json` 及 Cargo metadata 证据。

Web manifest 声明 4 个生产直接依赖、8 个开发直接依赖。保留 `bun.lock`，已执行 `bun install --frozen-lockfile`：当前 Windows 平台安装 38 个包，而完整锁文件包含 82 个包记录。38 个包从已安装 package.json 读取许可，另外 44 个平台可选包仅查询 npm registry 精确版本元数据，并核对包名、版本和 dist.integrity 与锁文件相等，未下载其二进制。82 个包均有许可声明；23 个外部 Rust 包也均有许可元数据。详见 `dependency-licenses.json` 与 `dependency-summary.json`。

Vite 开发监听 `127.0.0.1:5317`，preview 为 `127.0.0.1:5318`。`vercel.json` 的部署安装脚本会调用网络安装 Rust，因此它不是离线/完全固定工具链部署的证据。本轮未执行该部署脚本。冻结基线未包含 `.github/workflows/` 文件，CI 仍属于 WP-07 待实施任务。

## 字体、词典及音频

Archivo 两个 WOFF2 文件采用仓库随附 SIL OFL 1.1。AVHershey Light/Medium 同时存在于 `public/fonts/` 与 `docs/mockups/gen/fonts/`；重复副本必须进行 Git blob/哈希一致性检查，不只根据文件名判断。结果记录在 `asset-verification.json`。

CMUdict gzip 对应独立许可，不能被根目录 MIT 替换。生成的 `.f32` 依据上游 Golden README 归类为合成器测试输出，不将其冒充 CSD 真人录音。Golden 中一部分已经允许从 Rust 引擎重建，其余仍记录旧 TypeScript 行为；必须逐 fixture 保留来源，不笼统宣称全部都是当前 TypeScript oracle。

## 不进入发布包的内容

`target/`、`node_modules/`、`dist/`、`out/`、`src/wasm/chimera.wasm` 是构建/运行输出。`.gitignore` 还忽略 `*.wav` 和 `public/shows/`。本轮不下载 CSD、不生成翻唱演出资产、不重写已提交的校准表或原 fixture。执行继承 CLI 测试时会向临时目录生成校准输出及合成音频，这是验证产物，不进入提交。

超过 1,000,000 字节的基线文件仅有 `golden/analysis.json`（1,052,369）与 `golden/creatures.f32`（1,072,896）；二者作为已有测试资产保留。没有因为文件较大而删除它们。

## 审计边界

盘点与哈希是实际执行结果；许可归类是基于随附声明/包元数据的静态审查，不代表所有第三方依赖已完成安全审计、许可证真实性鉴证或发布产物认证。跨平台未安装包通过精确版本 registry 元数据补齐声明，但尚未下载/检查其完整二进制包内容；不能把声明齐全当成每个平台均已安全认证。后续发布仍受 `risk-register.md` 与 WP-07 门禁约束。
