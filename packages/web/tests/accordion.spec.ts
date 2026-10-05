import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { BUNDLE, mount } from './mount';

const CONTENT = `<p>Actualize the plan and markets. Going forward, we should harness the asset.</p>`;

/** Mirrors the presets in `packages/react/src/components/Accordion/AccordionExample.tsx`. */
const PRESETS = {
    Default: `
        <ptrn-accordion>
            <ptrn-accordion-item heading="Section 1" subtitle="Subtitle">${CONTENT}</ptrn-accordion-item>
            <ptrn-accordion-item heading="Section 2">
                <span slot="leading">Lead</span>
                ${CONTENT}
                <span slot="trailing">Trailing</span>
            </ptrn-accordion-item>
            <ptrn-accordion-item heading="Section 3">${CONTENT}</ptrn-accordion-item>
        </ptrn-accordion>`,
    '1 disabled': `
        <ptrn-accordion>
            <ptrn-accordion-item heading="Section 1">${CONTENT}</ptrn-accordion-item>
            <ptrn-accordion-item heading="Section 2" disabled>${CONTENT}</ptrn-accordion-item>
            <ptrn-accordion-item heading="Section 3">${CONTENT}</ptrn-accordion-item>
        </ptrn-accordion>`,
    '1 disabled and open (but not showing)': `
        <ptrn-accordion>
            <ptrn-accordion-item heading="Section 1">${CONTENT}</ptrn-accordion-item>
            <ptrn-accordion-item heading="Section 2" disabled open>${CONTENT}</ptrn-accordion-item>
            <ptrn-accordion-item heading="Section 3">${CONTENT}</ptrn-accordion-item>
        </ptrn-accordion>`,
};

const THREE = PRESETS.Default;

test.describe('ptrn-accordion', () => {
    for (const [label, html] of Object.entries(PRESETS)) {
        test(`has no basic a11y issues - ${label}`, async ({ page }) => {
            await mount(page, html);
            // Scoped to the component, like the React suite, so page-level rules (title, lang, landmarks) do not apply.
            const results = await new AxeBuilder({ page }).include('ptrn-accordion').analyze();
            expect(results.violations).toEqual([]);
        });
    }

    test('renders its sections', async ({ page }) => {
        await mount(page, THREE);
        await expect(page.getByRole('button', { name: 'Section 2' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Section 3' })).toBeVisible();
    });

    test('starts closed and opens and closes on click', async ({ page }) => {
        await mount(page, THREE);
        const header = page.getByRole('button', { name: 'Section 1' });
        await expect(header).toHaveAttribute('aria-expanded', 'false');
        await expect(page.getByText('Actualize').first()).toBeHidden();

        await header.click();
        await expect(header).toHaveAttribute('aria-expanded', 'true');
        await expect(page.getByText('Actualize').first()).toBeVisible();

        await header.click();
        await expect(header).toHaveAttribute('aria-expanded', 'false');
    });

    test('honors the open attribute on first render', async ({ page }) => {
        await mount(
            page,
            `<ptrn-accordion><ptrn-accordion-item heading="A" open>${CONTENT}</ptrn-accordion-item></ptrn-accordion>`,
        );
        await expect(page.getByRole('button', { name: 'A' })).toHaveAttribute('aria-expanded', 'true');
    });

    // Regression guard for parity with React `singleOpen` (default true).
    test('closes the other panels when one opens by default', async ({ page }) => {
        await mount(page, THREE);
        const one = page.getByRole('button', { name: 'Section 1' });
        const two = page.getByRole('button', { name: /Section 2/ });
        await one.click();
        await two.click();
        await expect(one).toHaveAttribute('aria-expanded', 'false');
        await expect(two).toHaveAttribute('aria-expanded', 'true');
    });

    test('keeps several panels open with the multiple attribute', async ({ page }) => {
        await mount(page, THREE.replace('<ptrn-accordion>', '<ptrn-accordion multiple>'));
        const one = page.getByRole('button', { name: 'Section 1' });
        const two = page.getByRole('button', { name: /Section 2/ });
        await one.click();
        await two.click();
        await expect(one).toHaveAttribute('aria-expanded', 'true');
        await expect(two).toHaveAttribute('aria-expanded', 'true');
    });

    test('does not toggle a disabled panel', async ({ page }) => {
        await mount(page, PRESETS['1 disabled']);
        const disabled = page.getByRole('button', { name: 'Section 2' });
        await expect(disabled).toBeDisabled();
        await disabled.click({ force: true });
        await expect(disabled).toHaveAttribute('aria-expanded', 'false');
    });

    // Regression guard: React ignores `isOpen` on a disabled section.
    test('keeps a disabled panel closed even when open is set', async ({ page }) => {
        await mount(page, PRESETS['1 disabled and open (but not showing)']);
        await expect(page.getByRole('button', { name: 'Section 2' })).toHaveAttribute('aria-expanded', 'false');
    });

    test('toggles with Enter and Space', async ({ page }) => {
        await mount(page, THREE);
        const header = page.getByRole('button', { name: 'Section 1' });
        await header.focus();
        await page.keyboard.press('Enter');
        await expect(header).toHaveAttribute('aria-expanded', 'true');
        await page.keyboard.press('Space');
        await expect(header).toHaveAttribute('aria-expanded', 'false');
    });

    test('points aria-controls at the panel it opens', async ({ page }) => {
        await mount(page, THREE);
        const relationship = await page.evaluate(() => {
            const item = document.querySelector('ptrn-accordion-item')!;
            const header = item.shadowRoot!.querySelector('button')!;
            const panel = item.shadowRoot!.getElementById(header.getAttribute('aria-controls')!);
            return { found: !!panel, isContent: panel?.hasAttribute('data-content') };
        });
        expect(relationship).toEqual({ found: true, isContent: true });
    });

    test('fires ptrn-toggle with the new state', async ({ page }) => {
        await mount(page, THREE);
        const events = await page.evaluate(async () => {
            const seen: boolean[] = [];
            document.addEventListener('ptrn-toggle', (e) => seen.push((e as CustomEvent).detail.open));
            const button = document.querySelector('ptrn-accordion-item')!.shadowRoot!.querySelector('button')!;
            button.click();
            button.click();
            return seen;
        });
        expect(events).toEqual([true, false]);
    });

    test('shows leading and trailing slot content and the subtitle', async ({ page }) => {
        await mount(page, THREE);
        await expect(page.getByText('Subtitle')).toBeVisible();
        await expect(page.getByText('Lead')).toBeVisible();
        await expect(page.getByText('Trailing')).toBeVisible();
    });

    test('reflects open and disabled as attributes', async ({ page }) => {
        await mount(page, THREE);
        const item = page.locator('ptrn-accordion-item').first();
        await page.getByRole('button', { name: 'Section 1' }).click();
        await expect(item).toHaveAttribute('open', '');
        await item.evaluate((el) => ((el as HTMLElement & { disabled: boolean }).disabled = true));
        await expect(item).toHaveAttribute('disabled', '');
    });

    test('can be loaded twice without throwing', async ({ page }) => {
        await mount(page, THREE);
        const errors: string[] = [];
        page.on('pageerror', (e) => errors.push(e.message));
        await page.addScriptTag({ path: BUNDLE, type: 'module' });
        await page.waitForTimeout(100);
        expect(errors).toEqual([]);
    });
});
