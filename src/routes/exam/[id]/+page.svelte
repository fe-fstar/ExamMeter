<script>
    import Button from "../../../components/Button.svelte";

    let exam = {
        id: "regEx-Kolta",
        title: "ANN Midterm",
        class: "Artificial Neural Networks CSE-1234",
        description:
            "Add the exam sheet to your report XDDDDDDDDDDDDDDDDDDDDDDD",
        startsAt: 1702391437,
        endsAt: 1702393237,
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

    let currentQuestionIndex = 0;
</script>

<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl">
        <div
            class="divide-y divide-gray-200 overflow-hidden rounded-lg bg-custom_white shadow child:text-custom_black"
        >
            {#if currentQuestionIndex === -1}
                <h1>Sınav başlamak üzere</h1>
            {:else if currentQuestionIndex === exam.questions.length}
                <h1>Sınav bitti geçmiş olsun</h1>
            {:else}
                <div class="px-4 py-5 sm:px-6">
                    <div
                        class="flex justify-between items-center child:text-custom_black"
                    >
                        <div>{exam.title}</div>
                        <div>{exam.endsAt - exam.startsAt}</div>
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

                                console.log(studentAnswers);
                            }}
                            class="p-4 cursor-pointer hover:bg-slate-300 rounded-lg {studentAnswers.some(
                                (obj) =>
                                    obj.questionIndex ===
                                        currentQuestionIndex &&
                                    obj.optionIndex === index,
                            )
                                ? 'bg-amber-200'
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
                            on:click={() => {
                                --currentQuestionIndex;
                            }}>Önceki Soru</Button
                        >
                        <Button
                            on:click={() => {
                                ++currentQuestionIndex;
                            }}>Sonraki Soru</Button
                        >
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>
