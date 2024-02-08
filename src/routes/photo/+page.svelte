<script lang="ts">
  import { onMount } from "svelte";
  import axios from 'axios';
  let x: string;
  let image: any = null;
  $: image;
  const preloadImage = async () => {
    // const getImg = await fetch("/photo", {
    //   method: "GET",
    // });
    // console.log(Buffer.from(getImg.body()))

    const getImage = await axios.get('/photo');
    image = getImage.data;
    return getImage.data;
  };

  function img_get() {
    const downloadLink = document.createElement("a");
    downloadLink.href = "data:image/png;base64," + image;
    downloadLink.download = `${new Date().toString()}.jpeg`;
    downloadLink.click();
  }

</script>

{#await preloadImage()}
  Image is loading!
{:then base64}
  <img
    class="max-h-[800px]"
    src={`data:image/jpeg;base64,${base64}`}
    data-name="A"
    alt="Alright Buddy!"
  />

  <!-- {img_get()} -->
  <!-- <code>{base64}</code> -->
  <button on:click={img_get}>Download image</button>
  <!-- <button on:click={downloadImg}>Download</button> -->
{/await}
<button on:click={async() => {await preloadImage(); console.log("first")}}>Refresh</button>