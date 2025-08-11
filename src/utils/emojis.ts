export type EmojiDef = { value: string; label: string; keywords: string[] }

export const EMOJI_DEFINITIONS: readonly EmojiDef[] = [
  { value: '🏖️', label: 'Beach/Vacation', keywords: ['vacation', 'holiday'] },
  { value: '🤒', label: 'Sick/Health', keywords: ['sick', 'health'] },
  { value: '👶', label: 'Parental/Baby', keywords: ['maternity', 'paternity', 'parental', 'adoptive'] },
  { value: '📚', label: 'Training/Conference', keywords: ['conference', 'training', 'course'] },
  { value: '✈️', label: 'Travel', keywords: ['travel', 'company travel'] },
  { value: '🏠', label: 'Remote/Home', keywords: ['personal'] },
  { value: '🖤', label: 'Bereavement', keywords: ['bereavement'] },
  { value: '🚨', label: 'Emergency', keywords: ['emergency'] },
  { value: '⚖️', label: 'Legal', keywords: ['jury duty'] },
  { value: '🪖', label: 'Military', keywords: ['military'] },
  { value: '💸', label: 'Unpaid', keywords: ['unpaid'] },
  { value: '🌅', label: 'Sabbatical/Mental Health', keywords: ['sabbatical'] },
  { value: '🤝', label: 'Volunteer', keywords: ['volunteer'] },
  { value: '⏰', label: 'Comp Time', keywords: ['comp time'] },
  { value: '📅', label: 'General/Floating', keywords: ['floating'] },

  // Optional extras for dropdown only (no keywords):
  { value: '🎯', label: 'Personal Goal', keywords: [] },
  { value: '💼', label: 'Business', keywords: [] },
  { value: '🎉', label: 'Celebration', keywords: [] },
  { value: '🔧', label: 'Maintenance', keywords: [] },
  { value: '📞', label: 'Communication', keywords: [] },
] as const

export const DEFAULT_EMOJI_MAP: Record<string, string> = EMOJI_DEFINITIONS
  .flatMap((d) => d.keywords.map((k) => [k.toLowerCase(), d.value] as const))
  .reduce<Record<string, string>>((acc, [k, v]) => {
    acc[k] = v
    return acc
  }, {})

export const POPULAR_EMOJIS = EMOJI_DEFINITIONS.map((d) => ({ value: d.value, label: d.label }))
export const POPULAR_VALUES = POPULAR_EMOJIS.map((e) => e.value)
