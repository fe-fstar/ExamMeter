<script>
    export let exam;
    import { onMount } from "svelte";
    import ConfirmAction from "./ConfirmAction.svelte";

    const options = { year: "numeric", month: "long", day: "numeric" };
    let promptDeletion = false;

    function handleCancel() {
        promptDeletion = false;
    }

    function handleConfirm() {
        promptDeletion = false;
        console.log("### Item delete simulation ###");
    }

    let element;
    let clickable;

    onMount(() => {
        clickable = new Date(exam.endTime) < Date.now();
        if (clickable) {
            element.addEventListener("click", () => {
                location.href = `/stats/${exam.id}`;
            });
        }
    });
</script>

<ConfirmAction
    showDialog={promptDeletion}
    on:cancel={handleCancel}
    on:confirm={handleConfirm}
    on:click={() => {
        promptDeletion = false;
    }}
/>
<div
    bind:this={element}
    class="basis-1/4 rounded-lg bg-gradient-to-br from-slate-700 to-gray-800 {clickable
        ? 'cursor-pointer hover:shadow-gray-800 hover:shadow-lg'
        : 'opacity-[85%]'} shadow-gray-800 shadow-md duration-200 descendant:text-custom_white flex flex-col p-4"
>
    <div class="basis-4/12 flex items-center justify-start">
        <h3>{exam.className}</h3>
    </div>
    <div class="basis-4/12 flex items-center justify-start">
        <h4>{exam.title}</h4>
    </div>
    <div class="basis-1/12 flex items-center justify-between">
        <h5>{new Date(exam.startTime).toLocaleDateString("tr-TR", options)}</h5>
        {#if ("grade" in exam) && exam.grade}
            <h3>{exam.grade}</h3>
        {/if}
    </div>
    {#if new Date(exam.startTime) > Date.now() && !("grade" in exam)}
        <div class="basis-1/12 flex items-center justify-evenly child:rounded">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
                class="h-8 border bg-custom_white grid place-items-center cursor-pointer px-6 hover:opacity-70 transition shadow shadow-custom_white duration:200"
                on:click={(e) => {
                    e.stopPropagation();
                    location.href = `/edit-exam/${exam.id}`;
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="#000000"
                    class="w-6 h-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                    />
                </svg>
            </div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
                class="h-8 border bg-custom_white grid place-items-center cursor-pointer px-6 hover:opacity-70 transition shadow shadow-custom_white duration:200"
                on:click={(e) => {
                    e.stopPropagation();
                    promptDeletion = true;
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="#000000"
                    class="w-6 h-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                </svg>
            </div>
        </div>
    {/if}
</div>
