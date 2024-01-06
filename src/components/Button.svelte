<script>
    export let type = "button";
    export let disabled = false;
</script>

<button type={type} disabled={disabled} class="{type === "submit" ? "px-3 py-1.5 w-full" : "px-6 py-3"} bg-custom_blue text-white rounded-lg text-sm font-semibold shadow-md ease-out hover:opacity-75 duration-300 select-none disabled:cursor-not-allowed disabled:opacity-75 {type === "flexbutton" && "flex flex-row gap-2 items-center"}" on:click><slot/></button>

