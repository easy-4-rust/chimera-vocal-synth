# 第三方资产与许可索引

适用范围：冻结上游提交 `5ab44de236b0eb384ec4d81ec216e0d0928a9f7a` 的接收盘点。本索引不替换任何随附许可证，也不把所有第三方内容重新授权为 MIT。

| 资产 | 原作者/来源 | 随附许可依据 | 处置 |
|---|---|---|---|
| CHIMERA 原始代码 | Jameson Hodge / jamesondh/chimera-vocal-synth | 根目录 [LICENSE](LICENSE)，MIT | 保留原版权、许可、免责条款和 Git 历史 |
| CMU Pronouncing Dictionary | Carnegie Mellon University | [CMUDICT-LICENSE.txt](public/data/CMUDICT-LICENSE.txt) | 源码和二进制分发均携带所要求的版权、条件及免责声明 |
| Archivo Latin / Latin Extended WOFF2 | The Archivo Project Authors | [OFL.txt](public/fonts/OFL.txt)，SIL OFL 1.1 | 保留该许可及版权；不得作为字体单独售卖；修改字体时重新审查许可和名称要求 |
| AVHershey Simplex Light / Medium OTF | Stewart C. Russell / scruss/AVHershey-OTF | [AVHERSHEY-LICENSE.txt](public/fonts/AVHERSHEY-LICENSE.txt) 声明 CC0 1.0 / WTFPL 双许可 | 保留来源与许可声明；包括 public/fonts 和 docs/mockups/gen/fonts 中的副本 |
| Cargo / Bun 外部包 | 各包维护者 | [依赖清单](docs/adoption/phase-1/dependency-licenses.json) 的版本、license 和来源字段 | 保留各包自身条款；未安装平台包以精确版本 registry 声明及锁完整性匹配登记，发布前再核验实际产物 |
| 合成 Golden Fixtures | 上游 TypeScript/Rust 引擎生成 | [Golden README](crates/chimera/tests/golden/README.md) | 保留原 fixture 与生成来源；禁止为了让测试变绿而无解释 re-bless |

## 外部数据与内容

CSD 不随本次接收下载或重新分发。上游 `docs/csd-comparison.md`、`tools/fetch-csd.sh` 声明 CC BY-NC-SA 4.0，并规定其音频及衍生输出不得随产品交付。本次遵守该项目政策；任何扩大用途必须单独审查，不据此泛化为对所有非商业许可证的法律结论。

`public/shows/` 是上游明确忽略的本地演出资源；接收 Duet 播放功能不等于取得任意翻唱歌曲或配套音频的分发权。自动化 E2E 应使用权利明确、自行生成的短样例，不把受限演出资源填进仓库。

许可核对结果、字体副本哈希、生成数据与大文件记录见 [资产报告](docs/adoption/phase-1/asset-audit.md)。
