import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import type { CoachRequest } from '@/types';

const client = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const body: CoachRequest & {
      annotatedMoves?: Array<{
        san: string; classification?: string; cpLoss?: number;
        moveNumber: number; color: string; bestMoveSan?: string;
      }>;
      opening?: { name: string; eco: string; variation?: string } | null;
      accuracyStats?: { white: Record<string, number>; black: Record<string, number> } | null;
    } = await request.json();

    const { pgn, playerColor, annotatedMoves, opening, accuracyStats } = body;

    if (!pgn) {
      return NextResponse.json({ error: 'PGN is required' }, { status: 400 });
    }

    // Build context about critical moments
    const blunders = annotatedMoves?.filter(m =>
      ['blunder', 'mistake', 'inaccuracy'].includes(m.classification ?? '')
    ) ?? [];

    const brilliants = annotatedMoves?.filter(m =>
      ['brilliant', 'best', 'excellent'].includes(m.classification ?? '')
    ) ?? [];

    const blunderSummary = blunders.slice(0, 5).map(m =>
      `Move ${m.moveNumber}${m.color === 'b' ? '...' : '.'} ${m.san} (${m.classification}, ${m.cpLoss} cp loss; best was ${m.bestMoveSan ?? 'unknown'})`
    ).join('\n');

    const statsText = accuracyStats
      ? `Accuracy — White: ${accuracyStats.white.accuracy}%, Black: ${accuracyStats.black.accuracy}%`
      : '';

    const prompt = `You are Splashy Chess, a warm and knowledgeable chess coach. Analyze this chess game and give actionable, beginner-friendly coaching advice.

Opening: ${opening ? `${opening.name} (${opening.eco})${opening.variation ? ' — ' + opening.variation : ''}` : 'Unknown'}
${statsText}
Player focus: ${playerColor ?? 'both sides'}

Critical moments (${blunders.length} inaccuracies/mistakes/blunders):
${blunderSummary || 'None found'}

PGN:
${pgn}

Please provide a structured coaching response covering:

1. **Opening Phase**: How was the opening handled? Any early mistakes?
2. **Middlegame**: Key moments, tactics missed or found, positional ideas.
3. **Critical Mistakes**: Explain the biggest errors in plain language — what went wrong, why, and what should have been played instead.
4. **Recurring Patterns**: Any repeated mistakes or weaknesses to work on?
5. **Training Suggestions**: 3 specific, actionable things to practice this week.
6. **Positive Feedback**: What did the player(s) do well?

Keep your tone encouraging, specific, and easy to understand for an intermediate club player. Use chess terms but explain them when you use them.`;

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const advice =
      message.content[0]?.type === 'text' ? message.content[0].text : 'No advice generated.';

    return NextResponse.json({ advice });
  } catch (error) {
    console.error('[Coach API] Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate coaching advice';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
