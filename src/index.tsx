import { Action, ActionPanel, Detail, List } from '@raycast/api'
import { getPeople, getWhosOut } from './api/get-whos-out'
import { useEffect, useState } from 'react'
import { calendar } from './components/calendar'
import { useCachedPromise } from '@raycast/utils'
import { log } from 'console'
import { DepartmentName, getDepartments, useDepartment } from './utils/departments'
import { CalendarItem } from './components/calendar-item'

export default function Command() {
    log('Command')
    const [date, setDate] = useState(new Date())
    console.log(`date: `, date)

    const [people, setPeople] = useState([])
    const { data: outs, isLoading } = useCachedPromise(getWhosOut, [date], {
        keepPreviousData: true,
    })

    const { data: departments } = useCachedPromise(getDepartments, [], {
        keepPreviousData: true,
    })
    const [department, setDepartment] = useDepartment()

    const header = date.toLocaleString('en', { month: 'long', year: 'numeric' })

    return (
        <List
            isShowingDetail={true}
            navigationTitle={department === 'All' ? 'All Departments' : department}
            throttle
            isLoading={isLoading}
            searchBarAccessory={
                <List.Dropdown
                    tooltip="Departments"
                    value={department}
                    onChange={(value) => setDepartment(value as DepartmentName)}
                >
                    {departments?.map((d) => (
                        <List.Dropdown.Item key={d.id} title={d.name} value={d.id} />
                    ))}
                </List.Dropdown>
            }
        >
            {outs?.map((out) => <CalendarItem out={out} date={date} />)}
        </List>
    )
}

// function PageItem({ search, title, language }: { search: string; title: string; language: string }) {
//   const { data: page } = useCachedPromise(getPageData, [title, language]);

//   return (
//     <View.Item
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       content={{ source: page?.thumbnail?.source || Icon.Image }}
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       icon={{ source: page?.thumbnail?.source || "../assets/wikipedia.png" }}
//       id={title}
//       title={title}
//       subtitle={page?.description ? toSentenceCase(page.description) : ""}
//       actions={
//         <ActionPanel>
//           {openInBrowser ? (
//             <>
//               <Action.OpenInBrowser url={page?.content_urls.desktop.page || ""} />
//               <Action.Push icon={Icon.Window} title="Show Details" target={<WikipediaPage title={title} />} />
//             </>
//           ) : (
//             <>
//               <Action.Push icon={Icon.Window} title="Show Details" target={<WikipediaPage title={title} />} />
//               <Action.OpenInBrowser url={page?.content_urls.desktop.page || ""} />
//             </>
//           )}
//           <Action.OpenInBrowser
//             title="Search in Browser"
//             url={`https://${language}.wikipedia.org/w/index.php?fulltext=1&profile=advanced&search=${search}&title=Special%3ASearch&ns0=1`}
//             shortcut={{ modifiers: ["cmd"], key: "o" }}
//           />
//           <ActionPanel.Section>
//             <Action.CopyToClipboard
//               shortcut={{ modifiers: ["cmd"], key: "." }}
//               title="Copy URL"
//               content={page?.content_urls.desktop.page || ""}
//             />
//             <Action.CopyToClipboard
//               shortcut={{ modifiers: ["cmd", "shift"], key: "." }}
//               title="Copy Title"
//               content={title}
//             />
//             <Action.CopyToClipboard
//               shortcut={{ modifiers: ["cmd", "shift"], key: "," }}
//               title="Copy Subtitle"
//               content={page?.description ?? ""}
//             />
//           </ActionPanel.Section>
//         </ActionPanel>
//       }
//     />
//   );
// )
// return (
//     <List
//         isLoading={isLoading}
//         markdown={calendar(data, date)}
//         actions={
//             <ActionPanel title={header}>
//                 <ActionPanel.Section title="Change Week">
//                     <Action
//                         title="Previous Week"
//                         shortcut={{ modifiers: [], key: 'arrowLeft' }}
//                         icon={{ source: { dark: 'left-dark.png', light: 'left.png' } }}
//                         onAction={() => {
//                             console.log('preview week')
//                             setDate(new Date(date.setDate(date.getDate() - 7)))
//                         }}
//                     />
//                     <Action
//                         title="Next Week"
//                         shortcut={{ modifiers: [], key: 'arrowRight' }}
//                         icon={{ source: { dark: 'right-dark.png', light: 'right.png' } }}
//                         onAction={() => {
//                             console.log('next week')
//                             setDate(new Date(date.setDate(date.getDate() + 7)))
//                         }}
//                     />
//                 </ActionPanel.Section>
//             </ActionPanel>
//         }
//     />
// )
// }
