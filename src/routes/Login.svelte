<script>
    import Header from "../lib/Header.svelte";
    import {Button, Input, Label} from "flowbite-svelte";
</script>

<div>
    <Header ></Header>
    <div class="page-container">
        <div class="form-container rounded-lg grid p-8">
            <form>
            <h1 class="text-xl text-center font-semibold mb-5">Přihlášení</h1>
            <div class="mb-6">
                <Label for="email" class="mb-2">Uživatelské jméno</Label>
                <Input type="email" id="email" class="focus:border-blue-700 focus:ring-blue-700" placeholder="jdoe" required />
            </div>
            <div class="mb-6">
                <Label for="password" class="mb-2">Heslo</Label>
                <Input type="password" id="password" class="focus:border-blue-700 focus:ring-blue-700" placeholder="•••••••••" required />
            </div>
            <div class="text-center">
                <Button class="bg-[#2362a2] hover:bg-[#254e80]" type="submit">Přihlásit se</Button>
            </div>
            </form>
        </div>
    </div>
</div>

<style>
    .page-container{
        display: flex;
        justify-content: center;
        height: 100vh;
        background-color: #F3F3F3;

    }
    .form-container {
        margin-top: 180px;
        background-color: white;
        max-width: 33%;
        width: 440px;
        height: 34%;
    }
</style>
