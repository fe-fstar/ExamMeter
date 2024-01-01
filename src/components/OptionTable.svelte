<script>
    import { fly, fade } from "svelte/transition";

    import Button from "./Button.svelte";

    export let data;
    let showWindow = false;

    function toggleShowWindow() {
        showWindow = !showWindow;
    }
</script>

<div class="descendant:text-white">
    <Button on:click={toggleShowWindow}>Göster</Button>
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
                class="w-6 h-6"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                />
            </svg>

            <div class="basis-1/6">
                <h1>{data.index + 1}. Soru Cevap Dağılımı</h1>
            </div>
            <div class="basis-4/6 grid place-items-center my-4">
                <table class="w-full">
                    <thead
                        ><tr
                            class="child:border child:border-slate-600/50 child:p-4 bg-black/5"
                            ><th>Soru {data.index + 1}</th
                            >{#each data.options as _, optionIndex}
                                <th>{String.fromCharCode(65 + optionIndex)}</th>
                            {/each}</tr
                        ></thead
                    >
                    <tbody>
                        <tr
                            class="child:border child:border-slate-600/50 child:p-4"
                            ><td>Frekans</td>{#each data.options as option}
                                <td>{option.frequency}</td>
                            {/each}</tr
                        >
                        <tr
                            class="child:border child:border-slate-600/50 child:p-4"
                            ><td>Frekans Yüzdesi (%)</td
                            >{#each data.options as option}
                                <td>{option.frequencyPercentage}</td>
                            {/each}</tr
                        >
                        <tr
                            class="child:border child:border-slate-600/50 child:p-4"
                            ><td>Ayırt Edicilik Oranı</td
                            >{#each data.options as option}
                                <td>{option.discriminationRatio}</td>
                            {/each}</tr
                        >
                    </tbody>
                </table>
            </div>
            <div
                class="basis-1/6 border border-slate-600/50 flex items-center justify-between px-4 py-2"
            >
                <h4>Boş bırakılma sayısı ve yüzdesi</h4>
                <h4>
                    Sayı: {data.numberOfEmptyAnswers} | Yüzde: {(Math.round(
                        data.numberOfEmptyAnswers /
                            (data.numberOfEmptyAnswers +
                                data.numberOfCorrectAnswers +
                                data.numberOfWrongAnswers),
                    ) *
                        10000) /
                        100}
                </h4>
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
    svg {
        position: absolute;
        top: 1rem;
        right: 1rem;
        cursor: pointer;
    }
</style>
