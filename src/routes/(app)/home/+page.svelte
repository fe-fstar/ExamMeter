<script>
    import { onMount } from "svelte";
    import ExamCard from "../../../components/ExamCard.svelte";
    import Loading from "../../../components/Loading.svelte";
    import { backendUrl } from "../../../api/backend-url";

    let loading = false;
    let exams = [];
    let examDeleteMessage = "";

    function handleMessageSend(e) {
        examDeleteMessage = e.detail.message;
        setTimeout(() => {
            examDeleteMessage = "";
        }, 5000);
    }

    function handleExamDelete(e) {
        exams = exams.filter((exam) => exam.id !== e.detail.deletedExamId);
    }

    onMount(async () => {
        loading = true;
        try {
            let response = await fetch(`${backendUrl}/exam`, {
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.token,
                },
            });

            let parsed_response = await response.json();

            if (parsed_response.success) {
                exams = parsed_response.exams;
            }
        } catch (error) {
            console.log(error.message);
        }

        loading = false;
    });
</script>

<Loading {loading}>
    <div class="flex flex-col">
        <h2>Geçmiş Sınavlar</h2>
        <p></p>
        <div class="flex flex-wrap gap-4 justify-evenly">
            {#each exams as exam}
                <ExamCard
                    {exam}
                    on:examDelete={handleExamDelete}
                    on:messageSend={handleMessageSend}
                />
            {/each}
        </div>
    </div>
</Loading>
