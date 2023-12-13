<script>
    import Button from "../components/Button.svelte";

    let loggingIn = false;
    let loggingInMessage = "";
    let passwordVisible = false;

    const toggleVisible = () => {
        passwordVisible = !passwordVisible;
        document.querySelector("#password").type = passwordVisible ? "text" : "password";
    };
</script>

<div
    class="w-full h-screen overflow-y-hidden flex flex-col items-center justify-center"
>
    {#if !loggingIn}
        <h1>ExamMeter</h1>
        <Button
            on:click={() => {
                loggingIn = !loggingIn;
            }}>Giriş Yap</Button
        >
    {:else}
        <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <div class="mx-auto h-20 w-auto bg-no-repeat bg-center bg-[url('/logo.svg')]"/>
                <h2
                    class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white"
                >
                    Hesabınıza Giriş Yapın
                </h2>
            </div>

            <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form class="space-y-6">
                    <div>
                        <label
                            for="email"
                            class="block text-sm font-medium leading-6 text-white"
                            >E-posta adresi</label
                        >
                        <div class="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autocomplete="email"
                                required
                                class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-custom_blue sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center justify-between">
                            <label
                                for="password"
                                class="block text-sm font-medium leading-6 text-white"
                                >Şifre</label
                            >
                        </div>
                        <div class="mt-2 relative">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autocomplete="current-password"
                                required
                                class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-custom_blue sm:text-sm sm:leading-6"
                            />
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            {#if passwordVisible}
                                <span class="z-10 bg-no-repeat bg-center bg-[url('/eye-off.svg')] cursor-pointer w-6 h-6 absolute right-2 bottom-1.5" on:click={toggleVisible} />
                            {:else}
                                <span class="z-10 bg-no-repeat bg-center bg-[url('/eye.svg')] cursor-pointer w-6 h-6 absolute right-2 bottom-1.5" on:click={toggleVisible} />
                            {/if}
                        </div>
                    </div>
                    <div>
                        <Button type={"submit"}>Giriş Yap</Button>
                    </div>
                </form>
            </div>
        </div>
        <!-- <form>
            <div class="my-6 flex flex-col items-start justify-center">
                <label for="email">E-posta</label>
                <input type="text" name="email" />
            </div>
            <div class="my-6 flex flex-col items-start justify-center">
                <label for="password">Şifre</label>
                <input type="password" name="password" />
            </div>
            <Button>Giriş Yap</Button>
        </form> -->
    {/if}
</div>
