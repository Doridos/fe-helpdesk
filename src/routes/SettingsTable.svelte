<script>
    import Header from "../lib/Header.svelte";
    import {parseJwt} from "../lib/utils.js";

    import {
        Alert,
        Button,
        Checkbox,
        Dropdown,
        DropdownDivider,
        DropdownItem,
        Label,
        Modal,
        MultiSelect,
        Search,
        Select,
        Spinner,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        Toast
    } from "flowbite-svelte";
    import {
        CheckCircleSolid,
        ChevronDownOutline,
        ChevronUpOutline,
        CloseCircleSolid,
        SearchOutline,
        UserAddSolid
    } from "flowbite-svelte-icons";
    import {onMount} from "svelte";
    import {navigate} from "svelte-routing";

    // Variable declarations
    let users = []
    let open = false
    let success = false
    let failure = false
    let userModal = false;
    let userNameAndSurname
    let userRole
    let userCategories = []
    let userToChangeUsername

    let searchTerm = ''

    let jwt = localStorage.getItem("jwt");

    /**
     * Function to send a POST request to get all employees from AD
     */
    function sendPostToGetAllEmployeesFromAD() {
        return fetch(import.meta.env.VITE_BE_URL + "/employees/add", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + `${jwt}`
            },
        })
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }

    /**
     * Function to send a PUT request to update an employee
     */
    function sendPutToUpdateEmployee() {
        return fetch(import.meta.env.VITE_BE_URL + "/employees/" + userToChangeUsername, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + `${jwt}`
            },
            body: JSON.stringify({
                "userRole": userRole,
                "categories": userCategories
            }),
        })
            .then(response => {
                return response.json();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    let categoriesEmpty = false

    /**
     * Function to validate the update employee form
     */
    function validateUpdateEmployee() {
        console.log(userCategories.length)
        console.log(userRole)
        if (userCategories.length < 1 && userRole === "SOLVER") {
            console.log("empty")
            categoriesEmpty = true
            return false
        }
        return true
    }

    /**
     * Function to update an employee
     */
    function updateEmployee() {

        if (!validateUpdateEmployee()) {
            console.log("250")
            return;
        }

        console.log(userRole)
        if (userRole === "EMPLOYEE" || userRole === "NON_ACTIVE") {
            userCategories = []
        }
        sendPutToUpdateEmployee().then((data) => {
            console.log(data)
            fetchEmployees()
            userModal = false
        })
    }

    /**
     * Function to fetch all employees
     */
    function fetchEmployees() {
        return fetch(import.meta.env.VITE_BE_URL + "/employees/all", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + `${jwt}`
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
                users = data.map(user => ({
                    ...user,
                    name: user.forename + ' ' + user.surname,
                    role: roleMapping[user.userRole],
                    categories: user.categories.map(category => categoryMapping[category])
                }));
                console.log(users);
                return users; // Return the requests
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    // Fetching employees when the component mounts
    onMount(() => {
        fetchEmployees().then(() => {

        });

    });


    // Role and category mappings
    const roleMapping = {
        "EMPLOYEE": "Běžný uživatel",
        "SOLVER": "Řešitel",
        "MANAGER": "Manažer",
        "ADMIN": "Admin",
        "NON_ACTIVE": "Neaktivní"
    };
    const categoryMapping = {
        'INTRANET': 'Intranet',
        'SOFTWARE': 'Software',
        'PROPERTY': 'Majetek',
        'HARDWARE': 'Hardware',
        'PERMISSION': 'Oprávnění',
        'OTHER': 'Jiné'
    }

    /**
     * Function to get employees from AD
     */
    function getEmployeesFromAd() {
        failure = false
        success = false
        open = true
        sendPostToGetAllEmployeesFromAD().then((data) => {
            console.log(data)
            open = false
            if (data === -1) {
                failure = true
            } else {
                success = true
            }
            fetchEmployees()
        });

    }


    /**
     * Function to set the current user
     */
    function setCurrentUser(username) {
        userModal = true
        categoriesEmpty = false
        userToChangeUsername = username
        let userToSet = users.find(user => user.username === username)
        userCategories = []
        userNameAndSurname = userToSet.name
        switch (userToSet.role) {
            case "Běžný uživatel":
                userRole = "EMPLOYEE"
                break
            case "Řešitel":
                userRole = "SOLVER"
                break
            case "Manažer":
                userRole = "MANAGER"
                break
            case "Admin":
                userRole = "ADMIN"
                break
            case "Neaktivní":
                userRole = "NON_ACTIVE"
                break
            default:
                userRole = "EMPLOYEE"
                break
        }
        userToSet.categories.forEach(category => {

                console.log(category)
                switch (category) {
                    case "Intranet":
                        userCategories.push('INTRANET')
                        break
                    case "Software":
                        userCategories.push('SOFTWARE')
                        break
                    case "Majetek":
                        userCategories.push('PROPERTY')
                        break
                    case "Hardware":
                        userCategories.push('HARDWARE')
                        break
                    case "Oprávnění":
                        userCategories.push('PERMISSION')
                        break
                    case "Jiné":
                        userCategories.push('OTHER')
                        break
                    default:
                        userCategories = []
                        break
                }
            }
        )

    }

    // Computed properties for filtered items and page items
    $: filteredItems = users.filter((user) => user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 && filtersByRole[user.role]);
    $: pageItems = filteredItems.slice((currentPage - 1) * itemsPerPage, (currentPage - 1) * itemsPerPage + itemsPerPage);


    /**
     * Function to get the CSS class for a role
     */
    function roleClass(state) {
        switch (state) {
            case 'Běžný uživatel':
                return 'bg-green-100 w-fit p-1 text-green-800 rounded';
            case 'Řešitel':
                return 'bg-yellow-300 w-fit p-1 text-yellow-800 rounded';
            case 'Manažer':
                return 'bg-red-200 w-fit p-1 text-red-800 rounded';
            case 'Admin':
                return 'bg-red-600 w-fit p-1 text-white rounded';
            default:
                return '';
        }
    }

    /**
     * Function to get the CSS class for a category
     */
    function categoryClass(state) {
        switch (state) {
            case 'Intranet':
                return 'mr-2 bg-red-800 w-fit p-1 text-white rounded';
            case 'Software':
                return 'mr-2 bg-blue-700 w-fit p-1 text-white rounded';
            case 'Majetek':
                return 'mr-2 bg-green-200 w-fit p-1 text-gray-900 rounded';
            case 'Hardware':
                return 'mr-2 bg-yellow-800 w-fit p-1 text-white rounded';
            case 'Oprávnění':
                return 'mr-2 bg-purple-800 w-fit p-1 text-purple-100 rounded';
            case 'Jiné':
                return 'mr-2 bg-pink-100 w-fit p-1 text-pink-800 rounded';
            default:
                return '';
        }
    }

    // Arrays for categories and roles
    let categories = [
        {value: 'INTRANET', name: 'Intranet'},
        {value: 'SOFTWARE', name: 'Software'},
        {value: 'PROPERTY', name: 'Majetek'},
        {value: 'HARDWARE', name: 'Hardware'},
        {value: 'PERMISSION', name: 'Oprávnění'},
        {value: 'OTHER', name: 'Jiné'}
    ];

    // Filters by role
    let role = [
        {value: 'EMPLOYEE', name: 'Běžný uživatel'},
        {value: 'SOLVER', name: 'Řešitel'},
        {value: 'MANAGER', name: 'Manažer'},
        {value: 'ADMIN', name: 'Admin'},
        {value: 'NON_ACTIVE', name: 'Neaktivní'}
    ];
    let filtersByRole = {
        "Běžný uživatel": true,
        "Řešitel": true,
        "Manažer": true,
        "Admin": true,
        "Neaktivní": true
    }

    let filterActive = false

    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 15;

    // Functions for pagination
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

    // Computed property for total pages
    $: totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    // Variables for sorting
    let sortDirection = 'asc';
    let sortBy = ''


    /**
     * Function to sort items
     */
    function sortItems() {
        console.log(sortBy)
        if (sortBy === 'id') {
            if (sortDirection === 'asc') {
                users = users.sort((a, b) => a[sortBy] - b[sortBy]);
            } else {
                users = users.sort((a, b) => b[sortBy] - a[sortBy]);
            }
        } else {
            if (sortDirection === 'asc') {
                users = users.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));

            } else {
                users = users.sort((a, b) => b[sortBy].localeCompare(a[sortBy]));
            }
        }
    }

    /**
     * Function to reset sort
     */
    function resetSort() {
        filterActive = false
        roleDropDownActive = false
        sortDirection = 'asc'
        sortBy = 'id'
        filterActive = false
        sortItems()
    }

    let roleDropDownActive = false

</script>

<div>

    <Modal class="h-1/2" title={userNameAndSurname} bind:open={userModal}>
        <div class="container">
            <!-- Main Section (2/3 width) -->
            <div class="main-section">
                <Label>
                    Role
                    <Select class="mt-2 mb-1 focus:border-blue-700 focus:ring-blue-700" items={role}
                            bind:value={userRole} placeholder="Vyberte roli"/>
                </Label>
                {#if userRole !== "EMPLOYEE" && userRole !== "NON_ACTIVE"}
                    <Label>
                        Kategorie
                        <MultiSelect class="mt-1 mb-64 focus:border-blue-700 focus:ring-blue-700" items={categories}
                                     bind:value={userCategories}/>
                    </Label>
                {/if}
            </div>
        </div>
        <svelte:fragment slot="footer">
            <Button class="bg-[#2362a2] hover:bg-[#254e80] focus-within:ring-opacity-0"
                    on:click={() => updateEmployee()}>Uložit
            </Button>
            {#if categoriesEmpty || (userRole === "SOLVER" && userCategories.length < 1)}
                <Alert color="red">
                    <CloseCircleSolid slot="icon" class="text-red-600" size="sm"/>
                    Pokud je uživatel řešitelem, musí mít přiřazenou alespoň jednu kategorii.
                </Alert>
            {/if}
        </svelte:fragment>

    </Modal>
    <Header></Header>

    <div class="page-background">
        {#if parseJwt(localStorage.getItem("jwt")).role === "ADMIN"}
            <div class="page-content mt-[25] overflow-x-auto">
                <div class="flex justify-between items-center p-4">
                    <div class="flex w-1/3">
                        <Button size="sm" class="bg-[#2362a2] hover:bg-[#254e80] focus-within:ring-opacity-0"
                                on:click={() => getEmployeesFromAd()}>
                            <UserAddSolid class="mr-1" size="sm"/>
                            Načíst uživatelé z Active directory
                        </Button>
                        {#if filterActive}
                            <Button on:click={resetSort} size="sm"
                                    class="ml-2 bg-transparent text-gray-600 hover:bg-transparent hover:text-gray-800 focus-within:ring-opacity-0">
                                <CloseCircleSolid class="mr-1" size="sm"/>
                                Zrušit řazení
                            </Button>
                        {/if}
                    </div>

                    <div class="flex w-1/4">
                        <Search size="md"
                                class="rounded-none py-2.5 focus:border-blue-700 focus:ring-blue-700 focus:ring-opacity-5"
                                placeholder="Vyhledat uživatele" bind:value={searchTerm}/>
                        <Button class="p-2.5 rounded-s-none bg-[#2362a2] hover:bg-[#254e80] focus-within:ring-opacity-0">
                            <SearchOutline class="w-5 h-5 "/>
                        </Button>
                    </div>
                </div>
                <Table striped={true} divClass="min-height" class="xl:table-fixed w-full h-1/2 overflow-x-auto">
                    <TableHead>
                        <TableHeadCell>
                            <div class="flex items-center">UŽIVATEL</div>
                        </TableHeadCell>
                        <TableHeadCell>
                            <div data-placement="right-end"
                                 class="{sortBy === 'role' ? 'text-orange-500' : ''} w-1/3 hover:cursor-pointer flex items-center"
                                 on:click={() => {roleDropDownActive = !roleDropDownActive
                    }}>ROLE

                                {#if !roleDropDownActive}
                                    <ChevronDownOutline class="mr-1 hover:cursor-pointer ml-1 " size="sm"/>
                                {:else}
                                    <ChevronUpOutline class="mr-1 hover:cursor-pointer ml-1" size="sm"/>
                                {/if}
                            </div>
                            <Dropdown>
                                <DropdownItem on:click={() => {
                                filterActive = true
                                sortBy = 'role';
                                sortDirection = 'asc'
                                sortItems()
                            }}>Vzestupně
                                </DropdownItem>
                                <DropdownItem on:click={() => {
                                //End chevron changes
                                filterActive = true
                                sortBy = 'role';
                                sortDirection = 'desc'
                            sortItems()
                        }}>Sestupně
                                </DropdownItem>
                                <DropdownDivider/>
                                <DropdownItem>
                                    <Checkbox bind:checked={filtersByRole["Běžný uživatel"]}>Běžný uživatel</Checkbox>
                                </DropdownItem>
                                <DropdownItem>
                                    <Checkbox bind:checked={filtersByRole.Řešitel}>Řešitel</Checkbox>
                                </DropdownItem>
                                <DropdownItem>
                                    <Checkbox bind:checked={filtersByRole.Manažer}>Manažer</Checkbox>
                                </DropdownItem>
                                <DropdownItem>
                                    <Checkbox bind:checked={filtersByRole.Admin}>Admin</Checkbox>
                                </DropdownItem>
                                <DropdownItem>
                                    <Checkbox bind:checked={filtersByRole.Neaktivní}>Neaktivní</Checkbox>
                                </DropdownItem>

                            </Dropdown>
                        </TableHeadCell>
                        <TableHeadCell>
                            <div class="flex items-center">Přiřazené kategorie</div>
                        </TableHeadCell>
                    </TableHead>
                    <TableBody>
                        {#each pageItems as person}
                            <TableBodyRow>
                                <TableBodyCell class="cursor-pointer" on:click={() => {
                               setCurrentUser(person.username)
                        }}>{person.name}</TableBodyCell>
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
                    {#each Array.from({length: totalPages}, (_, i) => i + 1) as page}
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
        {:else}
            <div class="page-content mt-[25]">
                <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                    <div class="mx-auto max-w-screen-sm text-center">
                        <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-red-600 dark:text-primary-500">
                            401</h1>
                        <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
                            Stala se chyba...</p>
                        <Button on:click={() => navigate("/requests")}
                                class="mt-1.5 bg-[#2362a2] hover:bg-[#254e80] focus-within:ring-opacity-0"
                                type="submit">Zpátky na domovskou stránku
                        </Button>
                    </div>
                </div>
            </div>
        {/if}
    </div>
    <Toast dismissable={false} bind:open position="top-left">
        <Spinner size="5" color="blue"/>
        Načítám uživatele z Active Directory.
    </Toast>
    {#if success}
        <Toast on:close={() => success = false} position="top-left" color="green">
            <CheckCircleSolid slot="icon" class="text-green-600" size="sm"/>
            Načtení proběhlo úspěšně.
        </Toast>
    {/if}
    {#if failure}
        <Toast on:close={() => failure = false} position="top-left" color="red">
            <CloseCircleSolid slot="icon" class="text-red-600" size="sm"/>
            Při načítání došlo k chybě.
        </Toast>
    {/if}
</div>

<style>
    .pointer:hover {
        cursor: pointer;
    }

    .pagination {
        display: flex;
        justify-content: center;
        list-style: none;
        padding: 0;
        margin-top: 25px;
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

    .page-background {
        background-color: #f1f1f1;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }

    .page-content {
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

    .min-height {
        min-height: 300px;
    }

    .comment-section {
        display: flex;
        flex: 1;
        flex-direction: column;
        border-left: 1px solid #ccc; /* Add border to separate main and comment sections */
        padding-left: 20px; /* Add padding for spacing */
    }
</style>
