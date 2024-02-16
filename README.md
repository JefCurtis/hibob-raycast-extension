# "hibob timeoff view" Raycast extension

This extension allows you to view your time off as well as your team's time off in Raycast.

## Requirements

In order to use this extension, you will need to have a Hibob account to gan access to the API.

Generate a API token from the Hibob API portal:
https://apidocs.hibob.com/docs/getting-started

Make sure it's scoped to include:

-   "Timeoff submit request & ready who's out"
-   "Employee fields read"

## How to use and contribute

1. Clone the repository locally
2. Open Raycast and search for "Import Extension"
3. Select the cloned projects folder and import it and press enter
4. You'll need to build it before you can use it for first time. `npm run build`

At the point you should be able to add your API token run the extension 🎉
But of course, you can also contribute to the extension by adding new features or fixing bugs!

Run the extension locally with live updates using `npm run dev` which will automatically open Raycast.
Read more about developing extensions in the [Raycast documentation](https://developers.raycast.com/basics/getting-started)

If you want to contribute, please open a pull request with your changes.
