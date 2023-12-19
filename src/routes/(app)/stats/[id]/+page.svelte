<script>
    let meanScore = 65;
    let standardDeviation = 7.2;
    let feedbackOneScore = 6.6;
    let feedbackTwoScore = 3.1;
    let feedbackThreeScore = 8.3;
</script>

<div class="flex flex-col descendant:flex-wrap w-full divide-y">
    <div class="flex items-center child:basis-1/2">
        <div>
            <div class="flex justify-evenly items-center child:flex child:flex-col child:items-center">
                <div>
                    <h2>Ortalama Not:</h2>
                    <h2>{meanScore}</h2>
                </div>
                <div>
                    <h2>Standart Sapma:</h2>
                    <h2>{standardDeviation}</h2>
                </div>
            </div>
        </div>
        <div>
            <div class="flex flex-col child:flex child:justify-start child:items-center">
                <div>
                    <h3 class="basis-3/4">Öğrenci geri bildiriminden gelen ortalama sınav zorluğu</h3>
                    <h3 class="basis-1/4">{feedbackOneScore} / 10</h3>
                </div>
                <div>
                    <h3 class="basis-3/4">Öğrenci geri bildiriminden gelen ortalama sınav konu alaka derecesi</h3>
                    <h3 class="basis-1/4">{feedbackTwoScore} / 10</h3>
                </div>
                <div>
                    <h3 class="basis-3/4">Öğrenci geri bildiriminden gelen ortalama sınav soru metodu alaka derecesi</h3>
                    <h3 class="basis-1/4">{feedbackThreeScore} / 10</h3>
                </div>
            </div>
        </div>
    </div>
    <div class="flex items-center justify-evenly child:basis-1/2">
        <h1>Buraya grafikler gelecek</h1>
        <h1>Buraya grafikler gelecek</h1>
    </div>
    <div class="grid place-items-center">
        <h1>Buraya tablo gelecek</h1>
    </div>
</div>