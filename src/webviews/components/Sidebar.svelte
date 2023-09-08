<script lang="ts">
    // @ts-nocheck
    import { onMount } from 'svelte';
    import ListSearchResults from './ListSearchResults.svelte';
    
    let dataJson:any;
    let dataJsonLength:number;
    let successReceiveData:boolean = false;
 
    onMount(() => {        
        window.addEventListener('message', event => {
            const message = event.data; 
            switch (message.command) {
                case 'dataJsonCommand':
                    dataJson = message.data;
                    dataJsonLength = dataJson.length;
                    successReceiveData = true;
                    break;
            }
        });  

    });
           
    const searchQuery = (input:string) => {   
        successReceiveData = false;     
        tsvscode.postMessage({
            type: 'onSearchQuery',
            value: input
        });
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

<div id="main">

    <input on:change={(e)=>{
        searchQuery(e.target.value);
    }} type="text" id="search-input">

    {#if dataJsonLength > 0}
        <h5 class="total-results">{dataJsonLength} {dataJsonLength === 1 ? 'match result' : 'matched results'}</h5>

        <div id="search-list">
            <ListSearchResults dataInput={dataJson}>
            </ListSearchResults>
        </div>
    {:else}
        {#if successReceiveData}
            <h5 class="total-results">No matched results</h5>
        {/if}
    {/if}


        
</div>



