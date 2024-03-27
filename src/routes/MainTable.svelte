<script>
import Header from "../lib/Header.svelte";
import {
    Button, Input, Label,
    Modal,
    Search, Select,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell, Textarea
} from "flowbite-svelte";
import {
    ArrowDownOutline,
    ArrowLeftToBracketOutline, ChevronDownOutline,
    CirclePlusOutline, CirclePlusSolid,
    SearchOutline,
    UserSolid
} from "flowbite-svelte-icons";

let requestModal = false;

let searchTerm = ''
const requests = [
    {
        name: 'Výměna oznámení',
        description: "Prosím o výměnu oznámení",
        state: "Vyřešen",
        category: "Intranet",
        priority: "Nízká",
        dateOfAnnouncement: "15.01.2024",
        assignedTo: "Jan Novák",
        dateOfCompletion: "12.02.2024"
    },
    {
        name: "Problém s Teamsy",
        description: "Nejde zapnout teams",
        state: "Nový",
        category: "Software",
        priority: "Nízká",
        dateOfAnnouncement: "15.01.2024",
        assignedTo: "Jan Novák",
        dateOfCompletion: "12.02.2024"
    },
    {
        name: "Nabíječka na notebook",
        description: "Nabíječka nenabíjí",
        state: "Neplatný",
        category: "Majetek",
        priority: "Vysoká",
        dateOfAnnouncement: "15.01.2024",
        assignedTo: "Jan Novák",
        dateOfCompletion: "12.02.2024"
    },
    {
        name: "Rozbitý monitor",
        description: "Nefunguje monitor",
        state: "V řešení",
        category: "Hardware",
        priority: "Kritická",
        dateOfAnnouncement: "15.01.2024",
        assignedTo: "Jan Novák",
        dateOfCompletion: "12.02.2024"
    },
    {
        name: "Přístup do emailu",
        description: "Prosím o přístup",
        state: "Neplatný",
        category: "Intranet",
        priority: "Kritická",
        dateOfAnnouncement: "15.01.2024",
        assignedTo: "Jan Novák",
        dateOfCompletion: "12.02.2024"
    },
    {
        name: "Rozbitý token",
        description: "Nefunguje mi token",
        state: "Neplatný",
        category: "Jiné",
        priority: "Nízká",
        dateOfAnnouncement: "15.01.2024",
        assignedTo: "Jan Novák",
        dateOfCompletion: "12.02.2024"
    },
];
$: filteredItems = requests.filter((request) => request.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);

function stateClass(state) {
    switch (state) {
        case 'Nový': return 'bg-yellow-100 w-fit p-1 text-yellow-600 rounded';
        case 'V řešení': return 'bg-purple-100 w-fit p-1 text-purple-800 rounded';
        case 'Vyřešen':    return 'bg-green-100 w-fit p-1 text-green-800 rounded';
        case 'Neplatný':    return 'bg-red-100 w-fit p-1 text-red-800 rounded';
        default:        return '';
    }
}

function priorityClass(state) {
    switch (state) {
        case 'Nízká': return 'bg-green-100 w-fit p-1 text-green-800 rounded';
        case 'Střední': return 'bg-yellow-300 w-fit p-1 text-yellow-800 rounded';
        case 'Vysoká':    return 'bg-red-200 w-fit p-1 text-red-800 rounded';
        case 'Kritická':    return 'bg-red-600 w-fit p-1 text-white rounded';
        default:        return '';
    }
}

function categoryClass(state) {
    switch (state) {
        case 'Intranet': return 'bg-red-800 w-fit p-1 text-white rounded';
        case 'Software': return 'bg-blue-700 w-fit p-1 text-white rounded';
        case 'Majetek':    return 'bg-green-200 w-fit p-1 text-gray-900 rounded';
        case 'Hardware':    return 'bg-yellow-800 w-fit p-1 text-white rounded';
        case 'Oprávnění':    return 'bg-purple-800 w-fit p-1 text-purple-100 rounded';
        case 'Jiné':    return 'bg-pink-100 w-fit p-1 text-pink-800 rounded';
        default:        return '';
    }
}
let selectedCategory
let categories = [
    { value: 'us', name: 'Intranet' },
    { value: 'ca', name: 'Software' },
    { value: 'fr', name: 'Majetek' },
    { value: 'fr', name: 'Hardware' },
    { value: 'fr', name: 'Oprávnění' },
    { value: 'fr', name: 'Jiné' }
];

let selectedPriority
let priority = [
    { value: 'us', name: 'Nízká' },
    { value: 'ca', name: 'Střední' },
    { value: 'fr', name: 'Vysoká' },
    { value: 'fr', name: 'Kritická' },
];

let selectedState = "us"
let state = [
    { value: 'us', name: 'Nový' },
    { value: 'ca', name: 'V řešení' },
    { value: 'fr', name: 'Vyřešen' },
    { value: 'fr', name: 'Neplatný' },
];

let test

</script>

