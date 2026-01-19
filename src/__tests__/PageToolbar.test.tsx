import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useMutation } from 'convex/react';
import PageToolbar from '../components/PageToolbar';
import type { Shape } from '../utils/annotationTypes';

describe('PageToolbar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        window.history.replaceState({}, '', '/');
    });

    it('saves shapes via the mutation and shows the share link', async () => {
        const saveMock = vi.fn().mockResolvedValue(undefined);
        vi.mocked(useMutation).mockReturnValue(saveMock as any);

        const shapes: Shape[] = [
            {
                id: 'shape-1',
                type: 'pen',
                color: '#111111',
                strokeWidth: 2,
                points: [{ x: 10, y: 12 }],
            },
        ];

        const user = userEvent.setup();
        render(<PageToolbar shapes={shapes} onReset={() => { }} />);

        await user.click(screen.getByRole('button', { name: 'Share Suggestions' }));

        expect(saveMock).toHaveBeenCalledWith({
            resumeId: expect.any(String),
            shapes: JSON.stringify(shapes),
        });
        expect(await screen.findByText('Suggestions Saved!')).toBeInTheDocument();
    });
});
