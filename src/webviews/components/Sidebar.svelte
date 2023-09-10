<script lang="ts">
    // @ts-nocheck
    import { onMount } from 'svelte';
    import ListSearchResults from './ListSearchResults.svelte';
    import ListFavorites from './ListFavorites.svelte';
    import FavoriteMenu from './FavoriteMenu.svelte';
    import SearchMenu from './SearchMenu.svelte';
    
    let dataSearchResults:any;
    let dataSearchResultsLength:number;
    let successReceiveDataSearchResults:boolean = false;
    let dataFavorites:any;
    let dataFavoritesLength:number;
    let isLoading:boolean = true;
    let dataSearchQuery:string;
    let dataError:boolean = false;

    let page: "search" | "favorites" = tsvscode.getState()?.page || "search";

    $: {
        tsvscode.setState({ page });
    }
 
    onMount(() => {        
        window.addEventListener('message', event => {
            const message = event.data; 
            switch (message.command) {
                case 'dataSearchResults': {
                    dataSearchResults = message.data;
                    dataSearchResultsLength = dataSearchResults.length;
                    successReceiveDataSearchResults = true;
                    break;
                }
                
                case 'dataFavorites': {
                    dataFavorites = message.data;
                    dataFavoritesLength = dataFavorites.length;
                    isLoading = false;
                    break;
                }

                case 'dataError': {
                    dataError = message.data;
                    break;
                }
            }
        });  
    });
           
    const searchQuery = (input:string) => {   
        successReceiveDataSearchResults = false;  
        dataSearchQuery = input;   
        tsvscode.postMessage({
            type: 'onSearchQuery',
            value: input
        });
        document.getElementById('search-input').value = '';
    }

    const clearSearch = () => {
        successReceiveDataSearchResults = false;  
        dataSearchResultsLength = 0;
        dataSearchResults = [];
    }

    const updateClass = (classNameAdd, classNameRemove) => {
        const elementToAdd = document.querySelector(classNameAdd);
        elementToAdd.classList.add('selected');
        const elementToRemove = document.querySelector(classNameRemove);
        elementToRemove.classList.remove('selected');
    }
        
    </script>

<style>
    :global(body) {
        font-family: Segoe WPC,Segoe UI,sans-serif;
        font-size: 13px;
        padding-right: 20px;
        overflow-x: hidden;
    }
    
    input {
        color: var(--vscode-input-foreground);
        background-color: inherit;
        border: none;
        background-color: var(--vscode-input-background);
        height: 28px;
    }

    input:focus{
        outline-offset: -1px;
        outline-color: var(--vscode-input-foreground);
    }
    
    div#main{
       width: 315px;
       margin-top: 45px;
    }

    input#search-input{
       margin-bottom: 10px; 
       width: 311px;
    }
    .total-results {
        margin: 10px 0;
    }

    .loading-message, .error-message {
        text-align: center;
    }

    .buttons-wrapper {
        height: 45px;
        display: flex;
        width: 315px;
        position: fixed;
        top: 0;
        z-index: 999;
        background-color: var(--vscode-panel-background);
    }

    .menu-button {
        width: 50%;
        padding: 0;
        color: rgb(92, 92, 92);
        background-color: transparent;
        height: 32px;
    }

    .menu-button:hover {
        background-color: transparent;
    }

    .selected {
        color: white;
    }

    button {
        color: var(--vscode-button-foreground); 
        background-color: var(--vscode-button-background);
        border: 1px solid var(--vscode-button-border,transparent);
        cursor: pointer;
        box-sizing: border-box;  
        height: 28px;
    }

    button:hover {
        background-color: var(--vscode-button-hoverBackground);
    }

    button:focus {
      outline: none;
    } 
    
</style>       

<div class="buttons-wrapper">
    <button class="menu-button selected search" on:click={() => { 
        page = 'search';
        updateClass('.search', '.favorite');
        }}>
        <SearchMenu/>
    </button> 
    <button class="menu-button favorite" on:click={() => { 
        page = 'favorites';
        updateClass('.favorite', '.search');
        }}>
        <FavoriteMenu/>
    </button> 
</div>

<div id="main">
    {#if dataError}

        <h5 class="error-message">An error occur on build the search index!</h5>

    {:else}

        {#if page === 'search'}

            {#if isLoading} 

                <h5 class="loading-message">Loading search index...</h5>

            {:else}
        
                <input on:change={(e)=>{
                    searchQuery(e.target.value);
                }} type="text" id="search-input">

                {#if dataSearchResultsLength > 0}
                    <div id="search-list">
                        <h5 class="total-results">{dataSearchResultsLength} {dataSearchResultsLength === 1 ? 'match result for' : 'matched results for'} {dataSearchQuery}</h5>

                        <button on:click={() => {
                            clearSearch();
                        }}>Clear search</button>

                        <ListSearchResults dataInput={dataSearchResults}>
                        </ListSearchResults>
                    </div>
                {:else}

                    {#if successReceiveDataSearchResults}
                
                        <h5 class="total-results">No matched results for {dataSearchQuery}</h5>
                        <button on:click={() => {
                            clearSearch();
                        }}>Clear search</button>

                    {/if}

                {/if}
                
            {/if}
                    
        {:else}

            {#if isLoading} 

                <h5 class="loading-message">Loading search index...</h5>

            {:else}

                {#if dataFavoritesLength > 0}
                    <ListFavorites dataInput={dataFavorites}>
                    </ListFavorites>        
                {/if}

            {/if}

        {/if}

    {/if}
            
</div>
