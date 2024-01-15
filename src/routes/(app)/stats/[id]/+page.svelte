<script>
    import { onMount, tick } from "svelte";
    import QuestionTable from "../../../../components/QuestionTable.svelte";
    import Loading from "../../../../components/Loading.svelte";
    import { backendUrl } from "../../../../api/backend-url";
    import {
        Chart,
        Title,
        BarElement,
        BarController,
        CategoryScale,
        LinearScale,
    } from "chart.js";
    import ShowStudents from "../../../../components/ShowStudents.svelte";

    export let data;
    let loading = true;
    let meanScore;
    let standardDeviation;
    let meanDifficultyScore;
    let meanMethodRelevanceScore;
    let meanTopicRelevanceScore;
    let difficultyScoreList;
    let methodRelevanceScoreList;
    let topicRelevanceScoreList;

    let questions = [];
    let students = [];
    let selectedChart = -1;

    let chart4;
    let chart3;
    let chart2;
    let chart1;
    let ctx4;
    let ctx3;
    let ctx2;
    let ctx;

    onMount(async () => {
        loading = true;
        let grades;
        try {
            let id = data.id;

            let response = await fetch(`${backendUrl}/stats`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.token,
                },
                body: JSON.stringify({ examId: id }),
            });

            let parsed_response = await response.json();

            difficultyScoreList = parsed_response.difficultyScoreList;
            methodRelevanceScoreList = parsed_response.methodRelevanceScoreList;
            topicRelevanceScoreList = parsed_response.topicRelevanceScoreList;

            meanDifficultyScore =
                Math.round(parsed_response.meanDifficultyScore * 100) / 100;
            meanMethodRelevanceScore =
                Math.round(parsed_response.meanMethodRelevanceScore * 100) /
                100;
            meanTopicRelevanceScore =
                Math.round(parsed_response.meanTopicRelevanceScore * 100) / 100;
            meanScore = Math.round(parsed_response.mean * 100) / 100;
            standardDeviation =
                Math.round(parsed_response.std_deviation * 100) / 100;
            questions = parsed_response.questions;
            grades = parsed_response.gradesList;
            students = parsed_response.students;
            console.log(students);
        } catch (error) {
            console.log(error.message);
        }

        loading = false;

        // ##########################################
        // Initialize an array to store the count for each interval
        const intervalCounts = Array.from({ length: 10 }, () => 0);

        // Populate the counts based on the intervals
        grades.forEach((value) => {
            const intervalIndex = Math.floor(value / 10);
            intervalCounts[intervalIndex]++;
        });

        await tick();
        // Create the histogram using Chart.js
        if (chart1) {
            ctx = chart1.getContext("2d");
        }
        await tick();

        Chart.register(
            Title,
            BarElement,
            BarController,
            CategoryScale,
            LinearScale,
        );

        const histogramChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: Array.from(
                    { length: 10 },
                    (_, index) =>
                        `${
                            index != 9
                                ? index * 10 + "-" + ((index + 1) * 10 - 1)
                                : index * 10 + "-" + (index + 1) * 10
                        }`,
                ),
                datasets: [
                    {
                        label: "Frequency",
                        data: intervalCounts,
                        backgroundColor: "rgba(75, 192, 192, 0.7)", // Adjust the color as needed
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Öğrenci sayısı",
                        },
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Notlar",
                        },
                        ticks: {
                            stepSize: 1,
                        },
                    },
                },
            },
        });

        // ##########################################
    });

    $: if (selectedChart === 0) {
        if (chart2) {
            ctx2 = chart2.getContext("2d");
            const intervalCounts = Array.from({ length: 10 }, () => 0);
            difficultyScoreList.forEach((value) => {
                intervalCounts[value - 1]++;
            });
            const histogramChart = new Chart(ctx2, {
                type: "bar",
                data: {
                    labels: Array.from(
                        { length: 10 },
                        (_, index) => `${index + 1}`,
                    ),
                    datasets: [
                        {
                            label: "Frequency",
                            data: intervalCounts,
                            backgroundColor: "rgba(156, 184, 118, 0.7)", // Adjust the color as needed
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Öğrenci sayısı",
                            },
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: "Notlar",
                            },
                            ticks: {
                                stepSize: 1,
                            },
                        },
                    },
                },
            });
        }
    } else if (selectedChart === 1) {
        if (chart3) {
            ctx3 = chart3.getContext("2d");
            const intervalCounts = Array.from({ length: 10 }, () => 0);
            topicRelevanceScoreList.forEach((value) => {
                intervalCounts[value - 1]++;
            });
            const histogramChart = new Chart(ctx3, {
                type: "bar",
                data: {
                    labels: Array.from(
                        { length: 10 },
                        (_, index) => `${index + 1}`,
                    ),
                    datasets: [
                        {
                            label: "Frequency",
                            data: intervalCounts,
                            backgroundColor: "rgba(214, 0, 27, 0.7)", // Adjust the color as needed
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Öğrenci sayısı",
                            },
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: "Notlar",
                            },
                            ticks: {
                                stepSize: 1,
                            },
                        },
                    },
                },
            });
        }
    } else if (selectedChart === 2) {
        if (chart4) {
            const intervalCounts = Array.from({ length: 10 }, () => 0);
            methodRelevanceScoreList.forEach((value) => {
                intervalCounts[value - 1]++;
            });
            ctx4 = chart4.getContext("2d");
            const histogramChart = new Chart(ctx4, {
                type: "bar",
                data: {
                    labels: Array.from(
                        { length: 10 },
                        (_, index) => `${index + 1}`,
                    ),
                    datasets: [
                        {
                            label: "Frequency",
                            data: intervalCounts,
                            backgroundColor: "rgba(236, 242, 20, 0.7)", // Adjust the color as needed
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Öğrenci sayısı",
                            },
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: "Notlar",
                            },
                            ticks: {
                                stepSize: 1,
                            },
                        },
                    },
                },
            });
        }
    }
