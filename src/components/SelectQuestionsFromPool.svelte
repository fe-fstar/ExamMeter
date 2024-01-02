<script>
    import { fly, fade, scale } from "svelte/transition";

    import { createEventDispatcher, onMount } from "svelte";
    const dispatch = createEventDispatcher();

    import Button from "./Button.svelte";

    export let showDialog = false;

    export let title = "Bu ders için soru havuzundaki sorular"

    export let confirmOption = "Soruları Eklemeyi Bitir";
    export let cancelOption = "İptal";
    let isReduced;

    let questionsFromPool = [
        {
            text: "Test 1",
            options: [{ text: "Test cevap", isCorrect: false },{ text: "Test cevap", isCorrect: true },{ text: "Test cevap", isCorrect: false },{ text: "Test cevap", isCorrect: false }],
        },
        {
            text: "Test 2",
            options: [{ text: "Test cevap", isCorrect: false },{ text: "Test cevap", isCorrect: true },{ text: "Test cevap", isCorrect: false },{ text: "Test cevap", isCorrect: false }],
        },
        {
            text: "Test 3",
            options: [{ text: "Test cevap", isCorrect: false },{ text: "Test cevap", isCorrect: true },{ text: "Test cevap", isCorrect: false },{ text: "Test cevap", isCorrect: false }],
        },
        {
            text: "Test 4",
            options: [{ text: "Test cevap", isCorrect: false },{ text: "Test cevap", isCorrect: true },{ text: "Test cevap", isCorrect: false },{ text: "Test cevap", isCorrect: false }],
        },
    ];

    let selectedQuestionsFromPool = [];

    const handleCancel = () => {
        dispatch("cancel");
    };

    const handleConfirm = () => {
        dispatch("confirm", {selectedQuestionsFromPool});
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
            <div class="poolContainer">
                {#each questionsFromPool as question, indexQuestion}
                <div class="flex flex-col" transition:scale={{ duration: 333 }}>
                    <div>
                        <div class="flex flex-col items-center">
                            <div class="flex w-full items-center justify-evenly">
                                <h3>{indexQuestion + 1}. Soru:</h3>
                                <div class="descendant:text-custom_white">
                                    <Button on:click={()=>{
                                        let isFound = selectedQuestionsFromPool.filter((q)=> q.text === question.text)
                                        if (isFound.length > 0){
                                            selectedQuestionsFromPool = selectedQuestionsFromPool.filter((q) => q.text != question.text);
                                        }else{
                                            selectedQuestionsFromPool.push(question);
                                            selectedQuestionsFromPool = selectedQuestionsFromPool;
                                        }
                                    }}>
                                        {#if selectedQuestionsFromPool.filter((q)=> q.text === question.text).length > 0}
                                        Çıkar
                                        {:else}
                                        Ekle
                                        {/if}
                                    </Button>
                                </div>
                            </div>
                            {question.text}
                        </div>
                    </div>
                    <div class="flex flex-row flex-wrap justify-evenly">
                        {#each question.options as option, indexOption}
                            <div
                                class="flex flex-col gap-y-3 mb-4 mr-4 p-4 border child:flex child:items-center"
                                transition:scale={{ duration: 333 }}
                            >
                                <div>
                                    {String.fromCharCode(65 + indexOption)}
                                    {option.text}
                                </div>
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <div class="flex justify-between">
                                    <div class="flex items-center">
                                        {#if option.isCorrect}
                                        <label for="option_{indexQuestion}">Doğru cevap</label>
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
            </div>
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
    .poolContainer{
        height: calc(100% - 10vh - 50px);
        overflow-y: scroll;
    }
</style>
