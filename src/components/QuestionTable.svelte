<script>
    import OptionTable from "./OptionTable.svelte";
    import ShowQuestion from "./ShowQuestion.svelte";

    export let questions;
</script>

<div class="overflow-x-auto rounded-lg">
    <table>
        <thead
            ><tr
                class="bg-slate-300 child:p-4 child:border child:border-slate-600 child:border child:border-slate-600/25"
                ><th>Soru</th>
                <th>Cevap Dağılımı</th>
                <th>Doğru Yanıt Sayısı</th>
                <th>Yanlış Yanıt Sayısı</th>
                <th>Doğru Cevap Oranı</th>
                <th>Güçlük Durumu</th>
                <th>Ayırt Edicilik Oranı</th>
                <th>Ayırt Edicilik Durumu</th>
            </tr></thead
        >
        <tbody>
            {#each questions as question, index}
                <tr
                    class="text-center align-middle child:p-4 bg-slate-200 child:border child:border-slate-600/25 hover:bg-slate-200/50"
                >
                    <td>{index + 1} <ShowQuestion question={question}></ShowQuestion></td>
                    <td><OptionTable data={{ index: index, ...question, unansweredCount: question.unanswered_count, unansweredRatio: Math.round(question.unanswered_count / (question.unanswered_count + question.correct_count + question.incorrect_count) * 100) / 100 }} /></td
                    >
                    <td>{question.correct_count}</td>
                    <td>{question.incorrect_count}</td>
                    <td
                        >{question.correct_ratio}</td
                    >
                    <td>{question.difficultyMessage}</td>
                    <td>{Math.round(question.discriminationRatio * 100) / 100}</td>
                    <td>{question.discriminationStatus}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
