<script>
    export let exam;
    const options = { year: "numeric", month: "long", day: "numeric" };
</script>

<div
    class="rounded-lg bg-gradient-to-br from-slate-700 to-gray-800 hover:shadow-gray-800 cursor-pointer shadow-gray-800 shadow-md duration-200 hover:shadow-lg descendant:text-custom_white flex flex-col p-4"
>
    <div class="basis-5/12 flex items-center justify-start">
        <h3>{exam.class}</h3>
    </div>
    <div class="basis-5/12 flex items-center justify-start">
        <h4>{exam.title}</h4>
    </div>
    <div class="basis-2/12 flex items-center justify-start">
        <h5>{exam.startsAt.toLocaleDateString("tr-TR", options)}</h5>
    </div>
</div>
