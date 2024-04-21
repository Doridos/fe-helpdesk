<script>
    import Header from "../lib/Header.svelte";
    import {
        Alert,
        Button,
        ButtonGroup,
        Helper,
        Input,
        InputAddon,
        Label,
        Popover,
        Toast,
        Tooltip
    } from "flowbite-svelte";
    import {navigate} from "svelte-routing";
    import {CloseCircleSolid, EyeOutline, EyeSlashOutline, InfoCircleSolid} from "flowbite-svelte-icons";
    let password
    let username
    let error = false
    let showPassword = false
    let usernameWrong = false
    let passwordEmpty = false
    let passwordStar = false

    function validateForm() {
        // Regular expression for username validation
        const usernameRegex = /^[A-Za-z0-9]+$/;

        // Check if username is empty or doesn't match the regular expression
        if (!username || !usernameRegex.test(username)) {

            usernameWrong = true;
            if (!password) {
                passwordEmpty = false
                passwordStar = true
            }
            else {
                passwordEmpty = false
                passwordStar = false
            }
            return false;
        }
        else {
            usernameWrong = false;
        }

        // Check if password is empty
        if (!password) {
            passwordEmpty = true
            passwordStar = true
            return false;
        }
        else {
            passwordEmpty = false
            passwordStar = false
        }
        // If all validations pass, return true
        return true;
    }

    function login() {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

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
    function handleEnterKey(event) {
        if (event.key === 'Enter') {
            login();
        }
    }
</script>
<svelte:window on:keydown={handleEnterKey} />

<div>
    <Header ></Header>


    <div class="page-container">
        {#if usernameWrong}
            <Toast position="top-left" color="red">
                <svelte:fragment slot="icon">
                    <CloseCircleSolid class="w-5 h-5" />
                    <span class="sr-only">Error icon</span>
                </svelte:fragment>
                Uživatelské jméno musí být vyplněné a může obsahovat pouze písmena a číslice.
            </Toast>
        {/if}
        {#if passwordEmpty}
            <Toast position="top-left" color="red">
                <svelte:fragment slot="icon">
                    <CloseCircleSolid class="w-5 h-5" />
                    <span class="sr-only">Error icon</span>
                </svelte:fragment>
                Heslo musí být vyplněno.
            </Toast>
        {/if}
        {#if error}
            <Toast position="top-left" color="red">
                <svelte:fragment slot="icon">
                    <CloseCircleSolid class="w-5 h-5" />
                    <span class="sr-only">Error icon</span>
                </svelte:fragment>
                Špatné uživatelské jméno nebo heslo.
            </Toast>
        {/if}
        <div class="form-container rounded-lg grid p-8">
            <form on:submit={login}>
            <h1 class="text-xl text-center font-semibold mb-5">Přihlášení</h1>
            <div class="mb-6">
                <Label for="username" class="mb-2">Uživatelské jméno<span class:error-color={usernameWrong}>*</span>
                </Label>
                <Input bind:value={username} type="text" id="username" class="focus:border-blue-700 focus:ring-blue-700" placeholder="dvorak" />
            </div>
            <div class="mb-6">
                <Label for="password" class="mb-2">Heslo<span class:error-color={passwordStar}>*</span>
                </Label>
                <Input id="password" bind:value={password} type={showPassword ? 'text' : 'password'} class="focus:border-blue-700 focus:ring-blue-700" placeholder="•••••••••" size="md">
                    <button type="button" slot="right" on:click={() => (showPassword = !showPassword)} class="pointer-events-auto">
                        {#if showPassword}
                            <EyeOutline class="w-6 h-6" />
                        {:else}
                            <EyeSlashOutline class="w-6 h-6" />
                        {/if}
                    </button>
                </Input>
                <Helper class="text-sm mt-1">
                    Přihlašujte se pomocí údajů, které zadávate do počítače.
                </Helper>

            </div>

            <div class="text-center">

                <Button class="bg-[#2362a2] hover:bg-[#254e80] focus-within:ring-opacity-0" type="submit">Přihlásit se</Button>
            </div>
            </form>
        </div>
    </div>
</div>

<style>
    .error-color {
        color: red;
    }
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
        height: fit-content;
    }

</style>
