<script>
    import { onDestroy, onMount, tick } from "svelte";
    import {fade} from 'svelte/transition';
    import { goto } from "$app/navigation";
    import Button from "../../../components/Button.svelte";
    import { browser } from "$app/environment";
    import Loading from "../../../components/Loading.svelte";
    import { backendUrl } from "../../../api/backend-url";
    import isAuthenticated from "../../../api/is-authenticated";

    export let data;
    let loading = true;

    let difficultyScore = 1;
    let topicRelevanceScore = 1;
    let methodRelevanceScore = 1;
    let additionalNote = "";

    let exam = {
        id: "",
        title: "",
        class: "",
        description: "",
        startsAt: "",
        endsAt: "",
        jumpingEnabled: false,
        questions: [
            {
                text: "",
                options: [""],
            },
            {
                text: "",
                options: [""],
            },
            {
                text: "",
                options: [""],
            },
            {
                text: "",
                options: [""],
            },
            {
                text: "",
                options: [""],
            },
        ],
    };

    let studentAnswers = [];
    let currentQuestionIndex = -1;
    let timeForExamToStart = 0;
    let timeForExamToEnd = 0;
    let intervalBeforeExam;
    let intervalDuringExam;
    let secondsLeft = "";
    let minutesLeft = "";
    let hoursLeft = "";
    let timeLeftToStartExamString = "-- : -- : --";
    let timeLeftToEndExamString = "-- : -- : --";
    let examSubmissionMessage = "";

    let examErrorMessage = "";

    async function handleSubmit() {
        let examBody = {};

        studentAnswers = studentAnswers.sort(
            (a, b) => a.questionIndex - b.questionIndex,
        );

        // Sort questions to their original state (non-shuffled)
        let originalQuestions = exam.questions.sort((a, b) => a.index - b.index);

        for(let question of originalQuestions) {
            question.options = question.options.sort((a, b) => a.index - b.index);
        }
        // Student answers string to send within request.
        // The character at position of answered question will have the index of the option selected
        // Otherwise, it will remain "-"
        let studentAnswersText = Array(exam.questions.length).fill("-");
        for (let i = 0; i < originalQuestions.length; ++i) {
            let foundIndex = studentAnswers.findIndex(
                (obj) => obj.questionIndex === i.index,
            );

            if (foundIndex !== -1) {
                studentAnswersText[studentAnswers[foundIndex].questionIndex] =
                    studentAnswers[foundIndex].optionIndex;
            }
        }

        studentAnswersText = studentAnswersText.join("");

        examBody.answers = studentAnswersText;
        examBody.additionalNote = additionalNote;
        examBody.topicRelevanceScore = topicRelevanceScore;
        examBody.methodRelevanceScore = methodRelevanceScore;
        examBody.difficultyScore = difficultyScore;
        examBody.id = exam.id;

        try {
            let response = await fetch(`${backendUrl}/submit_exam`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.token 
                },
                body: JSON.stringify(examBody),
            });

            let parsedResponse = await response.json();

            if (parsedResponse.success) {
                examSubmissionMessage = parsedResponse.message;
                setTimeout(() => {
                    location.href = "/home";
                }, 3000);
            }
        } catch (error) {
            examSubmissionMessage = "Bir hata oluştu: " + error.message;
        }
    }

    $: if (
        timeLeftToStartExamString === "00 : 00 : 00" &&
        currentQuestionIndex === -1
    ) {
        setTimeout(() => {
            clearInterval(intervalBeforeExam);
        }, 1000);

        intervalDuringExam = setInterval(() => {
            timeForExamToEnd = new Date(exam.endTime) - Date.now();

            hoursLeft = Math.floor(timeForExamToEnd / 3600000); // 1 hour = 3600000 milliseconds
            minutesLeft = Math.floor((timeForExamToEnd % 3600000) / 60000); // 1 minute = 60000 milliseconds
            secondsLeft = Math.floor((timeForExamToEnd % 60000) / 1000); // 1 second = 1000 milliseconds

            timeLeftToEndExamString =
                (hoursLeft === 0
                    ? "00"
                    : hoursLeft < 10
                      ? "0" + hoursLeft
                      : hoursLeft) +
                    " : " +
                    (minutesLeft === 0
                        ? "00"
                        : minutesLeft < 10
                          ? "0" + minutesLeft
                          : minutesLeft) +
                    " : " +
                    (secondsLeft === 0
                        ? "00"
                        : secondsLeft < 10
                          ? "0" + secondsLeft
                          : secondsLeft) || "00 : 00 : 00";
        }, 1000);
        ++currentQuestionIndex;
    }

    $: if (timeLeftToEndExamString === "00 : 00 : 00") {
        clearInterval(intervalDuringExam);
        currentQuestionIndex = exam.questions.length;
    }

    $: if (currentQuestionIndex === exam.questions.length) {
        clearInterval(intervalDuringExam);
    }

    onMount(async () => {
        if (browser) {
            let isAuth = await isAuthenticated();
            if(!isAuth){
                goto("/");
            }

            let id = data.id;
            loading = true;
            examErrorMessage = "";
            try {
                let response = await fetch(`${backendUrl}/exam/${id}`, {
                    headers: { token: localStorage.token },
                });
                let parsed_response = await response.json();

                if (parsed_response.success) {
                    exam = parsed_response.exam;
                }else{
                    examErrorMessage = parsed_response.message;
                }
            } catch (error) {
                console.log(error.message);
            }
            loading = false;

            let examStartDate = new Date(exam.startTime);
            var userTimezoneOffset = examStartDate.getTimezoneOffset() * 60000;
            examStartDate = new Date(examStartDate.getTime() + userTimezoneOffset);

            let examEndDate = new Date(exam.endTime);
            examEndDate = new Date(examEndDate.getTime() + userTimezoneOffset);


            if (examStartDate > Date.now()) {
                console.log("Here");
                // If exam has not started yet
                intervalBeforeExam = setInterval(() => {
                    timeForExamToStart = examStartDate - Date.now();

                    hoursLeft = Math.floor(timeForExamToStart / 3600000); // 1 hour = 3600000 milliseconds
                    minutesLeft = Math.floor(
                        (timeForExamToStart % 3600000) / 60000,
                    ); // 1 minute = 60000 milliseconds
                    secondsLeft = Math.floor(
                        (timeForExamToStart % 60000) / 1000,
                    ); // 1 second = 1000 milliseconds

                    timeLeftToStartExamString =
                        (hoursLeft === 0
                            ? "00"
                            : hoursLeft < 10
                              ? "0" + hoursLeft
                              : hoursLeft) +
                            " : " +
                            (minutesLeft === 0
                                ? "00"
                                : minutesLeft < 10
                                  ? "0" + minutesLeft
                                  : minutesLeft) +
                            " : " +
                            (secondsLeft === 0
                                ? "00"
                                : secondsLeft < 10
                                  ? "0" + secondsLeft
                                  : secondsLeft) || "00 : 00 : 00";
                }, 1000);
            } else if (examEndDate > Date.now()) {
                console.log("There");
                // If exam has not ended yet
                intervalDuringExam = setInterval(() => {
                    timeForExamToEnd = examEndDate - Date.now();

                    hoursLeft = Math.floor(timeForExamToEnd / 3600000); // 1 hour = 3600000 milliseconds
                    minutesLeft = Math.floor(
                        (timeForExamToEnd % 3600000) / 60000,
                    ); // 1 minute = 60000 milliseconds
                    secondsLeft = Math.floor((timeForExamToEnd % 60000) / 1000); // 1 second = 1000 milliseconds

                    timeLeftToEndExamString =
                        (hoursLeft === 0
                            ? "00"
                            : hoursLeft < 10
                              ? "0" + hoursLeft
                              : hoursLeft) +
                            " : " +
                            (minutesLeft === 0
                                ? "00"
                                : minutesLeft < 10
                                  ? "0" + minutesLeft
                                  : minutesLeft) +
                            " : " +
                            (secondsLeft === 0
                                ? "00"
                                : secondsLeft < 10
                                  ? "0" + secondsLeft
                                  : secondsLeft) || "00 : 00 : 00";
                }, 1000);
                currentQuestionIndex = 0;
            }
        }
    });

    onDestroy(() => {
        clearInterval(intervalBeforeExam);
        clearInterval(intervalDuringExam);
    });
