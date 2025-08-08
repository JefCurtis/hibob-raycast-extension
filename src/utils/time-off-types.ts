import { LocalStorage } from '@raycast/api'

// Collection of discovered time-off types
const TIME_OFF_TYPES_KEY = 'discovered-time-off-types'
const CUSTOM_EMOJIS_KEY = 'custom-emoji-mappings'

// Cache for synchronous access
let customEmojiCache: CustomEmojiMapping = {}
let cacheInitialized = false

// Default emoji mapping based on keyword matching
const defaultEmojiMap: Record<string, string> = {
    'vacation': '🏖️',
    'holiday': '🏖️',
    'sick': '🤒',
    'health': '🤒',
    'conference': '📚',
    'training': '📚',
    'course': '📚',
    'travel': '✈️',
    'company travel': '✈️',
    'personal': '🏠',
    'bereavement': '🖤',
    'maternity': '👶',
    'paternity': '👶',
    'parental': '👶',
    'adoptive': '👶',
    'emergency': '🚨',
    'jury duty': '⚖️',
    'military': '🪖',
    'unpaid': '💸',
    'sabbatical': '🌅',
    'volunteer': '🤝',
    'comp time': '⏰',
    'floating': '📅',
}

type TimeOffTypeMapping = {
    type: string
    emoji: string
    count: number // How many times we've seen this type
    lastSeen: number // Timestamp
    isCustom?: boolean // Whether user has customized the emoji
}

type CustomEmojiMapping = {
    [timeOffType: string]: string // timeOffType -> custom emoji
}

async function getStoredTimeOffTypes(): Promise<Record<string, TimeOffTypeMapping>> {
    const stored = await LocalStorage.getItem<string>(TIME_OFF_TYPES_KEY)
    if (stored) {
        try {
            return JSON.parse(stored)
        } catch {
            return {}
        }
    }
    return {}
}

async function storeTimeOffTypes(types: Record<string, TimeOffTypeMapping>) {
    await LocalStorage.setItem(TIME_OFF_TYPES_KEY, JSON.stringify(types))
}

async function initializeCache(): Promise<void> {
    if (!cacheInitialized) {
        customEmojiCache = await getCustomEmojis()
        cacheInitialized = true
    }
}

async function getCustomEmojis(): Promise<CustomEmojiMapping> {
    const stored = await LocalStorage.getItem<string>(CUSTOM_EMOJIS_KEY)
    if (stored) {
        try {
            return JSON.parse(stored)
        } catch {
            return {}
        }
    }
    return {}
}

function getCustomEmojiSync(type: string): string | null {
    return customEmojiCache[type] || null
}

async function setCustomEmoji(timeOffType: string, emoji: string): Promise<void> {
    const customEmojis = await getCustomEmojis()
    customEmojis[timeOffType] = emoji
    await LocalStorage.setItem(CUSTOM_EMOJIS_KEY, JSON.stringify(customEmojis))
    
    // Update cache
    customEmojiCache[timeOffType] = emoji
    
    // Update the stored type to mark it as custom
    const storedTypes = await getStoredTimeOffTypes()
    if (storedTypes[timeOffType]) {
        storedTypes[timeOffType].emoji = emoji
        storedTypes[timeOffType].isCustom = true
        await storeTimeOffTypes(storedTypes)
    }
}

async function getEmojiForTypeAsync(type: string): Promise<string> {
    // First check for custom emoji
    const customEmojis = await getCustomEmojis()
    if (customEmojis[type]) {
        return customEmojis[type]
    }
    
    return getEmojiForType(type)
}

function getEmojiForType(type: string): string {
    const normalizedType = type.toLowerCase()
    
    // First check for exact matches
    if (defaultEmojiMap[normalizedType]) {
        return defaultEmojiMap[normalizedType]
    }
    
    // Then check for partial matches using keywords
    for (const [keyword, emoji] of Object.entries(defaultEmojiMap)) {
        if (normalizedType.includes(keyword)) {
            return emoji
        }
    }
    
    // Default fallback
    return '📅'
}

function recordTimeOffTypeSync(type: string): string {
    // Initialize cache if needed
    if (!cacheInitialized) {
        initializeCache()
    }
    
    // Check for custom emoji first (synchronously using cached data)
    const customEmoji = getCustomEmojiSync(type)
    const emoji = customEmoji || getEmojiForType(type)
    
    // Store asynchronously in the background
    recordTimeOffTypeAsync(type, emoji)
    
    return emoji
}

async function recordTimeOffTypeAsync(type: string, defaultEmoji: string): Promise<void> {
    const storedTypes = await getStoredTimeOffTypes()
    const customEmojis = await getCustomEmojis()
    
    // Use custom emoji if available, otherwise use default
    const emoji = customEmojis[type] || defaultEmoji
    
    if (storedTypes[type]) {
        // Update existing entry
        storedTypes[type].count++
        storedTypes[type].lastSeen = Date.now()
        // Update emoji if there's a custom one and it's different
        if (customEmojis[type] && storedTypes[type].emoji !== customEmojis[type]) {
            storedTypes[type].emoji = customEmojis[type]
            storedTypes[type].isCustom = true
        }
    } else {
        // Create new entry
        storedTypes[type] = {
            type,
            emoji,
            count: 1,
            lastSeen: Date.now(),
            isCustom: !!customEmojis[type]
        }
        console.log(`📝 Discovered new time-off type: "${type}" → ${emoji}`)
    }
    
    await storeTimeOffTypes(storedTypes)
}

async function getAllDiscoveredTypes(): Promise<TimeOffTypeMapping[]> {
    const storedTypes = await getStoredTimeOffTypes()
    return Object.values(storedTypes).sort((a, b) => b.count - a.count) // Sort by most frequent
}

async function clearDiscoveredTypes(): Promise<void> {
    await LocalStorage.removeItem(TIME_OFF_TYPES_KEY)
}

export { 
    recordTimeOffTypeSync as recordTimeOffType, 
    getAllDiscoveredTypes, 
    clearDiscoveredTypes, 
    getEmojiForType,
    getEmojiForTypeAsync,
    setCustomEmoji,
    getCustomEmojis,
    initializeCache,
    type TimeOffTypeMapping,
    type CustomEmojiMapping 
}
