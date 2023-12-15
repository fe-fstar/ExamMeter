<script>
    export let exam;
    const options = { year: "numeric", month: "long", day: "numeric" };
</script>

<div
    class="rounded-lg bg-gray-800 hover:shadow-gray-800 cursor-pointer shadow-gray-800 shadow-md duration-200 hover:shadow-lg descendant:text-custom_white flex flex-col p-4"
>
    <div class="basis-5/12 flex items-center justify-start">
        <h2>{exam.class}</h2>
    </div>
    <div class="basis-5/12 flex items-center justify-start">
        <h3>{exam.title}</h3>
    </div>
    <div class="basis-2/12 flex items-center justify-start">
        <h4>{exam.startsAt.toLocaleDateString("tr-TR", options)}</h4>
    </div>
</div>
