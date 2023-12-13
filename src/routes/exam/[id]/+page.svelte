<script>
    import { onDestroy, onMount } from "svelte";
    import Button from "../../../components/Button.svelte";

    let exam = {
        id: "regEx-Kolta",
        title: "ANN Midterm",
        class: "Artificial Neural Networks CSE-1234",
        description:
            "Add the exam sheet to your report XDDDDDDDDDDDDDDDDDDDDDDD",
        startsAt: new Date(2023, 11, 13, 17, 51, 30),
        endsAt: new Date(2023, 11, 13, 17, 52, 0),
        jumpingEnabled: false,
        questions: [
            {
                text: "What is the mass of the sun?",
                options: ["idk", 1, Math.PI, "6.02 x 10^23 centimeters"],
            },
            {
                text: "What is the mass of the sun?",
                options: ["idk", 2, Math.PI, "6.02 x 10^23 centimeters"],
            },
            {
                text: "What is the mass of the sun?",
                options: [
                    "idk",
                    3,
                    Math.PI,
                    "6.02 x 10^23 centimeters",
                    "testing if it handles dynamic options",
                ],
            },
            {
                text: "What is the mass of the sun?",
                options: ["idk", 4, Math.PI, "6.02 x 10^23 centimeters"],
            },
            {
                text: "What is the mass of the sun?",
                options: ["idk", Math.E, "6.02 x 10^23 centimeters"],
            },
        ],
    };

    let studentAnswers = [];
    let currentQuestionIndex = exam.questions.length;
    let timeForExamToStart = 0;
    let timeForExamToEnd = 0;
    let intervalBeforeExam;
    let intervalDuringExam;
    let secondsLeft;
    let minutesLeft;
    let hoursLeft;
    let timeLeftToStartExamString;
    let timeLeftToEndExamString;

    $: if (
        timeLeftToStartExamString === "00 : 00 : 00" &&
        currentQuestionIndex === -1
    ) {
        clearInterval(intervalBeforeExam);
        intervalDuringExam = setInterval(() => {
            timeForExamToEnd = exam.endsAt - Date.now();

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
                      : secondsLeft);
        }, 1000);
        ++currentQuestionIndex;
    }

    $: if (timeLeftToEndExamString === "00 : 00 : 00") {
        clearInterval(intervalDuringExam);
        currentQuestionIndex = exam.questions.length;
    }

    onMount(() => {
        if (exam.startsAt > Date.now()) {
            intervalBeforeExam = setInterval(() => {
                timeForExamToStart = exam.startsAt - Date.now();

                hoursLeft = Math.floor(timeForExamToStart / 3600000); // 1 hour = 3600000 milliseconds
                minutesLeft = Math.floor(
                    (timeForExamToStart % 3600000) / 60000,
                ); // 1 minute = 60000 milliseconds
                secondsLeft = Math.floor((timeForExamToStart % 60000) / 1000); // 1 second = 1000 milliseconds

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
                          : secondsLeft);
            }, 1000);
        } else if (exam.endsAt < Date.now()) {
            currentQuestionIndex = exam.questions.length;
        } else {
            currentQuestionIndex = 0;
        }
    });

    onDestroy(() => {
        clearInterval(intervalBeforeExam);
        clearInterval(intervalDuringExam);
    });
</script>

<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl">
        <div
            class="divide-y divide-gray-200 overflow-hidden rounded-lg bg-custom_white shadow child:text-custom_black"
        >
            {#if currentQuestionIndex === -1}
                <div
                    class="px-4 py-5 flex flex-col justify-center items-center"
                >
                    <h1>{exam.class}</h1>
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
                            formunu doldurarak sınav hakkındaki görüşlerinizi
                            bildirebilir ve gelecekteki sınavların daha kaliteli
                            olmasına destek sağlayabilirsiniz.
                        </h2>
                    </div>
                    <div>
                        <form class="child:last:mx-auto">
                            <div class="flex flex-col items-start my-6">
                                <label for="one"
                                    >Sınav zorluğunu derecelendirin</label
                                >
                                <input type="number" name="one" class="w-full"/>
                            </div>
                            <div class="flex flex-col items-start my-6">
                                <label for="two"
                                    >Sınav konularının ve içeriğinin ders ile
                                    alaka durumunu derecelendirin</label
                                >
                                <input type="number" name="two" class="w-full"/>
                            </div>
                            <div class="flex flex-col items-start my-6">
                                <label for="two"
                                    >Sınav soru türlerinin ders pratiği ile
                                    alaka durumunu değerlendirin</label
                                >
                                <input type="number" name="two" class="w-full"/>
                            </div>
                            <div class="grid place-items-center">
                                <Button>Gönder</Button>
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
                                        currentQuestionIndex,
                                );

                                if (foundIndex !== -1) {
                                    if (
                                        index ===
                                        studentAnswers[foundIndex].optionIndex
                                    ) {
                                        studentAnswers = studentAnswers.filter(
                                            (obj) =>
                                                obj.optionIndex !== index &&
                                                obj.questionIndex ===
                                                    currentQuestionIndex,
                                        );
                                    } else {
                                        studentAnswers[foundIndex] = {
                                            questionIndex: currentQuestionIndex,
                                            optionIndex: index,
                                        };
                                        studentAnswers = [...studentAnswers];
                                    }
                                } else {
                                    studentAnswers = [
                                        {
                                            questionIndex: currentQuestionIndex,
                                            optionIndex: index,
                                        },
                                        ...studentAnswers,
                                    ];
                                }
                            }}
                            class="p-4 cursor-pointer hover:bg-slate-300 rounded-lg {studentAnswers.some(
                                (obj) =>
                                    obj.questionIndex ===
                                        currentQuestionIndex &&
                                    obj.optionIndex === index,
                            )
                                ? 'bg-indigo-300'
                                : ''}"
                        >
                            <span class="font-bold"
                                >{String.fromCharCode(65 + index)})</span
                            >
                            {option}
                        </p>
                    {/each}
                </div>
                <div class="px-4 py-4 sm:px-6">
                    <div class="flex justify-evenly items-center">
                        <Button
                            disabled={!exam.jumpingEnabled}
                            on:click={() => {
                                --currentQuestionIndex;
                            }}>Önceki Soru</Button
                        >
                        <Button
                            on:click={() => {
                                ++currentQuestionIndex;
                            }}
                            >{currentQuestionIndex < exam.questions.length - 1
                                ? "Sonraki Soru"
                                : "Sınavı Bitir"}</Button
                        >
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>
