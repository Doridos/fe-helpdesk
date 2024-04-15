<script>
    import Header from "../lib/Header.svelte";
    import {Button, Input, Label} from "flowbite-svelte";
    import {navigate} from "svelte-routing";
    let password
    let username
    let error = false
    function login() {
        event.preventDefault();
        fetch(import.meta.env.VITE_BE_URL + "/authentication", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            }),
        })
            .then(response => {
                if (!response.ok) {
                    error = true;
                }
                else {
                    error = false;
                    return response.json();
                }

            })
            .then(data => {
                console.log(data);
                if (data.token) {
                    localStorage.setItem("jwt", data.token);
                    navigate("/requests");
                } else {
                    error = true;
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }
</script>

<div>
    <Header ></Header>
    <div class="page-container">
        <div class="form-container rounded-lg grid p-8">
            <form on:submit={login}>
            <h1 class="text-xl text-center font-semibold mb-5">Přihlášení</h1>
            <div class="mb-6">
                <Label for="username" class="mb-2">Uživatelské jméno</Label>
                <Input bind:value={username} type="text" id="username" class="focus:border-blue-700 focus:ring-blue-700" placeholder="dvorak" required />
            </div>
            <div class="mb-6">
                <Label for="password" class="mb-2">Heslo</Label>
                <Input bind:value={password} type="password" id="password" class="focus:border-blue-700 focus:ring-blue-700" placeholder="•••••••••" required />
            </div>

            <div class="text-center">
                <Button class="bg-[#2362a2] hover:bg-[#254e80] focus-within:ring-opacity-0" type="submit">Přihlásit se</Button>
            </div>
                {#if error}
                    <p class="mt-1 text-red-600 text-center">Špatné uživatelské jméno nebo heslo</p>
                {/if}
            </form>
        </div>
    </div>
</div>

<style>
    .page-container{
        display: flex;
        justify-content: center;
        height: calc(100vh - 73px);
        overflow: hidden;
        background-color: #F3F3F3;

    }
    .form-container {
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        margin-top: 180px;
        background-color: white;
        max-width: 33%;
        width: 440px;
        height: 350px;
    }
</style>
