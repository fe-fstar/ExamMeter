<script>
    import { fly, fade } from "svelte/transition";

    import Button from "./Button.svelte";

    export let question;
    let showWindow = false;

    function toggleShowWindow() {
        showWindow = !showWindow;
    }
</script>

<div class="descendant:text-white">
    <Button on:click={toggleShowWindow}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 ">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>          
    </Button>
</div>
{#if showWindow}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="backdrop"
        in:fade={{ duration: 200 }}
        out:fade={{ delay: 200, duration: 200 }}
        on:click|self={toggleShowWindow}
    >
        <div
            class="overflow-x-auto window flex flex-col bg-slate-100 descendant:text-black rounded-lg"
            in:fly={{
                y: -10,
                delay: 200,
                duration: 200,
            }}
            out:fly={{
                y: -10,
                duration: 200,
            }}
        >
            <svg
                on:click={toggleShowWindow}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                data-slot="icon"
                class="w-6 h-6 close-svg"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                />
            </svg>
            <div
                            class="flex flex-col gap-y-4 mb-4"
                        >
                            <div>
                                <div class="flex flex-col items-center">
                                    <div
                                        class="flex w-full items-center justify-evenly"
                                    >
                                        <h3>{question.index + 1}. Soru:</h3>
                                    </div>
                                    {question.text}
                                </div>
                            </div>
                            <div class="flex flex-row flex-wrap justify-evenly">
                                {#each question.options as option, indexOption}
                                    <div
                                        class="flex flex-col gap-y-3 mb-4 mr-4 p-4 border border-black child:flex child:items-center {option.correct_answer
                                            ? 'bg-green-400/50'
                                            : ''}"
                                    >
                                        <div>
                                            {String.fromCharCode(
                                                65 + indexOption,
                                            )}
                                            {option.text}
                                        </div>
                                    </div>
                                {/each}
                            </div>
                            <div class="flex justify-evenly items-center flex-wrap">
                                <h3>Zorluk: {question.correct_ratio}</h3>
                                <h3>Madde Ayırt Edicilik: {question.discriminationRatio}</h3>
                            </div>
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
        background: rgba(0, 0, 0, 0.75);
        cursor: pointer;
    }
    .window {
        padding: 10px;
        border: 1px solid #e9e9e9;
        margin: 0 auto;
        margin-top: 10%;
        z-index: 999;
        text-align: center;
        width: 60%;
        max-width: 900px;
        cursor: default;
        position: relative;
    }
    .close-svg {
        position: absolute;
        top: 1rem;
        right: 1rem;
        cursor: pointer;
    }
</style>
