<script>
    import Button from "../../components/Button.svelte";
    import { backendUrl } from "../../api/backend-url";
    import isAuthenticated from "../../api/is-authenticated";
    import { browser } from "$app/environment";

    (async () => {
        if (browser) {
            let response = await fetch(`${backendUrl}/get_user_information`, {
                method: "GET",
                headers: {
                    token: localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            });

            let parsed_response = await response.json();

            if (!parsed_response.success) {
                window.location = "/login";
            } else if (parsed_response.role !== admin) {
                window.location = "/home";
            }
        }
    })();

    let loggingInMessage = "";
    let passwordVisible = false;
    let loading = false;
    let body = {
        username: "",
        email: "",
        password: "",
        role: ""
    };

    async function handleSubmit() {
        try {
            let response = await fetch(`${backendUrl}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            let parsedResponse = await response.json();

            loggingInMessage = parsedResponse.message;
        } catch (error) {
            console.error("Bir hata oluştu:", error.message);
        }

        loading = false;
    }

    const toggleVisible = () => {
        passwordVisible = !passwordVisible;
        document.querySelector("#password").type = passwordVisible
            ? "text"
            : "password";
    };
</script>

<div
    class="w-full h-screen overflow-y-hidden flex flex-col items-center justify-center"
>
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <div
                class="mx-auto h-20 w-auto bg-no-repeat bg-center bg-[url('/logo.svg')]"
            />
            <h2
                class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white"
            >
                Hesabınıza Giriş Yapın
            </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form method="post" class="space-y-6" on:submit|preventDefault={handleSubmit}>
                <div>
                    <label
                        for="username"
                        class="block text-sm font-medium leading-6 text-white"
                        >Tam isim</label
                    >
                    <div class="mt-2">
                        <input
                            bind:value={body.username}
                            id="username"
                            name="username"
                            type="text"
                            required
                            class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-custom_blue sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>
                <div>
                    <label
                        for="email"
                        class="block text-sm font-medium leading-6 text-white"
                        >E-posta adresi</label
                    >
                    <div class="mt-2">
                        <input
                            bind:value={body.email}
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
                            bind:value={body.password}
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
                            <span
                                class="z-10 bg-no-repeat bg-center bg-[url('/eye-off.svg')] cursor-pointer w-6 h-6 absolute right-2 bottom-1.5"
                                on:click={toggleVisible}
                            />
                        {:else}
                            <span
                                class="z-10 bg-no-repeat bg-center bg-[url('/eye.svg')] cursor-pointer w-6 h-6 absolute right-2 bottom-1.5"
                                on:click={toggleVisible}
                            />
                        {/if}
                    </div>
                </div>
                <div class="flex items-center justify-around">
                    <label for="role">Rol</label>
                    <select name="role" id="role" class="text-black" bind:value={body.role}>
                        <option value="student">Öğrenci</option>
                        <option value="teacher">Öğretmen</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div>
                    <Button type={"submit"}>Kaydet</Button>
                </div>
                <p>{loggingInMessage}</p>
            </form>
        </div>
    </div>
</div>
