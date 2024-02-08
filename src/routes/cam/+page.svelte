<script lang="ts">
  import axios from "axios";
  import { getContext } from "svelte";
  import { writable } from "svelte/store";

  let avatar, fileInput: any;
  let imageResultList: any[] = [];
  let errorMsg: string = "";
  let isLoading: boolean = false;
  const onFileSelected = async (e: any) => {
    isLoading = true;
    let fileList = e.target.files;
    try {
      const x = await axios.post("/cam", fileList);
      imageResultList = [...imageResultList, x.data.result];
      imageResultList.reverse();
    } catch (e) {
      errorMsg = e as string;
    }
  };

  $: {
    errorMsg;
  }

  $: {
    if (imageResultList) {
      isLoading = false;
    }
  }
  let dirty = true;
  function beforeUnload(e: any) {
    if (imageResultList.length !== 0) {
      e.preventDefault();
      e.returnValue = "";
      return "...";
    }
  }

  function getImg(index: number) {
    const downloadLink = document.createElement("a");
    downloadLink.href = imageResultList[index];
    downloadLink.download = `${index}.png`;
    downloadLink.click();
  }
</script>

<div class="container flex justify-center items-center min-w-[fit] min-h-[fit]">
  <div class="flex flex-wrap flex-col items-center gap-5 p-10">
    <h1 class="text-2xl font-bold">Upload Image</h1>
    <button
      on:click={fileInput.click()}
      class={`${
        isLoading ? "bg-gray-600" : "bg-black"
      } text-white font-semibold py-3 px-5 rounded-lg text-center`}
      disabled={isLoading}
    >
      {#if isLoading}
        <div role="status">
          <svg
            aria-hidden="true"
            class="inline w-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      {:else}
        Take Photo
      {/if}
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
      <button
        on:click={() => getImg(index)}
        class="w-full px-1 py-2 bg-black text-white">Download</button
      >
    </div>
  {/each}
</div>
<svelte:window on:beforeunload={beforeUnload} />

{#if imageResultList.length !== 0}
  <div class="w-full my-2 flex justify-center align-middle">
    <button
      on:click={() => (imageResultList = [])}
      class="bg-black text-white px-3 py-1 rounded-md">Reset</button
    >
  </div>
{/if}
