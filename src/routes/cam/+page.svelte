<script lang="ts">
  import axios from "axios";
  import { getContext } from "svelte";
  import { writable } from "svelte/store";

  let avatar, fileInput: any;
  let imageResultList: any[] = [];
  let errorMsg: string = "";
  const onFileSelected = async (e: any) => {
    let fileList = e.target.files;
    try {
      const x = await axios.post("/cam", fileList);
      console.log(x.data.result);
      imageResultList = x.data.result;
    } catch (e) {
      errorMsg = e as string;
    }
  };

  $: {
    errorMsg;
  }

  function getImg(index:number){
    const downloadLink = document.createElement('a')
    downloadLink.href = imageResultList[index]
    downloadLink.download = `${index}.png`
    downloadLink.click();
  }
</script>


<div
  class="container flex justify-center items-center min-w-[fit] min-h-[fit]"
>
  <div class="flex flex-wrap flex-col items-center gap-5 p-10">
    <h1 class="text-2xl font-bold">Upload Image</h1>
    <button
      on:click={fileInput.click()}
      class="bg-black text-white font-semibold py-3 px-5 rounded-lg"
    >
      Take Photo
    </button>
    <input
      style="display:none"
      type="file"
      multiple
      accept=".jpg, .jpeg, .png"
      on:change={(e) => onFileSelected(e)}
      bind:this={fileInput}
    />

    {#if errorMsg}
      <p class="font-black text-red-500">ERROR : {errorMsg}</p>
    {/if}
  </div>


  
</div>

<div class="flex flex-row gap-4 bg-blue-400 w-[100%]">
  {#each imageResultList as result, index}
    <div class="w-[300px] gap-2">
      <img class="w-[100%]" alt="A" src={result} />
      <button on:click={() => getImg(index)} class="w-full px-1 py-2 bg-black text-white">Download</button>
    </div>
  {/each}
</div>