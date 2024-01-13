<script>
    import Button from "../../../components/Button.svelte";
    import { scale } from "svelte/transition";
    import SelectQuestionsFromPool from "../../../components/SelectQuestionsFromPool.svelte";
    import { backendUrl } from "../../../api/backend-url";
    import Loading from "../../../components/Loading.svelte";
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
                score: "",
            },
        ],
    };

    let difficulty = 0;
    let tolerance = 0;
    let exam_id = "";
    let submit_successful = false;
    let loading_form = false;
    let loading_exam_pool = false;
    let questionsFromPool = [];
    let displayAutomaticExamMenu = false;

    let modalQuestionPool = false;

    function handleCancel() {
        modalQuestionPool = false;
    }

    let error_message = "";

    function handleConfirm(e) {
        modalQuestionPool = false;
        // console.log("Bunlar seçildi:");
        // console.log(detail.selectedQuestionsFromPool);
        exam.questions = [
            ...exam.questions,
            ...e.detail.selectedQuestionsFromPool,
        ];
    }

    async function handleAutomaticAdd() {
        try {
            let response = await fetch(
                `${backendUrl}/question_plus_difficulties`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        token: localStorage.getItem("token"),
                    },
                    body: JSON.stringify({
                        class_name: exam.className,
                        difficulty,
                        tolerance,
                    }),
                },
            );

            let parsed_response = await response.json();

            if (parsed_response.success) {
                exam.questions = parsed_response.questions;
            }

            error_message = parsed_response.message;
        } catch (error) {
            error_message = error.message;
        }
    }

    async function handleExamSubmit() {
        let totalScore = exam.questions.reduce(
            (acc, obj) => acc + obj.score,
            0,
        );
        if (totalScore !== 100) {
            error_message = "Soruların puanlarının toplamı 100 olmalı.";
            return;
        }
        if (Date.now() >= new Date(exam.startTime)) {
            error_message = "Sınav başlangıç zamanı şu andan önce olamaz.";
            return;
        }
        if (new Date(exam.endTime) <= new Date(exam.startTime)) {
            error_message =
                "Sınav başlangıç zamanı bitiş zamanından sonra olamaz.";
            return;
        }
        loading_form = true;
        let response = await fetch(`${backendUrl}/exam`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.getItem("token"),
            },
            body: JSON.stringify(exam),
        });
        let parsed_response = await response.json();
        if (parsed_response.success) {
            exam_id = parsed_response.id;
            submit_successful = true;
            navigator.permissions
                .query({ name: "clipboard-write" })
                .then((result) => {
                    if (
                        result.state === "granted" ||
                        result.state === "prompt"
                    ) {
                        navigator.clipboard.writeText(
                            `${location.href.split("/")[2]}/exam/${exam_id}`,
                        );
                    }
                });
        }
        loading_form = false;
    }
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
    {#if submit_successful}
        <div class="flex flex-col justify-center items-center">
            <h1>Sınav başarı ile oluştu.</h1>
            <h2>
                Sınav bağlantısı panonuza kopyalandı. Aynı işlemi aşağıdaki
                bağlantıdan yapabilirsiniz:
            </h2>
            <input
                type="text"
                readonly
                value="{location.href.split('/')[2]}/exam/{exam_id}"
            />
        </div>
    {:else}
        <div class="rounded-md">
            <h2 class="text-custom_black">Sınav Oluşturun</h2>
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
                            <div
                                class="flex flex-wrap justify-evenly items-center"
                            >
                                <textarea
                                    placeholder="Soru kökünü giriniz..."
                                    class="basis-3/4"
                                    bind:value={question.text}
                                />
                                <div
                                    class="flex flex-col justify-center items-center basis-1/4"
                                >
                                    <label for="score">Skor:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        step="1"
                                        bind:value={question.score}
                                    />
                                </div>
                            </div>
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
                {#if displayAutomaticExamMenu}
                    <div class="flex justify-evenly items-center">
                        <div class="flex flex-col items-start justify-center">
                            <label for="difficulty">Zorluk</label>
                            <input
                                bind:value={difficulty}
                                type="number"
                                min="0"
                                max="10"
                                step="1"
                            />
                        </div>
                        <div class="flex flex-col items-start justify-center">
                            <label for="tolerance">Tolerans</label>
                            <input
                                bind:value={tolerance}
                                type="number"
                                min="0"
                                max="5"
                                step="1"
                            />
                        </div>
                    </div>
                    <div class="descendant:text-white mx-auto w-full flex items-center justify-center">
                        <Button type={"button"} on:click={handleAutomaticAdd}
                            >Soruları Ekle</Button
                        >
                    </div>
                {/if}
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
                                console.log(parsed_response.questions);
                                questionsFromPool = parsed_response.questions;
                            }
                            loading_exam_pool = false;
                        }}>Havuzdan Soru Ekle</Button
                    >
                    <Button
                        type={"button"}
                        on:click={() => {
                            displayAutomaticExamMenu = true;
                        }}>Otomatik Zorlukla Sınav Oluştur</Button
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
                    <Button on:click={handleExamSubmit}>Sınavı Kaydet</Button>
                </div>
            </form>
            <p class="text-red-600 text-center">{error_message}</p>
        </div>
    {/if}
</Loading>
