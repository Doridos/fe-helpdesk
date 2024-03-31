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

let comments = [
    { author: 'John Doe', time: '2 hours ago', content: 'This is a sample comment.' },
    { author: 'Jane Smith', time: '1 hour ago', content: 'Another sample comment.' },
    { author: 'Alice Johnson', time: '30 minutes ago', content: 'Yet another sample comment. Yet another sample comment. Yet another sample comment. Yet another sample comment.' },
    { author: 'Alice Johnson', time: '30 minutes ago', content: 'Yet another sample comment. Yet another sample comment. Yet another sample comment. Yet another sample comment.' },
    { author: 'Alice Johnson', time: '30 minutes ago', content: 'Yet another sample comment. Yet another sample comment. Yet another sample comment. Yet another sample comment.' }
];

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
$: pageItems = filteredItems.slice((currentPage - 1) * itemsPerPage, (currentPage - 1) * itemsPerPage + itemsPerPage);

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
let selectedTypeOfRequests
let state = [
    { value: 'us', name: 'Nový' },
    { value: 'ca', name: 'V řešení' },
    { value: 'fr', name: 'Vyřešen' },
    { value: 'fr', name: 'Neplatný' },
];


let typeOfRequests = [
    { value: 'us', name: 'Mé zadané požadavky' },
    { value: 'ca', name: 'Požadavky, které řeším' },
    { value: 'fr', name: 'Všechny požadavky' },
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
        <div class="comment-section">
            <h3>Komentáře</h3>
            <!-- Display sample comments -->
            {#each comments as comment}
                <div class="comment">
                    <p class="author">{comment.author+" "}<span class="time"> {comment.time}</span> </p>
                    <p>{comment.content}</p>
                </div>
            {/each}
            <Textarea class="mt-auto" rows="1" placeholder="Napište komentář">
                <div slot="footer" class="flex items-center justify-between">
                  <Button class="bg-[#2362a2] hover:bg-[#254e80] focus-within:ring-opacity-0" type="submit">Odeslat komentář</Button>
                </div>
          </Textarea>
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
                <Button on:click={() => (requestModal = true)} size="sm" class="bg-[#2362a2] hover:bg-[#254e80] focus-within:ring-opacity-0"><CirclePlusSolid class="mr-1" size="sm" />Založit požadavek</Button>


                <div class="flex w-1/3">
                    <Select class="w-1/2 focus:border-blue-700 focus:ring-blue-700 mr-3" items={typeOfRequests} bind:value={selectedTypeOfRequests} placeholder="Vyberte pohled"/>

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
                    {#each pageItems as request}
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
