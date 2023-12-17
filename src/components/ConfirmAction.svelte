<script>
    import { fly, fade } from "svelte/transition";

    import { createEventDispatcher, onMount } from "svelte";
    const dispatch = createEventDispatcher();

    import Button from "./Button.svelte";

    export let showDialog = false;
    export let title = "Devam etmek istiyor musunuz?";
    export let description = "Bu işlem geri alınamaz.";
    export let confirmOption = "Devam Et";
    export let cancelOption = "İptal";
    let isReduced;

    const handleCancel = () => {
        dispatch("cancel");
    };

    const handleConfirm = () => {
        dispatch("confirm");
    };

    onMount(() => {
        isReduced =
            window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
            window.matchMedia(`(prefers-reduced-motion: reduce)`).matches ===
                true;
    });
</script>

{#if showDialog}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="backdrop"
        in:fade={{ duration: isReduced ? 0 : 200 }}
        out:fade={{ delay: isReduced ? 0 : 200, duration: isReduced ? 0 : 200 }}
        on:click|self
    >
        <div
            class="confirmation descendant:text-custom_black border border-white bg-slate-300 rounded-md"
            in:fly={{
                y: -10,
                delay: isReduced ? 0 : 200,
                duration: isReduced ? 0 : 200,
            }}
            out:fly={{
                y: -10,
                duration: isReduced ? 0 : 200,
            }}
        >
            <h3>{title}</h3>
            <h4>{description}</h4>
            <div class="buttonContainer descendant:text-custom_white">
                <Button on:click={handleConfirm}>{confirmOption}</Button>
                <Button on:click={handleCancel}>{cancelOption}</Button>
            </div>
        </div>
    </div>
{/if}

<style>
    .backdrop {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 998;
        background: rgba(0, 0, 0, 0.88);
        cursor: pointer;
    }
    .confirmation {
        padding: 10px;
        margin: 0 auto;
        margin-top: 10%;
        z-index: 999;
        text-align: center;
        width: 60%;
        max-width: 900px;
        cursor: default;
    }
    .buttonContainer {
        display: flex;
        padding-bottom: 12px;
        justify-content: space-evenly;
    }
</style>
