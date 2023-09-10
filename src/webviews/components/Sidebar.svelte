<script lang="ts">
    // @ts-nocheck
    import { onMount } from 'svelte';
    import ListSearchResults from './ListSearchResults.svelte';
    import ListFavorites from './ListFavorites.svelte';
    import CollapsibleSection from './CollapsibleSection.svelte';
    
    let dataSearchResults:any;
    let dataSearchResultsLength:number;
    let successReceiveDataSearchResults:boolean = false;

    let dataFavorites:any;
    let dataFavoritesLength:number;
    let successReceiveDataFavorites:boolean = false;

    let dataSearchQuery:string;

    let page: "search" | "detail" = tsvscode.getState()?.page || "search";

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
                    //successReceiveDataFavorites = true;

                    break;
                }
            }
            console.log(message);
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
       min-width: 330px;
       margin-top: 5px;
    }

    input#search-input{
       margin-bottom: 10px; 
       width: 100%;
    }
    .total-results {
        margin: 10px 0;
    }
    
</style>       

<!-- {#if page === 'search'} -->
<div id="main">
    
    <CollapsibleSection headerText={'Search'} expanded={true}>
    
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
    </CollapsibleSection>



<CollapsibleSection headerText={'Favorites'} expanded={true}>
    {#if dataFavoritesLength > 0}
        <ListFavorites dataInput={dataFavorites}>
        </ListFavorites>        
    {/if}
</CollapsibleSection>




            
    </div>
    <!-- <button
    on:click={() => {
        page = 'detail';
    }}>go to contact</button> -->
<!-- {:else}
    <div>Contact me here: adlkfjjqioefeqio</div>
    <button
        on:click={() => {
            page = 'search';
        }}>go back</button>
{/if} -->


