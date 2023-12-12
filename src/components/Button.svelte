<script>
    export let type = "button";
</script>

<button class="{type === "submit" ? "px-3 py-1.5 w-full" : "px-6 py-3"} bg-custom_blue text-white rounded-lg text-sm font-semibold shadow-md ease-out hover:opacity-75 duration-300 select-none" on:click><slot/></button>

