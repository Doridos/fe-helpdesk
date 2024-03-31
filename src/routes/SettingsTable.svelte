<script>
import Header from "../lib/Header.svelte";

import {
    Button, Input, Label,
    Modal, Pagination,
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
    SearchOutline, UserAddSolid,
    UserSolid
} from "flowbite-svelte-icons";

let requestModal = false;

let searchTerm = ''
const users = [
    {
        id: '1',
        name: 'Jan Novák',
        role: "Běžný uživatel",
        categories: ["Software", "Hardware"],
    },
    {
        id: '2',
        name: 'Daniela Němcová',
        role: "Manažer",
        categories: ["Majetek", "Oprávnění", "Jiné"],

    },
    {
        id: '3',
        name: 'Tereza Kučerová',
        role: "Admin",
        categories: ["Oprávnění", "Jiné"],
    },
    {
        id: '4',
        name: 'Daniel Procházka',
        role: "Řešitel",
        categories: ["Intranet", "Hardware"],

    },
    {
        id: '5',
        name: 'Michal Dvořák',
        role: "Řešitel",
        categories: ["Software", "Jiné"],

    }
];
$: filteredItems = users.filter((request) => request.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
$: pageItems = filteredItems.slice((currentPage - 1) * itemsPerPage, (currentPage - 1) * itemsPerPage + itemsPerPage);


function roleClass(state) {
    switch (state) {
        case 'Běžný uživatel': return 'bg-green-100 w-fit p-1 text-green-800 rounded';
        case 'Řešitel': return 'bg-yellow-300 w-fit p-1 text-yellow-800 rounded';
        case 'Manažer':    return 'bg-red-200 w-fit p-1 text-red-800 rounded';
        case 'Admin':    return 'bg-red-600 w-fit p-1 text-white rounded';
        default:        return '';
    }
}

function categoryClass(state) {
    switch (state) {
        case 'Intranet': return 'ml-2 bg-red-800 w-fit p-1 text-white rounded';
        case 'Software': return 'ml-2 bg-blue-700 w-fit p-1 text-white rounded';
        case 'Majetek':    return 'ml-2 bg-green-200 w-fit p-1 text-gray-900 rounded';
        case 'Hardware':    return 'ml-2 bg-yellow-800 w-fit p-1 text-white rounded';
        case 'Oprávnění':    return 'ml-2 bg-purple-800 w-fit p-1 text-purple-100 rounded';
        case 'Jiné':    return 'ml-2 bg-pink-100 w-fit p-1 text-pink-800 rounded';
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
let selectedTypeOfRequests
let state = [
    { value: 'us', name: 'Nový' },
    { value: 'ca', name: 'V řešení' },
    { value: 'fr', name: 'Vyřešen' },
    { value: 'fr', name: 'Neplatný' },
];



let test

let currentPage = 1;
const itemsPerPage = 3;

function setPage(page) {
    currentPage = page;
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
    }
}



$: totalPages = Math.ceil(filteredItems.length / itemsPerPage);
</script>

<div>
    <Modal size="lg" title="Založení nového požadavku" bind:open={requestModal} autoclose>
        <div class="container">
            <!-- Main Section (2/3 width) -->
        <div class="main-section">
            <Label for="request-name" class="mb-2">Název požadavku</Label>
            <Input type="text" id="request-name" class="mb-1 focus:border-blue-700 focus:ring-blue-700" placeholder="Zadejte název požadavku" required />
            <label for="request-description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Popis požadavku</label>
            <textarea bind:value={test} id="request-description" rows="4" class="mb-1 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Popište svůj požadavek"></textarea>
            <Label>
                Kategorie
                <Select class="mt-2 mb-1 focus:border-blue-700 focus:ring-blue-700" items={categories} bind:value={selectedCategory} placeholder="Vyberte kategorii"/>
            </Label>
            <Label>
                Priorita
                <Select class="mt-2 mb-1 focus:border-blue-700 focus:ring-blue-700" items={priority} bind:value={selectedPriority} placeholder="Vyberte prioritu"/>
            </Label>
            <Label>
                Stav
                <Select class="mt-2 mb-1 focus:border-blue-700 focus:ring-blue-700" items={state} bind:value={selectedState} placeholder="Vyberte stav"/>
            </Label>
        </div>
        </div>
        <svelte:fragment slot="footer">
            <Button class="bg-[#2362a2] hover:bg-[#254e80] focus-within:ring-opacity-0" on:click={() => alert('Zadání požadavku')}>Zadat</Button>
        </svelte:fragment>

    </Modal>
    <Header ></Header>
    <div class="page-background">
        <div class="page-content mt-[25]">
            <div class="flex justify-between items-center p-4">
                <Button size="sm" class="bg-[#2362a2] hover:bg-[#254e80] focus-within:ring-opacity-0"><UserAddSolid class="mr-1" size="sm" />Načíst uživatelé z Active directory</Button>


                <div class="flex w-1/4">
                    <Search size="md" class="rounded-none py-2.5 focus:border-blue-700 focus:ring-blue-700 focus:ring-opacity-5" placeholder="Vyhledat uživatele" bind:value={searchTerm} />
                    <Button class="p-2.5 rounded-s-none bg-[#2362a2] hover:bg-[#254e80] focus-within:ring-opacity-0">
                        <SearchOutline class="w-5 h-5 " />
                    </Button>
                    </div>
            </div>
            <Table striped={true} class="xl:table-fixed w-full overflow-x-auto">
                <TableHead>
                    <TableHeadCell><div class="flex items-center">UŽIVATEL <ChevronDownOutline class="mr-1 hover:cursor-pointer ml-1" size="sm" /></div></TableHeadCell>
                    <TableHeadCell><div class="flex items-center">ROLE <ChevronDownOutline class="mr-1 hover:cursor-pointer ml-1" size="sm" /></div></TableHeadCell>
                    <TableHeadCell><div class="flex items-center">Přiřazené kategorie <ChevronDownOutline class="mr-1 hover:cursor-pointer ml-1" size="sm" /></div></TableHeadCell>
                </TableHead>
                <TableBody >
                    {#each pageItems as person}
                    <TableBodyRow>
                        <TableBodyCell class="cursor-pointer" on:click={() => (requestModal = true)}>{person.name}</TableBodyCell>
                        <TableBodyCell><p class={roleClass(person.role)}>{person.role}</p></TableBodyCell>
                        <TableBodyCell>
                            {#each person.categories as category}
                                <span class={categoryClass(category)}>{category}</span>
                            {/each}
                                </TableBodyCell>

                    </TableBodyRow>
                    {/each}
                </TableBody>
            </Table>
            <div class="pagination">
                <button on:click={prevPage}>Zpět</button>
                {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
                    <button
                            class:active={currentPage === page}
                            on:click={() => setPage(page)}
                    >
                        {page}
                    </button>
                {/each}
                <button on:click={nextPage}>Další</button>
            </div>
        </div>
    </div>
</div>

<style>
    .pointer:hover{
        cursor: pointer;
    }

    .pagination {
        display: flex;
        justify-content: center;
        list-style: none;
        padding: 0;
        margin-top: 20px;
    }

    .pagination li {
        margin: 0 5px;
    }

    .pagination button {
        padding: 5px 10px;
        border: 1px solid #ccc;
        background-color: #fff;
        cursor: pointer;
    }

    .pagination button.active {
        background-color: #c0c0c0;
    }
    .pagination button:hover {
        background-color: #ececec;
    }

    .pagination button:first-child {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }

    .pagination button:last-child {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
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

    .comment {
        margin-bottom: 10px;
        font-size: 15px;
    }

    .author {
        font-size: 15px;
        font-weight: bold;
    }

    .time {
        font-size: 0.7em;
        color: #888;
    }

    .container {
        display: flex;
        flex-direction: row;
    }

    .main-section {
        flex: 2;
        padding-right: 20px; /* Add padding for spacing */
    }

    .comment-section {
        display: flex;
        flex: 1;
        flex-direction: column;
        border-left: 1px solid #ccc; /* Add border to separate main and comment sections */
        padding-left: 20px; /* Add padding for spacing */
    }
</style>
