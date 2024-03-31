<script>
    import {Button} from "flowbite-svelte";
    import {ArrowLeftToBracketOutline, CogSolid, EnvelopeSolid, UserSolid} from "flowbite-svelte-icons";
    import {navigate} from "svelte-routing";


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
            <Button size="xs" on:click={() => navigate("/settings")} class="bg-transparent border-white border hover:bg-[#254e80] focus-within:ring-opacity-0"><CogSolid size="sm" /></Button>
            <Button size="sm" class="bg-transparent border-white border hover:bg-[#254e80] focus-within:ring-opacity-0"><UserSolid class=mr-1 size="sm" />Jan Hradecký</Button>
            <Button on:click={logout} size="sm" class="bg-transparent border-white border hover:bg-[#254e80] focus-within:ring-opacity-0"><ArrowLeftToBracketOutline class=mr-2 size="sm" />Odhlásit se</Button>
            {/if}
        </div>

    </div>
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
