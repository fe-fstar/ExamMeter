<script>
    import Button from "../../../../components/Button.svelte";
    import { scale } from "svelte/transition";
    import SelectQuestionsFromPool from "../../../../components/SelectQuestionsFromPool.svelte";
    import { backendUrl } from "../../../../api/backend-url";
    import Loading from "../../../../components/Loading.svelte";
    import { browser } from "$app/environment";
    import { onMount } from "svelte";

    let exam = {
        title: "",
        className: "",
        description: "",
        startTime: "",
        endTime: "",
        allowJumping: false,
        shuffleQuestions: false,
        shuffleOptions: false,
        questions: [
            {
                text: "",
                options: [{ text: "", correctAnswer: false }],
            },
        ],
    };

    export let data;
    let exam_id = "";
    let edit_successful = false;
    let loading_form = false;
    let loading_exam_pool = false;
    let questionsFromPool = [];
    let error_message = "";

    let modalQuestionPool = false;

    function handleCancel() {
        modalQuestionPool = false;
    }

    function handleConfirm(e) {
        modalQuestionPool = false;
        exam.questions = [
            ...exam.questions,
            ...e.detail.selectedQuestionsFromPool,
        ];
    }

    async function handleExamEdit() {
        let totalScore = exam.questions.reduce((acc, obj) => acc + obj.score, 0);
        if(totalScore !== 100) {
            error_message = "Soruların puanlarının toplamı 100 olmalı."
            return;
        }
        if(Date.now() >= new Date(exam.startTime)) {
            error_message = "Sınav başlangıç zamanı şu andan önce olamaz."
            return;
        }
        if(new Date(exam.endTime) <= new Date(exam.startTime)) {
            error_message = "Sınav başlangıç zamanı bitiş zamanından sonra olamaz."
            return;
        }
        loading_form = true;

        let response = await fetch(`${backendUrl}/exam`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.getItem("token"),
            },
            body: JSON.stringify(exam),
        });

        let parsed_response = await response.json();

        if (parsed_response.success) {
            navigator.permissions
                .query({ name: "clipboard-write" })
                .then((result) => {
                    if (
                        result.state === "granted" ||
                        result.state === "prompt"
                    ) {
                        navigator.clipboard.writeText(
                            `${location.pathname.match(/^\/([^\/]*)/)[1]}/exam/${exam_id}`,
                        );
                    }
                });
            edit_successful = true;
        } else {
            error_message = "Bir hata oluştu: " + parsed_response.message;
        }

        loading_form = false;
    }

    onMount(async () => {
        if (browser) {
            exam_id = data.id;
            loading_form = true;
            let response = await fetch(`${backendUrl}/exam/${exam_id}`, {
                method: "GET",
                headers: {
                    content: "application/json",
                    token: localStorage.getItem("token"),
                },
            });
            let parsed_response = await response.json();
            if (parsed_response.success) {
                exam = parsed_response.exam;
                exam.startTime = exam.startTime.substring(
                    0,
                    exam.startTime.length - 1,
                );
                exam.endTime = exam.endTime.substring(
                    0,
                    exam.endTime.length - 1,
                );
                for (let question of exam.questions) {
                    question.options = question.options.map(function (obj) {
                        // Assign new key
                        obj["correctAnswer"] = obj["correct_answer"];

                        // Delete old key
                        delete obj["correct_answer"];

                        return obj;
                    });
                }
                console.log(exam);
            }
            loading_form = false;
        }
    });
</script>

<SelectQuestionsFromPool
    {questionsFromPool}
    loading={loading_exam_pool}
    showDialog={modalQuestionPool}
    on:cancel={handleCancel}
    on:confirm={handleConfirm}
    on:click={() => {
        modalQuestionPool = false;
    }}
/>

