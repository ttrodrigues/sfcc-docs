import * as vscode from "vscode";
import { getNonce } from "./getNonce";
import { searchOnIndex, buildSearchIndex, updateFavorites, getFavoritesSendPanel } from "./helpers/helpers";

export class Sidebar implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;
  
  
  constructor(private readonly _extensionUri: vscode.Uri) {}
  
  public async resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;
      
    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    const indexSearch:any = await buildSearchIndex();

    getFavoritesSendPanel(webviewView.webview);

    // Listener to changes in Favorites options
    vscode.workspace.onDidChangeConfiguration(event => {
      const affectedFavorites:boolean = event.affectsConfiguration("sfcc-docs.favorites");
        
      if (affectedFavorites) {
        getFavoritesSendPanel(webviewView.webview);
      }
    })

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }

        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }

        case "onSearchQuery": {
          if (!data.value) {
            return;
          }
          const favorites:any = vscode.workspace.getConfiguration('sfcc-docs').favorites;
          const searchResults:any = searchOnIndex(data.value, indexSearch.idx, indexSearch.pageData, favorites);
          webviewView.webview.postMessage({command:"dataSearchResults", data:searchResults});
          break;
        }       
         
        case "onUpdateFavorite": {
          if (!data.value) {
            return;
          }
          const [favorite, status]:any = data.value;
          updateFavorites(favorite, status);
          getFavoritesSendPanel(webviewView.webview);
          break;
        } 
        
        case "onRemoveFavorite": {
          if (!data.value) {
            return;
          }
          updateFavorites(data.value, false);
          getFavoritesSendPanel(webviewView.webview);
          break;
        }   


        



        
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out/compiled", "sidebar.js")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out/compiled", "sidebar.css")
    );
    
    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    const htmlContent:string = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <!--
        Use a content security policy to only allow loading images from https or from our extension directory,
        and only allow scripts that have a specific nonce.
      -->
      <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${
    webview.cspSource
  }; script-src 'nonce-${nonce}';">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="${styleMainUri}" rel="stylesheet">
    </head>
    <script nonce="${nonce}">
      const tsvscode = acquireVsCodeApi();
    </script>
    <body>
      <script nonce="${nonce}" src="${scriptUri}">
      </script>
    </body>
    </html>`;

    return htmlContent;
  }
}