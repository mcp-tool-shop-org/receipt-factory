<p align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/receipt-factory/readme.png" width="400" />
</p>

# @mcptoolshop/rf-render

Markdown and HTML renderers for receipts.

Part of [receipt-factory](https://github.com/mcp-tool-shop-org/receipt-factory).

## Install

```bash
npm install @mcptoolshop/rf-render
```

## Usage

```ts
import { renderMarkdown, renderHtml } from "@mcptoolshop/rf-render";

const md = renderMarkdown(receipt);
const html = renderHtml(receipt); // standalone HTML with embedded CSS
```

## Exports

| Export | Type | Description |
|--------|------|-------------|
| `renderMarkdown` | function | Render receipt as GitHub-flavored markdown |
| `renderHtml` | function | Render receipt as standalone HTML page |
| `RECEIPT_CSS` | string | Default CSS for HTML receipts |

## License

MIT
