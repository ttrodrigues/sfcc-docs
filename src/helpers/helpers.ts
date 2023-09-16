import * as vscode from "vscode";
import axios from 'axios';
import * as lunr from 'lunr';
import { Constants } from "./constants";

/**
 * Get search index of documentation
 *
 * @returns JSON with index search for all documentation
 */
export async function getSearchIndex () {   
  let result:any;
  const url:string = `${Constants.HOST}${Constants.HOST_SEARCH_INDEX}`;
  const config:any = {
      method: 'get',
      url: url
  };

  await axios(config)
      .then((response:any) => {
          result = response.data;
      })
      .catch( () => {
          result = null;
      });

  return result;
}

/**
 * Build search index of documentation
 *
 * @returns JSON with index
 */
export async function buildSearchIndex () {   
  let data:any = await getSearchIndex();

  if (data) {
    let pageData:any = {};
    let idx:any = lunr(function () {
        this.field("title", { boost: 10 });
        this.field("content");
        this.ref("url");
        this.metadataWhitelist = ["position"];
    
        // Add the data to the search index
        data.forEach( (page: any) => {
          if (page.url && page.title && page.content) {
            this.add(page);
            // Store the page data for later use
            pageData[page.url] = page;
          }
        }, this);
    });   
    
    return {idx, pageData};
  } else {
    vscode.window.showErrorMessage(Constants.ERROR_BUILD_SEARCH_INDEX);
    
    return null;
  }
}

/**
 * Search on index
 * 
 * @param query Search query
 * @param index Search index
 * @param pageData Data object
 * @param favorites Array of favorites
 * @returns Array of results
 */
export function searchOnIndex (query:string, index:any, pageData:any, favorites:any) {   
  let searchQuery:string = query.trim();
  let arrayResults:any = [];
  // Clear the search results
  //searchResults.innerHTML = "";

  if (searchQuery) {
    // Perform the search using Lunr.js
    let results = index.search(searchQuery);

    if (results.length > 0) {     
      // Loop through the search results and display them
      for (const element of results) {
        let result = element;
        let resultPage = pageData[result.ref]; // Look up the page data
        let url = resultPage.url;
        let title = resultPage.title;
        
        // Initialize an empty ordered list
        let searchResults:any = {};
        
        // Get content
        let content = resultPage.content;
        // Find the first instance of the search query in the content
        let firstMatchIndex = content.toLowerCase().indexOf(searchQuery.toLowerCase());

        // Determine the range of characters to display in the search results
        let start = Math.max(0, firstMatchIndex - 150);
        let end = Math.min(
          content.length,
          firstMatchIndex + searchQuery.length + 150
        );
        content = content.slice(start, end);

        // Add ... to the start and end of the content extract if it's not the full content
        if (start > 0) {
          content = "..." + content;
        }
        if (end < resultPage.content.length) {
          content = content + "...";
        }

        // Append the search result as a new list item
        searchResults.title = title.split('&#39;').join('');
        searchResults.content = content;
        searchResults.url = url;
        searchResults.star = favorites.some((e:any) => e.url === searchResults.url);

        arrayResults.push(searchResults);
      }        
    } 
  }
  
  return arrayResults;
}

/**
 * Update the favorites property configuration
 *
 * @param favorite Object of the favorite with Title and URL
 * @param toAdd To know if is to Add or to Remove
 */
export async function updateFavorites (favorite:any, toAdd:boolean) {
  const currentProperty:any = vscode.workspace.getConfiguration('sfcc-docs').get("favorites");
  let newProperty:any = [];

  if (currentProperty === null){
    newProperty.push(favorite);
  } else {
    if (toAdd) {
      newProperty.push(...currentProperty);
      newProperty.push(favorite);
    } else {
      newProperty = currentProperty.filter((e:any) => {
        return e.url !== favorite.url;
      });
    }
  }

  await vscode.workspace.getConfiguration().update('sfcc-docs.favorites', newProperty, vscode.ConfigurationTarget.Global);
}

/**
 * Get the favorites property configuration and send it to panel
 *
 * @param webView Object of the WebView
 */
export async function getFavoritesSendPanel (webView:any) {
  const favorites:any = vscode.workspace.getConfiguration('sfcc-docs').favorites;
  webView.postMessage({command:"dataFavorites", data:favorites}); 
}

/**
 * Get the page content and create a new tab
 *
 * @param title Title of new page 
 * @param url URL of new page 
 */
export async function createNewTabPage (title:string, url:string) {
  const simpleTitle:string = title.replace(/\s/g, '');

  const panel = vscode.window.createWebviewPanel(
    simpleTitle,
    title,
    vscode.ViewColumn.One,
    {
      enableScripts: true,
    }
  );

  let result:any;
  const finalUrl:string = `${Constants.HOST}${url}`;
  const config:any = {
      method: 'get',
      url: finalUrl
  };

  await axios(config)
      .then((response:any) => {
          result = response.data;
      })
      .catch( () => {
          result = null;
      });

  // Edit DOM content
  const content = removeTags(result);

  // And set its HTML content
  panel.webview.html = content;
}

/**
 * Edit DOM content
 *
 * @param data Original DOM content
 * @returns New DOM content
 */
function removeTags (data:any) {
  let oldContent:any = data;
  let newContent:any = data;

  Constants.REG_EX_ARRAY.forEach((rule:any) => {
    newContent = oldContent.replace(rule, '');
    oldContent = newContent;
  });

  return newContent;
};