<div>
    <Modal title="Založení nového požadavku" bind:open={requestModal} autoclose>
        <Label for="request-name" class="mb-2">Název požadavku</Label>
        <Input type="text" id="request-name" class="focus:border-blue-700 focus:ring-blue-700" placeholder="Zadejte název požadavku" required />
        <label for="request-description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Popis požadavku</label>
        <textarea bind:value={test} id="request-description" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Popište svůj požadavek"></textarea>
        <Label>
            Kategorie
            <Select class="mt-2 focus:border-blue-700 focus:ring-blue-700" items={categories} bind:value={selectedCategory} placeholder="Vyberte kategorii"/>
        </Label>
        <Label>
            Priorita
            <Select class="mt-2 focus:border-blue-700 focus:ring-blue-700" items={priority} bind:value={selectedPriority} placeholder="Vyberte prioritu"/>
        </Label>
        <Label>
            Stav
            <Select class="mt-2 focus:border-blue-700 focus:ring-blue-700" items={state} bind:value={selectedState} placeholder="Vyberte stav"/>
        </Label>
        <svelte:fragment slot="footer">
            <Button class="bg-[#2362a2] hover:bg-[#254e80] focus-within:ring-opacity-0" on:click={() => alert('Zadání požadavku')}>Zadat</Button>
        </svelte:fragment>
    </Modal>
    <Header ></Header>
    <div class="page-background">
        <div class="page-content mt-[25]">
            <div class="flex justify-between items-center p-4">
                <Button on:click={() => (requestModal = true)} size="sm" class="bg-[#2362a2] hover:bg-[#254e80] focus-within:ring-opacity-0"><CirclePlusSolid class="mr-1" size="sm" />Založit požadavek</Button>


                <div class="flex w-1/5">
                    <Search size="md" class="rounded-none py-2.5 focus:border-blue-700 focus:ring-blue-700 focus:ring-opacity-5" placeholder="Vyhledat požadavek" bind:value={searchTerm} />
                    <Button class="p-2.5 rounded-s-none bg-[#2362a2] hover:bg-[#254e80] focus-within:ring-opacity-0">
                        <SearchOutline class="w-5 h-5 " />
                    </Button>
                    </div>
            </div>
            <Table striped={true} class="xl:table-fixed w-full overflow-x-auto">
                <TableHead>
                    <TableHeadCell><div class="flex items-center">POŽADAVEK <ChevronDownOutline class="mr-1 hover:cursor-pointer ml-1" size="sm" /></div></TableHeadCell>
                    <TableHeadCell><div class="flex items-center">POPIS POŽADAVKU <ChevronDownOutline class="mr-1 hover:cursor-pointer ml-1" size="sm" /></div></TableHeadCell>
                    <TableHeadCell><div class="flex items-center">STAV <ChevronDownOutline class="mr-1 hover:cursor-pointer ml-1" size="sm" /></div></TableHeadCell>
                    <TableHeadCell><div class="flex items-center">KATEGORIE <ChevronDownOutline class="mr-1 hover:cursor-pointer ml-1" size="sm" /></div></TableHeadCell>
                    <TableHeadCell><div class="flex items-center">PRIORITA <ChevronDownOutline class="mr-1 hover:cursor-pointer ml-1" size="sm" /></div></TableHeadCell>
                    <TableHeadCell><div class="flex items-center">DATUM OHLÁŠENÍ <ChevronDownOutline class="mr-1 hover:cursor-pointer ml-1" size="sm" /></div></TableHeadCell>
                    <TableHeadCell><div class="flex items-center">PŘIŘAZENO KOMU <ChevronDownOutline class="mr-1 hover:cursor-pointer ml-1" size="sm" /></div></TableHeadCell>
                    <TableHeadCell><div class="flex items-center">DATUM DOKONČENÍ <ChevronDownOutline class="mr-1 hover:cursor-pointer ml-1" size="sm" /></div></TableHeadCell>
                </TableHead>
                <TableBody >
                    {#each filteredItems as request}
                    <TableBodyRow>
                        <TableBodyCell>{request.name}</TableBodyCell>
                        <TableBodyCell>{request.description}</TableBodyCell>
                        <TableBodyCell><p class={stateClass(request.state)}>{request.state}</p></TableBodyCell>
                        <TableBodyCell><p class={categoryClass(request.category)}>{request.category}</p></TableBodyCell>
                        <TableBodyCell><p class={priorityClass(request.priority)}>{request.priority}</p></TableBodyCell>
                        <TableBodyCell>{request.dateOfAnnouncement}</TableBodyCell>
                        <TableBodyCell>{request.assignedTo}</TableBodyCell>
                        <TableBodyCell>{request.dateOfCompletion}</TableBodyCell>
                    </TableBodyRow>
                    {/each}
                </TableBody>
            </Table>
        </div>
    </div>
</div>

<style>
    .custom-textarea:focus{
        --tw-ring-color: var(--ring-blue-700) !important;
        --tw-border-opacity: 1 !important;
        border-color: rgb(26 86 219 / var(--tw-border-opacity)) !important;
    }
    .page-background{
        background-color: #f1f1f1;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }
    .page-content{
        width: 98%;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        background-color: white;
        border-radius: 7px;
        height: 94vh;
    }
</style>