<Loading loading={loading_form}>
    {#if edit_successful}
        <div class="flex flex-col justify-center items-center">
            <h1>Sınav başarı ile düzenlendi.</h1>
            <h2>
                Sınav bağlantısı panonuza kopyalandı. Aynı işlemi aşağıdaki
                bağlantıdan yapabilirsiniz:
            </h2>
            <input type="text" readonly value="{location.pathname.match(/^\/([^\/]*)/)[1]}/exam/{exam_id}" />
        </div>
    {:else}
        <div class="rounded-md">
            <h2 class="text-custom_black">Sınav Düzenleyin</h2>
            <form
                class="flex flex-col justify-center items-center child:flex child:py-4 child:w-full divide-y descendant:text-custom_black"
            >
                <div class="flex-col">
                    <label for="title">Sınav Dersi</label>
                    <input type="text" bind:value={exam.className} />
                </div>
                <div
                    class="flex-col sm:flex-row items-center justify-evenly child:flex child:flex-col child:w-full"
                >
                    <div class="mb-4 sm:mb-0 sm:mr-4">
                        <label for="title">Sınav Başlığı</label>
                        <input type="text" bind:value={exam.title} />
                    </div>
                    <div class="mt-4 sm:mt-0 sm:ml-4">
                        <label for="description">Sınav Açıklaması</label>
                        <textarea bind:value={exam.description} />
                    </div>
                </div>
                <div
                    class="flex-col sm:flex-row justify-evenly child:flex child:flex-col child:w-full"
                >
                    <div class="mb-4 sm:mb-0 sm:mr-4">
                        <label for="start-time">Başlangıç Zamanı</label>
                        <input
                            type="datetime-local"
                            bind:value={exam.startTime}
                        />
                    </div>
                    <div class="mt-4 sm:mt-0 sm:ml-4">
                        <label for="end-time">Bitiş Zamanı</label>
                        <input
                            type="datetime-local"
                            bind:value={exam.endTime}
                        />
                    </div>
                </div>
                <h2>Sorular</h2>
                {#each exam.questions as question, indexQuestion}
                    <div
                        class="flex flex-col"
                        transition:scale={{ duration: 333 }}
                    >
                        <div>
                            <div class="flex justify-between items-center">
                                <h3>{indexQuestion + 1}. Soru:</h3>
                                {#if exam.questions.length !== 1}
                                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                                    <div
                                        class="w-8 h-8 border border-black grid place-items-center cursor-pointer"
                                        on:click={() => {
                                            exam.questions.splice(
                                                indexQuestion,
                                                1,
                                            );
                                            exam.questions = [
                                                ...exam.questions,
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
                            <textarea
                                placeholder="Soru kökünü giriniz..."
                                class="w-full"
                                bind:value={question.text}
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
                                        <textarea
                                            placeholder="Yanıt içeriğini giriniz..."
                                            class="ml-4"
                                            bind:value={option.text}
                                        />
                                    </div>
                                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                                    <div class="flex justify-between">
                                        <div class="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="option_{indexQuestion}"
                                                bind:checked={option.correctAnswer}
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
                                        correctAnswer: false,
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
                <div
                    class="flex flex-wrap justify-evenly items-center child:m-2"
                >
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
                            bind:checked={exam.allowJumping}
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
                        on:click={async () => {
                            modalQuestionPool = true;
                            loading_exam_pool = true;
                            let response = await fetch(
                                `${backendUrl}/question`,
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        class_name: exam.className,
                                    }),
                                },
                            );
                            let parsed_response = await response.json();
                            if (parsed_response.success) {
                                questionsFromPool = parsed_response.questions;
                            }
                            loading_exam_pool = false;
                        }}>Havuzdan Soru Ekle</Button
                    >
                    <Button
                        type={"button"}
                        on:click={() => {
                            exam.questions.push({
                                text: "",
                                options: [{ text: "", correctAnswer: false }],
                            });
                            exam.questions = [...exam.questions];
                        }}>Yeni Soru Ekle</Button
                    >
                    <Button on:click={handleExamEdit}>Sınavı Kaydet</Button>
                </div>
            </form>
            <p class="text-center text-red-600">{error_message}</p>
        </div>
    {/if}
</Loading>
