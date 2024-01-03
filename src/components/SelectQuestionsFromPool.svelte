<script>
    import { fly, fade, scale } from "svelte/transition";

    import { createEventDispatcher, onMount } from "svelte";
    const dispatch = createEventDispatcher();

    import Button from "./Button.svelte";
    import Loading from "./Loading.svelte";

    export let showDialog = false;
    export let loading = false;

    export let title = "Bu ders için soru havuzundaki sorular";

    export let confirmOption = "Soruları Eklemeyi Bitir";
    export let cancelOption = "İptal";
    let isReduced;

    export let questionsFromPool = [];

    let selectedQuestionsFromPool = [];

    const handleCancel = () => {
        dispatch("cancel");
    };

    const handleConfirm = () => {
        dispatch("confirm", { selectedQuestionsFromPool });
    };

    onMount(() => {
        // TODO: Burada havuzdan sorular çekilecek ve questionFromPool'a atanacak

        isReduced =
            window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
            window.matchMedia(`(prefers-reduced-motion: reduce)`).matches ===
                true;
    });
</script>

{#if showDialog}
    <Loading {loading}>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            class="backdrop"
            in:fade={{ duration: isReduced ? 0 : 200 }}
            out:fade={{
                delay: isReduced ? 0 : 200,
                duration: isReduced ? 0 : 200,
            }}
            on:click|self
        >
            <div
                class="confirmation descendant:text-custom_black border border-white bg-gradient-to-br from-slate-200 to-slate-300 rounded-md"
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
                <div class="poolContainer divide-y divide-black/30">
                    {#each questionsFromPool as question, indexQuestion}
                        <div
                            class="flex flex-col gap-y-4 mb-4"
                            transition:scale={{ duration: 333 }}
                        >
                            <div>
                                <div class="flex flex-col items-center">
                                    <div
                                        class="flex w-full items-center justify-evenly"
                                    >
                                        <h3>{indexQuestion + 1}. Soru:</h3>
                                    </div>
                                    {question.text}
                                </div>
                            </div>
                            <div class="flex flex-row flex-wrap justify-evenly">
                                {#each question.options as option, indexOption}
                                    <div
                                        class="flex flex-col gap-y-3 mb-4 mr-4 p-4 border border-black child:flex child:items-center {option.correctAnswer
                                            ? 'bg-green-400/50'
                                            : ''}"
                                        transition:scale={{ duration: 333 }}
                                    >
                                        <div>
                                            {String.fromCharCode(
                                                65 + indexOption,
                                            )})
                                            {option.text}
                                        </div>
                                    </div>
                                {/each}
                            </div>
                            <div class="descendant:text-custom_white">
                                <Button
                                    on:click={() => {
                                        if (
                                            selectedQuestionsFromPool.includes(
                                                question,
                                            )
                                        ) {
                                            selectedQuestionsFromPool =
                                                selectedQuestionsFromPool.filter(
                                                    (q) =>
                                                        q.examId !==
                                                            question.examId &&
                                                        q.index !==
                                                            question.index,
                                                );
                                        } else {
                                            selectedQuestionsFromPool.push(
                                                question,
                                            );
                                            selectedQuestionsFromPool =
                                                selectedQuestionsFromPool;
                                        }
                                    }}
                                >
                                    {#if selectedQuestionsFromPool.includes(question)}
                                        Çıkar
                                    {:else}
                                        Ekle
                                    {/if}
                                </Button>
                            </div>
                        </div>
                    {/each}
                </div>
                <div
                    class="buttonContainer py-4 shadow-inner descendant:text-custom_white"
                >
                    <Button on:click={handleConfirm}>{confirmOption}</Button>
                    <Button on:click={handleCancel}>{cancelOption}</Button>
                </div>
            </div>
        </div>
    </Loading>
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
        margin-top: 2%;
        z-index: 999;
        text-align: center;
        width: 80%;
        height: 90vh;
        max-width: 1200px;
        cursor: default;
    }
    .buttonContainer {
        display: flex;
        padding-bottom: 12px;
        justify-content: space-evenly;
    }
    .poolContainer {
        height: calc(100% - 10vh - 50px);
        overflow-y: scroll;
    }
</style>
