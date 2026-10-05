#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { createServer, loadCatalog, loadGuide } from './core/index.js';

const server = createServer(loadCatalog(), loadGuide());
await server.connect(new StdioServerTransport());
