<script>
  import { onMount } from "svelte";
  import {goto} from "$app/navigation";
  import "../../app.css";
  import { scale, fade } from "svelte/transition";
  import { backendUrl } from "../../api/backend-url";

  let mobileMenu = false;
  let profileDropdown = false;
  let role;
  let username = "";
  let user_email = "";

  let directory;
  onMount(async () => {
    directory = location.href.split("/")[2] + location.href.split("/")[3];

    let response = await fetch(`${backendUrl}/get_user_information`, {
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    });
    let parsed_response = await response.json();

    if (parsed_response.success) {
      username = parsed_response.user.username;
      user_email = parsed_response.user.email;
      role = parsed_response.user.role;
    }else{
      goto("/");
    }
  });

  const signOut = () => {
    localStorage.removeItem("token");
    goto("/");
  }
</script>

<div class="min-h-full">
  <div class="bg-gray-800 pb-32">
    <nav class="bg-gray-800">
      <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="border-b border-gray-700">
          <div class="flex h-16 items-center justify-between px-4 sm:px-0">
            <div class="flex items-center">
              <div class="flex-shrink-0 grid place-items-center">
                <div
                  class="mx-auto h-12 w-12 bg-no-repeat bg-center bg-[url('/logo.svg')]"
                />
              </div>
              <div class="hidden md:block">
                <div class="ml-10 flex items-baseline space-x-4">
                  <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
                  <a
                    on:click={() => {
                      directory = "home";
                    }}
                    href="/home"
                    class="{directory === 'home'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'} rounded-md px-3 py-2 text-sm font-medium"
                    aria-current="page">Geçmiş Sınavlar</a
                  >
                  {#if role === "teacher"}
                    <a
                      on:click={() => {
                        directory = "create-exam";
                      }}
                      href="/create-exam"
                      class="{directory === 'create-exam'
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'} rounded-md px-3 py-2 text-sm font-medium"
                      >Sınav Oluştur</a
                    >
                    <a
                      on:click={() => {
                        directory = "upload-exam-file";
                      }}
                      href="/upload-exam-file"
                      class="{directory === 'upload-exam-file'
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'} rounded-md px-3 py-2 text-sm font-medium"
                      >Analiz İçin Dosya Yükle</a
                    >
                  {/if}
                </div>
              </div>
            </div>
            <div class="hidden md:block">
              <div class="ml-4 flex items-center md:ml-6">
                <!-- Profile dropdown -->
                <div class="relative ml-3">
                  <div class="flex flex-row gap-2 items-center">
                    {user_email}
                    <button
                      type="button"
                      on:click={() => {
                        profileDropdown = !profileDropdown;
                      }}
                      class="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      id="user-menu-button"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <span class="absolute -inset-1.5"></span>
                      <span class="sr-only">Open user menu</span>
                      <img
                        class="h-8 w-8 rounded-full"
                        src="https://www.wintechpratama.com/images/profile.jpg"
                        alt=""
                      />
                    </button>
                  </div>

                  <!--
                      Dropdown menu, show/hide based on menu state.
  
                      Entering: "transition ease-out duration-100"
                        From: "transform opacity-0 scale-95"
                        To: "transform opacity-100 scale-100"
                      Leaving: "transition ease-in duration-75"
                        From: "transform opacity-100 scale-100"
                        To: "transform opacity-0 scale-95"
                    -->
                  {#if profileDropdown}
                    <div
                      transition:scale={{ duration: 150 }}
                      class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none space-y-1 px-2"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                      tabindex="-1"
                    >
                      <a
                        href="#"
                        class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >Profil</a>
                      <a
                        href="#"
                        on:click={signOut}
                        class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >Çıkış yap</a>
                    </div>
                  {/if}
                </div>
              </div>
            </div>
            <div class="-mr-2 flex md:hidden">
              <!-- Mobile menu button -->
              <button
                on:click={() => {
                  mobileMenu = !mobileMenu;
                }}
                type="button"
                class="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span class="absolute -inset-0.5"></span>
                <span class="sr-only">Open main menu</span>
                <!-- Menu open: "hidden", Menu closed: "block" -->
                <svg
                  class="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
                <!-- Menu open: "block", Menu closed: "hidden" -->
                <svg
                  class="hidden h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile menu, show/hide based on menu state. -->
      {#if mobileMenu}
        <div
          transition:fade={{ duration: 150 }}
          class="border-b border-gray-700 md:hidden"
          id="mobile-menu"
        >
          <div class="space-y-1 px-2 py-3 sm:px-3">
            <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
            <a
              on:click={() => {
                directory = "home";
              }}
              href="/home"
              class="{directory === 'home'
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'} rounded-md px-3 py-2 text-sm font-medium"
              aria-current="page">Geçmiş Sınavlar</a
            >
            {#if role === "teacher"}
            <a
              on:click={() => {
                directory = "create-exam";
              }}
              href="/create-exam"
              class="{directory === 'create-exam'
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'} rounded-md px-3 py-2 text-sm font-medium"
              >Sınav Oluştur</a
            >
            <a
              on:click={() => {
                directory = "upload-exam-file";
              }}
              href="/upload-exam-file"
              class="{directory === 'upload-exam-file'
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'} rounded-md px-3 py-2 text-sm font-medium"
              >Analiz İçin Dosya Yükle</a
            >
            {/if}
          </div>
          <div class="border-t border-gray-700 pb-3 pt-4">
            <div class="flex items-center px-5">
              <div class="flex-shrink-0">
                <img
                  class="h-10 w-10 rounded-full"
                  src="https://www.wintechpratama.com/images/profile.jpg"
                  alt=""
                />
              </div>
              <div class="ml-3">
                <div class="text-base font-medium leading-none text-white">
                  Kullanıcı
                </div>
                <div class="text-sm font-medium leading-none text-gray-400">
                  kullanici@mail.com
                </div>
              </div>
            </div>
            <div class="mt-3 space-y-1 px-2">
              <a
                href="#"
                class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                >Profil</a
              >
              <a
                href="#"
                class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                >Ayarlar</a
              >
              <a
                href="#"
                on:click={signOut}
                class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                >Çıkış yap</a
              >
            </div>
          </div>
        </div>
      {/if}
    </nav>
    <header class="py-10">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"></div>
    </header>
  </div>

  <main class="-mt-32">
    <div class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div
        class="rounded-lg bg-white px-5 py-6 shadow sm:px-6 descendant:text-custom_black grid place-items-center"
      >
        <slot />
      </div>
    </div>
  </main>
</div>