</script>

<Loading {loading}>
    <div class="flex flex-col descendant:flex-wrap w-full divide-y">
        <div class="flex items-center child:basis-1/2">
            <div>
                <div
                    class="flex justify-evenly items-center child:flex child:flex-col child:items-center"
                >
                    <div>
                        <h2>Ortalama Not:</h2>
                        <h2>{meanScore}</h2>
                    </div>
                    <div>
                        <h2>Standart Sapma:</h2>
                        <h2>{standardDeviation}</h2>
                    </div>
                </div>
                <div class="flex justify-center">
                    <ShowStudents {students}></ShowStudents>
                </div>
            </div>
            <div>
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div
                    class="flex flex-col child:flex child:justify-start child:items-center child:p-4 child:rounded-md child:border-2 child:border-lg child:my-2 child:cursor-pointer hover:child:bg-slate-300"
                >
                    <div
                        on:click={() => {
                            selectedChart = 0;
                        }}
                    >
                        <h3 class="basis-3/4">
                            Öğrenci geri bildiriminden gelen ortalama sınav
                            zorluğu
                        </h3>
                        <h3 class="basis-1/4">{meanDifficultyScore} / 10</h3>
                    </div>
                    <div
                        on:click={() => {
                            selectedChart = 1;
                        }}
                    >
                        <h3 class="basis-3/4">
                            Öğrenci geri bildiriminden gelen ortalama sınav konu
                            alaka derecesi
                        </h3>
                        <h3 class="basis-1/4">
                            {meanTopicRelevanceScore} / 10
                        </h3>
                    </div>
                    <div
                        on:click={() => {
                            selectedChart = 2;
                        }}
                    >
                        <h3 class="basis-3/4">
                            Öğrenci geri bildiriminden gelen ortalama sınav soru
                            metodu alaka derecesi
                        </h3>
                        <h3 class="basis-1/4">
                            {meanMethodRelevanceScore} / 10
                        </h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-wrap items-center justify-evenly child:basis-1/2">
            <canvas id="chart1" bind:this={chart1}></canvas>
            {#if selectedChart === -1}
                <h2>
                    Grafiği görüntülemek için bir öğrenci geri bildirimi seçin.
                </h2>
            {:else if selectedChart === 0}
                <canvas id="chart2" bind:this={chart2}></canvas>
            {:else if selectedChart === 1}
                <canvas id="chart3" bind:this={chart3}></canvas>
            {:else if selectedChart === 2}
                <canvas id="chart4" bind:this={chart4}></canvas>
            {/if}
        </div>
        <div class="grid place-items-center">
            <QuestionTable {questions} />
        </div>
    </div>
</Loading>
