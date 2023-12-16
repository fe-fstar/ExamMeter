<script>
    import ExamCard from "../../../components/ExamCard.svelte";

    let role = "teacher";
    let exams = [
        {
            id: "regEx-Kolta",
            title: "ANN Midterm",
            class: "Artificial Neural Networks CSE-1234",
            description:
                "Add the exam sheet to your report XDDDDDDDDDDDDDDDDDDDDDDD",
            startsAt: new Date(2023, 11, 13, 17, 51, 30),
        },
        {
            id: "regEx-Kolta",
            title: "ANN Midterm",
            class: "Artificial Neural Networks CSE-1234",
            description:
                "Add the exam sheet to your report XDDDDDDDDDDDDDDDDDDDDDDD",
            startsAt: new Date(2023, 11, 13, 17, 51, 30),
        },
        {
            id: "regEx-Kolta",
            title: "ANN Midterm",
            class: "Artificial Neural Networks CSE-1234",
            description:
                "Add the exam sheet to your report XDDDDDDDDDDDDDDDDDDDDDDD",
            startsAt: new Date(2023, 11, 13, 17, 51, 30),
        },
        {
            id: "regEx-Kolta",
            title: "ANN Midterm",
            class: "Artificial Neural Networks CSE-1234",
            description:
                "Add the exam sheet to your report XDDDDDDDDDDDDDDDDDDDDDDD",
            startsAt: new Date(2023, 11, 13, 17, 51, 30),
        },
        {
            id: "regEx-Kolta",
            title: "ANN Midterm",
            class: "Artificial Neural Networks CSE-1234",
            description:
                "Add the exam sheet to your report XDDDDDDDDDDDDDDDDDDDDDDD",
            startsAt: new Date(2023, 11, 13, 17, 51, 30),
            endsAt: new Date(2023, 11, 13, 17, 52, 0),
        },
        {
            id: "regEx-Kolta",
            title: "ANN Midterm",
            class: "Artificial Neural Networks CSE-1234",
            description:
                "Add the exam sheet to your report XDDDDDDDDDDDDDDDDDDDDDDD",
            startsAt: new Date(2023, 11, 13, 17, 51, 30),
        },
    ];
</script>

{#if role === "student"}
    <div class="flex flex-wrap gap-4 justify-evenly">
        <h1 class="basis-full">Geçmiş Sınavlar</h1>
        {#each exams as exam}
            <ExamCard {exam} />
        {/each}
    </div>
{:else if role === "teacher"}
    <div class="flex flex-wrap gap-4 justify-evenly">
        <h1 class="basis-full">Geçmiş Sınavlar</h1>
        {#each exams as exam}
            <ExamCard {exam} />
        {/each}
    </div>
{/if}
