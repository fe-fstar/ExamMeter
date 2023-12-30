<script>
    import { onMount } from "svelte";
    import ExamCard from "../../../components/ExamCard.svelte";
    import Loading from "../../../components/Loading.svelte";
    import { backendUrl } from "../../../api/backend-url";

    let loading = false;
    let exams = [];

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
        console.log(exams);
    });
</script>

<Loading {loading}>
    <div class="flex flex-col">
        <h1>Geçmiş Sınavlar</h1>
        <div class="flex flex-wrap gap-4 justify-evenly">
            {#each exams as exam}
                <ExamCard {exam} />
            {/each}
        </div>
    </div>
</Loading>
