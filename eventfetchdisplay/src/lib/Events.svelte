<script>
  import { onMount } from "svelte"

  let events = []

  onMount(async () => {
    try {
      const response = await fetch("https://iqdsbuh9zj.execute-api.us-east-2.amazonaws.com/production/events", {
        mode: "no-cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          calendarId: "1652119848445341"
        })
      })
      const data = await response.json()
      events = data.events
    } catch (error) {
      console.error(error)
    }
  })

</script>
<main>
  {#each events as event}
    <div class="event">
      <h2>{events}</h2>
    </div>
    {:else}
      <div class="event">
        <h2>Loading...</h2>
      </div>
  {/each}
</main>
