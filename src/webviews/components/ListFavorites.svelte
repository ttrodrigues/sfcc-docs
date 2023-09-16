<script>
	import Star from "./Star.svelte";

    export let dataInput;
		
	const removeFavorite = (favorite) => {      
        tsvscode.postMessage({
            type: 'onRemoveFavorite',
            value: {title: favorite.target.dataset.title, url: favorite.target.dataset.url}
        });
    }

	const openLink = (item) => {
        tsvscode.postMessage({
            type: 'onOpenLink',
            value: item
        });
    }

</script>

<div class="list-favorites">
	{#each dataInput as item}
		<p>
			<span class="icon-wrapper">
				<button class="list-icon" id="list-icon" data-url={item.url} data-title={item.title} 
				on:click={(e)=>{
					removeFavorite(e);
				}} >
				</button>
				<Star displayMode={true}/>
			</span>
			<button class="list-item" data-url={item.url} on:click={()=>{
				openLink([item.title, item.url]);
			}}>
				<h4 class="list-title">{item.title}</h4>
			</button>
		</p>		
	{/each}  
</div>

<style>	
	:global(body) {
        font-family: Segoe WPC,Segoe UI,sans-serif;
        font-size: 13px;
        padding-right: 20px;
        overflow-x: hidden;
    }

	button {
		width: 100%;
		background-color: transparent;
		border: none;
	}

	button:hover {
		cursor: pointer;
		background-color: var(--vscode-button-hoverBackground);
	}

	.list-title {
		text-align:left;
		color: var(--vscode-editor-foreground);
		margin-top: 5px;
    	margin-bottom: 5px;
	}	

	#list-icon {
		color: var(--vscode-editor-foreground);
		height: 16px;
		width: 16px;
		position: absolute;
	}

	#list-icon:hover {
		background-color: transparent;
	}

	.icon-wrapper {
		display: flex;
		position: absolute;
		left: 315px;
		margin-top: 5px;
	}

	.list-favorites {
		width: 315px;
	}
</style>
