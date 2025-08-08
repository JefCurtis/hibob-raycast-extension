import { 
    Action, 
    ActionPanel, 
    Color, 
    Form, 
    Icon, 
    List, 
    Toast, 
    popToRoot, 
    showToast, 
    useNavigation 
} from '@raycast/api'
import { useEffect, useState } from 'react'
import { 
    getAllDiscoveredTypes, 
    setCustomEmoji, 
    clearDiscoveredTypes,
    type TimeOffTypeMapping 
} from './utils/time-off-types'

// Popular emoji options for quick selection
const EMOJI_OPTIONS = [
    '🏖️', '🤒', '👶', '📚', '✈️', '🏠', '🖤', '🚨', '⚖️', '🪖', 
    '💸', '🌅', '🤝', '⏰', '📅', '🎯', '💼', '🎉', '🔧', '📞',
    '🏥', '🚗', '🏢', '🎓', '🍽️', '💻', '🎨', '🏃', '🧘', '🎵'
]

function EmojiPicker({ 
    timeOffType, 
    currentEmoji, 
    onSelect 
}: { 
    timeOffType: string
    currentEmoji: string
    onSelect: (emoji: string) => void 
}) {
    const { pop } = useNavigation()
    const [customEmoji, setCustomEmojiInput] = useState(currentEmoji)

    return (
        <List
            navigationTitle={`Select Emoji for "${timeOffType}"`}
            searchBarPlaceholder="Search emojis..."
        >
            <List.Section title="Quick Options">
                {EMOJI_OPTIONS.map((emoji) => (
                    <List.Item
                        key={emoji}
                        title={emoji}
                        subtitle={emoji === currentEmoji ? 'Current' : ''}
                        icon={{ source: emoji === currentEmoji ? Icon.Check : Icon.Circle }}
                        actions={
                            <ActionPanel>
                                <Action
                                    title="Select This Emoji"
                                    onAction={async () => {
                                        onSelect(emoji)
                                        await showToast({ 
                                            style: Toast.Style.Success, 
                                            title: `Set ${emoji} for "${timeOffType}"` 
                                        })
                                        pop()
                                    }}
                                />
                            </ActionPanel>
                        }
                    />
                ))}
            </List.Section>
            
            <List.Section title="Custom Emoji">
                <List.Item
                    title="Enter Custom Emoji"
                    subtitle="Type any emoji"
                    icon={Icon.Pencil}
                    actions={
                        <ActionPanel>
                            <Action.Push
                                title="Enter Custom Emoji"
                                target={
                                    <Form
                                        navigationTitle="Custom Emoji"
                                        actions={
                                            <ActionPanel>
                                                <Action.SubmitForm
                                                    title="Save Custom Emoji"
                                                    onSubmit={async (values: { emoji: string }) => {
                                                        if (values.emoji) {
                                                            onSelect(values.emoji)
                                                            await showToast({ 
                                                                style: Toast.Style.Success, 
                                                                title: `Set ${values.emoji} for "${timeOffType}"` 
                                                            })
                                                            popToRoot()
                                                        }
                                                    }}
                                                />
                                            </ActionPanel>
                                        }
                                    >
                                        <Form.TextField
                                            id="emoji"
                                            title="Custom Emoji"
                                            placeholder="Enter any emoji..."
                                            defaultValue={customEmoji}
                                        />
                                    </Form>
                                }
                            />
                        </ActionPanel>
                    }
                />
            </List.Section>
        </List>
    )
}

export default function ManageEmojis() {
    const [discoveredTypes, setDiscoveredTypes] = useState<TimeOffTypeMapping[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadTypes = async () => {
            const types = await getAllDiscoveredTypes()
            setDiscoveredTypes(types)
            setIsLoading(false)
        }
        loadTypes()
    }, [])

    const refreshTypes = async () => {
        setIsLoading(true)
        const types = await getAllDiscoveredTypes()
        setDiscoveredTypes(types)
        setIsLoading(false)
    }

    const handleEmojiChange = async (timeOffType: string, emoji: string) => {
        await setCustomEmoji(timeOffType, emoji)
        await refreshTypes()
    }

    return (
        <List
            navigationTitle="Manage Time-Off Emojis"
            isLoading={isLoading}
            searchBarPlaceholder="Search time-off types..."
        >
            <List.Section 
                title="Discovered Time-Off Types" 
                subtitle={`${discoveredTypes.length} types found`}
            >
                {discoveredTypes.map((type) => (
                    <List.Item
                        key={type.type}
                        title={type.type}
                        subtitle={`Used ${type.count} times • ${type.isCustom ? 'Custom' : 'Auto-mapped'}`}
                        icon={type.emoji}
                        accessories={[
                            { text: type.emoji },
                            { 
                                icon: type.isCustom ? Icon.Pencil : Icon.Wand,
                                tooltip: type.isCustom ? 'Custom emoji' : 'Auto-mapped emoji'
                            }
                        ]}
                        actions={
                            <ActionPanel>
                                <Action.Push
                                    title="Change Emoji"
                                    icon={Icon.Pencil}
                                    target={
                                        <EmojiPicker
                                            timeOffType={type.type}
                                            currentEmoji={type.emoji}
                                            onSelect={(emoji) => handleEmojiChange(type.type, emoji)}
                                        />
                                    }
                                />
                                <ActionPanel.Section>
                                    <Action
                                        title="Refresh List"
                                        icon={Icon.ArrowClockwise}
                                        onAction={refreshTypes}
                                        shortcut={{ modifiers: ['cmd'], key: 'r' }}
                                    />
                                    <Action
                                        title="Clear All Discovered Types"
                                        icon={{ source: Icon.Trash, tintColor: Color.Red }}
                                        onAction={async () => {
                                            await clearDiscoveredTypes()
                                            await showToast({ 
                                                style: Toast.Style.Success, 
                                                title: 'Cleared all discovered types' 
                                            })
                                            await refreshTypes()
                                        }}
                                    />
                                </ActionPanel.Section>
                            </ActionPanel>
                        }
                    />
                ))}
            </List.Section>
            
            {discoveredTypes.length === 0 && !isLoading && (
                <List.EmptyView
                    title="No Time-Off Types Discovered Yet"
                    description="Use the main calendar view to discover time-off types from your HiBob data, then return here to customize their emojis."
                    icon={Icon.Calendar}
                />
            )}
        </List>
    )
}
