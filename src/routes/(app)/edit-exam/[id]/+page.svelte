<script>
    import Loading from "../../../../components/Loading.svelte";
    import Button from "../../../../components/Button.svelte";
    import { scale } from "svelte/transition";
    import { onMount } from "svelte";

    let loading = true;

    let exam = {
        id: "",
        title: "",
        class: "",
        description: "",
        startsAt: "",
        endsAt: "",
        jumpingEnabled: false,
        shuffleQuestions: false,
        shuffleOptions: false,
        questions: [
            {
                text: "",
                options: [
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                ],
            },
            {
                text: "",
                options: [
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                ],
            },
            {
                text: "",
                options: [
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                ],
            },
            {
                text: "",
                options: [
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                ],
            },
        ],
    };

    onMount(() => {
        setTimeout(() => {
            loading = false;
        }, 3000);
    });
</script>

{#if loading}
    <Loading />
{:else}
    <div class="rounded-md descendant:text-custom_black">
        <h1>Sınav Düzenleyin</h1>
        <form
            class="flex flex-col justify-center items-center child:flex child:py-4 child:w-full divide-y"
        >
            <div class="flex-col">
                <label for="title">Sınav Dersi</label>
                <input type="text" />
            </div>
            <div
                class="flex-col sm:flex-row items-center justify-evenly child:flex child:flex-col child:w-full"
            >
                <div class="mb-4 sm:mb-0 sm:mr-4">
                    <label for="title">Sınav Başlığı</label>
                    <input type="text" />
                </div>
                <div class="mt-4 sm:mt-0 sm:ml-4">
                    <label for="title">Sınav Açıklaması</label>
                    <input type="text" />
                </div>
            </div>
            <div
                class="flex-col sm:flex-row justify-evenly child:flex child:flex-col child:w-full"
            >
                <div class="mb-4 sm:mb-0 sm:mr-4">
                    <label for="title">Başlangıç Zamanı</label>
                    <input type="datetime-local" />
                </div>
                <div class="mt-4 sm:mt-0 sm:ml-4">
                    <label for="title">Bitiş Zamanı</label>
                    <input type="datetime-local" />
                </div>
            </div>
            <h2>Sorular</h2>
            {#each exam.questions as question, indexQuestion}
                <div class="flex flex-col" transition:scale={{ duration: 333 }}>
                    <div>
                        <div class="flex justify-between items-center">
                            <h3>{indexQuestion + 1}. Soru:</h3>
                            {#if exam.questions.length !== 1}
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <div
                                    class="w-8 h-8 border border-black grid place-items-center cursor-pointer"
                                    on:click={() => {
                                        exam.questions.splice(indexQuestion, 1);
                                        exam.questions = [...exam.questions];
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        class="w-6 h-6"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                        />
                                    </svg>
                                </div>
                            {/if}
                        </div>
                        <input
                            type="text"
                            placeholder="Soru kökünü giriniz..."
                            class="w-full"
                        />
                    </div>
                    <div class="flex flex-row flex-wrap justify-evenly">
                        <h3 class="basis-full">
                            {indexQuestion + 1}. soru için seçenekler:
                        </h3>
                        {#each question.options as option, indexOption}
                            <div
                                class="flex flex-col gap-y-3 mb-4 mr-4 p-4 border child:flex child:items-center"
                                transition:scale={{ duration: 333 }}
                            >
                                <div>
                                    {String.fromCharCode(65 + indexOption)})
                                    <input
                                        type="text"
                                        placeholder="Yanıt içeriğini giriniz..."
                                        class="ml-4"
                                        bind:value={option.text}
                                    />
                                </div>
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <div class="flex justify-between">
                                    <div class="flex items-center">
                                        <input
                                            type="radio"
                                            name="option_{indexQuestion}"
                                            bind:value={option.isCorrect}
                                            class="cursor-pointer"
                                        />
                                        <label
                                            for="option_{indexQuestion}"
                                            class="ml-4">Doğru cevap</label
                                        >
                                    </div>
                                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                                    {#if question.options.length !== 1}
                                        <div
                                            class="w-8 h-8 border border-black grid place-items-center cursor-pointer"
                                            on:click={() => {
                                                question.options.splice(
                                                    indexOption,
                                                    1,
                                                );
                                                question.options = [
                                                    ...question.options,
                                                ];
                                            }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke-width="1.5"
                                                stroke="currentColor"
                                                class="w-6 h-6"
                                            >
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                />
                                            </svg>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        {/each}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <div
                            class="basis-full flex justify-center items-center h-10 cursor-pointer border border-black w-min"
                            on:click={() => {
                                question.options.push({
                                    text: "",
                                    isCorrect: false,
                                });
                                question.options = [...question.options];
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-6 h-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M12 4.5v15m7.5-7.5h-15"
                                />
                            </svg>
                            <p>Seçenek Ekle</p>
                        </div>
                    </div>
                </div>
            {/each}
            <div class="flex flex-wrap justify-evenly items-center child:m-2">
                <div class="flex justify-start items-center">
                    <input
                        type="checkbox"
                        name="shuffleOptions"
                        class="mr-2"
                        bind:checked={exam.shuffleOptions}
                    />
                    <label for="shuffleOptions"
                        >Soru seçeneklerini rastgele karıştır</label
                    >
                </div>
                <div class="flex justify-start items-center">
                    <input
                        type="checkbox"
                        name="shuffleQuestions"
                        class="mr-2"
                        bind:checked={exam.shuffleQuestions}
                    />
                    <label for="shuffleQuestions"
                        >Soruları rastgele karıştır</label
                    >
                </div>
                <div class="flex justify-start items-center">
                    <input
                        type="checkbox"
                        name="allowJumping"
                        class="mr-2"
                        bind:checked={exam.jumpingEnabled}
                    />
                    <label for="shuffleOptions"
                        >Sorudan soruya atlamaya izin ver</label
                    >
                </div>
            </div>
            <div
                class="flex justify-evenly items-center flex-wrap descendant:text-custom_white"
            >
                <Button
                    type={"button"}
                    on:click={() => {
                        exam.questions.push({
                            text: "",
                            options: [{ text: "", isCorrect: false }],
                        });
                        exam.questions = [...exam.questions];
                    }}>Soru Ekle</Button
                >
                <Button>Sınavı Kaydet</Button>
            </div>
        </form>
    </div>
{/if}
