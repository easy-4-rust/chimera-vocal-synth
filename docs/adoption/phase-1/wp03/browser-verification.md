# WP-03 浏览器验收记录

## 实际执行

生产构建 `bun run build` 成功后，在本机专用端口 `127.0.0.1:25318` 启动 Vite preview。执行结束关闭本轮创建的服务器进程树，没有停止其他服务。使用现有 Chrome `157.0.8103.38`，没有安装/升级浏览器。

| 验证 | 结果 | 范围 |
|---|---|---|
| `tools/e2e-device-sample-rates.ts` | exit 0 | 强制 48/16/24 kHz，逐组 24 次遥测，有限、有声、时钟推进、无 console/page error，RMS 与 48 kHz 参考比较 |
| 继承 `tools/e2e.ts` | exit 0，console errors: none | 初始 Sing 首键，以及 desktop 1440×980 / mobile 390×844 的 Play、Speak、Sing、Beatbox、Bestiary、返回 Play 等原有断言 |

原脚本默认需要尚未安装的 Playwright bundled Chromium。本轮通过仅用于执行的 preload 将 `chromium.launch` 的 executablePath 指向已有 Chrome，原脚本内容和断言均未修改。preload 位于忽略的 `out/wp03/browser-preload.ts`；复现内容如下：

```typescript
import { chromium } from "playwright-core";
const launch = chromium.launch.bind(chromium);
chromium.launch = (options = {}) => launch({
  ...options,
  executablePath: process.env.CHIMERA_BROWSER_EXECUTABLE,
});
```

设置 `CHIMERA_BROWSER_EXECUTABLE` 为本机现有 Chrome 路径后执行：

```sh
bun tools/e2e-device-sample-rates.ts http://127.0.0.1:25318/ out/wp03/device-rates
bun --preload ./out/wp03/browser-preload.ts tools/e2e.ts http://127.0.0.1:25318/ out/wp03/inherited-e2e
```

## 限制

这是 headless Chrome 的真实浏览器音频调用链，不是实际蓝牙硬件的开关、断连、重连测试，也没有主观试听。24 次遥测不能证明音频每个时刻无毛刺；全样本有限性由独立 Native/WASM PCM 测试覆盖。继承 E2E 的成功仅覆盖脚本实际断言，动物页面的一些瞬时 RMS 只是观测值；未将它当作全部动物听感或声学质量认证。

未覆盖 Duet 私有演出资源、真实 MIDI 硬件、Safari/Firefox、手机实体浏览器、长时间播放中断。T072 与 WP-06 总验收保持未完成。

证据：[原脚本日志](evidence/upstream-browser-e2e.txt)、[低采样率日志](evidence/browser-low-rates.txt)、[遥测报告](evidence/browser-device-rate-report.json)、[命令和退出码](evidence/browser-and-benchmark-commands.json)。截图保留在本地忽略的 out 目录，没有作为源资产或新增发布资源提交。
