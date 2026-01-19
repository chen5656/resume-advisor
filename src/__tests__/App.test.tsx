import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useQuery } from 'convex/react';
import App from '../App';

describe('App', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useQuery).mockReturnValue(null);
        window.history.replaceState({}, '', '/');
    });

    it('renders landing view when no params are set', () => {
        render(<App />);

        expect(screen.getByText('Resume Advisor')).toBeInTheDocument();
        expect(screen.getByLabelText('Page URL')).toBeInTheDocument();
    });

    it('shows validation error for invalid URL input', async () => {
        const user = userEvent.setup();
        render(<App />);

        await user.type(screen.getByLabelText('Page URL'), 'ftp://example.com');
        await user.click(screen.getByRole('button', { name: 'Open review tab' }));

        expect(screen.getByText('Enter a valid http(s) URL.')).toBeInTheDocument();
    });
});
