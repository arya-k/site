# Personal Site

This website is a static site, built with Zola and tailwindcss.
It's published using Cloudflare Pages for now.

``toml
[environment]
NODE_ENV = "production"
ZOLA_VERSION = "0.13.0"

[other]
publish = "public"
command = "npm run build:css && zola build"
```
