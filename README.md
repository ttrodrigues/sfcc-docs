# SFCC-Docs

Small extension to help the **SFCC (SalesForce Commerce Cloud)** developers, to access see and save the favorites documentation articles directly on **VS Code**

&nbsp;

## Why this Extension?
Simplify the life to **SFCC developers**, with an extension that provides direct access to documentations directly on **VS Code**, where the user can search, open and save the favorite articles for late reading.

The extension uses the user `settings.json` to save the favorites articles, so will be easy to share this information for multiple devices, if the user has the **Settings Sync On**.

On startup of the extension, an search index will be made to guarantee the faster search experience possible. When the user clicks on an article, then will be get the selected article content to be open in a new tab on **VS Code**.

The source for the search and documentations is the recent released new [**Salesforce B2C Developer Documentation Resources**](https://salesforcecommercecloud.github.io/b2c-dev-doc/index.html).

&nbsp;

## Features
![](/media/demo.gif)

&nbsp;

## Extension Settings

All necessary configurations of the extension will be automatically updated on the user's `settings.json`, when the star button is clicked:

* `sfcc-docs.favorites`: Array of objects, where each one has the **Title** and the **URL** of the article saved.

&nbsp;

## Known Issues

None, until now.

&nbsp;

## Release Notes
### 0.0.2 
- Minor layout fix

### 0.0.1
- Initial release
- Search and save favorites articles of **SalesForce Commerce Cloud documentations** 
