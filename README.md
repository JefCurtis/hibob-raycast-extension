# "hibob timeoff view" Raycast extension

This extension allows you to view your time off as well as your team's time off in Raycast. It automatically maps time-off types to emojis and lets you customize them for better visual recognition.

## Requirements

In order to use this extension, you will need to have a Hibob account to gan access to the API.

Generate an ID and API token from the Hibob API portal:
https://apidocs.hibob.com/docs/getting-started

Make sure it's scoped to include:

-   "Timeoff submit request & ready who's out"
-   "Employee fields read"

## How to use and contribute

1. Clone the repository locally
2. Open Raycast and search for "Import Extension"
3. Select the cloned projects folder and import it and press enter
4. You'll need to build it before you can use it for first time. `npm install && npm run build`

At the point you should be able to add your API ID and token and run the extension 🎉

## Features

### Calendar View

-   View your team's time-off calendar with automatic emoji mapping
-   Navigate between months to see upcoming time-off
-   Discover new time-off types automatically from your HiBob data

### Emoji Management

-   **Automatic Mapping**: Time-off types are automatically mapped to relevant emojis (e.g., "vacation" → 🏖️, "sick" → 🤒)
-   **Custom Emojis**: Customize emojis for any time-off type through the "Manage Time-Off Emojis" command
-   **Popular Emojis**: Quick selection from a curated list of common emojis
-   **Custom Emojis**: Add any emoji you want for personalized time-off types
-   **Persistent Storage**: Your custom emoji preferences are saved and persist across sessions

### How to Manage Emojis

1. Run the "Manage Time-Off Emojis" command from Raycast
2. Browse discovered time-off types from your HiBob data
3. Click "Change Emoji" on any type to customize it
4. Choose from popular emojis or enter a custom emoji
5. Your changes are automatically applied to the calendar view

But of course, you can also contribute to the extension by adding new features or fixing bugs!

Run the extension locally with live updates using `npm run dev` which will automatically open Raycast.
Read more about developing extensions in the [Raycast documentation](https://developers.raycast.com/basics/getting-started)

If you want to contribute, please open a pull request with your changes.
