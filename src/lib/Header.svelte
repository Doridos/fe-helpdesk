<script>
    import {Alert, Banner, Button} from "flowbite-svelte";
    import {
        ArrowLeftToBracketOutline, ArrowRightOutline, ChartPieOutline,
        CogSolid,
        EnvelopeSolid,
        HomeOutline,
        HomeSolid, InfoCircleSolid, SalePercentSolid,
        UserSolid
    } from "flowbite-svelte-icons";
    import {navigate} from "svelte-routing";
    import {parseJwt} from "./utils.js";
    import {onMount} from "svelte";
    let jwt = localStorage.getItem("jwt")
    let parsedJwt = parseJwt(jwt)

    function logout(){
        localStorage.removeItem("jwt")
        navigate("/")
    }
</script>


<div class="default-blue-bg text-white p-4">

    <div class="flex justify-between items-center">

        <div class="flex-1"></div>

        <div  class="cursor-pointer flex-1 text-center">
            <h1 on:click={() => navigate("/requests")} class="text-xl">Helpdesk</h1>
        </div>

        <div class="flex-1 flex justify-end space-x-2">
            {#if localStorage.getItem("jwt") !== null}
                {#if location.pathname === "/requests"}
                    {#if parseJwt(localStorage.getItem("jwt")).role === "ADMIN"}
                <Button size="xs" on:click={() => navigate("/settings")} class="bg-transparent border-white border hover:bg-[#254e80] focus-within:ring-opacity-0"><CogSolid size="sm" /></Button>
                    {/if}
                    {#if (parseJwt(localStorage.getItem("jwt")).role === "ADMIN" || parseJwt(localStorage.getItem("jwt")).role === "MANAGER")}
                        <Button size="xs" on:click={() => navigate("/dashboard")} class="bg-transparent border-white border hover:bg-[#254e80] focus-within:ring-opacity-0"><ChartPieOutline size="sm" /></Button>
                    {/if}
                    {:else}
                <Button size="xs"  on:click={() => navigate("/requests")} class="bg-transparent border-white border hover:bg-[#254e80] focus-within:ring-opacity-0"><HomeOutline size="sm" /></Button>
                {/if}
                <Button size="sm" class="bg-transparent border-white border hover:bg-transparent focus-within:ring-opacity-0"><UserSolid class=mr-1 size="sm" />{parsedJwt.forename + " " + parsedJwt.surname}</Button>
            <Button on:click={logout} size="sm" class="bg-transparent border-white border hover:bg-[#254e80] focus-within:ring-opacity-0"><ArrowLeftToBracketOutline class=mr-2 size="sm" />Odhlásit se</Button>
            {/if}
        </div>

    </div>
    <Banner id="bottom-banner" position="absolute" bannerType="bottom">
        <p class="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
    <span class="inline-flex p-1 me-3 bg-gray-200 rounded-full dark:bg-gray-600">
      <InfoCircleSolid class="w-4 h-4 text-gray-500 dark:text-gray-400" />
    </span>
    <span>
        Aktuálně je systém ve stavu testování, pokud narazíte na chybu, informujte nás prosím na následujícím <a href="mailto:babyc@ulz.cz" class="text-blue-500 dark:text-blue-400">e-mailu</a>.
    </span>
        </p>
    </Banner>
</div>


<!--<div class="w-full text-center text-white h-[60px] line-h default-blue-bg text-xl">-->
<!--    Helpdesk-->
<!--    <Button size="xs"><EnvelopeSolid class="w-3 h-3 me-2" />Extra small</Button>-->
<!--</div>-->


<style>
    .line-h{
        line-height: 3.2;
    }
</style>
