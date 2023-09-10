<script>
	import Star from "./Star.svelte";

    export let dataInput;
	let unique = {} // every {} is unique, {} === {} evaluates to false

	const restartComponent = () => {
		unique = {}
	}
	
	const changeAttributes = (e) => {
		let newVal = e.target.dataset.star == "true" ? true : false;
		e.target.dataset.star = !newVal;
		const parentElement = e.target.closest("#list-icon");
		parentElement.dataset.star = !newVal;
		updateFavorite({title: e.target.dataset.title, url: e.target.dataset.url}, !newVal);
		changeArray(e.target.dataset.url, !newVal);
	};

	const changeArray = (url, newVal) => {
		const item = dataInput.filter((e) => e.url === url);
		item[0].star = newVal;
		restartComponent();		
	};

	const updateFavorite = (favorite, status) => {      
        tsvscode.postMessage({
            type: 'onUpdateFavorite',
            value: [favorite, status]
        });
    }


</script>

<div class="search-result">
	{#each dataInput as item, index}
		<p>
			<span class="icon-wrapper">
				<button class="list-icon" id="list-icon" data-star={item.star} data-url={item.url} data-title={item.title} 
				on:click={(e)=>{
					changeAttributes(e);
				}} >
				</button>
				{#key unique}
					<Star displayMode={item.star}/>
				{/key}
			</span>
			<button class="list-item" data-url={item.url}>
				<h4 class="list-title"> #{index + 1} - {item.title}</h4>
				<p class="list-content">{item.content}</p>
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

	.list-title, .list-content{
		text-align:left;
		color: var(--vscode-editor-foreground);
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

	.search-result{
		width: 315px;
	}
</style>
