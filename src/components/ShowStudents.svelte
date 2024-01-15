<script>
    import { fly, fade } from "svelte/transition";

    import Button from "./Button.svelte";

    export let students;
    let showWindow = false;

    function toggleShowWindow() {
        showWindow = !showWindow;
    }
</script>

<div class="descendant:text-white">
    <Button on:click={toggleShowWindow}>Öğrenci Sonuçlarını Göster</Button>
</div>
{#if showWindow}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="backdrop"
        in:fade={{ duration: 200 }}
        out:fade={{ delay: 200, duration: 200 }}
        on:click|self={toggleShowWindow}
    >
        <div
            class="overflow-x-auto window flex flex-col bg-slate-100 descendant:text-black rounded-lg"
            in:fly={{
                y: -10,
                delay: 200,
                duration: 200,
            }}
            out:fly={{
                y: -10,
                duration: 200,
            }}
        >
            <svg
                on:click={toggleShowWindow}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                data-slot="icon"
                class="w-6 h-6 close-svg"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                />
            </svg>

            <div>
                <h1>Öğrencilerin Sınav Sonuçları</h1>
            </div>
            <div class="my-4 studentContainer">
                <table class="w-full">
                    <thead
                        ><tr class="child:border child:border-slate-600/50 child:p-4 bg-black/5">
                            <th>Adı Soyadı</th>
                            <th>E-Postası</th>
                            <th>Sınav Puanı</th>
                            <th>Öğrenci Geribildirimi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each students as student}
                            <tr
                                class="child:border child:border-slate-600/50 child:p-4"
                                >
                                <td>{student.username}</td>
                                <td>{student.email}</td>
                                <td>{student.grade}</td>
                                <td>{student.additional_note ? student.additional_note : "-"}</td>
                            </tr>
                        {:else}
                            <tr>Öğrenci bulunamadı.</tr>
                        {/each}
                        
                    </tbody>
                </table>
            </div>
        </div>
    </div>
{/if}

<style>
    .backdrop {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 998;
        background: rgba(0, 0, 0, 0.75);
        cursor: pointer;
    }
    .window {
        padding: 10px;
        border: 1px solid #e9e9e9;
        margin: 0 auto;
        margin-top: 5%;
        z-index: 999;
        text-align: center;
        width: 60%;
        max-width: 900px;
        cursor: default;
        position: relative;
    }

    .studentContainer {
        height: calc(60vh - 50px);
        overflow-y: scroll;
    }

    .close-svg {
        position: absolute;
        top: 1rem;
        right: 1rem;
        cursor: pointer;
    }
</style>
