import { execSync } from 'child_process';
import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { run } from 'vite-plugin-run';

const debouncedMetaBuild = debounceMetaOnChange();

export default ({ mode }: { mode: string }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return defineConfig({
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler', // or "modern"
                },
            },
        },
        publicDir: './assets',
        plugins: [
            react(),
            run([
                {
                    name: 'UI Updates',
                    condition: (file) => {
                        return file.includes('packages/react');
                    },
                    onFileChanged: ({ file }) => {
                        console.log(`File changed: ${file}`);
                        if (process.env.UPDATE_META === 'true') debouncedMetaBuild();
                    },
                },
            ]),
            {
                name: 'custom-dev-events',
                configureServer(server) {
                    server.ws.on('request-meta-refresh', () => {
                        execSync(`npm run meta`, { stdio: 'inherit' });
                    });
                },
            },
        ],
        optimizeDeps: {
            exclude: ['@ptrn/react'],
        },
        server: {
            // The site is served at https://pttrn.local through a proxy, so the HMR socket must go
            // through that same origin (wss on 443), not straight to localhost.
            hmr: {
                host: 'pttrn.local',
                protocol: 'wss',
                clientPort: 443,
            },
            port: 8055,
            allowedHosts: ['pttrn.local'],
        },
        preview: {
            port: 8055,
            allowedHosts: ['pttrn.local'],
        },
        build: {
            outDir: './dist',
            emptyOutDir: true,
        },
        resolve: {
            alias: {
                src: '/src',
                components: '/src/components',
                utils: '/src/utils',
                tests: '/tests',
                // these are for local @ptrn/react development
                '-/components': resolve(__dirname, '../packages/react/src/components'),
                '-/hooks': resolve(__dirname, '../packages/react/src/hooks'),
                '-/utils': resolve(__dirname, '../packages/react/src/utils'),
                '-/constants': resolve(__dirname, '../packages/react/src/constants'),
                '-/styles': resolve(__dirname, '../packages/react/src/styles'),
                '-/types': resolve(__dirname, '../packages/react/src/types'),
            },
        },
    });
};

/**
 * This function debounces the meta file rebuild process.
 *
 * @returns A debounced function that rebuilds the meta files.
 */
function debounceMetaOnChange() {
    let debouncedMetaTimeout: NodeJS.Timeout | null = null;
    return () => {
        if (debouncedMetaTimeout) clearTimeout(debouncedMetaTimeout);
        debouncedMetaTimeout = setTimeout(() => {
            try {
                execSync(`npm run meta`, { stdio: 'inherit' });
            } catch (error) {
                console.error('Error occurred while running meta:', error);
            }
        }, 3000);
    };
}
