<script>
import Header from "../lib/Header.svelte";
import {
    Button, Checkbox, Dropdown, DropdownDivider, DropdownItem, Input, Label,
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
    ArrowLeftToBracketOutline, ChevronDownOutline, ChevronUpOutline,
    CirclePlusOutline, CirclePlusSolid, CloseCircleOutline, CloseCircleSolid,
    SearchOutline,
    UserSolid
} from "flowbite-svelte-icons";
import {onMount} from "svelte";

let requestModal = false;

let comments = [
    { author: 'John Doe', time: '2 hours ago', content: 'This is a sample comment.' },
    { author: 'Jane Smith', time: '1 hour ago', content: 'Another sample comment.' },
    { author: 'Alice Johnson', time: '30 minutes ago', content: 'Yet another sample comment. Yet another sample comment. Yet another sample comment. Yet another sample comment.' },
    { author: 'Alice Johnson', time: '30 minutes ago', content: 'Yet another sample comment. Yet another sample comment. Yet another sample comment. Yet another sample comment.' },
    { author: 'Alice Johnson', time: '30 minutes ago', content: 'Yet another sample comment. Yet another sample comment. Yet another sample comment. Yet another sample comment.' }
];
let requests = []
onMount(() => {
    fetch(import.meta.env.VITE_BE_URL+"/request/all", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // This returns a promise
    })
    .then(data => {
        // Map the data right after it is received
        requests = data.map(request => ({
            ...request,
            requestState: stateMapping[request.requestState],
            requestCategory: categoryMapping[request.requestCategory],
            requestPriority: priorityMapping[request.requestPriority]
        }));
        console.log(requests);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
$: filteredItems = requests.filter((request) => request.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 && filtersByState[request.requestState] && filtersByCategory[request.requestCategory]
    && filtersByPriority[request.requestPriority]);
$: pageItems = filteredItems.slice((currentPage - 1) * itemsPerPage, (currentPage - 1) * itemsPerPage + itemsPerPage)
$: totalPages = Math.ceil(filteredItems.length / itemsPerPage);

let searchTerm = ''
// let requests = [
//     {
//         id: 1,
//         name: 'Výměna oznámení',
//         description: "Prosím o výměnu oznámení",
//         state: "Vyřešen",
//         category: "Intranet",
//         priority: "Nízká",
//         dateOfAnnouncement: "01.01.2024",
//         assignedBy: "Jiří Dobrý",
//         assignedTo: "Jan Novák",
//         dateOfCompletion: "12.02.2024"
//     },
//     {
//         id: 2,
//         name: "Problém s Teamsy",
//         description: "Nejde zapnout teams",
//         state: "Nový",
//         category: "Software",
//         priority: "Nízká",
//         dateOfAnnouncement: "02.01.2024",
//         assignedBy: "Jiří Dobrý",
//         assignedTo: "Jan Novák",
//         dateOfCompletion: "12.02.2024"
//     },
//     {
//         id: 3,
//         name: "Nabíječka na notebook",
//         description: "Nabíječka nenabíjí",
//         state: "Neplatný",
//         category: "Majetek",
//         priority: "Vysoká",
//         dateOfAnnouncement: "03.01.2024",
//         assignedBy: "Jiří Dobrý",
//         assignedTo: "Jan Novák",
//         dateOfCompletion: "12.02.2024"
//     },
//     {
//         id: 4,
//         name: "Rozbitý monitor",
//         description: "Nefunguje monitor",
//         state: "V řešení",
//         category: "Hardware",
//         priority: "Kritická",
//         dateOfAnnouncement: "04.01.2024",
//         assignedBy: "Jiří Dobrý",
//         assignedTo: "Jan Novák",
//         dateOfCompletion: "12.02.2024"
//     },
//     {
//         id: 5,
//         name: "Rozbitý monitor",
//         description: "Nefunguje monitor",
//         state: "V řešení",
//         category: "Hardware",
//         priority: "Kritická",
//         dateOfAnnouncement: "05.01.2024",
//         assignedBy: "Jiří Dobrý",
//         assignedTo: "Jan Novák",
//         dateOfCompletion: "12.02.2024"
//     },
//     {
//         id: 6,
//         name: "Přístup do emailu",
//         description: "Prosím o přístup",
//         state: "Neplatný",
//         category: "Intranet",
//         priority: "Kritická",
//         dateOfAnnouncement: "06.01.2024",
//         assignedBy: "Jiří Dobrý",
//         assignedTo: "Jan Novák",
//         dateOfCompletion: "12.02.2024"
//     },
//     {
//         id: 7,
//         name: "Přístup do emailu",
//         description: "Prosím o přístup",
//         state: "Neplatný",
//         category: "Intranet",
//         priority: "Kritická",
//         dateOfAnnouncement: "07.01.2024",
//         assignedBy: "Jiří Dobrý",
//         assignedTo: "Jan Novák",
//         dateOfCompletion: "12.02.2024"
//     },
//     {
//         id: 8,
//         name: "Rozbitý token",
//         description: "Nefunguje mi token",
//         state: "Neplatný",
//         category: "Jiné",
//         priority: "Nízká",
//         dateOfAnnouncement: "08.01.2024",
//         assignedBy: "Jiří Dobrý",
//         assignedTo: "Jan Novák",
//         dateOfCompletion: "12.02.2024"
//     },
//     {
//         id: 9,
//         name: "Rozbitý token",
//         description: "Nefunguje mi token",
//         state: "Neplatný",
//         category: "Jiné",
//         priority: "Nízká",
//         dateOfAnnouncement: "09.01.2024",
//         assignedBy: "Jiří Dobrý",
//         assignedTo: "Jan Novák",
//         dateOfCompletion: "12.02.2024"
//     },
// ];
//
// let solvers = [
//     { value: 'user1', name: 'Jan Novák' },
//     { value: 'user1', name: 'David Modrý' }
// ]

let requestName = ""
let requestDescription
let requestState
let requestCategory
let requestPriority
let requestAssignedBy
let requestAssignedTo
let requestDateOfAnnouncement
let requestDateOfCompletion
let solvers = []
function newRequest() {
    requestModal = true
    requestName = ""
    requestDescription = ""
    requestState = "New"
    requestCategory = ""
    requestPriority = ""
    requestAssignedBy = ""
    requestAssignedTo = ""
    requestDateOfAnnouncement = ""
    requestDateOfCompletion = ""
}
function setCurrentRequest(id){
    let requestToSet = requests.find(request => request.id === id)
    requestName = requestToSet.name
    requestDescription = requestToSet.description
    switch (requestToSet.category){
        case "Intranet":
            requestCategory = 'INTRANET'
            break
        case "Software":
            requestCategory = 'SOFTWARE'
            break
        case "Majetek":
            requestCategory = 'PROPERTY'
            break
        case "Hardware":
            requestCategory = 'HARDWARE'
            break
        case "Oprávnění":
            requestCategory = 'PERMISSION'
            break
        case "Jiné":
            requestCategory = 'OTHER'
            break
        default:
            requestCategory = 'INTRANET'
            break
    }
    //TODO napojit rešitele a detail požadavku
    fetch(import.meta.env.VITE_BE_URL+"/employees/"+requestCategory, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // This returns a promise
        })
        .then(data => {
            console.log(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    switch (requestToSet.priority){
        case "Nízká":
            requestPriority = 'Low'
            break
        case "Střední":
            requestPriority = 'Medium'
            break
        case "Vysoká":
            requestPriority = 'High'
            break
        case "Kritická":
            requestPriority = 'Critical'
            break
        default:
            requestPriority = 'Low'
            break
    }
    switch (requestToSet.state){
        case "Nový":
            requestState = 'New'
            break
        case "V řešení":
            requestState = 'In progress'
            break
        case "Vyřešen":
            requestState = 'Solved'
            break
        case "Neplatný":
            requestState = 'Invalid'
            break
        default:
            requestPriority = 'New'
            break
    }


    requestDateOfAnnouncement = requestToSet.dateOfAnnouncement
    requestDateOfCompletion = requestToSet.dateOfCompletion
    requestAssignedBy = requestToSet.assignedBy

    if (requestToSet.assignedTo = "Jan Novák"){
        requestAssignedTo = "user1"
    }

}


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
    { value: 'it', name: 'Intranet' },
    { value: 'sw', name: 'Software' },
    { value: 'pr', name: 'Majetek' },
    { value: 'hw', name: 'Hardware' },
    { value: 'rg', name: 'Oprávnění' },
    { value: 'ot', name: 'Jiné' }
];
let filtersByCategory = {
    "Intranet": true,
    "Software": true,
    "Majetek": true,
    "Hardware": true,
    "Oprávnění": true,
    "Jiné": true
}

let selectedPriority
let priority = [
    { value: 'Low', name: 'Nízká' },
    { value: 'Medium', name: 'Střední' },
    { value: 'High', name: 'Vysoká' },
    { value: 'Critical', name: 'Kritická' },
];
let filtersByPriority = {
    "Nízká": true,
    "Střední": true,
    "Vysoká": true,
    "Kritická": true,
}

let selectedState = "New"
let selectedTypeOfRequests
let state = [
    { value: 'New', name: 'Nový' },
    { value: 'In progress', name: 'V řešení' },
    { value: 'Solved', name: 'Vyřešen' },
    { value: 'Invalid', name: 'Neplatný' },
];
let filtersByState = {
    "Nový": true,
    "V řešení": true,
    "Vyřešen": true,
    "Neplatný": true,
}
const stateMapping = {
    "NEW": "Nový",
    "IN_PROGRESS": "V řešení",
    "SOLVED": "Vyřešen",
    "INVALID": "Neplatný"
};

const categoryMapping = {
    "INTRANET": "Intranet",
    "SOFTWARE": "Software",
    "PROPERTY": "Majetek",
    "HARDWARE": "Hardware",
    "PERMISSION": "Oprávnění",
    "OTHER": "Jiné"
};

const priorityMapping = {
    "LOW": "Nízká",
    "MEDIUM": "Střední",
    "HIGH": "Vysoká",
    "CRITICAL": "Kritická"
};


let typeOfRequests = [
    { value: 'us', name: 'Mé zadané požadavky' },
    { value: 'ca', name: 'Požadavky, které řeším' },
    { value: 'ba', name: 'Mé přiřazené kategorie' },
    { value: 'fr', name: 'Všechny požadavky' },
];

let test
let filterActive = false
let currentPage = 1;
const itemsPerPage = 10;

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
let sortDirection = 'asc';
let sortBy = 'id';
function sortItems() {
    if(sortBy === 'id'){
        if (sortDirection === 'asc') {
            requests = requests.sort((a, b) => a[sortBy] - b[sortBy]);
        } else {
            requests = requests.sort((a, b) => b[sortBy] - a[sortBy]);
        }
    }
    else {
        if (sortDirection === 'asc') {
            requests = requests.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
            console.log(requests)
        } else {
            requests = requests.sort((a, b) => b[sortBy].localeCompare(a[sortBy]));
            console.log(requests)
        }
    }
}


function resetSort(){
    filterActive = false
    stateDropdownActive = false
    categoryDropdownActive = false
    priorityDropdownActive = false
    idSort = false
    sortByIdAsc = true
    sortDirection = 'asc'
    sortBy = 'id'
    filterActive = false
    sortItems()
}

function formatDateAndTime(dateString) {
    let date = new Date(dateString);

    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based in JavaScript
    let year = date.getFullYear();

    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
}


let sortByIdAsc = true


let stateDropdownActive = false
let categoryDropdownActive = false
let priorityDropdownActive = false
let idSort = false
$: title = requestName ? requestName : "Založení nového požadavku";
</script>

<div>
    <Modal size="lg" {title} bind:open={requestModal} autoclose>
        <div class="container">
            <!-- Main Section (2/3 width) -->
        <div class="main-section">
            {#if requestName === ""}
            <Label for="request-name" class="mb-2">Název požadavku</Label>
            <Input type="text" id="request-name" class="mb-1 focus:border-blue-700 focus:ring-blue-700" placeholder="Zadejte název požadavku" required />
            {/if}
            <label for="request-description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Popis požadavku</label>
            <textarea bind:value={requestDescription} id="request-description" rows="4" class="mb-1 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Popište svůj požadavek"></textarea>
            <Label>
                Kategorie
                <Select class="mt-2 mb-1 focus:border-blue-700 focus:ring-blue-700" items={categories} bind:value={requestCategory} placeholder="Vyberte kategorii"/>
            </Label>
            <Label>
                Priorita
                <Select class="mt-2 mb-1 focus:border-blue-700 focus:ring-blue-700" items={priority} bind:value={requestPriority} placeholder="Vyberte prioritu"/>
            </Label>
            <Label>
                Stav
                <Select class="mt-2 mb-1 focus:border-blue-700 focus:ring-blue-700" items={state} bind:value={requestState} placeholder="Vyberte stav"/>
            </Label>
            {#if requestAssignedBy}
                <Label for="assigned-by" class="mb-2">Požadavek založil/a</Label>
                <Input type="text" id="assigned-by" class="mb-1 focus:border-blue-700 focus:ring-blue-700" disabled bind:value={requestAssignedBy}/>
            <Label>
                Přiřazený řešitel
                <Select class="mt-2 mb-1 focus:border-blue-700 focus:ring-blue-700" items={solvers} bind:value={requestAssignedTo} placeholder="Zvolte přiřazeného řešitele"/>
            </Label>
            <Label for="date-of-announcement" class="mb-2">Datum ohlášení</Label>
            <Input type="text" id="date-of-announcement" class="mb-1 focus:border-blue-700 focus:ring-blue-700" disabled bind:value={requestDateOfAnnouncement}/>
            <Label for="date-of-completion" class="mb-2">Datum dokončení</Label>
            <Input type="date" id="date-of-completion" class="mb-1 focus:border-blue-700 focus:ring-blue-700" bind:value={requestDateOfCompletion}/>
            {/if}
        </div>
            {#if requestAssignedBy}
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
            {/if}
        </div>
        <svelte:fragment slot="footer">
            {#if requestAssignedBy}
                <Button class="bg-[#2362a2] hover:bg-[#254e80] focus-within:ring-opacity-0" on:click={() => alert('Zadání požadavku')}>Změnit</Button>
            {:else}
                <Button class="bg-[#2362a2] hover:bg-[#254e80] focus-within:ring-opacity-0" on:click={() => alert('Zadání požadavku')}>Zadat</Button>
            {/if}
        </svelte:fragment>

    </Modal>
    <Header ></Header>
    <div class="page-background">
        <div class="page-content mt-[25]">
            <div class="flex justify-between items-center p-4">
                <div class="flex w-1/3">
                <Button on:click={newRequest} size="sm" class="bg-[#2362a2] hover:bg-[#254e80] focus-within:ring-opacity-0"><CirclePlusSolid class="mr-1" size="sm" />Založit požadavek</Button>
                {#if filterActive}
                <Button on:click={resetSort} size="sm" class="ml-2 bg-transparent text-gray-600 hover:bg-transparent hover:text-gray-800 focus-within:ring-opacity-0"><CloseCircleSolid class="mr-1" size="sm" />Zrušit řazení</Button>
                {/if}
                </div>

                <div class="flex w-1/3">
                    <Select class="w-1/2 focus:border-blue-700 focus:ring-blue-700 mr-3" items={typeOfRequests} bind:value={selectedTypeOfRequests} placeholder="Vyberte pohled"/>

                    <Search size="md" class="rounded-none py-2.5 focus:border-blue-700 focus:ring-blue-700 focus:ring-opacity-5" placeholder="Vyhledat požadavek" bind:value={searchTerm} />
                    <Button class="p-2.5 rounded-s-none bg-[#2362a2] hover:bg-[#254e80] focus-within:ring-opacity-0">
                        <SearchOutline class="w-5 h-5 " />
                    </Button>
                    </div>
            </div>
            <Table striped={true} divClass="min-height" class="xl:table-fixed w-full h-1/2 overflow-x-auto">
                <TableHead>
                    <TableHeadCell><div class="flex items-center">POŽADAVEK</div></TableHeadCell>
                    <TableHeadCell><div class="flex items-center">POPIS POŽADAVKU </div></TableHeadCell>
                    <TableHeadCell><div class="{sortBy === 'state' ? 'text-orange-500' : ''} flex items-center hover:cursor-pointer" on:click={() => {stateDropdownActive = !stateDropdownActive
                    }}>STAV
                        {#if !stateDropdownActive}
                        <ChevronDownOutline class="mr-1 hover:cursor-pointer ml-1 " size="sm" />
                        {:else}
                        <ChevronUpOutline class="mr-1 hover:cursor-pointer ml-1" size="sm" />
                        {/if}
                    </div>
                        <Dropdown>
                            <DropdownItem on:click={() => {
                                //Gui chevron changes
                                categoryDropdownActive = false
                                priorityDropdownActive = false
                                idSort = false
                                sortByIdAsc = true
                                //End chevron changes
                                filterActive = true
                                sortBy = 'state';
                                sortDirection = 'asc'
                                sortItems()
                            }}>Vzestupně</DropdownItem>
                            <DropdownItem on:click={() => {
                                 //Gui chevron changes
                                categoryDropdownActive = false
                                priorityDropdownActive = false
                                idSort = false
                                sortByIdAsc = true
                                //End chevron changes
                                filterActive = true
                                sortBy = 'state';
                                sortDirection = 'desc'
                            sortItems()
                        }}>Sestupně</DropdownItem>
                            <DropdownDivider />
                            <DropdownItem><Checkbox bind:checked={filtersByState.Nový}>Nový</Checkbox></DropdownItem>
                            <DropdownItem><Checkbox bind:checked={filtersByState.Neplatný}>Neplatný</Checkbox></DropdownItem>
                            <DropdownItem><Checkbox bind:checked={filtersByState["V řešení"]}>V řešení</Checkbox></DropdownItem>
                            <DropdownItem><Checkbox bind:checked={filtersByState.Vyřešen}>Vyřešen</Checkbox></DropdownItem>

                        </Dropdown></TableHeadCell>
                    <TableHeadCell><div class="{sortBy === 'category' ? 'text-orange-500' : ''} flex items-center hover:cursor-pointer" on:click={() => {categoryDropdownActive = !categoryDropdownActive}}>KATEGORIE
                        {#if !categoryDropdownActive}
                        <ChevronDownOutline class="mr-1 hover:cursor-pointer ml-1" size="sm" />
                        {:else}
                            <ChevronUpOutline class="mr-1 hover:cursor-pointer ml-1" size="sm" />
                        {/if}
                        </div>
                        <Dropdown>
                            <DropdownItem on:click={() => {
                                //Gui chevron changes
                                stateDropdownActive = false
                                priorityDropdownActive = false
                                idSort = false
                                sortByIdAsc = true
                                //End chevron changes
                                filterActive = true
                                sortBy = 'category';
                                sortDirection = 'asc'
                                sortItems()
                            }}>Vzestupně</DropdownItem>
                            <DropdownItem on:click={() => {
                                //Gui chevron changes
                                stateDropdownActive = false
                                priorityDropdownActive = false
                                idSort = false
                                sortByIdAsc = true
                                //End chevron changes
                                filterActive = true
                                sortBy = 'category';
                                sortDirection = 'desc'
                            sortItems()
                        }}>Sestupně</DropdownItem>
                            <DropdownDivider />
                            <DropdownItem><Checkbox bind:checked={filtersByCategory.Intranet}>Intranet</Checkbox></DropdownItem>
                            <DropdownItem><Checkbox bind:checked={filtersByCategory.Software}>Software</Checkbox></DropdownItem>
                            <DropdownItem><Checkbox bind:checked={filtersByCategory.Majetek}>Majetek</Checkbox></DropdownItem>
                            <DropdownItem><Checkbox bind:checked={filtersByCategory.Hardware}>Hardware</Checkbox></DropdownItem>
                            <DropdownItem><Checkbox bind:checked={filtersByCategory.Oprávnění}>Oprávnění</Checkbox></DropdownItem>
                            <DropdownItem><Checkbox bind:checked={filtersByCategory.Jiné}>Jiné</Checkbox></DropdownItem>

                        </Dropdown></TableHeadCell>
                    <TableHeadCell><div class="{sortBy === 'priority' ? 'text-orange-500' : ''} flex items-center hover:cursor-pointer" on:click={() => {priorityDropdownActive = !priorityDropdownActive}}>PRIORITA
                        {#if !priorityDropdownActive}
                            <ChevronDownOutline class="mr-1 hover:cursor-pointer ml-1" size="sm" />
                        {:else}
                            <ChevronUpOutline class="mr-1 hover:cursor-pointer ml-1" size="sm" />
                        {/if}
                        </div>
                        <Dropdown>
                            <DropdownItem on:click={() => {
                                //Gui chevron changes
                                stateDropdownActive = false
                                categoryDropdownActive = false
                                idSort = false
                                sortByIdAsc = true
                                //End chevron changes
                                filterActive = true
                                sortBy = 'priority';
                                sortDirection = 'asc'
                                sortItems()
                            }}>Vzestupně</DropdownItem>
                            <DropdownItem on:click={() => {
                                //Gui chevron changes
                                stateDropdownActive = false
                                categoryDropdownActive = false
                                idSort = false
                                sortByIdAsc = true
                                //End chevron changes
                                filterActive = true
                                sortBy = 'priority';
                                sortDirection = 'desc'
                            sortItems()
                        }}>Sestupně</DropdownItem>
                            <DropdownDivider />
                            <DropdownItem><Checkbox bind:checked={filtersByPriority.Nízká}>Nízká</Checkbox></DropdownItem>
                            <DropdownItem><Checkbox bind:checked={filtersByPriority.Střední}>Střední</Checkbox></DropdownItem>
                            <DropdownItem><Checkbox bind:checked={filtersByPriority.Vysoká}>Vysoká</Checkbox></DropdownItem>
                            <DropdownItem><Checkbox bind:checked={filtersByPriority.Kritická}>Kritická</Checkbox></DropdownItem>

                        </Dropdown></TableHeadCell>
                    <TableHeadCell><div class="{idSort ? 'text-orange-500' : ''} flex items-center hover:cursor-pointer" on:click={ () => {
                    filterActive = true
                    idSort = true
                    sortByIdAsc = !sortByIdAsc
                    sortBy = 'id'
                    sortByIdAsc ? sortDirection = "asc" : sortDirection = "desc"
                    sortItems()
                    }
                    }>DATUM OHLÁŠENÍ
                        {#if sortByIdAsc}
                        <ChevronDownOutline class="mr-1 hover:cursor-pointer ml-1 " size="sm" />
                    {:else}
                        <ChevronUpOutline class="mr-1 hover:cursor-pointer ml-1" size="sm" />
                    {/if}</div></TableHeadCell>
                    <TableHeadCell><div class="flex items-center">PŘIŘAZENO KOMU </div></TableHeadCell>
                    <TableHeadCell><div class="flex items-center">DATUM DOKONČENÍ </div></TableHeadCell>
                </TableHead>
                {#if pageItems.length !== 0}
                <TableBody >

                    {#each pageItems as request}
                    <TableBodyRow>
                        <TableBodyCell class="cursor-pointer" on:click={() => {
                               setCurrentRequest(request.id)
                               requestModal = true}}>{request.name}</TableBodyCell>
                        <TableBodyCell>{request.description}</TableBodyCell>
                        <TableBodyCell><p class={stateClass(request.requestState)}>{request.requestState}</p></TableBodyCell>
                        <TableBodyCell><p class={categoryClass(request.requestCategory)}>{request.requestCategory}</p></TableBodyCell>
                        <TableBodyCell><p class={priorityClass(request.requestPriority)}>{request.requestPriority}</p></TableBodyCell>
                        <TableBodyCell>{formatDateAndTime(request.dateOfAnnouncement)}</TableBodyCell>
                        <TableBodyCell>{request.assignedTo[0].forename + " " +request.assignedTo[0].surname}</TableBodyCell>
                        <TableBodyCell>{formatDateAndTime(request.dateOfCompletion)}</TableBodyCell>
                    </TableBodyRow>
                    {/each}
                </TableBody>
                    {:else }
                    <h2 class="ml-6">Nenašli jsme žádné požadavky</h2>
                    {/if}
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

    .min-height{
        min-height: 300px;
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