</script>

<Loading {loading}>
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-2xl">
            <div
                class="divide-y divide-gray-200 overflow-hidden rounded-lg bg-custom_white shadow child:text-custom_black"
            >
                {#if examErrorMessage != ""}
                    <div class="text-md h-48 flex flex-col gap-4 items-center justify-center">
                        {examErrorMessage}

                        <Button on:click={()=>{goto("/home");}}>Ana sayfaya geri dön.</Button>
                    </div>
                {:else}
                    <div class:hidden={loading}>
                    {#if currentQuestionIndex === -1}
                        <div
                            class="px-4 py-5 flex flex-col justify-center items-center"
                        >
                            <h1>{exam.className}</h1>
                            <h2>{exam.title}</h2>
                        </div>
                        <div
                            class="px-4 py-5 flex flex-col justify-center items-center"
                        >
                            <p>{exam.description}</p>
                            <h3>Sınavınızın başlamasına kalan süre:</h3>
                            <h2>{timeLeftToStartExamString}</h2>
                            <p>
                                (Süre dolduğunda sınavınız otomatik olarak
                                başlayacaktır)
                            </p>
                        </div>
                    {:else if currentQuestionIndex === exam.questions.length}
                        <div
                            class="px-4 py-5 flex flex-col justify-center items-center"
                        >
                            <div>
                                <h2>
                                    Sınavınız bitmiştir. Aşağıdaki sınav geri dönüş
                                    formunu doldurarak sınav hakkındaki
                                    görüşlerinizi bildirebilir ve gelecekteki
                                    sınavların daha kaliteli olmasına destek
                                    sağlayabilirsiniz.
                                </h2>
                            </div>
                            <div>
                                <form>
                                    <div class="flex flex-col items-start my-6">
                                        <label for="one"
                                            >Sınav zorluğunu derecelendirin (1: Çok
                                            kolay - 10: Çok zor: <span
                                                class="font-bold"
                                                >{difficultyScore}</span
                                            ></label
                                        >
                                        <input
                                            type="range"
                                            name="one"
                                            min="1"
                                            max="10"
                                            step="1"
                                            class="w-full"
                                            bind:value={difficultyScore}
                                        />
                                    </div>
                                    <div class="flex flex-col items-start my-6">
                                        <label for="two"
                                            >Sınav konularının ve içeriğinin ders
                                            ile alaka durumunu derecelendirin (1:
                                            Tamamen alakasız - 10: Tamamen alakalı): <span
                                                class="font-bold"
                                                >{topicRelevanceScore}</span
                                            ></label
                                        >
                                        <input
                                            type="range"
                                            name="two"
                                            min="1"
                                            max="10"
                                            step="1"
                                            class="w-full"
                                            bind:value={topicRelevanceScore}
                                        />
                                    </div>
                                    <div class="flex flex-col items-start my-6">
                                        <label for="two"
                                            >Sınav soru türlerinin ders pratiği ile
                                            alaka durumunu değerlendirin (1: Tamamen
                                            alakasız - 10: Tamamen alakalı): <span
                                                class="font-bold"
                                                >{methodRelevanceScore}</span
                                            ></label
                                        >
                                        <input
                                            type="range"
                                            name="three"
                                            min="1"
                                            max="10"
                                            step="1"
                                            class="w-full"
                                            bind:value={methodRelevanceScore}
                                        />
                                    </div>
                                    <div class="flex flex-col items-start my-6">
                                        <label for="four"
                                            >Ek Görüşünüz Var İse Lütfen Aşağıda
                                            Belirtiniz</label
                                        >
                                        <textarea
                                            name="four"
                                            placeholder="Görüşlerinizi buradan belirtebilirsiniz..."
                                            class="w-full"
                                            bind:value={additionalNote}
                                        />
                                    </div>
                                    <div class="grid place-items-center gap-y-4">
                                        <Button on:click={handleSubmit}
                                            >Gönder</Button
                                        >
                                        <p>{examSubmissionMessage}</p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    {:else}
                        <div class="px-4 py-5 sm:px-6">
                            <div
                                class="flex justify-between items-center child:text-custom_black"
                            >
                                <div>{exam.title}</div>
                                <div>{timeLeftToEndExamString}</div>
                            </div>
                        </div>
                        <div class="px-4 py-5 sm:p-6 child:text-custom_black">
                            <p>
                                <span class="font-bold"
                                    >{currentQuestionIndex + 1})</span
                                >
                                {exam.questions[currentQuestionIndex].text}
                            </p>
                            <br />
                            {#each exam.questions[currentQuestionIndex].options as option, index}
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                                <p
                                    on:click={() => {
                                        let foundIndex = studentAnswers.findIndex(
                                            (obj) =>
                                                obj.questionIndex ===
                                                exam.questions[currentQuestionIndex]
                                                    .index,
                                        );

                                        if (foundIndex !== -1) {
                                            if (
                                                option.index ===
                                                studentAnswers[foundIndex]
                                                    .optionIndex
                                            ) {
                                                studentAnswers =
                                                    studentAnswers.filter(
                                                        (obj) =>
                                                            obj.optionIndex !==
                                                                option.index &&
                                                            obj.questionIndex ===
                                                                exam.questions[
                                                                    currentQuestionIndex
                                                                ].index,
                                                    );
                                            } else {
                                                studentAnswers[foundIndex] = {
                                                    questionIndex:
                                                        exam.questions[
                                                            currentQuestionIndex
                                                        ].index,
                                                    optionIndex: option.index,
                                                };
                                                studentAnswers = [
                                                    ...studentAnswers,
                                                ];
                                            }
                                        } else {
                                            studentAnswers = [
                                                {
                                                    questionIndex:
                                                        exam.questions[
                                                            currentQuestionIndex
                                                        ].index,
                                                    optionIndex: option.index,
                                                },
                                                ...studentAnswers,
                                            ];
                                        }
                                    }}
                                    class="p-4 cursor-pointer hover:bg-slate-300 rounded-lg {studentAnswers.some(
                                        (obj) =>
                                            obj.questionIndex ==
                                                exam.questions[currentQuestionIndex]
                                                    .index &&
                                            obj.optionIndex == option.index,
                                    )
                                        ? 'bg-indigo-300'
                                        : ''} bg-pink"
                                >
                                    <span class="font-bold"
                                        >{String.fromCharCode(65 + index)})</span
                                    >
                                    {option.text}
                                </p>
                            {/each}
                        </div>
                        <div class="px-4 py-4 sm:px-6">
                            <div class="flex justify-evenly items-center">
                                {#if exam.allowJumping && currentQuestionIndex > 0}
                                <Button
                                on:click={() => {
                                    --currentQuestionIndex;
                                }}>Önceki Soru</Button
                            >
                                {/if}
                                <Button
                                    on:click={() => {
                                        ++currentQuestionIndex;
                                    }}
                                    >{currentQuestionIndex <
                                    exam.questions.length - 1
                                        ? "Sonraki Soru"
                                        : "Sınavı Bitir"}</Button
                                >
                            </div>
                        </div>
                    {/if}
                    </div>
                {/if}
            </div>
        </div>
    </div>
</Loading>
