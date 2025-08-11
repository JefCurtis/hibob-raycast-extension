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
} from '@raycast/api'
import { useEffect, useState } from 'react'
import { 
    getAllDiscoveredTypes, 
    setCustomEmoji, 
    clearDiscoveredTypes,
    type TimeOffTypeMapping 
} from './utils/time-off-types'
import { POPULAR_EMOJIS, POPULAR_VALUES } from './utils/emojis'

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
                                        <Form
                                            navigationTitle={`Select Emoji for "${type.type}"`}
                                            actions={
                                                <ActionPanel>
                                                                                                    <Action.SubmitForm
                                                    title="Save Emoji"
                                                    onSubmit={async (values: { emoji: string; customEmoji: string }) => {
                                                        let selectedEmoji: string
                                                        
                                                        if (values.emoji === 'custom') {
                                                            if (!values.customEmoji || values.customEmoji.trim() === '') {
                                                                await showToast({ 
                                                                    style: Toast.Style.Failure, 
                                                                    title: 'Please enter a custom emoji' 
                                                                })
                                                                return
                                                            }
                                                            selectedEmoji = values.customEmoji.trim()
                                                        } else {
                                                            selectedEmoji = values.emoji
                                                        }
                                                        
                                                        if (selectedEmoji) {
                                                            await handleEmojiChange(type.type, selectedEmoji)
                                                            await showToast({ 
                                                                style: Toast.Style.Success, 
                                                                title: `Set ${selectedEmoji} for "${type.type}"` 
                                                            })
                                                            popToRoot()
                                                        }
                                                    }}
                                                />
                                                </ActionPanel>
                                            }
                                        >
                                            <Form.Dropdown
                                                id="emoji"
                                                title="Emoji (enter to search)"
                                                placeholder="Enter to search"
                                                defaultValue={POPULAR_VALUES.includes(type.emoji) ? type.emoji : 'custom'}
                                                info="Select a popular emoji or choose 'Custom' to enter any emoji"
                                            >
                                                <Form.Dropdown.Section title="Custom">
                                                    <Form.Dropdown.Item value="custom" title="✏️  Use Custom Emoji" />
                                                </Form.Dropdown.Section>
                                                
                                                <Form.Dropdown.Section title="Popular Emojis">
                                                    {POPULAR_EMOJIS.map((e) => (
                                                        <Form.Dropdown.Item key={e.value} value={e.value} title={`${e.value}  ${e.label}`} />
                                                    ))}
                                                </Form.Dropdown.Section>
                                            </Form.Dropdown>
                                            
                                            <Form.TextField
                                                id="customEmoji"
                                                title="Custom Emoji (select custom above)"
                                                placeholder="paste your custom emoji here"
                                                defaultValue={POPULAR_VALUES.includes(type.emoji) ? '' : type.emoji}
                                                info="Only used if 'Custom Emoji...' is selected above"
                                            />
                                        </Form>
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
