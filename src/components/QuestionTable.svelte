<script>
    import OptionTable from "./OptionTable.svelte";

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
                    <td>{index + 1}</td>
                    <td><OptionTable data={{ index: index, ...question }} /></td
                    >
                    <td>{question.numberOfCorrectAnswers}</td>
                    <td>{question.numberOfWrongAnswers}</td>
                    <td
                        >{Math.round(question.numberOfCorrectAnswers /
                            (question.numberOfCorrectAnswers +
                                question.numberOfEmptyAnswers +
                                question.numberOfWrongAnswers) * 1000) / 1000}</td
                    >
                    <td>{question.difficulty}</td>
                    <td>{question.discriminationRatio}</td>
                    <td>{question.discriminationStatus}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
