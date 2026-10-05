import { InputPhone } from '.';
import { hasNoBasicA11yIssues } from '-/rtl/hasNoBasicA11yIssues';
import { fireEvent, render } from '-/rtl/util';
import { countryCodes, SupportedCountryCode } from '-/utils/countryCodes';

const TestBed = () => (
    <InputPhone aria-label="Phone number input" name="example-name" onChange={() => {}} value="9375551060" />
);

const renderWithCountry = (initialCountryCode: SupportedCountryCode) =>
    render(
        <InputPhone
            aria-label="Phone number input"
            initialCountryCode={initialCountryCode}
            name="example-name"
            onChange={() => {}}
            value=""
        />,
    );

describe('InputPhone (RTL)', () => {
    it('has no basic a11y issues', hasNoBasicA11yIssues(<TestBed />));

    it('renders', () => {
        const { getAllByLabelText } = render(<TestBed />);

        expect(getAllByLabelText('Phone number input')[0]).toBeInTheDocument();
    });

    it('shows no flags by default', () => {
        const { getByRole } = renderWithCountry('GB');

        expect(getByRole('combobox', { name: 'select country code' }).querySelector('[data-test-flag]')).toBeNull();

        fireEvent.click(getByRole('combobox', { name: 'select country code' }));

        expect(document.querySelector('[data-test-flag]')).toBeNull();
    });

    it('renders a hidden flag for the selected country and each menu option with renderFlag', () => {
        const { getByRole } = render(
            <InputPhone
                aria-label="Phone number input"
                initialCountryCode="GB"
                name="example-name"
                onChange={() => {}}
                renderFlag={(code) => <i data-test-flag={code} />}
                value=""
            />,
        );

        const button = getByRole('combobox', { name: 'select country code' });
        const selected = button.querySelector('[data-test-flag="GB"]');
        expect(selected).toBeInTheDocument();
        expect(selected?.parentElement).toHaveAttribute('aria-hidden', 'true');

        fireEvent.click(button);

        // plain DOM queries: the floating menu has no layout in jsdom, so role queries skip it (and are slow on 200+ items)
        const options = Array.from(document.querySelectorAll('[role="option"]'));
        expect(options).toHaveLength(countryCodes.length);
        options.forEach((option) => expect(option.querySelector('[data-test-flag]')).toBeInTheDocument());
    });
});
